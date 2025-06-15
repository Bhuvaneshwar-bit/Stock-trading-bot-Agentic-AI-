
"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { StockAnalysisCard } from '@/components/quantum-trade/StockAnalysisCard';
import { NewsSummarizerCard } from '@/components/quantum-trade/NewsSummarizerCard';
import { TradeExecutionCard } from '@/components/quantum-trade/TradeExecutionCard';
import { NotificationsPanel, type Notification } from '@/components/quantum-trade/NotificationsPanel';
import { SectionTitle } from '@/components/quantum-trade/SectionTitle';
import { MarketIndicatorsChart } from '@/components/quantum-trade/MarketIndicatorsChart';
import { WelcomeBanner } from '@/components/quantum-trade/WelcomeBanner';
import { SplashScreen } from '@/components/quantum-trade/SplashScreen'; 
import { BrainCircuit, Newspaper, CandlestickChart, LineChart } from 'lucide-react';
import type { ActivePosition } from '@/types';

const MAX_NOTIFICATIONS = 10;

const sanitizeActivePositionForPage = (rawPos: any): ActivePosition | null => {
  if (!rawPos || typeof rawPos.id !== 'string' || typeof rawPos.ticker !== 'string') {
    return null;
  }

  const quantity = typeof rawPos.quantity === 'number' && !isNaN(rawPos.quantity) ? rawPos.quantity : 0;
  const purchasePrice = typeof rawPos.purchasePrice === 'number' && !isNaN(rawPos.purchasePrice) ? rawPos.purchasePrice : 0;
  const currentMockPrice = typeof rawPos.currentMockPrice === 'number' && !isNaN(rawPos.currentMockPrice) ? rawPos.currentMockPrice : 0;
  
  let pTargetPrice: number | undefined = undefined;
  if (rawPos.targetPrice != null && typeof rawPos.targetPrice === 'number' && !isNaN(rawPos.targetPrice)) {
    pTargetPrice = rawPos.targetPrice;
  }

  let pStopLossPrice: number | undefined = undefined;
  if (rawPos.stopLossPrice != null && typeof rawPos.stopLossPrice === 'number' && !isNaN(rawPos.stopLossPrice)) {
    pStopLossPrice = rawPos.stopLossPrice;
  }
  
  const mode = rawPos.mode === 'autopilot' || rawPos.mode === 'manual' ? rawPos.mode : 'manual';
  const purchaseDate = typeof rawPos.purchaseDate === 'string' ? rawPos.purchaseDate : new Date(0).toISOString();
  const simulatedVolatilityFactor = typeof rawPos.simulatedVolatilityFactor === 'number' && !isNaN(rawPos.simulatedVolatilityFactor) ? rawPos.simulatedVolatilityFactor : 0.1; // Default if missing

  return {
    id: rawPos.id,
    ticker: rawPos.ticker.toUpperCase(),
    quantity,
    purchasePrice,
    currentMockPrice,
    targetPrice: pTargetPrice,
    stopLossPrice: pStopLossPrice,
    mode,
    purchaseDate,
    simulatedVolatilityFactor,
  };
};


export default function Home() {
  const [selectedStockTicker, setSelectedStockTicker] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activePositions, setActivePositions] = useState<ActivePosition[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4100); 
    return () => clearTimeout(timer);
  }, []);

  // Load active positions from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPositionsJSON = localStorage.getItem('quantumTradePortfolio');
      if (savedPositionsJSON) {
        try {
          const parsedRawPositions = JSON.parse(savedPositionsJSON);
          if (Array.isArray(parsedRawPositions)) {
            setActivePositions(parsedRawPositions.map(sanitizeActivePositionForPage).filter(p => p !== null) as ActivePosition[]);
          }
        } catch (error) {
          console.error("Error parsing portfolio from localStorage on main page", error);
          setActivePositions([]);
        }
      }
    }
  }, []);

  // Save active positions to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quantumTradePortfolio', JSON.stringify(activePositions));
    }
  }, [activePositions]);


  const handleStockSelected = (ticker: string | null) => {
    setSelectedStockTicker(ticker);
  };

  const addNotification = (notificationDetails: Omit<Notification, 'id' | 'time' | 'read'>) => {
    setNotifications(prevNotifications => {
      const newNotification: Notification = {
        ...notificationDetails,
        id: Date.now().toString() + Math.random().toString(36).substring(2,9), 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        read: false,
      };
      const updatedNotifications = [newNotification, ...prevNotifications];
      return updatedNotifications.slice(0, MAX_NOTIFICATIONS);
    });
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
            <MarketIndicatorsChart selectedStockTicker={selectedStockTicker} activePositions={activePositions} />
          </div>
        </section>
        
        {/* Trading Desk Section */}
        <section aria-labelledby="trading-desk-title">
          <SectionTitle title="AI Trading Desk" icon={CandlestickChart} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TradeExecutionCard 
                onAddNotification={addNotification}
                activePositions={activePositions}
                setActivePositions={setActivePositions}
              />
            </div>
            <div className="lg:col-span-1">
               <NotificationsPanel notifications={notifications} />
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
