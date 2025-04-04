"use client"

import React, { useState } from "react"
import { Upload, FileUp, AlertCircle } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

const ALLOWED_FILE_TYPES = ["text/csv", "application/json", "application/x-fasta", ".fasta"]

const MODELS = [
  { id: "svm", name: "Support Vector Machine (SVM)" },
  { id: "knn", name: "K-Nearest Neighbors (KNN)" },
  { id: "naive-bayes", name: "Naïve Bayes" },
  { id: "cnn", name: "Convolutional Neural Network (CNN)" },
  { id: "lstm", name: "Long Short-Term Memory (LSTM)" },
  { id: "hmm", name: "Hidden Markov Model (HMM)" },
  { id: "bayesian", name: "Bayesian Model" },
  { id: "dbscan", name: "DBSCAN Clustering" },
]

const MOCK_RESULTS = {
  svm: { accuracy: 0.89, precision: 0.91, recall: 0.87 },
  knn: { accuracy: 0.85, precision: 0.84, recall: 0.86 },
  "naive-bayes": { accuracy: 0.82, precision: 0.83, recall: 0.81 },
  cnn: { accuracy: 0.93, precision: 0.94, recall: 0.92 },
  lstm: { accuracy: 0.91, precision: 0.9, recall: 0.92 },
  hmm: { accuracy: 0.87, precision: 0.88, recall: 0.86 },
  bayesian: { accuracy: 0.84, precision: 0.85, recall: 0.83 },
  dbscan: { accuracy: 0.81, precision: 0.8, recall: 0.82 },
}

export default function ModelSelector() {
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const validateFile = (file: File) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("Please upload a CSV, FASTA, or JSON file")
      return false
    }
    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile)
      setError("")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile)
      setError("")
    }
  }

  const simulateAnalysis = async () => {
    if (!selectedModel || !file) return
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setResults(MOCK_RESULTS[selectedModel as keyof typeof MOCK_RESULTS])
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-3xl p-10 bg-white rounded-2xl shadow-xl space-y-8 border border-gray-200">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-extrabold">DNA Sequence Analysis</h2>
          <p className="text-muted-foreground text-sm">
            Select a model and upload your DNA dataset to begin analysis
          </p>
        </div>

        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setIsDragging(false)
          }}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-300"
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Drag and drop your file here, or{" "}
                <label className="text-primary hover:underline cursor-pointer">
                  browse
                  <input
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept=".csv,.json,.fasta"
                  />
                </label>
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: CSV, FASTA, JSON
              </p>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {file && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FileUp className="h-4 w-4" />
            <span>{file.name}</span>
          </div>
        )}

        {isLoading && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Analyzing data...</p>
            <Progress value={66} />
          </div>
        )}

        {results && (
          <div className="rounded-xl border p-4 space-y-3 bg-gray-50">
            <h3 className="font-semibold text-lg text-center">Analysis Results</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-2xl font-bold text-green-600">
                  {(results.accuracy * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Precision</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(results.precision * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recall</p>
                <p className="text-2xl font-bold text-orange-600">
                  {(results.recall * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          className={`w-full px-6 py-3 rounded-xl text-white text-sm font-semibold transition-colors ${
            selectedModel && file
              ? "bg-primary hover:bg-primary/90"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!selectedModel || !file}
          onClick={simulateAnalysis}
        >
          Analyze Dataset
        </button>
      </div>
    </div>
  )
}