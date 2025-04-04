"use client"

import {
  BarChart, Bar,
  LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell,
  AreaChart, Area,
  RadialBarChart, RadialBar,
  ComposedChart, CartesianGrid, Tooltip, Legend, XAxis, YAxis, ResponsiveContainer
} from "recharts"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, BarChart3, LineChart as LineIcon, PieChart as PieIcon } from "lucide-react"

const COLORS = ["#34d399", "#3b82f6", "#facc15", "#f87171", "#a78bfa"]

const data = [
  { name: "SVM", accuracy: 89, precision: 91, recall: 87 },
  { name: "KNN", accuracy: 85, precision: 84, recall: 86 },
  { name: "Naive Bayes", accuracy: 82, precision: 83, recall: 81 },
  { name: "CNN", accuracy: 93, precision: 94, recall: 92 },
  { name: "LSTM", accuracy: 91, precision: 90, recall: 92 },
  { name: "HMM", accuracy: 87, precision: 88, recall: 86 },
  { name: "Bayesian", accuracy: 84, precision: 85, recall: 83 },
  { name: "DBSCAN", accuracy: 81, precision: 80, recall: 82 },
]

export default function VisualizationPage() {
  return (
    <div className="min-h-screen bg-white p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Model Performance Visualizations</h2>
          <p className="text-muted-foreground">View various charts to interpret model performance metrics</p>
        </div>

        <Tabs defaultValue="bar" className="space-y-6">
          <TabsList className="grid grid-cols-4 gap-2 bg-muted p-2 rounded-xl">
            <TabsTrigger value="bar"><BarChart3 className="inline w-4 h-4 mr-1" /> Bar</TabsTrigger>
            <TabsTrigger value="line"><LineIcon className="inline w-4 h-4 mr-1" /> Line</TabsTrigger>
            <TabsTrigger value="radar"><Eye className="inline w-4 h-4 mr-1" /> Radar</TabsTrigger>
            <TabsTrigger value="pie"><PieIcon className="inline w-4 h-4 mr-1" /> Pie</TabsTrigger>
          </TabsList>

          <TabsContent value="bar">
            <div className="h-[400px] bg-gray-50 p-4 rounded-xl border">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="accuracy" fill="#34d399" />
                  <Bar dataKey="precision" fill="#3b82f6" />
                  <Bar dataKey="recall" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="line">
            <div className="h-[400px] bg-gray-50 p-4 rounded-xl border">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="accuracy" stroke="#34d399" />
                  <Line type="monotone" dataKey="precision" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="recall" stroke="#f59e0b" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="radar">
            <div className="h-[400px] bg-gray-50 p-4 rounded-xl border">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis />
                  <Radar name="Accuracy" dataKey="accuracy" stroke="#34d399" fill="#34d399" fillOpacity={0.6} />
                  <Radar name="Precision" dataKey="precision" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                  <Radar name="Recall" dataKey="recall" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="pie">
            <div className="grid grid-cols-3 gap-4">
              {["accuracy", "precision", "recall"].map((metric, idx) => (
                <div key={metric} className="bg-gray-50 rounded-xl p-4 border h-[300px]">
                  <h4 className="text-center font-semibold capitalize mb-2">{metric} Distribution</h4>
                  <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                      <Pie
                        data={data}
                        dataKey={metric}
                        nameKey="name"
                        outerRadius={100}
                        fill={COLORS[idx]}
                        label
                      >
                        {data.map((_, i) => (
                          <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}