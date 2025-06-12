
"use client";

import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const TITLE_TEXT = "QuantumTrade";
const SLOGAN_TEXT = "Your AI-Powered Edge in the Market.";
const TITLE_CHAR_DELAY = 100; // ms
const SLOGAN_CHAR_DELAY = 60; // ms
const DELAY_AFTER_TITLE_TYPED = 300; // ms
const DELAY_BEFORE_DISSOLVE = 1500; // ms

export function SplashScreen() {
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [displayedSlogan, setDisplayedSlogan] = useState("");
  const [isTitleComplete, setIsTitleComplete] = useState(false);
  const [isSloganComplete, setIsSloganComplete] = useState(false);
  const [startDissolve, setStartDissolve] = useState(false);
  const [showElements, setShowElements] = useState(false);

  useEffect(() => {
    // Initial fade-in for the container
    const showTimer = setTimeout(() => setShowElements(true), 50);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!showElements) return;

    // Typewriter for Title
    if (displayedTitle.length < TITLE_TEXT.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedTitle(TITLE_TEXT.slice(0, displayedTitle.length + 1));
      }, TITLE_CHAR_DELAY);
      return () => clearTimeout(timeoutId);
    } else if (!isTitleComplete) {
      setIsTitleComplete(true);
    }
  }, [displayedTitle, isTitleComplete, showElements]);

  useEffect(() => {
    if (!isTitleComplete) return;

    // Typewriter for Slogan (starts after a delay from title completion)
    if (displayedSlogan.length < SLOGAN_TEXT.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedSlogan(SLOGAN_TEXT.slice(0, displayedSlogan.length + 1));
      }, SLOGAN_CHAR_DELAY);
      return () => clearTimeout(timeoutId);
    } else if (!isSloganComplete) {
      setIsSloganComplete(true);
    }
  }, [displayedSlogan, isTitleComplete, isSloganComplete, DELAY_AFTER_TITLE_TYPED]);

  useEffect(() => {
    if (isSloganComplete) {
      // Start dissolve effect after slogan is typed and a pause
      const dissolveTimer = setTimeout(() => {
        setStartDissolve(true);
      }, DELAY_BEFORE_DISSOLVE);
      return () => clearTimeout(dissolveTimer);
    }
  }, [isSloganComplete]);

  const baseElementClass = "transition-opacity duration-1000 ease-in-out";
  const initialOpacityClass = showElements ? "opacity-100" : "opacity-0";
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
           "animate-cinematic-fade-in", // Initial fade-in for the group
          startDissolve && dissolveAnimationClass
        )}
      >
        <Sparkles
          className={cn(
            "h-16 w-16 sm:h-20 sm:w-20 mr-auto ml-auto mb-6 text-primary drop-shadow-neon-primary",
            showElements ? "animate-pulse" : "" // Pulse only after fade-in
          )}
        />
      </div>

      <div className="overflow-hidden"> {/* Wrapper for typewriter text to prevent layout shift */}
        <h1
          id="splash-screen-title"
          className={cn(
            baseElementClass,
            initialOpacityClass,
            "text-6xl sm:text-8xl font-headline font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4 min-h-[80px] sm:min-h-[120px]", // min-h to prevent jump
             "animate-cinematic-fade-in animation-delay-[200ms]", // Staggered fade-in
            startDissolve && dissolveAnimationClass
          )}
        >
          {displayedTitle}
          <span className={cn("animate-blink-cursor opacity-0", {"opacity-100": !isTitleComplete && displayedTitle.length < TITLE_TEXT.length && displayedTitle.length > 0, "hidden": isTitleComplete})}>|</span>
        </h1>
      </div>

      <div className="overflow-hidden">
        <p
          className={cn(
            baseElementClass,
            initialOpacityClass,
            "text-xl sm:text-2xl text-muted-foreground min-h-[30px] sm:min-h-[40px]", // min-h
             "animate-cinematic-fade-in animation-delay-[400ms]", // Staggered fade-in
            startDissolve && dissolveAnimationClass
          )}
        >
          {displayedSlogan}
           <span className={cn("animate-blink-cursor opacity-0", {"opacity-100": isTitleComplete && !isSloganComplete && displayedSlogan.length < SLOGAN_TEXT.length && displayedSlogan.length > 0, "hidden": isSloganComplete})}>|</span>
        </p>
      </div>
    </div>
  );
}
