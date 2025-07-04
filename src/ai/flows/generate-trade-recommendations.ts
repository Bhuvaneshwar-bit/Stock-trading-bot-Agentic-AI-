// This is an autogenerated file from Firebase Studio.

'use server';

/**
 * @fileOverview AI-powered tool that provides stock buy/sell recommendations based on market analysis and user-defined risk parameters.
 *
 * - generateTradeRecommendations - A function that generates stock trade recommendations.
 * - GenerateTradeRecommendationsInput - The input type for the generateTradeRecommendations function.
 * - GenerateTradeRecommendationsOutput - The return type for the generateTradeRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTradeRecommendationsInputSchema = z.object({
  marketData: z.string().describe('Real-time stock market data, including price, volume, and volatility.'),
  riskParameters: z.string().describe('User-defined risk parameters, such as risk tolerance level and investment preferences.'),
  portfolioState: z.string().describe('Current state of the portfolio including current positions.'),
});
export type GenerateTradeRecommendationsInput = z.infer<
  typeof GenerateTradeRecommendationsInputSchema
>;

const GenerateTradeRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('AI-generated buy/sell recommendations based on market analysis and risk parameters.'),
  analysis: z.string().describe('Summary of the market analysis that led to the recommendations.'),
});
export type GenerateTradeRecommendationsOutput = z.infer<
  typeof GenerateTradeRecommendationsOutputSchema
>;

export async function generateTradeRecommendations(
  input: GenerateTradeRecommendationsInput
): Promise<GenerateTradeRecommendationsOutput> {
  return generateTradeRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTradeRecommendationsPrompt',
  input: {schema: GenerateTradeRecommendationsInputSchema},
  output: {schema: GenerateTradeRecommendationsOutputSchema},
  prompt: `You are an AI-powered financial advisor that provides stock buy/sell recommendations based on market analysis and risk parameters.

Analyze the provided market data and user-defined risk parameters to generate buy/sell recommendations.

Market Data: {{{marketData}}}
Risk Parameters: {{{riskParameters}}}
Current Portfolio State: {{{portfolioState}}}

Based on the market data, risk parameters, and current portfolio state provide specific buy or sell recommendations for stocks.
Explain the reasoning for these recommendations in the analysis field.`,
});

const generateTradeRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateTradeRecommendationsFlow',
    inputSchema: GenerateTradeRecommendationsInputSchema,
    outputSchema: GenerateTradeRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
