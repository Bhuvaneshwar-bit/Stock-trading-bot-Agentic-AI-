
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Banknote } from "lucide-react";
import type { PortfolioSummary } from '@/types';

interface PortfolioSummaryCardsProps {
  summary: PortfolioSummary;
}

export function PortfolioSummaryCards({ summary }: PortfolioSummaryCardsProps) {
  const isProfit = summary.overallProfitLoss >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <Card className="shadow-lg hover:shadow-accent/20 transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Portfolio Value</CardTitle>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${summary.currentPortfolioValue.toFixed(2)}</div>
          {summary.totalInvested > 0 && (
            <div className="flex items-center text-xs mt-1">
              <Badge variant={isProfit ? "default" : "destructive"} className={`${isProfit ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-500/30'} px-2 py-0.5`}>
                {isProfit ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {summary.overallProfitLossPercentage.toFixed(2)}%
              </Badge>
              <p className={`ml-2 text-xs ${isProfit ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                (${summary.overallProfitLoss.toFixed(2)})
              </p>
            </div>
          )}
           {summary.totalInvested === 0 && (
             <p className="text-xs text-muted-foreground mt-1">No investments yet.</p>
           )}
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-accent/20 transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
          <Banknote className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${summary.totalInvested.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            The total amount of capital you've put into your holdings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
