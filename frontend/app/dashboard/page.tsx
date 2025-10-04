"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Search, Calendar as CalendarIcon, BarChart3 } from "lucide-react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// ---- Config / thresholds ----
const THRESHOLDS = {
  veryHotC: 35,
  veryColdC: 0,
  veryWindyMs: 10,
  veryWetMm: 20,
  uncomfortableTempC: 30,
  uncomfortableRH: 70,
};

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const GM_LIBS: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

// ---- LocationInput ----
function LocationInput({ onSelect }: { onSelect: (location: { name: string; lat: number; lng: number }) => void }) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({ debounce: 300 });

  const handleSelect = async (description: string) => {
    try {
      setValue(description, false);
      clearSuggestions();
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);
      onSelect({ name: description, lat, lng });
    } catch (err) {
      console.error("Geocode failed", err);
      alert("Could not find that location. Please try selecting another suggestion.");
    }
  };

  
  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          value={value}
          disabled={!ready}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter any location"
          className="pl-10 py-6 placeholder:font-mono placeholder:uppercase rounded-none border-2 border-black"
        />
      </div>

      {status === "OK" && (
        <div className="absolute bg-white border shadow-md mt-1 w-full z-50 max-h-60 overflow-auto">
          {(data || []).map((s: any) => (
            <button
              key={s.place_id}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-black"
              onClick={() => handleSelect(s.description)}
            >
              {s.description}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Simple DatePicker Component ----
function formatDateDisplay(date: Date | undefined) {
  if (!date) {
    return ""
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long", 
    year: "numeric",
  })
}

function SimpleDatePicker({ selectedDate, onDateChange }: { selectedDate: string, onDateChange: (date: string) => void }) {
  const [displayValue, setDisplayValue] = React.useState("")

  React.useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate)
      setDisplayValue(formatDateDisplay(date))
    } else {
      setDisplayValue("")
    }
  }, [selectedDate])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    onDateChange(dateValue)
    
    if (dateValue) {
      const date = new Date(dateValue)
      setDisplayValue(formatDateDisplay(date))
    } else {
      setDisplayValue("")
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-sm font-medium font-lexend">Date</label>
      <div className="relative">
        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          max="2026-12-31"
          className="pl-10 py-6 rounded-none border-2 border-black"
        />
      </div>
      {displayValue && (
        <div className="text-sm text-gray-600 pl-1">
          Selected: <span className="font-medium">{displayValue}</span>
        </div>
      )}
    </div>
  )
}

// ---- Helpers ----
const getMonthDay = (isoDate: string) => {
  if (!isoDate) return null;
  const [y, m, d] = isoDate.split("-");
  return { month: parseInt(m, 10), day: parseInt(d, 10) };
};

const extractMonthDayFromKey = (dateStr: string) => ({
  month: parseInt(dateStr.slice(4, 6), 10),
  day: parseInt(dateStr.slice(6, 8), 10),
});

const formatKeyToDDMMYYYY = (key: string) => {
  if (!key || key.length !== 8) return key;
  return `${key.slice(6, 8)}/${key.slice(4, 6)}/${key.slice(0, 4)}`;
};

// ---- Main Dashboard ----
export default function Dashboard() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<{ name: string | null; lat: number | null; lng: number | null }>({
    name: null,
    lat: null,
    lng: null,
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<null | {
    yearsSampled: number;
    counts: { veryHot: number; veryCold: number; veryWindy: number; veryWet: number; veryUncomfortable: number };
    probabilities: { veryHot: number; veryCold: number; veryWindy: number; veryWet: number; veryUncomfortable: number };
  }>(null);

  const [samplesTable, setSamplesTable] = useState<
    Array<{ year: string; date: string; tmax: number | null; tmin: number | null; rain: number | null; wind: number | null; rh: number | null }>
  >([]);

  const mapRef = useRef<google.maps.Map | null>(null);
  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);
  const panToLocation = (lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(6);
    }
  };

  const handleLocationSelect = (loc: { name: string; lat: number; lng: number }) => {
    setSelectedLocation(loc);
    panToLocation(loc.lat, loc.lng);
  };

  // ---- Fetch NASA Data ----
  const handleSubmit = async () => {
    if (!selectedDate) return alert("Please select a date.");
    if (!selectedLocation.lat || !selectedLocation.lng) return alert("Please choose a location first.");

    setLoading(true);
    setResults(null);
    setSamplesTable([]);

    try {
      const start = "19810101";
      const today = new Date();
      const end = today.toISOString().slice(0, 10).replace(/-/g, "");
      const params = ["T2M_MAX", "T2M_MIN", "PRECTOTCORR", "WS10M", "RH2M"].join(",");
      const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=${params}&community=AG&longitude=${selectedLocation.lng}&latitude=${selectedLocation.lat}&start=${start}&end=${end}&format=JSON`;

      const resp = await fetch(url);
      if (!resp.ok) throw new Error("NASA POWER API request failed.");
      const data = await resp.json();

      const { T2M_MAX = {}, T2M_MIN = {}, PRECTOTCORR = {}, WS10M = {}, RH2M = {} } = data.properties.parameter;
      const allKeys = Array.from(new Set([...Object.keys(T2M_MAX), ...Object.keys(T2M_MIN), ...Object.keys(PRECTOTCORR), ...Object.keys(WS10M), ...Object.keys(RH2M)])).sort();

      const md = getMonthDay(selectedDate);
      if (!md) throw new Error("Couldn't parse selected date.");
      const { month: targetMonth, day: targetDay } = md;

      const matchingKeys = allKeys.filter((k) => {
        const { month, day } = extractMonthDayFromKey(k);
        return month === targetMonth && day === targetDay;
      });

      const samples = matchingKeys.map((k) => ({
        key: k,
        date: formatKeyToDDMMYYYY(k),
        year: k.slice(0, 4),
        tmax: (T2M_MAX as any)[k] ?? null,
        tmin: (T2M_MIN as any)[k] ?? null,
        rain: (PRECTOTCORR as any)[k] ?? null,
        wind: (WS10M as any)[k] ?? null,
        rh: (RH2M as any)[k] ?? null,
      }));

      console.log(`Found ${matchingKeys.length} matching dates for ${targetMonth}/${targetDay}`);
      console.log(`Thresholds:`, THRESHOLDS);
      console.log(`First few samples:`, samples.slice(0, 5));

      let validYears = 0;
      const counts = { veryHot: 0, veryCold: 0, veryWindy: 0, veryWet: 0, veryUncomfortable: 0 };

      samples.forEach(({ tmax, tmin, wind, rain, rh }) => {
        // Skip only if ALL values are null
        if ([tmax, tmin, wind, rain, rh].every((v) => v === null)) return;
        validYears++;
        
        // Debug logging
        console.log(`Year sample: tmax=${tmax}, tmin=${tmin}, wind=${wind}, rain=${rain}, rh=${rh}`);
        
        // Check each condition with null safety
        if (tmax !== null && tmax >= THRESHOLDS.veryHotC) {
          counts.veryHot++;
          console.log(`Very hot detected: ${tmax}°C >= ${THRESHOLDS.veryHotC}°C`);
        }
        if (tmin !== null && tmin <= THRESHOLDS.veryColdC) {
          counts.veryCold++;
          console.log(`Very cold detected: ${tmin}°C <= ${THRESHOLDS.veryColdC}°C`);
        }
        if (wind !== null && wind >= THRESHOLDS.veryWindyMs) {
          counts.veryWindy++;
          console.log(`Very windy detected: ${wind}m/s >= ${THRESHOLDS.veryWindyMs}m/s`);
        }
        if (rain !== null && rain >= THRESHOLDS.veryWetMm) {
          counts.veryWet++;
          console.log(`Very wet detected: ${rain}mm >= ${THRESHOLDS.veryWetMm}mm`);
        }
        if (tmax !== null && rh !== null && tmax >= THRESHOLDS.uncomfortableTempC && rh >= THRESHOLDS.uncomfortableRH) {
          counts.veryUncomfortable++;
          console.log(`Very uncomfortable detected: ${tmax}°C >= ${THRESHOLDS.uncomfortableTempC}°C AND ${rh}% >= ${THRESHOLDS.uncomfortableRH}%`);
        }
      });

      console.log(`Final counts:`, counts);
      console.log(`Valid years: ${validYears}`);

      const probabilities = {
        veryHot: validYears ? counts.veryHot / validYears : 0,
        veryCold: validYears ? counts.veryCold / validYears : 0,
        veryWindy: validYears ? counts.veryWindy / validYears : 0,
        veryWet: validYears ? counts.veryWet / validYears : 0,
        veryUncomfortable: validYears ? counts.veryUncomfortable / validYears : 0,
      };

      console.log(`Calculated probabilities:`, probabilities);

      const resultsData = { yearsSampled: validYears, counts, probabilities };
      setResults(resultsData);

      const weatherAnalysisData = {
        location: selectedLocation.name || "Unknown Location",
        coordinates: `${selectedLocation.lat?.toFixed(4)}, ${selectedLocation.lng?.toFixed(4)}`,
        date: selectedDate,
        yearsSampled: validYears,
        probabilities,
        counts,
        historicalData: samples,
        thresholds: THRESHOLDS,
      };

      const encodedData = encodeURIComponent(JSON.stringify(weatherAnalysisData));
      router.push(`/dashboard/results?data=${encodedData}`);
    } catch (err) {
      console.error(err);
      alert("Error fetching data — see console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
        libraries={GM_LIBS}
        loadingElement={
          <div className="fixed inset-0 flex items-center justify-center bg-white">
            <DotLottieReact
              src="https://lottie.host/68ba4118-65bc-424e-9b99-2143126eee69/elDPj1guZy.lottie"
              loop
              autoplay
              className="w-56 h-56"
            />
          </div>
        }
      >
        <div className="h-screen flex flex-col lg:flex-row relative">
          {/* Left: Inputs */}
          <div className={`w-full mt-20 lg:w-1/2 flex flex-col justify-start px-8 py-8 gap-6 bg-white ${loading ? "opacity-30" : "opacity-100"}`}>
            <h1 className="text-3xl font-exo font-bold">Weather Probability Checker</h1>
            <p className="text-gray-700 max-w-lg">
              Choose a location and a future date. We'll fetch NASA POWER historical daily data and compute probabilities for that location.
            </p>

            <div>
              <label className="block text-sm font-medium mb-2 font-lexend">Location</label>
              <LocationInput onSelect={handleLocationSelect} />
              <div className="text-sm text-gray-600 mt-2">
                Selected:{" "}
                {selectedLocation.name ? (
                  <>
                    <strong>{selectedLocation.name}</strong> • {selectedLocation.lat?.toFixed(4)}, {selectedLocation.lng?.toFixed(4)}
                  </>
                ) : (
                  "None"
                )}
              </div>
            </div>

            <SimpleDatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />

            <div className="flex gap-3">
              <Button onClick={handleSubmit} className="bg-black text-white px-6 py-3" disabled={loading}>
                {loading ? "Analyzing..." : <><BarChart3 className="w-4 h-4 mr-2" />Analyze</>}
              </Button>
              <Button
                onClick={() => {
                  setSelectedDate("");
                  setSelectedLocation({ name: null, lat: null, lng: null });
                  setResults(null);
                  setSamplesTable([]);
                }}
                variant="ghost"
                className="px-6 py-3"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Right: Map */}
          <div className={`w-full lg:w-1/2 h-[50vh] lg:h-screen ${loading ? "opacity-30" : "opacity-100"}`}>
            <GoogleMap
              key={`${selectedLocation.lat ?? 0}-${selectedLocation.lng ?? 0}`}
              center={{
                lat: selectedLocation.lat ?? 30.3753,
                lng: selectedLocation.lng ?? 69.3451,
              }}
              zoom={selectedLocation.lat ? 8 : 4}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              onLoad={handleMapLoad}
            >
              {selectedLocation.lat && selectedLocation.lng && <Marker position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }} />}
            </GoogleMap>
          </div>
        </div>

        {/* Centered Lottie Animation for Loading */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <DotLottieReact
              src="https://lottie.host/68ba4118-65bc-424e-9b99-2143126eee69/elDPj1guZy.lottie"
              loop
              autoplay
              className="w-56 h-56"
            />
          </div>
        )}
      </LoadScript>
      <Footer />
    </>
  );
}
