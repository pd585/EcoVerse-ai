'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getDailyEcoTip } from '@/data/daily-data';

export interface EcoInsightProps {
  message?: string;
  className?: string;
}

export function EcoInsight({ message, className }: EcoInsightProps) {
  const [displayMessage, setDisplayMessage] = useState<string>(() => {
    return message || getDailyEcoTip();
  });

  const [prevMessage, setPrevMessage] = useState<string | undefined>(message);
  if (message !== prevMessage) {
    setPrevMessage(message);
    setDisplayMessage(message || getDailyEcoTip());
  }

  return (
    <div
      className={cn('glass-soft rounded-2xl px-3.5 py-2.5', className)}
      aria-label="Eco insight"
    >
      <p className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
        <span aria-hidden>🌱</span>
        Eco Insight
      </p>
      <p className="mt-1 line-clamp-3 text-[0.7rem] leading-relaxed text-foreground/70">
        {displayMessage}
      </p>
    </div>
  );
}
