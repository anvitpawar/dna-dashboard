"use client"

import React, { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  CartesianGrid,
} from "recharts"
import ChartModal from "@/components/ui/ChartModal"

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#a4de6c"]

import { processCSVData } from '@/lib/dataProcessing';

interface LocationRisk {
  region: string;
  risk: number;
}

interface DiseaseDistribution {
  disease: string;
  count: number;
}

interface ParameterAverage {
  parameter: string;
  average: number;
}

export default function VisualizationPage() {
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const processedData = await processCSVData();
        setData(processedData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
    loadData();
  }, []);

  const modelAccuracy = [
    { model: "SVM", accuracy: 92 },
    { model: "KNN", accuracy: 85 },
    { model: "Naïve Bayes", accuracy: 80 },
    { model: "CNN", accuracy: 95 },
    { model: "LSTM", accuracy: 96 },
    { model: "HMMs", accuracy: 78 },
    { model: "Bayesian", accuracy: 82 },
    { model: "DBSCAN", accuracy: 75 },
    { model: "Hybrid (SVM+CNN+HMM)", accuracy: 97 },
  ]

  const heatmapData = data?.locationRisk || [
    { region: "Delhi", risk: 0.87 },
    { region: "Mumbai", risk: 0.65 },
    { region: "Bangalore", risk: 0.74 },
    { region: "Hyderabad", risk: 0.91 },
    { region: "Chennai", risk: 0.58 },
  ]

  const featureImportance = data?.parameterAverages?.map((param: ParameterAverage) => ({
    feature: param.parameter,
    importance: param.average
  })) || []

  const diseaseData = data?.diseaseDistribution || []
  const timeSeriesData = diseaseData.map((item: DiseaseDistribution, index: number) => ({
    year: 2020 + index,
    cases: item.count
  }))

  const clusterData = data?.locationRisk?.map((location: LocationRisk) => ({
    x: location.risk,
    y: Math.random(),
    cluster: location.region
  })) || []

  const pieData = data?.diseaseDistribution?.map((d: DiseaseDistribution) => ({
    name: d.disease,
    value: d.count
  })) || []

  const histogramData = data?.locationRisk?.map((location: LocationRisk) => ({
    confidence: location.risk
  })) || []

  const radarData = data?.parameterAverages?.map((param: ParameterAverage) => ({
    metric: param.parameter,
    score: param.average
  })) || []

  const charts = [
    {
      title: "Model Accuracy Comparison",
      content: (
        <BarChart data={modelAccuracy}>
          <XAxis dataKey="model" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="accuracy" fill="#8884d8" />
        </BarChart>
      ),
    },
    {
      title: "Region-Wise Disease Risk Heatmap",
      content: (
        <BarChart data={heatmapData}>
          <XAxis dataKey="region" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="risk" fill="#ff6961" />
        </BarChart>
      ),
    },
    {
      title: "Feature Importance Analysis",
      content: (
        <BarChart data={featureImportance} layout="vertical">
          <XAxis type="number" />
          <YAxis dataKey="feature" type="category" />
          <Tooltip />
          <Bar dataKey="importance" fill="#82ca9d" />
        </BarChart>
      ),
    },
    {
      title: "Disease Trend Over Time",
      content: (
        <LineChart data={timeSeriesData}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="cases" stroke="#8884d8" />
        </LineChart>
      ),
    },
    {
      title: "Clustering & Anomaly Detection",
      content: (
        <ScatterChart>
          <CartesianGrid />
          <XAxis dataKey="x" type="number" />
          <YAxis dataKey="y" type="number" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={clusterData} fill="#8884d8" />
        </ScatterChart>
      ),
    },
    {
      title: "Region-Wise Case Distribution",
      content: (
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {pieData.map((entry: { name: string; value: number }, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      ),
    },
    {
      title: "Prediction Confidence Distribution",
      content: (
        <BarChart data={histogramData}>
          <XAxis dataKey="confidence" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="confidence" fill="#8884d8" />
        </BarChart>
      ),
    },
    {
      title: "Model Performance Metrics",
      content: (
        <RadarChart outerRadius={90} data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis />
          <Radar
            name="Metrics"
            dataKey="score"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      ),
    },
  ]

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {charts.map((chart, index) => (
        <div
          key={index}
          className="rounded-xl border shadow-sm p-4 hover:bg-muted cursor-pointer transition-all"
          onClick={() => setOpenModalIndex(index)}
        >
          <h3 className="text-lg font-semibold mb-2">{chart.title}</h3>
          <ResponsiveContainer width="100%" height={200}>
            {chart.content}
          </ResponsiveContainer>
        </div>
      ))}

      {openModalIndex !== null && (
        <ChartModal
          open={true}
          onClose={() => setOpenModalIndex(null)}
          title={charts[openModalIndex].title}
        >
          <ResponsiveContainer width="100%" height="100%">
            {charts[openModalIndex].content}
          </ResponsiveContainer>
        </ChartModal>
      )}
    </div>
  )
}