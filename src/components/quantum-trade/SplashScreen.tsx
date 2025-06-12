
"use client";

import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const TITLE_TEXT = "QuantumTrade";
const SLOGAN_TEXT = "Your AI Powered Edge";

// Timings for the cinematic intro elements
const ICON_ANIMATION_DURATION = 800; // ms
const ICON_FADE_IN_DELAY = 200; // ms

const TITLE_ANIMATION_DURATION = 1000; // ms
const TITLE_FADE_IN_DELAY = 500; // ms (starts after icon is somewhat visible)

const SLOGAN_ANIMATION_DURATION = 1000; // ms
const SLOGAN_FADE_IN_DELAY = 800; // ms (starts after title is somewhat visible)

// Calculate when all intro animations are visually complete
const MAX_INTRO_ANIMATION_END_TIME = Math.max(
  ICON_FADE_IN_DELAY + ICON_ANIMATION_DURATION,      // 200 + 800 = 1000ms
  TITLE_FADE_IN_DELAY + TITLE_ANIMATION_DURATION,    // 500 + 1000 = 1500ms
  SLOGAN_FADE_IN_DELAY + SLOGAN_ANIMATION_DURATION   // 800 + 1000 = 1800ms
); // So, all elements are fully in by 1800ms

const VIEW_DURATION_AFTER_ALL_FADE_IN = 1300; // ms to keep everything visible (Adjusted for pace)
const SPLASH_FADE_OUT_DURATION = 1000; // ms for the overall fade-out effect

export function SplashScreen() {
  const [showElements, setShowElements] = useState(false);
  const [startFadeOut, setStartFadeOut] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setShowElements(true), 50);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!showElements) return;

    const fadeOutTimer = setTimeout(() => {
      setStartFadeOut(true);
    }, MAX_INTRO_ANIMATION_END_TIME + VIEW_DURATION_AFTER_ALL_FADE_IN);

    return () => clearTimeout(fadeOutTimer);
  }, [showElements]);

  const initialOpacityClass = showElements ? "opacity-100" : "opacity-0";
  const overallFadeOutAnimationClass = "animate-splash-overall-fade-out";

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-center px-4 overflow-hidden",
        startFadeOut && overallFadeOutAnimationClass
      )}
      style={startFadeOut ? { animationDuration: `${SPLASH_FADE_OUT_DURATION}ms` } : {}}
      aria-labelledby="splash-screen-title"
      role="dialog"
      aria-modal="true"
    >
      <Sparkles
        className={cn(
          "h-16 w-16 sm:h-20 sm:w-20 mb-6 text-primary drop-shadow-neon-primary",
          initialOpacityClass, // Handles initial state before animation kicks in
          showElements && "animate-cinematic-icon-quick-in"
        )}
        style={{
          animationDuration: `${ICON_ANIMATION_DURATION}ms`,
          animationDelay: `${ICON_FADE_IN_DELAY}ms`,
        }}
      />

      <div className="overflow-hidden"> {/* Ensures text doesn't jump during animation */}
        <h1
          id="splash-screen-title"
          className={cn(
            initialOpacityClass,
            showElements && "animate-cinematic-title-reveal",
            "text-6xl sm:text-8xl font-headline font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4 min-h-[80px] sm:min-h-[120px]"
          )}
          style={{
            animationDuration: `${TITLE_ANIMATION_DURATION}ms`,
            animationDelay: `${TITLE_FADE_IN_DELAY}ms`,
          }}
        >
          {TITLE_TEXT}
        </h1>
      </div>

      <div className="overflow-hidden">
        <p
          className={cn(
            initialOpacityClass,
            showElements && "animate-cinematic-slogan-reveal",
            "text-xl sm:text-2xl text-muted-foreground min-h-[30px] sm:min-h-[40px]"
          )}
           style={{
            animationDuration: `${SLOGAN_ANIMATION_DURATION}ms`,
            animationDelay: `${SLOGAN_FADE_IN_DELAY}ms`,
          }}
        >
          {SLOGAN_TEXT}
        </p>
      </div>
    </div>
  );
}
