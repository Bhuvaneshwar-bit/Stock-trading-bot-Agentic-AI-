
import { Card, CardContent } from "@/components/ui/card";
import { InvestmentListItem } from "./InvestmentListItem";
import type { PortfolioPosition } from '@/types';
import { ScrollArea } from "@/components/ui/scroll-area";

interface InvestmentListProps {
  positions: PortfolioPosition[];
}

export function InvestmentList({ positions }: InvestmentListProps) {
  if (positions.length === 0) {
    return (
      <Card className="shadow-md">
        <CardContent className="pt-6 text-center text-muted-foreground">
          You have no active investments.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg hover:shadow-accent/20 transition-shadow duration-300">
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] md:h-auto md:max-h-[600px]">
          <div className="divide-y divide-border">
            {positions.map((position) => (
              <InvestmentListItem key={position.id} position={position} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
