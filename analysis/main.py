from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import requests
import pandas as pd
import numpy as np
from datetime import datetime
from scipy.stats import linregress

# -----------------------
# CONFIG
# -----------------------
POWER_BASE = "https://power.larc.nasa.gov/api/temporal/daily/point"

# -----------------------
# APP
# -----------------------
app = FastAPI(title="Weather Probability (NASA POWER)")

# Allow CORS from localhost:3000 (Next dev). Adjust origins for production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# Pydantic query model
# -----------------------
class Query(BaseModel):
    latitude: float = Field(..., description="Latitude in decimal degrees")
    longitude: float = Field(..., description="Longitude in decimal degrees")
    variable: str = Field(..., description="NASA POWER parameter, e.g., T2M_MAX")
    month: int = Field(..., ge=1, le=12)
    day: int = Field(..., ge=1, le=31)
    threshold: float = Field(..., description="Threshold value (same units as parameter)")
    operator: str = Field(">", pattern="^(>|<)$", description="Use '>' or '<'")
    start_year: int = Field(1990, description="Start year inclusive")
    end_year: int = Field(datetime.utcnow().year - 1, description="End year inclusive")
    window: int = Field(3, description="Window in days around the selected date (±window)")
    community: str = Field("AG", description="POWER community: AG, SB, etc.")

# -----------------------
# Utility functions
# -----------------------
def fetch_power(lat: float, lon: float, var: str, start_yr: int, end_yr: int, community: str = "AG") -> pd.DataFrame:
    start = f"{start_yr}0101"
    end = f"{end_yr}1231"
    params = {
        "parameters": var,
        "community": community,
        "longitude": lon,
        "latitude": lat,
        "start": start,
        "end": end,
        "format": "JSON",
    }
    r = requests.get(POWER_BASE, params=params, timeout=60)
    if r.status_code != 200:
        raise HTTPException(status_code=502, detail=f"POWER API error: {r.status_code}")
    j = r.json()
    try:
        param_obj = j["properties"]["parameter"][var]
    except Exception:
        raise HTTPException(status_code=500, detail="Unexpected POWER response structure or parameter not found.")

    dates = pd.to_datetime(list(param_obj.keys()), format="%Y%m%d")
    values = list(param_obj.values())
    df = pd.DataFrame({var: values}, index=dates)
    df.index.name = "date"
    return df

def select_day_window(df: pd.DataFrame, month: int, day: int, window: int) -> pd.DataFrame:
    keep = []
    for d in df.index:
        min_abs = None
        for k in (-1, 0, 1):
            yr = d.year + k
            try:
                ref = pd.Timestamp(year=yr, month=month, day=day)
            except ValueError:
                ref = pd.Timestamp(year=yr, month=month, day=min(day, 28))
            diff = abs((d - ref).days)
            if (min_abs is None) or (diff < min_abs):
                min_abs = diff
        keep.append(min_abs is not None and min_abs <= window)
    return df.loc[keep]

def wilson_ci(k: int, n: int, z: float = 1.96):
    if n == 0:
        return (None, None)
    phat = k / n
    denom = 1 + z * z / n
    center = phat + z * z / (2 * n)
    adj = z * np.sqrt(phat * (1 - phat) / n + z * z / (4 * n * n))
    lower = (center - adj) / denom
    upper = (center + adj) / denom
    return (max(0.0, lower), min(1.0, upper))

# -----------------------
# Safe casting for JSON
# -----------------------
def safe_cast(obj):
    if obj is None:
        return None
    if isinstance(obj, (np.floating, np.float32, np.float64)):
        if np.isnan(obj) or np.isinf(obj):
            return None
        return float(obj)
    if isinstance(obj, (np.integer, np.int32, np.int64)):
        return int(obj)
    if isinstance(obj, (pd.Timestamp, datetime)):
        return str(obj)
    if isinstance(obj, dict):
        return {str(k): safe_cast(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [safe_cast(v) for v in obj]
    return obj

# -----------------------
# Endpoint
# -----------------------
@app.post("/api/probability")
def compute_probability(q: Query):
    if q.operator not in (">", "<"):
        raise HTTPException(status_code=400, detail="Operator must be '>' or '<'")

    df = fetch_power(q.latitude, q.longitude, q.variable, q.start_year, q.end_year, q.community)
    df_sub = select_day_window(df, q.month, q.day, q.window)
    series = df_sub[q.variable].dropna()
    n = int(len(series))
    if n == 0:
        raise HTTPException(status_code=400, detail="No data in selected window. Try increasing the window or year range.")

    if q.operator == ">":
        k = int((series > q.threshold).sum())
    else:
        k = int((series < q.threshold).sum())

    p = float(k / n) if n > 0 else 0.0
    ci_lower, ci_upper = wilson_ci(k, n)

    # Yearly fractions for trend analysis
    df_sub2 = df_sub.copy()
    df_sub2["year"] = df_sub2.index.year
    if q.operator == ">":
        df_sub2["exceed"] = (df_sub2[q.variable] > q.threshold).astype(float)
    else:
        df_sub2["exceed"] = (df_sub2[q.variable] < q.threshold).astype(float)

    yearly = df_sub2.groupby("year")["exceed"].mean().reset_index()
    trend = None
    if len(yearly) >= 2 and yearly["exceed"].notna().any():
        lr = linregress(yearly["year"].astype(float), yearly["exceed"].astype(float))
        trend = {
            "slope_per_year": safe_cast(lr.slope),
            "p_value": safe_cast(lr.pvalue),
            "r_value": safe_cast(lr.rvalue),
            "intercept": safe_cast(lr.intercept),
        }

    # Percentiles safely
    percentiles = series.quantile([0.1, 0.25, 0.5, 0.75, 0.9])
    percentiles_dict = {}
    for pct, val in percentiles.items():
        val_safe = safe_cast(val)
        if val_safe is not None:
            percentiles_dict[str(int(pct*100))] = val_safe

    stats: Dict[str, Any] = {
        "n": safe_cast(n),
        "k": safe_cast(k),
        "probability": safe_cast(p),
        "ci_95": [safe_cast(ci_lower), safe_cast(ci_upper)],
        "mean": safe_cast(series.mean()),
        "median": safe_cast(series.median()),
        "percentiles": percentiles_dict,
        "trend": safe_cast(trend),
        "variable": q.variable,
        "threshold": safe_cast(q.threshold),
        "operator": q.operator,
    }

    return safe_cast(stats)
