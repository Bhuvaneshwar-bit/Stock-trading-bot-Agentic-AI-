
"use client";

import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the fade-in after a short delay to ensure the transition applies
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50); // ms
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      aria-labelledby="splash-screen-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "p-8 rounded-lg shadow-xl bg-gradient-to-br from-primary/20 via-accent/10 to-background border border-primary/30 max-w-xl w-full mx-4 text-center",
          "transition-opacity duration-1000 ease-in-out", // Increased duration for a smoother effect
          isVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-12 w-12 mr-3 text-primary drop-shadow-neon-primary animate-pulse" />
          <h1 id="splash-screen-title" className="text-4xl sm:text-5xl font-headline font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            QuantumTrade
          </h1>
        </div>
        <p className="text-lg sm:text-xl text-muted-foreground">
          Your AI-Powered Edge in the Market. Analyze, Summarize, and Simulate Trades with Cutting-Edge Technology.
        </p>
      </div>
    </div>
  );
}
