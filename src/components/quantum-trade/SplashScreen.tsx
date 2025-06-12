
"use client";

import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const TITLE_TEXT = "QuantumTrade";
const SLOGAN_TEXT = "Your AI-Powered Edge in the Market.";

// Timings for the cinematic intro
const INITIAL_ELEMENTS_FADE_IN_DURATION = 1000; // ms for icon, title, slogan to fade in
const TITLE_FADE_IN_DELAY = 200; // ms after icon starts fading
const SLOGAN_FADE_IN_DELAY = 400; // ms after icon starts fading
const VIEW_DURATION_AFTER_FADE_IN = 3000; // ms to keep everything visible before dissolving
const DISSOLVE_ANIMATION_DURATION = 1500; // ms for the dissolve effect

export function SplashScreen() {
  const [startDissolve, setStartDissolve] = useState(false);
  const [showElements, setShowElements] = useState(false);

  useEffect(() => {
    // Initial fade-in for the container elements
    const showTimer = setTimeout(() => setShowElements(true), 50);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!showElements) return;

    // Calculate when everything should be fully visible
    // Icon starts at 0ms (relative to showElements), duration INITIAL_ELEMENTS_FADE_IN_DURATION
    // Title starts at TITLE_FADE_IN_DELAY, duration INITIAL_ELEMENTS_FADE_IN_DURATION
    // Slogan starts at SLOGAN_FADE_IN_DELAY, duration INITIAL_ELEMENTS_FADE_IN_DURATION
    const maxFadeInTime = Math.max(
      INITIAL_ELEMENTS_FADE_IN_DURATION,
      TITLE_FADE_IN_DELAY + INITIAL_ELEMENTS_FADE_IN_DURATION,
      SLOGAN_FADE_IN_DELAY + INITIAL_ELEMENTS_FADE_IN_DURATION
    );

    const dissolveTimer = setTimeout(() => {
      setStartDissolve(true);
    }, maxFadeInTime + VIEW_DURATION_AFTER_FADE_IN);

    return () => clearTimeout(dissolveTimer);
  }, [showElements]);

  const baseElementClass = "transition-opacity duration-1000 ease-in-out"; // Using CSS transition duration
  const initialOpacityClass = showElements ? "opacity-100" : "opacity-0";
  const cinematicFadeInClass = "animate-cinematic-fade-in";
  const dissolveAnimationClass = "animate-cinematic-fade-out-dissolve";

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-center px-4"
      aria-labelledby="splash-screen-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          baseElementClass,
          initialOpacityClass,
          cinematicFadeInClass, 
          startDissolve && dissolveAnimationClass
        )}
        style={{ animationDuration: `${INITIAL_ELEMENTS_FADE_IN_DURATION}ms` }}
      >
        <Sparkles
          className={cn(
            "h-16 w-16 sm:h-20 sm:w-20 mr-auto ml-auto mb-6 text-primary drop-shadow-neon-primary",
             showElements ? "animate-pulse" : "" // Pulse only after fade-in
          )}
        />
      </div>

      <div className="overflow-hidden">
        <h1
          id="splash-screen-title"
          className={cn(
            baseElementClass,
            initialOpacityClass,
            cinematicFadeInClass,
            "text-6xl sm:text-8xl font-headline font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4 min-h-[80px] sm:min-h-[120px]",
            startDissolve && dissolveAnimationClass
          )}
          style={{ 
            animationDuration: `${INITIAL_ELEMENTS_FADE_IN_DURATION}ms`,
            animationDelay: showElements ? `${TITLE_FADE_IN_DELAY}ms` : '0ms'
          }}
        >
          {TITLE_TEXT}
        </h1>
      </div>

      <div className="overflow-hidden">
        <p
          className={cn(
            baseElementClass,
            initialOpacityClass,
            cinematicFadeInClass,
            "text-xl sm:text-2xl text-muted-foreground min-h-[30px] sm:min-h-[40px]",
            startDissolve && dissolveAnimationClass
          )}
           style={{ 
            animationDuration: `${INITIAL_ELEMENTS_FADE_IN_DURATION}ms`,
            animationDelay: showElements ? `${SLOGAN_FADE_IN_DELAY}ms` : '0ms'
          }}
        >
          {SLOGAN_TEXT}
        </p>
      </div>
    </div>
  );
}
