
"use client"

import { LineChart as LineChartIcon, Info } from "lucide-react"
import {
  LineChart as RechartsLineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState, useMemo } from "react";
import type { ActivePosition } from "@/types";

const generateMockStockDataInternal = (ticker: string): Array<{ date: string; price: number }> => {
  const data = [];
  let lastPrice = Math.random() * 200 + 50; 
  const startDate = new Date(2024, 0, 1); 

  for (let i = 0; i < 180; i++) { 
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    const changePercent = (Math.random() - 0.49) * 0.05; 
    let price = lastPrice * (1 + changePercent);
    price = Math.max(0.01, parseFloat(price.toFixed(2))); 
    lastPrice = price;

    data.push({
      date: date.toISOString().split('T')[0], 
      price: price,
    });
  }
  return data;
};


interface MarketIndicatorsChartProps {
  selectedStockTicker?: string | null;
  activePositions?: ActivePosition[];
}

export function MarketIndicatorsChart({ selectedStockTicker, activePositions = [] }: MarketIndicatorsChartProps) {
  const [displayTicker, setDisplayTicker] = useState<string | null>(null);
  const [chartData, setChartData] = useState<Array<{ date: string; price: number }>>([]);
  const [dataCache, setDataCache] = useState<Record<string, Array<{ date: string; price: number }>>>({});

  useEffect(() => {
    let tickerToChart: string | null = null;
    if (selectedStockTicker) {
      tickerToChart = selectedStockTicker;
    } else if (activePositions.length > 0) {
      tickerToChart = activePositions[0].ticker;
    }
    
    setDisplayTicker(tickerToChart);

    if (tickerToChart) {
      if (dataCache[tickerToChart]) {
        setChartData(dataCache[tickerToChart]);
      } else {
        const newData = generateMockStockDataInternal(tickerToChart);
        setChartData(newData);
        setDataCache(prevCache => ({ ...prevCache, [tickerToChart as string]: newData }));
      }
    } else {
      setChartData([]); 
    }
  }, [selectedStockTicker, activePositions, dataCache]);


  const stockChartConfig = useMemo(() => ({
    price: {
      label: displayTicker ? `${displayTicker} Price` : "Price",
      color: "hsl(var(--chart-1))",
    },
  }), [displayTicker]);


  const renderContent = () => {
    if (displayTicker && chartData.length > 0) {
      return (
        <>
          <div className="flex items-center mb-2">
            <LineChartIcon className="h-8 w-8 mr-3 text-primary drop-shadow-neon-primary" />
            <CardTitle className="text-2xl font-headline">
              {`${displayTicker} Price Trend`}
            </CardTitle>
          </div>
          <CardDescription>
            Mock historical price data for {displayTicker}.
          </CardDescription>
          <CardContent>
            <ChartContainer config={stockChartConfig} className="min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    cursor={{ stroke: "hsl(var(--accent))", strokeWidth: 1.5 }}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    strokeWidth={2}
                    stroke="hsl(var(--chart-1))"
                    dot={false}
                    name={stockChartConfig.price.label}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </>
      );
    } else {
      return (
        <>
          <div className="flex items-center mb-2">
            <Info className="h-8 w-8 mr-3 text-primary drop-shadow-neon-primary" />
            <CardTitle className="text-2xl font-headline">Market Visualization</CardTitle>
          </div>
          <CardDescription>
            Price trends for selected or held stocks will appear here.
          </CardDescription>
          <CardContent>
            <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground border border-dashed border-border/50 rounded-md">
              <LineChartIcon className="h-12 w-12 mb-4 text-muted-foreground/50" />
              <p className="text-lg text-center">Select a stock for analysis or make a trade to see its price trend.</p>
            </div>
          </CardContent>
        </>
      );
    }
  };

  return (
    <Card className="w-full shadow-xl hover:shadow-accent/20 transition-shadow duration-300">
      <CardHeader>
        {renderContent()}
      </CardHeader>
    </Card>
  )
}
