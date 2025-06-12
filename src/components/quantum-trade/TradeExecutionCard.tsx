"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, ShieldCheck, LineChart, Briefcase, DollarSign, ArrowRightLeft, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateTradeRecommendations, type GenerateTradeRecommendationsOutput } from '@/ai/flows/generate-trade-recommendations';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  marketData: z.string().min(10, "Market data must be at least 10 characters."),
  riskTolerance: z.enum(["low", "medium", "high"], { required_error: "Risk tolerance is required." }),
  investmentPreferences: z.string().min(5, "Investment preferences must be at least 5 characters."),
  portfolioState: z.string().min(5, "Portfolio state must be at least 5 characters."),
});

export function TradeExecutionCard() {
  const [recommendations, setRecommendations] = useState<GenerateTradeRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marketData: "Current market is volatile with tech stocks showing upward trends.",
      investmentPreferences: "Focus on long-term growth in renewable energy and AI sectors.",
      portfolioState: "Holding: 100 AAPL, 50 TSLA. Cash: $10,000.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
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
      setError("Failed to generate trade recommendations. Please try again.");
      toast({
        variant: "destructive",
        title: "Recommendation Failed",
        description: "Could not generate trade recommendations.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-xl hover:shadow-accent/20 transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Bot className="h-8 w-8 mr-3 text-primary drop-shadow-neon-primary" />
          <CardTitle className="text-2xl font-headline">AI Trading Desk</CardTitle>
        </div>
        <CardDescription>Configure your trading parameters and let AI generate buy/sell recommendations.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
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

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {recommendations && !error && (
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-semibold font-headline text-primary">AI Trade Recommendations</h3>
            
            <div className="p-4 border rounded-md bg-card/50">
              <h4 className="font-semibold mb-1">Recommendations:</h4>
              <p className="text-muted-foreground text-sm whitespace-pre-wrap">{recommendations.recommendations}</p>
            </div>

            <div className="p-4 border rounded-md bg-card/50">
              <h4 className="font-semibold mb-1">Analysis:</h4>
              <p className="text-muted-foreground text-sm whitespace-pre-wrap">{recommendations.analysis}</p>
            </div>
          </div>
        )}
      </CardContent>
      {recommendations && (
         <CardFooter>
          <p className="text-xs text-muted-foreground">Trade recommendations are AI-generated and not financial advice. Execute trades at your own risk.</p>
        </CardFooter>
      )}
    </Card>
  );
}
