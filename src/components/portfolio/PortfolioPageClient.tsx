
"use client";

import { useState, useEffect, useMemo } from 'react';
import { PortfolioSummaryCards } from './PortfolioSummaryCards';
import { InvestmentBreakdownChart } from './InvestmentBreakdownChart';
import { InvestmentList } from './InvestmentList';
import { AIPortfolioProjection } from './AIPortfolioProjection';
import { SectionTitle } from '@/components/quantum-trade/SectionTitle';
import { Briefcase, PieChart, ListChecks, BrainCircuit, AlertTriangle, Info, TrendingUp } from 'lucide-react';
import type { ActivePosition, PortfolioPosition, PortfolioSummary, DonutChartData } from '@/types';
import { predictPortfolioValue, type PredictPortfolioValueOutput } from '@/ai/flows/predict-portfolio-value';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(181, 100%, 60%)",
  "hsl(271, 100%, 70%)",
];


export function PortfolioPageClient() {
  const [rawPositions, setRawPositions] = useState<ActivePosition[]>([]);
  const [isLoadingPositions, setIsLoadingPositions] = useState(true);
  const [aiPrediction, setAiPrediction] = useState<PredictPortfolioValueOutput | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('quantumTradePortfolio');
      if (savedData) {
        try {
          const parsedPositions = JSON.parse(savedData) as ActivePosition[];
          setRawPositions(parsedPositions);
        } catch (error) {
          console.error("Failed to parse portfolio from localStorage", error);
          setRawPositions([]);
        }
      }
      setIsLoadingPositions(false);
    }
  }, []);

  const portfolioData = useMemo(() => {
    if (!rawPositions || rawPositions.length === 0) {
      return {
        positions: [],
        summary: {
          currentPortfolioValue: 0,
          totalInvested: 0,
          overallProfitLoss: 0,
          overallProfitLossPercentage: 0,
        },
        donutChartData: [],
      };
    }

    let totalInvested = 0;
    let currentPortfolioValue = 0;

    const positions: PortfolioPosition[] = rawPositions.map(pos => {
      const investedInStock = pos.quantity * pos.purchasePrice;
      const currentValueForStock = pos.quantity * pos.currentMockPrice;
      const profitLossForStock = currentValueForStock - investedInStock;
      const profitLossPercentageForStock = investedInStock === 0 ? 0 : (profitLossForStock / investedInStock) * 100;

      totalInvested += investedInStock;
      currentPortfolioValue += currentValueForStock;

      return {
        ...pos,
        totalInvested: investedInStock,
        currentValue: currentValueForStock,
        profitLoss: profitLossForStock,
        profitLossPercentage: profitLossPercentageForStock,
      };
    });

    const overallProfitLoss = currentPortfolioValue - totalInvested;
    const overallProfitLossPercentage = totalInvested === 0 ? 0 : (overallProfitLoss / totalInvested) * 100;

    const summary: PortfolioSummary = {
      currentPortfolioValue,
      totalInvested,
      overallProfitLoss,
      overallProfitLossPercentage,
    };
    
    const donutChartData: DonutChartData[] = positions.map((pos, index) => ({
        name: pos.ticker,
        value: pos.totalInvested,
        fill: CHART_COLORS[index % CHART_COLORS.length],
    })).filter(item => item.value > 0);


    return { positions, summary, donutChartData };
  }, [rawPositions]);

  useEffect(() => {
    if (portfolioData.positions.length > 0 && !aiPrediction && !isPredicting) {
      const fetchPrediction = async () => {
        setIsPredicting(true);
        setPredictionError(null);
        try {
          const aiInputPositions = portfolioData.positions.map(p => ({
            ticker: p.ticker,
            quantity: p.quantity,
            purchasePrice: p.purchasePrice,
            currentPrice: p.currentMockPrice, // Use current mock price for prediction base
            purchaseDate: p.purchaseDate,
          }));

          if (aiInputPositions.length > 0) {
            const prediction = await predictPortfolioValue({ positions: aiInputPositions, days: 10 });
            setAiPrediction(prediction);
          } else {
            setAiPrediction(null); // No positions to predict
          }
        } catch (error) {
          console.error("Failed to get AI portfolio prediction:", error);
          setPredictionError("Could not fetch AI projection. Please try again later.");
          setAiPrediction(null);
        } finally {
          setIsPredicting(false);
        }
      };
      fetchPrediction();
    }
  }, [portfolioData.positions, aiPrediction, isPredicting]);


  if (isLoadingPositions) {
    return (
      <div className="space-y-12">
        <SectionTitle title="My Portfolio" icon={Briefcase} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <SectionTitle title="Investment Breakdown" icon={PieChart} className="mb-3" />
            <Card><CardContent className="pt-6"><Skeleton className="h-64 w-full rounded-full" /></CardContent></Card>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <SectionTitle title="Holdings" icon={ListChecks} className="mb-3" />
            <Card><CardContent className="pt-6 space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent></Card>
          </div>
        </div>
         <SectionTitle title="10-Day AI Projection" icon={BrainCircuit} />
         <Card><CardContent className="pt-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
      </div>
    );
  }
  
  if (portfolioData.positions.length === 0 && !isLoadingPositions) {
    return (
      <div className="text-center py-16">
        <TrendingUp className="mx-auto h-16 w-16 text-primary mb-6" />
        <h2 className="text-3xl font-semibold mb-3">Your Portfolio is Empty</h2>
        <p className="text-muted-foreground mb-6">Start by making some simulated trades on the dashboard!</p>
        <p className="text-sm text-muted-foreground">Once you buy stocks, they will appear here.</p>
      </div>
    );
  }


  return (
    <div className="space-y-12">
      <SectionTitle title="My Portfolio" icon={Briefcase} />

      <PortfolioSummaryCards summary={portfolioData.summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-6">
          <SectionTitle title="Investment Breakdown" icon={PieChart} className="text-2xl mb-3" />
          {portfolioData.donutChartData.length > 0 ? (
            <InvestmentBreakdownChart data={portfolioData.donutChartData} totalInvestment={portfolioData.summary.totalInvested} />
          ) : (
            <Card>
              <CardContent className="pt-6 flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Info className="h-10 w-10 mb-4 text-accent" />
                <p>No investments to display in chart.</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <SectionTitle title="Holdings" icon={ListChecks} className="text-2xl mb-3" />
          <InvestmentList positions={portfolioData.positions} />
        </div>
      </div>
      
      <AIPortfolioProjection
        prediction={aiPrediction}
        isLoading={isPredicting}
        error={predictionError}
      />

    </div>
  );
}
