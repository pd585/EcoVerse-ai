/**
 * EcoJump sidebar launch card — premium game-poster-style entry point.
 * Designed to occupy the sidebar dead space below Eco Insight.
 * Uses existing mascot system with dynamic personality support.
 * @module components/layout/EcoJumpCard
 */

'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { RobotSeedlingIcon } from '@/components/brand';
import type { RobotSeedlingIconProps } from '@/components/brand';
import { EcoJumpModal } from './EcoJumpModal';

type Personality = NonNullable<RobotSeedlingIconProps['personality']>;

/** Floating teaser element configuration */
const TEASER_ITEMS = [
  { emoji: '🌱', className: 'top-3 left-2 animate-ecojump-float-1' },
  { emoji: '☀️', className: 'top-5 right-3 animate-ecojump-float-2' },
  { emoji: '♻️', className: 'bottom-[5.5rem] left-3 animate-ecojump-float-3' },
  { emoji: '🚗', className: 'bottom-[6rem] right-2 animate-ecojump-float-4' },
] as const;

export interface EcoJumpCardProps {
  /** The user's active eco personality — determines mascot variant */
  personality?: Personality;
  className?: string;
}

export function EcoJumpCard({
  personality = 'greenGuardian',
  className,
}: EcoJumpCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        id="ecojump-launch-card"
        className={cn(
          'relative overflow-hidden rounded-[16px] border border-white/10',
          'flex flex-col items-center',
          'mx-auto w-[220px] p-6',
          'animate-ecojump-glow',
          className,
        )}
        style={{
          background:
            'radial-gradient(ellipse at 50% 15%, rgba(0, 229, 255, 0.10) 0%, transparent 55%), ' +
            'radial-gradient(ellipse at 50% 85%, rgba(0, 245, 160, 0.07) 0%, transparent 50%), ' +
            'linear-gradient(180deg, rgba(8, 28, 46, 0.55) 0%, rgba(2, 6, 23, 0.70) 100%)',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(14px) saturate(120%)',
        }}
      >
        {/* ── Floating teaser elements ──────────────────────────────── */}
        {TEASER_ITEMS.map(({ emoji, className: itemClass }) => (
          <span
            key={emoji}
            className={cn('pointer-events-none absolute text-[0.6rem]', itemClass)}
            aria-hidden
          >
            {emoji}
          </span>
        ))}

        {/* ── Mascot hero zone ─────────────────────────────────────── */}
        <div className="relative flex w-full items-center justify-center pb-2 pt-6">
          {/* Soft radial glow behind mascot */}
          <div
            className="absolute inset-0 top-1/2 -translate-y-1/2"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.14) 0%, rgba(0, 245, 160, 0.06) 40%, transparent 65%)',
            }}
            aria-hidden
          />
          <RobotSeedlingIcon
            size={100}
            variant="hero"
            animated
            glow
            personality={personality}
            className="relative z-10 drop-shadow-[0_0_20px_rgba(0,229,255,0.35)]"
          />
        </div>

        {/* ── Content ──────────────────────────────────────────────── */}
        <div className="relative z-10 w-full pb-4 pt-1">
          {/* Title */}
          <h3 className="text-center font-display text-[1.2rem] font-700 text-foreground">
            <span aria-hidden>🎮</span> EcoJump
          </h3>

          {/* Headline */}
          <p className="mt-1 text-center text-[0.85rem] font-600 text-gradient">
            Save The Planet
          </p>

          {/* Tagline */}
          <p className="mt-1 text-center text-[0.6rem] leading-relaxed text-foreground/55">
            Catch Green.
            <br />
            Avoid Carbon.
          </p>

          {/* ── CTA Button ───────────────────────────────────────── */}
          <button
            id="ecojump-play-now"
            type="button"
            onClick={() => setModalOpen(true)}
            className={cn(
              'mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5',
              'text-sm font-700 text-deepspace',
              'bg-gradient-to-r from-accent-emerald to-accent-cyan',
              'transition-all duration-300',
              'hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(0,245,160,0.35)]',
              'active:scale-[0.98]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            )}
            style={{
              backgroundSize: '200% 100%',
            }}
          >
            <span className="relative">
              Play Now
              <span className="ml-1" aria-hidden>→</span>
            </span>
          </button>
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────── */}
      <EcoJumpModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        personality={personality}
      />
    </>
  );
}
