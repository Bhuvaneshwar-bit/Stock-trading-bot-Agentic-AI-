
import { ArrowUpRight, ArrowDownRight, Bot, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PortfolioPosition } from '@/types';
import { cn } from "@/lib/utils";

interface InvestmentListItemProps {
  position: PortfolioPosition;
}

export function InvestmentListItem({ position }: InvestmentListItemProps) {
  const isProfit = position.profitLossPercentage >= 0;

  return (
    <div className="p-4 hover:bg-muted/30 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-primary">{position.ticker}</h3>
          {position.mode === 'autopilot' ? 
            <Bot className="h-4 w-4 ml-2 text-accent" title="Autopilot Mode"/> :
            <User className="h-4 w-4 ml-2 text-muted-foreground" title="Manual Mode"/>
          }
        </div>
        <Badge 
          variant={isProfit ? "default" : "destructive"} 
          className={cn(
            "px-2 py-0.5 text-xs",
            isProfit ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30' 
                     : 'bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-500/30'
          )}
        >
          {isProfit ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
          {position.profitLossPercentage.toFixed(2)}%
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Quantity</p>
          <p className="font-medium">{position.quantity}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Avg. Buy Price</p>
          <p className="font-medium">${position.purchasePrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Total Invested</p>
          <p className="font-medium">${position.totalInvested.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Current Price</p>
          <p className="font-medium">${position.currentMockPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Current Value</p>
          <p className="font-medium text-primary">${position.currentValue.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">P/L</p>
          <p className={cn("font-medium", isProfit ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500")}>
            ${position.profitLoss.toFixed(2)}
          </p>
        </div>
      </div>
       {position.purchaseDate && (
         <p className="text-xs text-muted-foreground mt-2">
           Purchased: {new Date(position.purchaseDate).toLocaleDateString()}
         </p>
       )}
    </div>
  );
}
