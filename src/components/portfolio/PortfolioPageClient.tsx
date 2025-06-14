
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { PortfolioSummaryCards } from './PortfolioSummaryCards';
import { InvestmentBreakdownChart } from './InvestmentBreakdownChart';
import { InvestmentList } from './InvestmentList';
import { AIPortfolioProjection } from './AIPortfolioProjection';
import { SectionTitle } from '@/components/quantum-trade/SectionTitle';
import { Button } from '@/components/ui/button';
import { Briefcase, PieChart, ListChecks, BrainCircuit, AlertTriangle, Info, TrendingUp, ArrowLeft } from 'lucide-react';
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
          const parsedData = JSON.parse(savedData);
          // Ensure parsedData is an array before setting
          setRawPositions(Array.isArray(parsedData) ? parsedData : []);
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

    let totalInvestedGlobal = 0;
    let currentPortfolioValueGlobal = 0;

    const positions: PortfolioPosition[] = rawPositions
      .filter(rawPos => rawPos && typeof rawPos.id === 'string' && typeof rawPos.ticker === 'string') // Filter malformed entries
      .map(rawPos => {
        // Sanitize core numeric fields from rawPos (from localStorage)
        const quantity = typeof rawPos.quantity === 'number' && !isNaN(rawPos.quantity) ? rawPos.quantity : 0;
        const purchasePrice = typeof rawPos.purchasePrice === 'number' && !isNaN(rawPos.purchasePrice) ? rawPos.purchasePrice : 0;
        const currentMockPrice = typeof rawPos.currentMockPrice === 'number' && !isNaN(rawPos.currentMockPrice) ? rawPos.currentMockPrice : 0;
        
        // Sanitize optional numeric fields (targetPrice, stopLossPrice)
        let pTargetPrice: number | undefined = undefined;
        if (rawPos.targetPrice != null && typeof rawPos.targetPrice === 'number' && !isNaN(rawPos.targetPrice)) {
          pTargetPrice = rawPos.targetPrice;
        }

        let pStopLossPrice: number | undefined = undefined;
        if (rawPos.stopLossPrice != null && typeof rawPos.stopLossPrice === 'number' && !isNaN(rawPos.stopLossPrice)) {
          pStopLossPrice = rawPos.stopLossPrice;
        }
        
        // Sanitize other fields
        const mode = rawPos.mode === 'autopilot' || rawPos.mode === 'manual' ? rawPos.mode : 'manual';
        const purchaseDate = typeof rawPos.purchaseDate === 'string' ? rawPos.purchaseDate : new Date(0).toISOString();
        const simulatedVolatilityFactor = typeof rawPos.simulatedVolatilityFactor === 'number' && !isNaN(rawPos.simulatedVolatilityFactor) ? rawPos.simulatedVolatilityFactor : 0;

        // Calculated fields
        const investedInStock = quantity * purchasePrice;
        const currentValueForStock = quantity * currentMockPrice;
        const profitLossForStock = currentValueForStock - investedInStock;
        const profitLossPercentageForStock = investedInStock === 0 ? 0 : (profitLossForStock / investedInStock) * 100;

        totalInvestedGlobal += investedInStock;
        currentPortfolioValueGlobal += currentValueForStock;

        return {
          id: rawPos.id,
          ticker: rawPos.ticker,
          quantity,
          purchasePrice,
          currentMockPrice,
          targetPrice: pTargetPrice,
          stopLossPrice: pStopLossPrice,
          mode,
          purchaseDate,
          simulatedVolatilityFactor,
          totalInvested: investedInStock,
          currentValue: currentValueForStock,
          profitLoss: profitLossForStock,
          profitLossPercentage: profitLossPercentageForStock,
        };
      });

    const overallProfitLoss = currentPortfolioValueGlobal - totalInvestedGlobal;
    const overallProfitLossPercentage = totalInvestedGlobal === 0 ? 0 : (overallProfitLoss / totalInvestedGlobal) * 100;

    const summary: PortfolioSummary = {
      currentPortfolioValue: currentPortfolioValueGlobal,
      totalInvested: totalInvestedGlobal,
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
            currentPrice: p.currentMockPrice, 
            purchaseDate: p.purchaseDate,
          }));

          if (aiInputPositions.length > 0) {
            const predictionResult = await predictPortfolioValue({ positions: aiInputPositions, days: 10 });
            setAiPrediction(predictionResult);
          } else {
            setAiPrediction(null); 
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
    } else if (portfolioData.positions.length === 0) {
        setAiPrediction(null); 
        setIsPredicting(false);
        setPredictionError(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [portfolioData.positions, isPredicting]); // Removed aiPrediction from deps to avoid re-fetching if it's already set


  if (isLoadingPositions) {
    return (
      <div className="space-y-12">
        <div className="mb-6">
          <Skeleton className="h-10 w-40" />
        </div>
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
      <div className="space-y-6">
        <Link href="/" passHref>
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="text-center py-16">
          <TrendingUp className="mx-auto h-16 w-16 text-primary mb-6" />
          <h2 className="text-3xl font-semibold mb-3">Your Portfolio is Empty</h2>
          <p className="text-muted-foreground mb-6">Start by making some simulated trades on the dashboard!</p>
          <p className="text-sm text-muted-foreground">Once you buy stocks, they will appear here.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-12">
      <Link href="/" passHref>
        <Button variant="outline" className="mb-6 shadow-md hover:shadow-primary/20 transition-shadow">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
      
      <SectionTitle title="My Portfolio" icon={Briefcase} />

      <PortfolioSummaryCards summary={portfolioData.summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-6">
          <SectionTitle title="Investment Breakdown" icon={PieChart} className="text-2xl mb-3" />
          {portfolioData.donutChartData.length > 0 ? (
            <InvestmentBreakdownChart data={portfolioData.donutChartData} totalInvestment={portfolioData.summary.totalInvested} />
          ) : (
            <Card className="shadow-lg hover:shadow-accent/20 transition-shadow duration-300">
              <CardContent className="pt-6 flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <Info className="h-10 w-10 mb-4 text-accent" />
                <p>No investments to display in chart.</p>
                <p className="text-xs">Chart appears once you have holdings.</p>
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

