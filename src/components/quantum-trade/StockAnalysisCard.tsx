
"use client";

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TrendingUp, FileText, Lightbulb, Search, Loader2, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form'; // Removed FormField, FormControl, FormItem, FormLabel, FormMessage
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from '@/components/ui/scroll-area';
import { analyzeStockTrends, type AnalyzeStockTrendsOutput } from '@/ai/flows/analyze-stock-trends';
import { useToast } from "@/hooks/use-toast";

// No Zod schema for form, as it's just a search input now.

interface StockInfo {
  ticker: string;
  name: string;
}

const mockStocks: StockInfo[] = [
  { ticker: "AAPL", name: "Apple Inc." },
  { ticker: "MSFT", name: "Microsoft Corp." },
  { ticker: "GOOGL", name: "Alphabet Inc. (Google)" },
  { ticker: "AMZN", name: "Amazon.com Inc." },
  { ticker: "TSLA", name: "Tesla, Inc." },
  { ticker: "NVDA", name: "NVIDIA Corporation" },
  { ticker: "BRK-A", name: "Berkshire Hathaway Inc." },
  { ticker: "JPM", name: "JPMorgan Chase & Co." },
  { ticker: "V", name: "Visa Inc." },
  { ticker: "JNJ", name: "Johnson & Johnson" },
  { ticker: "WMT", name: "Walmart Inc." },
  { ticker: "PG", name: "Procter & Gamble Co." },
  { ticker: "MA", name: "Mastercard Incorporated" },
  { ticker: "HD", name: "The Home Depot, Inc." },
  { ticker: "DIS", name: "The Walt Disney Company" },
];

interface StockAnalysisCardProps {
  onStockSelected: (ticker: string | null) => void;
}

export function StockAnalysisCard({ onStockSelected }: StockAnalysisCardProps) {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeStockTrendsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTickerForAnalysis, setSelectedTickerForAnalysis] = useState<string | null>(null);
  const { toast } = useToast();

  // Form hook is not strictly necessary for a single search input without Zod validation,
  // but kept if more complex search/filter criteria are added later.
  const form = useForm(); 

  const filteredStocks = useMemo(() => {
    if (!searchTerm) return mockStocks.slice(0, 5); // Show top 5 if no search term
    return mockStocks.filter(
      stock =>
        stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10); // Limit results for performance
  }, [searchTerm]);

  async function handleStockSelectAndAnalyze(ticker: string) {
    setSelectedTickerForAnalysis(ticker);
    onStockSelected(ticker); // Update chart
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeStockTrends({ ticker: ticker.toUpperCase() });
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: `Stock analysis for ${ticker.toUpperCase()} is ready.`,
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
    <Card className="w-full shadow-xl hover:shadow-accent/20 transition-shadow duration-300 flex flex-col">
      <CardHeader>
        <div className="flex items-center mb-2">
          <TrendingUp className="h-8 w-8 mr-3 text-primary drop-shadow-neon-primary" />
          <CardTitle className="text-2xl font-headline">AI Stock Analysis</CardTitle>
        </div>
        <CardDescription>Search for a stock to get AI-powered trend analysis and visualize its performance.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-6">
          <div>
            <label htmlFor="stockSearch" className="block text-sm font-medium text-foreground mb-1">Search Stocks</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="stockSearch"
                placeholder="e.g., AAPL or Apple"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (!e.target.value) { // Clear selection if search is cleared
                    setSelectedTickerForAnalysis(null);
                    onStockSelected(null);
                    setAnalysisResult(null);
                  }
                }}
                className="pl-10"
              />
            </div>
          </div>

          {searchTerm && filteredStocks.length > 0 && (
            <ScrollArea className="h-[150px] border rounded-md p-2 bg-card/30">
              <div className="space-y-1">
                {filteredStocks.map(stock => (
                  <Button
                    key={stock.ticker}
                    variant="ghost"
                    className="w-full justify-start h-auto py-2 px-3 text-left"
                    onClick={() => handleStockSelectAndAnalyze(stock.ticker)}
                    disabled={isLoading && selectedTickerForAnalysis === stock.ticker}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <span className="font-semibold">{stock.ticker}</span>
                        <span className="text-xs text-muted-foreground ml-2">{stock.name}</span>
                      </div>
                      {selectedTickerForAnalysis === stock.ticker && !isLoading && <CheckCircle className="h-4 w-4 text-primary" />}
                      {isLoading && selectedTickerForAnalysis === stock.ticker && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          )}
          {searchTerm && filteredStocks.length === 0 && (
             <p className="text-sm text-muted-foreground text-center py-4">No stocks found for "{searchTerm}".</p>
          )}
        </div>
        
        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analysisResult && selectedTickerForAnalysis && !error && (
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-semibold font-headline text-primary">Analysis for {selectedTickerForAnalysis.toUpperCase()}</h3>
            
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
      {(analysisResult || isLoading) && (
        <CardFooter>
          <p className="text-xs text-muted-foreground">AI analysis is for informational purposes only and not financial advice.</p>
        </CardFooter>
      )}
    </Card>
  );
}
