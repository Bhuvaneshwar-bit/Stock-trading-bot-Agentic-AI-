
import { PortfolioPageClient } from "@/components/portfolio/PortfolioPageClient";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Portfolio - QuantumTrade',
  description: 'View your current investments and AI-powered portfolio projections.',
};

export default function PortfolioPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 container mx-auto px-4 py-8 space-y-12">
        <PortfolioPageClient />
      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm border-t">
        © {new Date().getFullYear()} QuantumTrade. Portfolio data is simulated.
      </footer>
    </div>
  );
}
