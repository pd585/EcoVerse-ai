/**
 * Animated counter that counts up to a target value when scrolled into view.
 * Respects prefers-reduced-motion.
 * @module components/ui/Counter
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CounterProps {
  value: number;
  decimals?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function Counter({
  value,
  decimals = 0,
  duration = 1200,
  suffix = '',
  prefix = '',
  className = '',
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const [inView, setInView] = useState(false);
  const reduce = useReducedMotion();
  const prevValueRef = useRef(0);

  // IntersectionObserver for scroll-into-view trigger
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '-40px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      prevValueRef.current = value;
      return;
    }
    const startVal = prevValueRef.current;
    const endVal = value;
    const diff = endVal - startVal;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // Cubic ease out
      setDisplay(startVal + diff * eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        prevValueRef.current = endVal;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      // Fallback update to ref
      prevValueRef.current = endVal;
    };
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className={cn(className)}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
