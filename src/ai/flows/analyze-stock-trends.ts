// This is an AI-powered tool that provides stock market analysis to identify potential investment opportunities.
//
// - analyzeStockTrends - A function that handles the stock trend analysis process.
// - AnalyzeStockTrendsInput - The input type for the analyzeStockTrends function.
// - AnalyzeStockTrendsOutput - The return type for the analyzeStockTrends function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStockTrendsInputSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the stock to analyze.'),
});
export type AnalyzeStockTrendsInput = z.infer<typeof AnalyzeStockTrendsInputSchema>;

const AnalyzeStockTrendsOutputSchema = z.object({
  summary: z.string().describe('A summary of the stock trend analysis.'),
  recommendation: z.string().describe('A recommendation on whether to buy, sell, or hold the stock.'),
  reason: z.string().describe('The reasoning behind the recommendation.'),
  confidenceScore: z.number().min(0).max(100).describe('A numerical confidence score (0-100) from the AI regarding its recommendation.'),
});
export type AnalyzeStockTrendsOutput = z.infer<typeof AnalyzeStockTrendsOutputSchema>;

export async function analyzeStockTrends(input: AnalyzeStockTrendsInput): Promise<AnalyzeStockTrendsOutput> {
  return analyzeStockTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStockTrendsPrompt',
  input: {schema: AnalyzeStockTrendsInputSchema},
  output: {schema: AnalyzeStockTrendsOutputSchema},
  prompt: `You are an expert stock market analyst. Analyze the stock market data and news for the given ticker symbol.
Provide a summary, recommendation, reason for the recommendation, and a confidence score (0-100) for your recommendation.

Ticker Symbol: {{{ticker}}}
\nProvide the output in JSON format.`,
});

const analyzeStockTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeStockTrendsFlow',
    inputSchema: AnalyzeStockTrendsInputSchema,
    outputSchema: AnalyzeStockTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
