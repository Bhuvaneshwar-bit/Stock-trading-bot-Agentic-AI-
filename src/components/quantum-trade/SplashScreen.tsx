
"use client";

import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const TITLE_TEXT = "QuantumTrade";
const SLOGAN_TEXT = "AI-Powered Market Edge."; // Shortened slogan

// Timings for the new cinematic intro
const ICON_ANIMATION_DURATION = 1000; // ms
const ICON_FADE_IN_DELAY = 200; // ms

const TITLE_ANIMATION_DURATION = 1200; // ms
const TITLE_FADE_IN_DELAY = 800; // ms (after icon starts fading in)

const SLOGAN_ANIMATION_DURATION = 1000; // ms
const SLOGAN_FADE_IN_DELAY = 1800; // ms (after icon starts fading in)

const VIEW_DURATION_AFTER_ALL_FADE_IN = 2500; // ms to keep everything visible
const DISSOLVE_ANIMATION_DURATION = 1500; // ms for the dissolve effect

export function SplashScreen() {
  const [startDissolve, setStartDissolve] = useState(false);
  const [showElements, setShowElements] = useState(false);

  useEffect(() => {
    // Initial trigger to start fade-in animations
    const showTimer = setTimeout(() => setShowElements(true), 50);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!showElements) return;

    // Calculate when all intro animations are complete
    const maxIntroAnimationEndTime = Math.max(
      ICON_FADE_IN_DELAY + ICON_ANIMATION_DURATION,
      TITLE_FADE_IN_DELAY + TITLE_ANIMATION_DURATION,
      SLOGAN_FADE_IN_DELAY + SLOGAN_ANIMATION_DURATION
    );

    const dissolveTimer = setTimeout(() => {
      setStartDissolve(true);
    }, maxIntroAnimationEndTime + VIEW_DURATION_AFTER_ALL_FADE_IN);

    return () => clearTimeout(dissolveTimer);
  }, [showElements]);

  const initialOpacityClass = showElements ? "opacity-100" : "opacity-0";
  const dissolveAnimationClass = "animate-cinematic-fade-out-dissolve"; // Uses 1.5s duration from tailwind.config

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-center px-4 overflow-hidden"
      aria-labelledby="splash-screen-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "transition-opacity ease-in-out", // Base for initial opacity handling
          initialOpacityClass,
          showElements && !startDissolve && "animate-cinematic-icon-in",
          startDissolve && dissolveAnimationClass
        )}
        style={{
          animationDuration: showElements && !startDissolve ? `${ICON_ANIMATION_DURATION}ms` : `${DISSOLVE_ANIMATION_DURATION}ms`,
          animationDelay: showElements && !startDissolve ? `${ICON_FADE_IN_DELAY}ms` : '0ms',
          opacity: showElements ? 1 : 0, // Ensure initial state for animation
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
            "transition-opacity ease-in-out",
            initialOpacityClass,
            showElements && !startDissolve && "animate-cinematic-title-in",
            "text-6xl sm:text-8xl font-headline font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4 min-h-[80px] sm:min-h-[120px]",
            startDissolve && dissolveAnimationClass
          )}
          style={{
            animationDuration: showElements && !startDissolve ? `${TITLE_ANIMATION_DURATION}ms` : `${DISSOLVE_ANIMATION_DURATION}ms`,
            animationDelay: showElements && !startDissolve ? `${TITLE_FADE_IN_DELAY}ms` : '0ms',
            opacity: showElements ? 1 : 0,
          }}
        >
          {TITLE_TEXT}
        </h1>
      </div>

      <div className="overflow-hidden">
        <p
          className={cn(
            "transition-opacity ease-in-out",
            initialOpacityClass,
            showElements && !startDissolve && "animate-cinematic-slogan-in",
            "text-xl sm:text-2xl text-muted-foreground min-h-[30px] sm:min-h-[40px]",
            startDissolve && dissolveAnimationClass
          )}
           style={{
            animationDuration: showElements && !startDissolve ? `${SLOGAN_ANIMATION_DURATION}ms` : `${DISSOLVE_ANIMATION_DURATION}ms`,
            animationDelay: showElements && !startDissolve ? `${SLOGAN_FADE_IN_DELAY}ms` : '0ms',
            opacity: showElements ? 1 : 0,
          }}
        >
          {SLOGAN_TEXT}
        </p>
      </div>
    </div>
  );
}
