
"use client";

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, ShieldCheck, LineChart, Briefcase, DollarSign, ArrowRightLeft, Loader2, Tag, Hash, TrendingUp, TrendingDown, Wallet, ListOrdered, Activity, User, Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateTradeRecommendations, type GenerateTradeRecommendationsOutput } from '@/ai/flows/generate-trade-recommendations';
import { useToast } from "@/hooks/use-toast";
import type { Notification, ActivePosition } from '@/types';

const recommendationFormSchema = z.object({
  marketData: z.string().min(10, "Market data must be at least 10 characters."),
  riskTolerance: z.enum(["low", "medium", "high"], { required_error: "Risk tolerance is required." }),
  investmentPreferences: z.string().min(5, "Investment preferences must be at least 5 characters."),
  portfolioState: z.string().min(5, "Portfolio state must be at least 5 characters."),
});

const tradeExecutionSchema = z.object({
  ticker: z.string().min(1, "Ticker symbol is required.").max(10, "Ticker symbol is too long.").toUpperCase(),
  quantity: z.coerce.number().int().positive("Quantity must be a positive whole number."),
  purchasePrice: z.coerce.number().positive("Purchase price must be positive."),
  targetPrice: z.coerce.number().positive("Target price must be positive.").optional().nullable(),
  stopLossPrice: z.coerce.number().positive("Stop-loss price must be positive.").optional().nullable(),
}).refine(data => {
  if (data.targetPrice && data.purchasePrice && data.targetPrice <= data.purchasePrice) {
    return false;
  }
  return true;
}, {
  message: "Target price must be greater than purchase price.",
  path: ["targetPrice"],
}).refine(data => {
  if (data.stopLossPrice && data.purchasePrice && data.stopLossPrice >= data.purchasePrice) {
    return false;
  }
  return true;
}, {
  message: "Stop-loss price must be less than purchase price.",
  path: ["stopLossPrice"],
}).refine(data => {
  if (data.targetPrice && data.stopLossPrice && data.targetPrice <= data.stopLossPrice) {
    return false;
  }
  return true;
}, {
  message: "Target price must be greater than stop-loss price if both are set.",
  path: ["targetPrice"],
});


interface TradeExecutionCardProps {
  onAddNotification: (notificationDetails: Omit<Notification, 'id' | 'time' | 'read'>) => void;
}

export function TradeExecutionCard({ onAddNotification }: TradeExecutionCardProps) {
  const [recommendations, setRecommendations] = useState<GenerateTradeRecommendationsOutput | null>(null);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  const [isExecutingTrade, setIsExecutingTrade] = useState(false);
  const { toast } = useToast();

  const [activePositions, setActivePositions] = useState<ActivePosition[]>(() => {
    if (typeof window !== 'undefined') {
      const savedPositions = localStorage.getItem('quantumTradePortfolio');
      return savedPositions ? JSON.parse(savedPositions) : [];
    }
    return [];
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [tradeMode, setTradeMode] = useState<'autopilot' | 'manual'>('manual');

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
      purchasePrice: 100,
      targetPrice: undefined,
      stopLossPrice: undefined,
    },
  });

  useEffect(() => {
    if (tradeMode === 'manual') {
      tradeExecutionForm.setValue('targetPrice', undefined);
      tradeExecutionForm.setValue('stopLossPrice', undefined);
      tradeExecutionForm.clearErrors('targetPrice');
      tradeExecutionForm.clearErrors('stopLossPrice');
    }
  }, [tradeMode, tradeExecutionForm]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quantumTradePortfolio', JSON.stringify(activePositions));
    }
  }, [activePositions]);


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
    await new Promise(resolve => setTimeout(resolve, 500)); 

    if (action === 'BUY') {
      const newPosition: ActivePosition = {
        id: Date.now().toString() + Math.random().toString(36).substring(2,9),
        ticker: values.ticker.toUpperCase(),
        quantity: values.quantity,
        purchasePrice: values.purchasePrice,
        currentMockPrice: values.purchasePrice, 
        targetPrice: tradeMode === 'autopilot' ? values.targetPrice : undefined,
        stopLossPrice: tradeMode === 'autopilot' ? values.stopLossPrice : undefined,
        mode: tradeMode,
        purchaseDate: new Date().toISOString(),
        simulatedVolatilityFactor: tradeMode === 'autopilot' ? Math.random() * 0.5 + 0.05 : 0, // Random factor for autopilot, 0 for manual
      };
      setActivePositions(prev => [...prev, newPosition]);
      
      onAddNotification({
        type: 'trade',
        title: `BUY (${newPosition.mode}): ${newPosition.ticker}`,
        message: `Bought ${newPosition.quantity} shares at $${newPosition.purchasePrice.toFixed(2)}.` +
                 `${newPosition.targetPrice ? ` TP: $${newPosition.targetPrice.toFixed(2)}.` : ''}` +
                 `${newPosition.stopLossPrice ? ` SL: $${newPosition.stopLossPrice.toFixed(2)}.` : ''}`,
      });
      toast({
        title: `Simulated BUY (${tradeMode}): ${values.ticker.toUpperCase()}`,
        description: `Bought ${values.quantity} shares at $${values.purchasePrice.toFixed(2)}. ${newPosition.targetPrice ? `TP: $${newPosition.targetPrice.toFixed(2)}.` : ''} ${newPosition.stopLossPrice ? `SL: $${newPosition.stopLossPrice.toFixed(2)}.` : ''}`,
      });
    } else { 
      const tickerToSell = values.ticker.toUpperCase();
      const quantityToSell = values.quantity;
      
      setActivePositions(prev => {
        const existingPositionIndex = prev.findIndex(p => p.ticker === tickerToSell);
        if (existingPositionIndex > -1) {
          const existingPosition = prev[existingPositionIndex];
          const sellQuantity = Math.min(existingPosition.quantity, quantityToSell);
          const soldAll = existingPosition.quantity <= quantityToSell;
          
          const sellMessage = soldAll ?
            `Sold all ${existingPosition.quantity} shares of ${tickerToSell} at $${existingPosition.currentMockPrice.toFixed(2)} (market).` :
            `Sold ${sellQuantity} of ${existingPosition.quantity} shares of ${tickerToSell} at $${existingPosition.currentMockPrice.toFixed(2)} (market).`;

          onAddNotification({
            type: 'trade',
            title: `SELL (manual): ${tickerToSell}`,
            message: sellMessage,
          });
          toast({
             title: `Simulated SELL: ${tickerToSell}`,
             description: soldAll ? `Sold all ${existingPosition.quantity} shares.` : `Sold ${sellQuantity} of ${existingPosition.quantity} shares.`,
          });

          if (soldAll) {
            return prev.filter(p => p.ticker !== tickerToSell);
          } else {
            const updatedPosition = { ...existingPosition, quantity: existingPosition.quantity - sellQuantity };
            const newPositions = [...prev];
            newPositions[existingPositionIndex] = updatedPosition;
            return newPositions;
          }
        } else {
          toast({
            variant: "destructive",
            title: `Sell Failed: ${tickerToSell}`,
            description: `No active position found for ${tickerToSell}.`,
          });
          return prev; 
        }
      });
    }

    tradeExecutionForm.reset({ ticker: "", quantity: 1, purchasePrice: 100, targetPrice: undefined, stopLossPrice: undefined });
    setIsExecutingTrade(false);
  }
  
  useEffect(() => {
    const calculateNewMockPrice = (currentPrice: number, volatilityFactor: number): number => {
      const baseMaxChange = 0.015; // Max 1.5% base change without extra volatility
      const volatilityInducedChange = volatilityFactor * 0.08; // Volatility factor can add up to 8% potential swing
      const maxSwing = baseMaxChange + volatilityInducedChange;
      const changePercent = (Math.random() - 0.5) * 2 * maxSwing; // Random swing up to maxSwing
      const newPrice = currentPrice * (1 + changePercent);
      return Math.max(0.01, parseFloat(newPrice.toFixed(2)));
    };

    const handleAutoSellNotification = (position: ActivePosition, reason: string) => {
      onAddNotification({
        type: 'trade',
        title: `AUTO-SELL (${position.mode}): ${position.ticker}`,
        message: `Sold ${position.quantity} shares at $${position.currentMockPrice.toFixed(2)}. Reason: ${reason}.`
      });
      toast({
        title: `AUTO-SELL (Simulated - ${position.mode}): ${position.ticker}`,
        description: `Sold ${position.quantity} shares at $${position.currentMockPrice.toFixed(2)}. Reason: ${reason}.`,
        variant: "default",
        duration: 7000,
      });
    };

    intervalRef.current = setInterval(() => {
      setActivePositions(prevPositions => {
        const updatedPositions = prevPositions.map(pos => ({
          ...pos,
          currentMockPrice: calculateNewMockPrice(pos.currentMockPrice, pos.simulatedVolatilityFactor),
        }));

        const stillActivePositions: ActivePosition[] = [];
        for (const pos of updatedPositions) {
          let sold = false;
          let reason = "";

          if (pos.mode === 'autopilot') {
            const profitLossRatio = (pos.currentMockPrice - pos.purchasePrice) / pos.purchasePrice;

            // Volatility Check
            const isVolatile = pos.simulatedVolatilityFactor > 0.35;
            const volatilityEventChance = pos.simulatedVolatilityFactor * 0.1; // Chance increases with factor
            
            if (isVolatile && Math.random() < volatilityEventChance) {
              if (profitLossRatio > 0.01) { // If profit > 1%
                 reason = `Market Volatility (Profit Secure at $${pos.currentMockPrice.toFixed(2)})`;
                 sold = true;
              } else if (pos.simulatedVolatilityFactor > 0.45 && profitLossRatio > -0.05) { // Extreme volatility and loss < 5%
                 reason = `Extreme Market Volatility (Risk Mitigation at $${pos.currentMockPrice.toFixed(2)})`;
                 sold = true;
              }
            }

            // Target Price / Stop Loss (if not already sold due to volatility)
            if (!sold && pos.targetPrice && pos.currentMockPrice >= pos.targetPrice) {
              reason = `Target Price $${pos.targetPrice.toFixed(2)} Reached`;
              sold = true;
            } else if (!sold && pos.stopLossPrice && pos.currentMockPrice <= pos.stopLossPrice) {
              reason = `Stop-Loss $${pos.stopLossPrice.toFixed(2)} Triggered`;
              sold = true;
            }
          }

          if (sold) {
            handleAutoSellNotification(pos, reason);
          } else {
            stillActivePositions.push(pos);
          }
        }
        // Persist changes from mock price updates and auto-sells
        if (typeof window !== 'undefined') {
            localStorage.setItem('quantumTradePortfolio', JSON.stringify(stillActivePositions));
        }
        return stillActivePositions;
      });
    }, 3000); 

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onAddNotification, toast]);


  return (
    <Card className="w-full shadow-xl hover:shadow-accent/20 transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Bot className="h-8 w-8 mr-3 text-primary drop-shadow-neon-primary" />
          <CardTitle className="text-2xl font-headline">AI Trading Desk</CardTitle>
        </div>
        <CardDescription>Configure parameters for AI recommendations or execute trades.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
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

        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold font-headline text-primary">Execute Trade (Simulated)</h3>
             <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <Label className="text-sm font-medium">Trade Mode:</Label>
              </div>
          </div>
          <RadioGroup 
            value={tradeMode} 
            onValueChange={(value: 'autopilot' | 'manual') => setTradeMode(value)} 
            className="flex space-x-6 mb-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="manualMode" />
              <Label htmlFor="manualMode" className="flex items-center cursor-pointer">
                <User className="h-4 w-4 mr-2 text-accent" /> Manual
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="autopilot" id="autopilotMode" />
              <Label htmlFor="autopilotMode" className="flex items-center cursor-pointer">
                <Bot className="h-4 w-4 mr-2 text-accent" /> Autopilot
              </Label>
            </div>
          </RadioGroup>

          <Form {...tradeExecutionForm}>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
              <FormField
                  control={tradeExecutionForm.control}
                  name="purchasePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />Purchase Price (for Buy)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 150.75" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              {tradeMode === 'autopilot' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={tradeExecutionForm.control}
                    name="targetPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-muted-foreground">
                          <TrendingUp className="h-4 w-4 mr-2" />Target Price (Autopilot)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="e.g., 160" 
                            {...field} 
                            onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))} 
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={tradeExecutionForm.control}
                    name="stopLossPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-muted-foreground">
                          <TrendingDown className="h-4 w-4 mr-2" />Stop-Loss Price (Autopilot)
                          </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="e.g., 140" 
                            {...field} 
                            onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <div className="flex space-x-4">
                <Button 
                  type="button" 
                  onClick={tradeExecutionForm.handleSubmit(values => onExecuteTrade(values, 'BUY'))} 
                  disabled={isExecutingTrade || !tradeExecutionForm.formState.isValid} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isExecutingTrade ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
                  Buy
                </Button>
                <Button 
                  type="button" 
                  onClick={tradeExecutionForm.handleSubmit(values => onExecuteTrade(values, 'SELL'))} 
                  disabled={isExecutingTrade || !tradeExecutionForm.formState.isValid} 
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

        {activePositions.length > 0 && (
          <>
            <Separator className="my-8" />
            <section>
              <div className="flex items-center mb-3">
                <ListOrdered className="h-6 w-6 mr-2 text-primary" />
                <h3 className="text-lg font-semibold font-headline text-primary">Current Holdings &amp; Conditional Orders (Simulated)</h3>
              </div>
               <Card className="border-border/50">
                <CardContent className="p-0">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Ticker</TableHead>
                        <TableHead className="text-center">Mode</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Purch. $</TableHead>
                        <TableHead className="text-right">Mock $</TableHead>
                        <TableHead className="text-right">Target $</TableHead>
                        <TableHead className="text-right">Stop-Loss $</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activePositions.map((pos) => (
                        <TableRow key={pos.id}>
                            <TableCell className="font-medium">{pos.ticker}</TableCell>
                            <TableCell className="text-center">
                                {pos.mode === 'autopilot' ? 
                                  <Bot className="h-4 w-4 mx-auto text-accent" title="Autopilot"/> : 
                                  <User className="h-4 w-4 mx-auto text-muted-foreground" title="Manual"/>}
                            </TableCell>
                            <TableCell className="text-right">{pos.quantity}</TableCell>
                            <TableCell className="text-right">${pos.purchasePrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-semibold text-primary/90">
                               <div className="flex items-center justify-end">
                                <Activity className="h-3 w-3 mr-1 animate-pulse text-accent" />
                                ${pos.currentMockPrice.toFixed(2)}
                               </div>
                            </TableCell>
                            <TableCell className="text-right text-green-500">{pos.targetPrice ? `$${pos.targetPrice.toFixed(2)}` : '-'}</TableCell>
                            <TableCell className="text-right text-red-500">{pos.stopLossPrice ? `$${pos.stopLossPrice.toFixed(2)}` : '-'}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
                </Card>
                <p className="text-xs text-muted-foreground mt-2">Mock prices update automatically. Autopilot positions may trigger conditional sells.</p>
            </section>
          </>
        )}

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
