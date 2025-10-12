"use client"

import { useState, useEffect, Suspense } from "react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import {
  Download,
  Share2,
  ArrowLeft,
  FileText,
  FileJson,
  FileSpreadsheet,
  TrendingUp,
  Calendar,
  MapPin,
  ThermometerSun,
  Snowflake,
  Wind,
  CloudRain,
  Droplets,
} from "lucide-react"
import jsPDF from "jspdf"
import "jspdf-autotable"
import dynamic from "next/dynamic"
import { ProgressBar } from "@/components/ProgressBar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend } from "@/components/ui/chart"
// Dynamic import for client-side only component
const WeatherChatAssistant = dynamic(
  () => import("@/components/WeatherChatAssistant").then((mod) => ({ default: mod.WeatherChatAssistant })),
  {
    ssr: false,
    loading: () => null,
  },
)

// Types
interface WeatherData {
  location: string
  coordinates: string
  date: string
  yearsSampled: number
  probabilities: {
    veryHot: number
    veryCold: number
    veryWindy: number
    veryWet: number
    veryUncomfortable: number
  }
  counts: {
    veryHot: number
    veryCold: number
    veryWindy: number
    veryWet: number
    veryUncomfortable: number
  }
  historicalData: Array<{
    year: string
    date: string
    tmax: number | null
    tmin: number | null
    rain: number | null
    wind: number | null
    rh: number | null
  }>
  thresholds: {
    veryHotC: number
    veryColdC: number
    veryWindyMs: number
    veryWetMm: number
    uncomfortableTempC: number
    uncomfortableRH: number
  }
}

// Chart Colors
const CHART_COLORS = {
  veryHot: "#ef4444",
  veryCold: "#3b82f6",
  veryWindy: "#6b7280",
  veryWet: "#06b6d4",
  veryUncomfortable: "#f59e0b",
}

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const dataParam = searchParams?.get("data")
      if (dataParam) {
        const decodedData = JSON.parse(decodeURIComponent(dataParam))
        setWeatherData(decodedData)
      }
    } catch (error) {
      console.error("Error parsing weather data:", error)
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  // Export functions
  const exportToCSV = () => {
    if (!weatherData) return

    // Create analysis summary CSV
    const analysisData = [
      ["Weather Analysis Report"],
      ["Location", weatherData.location],
      ["Coordinates", weatherData.coordinates],
      ["Analysis Date", weatherData.date],
      ["Years of Historical Data", weatherData.yearsSampled.toString()],
      ["Data Period", "1981-2025"],
      [""],
      ["Weather Condition Probabilities"],
      ["Condition", "Probability (%)", "Risk Level", "Historical Occurrences", "Recommendation"],
      [
        "Very Hot (≥35°C)",
        (weatherData.probabilities.veryHot * 100).toFixed(1),
        weatherData.probabilities.veryHot >= 0.3
          ? "High"
          : weatherData.probabilities.veryHot >= 0.15
            ? "Medium"
            : "Low",
        `${weatherData.counts.veryHot} times`,
        weatherData.probabilities.veryHot >= 0.2
          ? "Consider indoor alternatives or early morning events"
          : "Generally safe for outdoor activities",
      ],
      [
        "Very Cold (≤0°C)",
        (weatherData.probabilities.veryCold * 100).toFixed(1),
        weatherData.probabilities.veryCold >= 0.3
          ? "High"
          : weatherData.probabilities.veryCold >= 0.15
            ? "Medium"
            : "Low",
        `${weatherData.counts.veryCold} times`,
        weatherData.probabilities.veryCold >= 0.2 ? "Plan for heating and warm clothing" : "Cold weather unlikely",
      ],
      [
        "Very Windy (≥10 m/s)",
        (weatherData.probabilities.veryWindy * 100).toFixed(1),
        weatherData.probabilities.veryWindy >= 0.3
          ? "High"
          : weatherData.probabilities.veryWindy >= 0.15
            ? "Medium"
            : "Low",
        `${weatherData.counts.veryWindy} times`,
        weatherData.probabilities.veryWindy >= 0.2
          ? "Secure outdoor equipment and decorations"
          : "Wind conditions should be manageable",
      ],
      [
        "Very Wet (≥20mm)",
        (weatherData.probabilities.veryWet * 100).toFixed(1),
        weatherData.probabilities.veryWet >= 0.3
          ? "High"
          : weatherData.probabilities.veryWet >= 0.15
            ? "Medium"
            : "Low",
        `${weatherData.counts.veryWet} times`,
        weatherData.probabilities.veryWet >= 0.2 ? "Have indoor backup plans ready" : "Rain unlikely to be an issue",
      ],
      [
        "Very Uncomfortable (≥30°C & ≥70% RH)",
        (weatherData.probabilities.veryUncomfortable * 100).toFixed(1),
        weatherData.probabilities.veryUncomfortable >= 0.3
          ? "High"
          : weatherData.probabilities.veryUncomfortable >= 0.15
            ? "Medium"
            : "Low",
        `${weatherData.counts.veryUncomfortable} times`,
        weatherData.probabilities.veryUncomfortable >= 0.2
          ? "Provide shade and ventilation options"
          : "Comfort levels should be acceptable",
      ],
      [""],
      ["Summary Statistics"],
      [
        "Total Extreme Weather Events",
        Object.values(weatherData.counts)
          .reduce((a, b) => a + b, 0)
          .toString(),
      ],
      [
        "Highest Risk Condition",
        Object.entries(weatherData.probabilities)
          .reduce((a, b) =>
            weatherData.probabilities[a[0] as keyof typeof weatherData.probabilities] >
            weatherData.probabilities[b[0] as keyof typeof weatherData.probabilities]
              ? a
              : b,
          )[0]
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
      ],
      [
        "Overall Risk Assessment",
        Math.max(...Object.values(weatherData.probabilities)) >= 0.3
          ? "High Risk - Plan Alternatives"
          : Math.max(...Object.values(weatherData.probabilities)) >= 0.15
            ? "Medium Risk - Monitor Conditions"
            : "Low Risk - Proceed with Confidence",
      ],
    ]

    const csv = analysisData.map((row) => row.join(",")).join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `weather-report-${weatherData.location.replace(/[^a-zA-Z0-9]/g, "-")}-${weatherData.date}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportToJSON = () => {
    if (!weatherData) return

    const reportData = {
      analysisInfo: {
        reportTitle: "Weather Probability Analysis Report",
        location: weatherData.location,
        coordinates: weatherData.coordinates,
        analysisDate: weatherData.date,
        dataSource: "NASA POWER API",
        dataPeriod: "1981-2025",
        yearsAnalyzed: weatherData.yearsSampled,
        generatedOn: new Date().toISOString().split("T")[0],
      },
      probabilityAnalysis: {
        veryHot: {
          probability: Math.round(weatherData.probabilities.veryHot * 1000) / 10,
          probabilityPercent: `${(weatherData.probabilities.veryHot * 100).toFixed(1)}%`,
          historicalOccurrences: weatherData.counts.veryHot,
          riskLevel:
            weatherData.probabilities.veryHot >= 0.3
              ? "High"
              : weatherData.probabilities.veryHot >= 0.15
                ? "Medium"
                : "Low",
          threshold: "≥35°C",
          recommendation:
            weatherData.probabilities.veryHot >= 0.2
              ? "Consider indoor alternatives or early morning events"
              : "Generally safe for outdoor activities",
        },
        veryCold: {
          probability: Math.round(weatherData.probabilities.veryCold * 1000) / 10,
          probabilityPercent: `${(weatherData.probabilities.veryCold * 100).toFixed(1)}%`,
          historicalOccurrences: weatherData.counts.veryCold,
          riskLevel:
            weatherData.probabilities.veryCold >= 0.3
              ? "High"
              : weatherData.probabilities.veryCold >= 0.15
                ? "Medium"
                : "Low",
          threshold: "≤0°C",
          recommendation:
            weatherData.probabilities.veryCold >= 0.2 ? "Plan for heating and warm clothing" : "Cold weather unlikely",
        },
        veryWindy: {
          probability: Math.round(weatherData.probabilities.veryWindy * 1000) / 10,
          probabilityPercent: `${(weatherData.probabilities.veryWindy * 100).toFixed(1)}%`,
          historicalOccurrences: weatherData.counts.veryWindy,
          riskLevel:
            weatherData.probabilities.veryWindy >= 0.3
              ? "High"
              : weatherData.probabilities.veryWindy >= 0.15
                ? "Medium"
                : "Low",
          threshold: "≥10 m/s",
          recommendation:
            weatherData.probabilities.veryWindy >= 0.2
              ? "Secure outdoor equipment and decorations"
              : "Wind conditions should be manageable",
        },
        veryWet: {
          probability: Math.round(weatherData.probabilities.veryWet * 1000) / 10,
          probabilityPercent: `${(weatherData.probabilities.veryWet * 100).toFixed(1)}%`,
          historicalOccurrences: weatherData.counts.veryWet,
          riskLevel:
            weatherData.probabilities.veryWet >= 0.3
              ? "High"
              : weatherData.probabilities.veryWet >= 0.15
                ? "Medium"
                : "Low",
          threshold: "≥20mm",
          recommendation:
            weatherData.probabilities.veryWet >= 0.2
              ? "Have indoor backup plans ready"
              : "Rain unlikely to be an issue",
        },
        veryUncomfortable: {
          probability: Math.round(weatherData.probabilities.veryUncomfortable * 1000) / 10,
          probabilityPercent: `${(weatherData.probabilities.veryUncomfortable * 100).toFixed(1)}%`,
          historicalOccurrences: weatherData.counts.veryUncomfortable,
          riskLevel:
            weatherData.probabilities.veryUncomfortable >= 0.3
              ? "High"
              : weatherData.probabilities.veryUncomfortable >= 0.15
                ? "Medium"
                : "Low",
          threshold: "≥30°C & ≥70% RH",
          recommendation:
            weatherData.probabilities.veryUncomfortable >= 0.2
              ? "Provide shade and ventilation options"
              : "Comfort levels should be acceptable",
        },
      },
      summaryStatistics: {
        totalExtremeEvents: Object.values(weatherData.counts).reduce((a, b) => a + b, 0),
        highestRiskCondition: Object.entries(weatherData.probabilities)
          .reduce((a, b) =>
            weatherData.probabilities[a[0] as keyof typeof weatherData.probabilities] >
            weatherData.probabilities[b[0] as keyof typeof weatherData.probabilities]
              ? a
              : b,
          )[0]
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        overallRiskAssessment:
          Math.max(...Object.values(weatherData.probabilities)) >= 0.3
            ? "High Risk - Plan Alternatives"
            : Math.max(...Object.values(weatherData.probabilities)) >= 0.15
              ? "Medium Risk - Monitor Conditions"
              : "Low Risk - Proceed with Confidence",
      },
    }

    const json = JSON.stringify(reportData, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `weather-report-${weatherData.location.replace(/[^a-zA-Z0-9]/g, "-")}-${weatherData.date}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportToPDF = () => {
    if (!weatherData) return

    const doc = new jsPDF()

    // Header
    doc.setFontSize(24)
    doc.setTextColor(44, 62, 80)
    doc.text("Weather Probability Report", 20, 25)

    // Subtitle
    doc.setFontSize(14)
    doc.setTextColor(127, 140, 141)
    doc.text("NASA POWER Data Analysis", 20, 35)

    // Location and Date Info
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`📍 Location: ${weatherData.location}`, 20, 55)
    doc.text(`📌 Coordinates: ${weatherData.coordinates}`, 20, 65)
    doc.text(`📅 Analysis Date: ${weatherData.date}`, 20, 75)
    doc.text(`📊 Data Period: 1981-2025 (${weatherData.yearsSampled} years analyzed)`, 20, 85)
    doc.text(`🗓️ Report Generated: ${new Date().toLocaleDateString()}`, 20, 95)

    // Probabilities Section
    doc.setFontSize(16)
    doc.setTextColor(44, 62, 80)
    doc.text("Weather Condition Analysis", 20, 115)

    const probData = [
      ["Weather Condition", "Probability", "Risk Level", "Recommendation"],
      [
        "Very Hot (≥35°C)",
        `${(weatherData.probabilities.veryHot * 100).toFixed(1)}%`,
        weatherData.probabilities.veryHot >= 0.3
          ? "High"
          : weatherData.probabilities.veryHot >= 0.15
            ? "Medium"
            : "Low",
        weatherData.probabilities.veryHot >= 0.2 ? "Consider indoor alternatives" : "Safe for outdoor activities",
      ],
      [
        "Very Cold (≤0°C)",
        `${(weatherData.probabilities.veryCold * 100).toFixed(1)}%`,
        weatherData.probabilities.veryCold >= 0.3
          ? "High"
          : weatherData.probabilities.veryCold >= 0.15
            ? "Medium"
            : "Low",
        weatherData.probabilities.veryCold >= 0.2 ? "Plan for heating solutions" : "Cold weather unlikely",
      ],
      [
        "Very Windy (≥10 m/s)",
        `${(weatherData.probabilities.veryWindy * 100).toFixed(1)}%`,
        weatherData.probabilities.veryWindy >= 0.3
          ? "High"
          : weatherData.probabilities.veryWindy >= 0.15
            ? "Medium"
            : "Low",
        weatherData.probabilities.veryWindy >= 0.2 ? "Secure outdoor equipment" : "Wind manageable",
      ],
      [
        "Very Wet (≥20mm)",
        `${(weatherData.probabilities.veryWet * 100).toFixed(1)}%`,
        weatherData.probabilities.veryWet >= 0.3
          ? "High"
          : weatherData.probabilities.veryWet >= 0.15
            ? "Medium"
            : "Low",
        weatherData.probabilities.veryWet >= 0.2 ? "Prepare backup plans" : "Rain unlikely",
      ],
      [
        "Very Uncomfortable",
        `${(weatherData.probabilities.veryUncomfortable * 100).toFixed(1)}%`,
        weatherData.probabilities.veryUncomfortable >= 0.3
          ? "High"
          : weatherData.probabilities.veryUncomfortable >= 0.15
            ? "Medium"
            : "Low",
        weatherData.probabilities.veryUncomfortable >= 0.2 ? "Provide shade & ventilation" : "Comfort acceptable",
      ],
    ]
    ;(doc as any).autoTable({
      startY: 125,
      head: [probData[0]],
      body: probData.slice(1),
      theme: "striped",
      headStyles: { fillColor: [52, 73, 94], textColor: 255 },
      styles: { fontSize: 10 },
    })

    // Summary Section
    const currentY = (doc as any).lastAutoTable.finalY + 20
    doc.setFontSize(16)
    doc.setTextColor(44, 62, 80)
    doc.text("Executive Summary", 20, currentY)

    const summaryData = [
      ["Metric", "Value"],
      [
        "Total Extreme Weather Events",
        Object.values(weatherData.counts)
          .reduce((a, b) => a + b, 0)
          .toString(),
      ],
      [
        "Highest Risk Condition",
        Object.entries(weatherData.probabilities)
          .reduce((a, b) =>
            weatherData.probabilities[a[0] as keyof typeof weatherData.probabilities] >
            weatherData.probabilities[b[0] as keyof typeof weatherData.probabilities]
              ? a
              : b,
          )[0]
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
      ],
      [
        "Overall Risk Assessment",
        Math.max(...Object.values(weatherData.probabilities)) >= 0.3
          ? "High Risk - Plan Alternatives"
          : Math.max(...Object.values(weatherData.probabilities)) >= 0.15
            ? "Medium Risk - Monitor Conditions"
            : "Low Risk - Proceed with Confidence",
      ],
    ]
    ;(doc as any).autoTable({
      startY: currentY + 10,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: "grid",
      headStyles: { fillColor: [46, 125, 50], textColor: 255 },
      styles: { fontSize: 11 },
    })

    // Footer
    const pageHeight = doc.internal.pageSize.height
    doc.setFontSize(8)
    doc.setTextColor(127, 140, 141)
    doc.text("Generated by NASA Weather Probability App | Data Source: NASA POWER API", 20, pageHeight - 10)

    doc.save(`weather-report-${weatherData.location.replace(/[^a-zA-Z0-9]/g, "-")}-${weatherData.date}.pdf`)
  }

  const exportRawData = () => {
    if (!weatherData) return

    // Create raw NASA POWER data export for the specific query
    const rawDataExport = {
      queryInfo: {
        title: "NASA POWER Raw Data Export",
        description: "Historical weather data subset for specific location and date",
        location: weatherData.location,
        coordinates: weatherData.coordinates,
        queryDate: weatherData.date,
        dataSource: "NASA POWER API - Prediction of Worldwide Energy Resources",
        apiEndpoint: "https://power.larc.nasa.gov/api/temporal/daily/point",
        parameters: [
          "T2M_MAX - Temperature at 2 Meters Maximum (°C)",
          "T2M_MIN - Temperature at 2 Meters Minimum (°C)",
          "PRECTOTCORR - Precipitation Corrected (mm/day)",
          "WS10M - Wind Speed at 10 Meters (m/s)",
          "RH2M - Relative Humidity at 2 Meters (%)",
        ],
        dataPeriod: "1981-2025",
        exportedOn: new Date().toISOString(),
        monthDayFilter: `All ${weatherData.date.split("-")[1]}/${weatherData.date.split("-")[2]} dates across years`,
      },
      metadata: {
        totalRecords: weatherData.historicalData.length,
        validRecords: weatherData.yearsSampled,
        missingDataHandling: "Records with null values are preserved for transparency",
        coordinatesUsed: weatherData.coordinates,
        thresholds: weatherData.thresholds,
      },
      historicalData: weatherData.historicalData.map((record) => ({
        year: Number.parseInt(record.year),
        date: record.date,
        julianDay:
          Math.floor(
            (new Date(`${record.year}-${weatherData.date.split("-")[1]}-${weatherData.date.split("-")[2]}`).getTime() -
              new Date(`${record.year}-01-01`).getTime()) /
              (1000 * 60 * 60 * 24),
          ) + 1,
        weatherParameters: {
          maxTemperature_C: record.tmax,
          minTemperature_C: record.tmin,
          precipitation_mm: record.rain,
          windSpeed_ms: record.wind,
          relativeHumidity_percent: record.rh,
        },
        qualityFlags: {
          hasValidTemp: record.tmax !== null && record.tmin !== null,
          hasValidPrecip: record.rain !== null,
          hasValidWind: record.wind !== null,
          hasValidHumidity: record.rh !== null,
          completeRecord:
            record.tmax !== null &&
            record.tmin !== null &&
            record.rain !== null &&
            record.wind !== null &&
            record.rh !== null,
        },
        extremeEventFlags: {
          veryHot: record.tmax !== null ? record.tmax >= weatherData.thresholds.veryHotC : false,
          veryCold: record.tmin !== null ? record.tmin <= weatherData.thresholds.veryColdC : false,
          veryWindy: record.wind !== null ? record.wind >= weatherData.thresholds.veryWindyMs : false,
          veryWet: record.rain !== null ? record.rain >= weatherData.thresholds.veryWetMm : false,
          veryUncomfortable:
            record.tmax !== null && record.rh !== null
              ? record.tmax >= weatherData.thresholds.uncomfortableTempC &&
                record.rh >= weatherData.thresholds.uncomfortableRH
              : false,
        },
      })),
      statisticalSummary: {
        temperatureStats: {
          maxTemp: {
            mean:
              weatherData.historicalData.filter((d) => d.tmax !== null).reduce((sum, d) => sum + (d.tmax || 0), 0) /
                weatherData.historicalData.filter((d) => d.tmax !== null).length || 0,
            min: Math.min(...weatherData.historicalData.filter((d) => d.tmax !== null).map((d) => d.tmax || 0)),
            max: Math.max(...weatherData.historicalData.filter((d) => d.tmax !== null).map((d) => d.tmax || 0)),
          },
          minTemp: {
            mean:
              weatherData.historicalData.filter((d) => d.tmin !== null).reduce((sum, d) => sum + (d.tmin || 0), 0) /
                weatherData.historicalData.filter((d) => d.tmin !== null).length || 0,
            min: Math.min(...weatherData.historicalData.filter((d) => d.tmin !== null).map((d) => d.tmin || 0)),
            max: Math.max(...weatherData.historicalData.filter((d) => d.tmin !== null).map((d) => d.tmin || 0)),
          },
        },
        precipitationStats: {
          mean:
            weatherData.historicalData.filter((d) => d.rain !== null).reduce((sum, d) => sum + (d.rain || 0), 0) /
              weatherData.historicalData.filter((d) => d.rain !== null).length || 0,
          totalDaysWithRain: weatherData.historicalData.filter((d) => d.rain !== null && d.rain > 0).length,
          maxSingleDay: Math.max(...weatherData.historicalData.filter((d) => d.rain !== null).map((d) => d.rain || 0)),
        },
        dataQuality: {
          completenessPercentage: (weatherData.yearsSampled / weatherData.historicalData.length) * 100,
          missingDataYears: weatherData.historicalData
            .filter((d) => d.tmax === null && d.tmin === null && d.rain === null && d.wind === null && d.rh === null)
            .map((d) => d.year),
        },
      },
    }

    const json = JSON.stringify(rawDataExport, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `nasa-power-raw-data-${weatherData.location.replace(/[^a-zA-Z0-9]/g, "-")}-${weatherData.date}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = async () => {
    // Check if we're in the browser
    if (typeof window === "undefined") return

    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Weather Analysis for ${weatherData?.location}`,
          text: `Check out this weather probability analysis for ${weatherData?.location} on ${weatherData?.date}`,
          url: url,
        })
      } catch (error) {
        console.log("Error sharing:", error)
        copyToClipboard(url)
      }
    } else {
      copyToClipboard(url)
    }
  }

  const copyToClipboard = (text: string) => {
    // Check if we're in the browser
    if (typeof window === "undefined" || !navigator.clipboard) {
      console.log("Clipboard not available")
      return
    }

    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Link copied to clipboard!")
      })
      .catch((error) => {
        console.error("Failed to copy to clipboard:", error)
      })
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <DotLottieReact
          src="https://lottie.host/68ba4118-65bc-424e-9b99-2143126eee69/elDPj1guZy.lottie"
          loop
          autoplay
          className="w-56 h-56"
        />
      </div>
    )
  }

  if (!weatherData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">No Results Found</h1>
          <p className="text-muted-foreground mb-6">Unable to load weather analysis results.</p>
          <Button onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const probabilityData = [
    {
      name: "Very Hot",
      percentage: weatherData.probabilities.veryHot * 100,
      count: weatherData.counts.veryHot,
      color: CHART_COLORS.veryHot,
    },
    {
      name: "Very Cold",
      percentage: weatherData.probabilities.veryCold * 100,
      count: weatherData.counts.veryCold,
      color: CHART_COLORS.veryCold,
    },
    {
      name: "Very Windy",
      percentage: weatherData.probabilities.veryWindy * 100,
      count: weatherData.counts.veryWindy,
      color: CHART_COLORS.veryWindy,
    },
    {
      name: "Very Wet",
      percentage: weatherData.probabilities.veryWet * 100,
      count: weatherData.counts.veryWet,
      color: CHART_COLORS.veryWet,
    },
    {
      name: "Uncomfortable",
      percentage: weatherData.probabilities.veryUncomfortable * 100,
      count: weatherData.counts.veryUncomfortable,
      color: CHART_COLORS.veryUncomfortable,
    },
  ]

  // Historical trend data with proper filtering and null handling
  const rawTrendData = weatherData.historicalData
    .filter((d) => d.tmax !== null && d.tmin !== null && d.rain !== null && d.wind !== null)
    .map((d) => ({
      year: Number.parseInt(d.year),
      tmax: Number(d.tmax),
      tmin: Number(d.tmin),
      rain: Number(d.rain),
      wind: Number(d.wind),
      rh: d.rh ? Number(d.rh) : null,
    }))
    .sort((a, b) => a.year - b.year)

  // Group by 5-year periods for better trend visualization if we have many data points
  const trendData =
    rawTrendData.length > 20
      ? rawTrendData
          .reduce((acc: any[], curr, index) => {
            const groupIndex = Math.floor(index / 5)
            if (!acc[groupIndex]) {
              acc[groupIndex] = {
                year: curr.year,
                tmax: [],
                tmin: [],
                rain: [],
                wind: [],
                count: 0,
              }
            }
            acc[groupIndex].tmax.push(curr.tmax)
            acc[groupIndex].tmin.push(curr.tmin)
            acc[groupIndex].rain.push(curr.rain)
            acc[groupIndex].wind.push(curr.wind)
            acc[groupIndex].count++
            return acc
          }, [])
          .map((group) => ({
            year: group.year,
            tmax: group.tmax.reduce((a: number, b: number) => a + b, 0) / group.tmax.length,
            tmin: group.tmin.reduce((a: number, b: number) => a + b, 0) / group.tmin.length,
            rain: group.rain.reduce((a: number, b: number) => a + b, 0) / group.rain.length,
            wind: group.wind.reduce((a: number, b: number) => a + b, 0) / group.wind.length,
          }))
      : rawTrendData

  // (removed) console.log("Trend Data Sample:", trendData.slice(0, 5))
  // (removed) console.log("Trend Data Length:", trendData.length)
  // (removed) console.log("Temperature Range:", { ... })

  return (
    <>
      {/* main wrapper uses semantic tokens instead of gradient background */}
      <div className="min-h-screen bg-blue-50">
        {/* Header Section */}
        <div className="pt-24 pb-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold font-exo text-foreground mb-2 text-balance">Weather Analysis Results</h1>
                {/* unify header meta text color with tokens */}
                <div className="flex text-xs sm:text-sm flex-wrap items-center gap-4 text-muted-foreground font-lexend">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{weatherData.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{weatherData.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-mono">{weatherData.yearsSampled}</span> <span>years of data</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                <Button onClick={() => router.push("/dashboard")} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={shareResults} variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>Analysis Reports</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={exportToCSV}>
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Export CSV Report
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportToJSON}>
                      <FileJson className="w-4 h-4 mr-2" />
                      Export JSON Report
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportToPDF}>
                      <FileText className="w-4 h-4 mr-2" />
                      Export PDF Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Summary Statistics Section */}
            {/* tokenized card/container styles for summary section */}
            <div className="rounded-xl bg-blue-100 p-6 border shadow-sm mb-8">
              <h2 className="text-2xl font-semibold font-exo text-foreground mb-4">Probability Analysis Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-white border-2 shadow-inner inset-2 border-blue-300">
                  <div className="text-3xl font-bold font-mono text-foreground">{weatherData.yearsSampled}</div>
                  <div className="text-sm text-muted-foreground font-lexend">Years of Historical Data</div>
                  <div className="text-xs text-muted-foreground font-lexend mt-1">1981 - 2025</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white border-2 shadow-inner inset-2 border-blue-300">
                  <div className="text-3xl font-bold font-mono text-foreground">
                    {Math.max(...Object.values(weatherData.probabilities)).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground font-lexend">Highest Probability</div>
                  <div className="text-xs text-muted-foreground font-lexend mt-1">
                    {Object.entries(weatherData.probabilities)
                      .reduce((a, b) =>
                        weatherData.probabilities[a[0] as keyof typeof weatherData.probabilities] >
                        weatherData.probabilities[b[0] as keyof typeof weatherData.probabilities]
                          ? a
                          : b,
                      )[0]
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </div>
                </div>
                <div className="text-center p-4 rounded-lg bg-white border-2 shadow-inner inset-2 border-blue-300">
                  <div className="text-3xl font-mono font-bold text-foreground">
                    {Object.values(weatherData.counts).reduce((a, b) => a + b, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground font-lexend">Total Extreme Events</div>
                  <div className="text-xs text-muted-foreground font-lexend mt-1">Across all categories</div>
                </div>
              </div>
            </div>

            {/* Stable Weather Message - Show when all probabilities are 0% */}
            {Object.values(weatherData.probabilities).every(prob => prob === 0) && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-8 border border-green-200 dark:border-green-800 shadow-sm mb-8">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                      <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold font-exo text-green-800 dark:text-green-200 mb-2">
                    Excellent Weather Conditions Expected! 🌤️
                  </h3>
                  <p className="text-lg font-lexend text-green-700 dark:text-green-300 mb-4">
                    The weather is predicted to be stable and comfortable for your planned date.
                  </p>
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 max-w-2xl mx-auto">
                    <p className="text-green-800 dark:text-green-200 text-sm font-lexend">
                      <strong>Based on <span className="font-mono">{weatherData.yearsSampled}</span> years of historical data</strong>, there's a <span className="font-mono">0%</span> probability of extreme weather conditions (very hot, very cold, very windy, very wet, or uncomfortably humid weather) on this date. This makes it an ideal time for outdoor events and activities.
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-lexend bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                      ✓ Temperature: Comfortable
                    </span>
                    <span className="inline-flex items-
                    center px-3 py-1 rounded-full text-xs font-medium font-lexend bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                      ✓ Wind: Calm
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-lexend bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                      ✓ Rain: Unlikely
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-lexend bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                      ✓ Humidity: Pleasant
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Bars Section (Responsive Flexbox Layout) */}
<div className="flex flex-wrap justify-center gap-6 mb-8">
  <div className="flex-1 min-w-[250px] sm:min-w-[280px] md:min-w-[300px] lg:min-w-[200px] xl:min-w-[180px] max-w-[250px]">
    <ProgressBar
      label="Very Hot"
      percentage={weatherData.probabilities.veryHot}
      color="bg-red-500"
      icon={ThermometerSun}
      count={weatherData.counts.veryHot}
      total={weatherData.yearsSampled}
    />
  </div>

  <div className="flex-1 min-w-[250px] sm:min-w-[280px] md:min-w-[300px] lg:min-w-[200px] xl:min-w-[180px] max-w-[250px]">
    <ProgressBar
      label="Very Cold"
      percentage={weatherData.probabilities.veryCold}
      color="bg-blue-500"
      icon={Snowflake}
      count={weatherData.counts.veryCold}
      total={weatherData.yearsSampled}
    />
  </div>

  <div className="flex-1 min-w-[250px] sm:min-w-[280px] md:min-w-[300px] lg:min-w-[200px] xl:min-w-[180px] max-w-[250px]">
    <ProgressBar
      label="Very Windy"
      percentage={weatherData.probabilities.veryWindy}
      color="bg-gray-500"
      icon={Wind}
      count={weatherData.counts.veryWindy}
      total={weatherData.yearsSampled}
    />
  </div>

  <div className="flex-1 min-w-[250px] sm:min-w-[280px] md:min-w-[300px] lg:min-w-[200px] xl:min-w-[180px] max-w-[250px]">
    <ProgressBar
      label="Very Wet"
      percentage={weatherData.probabilities.veryWet}
      color="bg-cyan-500"
      icon={CloudRain}
      count={weatherData.counts.veryWet}
      total={weatherData.yearsSampled}
    />
  </div>

  <div className="flex-1 min-w-[250px] sm:min-w-[280px] md:min-w-[300px] lg:min-w-[200px] xl:min-w-[180px] max-w-[250px]">
    <ProgressBar
      label="Uncomfortable"
      percentage={weatherData.probabilities.veryUncomfortable}
      color="bg-amber-500"
      icon={Droplets}
      count={weatherData.counts.veryUncomfortable}
      total={weatherData.yearsSampled}
    />
  </div>
</div>


            {/* Detailed Probability Insights */}
            {/* CHANGE START */}
            <div className="bg-card rounded-xl p-6 border shadow-sm mb-8">
              <h2 className="text-xl font-semibold font-exo mb-4 text-foreground">Probability Insights & Recommendations</h2>
              <div className="space-y-4">
                {Object.entries(weatherData.probabilities)
                  .sort(([, a], [, b]) => b - a)
                  .map(([key, probability]) => {
                    const count = weatherData.counts[key as keyof typeof weatherData.counts]
                    const percentage = (probability * 100).toFixed(1)
                    let riskLevel = "Low"
                    let riskColor = "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/30"
                    let recommendation = ""

                    if (probability >= 0.3) {
                      riskLevel = "High"
                      riskColor = "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950/30"
                    } else if (probability >= 0.15) {
                      riskLevel = "Medium"
                      riskColor = "text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-950/30"
                    }

                    const conditionName = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())

                    switch (key) {
                      case "veryHot":
                        recommendation =
                          probability >= 0.2
                            ? "Consider indoor alternatives or early morning events"
                            : "Generally safe for outdoor activities"
                        break
                      case "veryCold":
                        recommendation =
                          probability >= 0.2 ? "Plan for heating and warm clothing" : "Cold weather unlikely"
                        break
                      case "veryWet":
                        recommendation =
                          probability >= 0.2 ? "Have indoor backup plans ready" : "Rain unlikely to be an issue"
                        break
                      case "veryWindy":
                        recommendation =
                          probability >= 0.2
                            ? "Secure outdoor equipment and decorations"
                            : "Wind conditions should be manageable"
                        break
                      case "veryUncomfortable":
                        recommendation =
                          probability >= 0.2
                            ? "Provide shade and ventilation options"
                            : "Comfort levels should be acceptable"
                        break
                    }

                    return (
                      <div key={key} className="flex justify-between items-center p-4 bg-muted rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold font-exo text-foreground">{conditionName}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium  ${riskColor}`}>
                              {riskLevel} Risk
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground font-lexend">{recommendation}</p>
                          <p className="text-xs text-muted-foreground font-lexend mt-1">
                            Historical occurrence: <span className="font-mono">{count}</span> times in <span className="font-mono">{weatherData.yearsSampled}</span> years
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold font-mono text-foreground">{percentage}%</div>
                          <div className="text-xs text-muted-foreground font-lexend">Probability</div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
            {/* CHANGE END */}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Probability Bar Chart */}
              {/* ... existing code ... */}
              <div className="bg-card rounded-xl p-6 border shadow-sm">
                <h2 className="text-xl font-semibold font-exo mb-4 text-foreground">Weather Condition Probabilities</h2>
                <ChartContainer
                  className="h-[300px]"
                  config={{
                    prob: { label: "Probability", color: "hsl(var(--chart-2))" },
                  }}
                >
                  <BarChart data={probabilityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis label={{ value: "Probability (%)", angle: -90, position: "insideLeft" }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend />
                    <Bar dataKey="percentage" fill="var(--color-prob)" isAnimationActive animationDuration={500} />
                  </BarChart>
                </ChartContainer>
              </div>
              {/* ... existing code ... */}

              {/* Pie Chart */}
              {/* CHANGE START */}
              <div className="bg-card rounded-xl p-6 border shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Condition Distribution</h2>
                <ChartContainer
                  className="h-[300px]"
                  config={{
                    veryHot: { label: "Very Hot", color: CHART_COLORS.veryHot },
                    veryCold: { label: "Very Cold", color: CHART_COLORS.veryCold },
                    veryWindy: { label: "Very Windy", color: CHART_COLORS.veryWindy },
                    veryWet: { label: "Very Wet", color: CHART_COLORS.veryWet },
                    veryUncomfortable: { label: "Uncomfortable", color: CHART_COLORS.veryUncomfortable },
                  }}
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                    <ChartLegend />
                    <Pie
                      data={probabilityData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={88}
                      isAnimationActive
                      animationDuration={500}
                      label={({ name, percentage }) => `${name}: ${(percentage as number).toFixed(1)}%`}
                    >
                      {probabilityData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </div>
              {/* CHANGE END */}
            </div>

            {/* Historical Trend Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Temperature Trend */}
              {/* CHANGE START */}
              <div className="bg-card rounded-xl  border shadow-sm">
                <div className="p-6">
                <h2 className="text-xl font-semibold font-exo mb-4 text-foreground">Historical Temperature Trend</h2>
                </div>
                <ChartContainer
                  config={{
                    tmax: { label: "Max Temperature", color: "#ef4444" },
                    tmin: { label: "Min Temperature", color: "#3b82f6" },
                  }}
                  className="min-h-[350px]"
                >
                  <LineChart
                    data={trendData}
                    margin={{
                      top: 20,
                      left: 12,
                      right: 12,
                      bottom: 10,
                    }}
                  >
                    <XAxis
                      dataKey="year"
                      tickLine={false}
                      tickMargin={8}
                      axisLine={false}
                      tickFormatter={(value) => value.toString()}
                    />
                    <YAxis
                      label={{
                        value: "Temperature (°C)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) => `Year: ${value}`}
                          formatter={(value, name) => [
                            `${Number(value).toFixed(1)}°C`,
                            name === "tmax" ? "Max Temperature" : "Min Temperature",
                          ]}
                        />
                      }
                    />
                    <ChartLegend
                      content={
                        <div className="flex gap-4">
                          {Object.keys(trendData[0]).map((key) => {
                            if (key === "year" || key === "rain" || key === "wind") return null
                            const label = key === "tmax" ? "Max Temperature" : "Min Temperature"
                            const color = key === "tmax" ? "#ef4444" : "#3b82f6"
                            return (
                              <div key={key} className="flex items-center gap-2">
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    background: color,
                                  }}
                                />
                                <span className="text-xs">{label}</span>
                              </div>
                            )
                          })}
                        </div>
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="tmax"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="tmin"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      connectNulls={false}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
              {/* CHANGE END */}

              {/* Precipitation and Wind Trend */}
              {/* CHANGE START */}
              <div className="bg-card rounded-xl p-6 border shadow-sm">
                <h2 className="text-xl font-semibold font-exo mb-4 text-foreground">Precipitation & Wind Trend</h2>
                <ChartContainer
                  className="h-[350px]"
                  config={{
                    rain: { label: "Precipitation", color: "#06b6d4" },
                    wind: { label: "Wind Speed", color: "#6b7280" },
                  }}
                >
                  <LineChart
                    data={trendData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="year" domain={["dataMin", "dataMax"]} type="number" scale="linear" />
                    <YAxis
                      yAxisId="left"
                      label={{ value: "Precipitation (mm)", angle: -90, position: "insideLeft" }}
                      domain={[0, "dataMax + 10"]}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      label={{ value: "Wind Speed (m/s)", angle: 90, position: "insideRight" }}
                      domain={[0, "dataMax + 5"]}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="rain"
                      stroke="var(--color-rain)"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      isAnimationActive
                      animationDuration={500}
                      connectNulls={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="wind"
                      stroke="var(--color-wind)"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      isAnimationActive
                      animationDuration={500}
                      connectNulls={false}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
              {/* CHANGE END */}
            </div>

            {/* Analysis Summary Table */}
            {/* CHANGE START */}
            <div className="bg-card rounded-xl p-6 border shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                Analysis Summary & Planning Recommendations
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Weather Condition
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Probability
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Risk Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Historical Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Planning Recommendation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {Object.entries(weatherData.probabilities)
                      .sort(([, a], [, b]) => b - a)
                      .map(([key, probability], index) => {
                        const count = weatherData.counts[key as keyof typeof weatherData.counts]
                        const percentage = (probability * 100).toFixed(1)
                        let riskLevel = "Low"
                        let riskColor = "text-green-600 bg-green-50"
                        let recommendation = ""

                        if (probability >= 0.3) {
                          riskLevel = "High"
                          riskColor = "text-red-600 bg-red-50"
                        } else if (probability >= 0.15) {
                          riskLevel = "Medium"
                          riskColor = "text-yellow-600 bg-yellow-50"
                        }

                        const conditionName = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())

                        switch (key) {
                          case "veryHot":
                            recommendation =
                              probability >= 0.2
                                ? "Consider indoor alternatives, early morning events, or provide cooling stations"
                                : "Generally safe for outdoor activities"
                            break
                          case "veryCold":
                            recommendation =
                              probability >= 0.2
                                ? "Plan for heating, warm clothing distribution, and shelter options"
                                : "Cold weather unlikely to be a concern"
                            break
                          case "veryWet":
                            recommendation =
                              probability >= 0.2
                                ? "Secure indoor backup venues and waterproof equipment covers"
                                : "Precipitation unlikely to disrupt plans"
                            break
                          case "veryWindy":
                            recommendation =
                              probability >= 0.2
                                ? "Anchor all outdoor equipment, tents, and decorations securely"
                                : "Wind conditions should be manageable"
                            break
                          case "veryUncomfortable":
                            recommendation =
                              probability >= 0.2
                                ? "Provide shade structures, ventilation, and hydration stations"
                                : "Comfort levels should be acceptable"
                            break
                        }

                        return (
                          <tr key={key} className={index % 2 === 0 ? "bg-card" : "bg-muted"}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                              {conditionName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-foreground">
                              {percentage}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${riskColor}`}>
                                {riskLevel}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                              {count} / {weatherData.yearsSampled} years
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs">{recommendation}</td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>

              {/* Overall Assessment */}
              <div className="mt-6 p-4 bg-muted rounded-lg border">
                <h3 className="font-semibold text-foreground mb-2">📊 Overall Assessment</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-foreground">Data Confidence:</span>
                    <p className="text-muted-foreground">{weatherData.yearsSampled} years of NASA satellite data</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Highest Risk:</span>
                    <p className="text-muted-foreground">
                      {Object.entries(weatherData.probabilities)
                        .reduce((a, b) =>
                          weatherData.probabilities[a[0] as keyof typeof weatherData.probabilities] >
                          weatherData.probabilities[b[0] as keyof typeof weatherData.probabilities]
                            ? a
                            : b,
                        )[0]
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                      ({(Math.max(...Object.values(weatherData.probabilities)) * 100).toFixed(1)}%)
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Recommendation:</span>
                    <p className="text-muted-foreground">
                      {Math.max(...Object.values(weatherData.probabilities)) >= 0.3
                        ? "Plan alternative arrangements"
                        : Math.max(...Object.values(weatherData.probabilities)) >= 0.15
                          ? "Monitor conditions closely"
                          : "Proceed with confidence"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* CHANGE END */}
          </div>
        </div>
      </div>

      {/* AI Weather Assistant Chat - Client-side only */}
      {weatherData && <WeatherChatAssistant weatherData={weatherData} />}
    </>
  )
}

function ResultsLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <DotLottieReact
        src="https://lottie.host/68ba4118-65bc-424e-9b99-2143126eee69/elDPj1guZy.lottie"
        loop
        autoplay
        className="w-56 h-56"
      />
    </div>
  )
}

// Main component with Suspense boundary
export default function ResultsPage() {
  return (
    <Suspense fallback={<ResultsLoading />}>
      <ResultsContent />
    </Suspense>
  )
}
