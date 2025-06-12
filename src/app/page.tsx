import { Header } from '@/components/layout/Header';
import { StockAnalysisCard } from '@/components/quantum-trade/StockAnalysisCard';
import { NewsSummarizerCard } from '@/components/quantum-trade/NewsSummarizerCard';
import { TradeExecutionCard } from '@/components/quantum-trade/TradeExecutionCard';
import { NotificationsPanel } from '@/components/quantum-trade/NotificationsPanel';
import { SectionTitle } from '@/components/quantum-trade/SectionTitle';
import { MarketIndicatorsChart } from '@/components/quantum-trade/MarketIndicatorsChart';
import { BrainCircuit, Newspaper, CandlestickChart, Bell } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-12">
        
        {/* Market Analysis & News Section */}
        <section aria-labelledby="market-analysis-title">
          <SectionTitle title="Market Intelligence" icon={BrainCircuit} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <StockAnalysisCard />
            <NewsSummarizerCard />
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
        
        {/* Visualizations Section (Placeholder) */}
        <section aria-labelledby="visualizations-title">
          <SectionTitle title="Market Visualizations" icon={CandlestickChart} />
           <div className="grid grid-cols-1 gap-8">
            <MarketIndicatorsChart />
          </div>
        </section>

      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm border-t">
        © {new Date().getFullYear()} QuantumTrade. All rights reserved. Financial data and AI analysis are for informational purposes only.
      </footer>
    </div>
  );
}
