
"use client"

import { BarChart, TrendingUp } from "lucide-react"
import {
  Bar,
  BarChart as RechartsBarChart,
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


const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
}


export function MarketIndicatorsChart() {
  return (
    <Card className="w-full shadow-xl hover:shadow-accent/20 transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center mb-2">
            <TrendingUp className="h-8 w-8 mr-3 text-primary drop-shadow-neon-primary" />
            <CardTitle className="text-2xl font-headline">Key Market Indicators</CardTitle>
        </div>
        <CardDescription>January - June 2024 (Mock Data)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
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
                  />
                  <Tooltip
                      cursor={{ fill: "hsl(var(--card)/0.5)" }}
                      content={<ChartTooltipContent hideLabel />}
                   />
                  <Bar dataKey="desktop" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name={chartConfig.desktop.label} />
                  <Bar dataKey="mobile" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name={chartConfig.mobile.label} />
              </RechartsBarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
