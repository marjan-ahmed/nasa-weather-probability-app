'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
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
  Database
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { WeatherChatAssistant } from '@/components/WeatherChatAssistant';

// Types
interface WeatherData {
  location: string;
  coordinates: string;
  date: string;
  yearsSampled: number;
  probabilities: {
    veryHot: number;
    veryCold: number;
    veryWindy: number;
    veryWet: number;
    veryUncomfortable: number;
  };
  counts: {
    veryHot: number;
    veryCold: number;
    veryWindy: number;
    veryWet: number;
    veryUncomfortable: number;
  };
  historicalData: Array<{
    year: string;
    date: string;
    tmax: number | null;
    tmin: number | null;
    rain: number | null;
    wind: number | null;
    rh: number | null;
  }>;
  thresholds: {
    veryHotC: number;
    veryColdC: number;
    veryWindyMs: number;
    veryWetMm: number;
    uncomfortableTempC: number;
    uncomfortableRH: number;
  };
}

// Progress Bar Component
const ProgressBar = ({ label, percentage, color, icon: Icon, count, total }: {
  label: string;
  percentage: number;
  color: string;
  icon: React.ComponentType<any>;
  count: number;
  total: number;
}) => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-full ${color.replace('bg-', 'bg-').replace('-500', '-100')}`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{label}</h3>
          <p className="text-sm text-gray-500">{count} out of {total} years</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-gray-800">{(percentage * 100).toFixed(1)}%</div>
      </div>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div 
        className={`h-3 rounded-full transition-all duration-1000 ease-out ${color}`}
        style={{ width: `${percentage * 100}%` }}
      />
    </div>
  </div>
);

// Chart Colors
const CHART_COLORS = {
  veryHot: '#ef4444',
  veryCold: '#3b82f6',
  veryWindy: '#6b7280',
  veryWet: '#06b6d4',
  veryUncomfortable: '#f59e0b'
};

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const dataParam = searchParams.get('data');
      if (dataParam) {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));
        setWeatherData(decodedData);
      }
    } catch (error) {
      console.error('Error parsing weather data:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Export functions
  const exportToCSV = () => {
    if (!weatherData) return;

    // Create analysis summary CSV
    const analysisData = [
      ['Weather Analysis Report'],
      ['Location', weatherData.location],
      ['Coordinates', weatherData.coordinates],
      ['Analysis Date', weatherData.date],
      ['Years of Historical Data', weatherData.yearsSampled.toString()],
      ['Data Period', '1981-2025'],
      [''],
      ['Weather Condition Probabilities'],
      ['Condition', 'Probability (%)', 'Risk Level', 'Historical Occurrences', 'Recommendation'],
      ['Very Hot (≥35°C)', (weatherData.probabilities.veryHot * 100).toFixed(1), 
       weatherData.probabilities.veryHot >= 0.3 ? 'High' : weatherData.probabilities.veryHot >= 0.15 ? 'Medium' : 'Low',
       `${weatherData.counts.veryHot} times`, 
       weatherData.probabilities.veryHot >= 0.2 ? 'Consider indoor alternatives or early morning events' : 'Generally safe for outdoor activities'],
      ['Very Cold (≤0°C)', (weatherData.probabilities.veryCold * 100).toFixed(1),
       weatherData.probabilities.veryCold >= 0.3 ? 'High' : weatherData.probabilities.veryCold >= 0.15 ? 'Medium' : 'Low',
       `${weatherData.counts.veryCold} times`,
       weatherData.probabilities.veryCold >= 0.2 ? 'Plan for heating and warm clothing' : 'Cold weather unlikely'],
      ['Very Windy (≥10 m/s)', (weatherData.probabilities.veryWindy * 100).toFixed(1),
       weatherData.probabilities.veryWindy >= 0.3 ? 'High' : weatherData.probabilities.veryWindy >= 0.15 ? 'Medium' : 'Low',
       `${weatherData.counts.veryWindy} times`,
       weatherData.probabilities.veryWindy >= 0.2 ? 'Secure outdoor equipment and decorations' : 'Wind conditions should be manageable'],
      ['Very Wet (≥20mm)', (weatherData.probabilities.veryWet * 100).toFixed(1),
       weatherData.probabilities.veryWet >= 0.3 ? 'High' : weatherData.probabilities.veryWet >= 0.15 ? 'Medium' : 'Low',
       `${weatherData.counts.veryWet} times`,
       weatherData.probabilities.veryWet >= 0.2 ? 'Have indoor backup plans ready' : 'Rain unlikely to be an issue'],
      ['Very Uncomfortable (≥30°C & ≥70% RH)', (weatherData.probabilities.veryUncomfortable * 100).toFixed(1),
       weatherData.probabilities.veryUncomfortable >= 0.3 ? 'High' : weatherData.probabilities.veryUncomfortable >= 0.15 ? 'Medium' : 'Low',
       `${weatherData.counts.veryUncomfortable} times`,
       weatherData.probabilities.veryUncomfortable >= 0.2 ? 'Provide shade and ventilation options' : 'Comfort levels should be acceptable'],
      [''],
      ['Summary Statistics'],
      ['Total Extreme Weather Events', Object.values(weatherData.counts).reduce((a, b) => a + b, 0).toString()],
      ['Highest Risk Condition', Object.entries(weatherData.probabilities)
        .reduce((a, b) => weatherData.probabilities[a[0] as keyof typeof weatherData.probabilities] > weatherData.probabilities[b[0] as keyof typeof weatherData.probabilities] ? a : b)[0]
        .replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())],
      ['Overall Risk Assessment', Math.max(...Object.values(weatherData.probabilities)) >= 0.3 ? 'High Risk - Plan Alternatives' : Math.max(...Object.values(weatherData.probabilities)) >= 0.15 ? 'Medium Risk - Monitor Conditions' : 'Low Risk - Proceed with Confidence']
    ];

    const csv = analysisData.map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather-report-${weatherData.location.replace(/[^a-zA-Z0-9]/g, '-')}-${weatherData.date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    if (!weatherData) return;

    const reportData = {
      analysisInfo: {
        reportTitle: 'Weather Probability Analysis Report',
        location: weatherData.location,
        coordinates: weatherData.coordinates,
        analysisDate: weatherData.date,
        dataSource: 'NASA POWER API',
        dataPeriod: '1981-2025',
        yearsAnalyzed: weatherData.yearsSampled,
        generatedOn: new Date().toISOString().split('T')[0]
      },
      probabilityAnalysis: {
        veryHot: {
          probability: Math.round(weatherData.probabilities.veryHot * 1000) / 10,
          probabilityPercent: `${(weatherData.probabilities.veryHot * 100).toFixed(1)}%`,
          historicalOccurrences: weatherData.counts.veryHot,
          riskLevel: weatherData.probabilities.veryHot >= 0.3 ? 'High' : weatherData.probabilities.veryHot >= 0.15 ? 'Medium' : 'Low',
          threshold: '≥35°C',
          recommendation: weatherData.probabilities.veryHot >= 0.2 ? 'Consider indoor alternatives or early morning events' : 'Generally safe for outdoor activities'
        },
        veryCold: {
          probability: Math.round(weatherData.probabilities.veryCold * 1000) / 10,
          probabilityPercent: `${(weatherData.probabilities.veryCold * 100).toFixed(1)}%`,
          historicalOccurrences: weatherData.counts.veryCold,
          riskLevel: weatherData.probabilities.veryCold >= 0.3 ? 'High' : weatherData.probabilities.veryCold >= 0.15 ? 'Medium' : 'Low',
          threshold: '≤0°C',
          recommendation: weatherData.probabilities.veryCold >= 0.2 ? 'Plan for heating and warm clothing' : 'Cold weather unlikely'
        },
        veryWindy: {
          probability: Math.round(weatherData.probabilities.veryWindy * 1000) / 10,
          probabilityPercent: `${(weatherData.probabilities.veryWindy * 100).toFixed(1)}%`,
          historicalOccurrences: weatherData.counts.veryWindy,
          riskLevel: weatherData.probabilities.veryWindy >= 0.3 ? 'High' : weatherData.probabilities.veryWindy >= 0.15 ? 'Medium' : 'Low',
          threshold: '≥10 m/s',
          recommendation: weatherData.probabilities.veryWindy >= 0.2 ? 'Secure outdoor equipment and decorations' : 'Wind conditions should be manageable'
        },
        veryWet: {
          probability: Math.round(weatherData.probabilities.veryWet * 1000) / 10,
          probabilityPercent: `${(weatherData.probabilities.veryWet * 100).toFixed(1)}%`,
          historicalOccurrences: weatherData.counts.veryWet,
          riskLevel: weatherData.probabilities.veryWet >= 0.3 ? 'High' : weatherData.probabilities.veryWet >= 0.15 ? 'Medium' : 'Low',
          threshold: '≥20mm',
          recommendation: weatherData.probabilities.veryWet >= 0.2 ? 'Have indoor backup plans ready' : 'Rain unlikely to be an issue'
        },
        veryUncomfortable: {
          probability: Math.round(weatherData.probabilities.veryUncomfortable * 1000) / 10,
          probabilityPercent: `${(weatherData.probabilities.veryUncomfortable * 100).toFixed(1)}%`,
          historicalOccurrences: weatherData.counts.veryUncomfortable,
          riskLevel: weatherData.probabilities.veryUncomfortable >= 0.3 ? 'High' : weatherData.probabilities.veryUncomfortable >= 0.15 ? 'Medium' : 'Low',
          threshold: '≥30°C & ≥70% RH',
          recommendation: weatherData.probabilities.veryUncomfortable >= 0.2 ? 'Provide shade and ventilation options' : 'Comfort levels should be acceptable'
        }
      },
      summaryStatistics: {
        totalExtremeEvents: Object.values(weatherData.counts).reduce((a, b) => a + b, 0),
        highestRiskCondition: Object.entries(weatherData.probabilities)
          .reduce((a, b) => weatherData.probabilities[a[0] as keyof typeof weatherData.probabilities] > weatherData.probabilities[b[0] as keyof typeof weatherData.probabilities] ? a : b)[0]
          .replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        overallRiskAssessment: Math.max(...Object.values(weatherData.probabilities)) >= 0.3 ? 'High Risk - Plan Alternatives' : 
                              Math.max(...Object.values(weatherData.probabilities)) >= 0.15 ? 'Medium Risk - Monitor Conditions' : 
                              'Low Risk - Proceed with Confidence'
      }
    };

    const json = JSON.stringify(reportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather-report-${weatherData.location.replace(/[^a-zA-Z0-9]/g, '-')}-${weatherData.date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    if (!weatherData) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(44, 62, 80);
    doc.text('Weather Probability Report', 20, 25);
    
    // Subtitle
    doc.setFontSize(14);
    doc.setTextColor(127, 140, 141);
    doc.text('NASA POWER Data Analysis', 20, 35);
    
    // Location and Date Info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`📍 Location: ${weatherData.location}`, 20, 55);
    doc.text(`📌 Coordinates: ${weatherData.coordinates}`, 20, 65);
    doc.text(`📅 Analysis Date: ${weatherData.date}`, 20, 75);
    doc.text(`📊 Data Period: 1981-2025 (${weatherData.yearsSampled} years analyzed)`, 20, 85);
    doc.text(`🗓️ Report Generated: ${new Date().toLocaleDateString()}`, 20, 95);
    
    // Probabilities Section
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text('Weather Condition Analysis', 20, 115);
    
    const probData = [
      ['Weather Condition', 'Probability', 'Risk Level', 'Recommendation'],
      [
        'Very Hot (≥35°C)', 
        `${(weatherData.probabilities.veryHot * 100).toFixed(1)}%`,
        weatherData.probabilities.veryHot >= 0.3 ? 'High' : weatherData.probabilities.veryHot >= 0.15 ? 'Medium' : 'Low',
        weatherData.probabilities.veryHot >= 0.2 ? 'Consider indoor alternatives' : 'Safe for outdoor activities'
      ],
      [
        'Very Cold (≤0°C)', 
        `${(weatherData.probabilities.veryCold * 100).toFixed(1)}%`,
        weatherData.probabilities.veryCold >= 0.3 ? 'High' : weatherData.probabilities.veryCold >= 0.15 ? 'Medium' : 'Low',
        weatherData.probabilities.veryCold >= 0.2 ? 'Plan for heating solutions' : 'Cold weather unlikely'
      ],
      [
        'Very Windy (≥10 m/s)', 
        `${(weatherData.probabilities.veryWindy * 100).toFixed(1)}%`,
        weatherData.probabilities.veryWindy >= 0.3 ? 'High' : weatherData.probabilities.veryWindy >= 0.15 ? 'Medium' : 'Low',
        weatherData.probabilities.veryWindy >= 0.2 ? 'Secure outdoor equipment' : 'Wind manageable'
      ],
      [
        'Very Wet (≥20mm)', 
        `${(weatherData.probabilities.veryWet * 100).toFixed(1)}%`,
        weatherData.probabilities.veryWet >= 0.3 ? 'High' : weatherData.probabilities.veryWet >= 0.15 ? 'Medium' : 'Low',
        weatherData.probabilities.veryWet >= 0.2 ? 'Prepare backup plans' : 'Rain unlikely'
      ],
      [
        'Very Uncomfortable', 
        `${(weatherData.probabilities.veryUncomfortable * 100).toFixed(1)}%`,
        weatherData.probabilities.veryUncomfortable >= 0.3 ? 'High' : weatherData.probabilities.veryUncomfortable >= 0.15 ? 'Medium' : 'Low',
        weatherData.probabilities.veryUncomfortable >= 0.2 ? 'Provide shade & ventilation' : 'Comfort acceptable'
      ]
    ];

    (doc as any).autoTable({
      startY: 125,
      head: [probData[0]],
      body: probData.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [52, 73, 94], textColor: 255 },
      styles: { fontSize: 10 }
    });

    // Summary Section
    const currentY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text('Executive Summary', 20, currentY);
    
    const summaryData = [
      ['Metric', 'Value'],
      ['Total Extreme Weather Events', Object.values(weatherData.counts).reduce((a, b) => a + b, 0).toString()],
      ['Highest Risk Condition', Object.entries(weatherData.probabilities)
        .reduce((a, b) => weatherData.probabilities[a[0] as keyof typeof weatherData.probabilities] > weatherData.probabilities[b[0] as keyof typeof weatherData.probabilities] ? a : b)[0]
        .replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())],
      ['Overall Risk Assessment', Math.max(...Object.values(weatherData.probabilities)) >= 0.3 ? 'High Risk - Plan Alternatives' : 
                                 Math.max(...Object.values(weatherData.probabilities)) >= 0.15 ? 'Medium Risk - Monitor Conditions' : 
                                 'Low Risk - Proceed with Confidence']
    ];

    (doc as any).autoTable({
      startY: currentY + 10,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [46, 125, 50], textColor: 255 },
      styles: { fontSize: 11 }
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(127, 140, 141);
    doc.text('Generated by NASA Weather Probability App | Data Source: NASA POWER API', 20, pageHeight - 10);

    doc.save(`weather-report-${weatherData.location.replace(/[^a-zA-Z0-9]/g, '-')}-${weatherData.date}.pdf`);
  };

  const exportRawData = () => {
    if (!weatherData) return;

    // Create raw NASA POWER data export for the specific query
    const rawDataExport = {
      queryInfo: {
        title: 'NASA POWER Raw Data Export',
        description: 'Historical weather data subset for specific location and date',
        location: weatherData.location,
        coordinates: weatherData.coordinates,
        queryDate: weatherData.date,
        dataSource: 'NASA POWER API - Prediction of Worldwide Energy Resources',
        apiEndpoint: 'https://power.larc.nasa.gov/api/temporal/daily/point',
        parameters: [
          'T2M_MAX - Temperature at 2 Meters Maximum (°C)',
          'T2M_MIN - Temperature at 2 Meters Minimum (°C)', 
          'PRECTOTCORR - Precipitation Corrected (mm/day)',
          'WS10M - Wind Speed at 10 Meters (m/s)',
          'RH2M - Relative Humidity at 2 Meters (%)'
        ],
        dataPeriod: '1981-2025',
        exportedOn: new Date().toISOString(),
        monthDayFilter: `All ${weatherData.date.split('-')[1]}/${weatherData.date.split('-')[2]} dates across years`
      },
      metadata: {
        totalRecords: weatherData.historicalData.length,
        validRecords: weatherData.yearsSampled,
        missingDataHandling: 'Records with null values are preserved for transparency',
        coordinatesUsed: weatherData.coordinates,
        thresholds: weatherData.thresholds
      },
      historicalData: weatherData.historicalData.map(record => ({
        year: parseInt(record.year),
        date: record.date,
        julianDay: Math.floor((new Date(`${record.year}-${weatherData.date.split('-')[1]}-${weatherData.date.split('-')[2]}`).getTime() - new Date(`${record.year}-01-01`).getTime()) / (1000 * 60 * 60 * 24)) + 1,
        weatherParameters: {
          maxTemperature_C: record.tmax,
          minTemperature_C: record.tmin,
          precipitation_mm: record.rain,
          windSpeed_ms: record.wind,
          relativeHumidity_percent: record.rh
        },
        qualityFlags: {
          hasValidTemp: record.tmax !== null && record.tmin !== null,
          hasValidPrecip: record.rain !== null,
          hasValidWind: record.wind !== null,
          hasValidHumidity: record.rh !== null,
          completeRecord: record.tmax !== null && record.tmin !== null && record.rain !== null && record.wind !== null && record.rh !== null
        },
        extremeEventFlags: {
          veryHot: record.tmax !== null ? record.tmax >= weatherData.thresholds.veryHotC : false,
          veryCold: record.tmin !== null ? record.tmin <= weatherData.thresholds.veryColdC : false,
          veryWindy: record.wind !== null ? record.wind >= weatherData.thresholds.veryWindyMs : false,
          veryWet: record.rain !== null ? record.rain >= weatherData.thresholds.veryWetMm : false,
          veryUncomfortable: (record.tmax !== null && record.rh !== null) ? 
            (record.tmax >= weatherData.thresholds.uncomfortableTempC && record.rh >= weatherData.thresholds.uncomfortableRH) : false
        }
      })),
      statisticalSummary: {
        temperatureStats: {
          maxTemp: {
            mean: weatherData.historicalData.filter(d => d.tmax !== null).reduce((sum, d) => sum + (d.tmax || 0), 0) / weatherData.historicalData.filter(d => d.tmax !== null).length || 0,
            min: Math.min(...weatherData.historicalData.filter(d => d.tmax !== null).map(d => d.tmax || 0)),
            max: Math.max(...weatherData.historicalData.filter(d => d.tmax !== null).map(d => d.tmax || 0))
          },
          minTemp: {
            mean: weatherData.historicalData.filter(d => d.tmin !== null).reduce((sum, d) => sum + (d.tmin || 0), 0) / weatherData.historicalData.filter(d => d.tmin !== null).length || 0,
            min: Math.min(...weatherData.historicalData.filter(d => d.tmin !== null).map(d => d.tmin || 0)),
            max: Math.max(...weatherData.historicalData.filter(d => d.tmin !== null).map(d => d.tmin || 0))
          }
        },
        precipitationStats: {
          mean: weatherData.historicalData.filter(d => d.rain !== null).reduce((sum, d) => sum + (d.rain || 0), 0) / weatherData.historicalData.filter(d => d.rain !== null).length || 0,
          totalDaysWithRain: weatherData.historicalData.filter(d => d.rain !== null && d.rain > 0).length,
          maxSingleDay: Math.max(...weatherData.historicalData.filter(d => d.rain !== null).map(d => d.rain || 0))
        },
        dataQuality: {
          completenessPercentage: (weatherData.yearsSampled / weatherData.historicalData.length) * 100,
          missingDataYears: weatherData.historicalData.filter(d => 
            d.tmax === null && d.tmin === null && d.rain === null && d.wind === null && d.rh === null
          ).map(d => d.year)
        }
      }
    };

    const json = JSON.stringify(rawDataExport, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nasa-power-raw-data-${weatherData.location.replace(/[^a-zA-Z0-9]/g, '-')}-${weatherData.date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Weather Analysis for ${weatherData?.location}`,
          text: `Check out this weather probability analysis for ${weatherData?.location} on ${weatherData?.date}`,
          url: url
        });
      } catch (error) {
        console.log('Error sharing:', error);
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading results...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!weatherData) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">No Results Found</h1>
            <p className="text-gray-600 mb-6">Unable to load weather analysis results.</p>
            <Button onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Prepare chart data
  const probabilityData = [
    { name: 'Very Hot', percentage: weatherData.probabilities.veryHot * 100, count: weatherData.counts.veryHot, color: CHART_COLORS.veryHot },
    { name: 'Very Cold', percentage: weatherData.probabilities.veryCold * 100, count: weatherData.counts.veryCold, color: CHART_COLORS.veryCold },
    { name: 'Very Windy', percentage: weatherData.probabilities.veryWindy * 100, count: weatherData.counts.veryWindy, color: CHART_COLORS.veryWindy },
    { name: 'Very Wet', percentage: weatherData.probabilities.veryWet * 100, count: weatherData.counts.veryWet, color: CHART_COLORS.veryWet },
    { name: 'Uncomfortable', percentage: weatherData.probabilities.veryUncomfortable * 100, count: weatherData.counts.veryUncomfortable, color: CHART_COLORS.veryUncomfortable }
  ];

  // Historical trend data (group by decades for better visualization)
  const trendData = weatherData.historicalData
    .filter(d => d.tmax !== null || d.tmin !== null || d.rain !== null || d.wind !== null)
    .map(d => ({
      year: parseInt(d.year),
      tmax: d.tmax,
      tmin: d.tmin,
      rain: d.rain,
      wind: d.wind,
      rh: d.rh
    }))
    .sort((a, b) => a.year - b.year);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        {/* Header Section */}
        <div className="pt-24 pb-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Weather Analysis Results</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
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
                    <span>{weatherData.yearsSampled} years of data</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                <Button onClick={() => router.push('/dashboard')} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={shareResults} variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <div className="relative group">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase border-b">
                        Analysis Reports
                      </div>
                      <button onClick={exportToCSV} className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100">
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        <div>
                          <div className="text-sm font-medium">Export CSV Report</div>
                          <div className="text-xs text-gray-500">Analysis summary</div>
                        </div>
                      </button>
                      <button onClick={exportToJSON} className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100">
                        <FileJson className="w-4 h-4 mr-2" />
                        <div>
                          <div className="text-sm font-medium">Export JSON Report</div>
                          <div className="text-xs text-gray-500">Structured analysis</div>
                        </div>
                      </button>
                      <button onClick={exportToPDF} className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100">
                        <FileText className="w-4 h-4 mr-2" />
                        <div>
                          <div className="text-sm font-medium">Export PDF Report</div>
                          <div className="text-xs text-gray-500">Professional document</div>
                        </div>
                      </button>
                      
                      <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase border-b border-t mt-1">
                        Raw Data
                      </div>
                      <button onClick={exportRawData} className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100">
                        <Database className="w-4 h-4 mr-2 text-blue-600" />
                        <div>
                          <div className="text-sm font-medium text-blue-700">NASA POWER Data</div>
                          <div className="text-xs text-gray-500">Raw subset for query</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Statistics Section */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Probability Analysis Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{weatherData.yearsSampled}</div>
                  <div className="text-sm text-gray-600">Years of Historical Data</div>
                  <div className="text-xs text-gray-500 mt-1">1981 - 2025</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {Math.max(...Object.values(weatherData.probabilities)).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Highest Probability</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Object.entries(weatherData.probabilities)
                      .reduce((a, b) => weatherData.probabilities[a[0] as keyof typeof weatherData.probabilities] > weatherData.probabilities[b[0] as keyof typeof weatherData.probabilities] ? a : b)[0]
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase())}
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {Object.values(weatherData.counts).reduce((a, b) => a + b, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Extreme Events</div>
                  <div className="text-xs text-gray-500 mt-1">Across all categories</div>
                </div>
              </div>
            </div>

            {/* Progress Bars Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
              <ProgressBar
                label="Very Hot"
                percentage={weatherData.probabilities.veryHot}
                color="bg-red-500"
                icon={ThermometerSun}
                count={weatherData.counts.veryHot}
                total={weatherData.yearsSampled}
              />
              <ProgressBar
                label="Very Cold"
                percentage={weatherData.probabilities.veryCold}
                color="bg-blue-500"
                icon={Snowflake}
                count={weatherData.counts.veryCold}
                total={weatherData.yearsSampled}
              />
              <ProgressBar
                label="Very Windy"
                percentage={weatherData.probabilities.veryWindy}
                color="bg-gray-500"
                icon={Wind}
                count={weatherData.counts.veryWindy}
                total={weatherData.yearsSampled}
              />
              <ProgressBar
                label="Very Wet"
                percentage={weatherData.probabilities.veryWet}
                color="bg-cyan-500"
                icon={CloudRain}
                count={weatherData.counts.veryWet}
                total={weatherData.yearsSampled}
              />
              <ProgressBar
                label="Uncomfortable"
                percentage={weatherData.probabilities.veryUncomfortable}
                color="bg-amber-500"
                icon={Droplets}
                count={weatherData.counts.veryUncomfortable}
                total={weatherData.yearsSampled}
              />
            </div>

            {/* Detailed Probability Insights */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Probability Insights & Recommendations</h2>
              <div className="space-y-4">
                {Object.entries(weatherData.probabilities)
                  .sort(([,a], [,b]) => b - a)
                  .map(([key, probability]) => {
                    const count = weatherData.counts[key as keyof typeof weatherData.counts];
                    const percentage = (probability * 100).toFixed(1);
                    let riskLevel = 'Low';
                    let riskColor = 'text-green-600 bg-green-50';
                    let recommendation = '';
                    
                    if (probability >= 0.3) {
                      riskLevel = 'High';
                      riskColor = 'text-red-600 bg-red-50';
                    } else if (probability >= 0.15) {
                      riskLevel = 'Medium';
                      riskColor = 'text-yellow-600 bg-yellow-50';
                    }
                    
                    const conditionName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    
                    switch(key) {
                      case 'veryHot':
                        recommendation = probability >= 0.2 ? 'Consider indoor alternatives or early morning events' : 'Generally safe for outdoor activities';
                        break;
                      case 'veryCold':
                        recommendation = probability >= 0.2 ? 'Plan for heating and warm clothing' : 'Cold weather unlikely';
                        break;
                      case 'veryWet':
                        recommendation = probability >= 0.2 ? 'Have indoor backup plans ready' : 'Rain unlikely to be an issue';
                        break;
                      case 'veryWindy':
                        recommendation = probability >= 0.2 ? 'Secure outdoor equipment and decorations' : 'Wind conditions should be manageable';
                        break;
                      case 'veryUncomfortable':
                        recommendation = probability >= 0.2 ? 'Provide shade and ventilation options' : 'Comfort levels should be acceptable';
                        break;
                    }
                    
                    return (
                      <div key={key} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-800">{conditionName}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${riskColor}`}>
                              {riskLevel} Risk
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{recommendation}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Historical occurrence: {count} times in {weatherData.yearsSampled} years
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-gray-800">{percentage}%</div>
                          <div className="text-xs text-gray-500">Probability</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Probability Bar Chart */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Weather Condition Probabilities</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={probabilityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Probability']} />
                    <Bar dataKey="percentage" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Condition Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={probabilityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      label={({name, percentage}) => `${name}: ${(percentage as number).toFixed(1)}%`}
                    >
                      {probabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Historical Trend Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Temperature Trend */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Historical Temperature Trend</h2>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${Number(value).toFixed(1)}°C`, 
                        name === 'tmax' ? 'Max Temperature' : 'Min Temperature'
                      ]}
                      labelFormatter={(year) => `Year: ${year}`}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="tmax" stroke="#ef4444" name="Max Temperature" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="tmin" stroke="#3b82f6" name="Min Temperature" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Precipitation and Wind Trend */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Precipitation & Wind Trend</h2>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" label={{ value: 'Precipitation (mm)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Wind Speed (m/s)', angle: 90, position: 'insideRight' }} />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'rain') return [`${Number(value).toFixed(1)} mm`, 'Precipitation'];
                        if (name === 'wind') return [`${Number(value).toFixed(1)} m/s`, 'Wind Speed'];
                        return [value, name];
                      }}
                      labelFormatter={(year) => `Year: ${year}`}
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="rain" stroke="#06b6d4" name="Precipitation" strokeWidth={2} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="wind" stroke="#6b7280" name="Wind Speed" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Analysis Summary Table */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Analysis Summary & Planning Recommendations</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weather Condition</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Historical Count</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planning Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(weatherData.probabilities)
                      .sort(([,a], [,b]) => b - a)
                      .map(([key, probability], index) => {
                        const count = weatherData.counts[key as keyof typeof weatherData.counts];
                        const percentage = (probability * 100).toFixed(1);
                        let riskLevel = 'Low';
                        let riskColor = 'text-green-600 bg-green-50';
                        let recommendation = '';
                        
                        if (probability >= 0.3) {
                          riskLevel = 'High';
                          riskColor = 'text-red-600 bg-red-50';
                        } else if (probability >= 0.15) {
                          riskLevel = 'Medium';
                          riskColor = 'text-yellow-600 bg-yellow-50';
                        }
                        
                        const conditionName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        
                        switch(key) {
                          case 'veryHot':
                            recommendation = probability >= 0.2 ? 'Consider indoor alternatives, early morning events, or provide cooling stations' : 'Generally safe for outdoor activities';
                            break;
                          case 'veryCold':
                            recommendation = probability >= 0.2 ? 'Plan for heating, warm clothing distribution, and shelter options' : 'Cold weather unlikely to be a concern';
                            break;
                          case 'veryWet':
                            recommendation = probability >= 0.2 ? 'Secure indoor backup venues and waterproof equipment covers' : 'Precipitation unlikely to disrupt plans';
                            break;
                          case 'veryWindy':
                            recommendation = probability >= 0.2 ? 'Anchor all outdoor equipment, tents, and decorations securely' : 'Wind conditions should be manageable';
                            break;
                          case 'veryUncomfortable':
                            recommendation = probability >= 0.2 ? 'Provide shade structures, ventilation, and hydration stations' : 'Comfort levels should be acceptable';
                            break;
                        }
                        
                        return (
                          <tr key={key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {conditionName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              {percentage}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${riskColor}`}>
                                {riskLevel}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {count} / {weatherData.yearsSampled} years
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                              {recommendation}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              
              {/* Overall Assessment */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">📊 Overall Assessment</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-700">Data Confidence:</span>
                    <p className="text-blue-600">{weatherData.yearsSampled} years of NASA satellite data</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-700">Highest Risk:</span>
                    <p className="text-blue-600">
                      {Object.entries(weatherData.probabilities)
                        .reduce((a, b) => weatherData.probabilities[a[0] as keyof typeof weatherData.probabilities] > weatherData.probabilities[b[0] as keyof typeof weatherData.probabilities] ? a : b)[0]
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase())} 
                      ({(Math.max(...Object.values(weatherData.probabilities)) * 100).toFixed(1)}%)
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-700">Recommendation:</span>
                    <p className="text-blue-600">
                      {Math.max(...Object.values(weatherData.probabilities)) >= 0.3 
                        ? 'Plan alternative arrangements' 
                        : Math.max(...Object.values(weatherData.probabilities)) >= 0.15 
                        ? 'Monitor conditions closely' 
                        : 'Proceed with confidence'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Weather Assistant Chat */}
      <WeatherChatAssistant weatherData={weatherData} />
      
      <Footer />
    </>
  );
}