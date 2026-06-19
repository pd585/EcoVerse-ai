'use client';

/**
 * EcosystemWorld component.
 *
 * Implements a premium, stylized 3D-feeling planetary system.
 * Uses cylindrical scrolling landmasses, cloud parallax, static shadow mapping
 * for a day/night terminator effect, glowing city lights on the dark side,
 * split 3D orbital rings, and dynamic visual stages based on cumulative health (0-100%).
 *
 * @module components/shared/EcosystemWorld
 */

import { useId, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface EcosystemWorldProps {
  /** Diameter of the world element in pixels */
  size?: number;
  className?: string;
  /** Custom state indicator: 'healthy' | 'stressed' */
  state?: 'healthy' | 'stressed';
  /** Cumulative health percentage (0-100) */
  health?: number;
  /** Whether currently in the middle of a cinematic transition */
  transitioning?: boolean;
  /** Set of currently active scenario IDs */
  activeActions?: Set<string>;
}

// ─── Component Continent SVG Map ──────────────────────────────────────────────
// Draws recognizable stylized Earth landmasses (Americas, Greenland, Europe, Africa, Asia, Australia)
const ContinentMap = ({
  fillType,
  hasDiet = false,
}: {
  fillType: 'day' | 'night' | 'stressed';
  hasDiet?: boolean;
}) => {
  const color = useMemo(() => {
    if (fillType === 'day') {
      return hasDiet ? '#059669' : '#4b8b6e'; // Rich emerald vs duller olive/teal-green
    }
    if (fillType === 'stressed') {
      return '#7D6E5C'; // Unhealthy but recoverable dusty brown
    }
    return '#1A2130'; // Dark slate for night side
  }, [fillType, hasDiet]);

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full select-none overflow-visible" fill="none">
      {/* ── Greenland ── */}
      <path
        d="M35,20 C38,15 45,18 42,26 C38,30 32,26 35,20 Z"
        fill={color}
      />

      {/* ── North America ── */}
      <path
        d="M15,35 C20,30 35,28 45,35 C42,45 32,50 35,60 C40,70 42,65 35,75 C25,70 18,80 12,60 C8,50 10,42 15,35 Z"
        fill={color}
      />

      {/* ── South America ── */}
      <path
        d="M30,75 C32,75 35,77 32,83 C30,90 28,100 32,110 C35,117 30,130 25,140 C20,130 15,110 18,95 C20,85 25,77 30,75 Z"
        fill={color}
      />

      {/* ── Europe ── */}
      <path
        d="M78,35 C85,33 92,30 96,38 C94,44 88,46 92,50 C88,54 82,50 78,54 C76,48 74,42 78,35 Z"
        fill={color}
      />

      {/* ── Africa ── */}
      <path
        d="M85,60 C95,57 105,62 110,70 C115,82 110,95 102,110 C92,120 86,125 82,110 C78,100 78,80 85,60 Z"
        fill={color}
      />

      {/* ── Asia ── */}
      <path
        d="M96,38 C115,28 140,30 155,38 C150,47 145,42 150,55 C155,63 148,72 142,80 C132,72 128,75 115,70 C110,62 104,58 100,66 C96,58 94,46 96,38 Z"
        fill={color}
      />

      {/* ── Australia ── */}
      <path
        d="M138,105 C146,101 154,105 150,113 C146,120 135,115 138,105 Z"
        fill={color}
      />

      {/* ── Night Details (City Lights) ────────────────────────── */}
      {fillType === 'night' && (
        <g fill="#FBBF24">
          {/* North America hubs */}
          <circle cx={25} cy={45} r={1.2} className="animate-pulse" />
          <circle cx={32} cy={52} r={1} />
          {/* South America hubs */}
          <circle cx={28} cy={95} r={1} />
          {/* Europe hubs */}
          <circle cx={85} cy={42} r={1.2} className="animate-pulse" />
          <circle cx={88} cy={48} r={0.8} />
          {/* Africa hubs */}
          <circle cx={92} cy={72} r={1} />
          {/* Asia hubs */}
          <circle cx={115} cy={48} r={1.4} className="animate-pulse" />
          <circle cx={130} cy={60} r={1} />
          <circle cx={142} cy={72} r={1.2} className="animate-pulse" />
          {/* Australia hubs */}
          <circle cx={145} cy={110} r={1} />
        </g>
      )}

      {/* ── Stressed Details (Weak eco nodes) ───────────────────── */}
      {fillType === 'stressed' && (
        <g fill="#F59E0B" opacity={0.5}>
          <circle cx={25} cy={45} r={1} />
          <circle cx={85} cy={42} r={1} />
          <circle cx={115} cy={48} r={1} />
        </g>
      )}
    </svg>
  );
};

// ─── Component Cloud SVG Map ──────────────────────────────────────────────────

const CloudMap = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full select-none" fill="none">
    <path d="M15,75 Q35,65 55,75 T95,65 T135,80 Q125,50 95,55 Z" fill="#FFFFFF" opacity={0.25} />
    <path d="M95,135 Q115,125 135,135 T175,125 Q165,100 135,105 Z" fill="#FFFFFF" opacity={0.2} />
  </svg>
);

// ─── Main EcosystemWorld Component ────────────────────────────────────────────

export function EcosystemWorld({
  size = 320,
  className,
  state = 'healthy',
  health = 45,
  transitioning = false,
  activeActions,
}: EcosystemWorldProps) {
  const compId = useId().replace(/:/g, '');
  const shouldReduceMotion = useReducedMotion();

  // Parse active actions for visual stacking
  const hasTransit = activeActions?.has('transit');
  const hasDiet = activeActions?.has('diet');
  const hasSolar = activeActions?.has('solar');
  const hasFlights = activeActions?.has('flights');
  const hasHome = activeActions?.has('home');

  const isHealthy = state === 'healthy';
  const sphereSize = size * 0.82;

  // Stacking: Climate Champion condition
  const isClimateChampion = isHealthy && activeActions?.size === 5;

  // Visual Evolution stages mapping
  const isStage1 = isHealthy && health <= 20;
  const isStage2 = isHealthy && health > 20 && health <= 40;
  const isStage3 = isHealthy && health > 40 && health <= 60;
  const isStage4 = isHealthy && health > 60 && health <= 80;
  const isStage5 = isHealthy && health > 80;

  // Colors config
  const colors = useMemo(() => {
    if (!isHealthy) {
      return {
        coreGlow: 'rgba(239, 68, 68, 0.16)', // Weak stressed red
        accentGlow: 'rgba(245, 158, 11, 0.12)',
        oceanGradient: 'from-[#1B2536] via-[#151D29] to-[#0A0F17]', // Stressed oceans
        atmosphereBorder: 'border-red-500/15',
        ringsColor1: 'rgba(239, 68, 68, 0.18)', // Stressed broken rings
        ringsColor2: 'rgba(245, 158, 11, 0.14)',
        ring1Dash: '4 8',
        ring2Dash: '3 6',
      };
    }

    // Healthy stages colors
    let glow = 'rgba(0, 229, 255, 0.2)'; // Base cyan
    let accent = 'rgba(52, 211, 153, 0.15)'; // Base emerald
    let ringAlpha1 = 0;
    let ringAlpha2 = 0;

    if (isStage2) {
      glow = 'rgba(0, 229, 255, 0.28)';
      accent = 'rgba(52, 211, 153, 0.2)';
    } else if (isStage3) {
      glow = 'rgba(0, 245, 160, 0.35)'; // Vibrant green
      accent = 'rgba(0, 229, 255, 0.28)';
    } else if (isStage4) {
      glow = 'rgba(0, 245, 160, 0.42)';
      accent = 'rgba(0, 229, 255, 0.35)';
      ringAlpha1 = 0.22;
      ringAlpha2 = 0.16;
    } else if (isStage5) {
      glow = 'rgba(0, 245, 160, 0.52)'; // Climate Champion glow
      accent = 'rgba(0, 229, 255, 0.42)';
      ringAlpha1 = 0.35;
      ringAlpha2 = 0.28;
    }

    // Stacking: Solar adds golden highlights
    if (hasSolar) {
      glow = 'rgba(245, 158, 11, 0.35)'; // Golden glow overlays
    }

    const oGradient = (isStage1 || isStage2)
      ? 'from-[#0D2136] via-[#081524] to-[#020617]' // Dark recovering oceans
      : 'from-[#044E7C] via-[#022A4E] to-[#020617]'; // Rich vibrant blue oceans

    // Stacking: Travel flights clear rings
    const r1Dash = '0';
    const r2Dash = '0';

    return {
      coreGlow: transitioning ? 'rgba(0, 245, 160, 0.6)' : glow,
      accentGlow: transitioning ? 'rgba(0, 229, 255, 0.48)' : accent,
      oceanGradient: oGradient,
      atmosphereBorder: (isStage4 || isStage5) ? 'border-accent-cyan/25' : 'border-[#00E5FF]/10',
      ringsColor1: `rgba(0, 229, 255, ${ringAlpha1 || (isStage4 || isStage5 ? 0.22 : 0)})`,
      ringsColor2: `rgba(52, 211, 153, ${ringAlpha2 || (isStage4 || isStage5 ? 0.16 : 0)})`,
      ring1Dash: r1Dash,
      ring2Dash: r2Dash,
    };
  }, [isHealthy, isStage1, isStage2, isStage3, isStage4, isStage5, transitioning, hasSolar]);

  // Wobble animation for Stressed Earth
  const stressedWobble = {
    y: [0, -2.5, 2, -1, 0],
    x: [0, 1, -1.8, 1, 0],
    rotate: [0, 1.2, -0.8, 0.4, 0],
    transition: {
      duration: 6.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  };

  return (
    <motion.div
      className={cn(
        'relative flex items-center justify-center shrink-0 select-none overflow-visible',
        className
      )}
      style={{ width: size, height: size }}
      animate={
        (transitioning
          ? { scale: [1, 1.08, 1.02, 1], rotate: [0, 3, -1, 0] }
          : !isHealthy && !shouldReduceMotion
          ? stressedWobble
          : {}) as any
      }
      transition={{ duration: 1.5, ease: 'easeInOut' as any }}
      aria-hidden
    >
      {/* ── 1. Deep atmospheric outer glow ────────────────────────────── */}
      <motion.div
        className="absolute inset-[8%] rounded-full"
        style={{
          backgroundColor: colors.coreGlow,
          filter: `blur(${size * 0.14}px)`,
        }}
        animate={
          (shouldReduceMotion
            ? {}
            : {
                scale: isHealthy ? [1, 1.08, 1] : [1, 1.03, 1],
                opacity: isHealthy ? [0.75, 0.9, 0.75] : [0.5, 0.7, 0.5],
              }) as any
        }
        transition={{
          duration: isHealthy ? 6 : 9,
          repeat: Infinity,
          ease: 'easeInOut' as any,
        }}
      />

      <motion.div
        className="absolute inset-[16%] rounded-full"
        style={{
          backgroundColor: colors.accentGlow,
          filter: `blur(${size * 0.11}px)`,
        }}
        animate={
          (shouldReduceMotion
            ? {}
            : {
                scale: isHealthy ? [1.08, 0.96, 1.08] : [1.04, 0.98, 1.04],
                opacity: isHealthy ? [0.65, 0.8, 0.65] : [0.45, 0.6, 0.45],
              }) as any
        }
        transition={{
          duration: isHealthy ? 9 : 12,
          repeat: Infinity,
          ease: 'easeInOut' as any,
        }}
      />

      {/* ── 2. BACK RING PORTIONS (Clipped to top half) ───────────────── */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible">
        <defs>
          <clipPath id={`back-clip-${compId}`}>
            <rect x={0} y={0} width={size} height={size * 0.5} />
          </clipPath>
        </defs>

        {/* Inner Ring (Back half) */}
        {(!isHealthy || isStage4 || isStage5) && (
          <g transform={`rotate(-15, ${size / 2}, ${size / 2})`} clipPath={`url(#back-clip-${compId})`}>
            <ellipse
              cx={size / 2}
              cy={size / 2}
              rx={size * 0.48}
              ry={size * 0.12}
              fill="none"
              stroke={colors.ringsColor1}
              strokeWidth={1.5}
              strokeDasharray={colors.ring1Dash}
            />
          </g>
        )}

        {/* Outer Ring (Back half) */}
        {(!isHealthy || isStage4 || isStage5) && (
          <g transform={`rotate(10, ${size / 2}, ${size / 2})`} clipPath={`url(#back-clip-${compId})`}>
            <ellipse
              cx={size / 2}
              cy={size / 2}
              rx={size * 0.55}
              ry={size * 0.14}
              fill="none"
              stroke={colors.ringsColor2}
              strokeWidth={1.5}
              strokeDasharray={colors.ring2Dash}
            />
          </g>
        )}

        {/* Climate Champion: Subtle Orbital indicators wrap around (Back Clip) */}
        {isClimateChampion && (
          <g transform={`rotate(-15, ${size / 2}, ${size / 2})`} clipPath={`url(#back-clip-${compId})`}>
            <g transform={`translate(${size / 2}, ${size / 2})`}>
              <motion.g
                animate={(shouldReduceMotion ? {} : { rotate: 360 }) as any}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' as any }}
              >
                <g style={{ transform: `scaleY(${0.17 / 0.62})` }}>
                  {/* 🌱 */}
                  <g transform={`translate(${size * 0.62}, 0)`}>
                    <text x={-6} y={4} fontSize={12} opacity={0.65}>🌱</text>
                  </g>
                  {/* ☀️ */}
                  <g transform={`rotate(120) translate(${size * 0.62}, 0) rotate(-120)`}>
                    <text x={-6} y={4} fontSize={12} opacity={0.65}>☀️</text>
                  </g>
                  {/* ♻️ */}
                  <g transform={`rotate(240) translate(${size * 0.62}, 0) rotate(-240)`}>
                    <text x={-6} y={4} fontSize={12} opacity={0.65}>♻️</text>
                  </g>
                </g>
              </motion.g>
            </g>
          </g>
        )}
      </svg>

      {/* ── 3. Ecosystem Sphere Body ─────────────────────────────────── */}
      <div
        className={cn(
          'absolute overflow-hidden rounded-full border bg-gradient-to-b',
          colors.atmosphereBorder,
          colors.oceanGradient
        )}
        style={{
          width: sphereSize,
          height: sphereSize,
          boxShadow: isHealthy
            ? 'inset 0 0 30px rgba(0, 229, 255, 0.16), 0 0 25px rgba(8, 28, 46, 0.8)'
            : 'inset 0 0 20px rgba(239, 68, 68, 0.12), 0 0 20px rgba(2, 6, 23, 0.95)',
        }}
      >
        {/* Pulsing Energy Core */}
        {isHealthy && (
          <motion.div
            className="absolute inset-[24%] rounded-full bg-gradient-to-tr from-[#00F5A0]/25 to-[#00E5FF]/25 blur-[6px]"
            animate={
              (shouldReduceMotion
                ? {}
                : {
                    scale: [0.9, 1.12, 0.9],
                    opacity: [0.4, 0.75, 0.4],
                  }) as any
            }
            transition={{
              duration: hasHome ? 2.5 : 4.5, // Stacking: Home makes energy core pulse faster
              repeat: Infinity,
              ease: 'easeInOut' as any,
            }}
          />
        )}

        {/* ── A. Night Continents Layer (Vulnerable underneath) ───── */}
        <motion.div
          className="absolute inset-0 flex"
          style={{ width: '200%', height: '100%' }}
          animate={
            (shouldReduceMotion
              ? {}
              : {
                  x: ['0%', '-50%'],
                }) as any
          }
          transition={{
            duration: isHealthy ? 14 : 26,
            repeat: Infinity,
            ease: 'linear' as any,
          }}
        >
          <div className="w-1/2 h-full shrink-0">
            <ContinentMap fillType={isHealthy ? 'night' : 'stressed'} hasDiet={hasDiet} />
          </div>
          <div className="w-1/2 h-full shrink-0">
            <ContinentMap fillType={isHealthy ? 'night' : 'stressed'} hasDiet={hasDiet} />
          </div>
        </motion.div>

        {/* ── B. Day Continents Layer (Masked for Day/Night Terminator) ── */}
        {isHealthy && (
          <motion.div
            className="absolute inset-0 flex"
            style={{
              width: '200%',
              height: '100%',
              maskImage: 'linear-gradient(to right, black 32%, transparent 68%)',
              WebkitMaskImage: 'linear-gradient(to right, black 32%, transparent 68%)',
            }}
            animate={
              (shouldReduceMotion
                ? {}
                : {
                    x: ['0%', '-50%'],
                  }) as any
            }
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: 'linear' as any,
            }}
          >
            <div className="w-1/2 h-full shrink-0">
              <ContinentMap fillType="day" hasDiet={hasDiet} />
            </div>
            <div className="w-1/2 h-full shrink-0">
              <ContinentMap fillType="day" hasDiet={hasDiet} />
            </div>
          </motion.div>
        )}

        {/* ── C. Cloud Layer (Parallax scrolling) ────────────────── */}
        {(!isHealthy || !isStage1) && (
          <motion.div
            className="absolute inset-0 mix-blend-screen pointer-events-none"
            style={{
              width: '200%',
              height: '100%',
              opacity: hasTransit ? 0.16 : 0.4, // Stacking: Transit clears the clouds/haze
            }}
            animate={
              (shouldReduceMotion
                ? {}
                : {
                    x: ['0%', '-50%'],
                  }) as any
            }
            transition={{
              duration: isHealthy ? (hasHome ? 12 : 20) : 34, // Stacking: Home makes clouds move faster
              repeat: Infinity,
              ease: 'linear' as any,
            }}
          >
            <div className="w-1/2 h-full shrink-0">
              <CloudMap />
            </div>
            <div className="w-1/2 h-full shrink-0">
              <CloudMap />
            </div>
          </motion.div>
        )}

        {/* ── Stage 3+ Ecosystem particles inside ───────────────── */}
        {isHealthy && (isStage3 || isStage4 || isStage5) && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Soft floating green energy nodes */}
            <motion.div
              className="absolute top-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-accent-emerald"
              animate={{ y: [-4, 4, -4], opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as any }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-accent-cyan"
              animate={{ y: [3, -3, 3], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5, ease: 'easeInOut' as any }}
            />
          </div>
        )}

        {/* ── D. 3D Spherical Shadow & Lighting Layer ───────────── */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-multiply"
          style={{
            background: 'radial-gradient(circle at 35% 35%, transparent 20%, rgba(2, 6, 23, 0.88) 85%)',
          }}
        />

        {/* Sunlight highlights & reflection */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            background: 'radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.24) 0%, transparent 55%)',
          }}
        />

        {/* Stacking: Solar adds warm golden sunlight highlight reflection */}
        {hasSolar && (
          <div
            className="absolute inset-0 pointer-events-none mix-blend-color-dodge"
            style={{
              background: 'radial-gradient(circle at 75% 25%, rgba(253, 224, 71, 0.25) 0%, transparent 60%)',
            }}
          />
        )}

        <div className="absolute top-1 left-2.5 right-2.5 h-1 rounded-full bg-gradient-to-r from-transparent via-white/8 to-transparent blur-[0.5px]" />
      </div>

      {/* ── 4. FRONT RING PORTIONS (Clipped to bottom half) ──────────── */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible" style={{ zIndex: 10 }}>
        <defs>
          <clipPath id={`front-clip-${compId}`}>
            <rect x={0} y={size * 0.5} width={size} height={size * 0.5} />
          </clipPath>
        </defs>

        {/* Inner Ring (Front half) */}
        {(!isHealthy || isStage4 || isStage5) && (
          <g transform={`rotate(-15, ${size / 2}, ${size / 2})`} clipPath={`url(#front-clip-${compId})`}>
            <ellipse
              cx={size / 2}
              cy={size / 2}
              rx={size * 0.48}
              ry={size * 0.12}
              fill="none"
              stroke={colors.ringsColor1}
              strokeWidth={1.5}
              strokeDasharray={colors.ring1Dash}
            />

            {/* Tiny Sustainability Orbit Indicators (Stage 5) */}
            {isStage5 && (
              <g transform={`translate(${size / 2}, ${size / 2})`}>
                <motion.g
                  animate={(shouldReduceMotion ? {} : { rotate: 360 }) as any}
                  transition={{ duration: 11, repeat: Infinity, ease: 'linear' as any }}
                >
                  <g style={{ transform: `scaleY(${0.12 / 0.48})` }}>
                    <g transform={`translate(${size * 0.48}, 0)`}>
                      <circle r={2.2} fill="#00FFD5" className="drop-shadow-[0_0_4px_#00FFD5]" />
                    </g>
                  </g>
                </motion.g>
              </g>
            )}
          </g>
        )}

        {/* Outer Ring (Front half) */}
        {(!isHealthy || isStage4 || isStage5) && (
          <g transform={`rotate(10, ${size / 2}, ${size / 2})`} clipPath={`url(#front-clip-${compId})`}>
            <ellipse
              cx={size / 2}
              cy={size / 2}
              rx={size * 0.55}
              ry={size * 0.14}
              fill="none"
              stroke={colors.ringsColor2}
              strokeWidth={1.5}
              strokeDasharray={colors.ring2Dash}
            />

            {/* Tiny Sustainability Orbit Indicators 2 (Stage 5) */}
            {isStage5 && (
              <g transform={`translate(${size / 2}, ${size / 2})`}>
                <motion.g
                  animate={(shouldReduceMotion ? {} : { rotate: -360 }) as any}
                  transition={{ duration: 17, repeat: Infinity, ease: 'linear' as any }}
                >
                  <g style={{ transform: `scaleY(${0.14 / 0.55})` }}>
                    <g transform={`translate(${size * 0.55}, 0)`}>
                      <circle r={2.2} fill="#34D399" className="drop-shadow-[0_0_4px_#34D399]" />
                    </g>
                  </g>
                </motion.g>
              </g>
            )}
          </g>
        )}

        {/* Climate Champion: Subtle Orbital indicators wrap around (Front Clip) */}
        {isClimateChampion && (
          <g transform={`rotate(-15, ${size / 2}, ${size / 2})`} clipPath={`url(#front-clip-${compId})`}>
            <g transform={`translate(${size / 2}, ${size / 2})`}>
              <motion.g
                animate={(shouldReduceMotion ? {} : { rotate: 360 }) as any}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' as any }}
              >
                <g style={{ transform: `scaleY(${0.17 / 0.62})` }}>
                  {/* 🌱 */}
                  <g transform={`translate(${size * 0.62}, 0)`}>
                    <text x={-6} y={4} fontSize={12} opacity={0.65}>🌱</text>
                  </g>
                  {/* ☀️ */}
                  <g transform={`rotate(120) translate(${size * 0.62}, 0) rotate(-120)`}>
                    <text x={-6} y={4} fontSize={12} opacity={0.65}>☀️</text>
                  </g>
                  {/* ♻️ */}
                  <g transform={`rotate(240) translate(${size * 0.62}, 0) rotate(-240)`}>
                    <text x={-6} y={4} fontSize={12} opacity={0.65}>♻️</text>
                  </g>
                </g>
              </motion.g>
            </g>
          </g>
        )}
      </svg>

      {/* ── 5. Climate Champion Aurora Overlay & Particles ────────── */}
      {isStage5 && (
        <>
          {/* Aurora Outer ring */}
          <div
            className="absolute -inset-[3%] rounded-full border border-accent-emerald/20 pointer-events-none animate-pulse-glow"
            style={{
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.15)',
              mixBlendMode: 'screen',
            }}
          />

          {/* Floating leaf particles */}
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            <motion.span
              className="absolute text-xs"
              style={{ top: '15%', left: '15%' }}
              animate={{ y: [-5, 5, -5], scale: [0.9, 1.1, 0.9], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' as any }}
            >
              🌱
            </motion.span>
            <motion.span
              className="absolute text-[10px]"
              style={{ bottom: '15%', right: '18%' }}
              animate={{ y: [4, -4, 4], scale: [1, 0.8, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' as any, delay: 0.8 }}
            >
              🍃
            </motion.span>
          </div>
        </>
      )}
    </motion.div>
  );
}
