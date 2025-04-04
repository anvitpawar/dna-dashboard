"use client";

import React from "react";
import dynamic from "next/dynamic";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartTooltip, ResponsiveContainer } from "recharts";
import { Save } from "lucide-react";
import { saveAs } from "file-saver";

// Lazy load the map component
const RiskMap = dynamic(() => import("@/components/RiskMap"), {
  ssr: false,
});

const dummyForecastData = [
  { year: 2025, diseases: 4 },
  { year: 2026, diseases: 6 },
  { year: 2027, diseases: 8 },
  { year: 2028, diseases: 10 },
];

const diseaseTableData = [
  {
    name: "GeneMal-X",
    sequence: "AGCTGACGTAGCTAGCTAGCA...",
    probability: 87,
    timeUntilSpike: "12 months",
    city: "Mumbai",
  },
  {
    name: "Neuropath-Y",
    sequence: "TGCATGCACTGACTAGCTAGT...",
    probability: 74,
    timeUntilSpike: "18 months",
    city: "Bangalore",
  },
  {
    name: "Respirona-Z",
    sequence: "CGATCGATGACGATCGATCGT...",
    probability: 91,
    timeUntilSpike: "6 months",
    city: "Delhi",
  },
];

const topRiskCities = [
  { city: "Delhi", probability: 91 },
  { city: "Mumbai", probability: 87 },
  { city: "Bangalore", probability: 74 },
];

export default function ReportsPage() {
  const downloadCSV = () => {
    const csv = [
      ["Disease", "Sequence", "Probability", "Time Until Spike", "City"],
      ...diseaseTableData.map((d) => [
        d.name,
        d.sequence,
        `${d.probability}%`,
        d.timeUntilSpike,
        d.city,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "disease_report.csv");
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Disease Forecast Report</h1>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-2">Predicted Disease Count Over Years</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dummyForecastData}>
            <XAxis dataKey="year" />
            <YAxis />
            <RechartTooltip />
            <Bar dataKey="diseases" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Disease Table */}
      <div className="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
        <h2 className="text-xl font-semibold mb-2">DNA Disease Prediction Table</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Disease</th>
              <th className="p-2">DNA Sequence</th>
              <th className="p-2">Probability</th>
              <th className="p-2">Time Until Spike</th>
              <th className="p-2">City</th>
            </tr>
          </thead>
          <tbody>
            {diseaseTableData.map((disease, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-2 font-medium">{disease.name}</td>
                <td className="p-2 text-xs truncate max-w-[250px]">{disease.sequence}</td>
                <td className="p-2">{disease.probability}%</td>
                <td className="p-2">{disease.timeUntilSpike}</td>
                <td className="p-2">{disease.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={downloadCSV}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Save size={16} /> Export CSV
        </button>
      </div>

      {/* Risk Cities List */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-2">Top 3 High-Risk Cities</h2>
        <ul className="list-disc pl-6">
          {topRiskCities.map((city, idx) => (
            <li key={idx}>
              <span className="font-medium">{city.city}</span> — {city.probability}% probability
            </li>
          ))}
        </ul>
      </div>

      {/* Map Component */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-2">Interactive Risk Map</h2>
        <RiskMap riskCities={topRiskCities} />
      </div>
    </div>
  );
}