
"use client"

import { BarChart, TrendingUp, LineChart as LineChartIcon, Info, Wallet } from "lucide-react"
import {
  Bar,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react";
import type { ActivePosition } from "@/types";

const generalMarketChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const generalMarketChartConfig = {
  desktop: {
    label: "Market Volume A", // Changed label for clarity
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Market Volume B", // Changed label for clarity
    color: "hsl(var(--chart-2))",
  },
};

const generateMockStockData = (ticker: string) => {
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
  const [stockChartData, setStockChartData] = useState<Array<{ date: string; price: number }>>([]);

  useEffect(() => {
    if (selectedStockTicker) {
      setStockChartData(generateMockStockData(selectedStockTicker));
    }
  }, [selectedStockTicker]);

  const stockChartConfig = {
    price: {
      label: selectedStockTicker ? `${selectedStockTicker} Price` : "Price",
      color: "hsl(var(--chart-1))",
    },
  };

  const portfolioChartData = activePositions.map(p => ({
    name: p.ticker,
    price: p.currentMockPrice,
  }));

  const portfolioChartConfig = {
    price: {
      label: "Current Price",
      color: "hsl(var(--chart-2))", // Using a different chart color
    },
  };


  const renderContent = () => {
    if (selectedStockTicker && stockChartData.length > 0) {
      // Priority 1: Show selected stock's historical line chart
      return (
        <>
          <div className="flex items-center mb-2">
            <LineChartIcon className="h-8 w-8 mr-3 text-primary drop-shadow-neon-primary" />
            <CardTitle className="text-2xl font-headline">
              {`${selectedStockTicker} Price Trend`}
            </CardTitle>
          </div>
          <CardDescription>
            Mock historical price data for {selectedStockTicker}.
          </CardDescription>
          <CardContent>
            <ChartContainer config={stockChartConfig} className="min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={stockChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
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
    } else if (activePositions.length > 0) {
      // Priority 2: Show bar chart of active portfolio holdings' current prices
      return (
         <>
          <div className="flex items-center mb-2">
            <Wallet className="h-8 w-8 mr-3 text-primary drop-shadow-neon-primary" />
            <CardTitle className="text-2xl font-headline">My Holdings: Current Prices</CardTitle>
          </div>
          <CardDescription>Current mock prices of stocks in your portfolio.</CardDescription>
          <CardContent>
            <ChartContainer config={portfolioChartConfig} className="min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={portfolioChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
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
                    cursor={{ fill: "hsl(var(--card)/0.5)" }}
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="price" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name={portfolioChartConfig.price.label} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </>
      );
    } else if (selectedStockTicker && stockChartData.length === 0) {
        // Case where a stock is selected but data is still loading (or failed)
        return (
            <>
                <div className="flex items-center mb-2">
                    <LineChartIcon className="h-8 w-8 mr-3 text-primary drop-shadow-neon-primary" />
                    <CardTitle className="text-2xl font-headline">
                        {`${selectedStockTicker} Price Trend`}
                    </CardTitle>
                </div>
                <CardDescription>
                    Mock historical price data for {selectedStockTicker}.
                </CardDescription>
                <CardContent>
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground">
                        <Info className="h-10 w-10 mb-4 text-accent" />
                        <p className="text-lg">Generating chart for {selectedStockTicker}...</p>
                        <p className="text-sm">This may take a moment.</p>
                    </div>
                </CardContent>
            </>
        );
    }
    else {
      // Priority 3: Fallback to general market indicators
      return (
        <>
          <div className="flex items-center mb-2">
            <TrendingUp className="h-8 w-8 mr-3 text-primary drop-shadow-neon-primary" />
            <CardTitle className="text-2xl font-headline">Key Market Indicators</CardTitle>
          </div>
          <CardDescription>January - June 2024 (Mock Data)</CardDescription>
          <CardContent>
            <ChartContainer config={generalMarketChartConfig} className="min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={generalMarketChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--card)/0.5)" }}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Legend content={({ payload }) => (
                    <div className="flex justify-center space-x-4 mt-4">
                      {payload?.map((entry, index) => (
                        <div key={`item-${index}`} className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <span style={{ backgroundColor: entry.color }} className="h-2 w-2 rounded-full inline-block"></span>
                          <span>{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )} />
                  <Bar dataKey="desktop" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name={generalMarketChartConfig.desktop.label} />
                  <Bar dataKey="mobile" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name={generalMarketChartConfig.mobile.label} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
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
