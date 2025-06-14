
import { BarChartBig, Briefcase, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center mr-4">
          <BarChartBig className="h-8 w-8 mr-2 text-primary drop-shadow-neon-primary" />
          <h1 className="text-2xl font-bold font-headline bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            QuantumTrade
          </h1>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <LayoutDashboard className="h-5 w-5 mr-1.5" />
            Dashboard
          </Link>
          <Link href="/portfolio" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <Briefcase className="h-5 w-5 mr-1.5" />
            Portfolio
          </Link>
        </nav>
      </div>
    </header>
  );
}
