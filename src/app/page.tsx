
"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { StockAnalysisCard } from '@/components/quantum-trade/StockAnalysisCard';
import { NewsSummarizerCard } from '@/components/quantum-trade/NewsSummarizerCard';
import { TradeExecutionCard } from '@/components/quantum-trade/TradeExecutionCard';
import { NotificationsPanel } from '@/components/quantum-trade/NotificationsPanel';
import { SectionTitle } from '@/components/quantum-trade/SectionTitle';
import { MarketIndicatorsChart } from '@/components/quantum-trade/MarketIndicatorsChart';
import { WelcomeBanner } from '@/components/quantum-trade/WelcomeBanner';
import { SplashScreen } from '@/components/quantum-trade/SplashScreen'; 
import { BrainCircuit, Newspaper, CandlestickChart, LineChart } from 'lucide-react';

export default function Home() {
  const [selectedStockTicker, setSelectedStockTicker] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 8000); // Increased splash screen duration for cinematic intro
    return () => clearTimeout(timer);
  }, []);

  const handleStockSelected = (ticker: string | null) => {
    setSelectedStockTicker(ticker);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-12">
        <WelcomeBanner />

        {/* Market Analysis & News Section */}
        <section aria-labelledby="market-analysis-title">
          <SectionTitle title="Market Intelligence" icon={BrainCircuit} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <StockAnalysisCard onStockSelected={handleStockSelected} />
            <NewsSummarizerCard />
          </div>
        </section>

        {/* Visualizations Section */}
        <section aria-labelledby="visualizations-title">
          <SectionTitle title="Market Visualizations" icon={LineChart} />
           <div className="grid grid-cols-1 gap-8">
            <MarketIndicatorsChart selectedStockTicker={selectedStockTicker} />
          </div>
        </section>
        
        {/* Trading Desk Section */}
        <section aria-labelledby="trading-desk-title">
          <SectionTitle title="AI Trading Desk" icon={CandlestickChart} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TradeExecutionCard />
            </div>
            <div className="lg:col-span-1">
               <NotificationsPanel />
            </div>
          </div>
        </section>

      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm border-t">
        © {new Date().getFullYear()} QuantumTrade. All rights reserved. Financial data and AI analysis are for informational purposes only.
      </footer>
    </div>
  );
}
