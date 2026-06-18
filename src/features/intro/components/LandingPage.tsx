/**
 * EcoVerse AI Landing Page — Cinematic Visual Richness Upgrade.
 * Evolved into an immersive, premium, Awwwards-grade visual story.
 *
 * Keeps all existing scroll architecture, section progression, Framer Motion setup,
 * and narrative flow intact, while upgrading background atmospheres, organic growths,
 * 3D parallax systems, glowing SVG nodes with icons, and glassmorphic card presentation.
 *
 * @module features/intro/components/LandingPage
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  type MotionValue,
} from 'framer-motion';
import {
  ArrowRight,
  Building2,
  Leaf,
  Recycle,
  SunMedium,
  TramFront,
  Trees,
  Cpu,
} from 'lucide-react';
import { useMemo, useRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import { RobotSeedlingIcon } from '@/components/brand';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

const storyBeats = [
  {
    headline: 'Every future begins with a choice.',
    body: 'A single signal wakes beneath the surface. Quiet at first, then impossible to ignore.',
    align: 'items-start text-left',
  },
  {
    headline: 'Small actions create bigger change.',
    body: 'Energy begins to move. Roots search for one another. The world starts responding to your momentum.',
    align: 'items-end text-right',
  },
  {
    headline: 'Everything is connected.',
    body: 'Transport, food, energy, homes, and communities become one living intelligence.',
    align: 'items-start text-left',
  },
  {
    headline: 'Imagine the future we could build.',
    body: 'Architecture grows with nature. Mobility becomes clean and quiet. Data feels less like control and more like care.',
    align: 'items-end text-right',
  },
  {
    headline: 'See the future your choices create.',
    body: 'EcoVerse AI emerges from the living system as mission control for your personal climate journey.',
    align: 'items-center text-center',
    cta: true,
  },
] as const;

const discoveryCards = [
  {
    title: 'Sustainable Living',
    body: 'Daily choices become visible as gentle signals in the system.',
    icon: Leaf,
    tint: 'from-emerald-300/20 to-cyan-300/10',
    illustration: 'living',
  },
  {
    title: 'Renewable Energy',
    body: 'Clean power routes through homes, grids, and habits.',
    icon: SunMedium,
    tint: 'from-yellow-200/20 to-emerald-300/10',
    illustration: 'energy',
  },
  {
    title: 'Smart Transportation',
    body: 'Movement patterns shift toward cleaner, calmer mobility.',
    icon: TramFront,
    tint: 'from-cyan-300/20 to-blue-300/10',
    illustration: 'transit',
  },
  {
    title: 'Circular Economy',
    body: 'Consumption loops bend toward repair, reuse, and renewal.',
    icon: Recycle,
    tint: 'from-teal-300/20 to-emerald-300/10',
    illustration: 'circular',
  },
  {
    title: 'Smart Cities',
    body: 'Urban systems learn to breathe with the ecosystems around them.',
    icon: Building2,
    tint: 'from-sky-300/20 to-lime-300/10',
    illustration: 'cities',
  },
  {
    title: 'Nature Recovery',
    body: 'Regeneration turns from a metric into a visible landscape.',
    icon: Trees,
    tint: 'from-green-300/20 to-cyan-300/10',
    illustration: 'nature',
  },
] as const;

const storyCardGroups = [
  [discoveryCards[0], discoveryCards[1]],
  [discoveryCards[2], discoveryCards[3]],
  [discoveryCards[4], discoveryCards[5]],
] as const;

const rootPaths = [
  'M600 570 C560 520 510 505 450 475 C390 445 355 390 300 338', // to living
  'M600 570 C655 515 720 508 780 475 C850 436 884 382 930 315', // to energy
  'M600 570 C588 498 612 444 648 392 C690 332 725 292 790 240', // to mobility
  'M600 570 C552 492 548 428 570 364 C595 292 570 245 515 202', // to nature
  'M600 570 C588 498 612 444 660 410 C710 376 750 430 780 475', // to insight
  'M600 570 C708 548 790 590 870 642 C935 684 1000 696 1060 682', // to cities
] as const;

const networkPaths = [
  'M300 338 C420 288 480 220 515 202', // Living to Nature
  'M515 202 C640 210 720 220 790 240', // Nature to Mobility
  'M790 240 C840 260 880 280 930 315', // Mobility to Energy
  'M780 475 C880 540 980 600 1060 682', // Insight to Cities
] as const;

// Nodes mapped to specific diagnostic symbols to represent intelligence
const nodes = [
  { x: 300, y: 338, label: 'living', size: 9, path: 'M12 2C11.5 2.5 7.5 7 7.5 12C7.5 14.8 9.8 17 12.5 17C15.2 17 17.5 14.8 17.5 12C17.5 7 13.5 2.5 12 2Z' }, // Leaf
  { x: 930, y: 315, label: 'energy', size: 10, path: 'M13 2L3 14H12L11 22L21 10H12L13 2Z' }, // Zap
  { x: 790, y: 240, label: 'mobility', size: 8, path: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2a3 3 0 0 0 6 0h2a3 3 0 0 0 6 0Z' }, // Car
  { x: 515, y: 202, label: 'nature', size: 8, path: 'M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13s-7 8.7-7 13a7 7 0 0 0 7 7Z' }, // Water
  { x: 1060, y: 682, label: 'cities', size: 10, path: 'M4 22V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v18 M9 6h2v2H9z M9 11h2v2H9z M13 6h2v2h-2z M13 11h2v2h-2z M9 16h2v2H9z M13 16h2v2h-2z' }, // Building
  { x: 780, y: 475, label: 'insight', size: 8, path: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' }, // Recycle
] as const;

function useProgressRange(
  progress: MotionValue<number>,
  input: [number, number, number, number],
): MotionValue<number> {
  return useTransform(progress, input, [0, 1, 1, 0]);
}

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    mass: 0.35,
  });

  return (
    <main ref={containerRef} className="relative min-h-[780svh] overflow-clip bg-[#020617] text-white">
      <style>{`
        @keyframes drift-fog-left {
          0% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-80px, 10px, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes drift-fog-right {
          0% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(80px, -15px, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes slow-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-drift-left {
          animation: drift-fog-left calc(80s / var(--drift-speed-factor, 1)) ease-in-out infinite;
        }
        .animate-drift-right {
          animation: drift-fog-right calc(110s / var(--drift-speed-factor, 1)) ease-in-out infinite;
        }
        .animate-slow-spin {
          animation: slow-rotate 40s linear infinite;
        }
      `}</style>

      <LivingCanvas progress={progress} reduceMotion={!!shouldReduceMotion} />
      <IntroNav />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-5 pb-24 pt-24 sm:px-8">
        {storyBeats.map((beat, index) => {
          if (index === 4) {
            return <ProductStoryboard key={beat.headline} progress={progress} />;
          }
          return (
            <StoryBeat
              key={beat.headline}
              beat={beat}
              cards={index < storyCardGroups.length ? storyCardGroups[index] : undefined}
              index={index}
              progress={progress}
            />
          );
        })}
      </div>
    </main>
  );
}

function IntroNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href={ROUTES.HOME}
          className="group inline-flex items-center gap-3 rounded-full border border-accent-cyan/15 bg-black/25 px-3.5 py-2 backdrop-blur-2xl transition-all hover:bg-white/10"
          aria-label="EcoVerse AI home"
        >
          <RobotSeedlingIcon className="h-8 w-8" />
          <span className="font-display text-sm font-700 tracking-normal sm:text-base">
            EcoVerse <span className="text-emerald-200">AI</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2" aria-label="Intro actions">
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="hidden rounded-full px-4 py-2 text-sm font-600 text-emerald-50/75 transition-colors hover:text-white sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-aurora px-4 text-sm font-700 text-slate-950 shadow-[0_0_30px_rgba(110,255,206,0.35)] transition-transform hover:scale-[1.03]"
          >
            Start Journey
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </nav>
      </div>
    </header>
  );
}

function StoryBeat({
  beat,
  cards = [],
  index,
  progress,
}: {
  beat: (typeof storyBeats)[number];
  cards?: readonly (typeof discoveryCards)[number][];
  index: number;
  progress: MotionValue<number>;
}) {
  const start = index * 0.18;
  const end = start + 0.24;
  const opacity = useProgressRange(progress, [start, start + 0.05, end - 0.05, end]);
  const y = useTransform(progress, [start, end], [32, -32]);
  const isLeftAligned = index % 2 === 0;

  return (
    <section className="grid min-h-[150svh] content-center py-24">
      <div
        className={cn(
          'grid w-full items-center gap-10 md:grid-cols-[minmax(0,45%)_minmax(0,10%)_minmax(0,45%)]',
          !isLeftAligned && 'md:[&>*:first-child]:col-start-3 md:[&>*:last-child]:col-start-1 md:[&>*:last-child]:row-start-1',
        )}
      >
        <motion.div
          style={{ opacity, y }}
          className={cn(
            'max-w-[36rem] rounded-2xl border border-white/5 bg-slate-950/30 p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] backdrop-blur-[6px] sm:p-8',
            isLeftAligned ? 'text-left md:col-start-1' : 'text-left md:col-start-3 md:text-right',
          )}
        >
          <h1
            className={
              index === 0
                ? 'text-balance font-display text-[clamp(2.35rem,7vw,4.75rem)] font-700 leading-[0.92] tracking-normal'
                : 'text-balance font-display text-[clamp(1.95rem,5vw,4.25rem)] font-700 leading-[0.96] tracking-normal'
            }
          >
            {beat.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-emerald-50/72 sm:text-lg">
            {beat.body}
          </p>

          {'cta' in beat && beat.cta && (
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={ROUTES.AUTH.LOGIN}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-700 text-slate-950 shadow-[0_0_50px_rgba(255,255,255,0.32)] transition-transform hover:scale-[1.03] sm:w-auto"
              >
                Start Journey
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={ROUTES.ASSESSMENT.ROOT}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/14 bg-white/8 px-7 text-sm font-700 text-white backdrop-blur-xl transition-colors hover:bg-white/14 sm:w-auto"
              >
                Explore Your Footprint
              </Link>
            </div>
          )}
        </motion.div>

        {cards.length > 0 && (
          <div
            className={cn(
              'flex flex-col gap-5 md:col-span-1',
              isLeftAligned ? 'md:col-start-3' : 'md:col-start-1 md:row-start-1',
            )}
          >
            {cards.map((card, cardIndex) => (
              <DiscoveryStoryCard
                key={card.title}
                card={card}
                index={cardIndex}
                progress={progress}
                storyIndex={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function DiscoveryStoryCard({
  card,
  index,
  progress,
  storyIndex,
}: {
  card: (typeof discoveryCards)[number];
  index: number;
  progress: MotionValue<number>;
  storyIndex: number;
}) {
  const Icon = card.icon;
  const start = storyIndex * 0.18 + 0.055 + index * 0.075;
  const enterEnd = start + 0.025;
  const exitStart = start + 0.145;
  const exitEnd = start + 0.175;
  const opacity = useTransform(progress, [start, enterEnd, exitStart, exitEnd], [0, 1, 1, 0]);
  const scale = useTransform(progress, [start, enterEnd, exitStart, exitEnd], [0.92, 1, 1, 0.97]);
  const y = useTransform(progress, [start, enterEnd, exitStart, exitEnd], [24, 0, 0, -24]);

  return (
    <motion.article
      style={{ opacity, scale, y }}
      className="group relative min-h-64 overflow-hidden rounded-2xl border border-accent-cyan/12 bg-slate-950/75 p-5 shadow-[0_25px_60px_-15px_rgba(2,3,10,0.85)] backdrop-blur-3xl"
    >
      <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF]/40 to-transparent" />

      <div className="flex h-full flex-col justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 font-display text-base font-700 tracking-normal text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 text-emerald-300 shadow-[0_0_12px_rgba(110,255,206,0.15)]">
              <Icon className="h-4.5 w-4.5" aria-hidden />
            </span>
            {card.title}
          </h2>
          <p className="mt-2.5 text-xs leading-relaxed text-emerald-50/70">{card.body}</p>
        </div>

        <div className="relative h-28 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
          <Image
            src={cardImageMap[card.illustration]}
            alt={card.title}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover opacity-75 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        </div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary/60">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#00F5A0] to-[#00E5FF]"
          initial={{ width: '18%' }}
          whileInView={{ width: `${64 + storyIndex * 8 + index * 5}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.1 }}
        />
      </div>
    </motion.article>
  );
}
function LivingCanvas({
  progress,
  reduceMotion,
}: {
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const seedScale = useTransform(progress, [0, 0.25, 0.8, 1], [1, 1.35, 0.88, 0.58]);
  const seedY = useTransform(progress, [0, 1], [90, -26]);
  const rootLength = useTransform(progress, [0.12, 0.6], [0, 1]);
  const networkLength = useTransform(progress, [0.32, 0.78], [0, 1]);
  const networkOpacity = useTransform(progress, [0.24, 0.42], [0, 1]);
  
  // Delayed timing for future city: emerges in Section 4, fully visible in Section 5
  // Skyline intensity reduced by 30% in the final beat (to 0.45) to make storyboard the hero
  const futureOpacity = useTransform(progress, [0.56, 0.76, 0.78, 1], [0, 0.7, 0.7, 0.45]);

  // Safe Zone horizontal layout composition
  const canvasX = useTransform(
    progress,
    [0, 0.15, 0.21, 0.33, 0.39, 0.51, 0.57, 0.75, 0.81, 1],
    [180, 180, -180, -180, 180, 180, -180, -180, 0, 0]
  );

  // Parallax Y translations - background moves slower for subtle parallax depth
  const bgY = useTransform(progress, [0, 1], [30, -30]);
  const midY = useTransform(progress, [0, 1], [100, -100]);
  const canvasScale = useTransform(progress, [0, 1], [1, 1.04]);

  const pulseOpacity = useTransform(progress, [0, 0.5, 1], [0.22, 0.48, 0.7]);

  // Civilization soft emergence: blur & translation
  const civBlur = useTransform(progress, [0.56, 0.76], [10, 0]);
  const civY = useTransform(progress, [0.56, 0.76], [48, 0]);
  const filterString = useMotionTemplate`blur(${civBlur}px)`;

  // Section 4 payoff: skyline brightness climbs dynamically when Smart Cities is highlighted
  const cityGlow = useTransform(progress, [0.54, 0.60, 0.66, 0.78], [0.1, 0.85, 0.4, 0.4]);

  // Reduce atmospheric fog opacity by 50% in final beat
  const fogOpacity = useTransform(progress, [0.72, 0.78, 1], [0.25, 0.25, 0.12]);

  // Reduce root glow intensity by 40% in final beat
  const rootOpacity = useTransform(progress, [0.72, 0.78, 1], [0.85, 0.85, 0.5]);

  // Dynamic atmospheric coloring for environmental storytelling
  const themeColor1 = useTransform(
    progress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      "rgba(0, 245, 160, 0.07)",
      "rgba(52, 211, 153, 0.11)",
      "rgba(0, 229, 255, 0.09)",
      "rgba(0, 245, 160, 0.07)",
      "rgba(167, 243, 208, 0.12)"
    ]
  );
  const themeColor2 = useTransform(
    progress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      "rgba(0, 229, 255, 0.05)",
      "rgba(0, 245, 160, 0.07)",
      "rgba(52, 211, 153, 0.09)",
      "rgba(0, 229, 255, 0.07)",
      "rgba(255, 255, 255, 0.07)"
    ]
  );
  const bgGradient = useMotionTemplate`radial-gradient(circle at 50% 68%, ${themeColor1}, transparent 32%), radial-gradient(circle at 80% 25%, ${themeColor2}, transparent 35%), linear-gradient(180deg, #020617 0%, #061524 50%, #082136 100%)`;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#020617]" aria-hidden>
      {/* ── Layer 1: Deep Atmosphere & Volumetric Glows ── */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: bgGradient,
          y: bgY,
        }}
      />
      <AuroraField />

      {/* Volumetric glow regions */}
      <div className="absolute top-1/4 left-1/3 h-[45dvh] w-[45dvw] rounded-full bg-emerald-500/3 blur-[130px] animate-slow-spin" />
      <div className="absolute bottom-1/3 right-1/4 h-[50dvh] w-[50dvw] rounded-full bg-cyan-500/3 blur-[160px] animate-slow-spin" />

      {/* ── Layer 2: Drifting Environmental Fog (Varying speeds) ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: fogOpacity }}
      >
        <div className="absolute -left-[20%] top-[40%] h-[35dvh] w-[140dvw] bg-gradient-to-r from-transparent via-cyan-500/2 to-transparent blur-[95px] animate-drift-left" />
        <div className="absolute -left-[20%] top-[20%] h-[40dvh] w-[140dvw] bg-gradient-to-r from-transparent via-emerald-500/1.8 to-transparent blur-[125px] animate-drift-right" />
        <div className="absolute -left-[25%] bottom-[10%] h-[30dvh] w-[150dvw] bg-gradient-to-r from-transparent via-blue-500/2 to-transparent blur-[145px] animate-drift-left" />
      </motion.div>

      {/* ── Layer 3: Ecosystem Particles (Background Parallax) ── */}
      <AtmosphericParticles progress={progress} reduceMotion={reduceMotion} />

      {/* ── Layer 4: Organic Ground World (Veins & Roots in Midground) ── */}
      <motion.div className="absolute inset-0 opacity-[0.09] pointer-events-none" style={{ y: midY, x: canvasX }}>
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <path d="M 0 500 Q 300 450 600 570 T 1200 600" fill="none" stroke="#00F5A0" strokeWidth="1.8" />
          <path d="M 100 800 Q 400 650 600 570 T 1100 200" fill="none" stroke="#00E5FF" strokeWidth="1.2" />
          <path d="M 200 0 Q 350 350 600 570 T 900 800" fill="none" stroke="#a7f3d0" strokeWidth="1.5" />
        </svg>
      </motion.div>

      {/* Ambient background grids */}
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(0,245,160,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.015)_1px,transparent_1px)] [background-size:96px_96px]" />

      {/* Main SVG Graphic System (Midground) */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        role="img"
      >
        <defs>
          <radialGradient id="seedGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ecfff8" />
            <stop offset="36%" stopColor="#00F5A0" stopOpacity="0.95" />
            <stop offset="72%" stopColor="#00E5FF" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="rootLine" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F5A0" stopOpacity="0.2" />
            <stop offset="45%" stopColor="#00F5A0" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="rootBarkGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#031412" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#05241e" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#082d27" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="mountainGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#081c2e" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="mountainGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#051524" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="skylineMist" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="futureLine" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#a7f3d0" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.66" />
          </linearGradient>
          <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5A0" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>
          <radialGradient id="seedRippleGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00F5A0" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#00E5FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="buildingCoreGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00F5A0" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.85" />
          </linearGradient>
          <filter id="hazeFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.04 0" />
          </filter>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle atmospheric haze grain overlay */}
        <rect width="1200" height="800" filter="url(#hazeFilter)" opacity="0.75" pointerEvents="none" />

        <motion.g style={{ y: seedY, x: canvasX, scale: canvasScale, transformOrigin: '600px 570px' }}>
          {/* 1. SEED WORLD ENHANCEMENTS */}
          <motion.g style={{ scale: seedScale, transformOrigin: '600px 570px' }}>
            <motion.circle
              cx="600"
              cy="570"
              r="120"
              fill="url(#seedGlow)"
              opacity={pulseOpacity}
              filter="url(#softGlow)"
            />
            {/* Seed energy ripples */}
            {[0, 1.2, 2.4, 3.6].map((delay) => (
              <motion.circle
                key={delay}
                cx="600"
                cy="570"
                r="16"
                fill="none"
                stroke="url(#leafGradient)"
                strokeWidth="1.8"
                filter="url(#glow)"
                animate={reduceMotion ? undefined : { r: [16, 220], opacity: [0.85, 0] }}
                transition={{ duration: 4.8, delay, repeat: Infinity, ease: 'easeOut' }}
              />
            ))}
            {/* Center core - upgraded to Robot Seedling Mascot */}
            <foreignObject
              x={568}
              y={538}
              width={64}
              height={64}
              className="overflow-visible"
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950/80 border border-accent-cyan/25 shadow-[0_0_25px_rgba(0,245,160,0.3)]">
                <RobotSeedlingIcon size={52} animated={true} glow={true} variant="hero" />
              </div>
            </foreignObject>
            {/* Orbiting core dust (Elliptical paths) */}
            <motion.g
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              style={{ originX: '600px', originY: '570px' }}
            >
              <circle cx="555" cy="535" r="3" fill="#ffffff" filter="url(#glow)" />
              <circle cx="645" cy="605" r="2" fill="#00F5A0" filter="url(#glow)" />
            </motion.g>
            <motion.g
              animate={reduceMotion ? undefined : { rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              style={{ originX: '600px', originY: '570px' }}
            >
              <circle cx="540" cy="600" r="2.2" fill="#00E5FF" filter="url(#glow)" />
              <circle cx="660" cy="540" r="1.8" fill="#ffffff" filter="url(#glow)" />
            </motion.g>
          </motion.g>

          {/* 2. ORGANIC VEINS & GROWING ROOTS */}
          <motion.g fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: rootOpacity }}>
            {rootPaths.map((path, index) => {
              const barkWidth = index < 2 ? 7.0 : 4.8;
              const coreWidth = index < 2 ? 2.5 : 1.6;
              return (
                <g key={`root-group-${index}`}>
                  {/* Outer Bark Stroke */}
                  <motion.path
                    d={path}
                    pathLength={rootLength}
                    stroke="url(#rootBarkGradient)"
                    strokeWidth={barkWidth}
                    opacity={0.9}
                  />
                  {/* Inner Glowing Core */}
                  <motion.path
                    d={path}
                    pathLength={rootLength}
                    stroke="url(#rootLine)"
                    strokeWidth={coreWidth}
                    opacity={0.9}
                    filter="url(#glow)"
                  />
                  {/* Glowing fluid/energy pulses */}
                  <motion.path
                    d={path}
                    pathLength={rootLength}
                    stroke="#ffffff"
                    strokeWidth={coreWidth * 0.5}
                    strokeDasharray="14 45"
                    opacity={0.85}
                    filter="url(#glow)"
                    animate={{ strokeDashoffset: [0, -100] }}
                    transition={{ duration: 4.5 + index * 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                </g>
              );
            })}

            {/* Organic Sprouts & Leaves growing along roots */}
            <LeafSprout cx={450} cy={475} scale={useTransform(rootLength, [0.15, 0.45], [0, 1])} />
            <LeafSprout cx={780} cy={475} scale={useTransform(rootLength, [0.25, 0.55], [0, 1])} />
            <LeafSprout cx={342} cy={656} scale={useTransform(rootLength, [0.35, 0.65], [0, 1])} />
            <LeafSprout cx={870} cy={642} scale={useTransform(rootLength, [0.45, 0.75], [0, 1])} />
            <LeafSprout cx={515} cy={202} scale={useTransform(rootLength, [0.3, 0.6], [0, 1])} />

            {/* Network connecting stage */}
            <motion.g style={{ opacity: networkOpacity }}>
              {networkPaths.map((path, index) => (
                <motion.path
                  key={path}
                  d={path}
                  pathLength={networkLength}
                  stroke="url(#futureLine)"
                  strokeWidth={index === 0 ? 2.5 : 1.6}
                  strokeDasharray={index % 2 === 0 ? '8 14' : '4 12'}
                  filter="url(#glow)"
                />
              ))}
            </motion.g>
          </motion.g>

          {/* 3. CONNECTION STAGE: Nodes with coordinate telemetry details */}
          <motion.g style={{ opacity: networkOpacity }}>
            {nodes.map((node, index) => (
              <NetworkNode
                key={node.label}
                node={node}
                index={index}
                networkOpacity={networkOpacity}
                reduceMotion={reduceMotion}
              />
            ))}
          </motion.g>

          {/* ── CARD ORIGINS: Emerging Cards inside SVG ── */}
          {/* 4. FUTURE CIVILIZATION STAGE (Gradual emergence: blur-to-focus) */}
          <motion.g style={{ opacity: futureOpacity, filter: filterString, y: civY }}>
            <LivingArchitecture cityGlow={cityGlow} />
          </motion.g>
        </motion.g>
      </svg>

      {/* ── Layer 5: Foreground blurred leaves & spores ── */}
      <div className="hidden md:block">
        <GlowingLeavesForeground progress={progress} />
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#020617] to-transparent pointer-events-none"
        style={{ opacity: useTransform(progress, [0, 1], [0.65, 0.25]) }}
      />
      <ProgressTrace progress={progress} />
    </div>
  );
}

function AtmosphericParticles({
  progress,
  reduceMotion,
}: {
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const bgParticles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => {
        const angle = (index * 123.5) % 360;
        const radius = 10 + ((index * 29) % 80);
        return {
          id: index,
          left: 50 + Math.cos((angle * Math.PI) / 180) * radius * 0.62,
          top: 58 + Math.sin((angle * Math.PI) / 180) * radius * 0.36,
          size: 1.5 + (index % 3),
          delay: index * -0.22,
          duration: 18 + (index % 12),
        };
      }),
    [],
  );

  const midParticles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => {
        const angle = (index * 139.7) % 360;
        const radius = 15 + ((index * 31) % 75);
        return {
          id: index,
          left: 50 + Math.cos((angle * Math.PI) / 180) * radius * 0.58,
          top: 58 + Math.sin((angle * Math.PI) / 180) * radius * 0.38,
          size: 3 + (index % 4),
          delay: index * -0.3,
          duration: 12 + (index % 8),
        };
      }),
    [],
  );

  const fgParticles = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => {
        const angle = (index * 157.1) % 360;
        const radius = 20 + ((index * 37) % 70);
        return {
          id: index,
          left: 50 + Math.cos((angle * Math.PI) / 180) * radius * 0.55,
          top: 58 + Math.sin((angle * Math.PI) / 180) * radius * 0.4,
          size: 7 + (index % 6),
          delay: index * -0.4,
          duration: 8 + (index % 5),
        };
      }),
    [],
  );

  const activeBg = bgParticles;
  const activeMid = midParticles;
  const activeFg = fgParticles;

  const bgOpacity = useTransform(progress, [0, 0.3, 0.7, 1], [0.3, 0.5, 0.4, 0.2]);
  const midOpacity = useTransform(progress, [0, 0.35, 0.75, 1], [0.25, 0.6, 0.45, 0.25]);
  const fgOpacity = useTransform(progress, [0.1, 0.4, 0.8, 1], [0.15, 0.5, 0.35, 0.1]);

  const bgY = useTransform(progress, [0, 1], [30, -30]);
  const midY = useTransform(progress, [0, 1], [80, -80]);
  const fgY = useTransform(progress, [0, 1], [200, -350]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Background Layer (Tiny, slow) */}
      <motion.div className="absolute inset-0" style={{ opacity: bgOpacity, y: bgY }}>
        {activeBg.map((particle) => (
          <motion.span
            key={`bg-${particle.id}`}
            className="absolute rounded-full bg-cyan-300 opacity-60"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [-6, -24, -6],
                    opacity: [0.15, 0.65, 0.15],
                  }
            }
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.delay,
            }}
          />
        ))}
      </motion.div>

      {/* Midground Layer (Medium, pulsing) */}
      <motion.div className="absolute inset-0" style={{ opacity: midOpacity, y: midY }}>
        {activeMid.map((particle) => (
          <motion.span
            key={`mid-${particle.id}`}
            className="absolute rounded-full bg-emerald-400 opacity-70"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [-12, 12, -12],
                    opacity: [0.3, 0.8, 0.3],
                  }
            }
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.delay,
            }}
          />
        ))}
      </motion.div>

      {/* Foreground Layer (Large, blurred, fast spores) */}
      <motion.div className="absolute inset-0" style={{ opacity: fgOpacity, y: fgY }}>
        {activeFg.map((particle) => (
          <motion.span
            key={`fg-${particle.id}`}
            className="absolute rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(110,255,206,0.55)]"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: particle.size,
              height: particle.size,
              filter: 'blur(3px)',
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [-30, -110, -30],
                    x: [0, particle.id % 2 === 0 ? 40 : -40, 0],
                    opacity: [0.1, 0.75, 0.1],
                  }
            }
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.delay,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

function LivingArchitecture({ cityGlow }: { cityGlow: MotionValue<number> }) {
  return (
    <g>
      {/* Background Distant Silhouettes (Mountains and Hills) */}
      <path
        d="M-100 800 L-100 680 Q 200 600, 500 700 T 1100 650 Q 1250 620, 1400 680 L 1400 800 Z"
        fill="url(#mountainGradient1)"
        stroke="rgba(11, 47, 77, 0.15)"
        strokeWidth="1.5"
      />
      <path
        d="M-100 800 L-100 710 Q 100 670, 350 720 T 900 690 Q 1150 660, 1400 720 L 1400 800 Z"
        fill="url(#mountainGradient2)"
        stroke="rgba(8, 28, 46, 0.2)"
        strokeWidth="1.2"
      />

      {/* Skyline Mist Overlay for Aerial Perspective */}
      <rect x="-100" y="650" width="1600" height="150" fill="url(#skylineMist)" opacity="0.65" pointerEvents="none" />

      {/* Renewable Infrastructure: Wind Turbines */}
      <WindTurbine x={240} y={660} size={18} />
      <WindTurbine x={380} y={680} size={24} />
      <WindTurbine x={970} y={690} size={28} />
      <WindTurbine x={1120} y={670} size={20} />

      {/* Eco Buildings */}
      <EcoBuilding x={480} y={700} width={70} height={180} cityGlow={cityGlow} />
      <EcoBuilding x={570} y={720} width={60} height={130} cityGlow={cityGlow} />
      <EcoBuilding x={730} y={680} width={80} height={220} cityGlow={cityGlow} />
      <EcoBuilding x={830} y={700} width={65} height={160} cityGlow={cityGlow} />
      <EcoBuilding x={910} y={690} width={50} height={120} cityGlow={cityGlow} />

      {/* Connecting Energy Channels / Skyways and Active Nodes */}
      <motion.g style={{ opacity: cityGlow }}>
        <path d="M400 680 C440 620 480 580 540 550" stroke="#00F5A0" strokeWidth="2.5" strokeDasharray="5 10" fill="none" />
        <path d="M630 650 C700 590 800 580 910 610" stroke="#00E5FF" strokeWidth="2" strokeDasharray="3 7" fill="none" />
        <path d="M770 480 C800 520 830 530 850 490" stroke="#F8FAFC" strokeWidth="1.5" fill="none" />

        {/* Transit Pods */}
        <TransitPods />

        {/* Vertical Forest points */}
        {[
          [495, 535], [515, 565], [535, 595], [555, 625],
          [745, 485], [765, 515], [785, 545], [805, 575],
          [840, 565], [860, 595], [880, 625],
          [920, 595], [940, 625]
        ].map(([x, y], idx) => (
          <circle
            key={`forest-node-${idx}`}
            cx={x}
            cy={y}
            r="4.5"
            fill="#00F5A0"
            className="animate-pulse"
            style={{ animationDelay: `${idx * 0.15}s` }}
          />
        ))}
      </motion.g>
    </g>
  );
}

// MissionControl deleted in Phase 2.5

function ProgressTrace({ progress }: { progress: MotionValue<number> }) {
  const scaleX = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 h-px bg-white/8">
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-emerald-200 via-cyan-200 to-white"
        style={{ scaleX }}
      />
    </div>
  );
}

const cardImageMap: Record<string, string> = {
  living: '/images/sustainable_living.png',
  energy: '/images/renewable_energy.png',
  transit: '/images/smart_transportation.png',
  circular: '/images/circular_economy.png',
  cities: '/images/smart_cities.png',
  nature: '/images/nature_recovery.png',
};

function BentoTile({
  opacity,
  y,
  title,
  description,
  image,
  icon: Icon,
  className,
}: {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <motion.div
      style={{ opacity, y }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950/50 p-6 flex flex-col justify-between min-h-[220px] transition-all duration-300 hover:border-emerald-500/20 hover:bg-slate-950/70",
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="relative z-10 flex items-start gap-4">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 border border-white/10 text-emerald-300 shadow-[0_0_15px_rgba(110,255,206,0.15)] group-hover:scale-105 group-hover:text-emerald-400 transition-transform">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-base font-700 tracking-normal text-white group-hover:text-emerald-300 transition-colors">
            {title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-emerald-50/60 max-w-sm">
            {description}
          </p>
        </div>
      </div>

      <div className="relative w-full h-24 mt-6 overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover opacity-65 transition-all duration-700 group-hover:scale-105 group-hover:opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}

function ProductStoryboard({ progress }: { progress: MotionValue<number> }) {
  // Focus Mode animations inside the final product storyboard view
  const storyboardOpacity = useTransform(progress, [0.78, 0.83], [0, 1]);
  const storyboardY = useTransform(progress, [0.78, 0.85], [100, 0]);

  // Bento grid tiles sequential reveal
  const tile1Opacity = useTransform(progress, [0.80, 0.84], [0, 1]);
  const tile2Opacity = useTransform(progress, [0.82, 0.86], [0, 1]);
  const tile3Opacity = useTransform(progress, [0.84, 0.88], [0, 1]);
  const tile4Opacity = useTransform(progress, [0.85, 0.89], [0, 1]);
  const tile5Opacity = useTransform(progress, [0.86, 0.90], [0, 1]);
  const tile6Opacity = useTransform(progress, [0.87, 0.91], [0, 1]);

  const tile1Y = useTransform(progress, [0.80, 0.84], [40, 0]);
  const tile2Y = useTransform(progress, [0.82, 0.86], [40, 0]);
  const tile3Y = useTransform(progress, [0.84, 0.88], [40, 0]);
  const tile4Y = useTransform(progress, [0.85, 0.89], [40, 0]);
  const tile5Y = useTransform(progress, [0.86, 0.90], [40, 0]);
  const tile6Y = useTransform(progress, [0.87, 0.91], [40, 0]);

  const coreOpacity = useTransform(progress, [0.83, 0.87], [0, 1]);
  const lineDraw = useTransform(progress, [0.85, 0.92], [0, 1]);

  const quoteOpacity = useTransform(progress, [0.90, 0.95], [0, 1]);
  const quoteY = useTransform(progress, [0.90, 0.95], [30, 0]);
  const ctaOpacity = useTransform(progress, [0.93, 0.98], [0, 1]);
  const ctaY = useTransform(progress, [0.93, 0.98], [20, 0]);

  return (
    <section className="flex min-h-[170svh] flex-col items-center justify-center py-20">
      <motion.div
        style={{ opacity: storyboardOpacity, y: storyboardY }}
        className="w-full max-w-6xl rounded-3xl border border-white/10 bg-slate-950/40 p-8 sm:p-12 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.03),0_50px_100px_-20px_rgba(0,0,0,0.85)] relative overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-emerald-500/5 blur-[100px]" />
        <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-cyan-500/5 blur-[100px]" />

        <div className="text-center mb-12 relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <RobotSeedlingIcon size={18} animated={true} glow={false} />
            EcoVerse Intelligence
          </span>
          <h2 className="mt-4 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-800 leading-none tracking-normal text-white">
            EcoVerse <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">AI</span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-balance text-base leading-relaxed text-emerald-50/75 sm:text-lg">
            EcoVerse AI is an intelligent sustainability platform that transforms everyday actions into measurable environmental impact. By connecting energy, mobility, lifestyle, nature, and cities into one ecosystem, EcoVerse helps people understand how small choices create large-scale change.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 relative z-10 my-12">
          <BentoTile
            opacity={tile1Opacity}
            y={tile1Y}
            title="Sustainable Living"
            description="Log daily choices and build habits that lower your footprint dynamically."
            image={cardImageMap.living}
            icon={Leaf}
            className="md:col-span-2"
          />

          <BentoTile
            opacity={tile2Opacity}
            y={tile2Y}
            title="Renewable Energy"
            description="Track clean energy outputs and optimize smart grids in real-time."
            image={cardImageMap.energy}
            icon={SunMedium}
            className="md:col-span-1"
          />

          <BentoTile
            opacity={tile3Opacity}
            y={tile3Y}
            title="Smart Transportation"
            description="Shift patterns toward zero-emission commuting."
            image={cardImageMap.transit}
            icon={TramFront}
            className="md:col-span-1"
          />

          <motion.div
            style={{ opacity: coreOpacity }}
            className="md:col-span-1 flex flex-col items-center justify-center p-6 rounded-2xl border border-white/5 bg-slate-950/60 backdrop-blur-2xl relative min-h-[220px] overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-28 w-28 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />
            </div>

            <div className="relative w-full h-[150px] flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full z-10">
                <circle cx="50" cy="50" r="38" fill="none" stroke="url(#leafGradient)" strokeWidth="1" strokeDasharray="3 6" opacity="0.3" className="animate-spin" style={{ animationDuration: '25s' }} />
                <motion.path
                  d="M 50 50 L 50 15 M 50 50 L 80 35 M 50 50 L 80 65 M 50 50 L 50 85 M 50 50 L 20 65 M 50 50 L 20 35"
                  fill="none"
                  stroke="url(#leafGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                  style={{ pathLength: lineDraw }}
                />
              </svg>
              <div className="absolute z-20 flex h-12 w-12 items-center justify-center rounded-full bg-slate-950/90 border border-accent-cyan/30 shadow-[0_0_15px_rgba(34,211,238,0.25)]">
                <RobotSeedlingIcon size={36} animated={true} glow={true} />
              </div>
            </div>
            <span className="font-mono text-[9px] text-emerald-300 tracking-widest uppercase mt-2 relative z-10">
              ECOSYSTEM CORE
            </span>
          </motion.div>

          <BentoTile
            opacity={tile4Opacity}
            y={tile4Y}
            title="Circular Economy"
            description="Close consumption loops by reusing, repairing, and renewing resources."
            image={cardImageMap.circular}
            icon={Recycle}
            className="md:col-span-1"
          />

          <BentoTile
            opacity={tile5Opacity}
            y={tile5Y}
            title="Smart Cities"
            description="Manage grid systems that breathe seamlessly with natural habitats."
            image={cardImageMap.cities}
            icon={Building2}
            className="md:col-span-1"
          />

          <BentoTile
            opacity={tile6Opacity}
            y={tile6Y}
            title="Nature Recovery"
            description="Accelerate carbon sequestration and rewilding programs through predictive analytics."
            image={cardImageMap.nature}
            icon={Trees}
            className="md:col-span-2"
          />
        </div>

        <motion.div
          style={{ opacity: quoteOpacity, y: quoteY }}
          className="text-center my-12 relative z-10"
        >
          <blockquote className="font-display text-2xl sm:text-3xl lg:text-4xl font-700 italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 via-white to-cyan-100 max-w-4xl mx-auto leading-relaxed">
            &quot;Every action matters. Every choice connects. Every future begins with us.&quot;
          </blockquote>
        </motion.div>

        <motion.div
          style={{ opacity: ctaOpacity, y: ctaY }}
          className="flex flex-col items-center justify-center gap-4 relative z-10"
        >
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-10 text-base font-800 text-slate-950 shadow-[0_0_50px_rgba(52,211,153,0.35)] transition-transform hover:scale-[1.03]"
          >
            Start Your Journey
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <span className="text-sm font-semibold text-emerald-50/50">
            Discover how your choices shape a sustainable future.
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

function AuroraField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-12 mix-blend-screen">
      <svg className="w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
        <motion.path
          d="M 0 150 Q 350 50, 720 150 T 1440 150 L 1440 800 L 0 800 Z"
          fill="url(#aurora1)"
          animate={{
            d: [
              "M 0 150 Q 350 50, 720 150 T 1440 150 L 1440 800 L 0 800 Z",
              "M 0 180 Q 320 100, 720 120 T 1440 180 L 1440 800 L 0 800 Z",
              "M 0 150 Q 350 50, 720 150 T 1440 150 L 1440 800 L 0 800 Z",
            ]
          }}
          transition={{ duration: 52, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M 0 250 Q 400 350, 800 200 T 1440 250 L 1440 800 L 0 800 Z"
          fill="url(#aurora2)"
          animate={{
            d: [
              "M 0 250 Q 400 350, 800 200 T 1440 250 L 1440 800 L 0 800 Z",
              "M 0 220 Q 450 280, 800 240 T 1440 220 L 1440 800 L 0 800 Z",
              "M 0 250 Q 400 350, 800 200 T 1440 250 L 1440 800 L 0 800 Z",
            ]
          }}
          transition={{ duration: 68, repeat: Infinity, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="aurora1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5A0" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="aurora2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#0B2F4D" stopOpacity="0.12" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function GlowingLeavesForeground({ progress }: { progress: MotionValue<number> }) {
  // Slower parallax depth mapping
  const fgY = useTransform(progress, [0, 1], [250, -400]);
  const leafPoints = useMemo(() => [
    { id: 1, left: '10%', top: '20%', size: 35, rotate: 45, delay: 0 },
    { id: 2, left: '85%', top: '35%', size: 28, rotate: -30, delay: 1.5 },
    { id: 3, left: '15%', top: '65%', size: 42, rotate: 15, delay: 3 },
    { id: 4, left: '78%', top: '78%', size: 30, rotate: 80, delay: 0.5 },
  ], []);

  return (
    <motion.div className="absolute inset-0 pointer-events-none z-20" style={{ y: fgY }}>
      {leafPoints.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute opacity-35"
          style={{
            left: leaf.left,
            top: leaf.top,
            width: leaf.size,
            height: leaf.size,
          }}
          animate={{
            rotate: [leaf.rotate - 10, leaf.rotate + 10, leaf.rotate - 10],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 6 + (leaf.id % 3) * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: leaf.delay,
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" filter="blur(8px)">
            <path
              d="M 50 10 C 20 40, 20 70, 50 90 C 80 70, 80 40, 50 10 Z"
              fill="url(#leafGradient)"
              className="drop-shadow-[0_0_15px_rgba(110,255,206,0.65)]"
            />
            <path d="M 50 90 L 50 25" stroke="#ecfff8" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
          </svg>
        </motion.div>
      ))}
    </motion.div>
  );
}

function WindTurbine({ x, y, size }: { x: number; y: number; size: number }) {
  const bladeLength = size * 1.2;
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y - size * 2} stroke="#A7F3D0" strokeWidth="2.2" opacity="0.8" />
      {/* Slower rotation speed to prevent distraction */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 85 + (x % 15), repeat: Infinity, ease: 'linear' }}
        style={{ originX: `${x}px`, originY: `${y - size * 2}px` }}
      >
        <line x1={x} y1={y - size * 2} x2={x} y2={y - size * 2 - bladeLength} stroke="#A7F3D0" strokeWidth="1.8" />
        <line
          x1={x}
          y1={y - size * 2}
          x2={x + bladeLength * 0.86}
          y2={y - size * 2 + bladeLength * 0.5}
          stroke="#A7F3D0"
          strokeWidth="1.8"
        />
        <line
          x1={x}
          y1={y - size * 2}
          x2={x - bladeLength * 0.86}
          y2={y - size * 2 + bladeLength * 0.5}
          stroke="#A7F3D0"
          strokeWidth="1.8"
        />
      </motion.g>
    </g>
  );
}

function EcoBuilding({
  x,
  y,
  width,
  height,
  cityGlow,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  cityGlow: MotionValue<number>;
}) {
  const terraceOpacity = useTransform(cityGlow, [0.1, 0.85], [0.25, 0.8]);
  const windowOpacity = useTransform(cityGlow, [0.1, 0.85], [0.15, 0.65]);

  return (
    <g>
      <rect
        x={x}
        y={y - height}
        width={width}
        height={height}
        fill="rgba(8,28,46,0.55)"
        stroke="#A7F3D0"
        strokeWidth="2"
        rx="10"
      />
      <line
        x1={x + width / 2}
        y1={y}
        x2={x + width / 2}
        y2={y - height + 10}
        stroke="url(#buildingCoreGradient)"
        strokeWidth="2.5"
        opacity="0.75"
      />
      
      {/* Biophilic green terraces */}
      <motion.path
        d={`M ${x} ${y - height + 40} Q ${x - 8} ${y - height + 50} ${x} ${y - height + 60}`}
        stroke="#00F5A0"
        strokeWidth="2"
        fill="none"
        style={{ opacity: terraceOpacity }}
      />
      <motion.path
        d={`M ${x + width} ${y - height + 85} Q ${x + width + 8} ${y - height + 95} ${x + width} ${y - height + 105}`}
        stroke="#00F5A0"
        strokeWidth="2"
        fill="none"
        style={{ opacity: terraceOpacity }}
      />

      {/* Scattered warm biophilic windows */}
      {Array.from({ length: Math.floor(height / 45) }).map((_, i) => {
        const wx = x + 10 + (i * 27) % (width - 20);
        const wy = y - height + 30 + i * 40;
        return (
          <motion.circle
            key={`window-${i}`}
            cx={wx}
            cy={wy}
            r="2.2"
            fill="#fbbf24"
            style={{ opacity: windowOpacity }}
          />
        );
      })}
    </g>
  );
}

function TransitPods() {
  return (
    <g>
      <path d="M402 640 C438 586 478 564 530 552" stroke="#00F5A0" strokeWidth="2" fill="none" opacity="0.4" />
      <motion.circle
        r="4.5"
        fill="#00E5FF"
        animate={{
          cx: [402, 450, 490, 530],
          cy: [640, 595, 568, 552],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <path d="M670 606 C724 558 812 552 930 590" stroke="#00E5FF" strokeWidth="1.8" fill="none" opacity="0.4" />
      <motion.circle
        r="4.5"
        fill="#00F5A0"
        animate={{
          cx: [670, 750, 840, 930],
          cy: [606, 570, 558, 590],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
    </g>
  );
}

function LeafSprout({
  cx,
  cy,
  scale,
}: {
  cx: number;
  cy: number;
  scale: MotionValue<number>;
}) {
  return (
    <motion.g
      style={{
        scale,
        originX: `${cx}px`,
        originY: `${cy}px`,
      }}
    >
      <circle cx={cx} cy={cy} r="3" fill="#00F5A0" />
      <path
        d={`M ${cx} ${cy} C ${cx + 10} ${cy - 12}, ${cx + 22} ${cy - 8}, ${cx + 16} ${cy + 6} C ${cx + 8} ${cy + 8}, ${cx + 2} ${cy + 4}, ${cx} ${cy}`}
        fill="url(#leafGradient)"
        opacity="0.8"
      />
      <path
        d={`M ${cx} ${cy} C ${cx - 10} ${cy - 12}, ${cx - 22} ${cy - 8}, ${cx - 16} ${cy + 6} C ${cx - 8} ${cy + 8}, ${cx - 2} ${cy + 4}, ${cx} ${cy}`}
        fill="url(#leafGradient)"
        opacity="0.65"
      />
    </motion.g>
  );
}

function NetworkNode({
  node,
  index,
  networkOpacity,
  reduceMotion,
}: {
  node: (typeof nodes)[number];
  index: number;
  networkOpacity: MotionValue<number>;
  reduceMotion: boolean;
}) {
  return (
    <motion.g
      style={{ opacity: networkOpacity }}
    >
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={node.size * 2.8}
        fill="none"
        stroke="#00E5FF"
        strokeWidth="1.2"
        strokeDasharray="4 6"
        opacity="0.25"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 12 + index * 2.5, repeat: Infinity, ease: 'linear' }}
        style={{ originX: `${node.x}px`, originY: `${node.y}px` }}
      />
      <circle cx={node.x} cy={node.y} r={node.size * 1.6} fill="#020617" />
      <circle
        cx={node.x}
        cy={node.y}
        r={node.size * 1.6}
        fill="url(#seedRippleGradient)"
        opacity="0.12"
      />
      <circle
        cx={node.x}
        cy={node.y}
        r={node.size * 1.6}
        fill="none"
        stroke="#00F5A0"
        strokeWidth="1.6"
      />
      <g transform={`translate(${node.x - 10} ${node.y - 10}) scale(0.8)`}>
        <path
          d={node.path}
          fill="none"
          stroke={index % 2 === 0 ? '#00F5A0' : '#00E5FF'}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />
      </g>
      <text
        x={node.x}
        y={node.y + node.size * 2.8 + 6}
        textAnchor="middle"
        fill="#A7F3D0"
        fontSize="8"
        className="font-mono tracking-wider opacity-60 pointer-events-none select-none uppercase"
      >
        {node.label}
      </text>
      <text
        x={node.x}
        y={node.y + node.size * 2.8 + 14}
        textAnchor="middle"
        fill="#00E5FF"
        fontSize="7"
        className="font-mono tracking-wider opacity-35 pointer-events-none select-none"
      >
        {`[${node.x}, ${node.y}]`}
      </text>
    </motion.g>
  );
}
