"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import { Button } from "@/components/ui/button"
import { Download, ChevronDown, ChevronUp } from "lucide-react"
import { saveAs } from "file-saver"

const diseaseReports = [
  {
    name: "GeneFlare-1",
    dnaSequence: "ATGCTAGCTAGCTAGCTA",
    probability: 78,
    timeUntilIncrease: "6 months",
  },
  {
    name: "NeuroMut-5",
    dnaSequence: "CGTAGCTAGGTCGATGCA",
    probability: 62,
    timeUntilIncrease: "1 year",
  },
  {
    name: "CellMorph-X",
    dnaSequence: "GATCGATGCTAGCTAGCA",
    probability: 88,
    timeUntilIncrease: "3 months",
  },
]

const topRegions = [
  { region: "Hyderabad", disease: "CellMorph-X", cases: 920 },
  { region: "Delhi", disease: "GeneFlare-1", cases: 850 },
  { region: "Bangalore", disease: "NeuroMut-5", cases: 800 },
]

export default function ReportsPage() {
  const [expanded, setExpanded] = useState<number | null>(null)
  const [filter, setFilter] = useState<string>("All")

  const downloadReport = () => {
    const content = JSON.stringify({ diseaseReports, topRegions }, null, 2)
    const blob = new Blob([content], { type: "application/json" })
    saveAs(blob, "disease-report.json")
  }

  const filteredReports =
    filter === "All" ? diseaseReports : diseaseReports.filter((d) => d.name === filter)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Predicted Disease Reports</h1>
        <Button variant="outline" onClick={downloadReport} className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Download Report
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <label className="font-medium">Filter by Disease:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-1 rounded-md"
        >
          <option value="All">All</option>
          {diseaseReports.map((d) => (
            <option key={d.name} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {filteredReports.map((disease, i) => (
          <Card key={i} className="p-4 bg-white shadow-md border">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">{disease.name}</h2>
              <p>
                <strong>Probability:</strong> {disease.probability}%
              </p>
              <p>
                <strong>Time Until Rise:</strong> {disease.timeUntilIncrease}
              </p>
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="mt-2 text-blue-500 flex items-center gap-1 hover:underline"
              >
                {expanded === i ? (
                  <>
                    Hide DNA <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Show DNA <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
              {expanded === i && (
                <div className="bg-gray-100 p-2 rounded mt-2 text-sm font-mono overflow-x-auto">
                  {disease.dnaSequence}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-2xl font-semibold mb-4">Top 3 Affected Regions</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topRegions}>
            <XAxis dataKey="region" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cases" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
