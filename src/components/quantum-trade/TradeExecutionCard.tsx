
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, ShieldCheck, LineChart, Briefcase, DollarSign, ArrowRightLeft, Loader2, Tag, Hash, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { generateTradeRecommendations, type GenerateTradeRecommendationsOutput } from '@/ai/flows/generate-trade-recommendations';
import { useToast } from "@/hooks/use-toast";

const recommendationFormSchema = z.object({
  marketData: z.string().min(10, "Market data must be at least 10 characters."),
  riskTolerance: z.enum(["low", "medium", "high"], { required_error: "Risk tolerance is required." }),
  investmentPreferences: z.string().min(5, "Investment preferences must be at least 5 characters."),
  portfolioState: z.string().min(5, "Portfolio state must be at least 5 characters."),
});

const tradeExecutionSchema = z.object({
  ticker: z.string().min(1, "Ticker symbol is required.").max(10, "Ticker symbol is too long.").toUpperCase(),
  quantity: z.coerce.number().int().positive("Quantity must be a positive whole number."),
});

export function TradeExecutionCard() {
  const [recommendations, setRecommendations] = useState<GenerateTradeRecommendationsOutput | null>(null);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  const [isExecutingTrade, setIsExecutingTrade] = useState(false);
  const { toast } = useToast();

  const recommendationForm = useForm<z.infer<typeof recommendationFormSchema>>({
    resolver: zodResolver(recommendationFormSchema),
    defaultValues: {
      marketData: "Current market is volatile with tech stocks showing upward trends.",
      investmentPreferences: "Focus on long-term growth in renewable energy and AI sectors.",
      portfolioState: "Holding: 100 AAPL, 50 TSLA. Cash: $10,000.",
    },
  });

  const tradeExecutionForm = useForm<z.infer<typeof tradeExecutionSchema>>({
    resolver: zodResolver(tradeExecutionSchema),
    defaultValues: {
      ticker: "",
      quantity: 1,
    },
  });

  async function onGenerateRecommendations(values: z.infer<typeof recommendationFormSchema>) {
    setIsGeneratingRecommendations(true);
    setGenerationError(null);
    setRecommendations(null);

    const riskParameters = `Risk Tolerance: ${values.riskTolerance}. Investment Preferences: ${values.investmentPreferences}`;

    try {
      const result = await generateTradeRecommendations({
        marketData: values.marketData,
        riskParameters: riskParameters,
        portfolioState: values.portfolioState,
      });
      setRecommendations(result);
      toast({
        title: "Trade Recommendations Ready",
        description: "AI has generated new trade recommendations.",
      });
    } catch (e) {
      console.error(e);
      setGenerationError("Failed to generate trade recommendations. Please try again.");
      toast({
        variant: "destructive",
        title: "Recommendation Failed",
        description: "Could not generate trade recommendations.",
      });
    } finally {
      setIsGeneratingRecommendations(false);
    }
  }

  async function onExecuteTrade(values: z.infer<typeof tradeExecutionSchema>, action: 'BUY' | 'SELL') {
    setIsExecutingTrade(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: `Trade ${action === 'BUY' ? 'Bought' : 'Sold'} (Simulated)`,
      description: `${action} ${values.quantity} shares of ${values.ticker.toUpperCase()}.`,
    });
    tradeExecutionForm.reset({ ticker: "", quantity: 1 });
    setIsExecutingTrade(false);
  }

  return (
    <Card className="w-full shadow-xl hover:shadow-accent/20 transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Bot className="h-8 w-8 mr-3 text-primary drop-shadow-neon-primary" />
          <CardTitle className="text-2xl font-headline">AI Trading Desk</CardTitle>
        </div>
        <CardDescription>Configure parameters for AI recommendations or execute trades directly.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Recommendation Generation Form */}
        <section>
          <h3 className="text-lg font-semibold font-headline text-primary mb-3">Generate AI Trade Recommendations</h3>
          <Form {...recommendationForm}>
            <form onSubmit={recommendationForm.handleSubmit(onGenerateRecommendations)} className="space-y-6">
              <FormField
                control={recommendationForm.control}
                name="riskTolerance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><ShieldCheck className="h-4 w-4 mr-2 text-muted-foreground" />Risk Tolerance</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your risk tolerance" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={recommendationForm.control}
                name="investmentPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><LineChart className="h-4 w-4 mr-2 text-muted-foreground" />Investment Preferences</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Long-term growth, tech sector" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={recommendationForm.control}
                name="marketData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />Market Data/Context</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter current market observations or news context..." {...field} className="min-h-[80px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={recommendationForm.control}
                name="portfolioState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />Current Portfolio State</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Holdings: 10 AAPL, 5 MSFT. Cash: $5000" {...field} className="min-h-[80px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isGeneratingRecommendations} className="w-full">
                {isGeneratingRecommendations ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ArrowRightLeft className="mr-2 h-4 w-4" /> Generate Recommendations
                  </>
                )}
              </Button>
            </form>
          </Form>

          {generationError && (
            <Alert variant="destructive" className="mt-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{generationError}</AlertDescription>
            </Alert>
          )}

          {recommendations && !generationError && (
            <div className="mt-8 space-y-4">
              <h4 className="text-lg font-semibold font-headline text-primary">AI Recommendations:</h4>
              <div className="p-4 border rounded-md bg-card/50">
                <h5 className="font-semibold mb-1">Recommendations:</h5>
                <p className="text-muted-foreground text-sm whitespace-pre-wrap">{recommendations.recommendations}</p>
              </div>
              <div className="p-4 border rounded-md bg-card/50">
                <h5 className="font-semibold mb-1">Analysis:</h5>
                <p className="text-muted-foreground text-sm whitespace-pre-wrap">{recommendations.analysis}</p>
              </div>
            </div>
          )}
        </section>

        <Separator className="my-8" />

        {/* Trade Execution Form */}
        <section>
          <h3 className="text-lg font-semibold font-headline text-primary mb-3">Execute Trade (Simulated)</h3>
          <Form {...tradeExecutionForm}>
            <form className="space-y-6">
              <FormField
                control={tradeExecutionForm.control}
                name="ticker"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Tag className="h-4 w-4 mr-2 text-muted-foreground" />Stock Ticker</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AAPL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={tradeExecutionForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Hash className="h-4 w-4 mr-2 text-muted-foreground" />Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex space-x-4">
                <Button 
                  type="button" 
                  onClick={tradeExecutionForm.handleSubmit(values => onExecuteTrade(values, 'BUY'))} 
                  disabled={isExecutingTrade} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isExecutingTrade ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
                  Buy
                </Button>
                <Button 
                  type="button" 
                  onClick={tradeExecutionForm.handleSubmit(values => onExecuteTrade(values, 'SELL'))} 
                  disabled={isExecutingTrade} 
                  variant="destructive" 
                  className="w-full"
                >
                  {isExecutingTrade ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingDown className="mr-2 h-4 w-4" />}
                  Sell
                </Button>
              </div>
            </form>
          </Form>
        </section>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          <Wallet className="inline h-3 w-3 mr-1" /> 
          AI insights and trade simulations are for informational purposes only and not financial advice.
        </p>
      </CardFooter>
    </Card>
  );
}

    