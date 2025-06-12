
"use client";

import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const TITLE_TEXT = "QuantumTrade";
const SLOGAN_TEXT = "AI-Powered Market Edge.";

// Timings for the faster, overlapping cinematic intro
const ICON_ANIMATION_DURATION = 800; // ms
const ICON_FADE_IN_DELAY = 200; // ms

const TITLE_ANIMATION_DURATION = 1000; // ms
const TITLE_FADE_IN_DELAY = 400; // ms (starts before icon finishes)

const SLOGAN_ANIMATION_DURATION = 1000; // ms
const SLOGAN_FADE_IN_DELAY = 600; // ms (starts before title finishes)

// Calculate when all intro animations are visually complete (i.e., the last one has finished)
const MAX_INTRO_ANIMATION_END_TIME = Math.max(
  ICON_FADE_IN_DELAY + ICON_ANIMATION_DURATION,       // 200 + 800 = 1000ms
  TITLE_FADE_IN_DELAY + TITLE_ANIMATION_DURATION,     // 400 + 1000 = 1400ms
  SLOGAN_FADE_IN_DELAY + SLOGAN_ANIMATION_DURATION    // 600 + 1000 = 1600ms
); // So, all elements are fully in by 1600ms

const VIEW_DURATION_AFTER_ALL_FADE_IN = 1800; // ms to keep everything visible (Reduced)
const DISSOLVE_ANIMATION_DURATION = 1500; // ms for the dissolve effect

export function SplashScreen() {
  const [startDissolve, setStartDissolve] = useState(false);
  const [showElements, setShowElements] = useState(false);

  useEffect(() => {
    // Minimal delay to ensure CSS classes are applied and animations can start
    const showTimer = setTimeout(() => setShowElements(true), 50);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!showElements) return;

    // Timer to start the dissolve effect after all elements have animated in and stayed visible
    const dissolveTimer = setTimeout(() => {
      setStartDissolve(true);
    }, MAX_INTRO_ANIMATION_END_TIME + VIEW_DURATION_AFTER_ALL_FADE_IN);

    return () => clearTimeout(dissolveTimer);
  }, [showElements]);

  const initialOpacityClass = showElements ? "opacity-100" : "opacity-0";
  const dissolveAnimationClass = "animate-cinematic-fade-out-dissolve";

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-center px-4 overflow-hidden"
      aria-labelledby="splash-screen-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          initialOpacityClass, // Handles initial state before animation kicks in
          showElements && !startDissolve && "animate-cinematic-icon-quick-in",
          startDissolve && dissolveAnimationClass
        )}
        style={{
          animationDuration: showElements && !startDissolve ? `${ICON_ANIMATION_DURATION}ms` : `${DISSOLVE_ANIMATION_DURATION}ms`,
          animationDelay: showElements && !startDissolve ? `${ICON_FADE_IN_DELAY}ms` : '0ms',
          // Opacity is controlled by the animation itself from 0 to 1
        }}
      >
        <Sparkles
          className={cn(
            "h-16 w-16 sm:h-20 sm:w-20 mr-auto ml-auto mb-6 text-primary drop-shadow-neon-primary",
            showElements && !startDissolve ? "animate-pulse" : "" // Pulse only during intro
          )}
        />
      </div>

      <div className="overflow-hidden"> {/* Ensures text doesn't jump during animation */}
        <h1
          id="splash-screen-title"
          className={cn(
            initialOpacityClass,
            showElements && !startDissolve && "animate-cinematic-title-reveal",
            "text-6xl sm:text-8xl font-headline font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4 min-h-[80px] sm:min-h-[120px]",
            startDissolve && dissolveAnimationClass
          )}
          style={{
            animationDuration: showElements && !startDissolve ? `${TITLE_ANIMATION_DURATION}ms` : `${DISSOLVE_ANIMATION_DURATION}ms`,
            animationDelay: showElements && !startDissolve ? `${TITLE_FADE_IN_DELAY}ms` : '0ms',
          }}
        >
          {TITLE_TEXT}
        </h1>
      </div>

      <div className="overflow-hidden">
        <p
          className={cn(
            initialOpacityClass,
            showElements && !startDissolve && "animate-cinematic-slogan-reveal",
            "text-xl sm:text-2xl text-muted-foreground min-h-[30px] sm:min-h-[40px]",
            startDissolve && dissolveAnimationClass
          )}
           style={{
            animationDuration: showElements && !startDissolve ? `${SLOGAN_ANIMATION_DURATION}ms` : `${DISSOLVE_ANIMATION_DURATION}ms`,
            animationDelay: showElements && !startDissolve ? `${SLOGAN_FADE_IN_DELAY}ms` : '0ms',
          }}
        >
          {SLOGAN_TEXT}
        </p>
      </div>
    </div>
  );
}
