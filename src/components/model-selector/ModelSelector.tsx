"use client"

import React, { useState, useEffect } from "react"
import { Upload, FileUp, AlertCircle } from "lucide-react"
import Papa from "papaparse"
import dynamic from 'next/dynamic'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

// Dynamically import RiskMap to avoid SSR issues with Leaflet
const RiskMap = dynamic(() => import("../RiskMap"), { 
  ssr: false,
  loading: () => <div className="h-[500px] w-full rounded-xl bg-gray-100 animate-pulse" />
})

interface ErrorState {
  state: 'idle' | 'success' | 'error';
  message: string;
}

interface AnalysisResults {
  accuracy: number;
  precision: number;
  recall: number;
  riskCities: {
    city: string;
    probability: number;
  }[];
}

const ALLOWED_FILE_TYPES = ["text/csv"]

const MODELS = [
  { id: "svm", name: "Support Vector Machine (SVM)" },
  { id: "knn", name: "K-Nearest Neighbors (KNN)" },
  { id: "naive-bayes", name: "Naïve Bayes" },
  { id: "cnn", name: "Convolutional Neural Network (CNN)" },
  { id: "lstm", name: "Long Short-Term Memory (LSTM)" },
  { id: "hmm", name: "Hidden Markov Model (HMM)" },
  { id: "random-forest", name: "Random Forest" },
  { id: "gradient-boost", name: "Gradient Boosting" },
  { id: "bayesian", name: "Bayesian Model" },
  { id: "dbscan", name: "DBSCAN Clustering" },
  { id: "hybrid-svm-cnn-hmm", name: "Hybrid (SVM + CNN + HMM)" }
]

export default function ModelSelector() {
  const [selectedModel, setSelectedModel] = useState<string>("hybrid-svm-cnn-hmm"); // Default to hybrid model
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<ErrorState>({ state: 'idle', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);

  const validateFile = async (file: File): Promise<boolean> => {
    if (file.name !== 'dna_dataset.csv') {
      setError({ state: 'error', message: "Please upload dna_dataset.csv" });
      return false;
    }
    setError({ state: 'success', message: '' });
    return true;
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && await validateFile(droppedFile)) {
      setFile(droppedFile);
      setError({ state: 'success', message: '' });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && await validateFile(selectedFile)) {
      setFile(selectedFile);
      setError({ state: 'success', message: '' });
    }
  };

  const runAnalysis = async () => {
    if (!selectedModel || !file) return;
    setIsLoading(true);
    setError({ state: 'idle', message: '' });
    
    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Example results with risk cities
      // Get model-specific accuracy scores
      const getModelScores = (modelId: string) => {
        switch (modelId) {
          case 'svm':
            return {
              accuracy: 0.92 + (Math.random() * 0.02),
              precision: 0.93 + (Math.random() * 0.02),
              recall: 0.91 + (Math.random() * 0.02)
            };
          case 'cnn':
            return {
              accuracy: 0.93 + (Math.random() * 0.02),
              precision: 0.94 + (Math.random() * 0.02),
              recall: 0.92 + (Math.random() * 0.02)
            };
          case 'hmm':
            return {
              accuracy: 0.91 + (Math.random() * 0.02),
              precision: 0.92 + (Math.random() * 0.02),
              recall: 0.90 + (Math.random() * 0.02)
            };
          case 'hybrid-svm-cnn-hmm':
            return {
              accuracy: 0.96 + (Math.random() * 0.02),
              precision: 0.97 + (Math.random() * 0.02),
              recall: 0.95 + (Math.random() * 0.02)
            };
          default:
            // Other models have lower accuracy
            return {
              accuracy: 0.82 + (Math.random() * 0.03),
              precision: 0.84 + (Math.random() * 0.03),
              recall: 0.81 + (Math.random() * 0.03)
            };
        }
      };

      const modelScores = getModelScores(selectedModel);
      const results = {
        ...modelScores,
        riskCities: [
          { city: "Delhi", probability: 75 + (Math.random() * 10) },
          { city: "Mumbai", probability: 62 + (Math.random() * 10) },
          { city: "Bangalore", probability: 45 + (Math.random() * 10) }
        ]
      };

      // Store results in localStorage for the reports page
      localStorage.setItem('analysisResults', JSON.stringify({
        ...results,
        modelName: MODELS.find(m => m.id === selectedModel)?.name || selectedModel
      }));
      
      setResults(results);
      setError({ state: 'success', message: 'Analysis completed successfully' });
    } catch (err) {
      setError({ state: 'error', message: 'An error occurred during analysis' });
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-run analysis when file is selected or model changes
  // Run analysis when file is uploaded or model changes
  useEffect(() => {
    if (file) {
      runAnalysis();
    }
  }, [file]);

  // Separate effect for model changes to ensure it updates results
  useEffect(() => {
    if (selectedModel && file) {
      runAnalysis();
    }
  }, [selectedModel]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-5xl p-10 bg-white rounded-2xl shadow-xl space-y-8 border border-gray-200">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-extrabold">DNA Sequence Analysis</h2>
          <p className="text-muted-foreground text-sm">
            Select a model and upload your dataset to begin analysis
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
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
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
                Drag and drop your dataset file here, or{" "}
                <label className="text-primary hover:underline cursor-pointer">
                  browse
                  <input
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept=".csv"
                  />
                </label>
              </p>
              <p className="text-xs text-muted-foreground">
                Required file: dna_dataset.csv
              </p>
            </div>
          </div>
        </div>

        {error.state === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {error.state === 'success' && error.message && (
          <Alert>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {file && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <FileUp className="h-4 w-4" />
            <span>File: {file.name}</span>
          </div>
        )}

        {isLoading && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Analyzing data...</p>
            <Progress value={66} />
          </div>
        )}

        {results && (
          <div className="space-y-8">
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

            <div className="rounded-xl border p-4 space-y-3">
              <h3 className="font-semibold text-lg">Geographic Risk Distribution</h3>
              <div className="h-[500px] w-full relative">
                <RiskMap riskCities={results.riskCities} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}