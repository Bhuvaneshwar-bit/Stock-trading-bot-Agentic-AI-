
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { DonutChartData } from '@/types';

interface InvestmentBreakdownChartProps {
  data: DonutChartData[];
  totalInvestment: number;
}

const CustomTooltipContent = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = ((data.value / payload[0].payload.totalInvestment) * 100).toFixed(2);
    return (
      <div className="bg-popover text-popover-foreground p-3 rounded-md shadow-lg border border-border text-sm">
        <p className="font-semibold">{data.name}</p>
        <p>Invested: ${data.value.toFixed(2)}</p>
        <p>Proportion: {percentage}%</p>
      </div>
    );
  }
  return null;
};

export function InvestmentBreakdownChart({ data, totalInvestment }: InvestmentBreakdownChartProps) {
  const chartDataWithTotal = data.map(item => ({...item, totalInvestment}));
  
  return (
    <Card className="shadow-lg hover:shadow-accent/20 transition-shadow duration-300">
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartDataWithTotal}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={50} 
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + (radius + 15) * Math.cos(-midAngle * RADIAN);
                const y = cy + (radius + 15) * Math.sin(-midAngle * RADIAN);
                return (
                  <text
                    x={x}
                    y={y}
                    fill="hsl(var(--foreground))"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    className="text-xs"
                  >
                    {`${name} (${(percent * 100).toFixed(0)}%)`}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltipContent />} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconSize={10}
              formatter={(value, entry) => (
                <span className="text-muted-foreground text-xs ml-1">{value}</span>
              )}
            />
             {data.length > 0 && (
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-muted-foreground">
                Total
              </text>
             )}
             {data.length === 0 && (
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-md fill-muted-foreground">
                    No Data
                </text>
             )}
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
