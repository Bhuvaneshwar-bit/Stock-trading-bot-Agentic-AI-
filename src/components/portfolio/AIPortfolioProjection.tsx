
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, TrendingUp, TrendingDown, Loader2, AlertTriangle } from "lucide-react";
import type { PredictPortfolioValueOutput } from "@/ai/flows/predict-portfolio-value";
import { cn } from "@/lib/utils";

interface AIPortfolioProjectionProps {
  prediction: PredictPortfolioValueOutput | null;
  isLoading: boolean;
  error: string | null;
}

export function AIPortfolioProjection({ prediction, isLoading, error }: AIPortfolioProjectionProps) {
  return (
    <section aria-labelledby="ai-projection-title">
      <Card className="shadow-xl hover:shadow-accent/20 transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center mb-2">
            <BrainCircuit className="h-8 w-8 mr-3 text-primary drop-shadow-neon-primary" />
            <CardTitle id="ai-projection-title" className="text-2xl font-headline">10-Day AI Portfolio Projection</CardTitle>
          </div>
          <CardDescription>AI-powered insights into your portfolio's potential performance over the next 10 days.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col items-center justify-center min-h-[150px] text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
              <p className="text-lg">Generating AI Projection...</p>
              <p className="text-sm">This may take a few moments.</p>
            </div>
          )}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center min-h-[150px] text-destructive-foreground bg-destructive/10 border border-destructive/30 p-6 rounded-md">
              <AlertTriangle className="h-10 w-10 mb-4 text-destructive" />
              <p className="text-lg font-semibold">Projection Error</p>
              <p className="text-sm text-center">{error}</p>
            </div>
          )}
          {!isLoading && !error && prediction && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
                <div className="p-4 bg-card/50 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-1">Projected Value</p>
                  <p className="text-2xl font-bold text-primary">${prediction.projectedValue.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-card/50 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-1">Projected Profit/Loss</p>
                  <p className={cn("text-2xl font-bold", prediction.projectedProfitLoss >= 0 ? "text-green-500" : "text-red-500")}>
                    {prediction.projectedProfitLoss >= 0 ? <TrendingUp className="inline h-5 w-5 mr-1" /> : <TrendingDown className="inline h-5 w-5 mr-1" />}
                    ${prediction.projectedProfitLoss.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-card/50 rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-1">Projected P/L %</p>
                   <p className={cn("text-2xl font-bold", prediction.projectedProfitLossPercentage >= 0 ? "text-green-500" : "text-red-500")}>
                    {prediction.projectedProfitLossPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 text-accent">AI Analysis:</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap p-4 border rounded-md bg-card/50 min-h-[80px]">
                  {prediction.analysis || "No detailed analysis provided."}
                </p>
              </div>
            </div>
          )}
           {!isLoading && !error && !prediction && (
             <div className="flex flex-col items-center justify-center min-h-[150px] text-muted-foreground">
                <BrainCircuit className="h-10 w-10 mb-4 text-accent" />
                <p className="text-lg">No Projection Available</p>
                <p className="text-sm text-center">AI projection will appear once you have active investments.</p>
            </div>
           )}
        </CardContent>
      </Card>
    </section>
  );
}
