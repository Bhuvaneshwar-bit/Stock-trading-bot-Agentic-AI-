"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TrendingUp, FileText, Lightbulb, Search, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { analyzeStockTrends, type AnalyzeStockTrendsOutput } from '@/ai/flows/analyze-stock-trends';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  ticker: z.string().min(1, "Ticker symbol is required").max(10, "Ticker too long"),
});

export function StockAnalysisCard() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeStockTrendsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeStockTrends({ ticker: values.ticker.toUpperCase() });
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: `Stock analysis for ${values.ticker.toUpperCase()} is ready.`,
      });
    } catch (e) {
      console.error(e);
      setError("Failed to analyze stock trends. Please try again.");
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not retrieve stock analysis.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-xl hover:shadow-accent/20 transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center mb-2">
          <TrendingUp className="h-8 w-8 mr-3 text-primary drop-shadow-neon-primary" />
          <CardTitle className="text-2xl font-headline">AI Stock Analysis</CardTitle>
        </div>
        <CardDescription>Enter a stock ticker to get AI-powered trend analysis and recommendations.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="ticker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Ticker Symbol</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input placeholder="e.g., AAPL, GOOG" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" /> Analyze Stock
                </>
              )}
            </Button>
          </form>
        </Form>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analysisResult && !error && (
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-semibold font-headline text-primary">Analysis for {form.getValues("ticker").toUpperCase()}</h3>
            
            <div className="p-4 border rounded-md bg-card/50">
              <div className="flex items-start mb-2">
                <FileText className="h-5 w-5 mr-2 mt-1 text-accent drop-shadow-neon-accent flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Summary</h4>
                  <p className="text-muted-foreground text-sm">{analysisResult.summary}</p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-md bg-card/50">
              <div className="flex items-start mb-2">
                 <Lightbulb className="h-5 w-5 mr-2 mt-1 text-accent drop-shadow-neon-accent flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Recommendation</h4>
                  <p className="text-muted-foreground text-sm font-medium">{analysisResult.recommendation}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-md bg-card/50">
              <div className="flex items-start">
                <Lightbulb className="h-5 w-5 mr-2 mt-1 text-accent drop-shadow-neon-accent flex-shrink-0 opacity-0" /> {/* Placeholder for alignment */}
                 <div className="flex-grow"> {/* Ensure text can wrap */}
                    <h4 className="font-semibold">Reasoning</h4>
                    <p className="text-muted-foreground text-sm whitespace-pre-wrap">{analysisResult.reason}</p>
                  </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {analysisResult && (
        <CardFooter>
          <p className="text-xs text-muted-foreground">AI analysis is for informational purposes only and not financial advice.</p>
        </CardFooter>
      )}
    </Card>
  );
}
