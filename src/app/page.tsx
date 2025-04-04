"use client"

import React, { useEffect, useState } from "react"
import { Lightbulb, Info, Users, Clock } from "lucide-react"
import Image from "next/image"

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Logo + Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">


            <Image
              src="/srmlogo.png"
              alt="SRM Logo"
              width={120}
              height={120}
              className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm"
            />
            <div>
              <h1 className="text-3xl font-bold text-primary">DNA Sequence Classification Dashboard</h1>
              <p className="text-muted-foreground">Major Project | SRMIST, Chennai</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{currentTime.toLocaleString()}</span>
          </div>
        </div>

        {/* Project Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 border rounded-xl shadow hover:shadow-md transition bg-gray-50">
            <Lightbulb className="w-8 h-8 mx-auto text-primary mb-3" />
            <h2 className="text-lg font-semibold">Objective</h2>
            <p className="text-sm text-muted-foreground mt-2">
              This dashboard enables classification and analysis of DNA sequences using AI-based models with visual insights.
            </p>
          </div>

          <div className="p-6 border rounded-xl shadow hover:shadow-md transition bg-gray-50">
            <Info className="w-8 h-8 mx-auto text-blue-600 mb-3" />
            <h2 className="text-lg font-semibold">Features</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Upload datasets (CSV/FASTA/JSON), select models (SVM, CNN, etc.), view metrics, generate reports, and visualize results.
            </p>
          </div>

          <div className="p-6 border rounded-xl shadow hover:shadow-md transition bg-gray-50">
            <Users className="w-8 h-8 mx-auto text-green-600 mb-3" />
            <h2 className="text-lg font-semibold">Team</h2>
            <p className="text-sm text-muted-foreground mt-2">
              By <strong>Anvit Pawar</strong> & <strong>Anya Gupta</strong><br />
              Supervised by <br />
              Dr. Jeya, Dr. Senthil Kumar K, and Dr. Bhargavi
            </p>
          </div>
        </div>

        <div className="text-center mt-10 text-muted-foreground">
          Use the sidebar to navigate between modules for analysis, reports, research articles, and insights.
        </div>
      </div>
    </div>
  )
}