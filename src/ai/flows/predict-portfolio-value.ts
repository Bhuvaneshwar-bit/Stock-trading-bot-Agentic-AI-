
'use server';
/**
 * @fileOverview AI-powered portfolio value prediction.
 *
 * - predictPortfolioValue - Predicts the portfolio value after a specified number of days.
 * - PredictPortfolioValueInput - Input schema for the prediction.
 * - PredictPortfolioValueOutput - Output schema for the prediction.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PositionInputSchema = z.object({
  ticker: z.string().describe('The stock ticker symbol.'),
  quantity: z.number().describe('The number of shares held.'),
  purchasePrice: z.number().describe('The average price at which the shares were purchased.'),
  currentPrice: z.number().describe('The current market price of the stock.'),
  purchaseDate: z.string().describe('The ISO date string when the stock was purchased.'),
});

const PredictPortfolioValueInputSchema = z.object({
  positions: z.array(PositionInputSchema).describe('An array of current stock positions in the portfolio.'),
  days: z.number().int().positive().describe('The number of days into the future to predict the portfolio value (e.g., 10 days).'),
});
export type PredictPortfolioValueInput = z.infer<typeof PredictPortfolioValueInputSchema>;

const PredictPortfolioValueOutputSchema = z.object({
  projectedValue: z.number().describe('The total projected market value of the portfolio after the specified number of days.'),
  projectedProfitLoss: z.number().describe('The projected absolute profit or loss compared to the current total purchase value of the portfolio.'),
  projectedProfitLossPercentage: z.number().describe('The projected profit or loss percentage compared to the current total purchase value.'),
  analysis: z.string().describe('A brief qualitative analysis or reasoning behind the projection, highlighting key assumptions or factors considered.'),
});
export type PredictPortfolioValueOutput = z.infer<typeof PredictPortfolioValueOutputSchema>;


export async function predictPortfolioValue(input: PredictPortfolioValueInput): Promise<PredictPortfolioValueOutput> {
  if (!input.positions || input.positions.length === 0) {
    return {
        projectedValue: 0,
        projectedProfitLoss: 0,
        projectedProfitLossPercentage: 0,
        analysis: "No positions provided for prediction. Portfolio is currently empty."
    };
  }
  return predictPortfolioValueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictPortfolioValuePrompt',
  input: {schema: PredictPortfolioValueInputSchema},
  output: {schema: PredictPortfolioValueOutputSchema},
  prompt: `You are a sophisticated financial AI model specializing in stock market predictions and portfolio analysis.
Given the following portfolio positions and their current market prices, predict the market value of each stock after {{{days}}} days.
Then, calculate the total projected portfolio value, the absolute profit or loss based on the original purchase prices, and the percentage profit or loss.
Provide a brief qualitative analysis explaining your projection. Consider general market trends, but focus on extrapolating from the provided data for a short-term ({{{days}}} day) forecast.

Portfolio Positions:
{{#each positions}}
- Ticker: {{ticker}}, Quantity: {{quantity}}, Purchase Price: \${{purchasePrice}}, Current Price: \${{currentPrice}}, Purchased On: {{purchaseDate}}
{{/each}}

Focus on providing a realistic short-term outlook.
Base your projected profit/loss calculations on the sum of (purchasePrice * quantity) for all stocks as the initial investment.
The projected value is the sum of (predicted_price_after_{{{days}}}_days * quantity) for all stocks.
The analysis should be concise (2-3 sentences).
Assume current market conditions will exhibit typical volatility but no extreme black swan events unless suggested by the input data implicitly.
If a stock was purchased very recently (e.g., today or yesterday relative to a typical market analysis scenario), acknowledge that short-term predictions for it are more speculative.
Provide the output in the specified JSON format.
`,
});

const predictPortfolioValueFlow = ai.defineFlow(
  {
    name: 'predictPortfolioValueFlow',
    inputSchema: PredictPortfolioValueInputSchema,
    outputSchema: PredictPortfolioValueOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to return an output for portfolio prediction.");
    }
    return output;
  }
);
