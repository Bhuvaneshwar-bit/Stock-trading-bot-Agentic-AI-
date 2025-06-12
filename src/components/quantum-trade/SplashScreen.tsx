
"use client";

import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function SplashScreen() {
  const [titleVisible, setTitleVisible] = useState(false);
  const [sloganVisible, setSloganVisible] = useState(false);

  useEffect(() => {
    const titleTimer = setTimeout(() => {
      setTitleVisible(true);
    }, 50); // ms, slight delay for transition to catch
    const sloganTimer = setTimeout(() => {
      setSloganVisible(true);
    }, 700); // Slogan appears after title

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(sloganTimer);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-center px-4"
      aria-labelledby="splash-screen-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "transition-opacity duration-[1500ms] ease-in-out",
          titleVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="h-16 w-16 sm:h-20 sm:w-20 mr-3 text-primary drop-shadow-neon-primary animate-pulse" />
          <h1 id="splash-screen-title" className="text-6xl sm:text-8xl font-headline font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            QuantumTrade
          </h1>
        </div>
      </div>
      <div
        className={cn(
          "transition-opacity duration-[1200ms] ease-in-out",
          sloganVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <p className="text-xl sm:text-2xl text-muted-foreground">
          Your AI-Powered Edge in the Market.
        </p>
      </div>
    </div>
  );
}
