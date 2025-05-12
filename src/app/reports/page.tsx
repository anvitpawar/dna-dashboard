"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { saveAs } from "file-saver";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Save, Download } from "lucide-react";
import { processCSVData } from '@/lib/dataProcessing';

// Lazy load the map component to avoid SSR issues
const RiskMap = dynamic(() => import("@/components/RiskMap"), { 
  ssr: false,
  loading: () => <div className="h-[500px] w-full rounded-xl bg-gray-100 animate-pulse" />
});

interface AnalysisData {
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  riskCities: {
    city: string;
    probability: number;
  }[];
  diseaseDistribution: {
    name: string;
    value: number;
  }[];
  parameterTrends: {
    name: string;
    mutation: number;
    expression: number;
    methylation: number;
  }[];
  sequencePatterns: {
    pattern: string;
    frequency: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ReportsPage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    modelName: "Hybrid (SVM + CNN + HMM)",
    accuracy: 0.96,
    precision: 0.97,
    recall: 0.95,
    riskCities: [
      { city: "Delhi", probability: 75 },
      { city: "Mumbai", probability: 62 },
      { city: "Bangalore", probability: 45 }
    ],
    diseaseDistribution: [
      { name: "Cancer", value: 35 },
      { name: "Alzheimer's", value: 25 },
      { name: "Cystic Fibrosis", value: 20 },
      { name: "Sickle Cell", value: 15 },
      { name: "Others", value: 5 }
    ],
    parameterTrends: [
      { name: "Sample 1", mutation: 0.85, expression: 0.90, methylation: 0.88 },
      { name: "Sample 2", mutation: 0.87, expression: 0.88, methylation: 0.90 },
      { name: "Sample 3", mutation: 0.90, expression: 0.92, methylation: 0.91 },
      { name: "Sample 4", mutation: 0.91, expression: 0.93, methylation: 0.92 }
    ],
    sequencePatterns: [
      { pattern: "ATCG", frequency: 45 },
      { pattern: "GCTA", frequency: 35 },
      { pattern: "TACG", frequency: 30 },
      { pattern: "CGTA", frequency: 25 }
    ]
  });

  useEffect(() => {
    // Load analysis results from localStorage
    const savedResults = localStorage.getItem('analysisResults');
    if (savedResults) {
      const baseResults = JSON.parse(savedResults);
      // Merge with additional analysis data
      setAnalysisData(curr => ({
        ...curr,
        ...baseResults
      }));
    }
  }, []);

  const handleExportPDF = async () => {
    try {
      const response = await fetch('/api/pdf');
      const blob = await response.blob();
      saveAs(blob, 'analysis-report.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">DNA Analysis Report</h1>
          <p className="text-muted-foreground mt-2">Analysis performed using {analysisData.modelName}</p>
        </div>
        <Button onClick={handleExportPDF}>
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Model Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Model Performance</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-2xl font-bold text-green-600">
                {(analysisData.accuracy * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Precision</p>
              <p className="text-2xl font-bold text-blue-600">
                {(analysisData.precision * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recall</p>
              <p className="text-2xl font-bold text-orange-600">
                {(analysisData.recall * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Disease Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analysisData.diseaseDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analysisData.diseaseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <RechartTooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Parameter Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Parameter Correlation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analysisData.parameterTrends}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar name="Mutation Rate" dataKey="mutation" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Radar name="Gene Expression" dataKey="expression" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
              <Radar name="Methylation" dataKey="methylation" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sequence Pattern Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analysisData.sequencePatterns}>
              <XAxis dataKey="pattern" />
              <YAxis />
              <RechartTooltip />
              <Bar dataKey="frequency" fill="#8884d8">
                {analysisData.sequencePatterns.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Geographic Risk Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Geographic Risk Distribution</h3>
        <div className="h-[500px] w-full relative">
          <RiskMap riskCities={analysisData.riskCities} />
        </div>
      </Card>

      {/* Detailed Risk Analysis Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Risk Analysis by Region</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Region</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Predominant Disease</TableHead>
              <TableHead>Pattern Match</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analysisData.riskCities.map((city) => (
              <TableRow key={city.city}>
                <TableCell className="font-medium">{city.city}</TableCell>
                <TableCell>
                  <div className={`px-3 py-1 rounded-full text-sm inline-block ${
                    city.probability > 70 ? 'bg-red-100 text-red-800' :
                    city.probability > 50 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {city.probability > 70 ? 'High' :
                     city.probability > 50 ? 'Medium' : 'Low'}
                  </div>
                </TableCell>
                <TableCell>
                  {analysisData.diseaseDistribution[0].name}
                </TableCell>
                <TableCell>
                  {((city.probability / 100) * analysisData.accuracy * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}