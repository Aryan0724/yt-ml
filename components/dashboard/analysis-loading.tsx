"use client"

import React, { useState, useEffect } from "react"
import { Loader2, Server, Scan, Activity } from "lucide-react"
import { Card } from "@/components/ui/card"

const steps = [
  "Initializing analysis engine...",
  "Processing image heuristics...",
  "Extracting visual subjects...",
  "Scanning text overlay legibility...",
  "Calculating click-through probability...",
  "Benchmarking against category baselines...",
  "Finalizing optimization report..."
]

export function AnalysisLoading() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="w-full max-w-xl mx-auto py-12 px-8">
      <div className="space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
            <div className="w-16 h-16 rounded-full bg-muted border flex items-center justify-center relative z-10">
              <Scan className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground tracking-tight">
              Evaluating Package
            </h3>
            <p className="text-sm text-muted-foreground">
              Running deterministic checks on thumbnail and title
            </p>
          </div>
        </div>

        <div className="bg-muted/30 rounded-xl border p-4 space-y-3 font-mono text-sm">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-3 transition-opacity duration-300 ${
                idx === currentStep 
                  ? "opacity-100 text-primary font-medium" 
                  : idx < currentStep 
                  ? "opacity-50 text-muted-foreground" 
                  : "hidden"
              }`}
            >
              {idx === currentStep ? (
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              ) : (
                <Activity className="w-4 h-4 shrink-0" />
              )}
              <span className="truncate">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
