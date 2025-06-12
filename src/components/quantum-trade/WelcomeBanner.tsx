
"use client";

import { Sparkles } from 'lucide-react';

export function WelcomeBanner() {
  return (
    <section 
      aria-labelledby="welcome-banner-title"
      className="p-8 rounded-lg shadow-xl bg-gradient-to-br from-primary/20 via-accent/10 to-background border border-primary/30 hover:shadow-accent/20 transition-shadow duration-300"
    >
      <div className="flex items-center justify-center sm:justify-start mb-4">
        <Sparkles className="h-10 w-10 mr-3 text-primary drop-shadow-neon-primary" />
        <h1 id="welcome-banner-title" className="text-3xl sm:text-4xl font-headline font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Welcome to QuantumTrade
        </h1>
      </div>
      <p className="text-center sm:text-left text-lg text-muted-foreground">
        Your AI-Powered Edge in the Market. Analyze, Summarize, and Simulate Trades with Cutting-Edge Technology.
      </p>
    </section>
  );
}
