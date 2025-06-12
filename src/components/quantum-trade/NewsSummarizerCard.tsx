"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Newspaper, AlignLeft, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { summarizeFinancialNews, type SummarizeFinancialNewsOutput } from '@/ai/flows/summarize-financial-news';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  newsArticle: z.string().min(50, "Article text must be at least 50 characters long."),
});

export function NewsSummarizerCard() {
  const [summaryResult, setSummaryResult] = useState<SummarizeFinancialNewsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newsArticle: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSummaryResult(null);
    try {
      const result = await summarizeFinancialNews({ newsArticle: values.newsArticle });
      setSummaryResult(result);
      toast({
        title: "Summarization Complete",
        description: "The news article has been summarized.",
      });
    } catch (e) {
      console.error(e);
      setError("Failed to summarize news. Please try again.");
       toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: "Could not summarize the news article.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-xl hover:shadow-accent/20 transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Newspaper className="h-8 w-8 mr-3 text-primary drop-shadow-neon-primary" />
          <CardTitle className="text-2xl font-headline">Financial News Summarizer</CardTitle>
        </div>
        <CardDescription>Paste a financial news article below to get an AI-generated summary.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="newsArticle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>News Article Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste the full text of the financial news article here..."
                      className="min-h-[150px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <AlignLeft className="mr-2 h-4 w-4" /> Summarize Article
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

        {summaryResult && !error && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-semibold font-headline text-primary">Summary</h3>
            <div className="p-4 border rounded-md bg-card/50">
              <p className="text-muted-foreground text-sm whitespace-pre-wrap">{summaryResult.summary}</p>
            </div>
          </div>
        )}
      </CardContent>
       {summaryResult && (
        <CardFooter>
          <p className="text-xs text-muted-foreground">AI summaries are for informational purposes and may not capture all nuances.</p>
        </CardFooter>
      )}
    </Card>
  );
}
