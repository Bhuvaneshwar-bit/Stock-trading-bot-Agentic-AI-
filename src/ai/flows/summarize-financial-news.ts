// Summarize relevant financial news articles and reports.
'use server';
/**
 * @fileOverview Summarizes financial news articles and reports.
 *
 * - summarizeFinancialNews - A function that summarizes financial news.
 * - SummarizeFinancialNewsInput - The input type for the summarizeFinancialNews function.
 * - SummarizeFinancialNewsOutput - The return type for the summarizeFinancialNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeFinancialNewsInputSchema = z.object({
  newsArticle: z.string().describe('The financial news article to summarize.'),
});
export type SummarizeFinancialNewsInput = z.infer<
  typeof SummarizeFinancialNewsInputSchema
>;

const SummarizeFinancialNewsOutputSchema = z.object({
  summary: z.string().describe('The summary of the financial news article.'),
});
export type SummarizeFinancialNewsOutput = z.infer<
  typeof SummarizeFinancialNewsOutputSchema
>;

export async function summarizeFinancialNews(
  input: SummarizeFinancialNewsInput
): Promise<SummarizeFinancialNewsOutput> {
  return summarizeFinancialNewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeFinancialNewsPrompt',
  input: {schema: SummarizeFinancialNewsInputSchema},
  output: {schema: SummarizeFinancialNewsOutputSchema},
  prompt: `Summarize the following financial news article:\n\n{{{newsArticle}}}`,
});

const summarizeFinancialNewsFlow = ai.defineFlow(
  {
    name: 'summarizeFinancialNewsFlow',
    inputSchema: SummarizeFinancialNewsInputSchema,
    outputSchema: SummarizeFinancialNewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
