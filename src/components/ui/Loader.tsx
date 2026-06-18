'use client';

import { cn } from '@/lib/utils';
import { RobotSeedlingIcon } from '@/components/brand';

export interface LoaderProps {
  /** Size in pixels for the mascot or loader element */
  size?: number;
  className?: string;
  label?: string;
  /** Custom mascot animation states */
  variant?: 'default' | 'dashboard' | 'coach' | 'questionnaire';
}

export function Loader({
  size = 40,
  className,
  label = 'Loading…',
  variant = 'default',
}: LoaderProps) {
  // 1. Mascot Thinking state (AI Coach Loading)
  if (variant === 'coach') {
    return (
      <div
        className={cn('flex flex-col items-center justify-center gap-4', className)}
        role="status"
        aria-label={label}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes coach-float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-4px) rotate(1.5deg); }
          }
          .coach-loader-container {
            animation: coach-float 3s ease-in-out infinite;
          }
        `}} />
        <div className="relative">
          {/* Thinking bubble dots */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex gap-1 z-10 bg-slate-950/80 px-2 py-1 rounded-full border border-accent-cyan/20">
            <span className="h-1.5 w-1.5 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-1.5 w-1.5 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-1.5 w-1.5 bg-accent-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <div className="coach-loader-container">
            <RobotSeedlingIcon size={size} animated={true} glow={true} />
          </div>
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-accent-cyan">
          {label}
        </span>
      </div>
    );
  }

  // 2. Mascot Watering Sprout state (Dashboard Loading)
  if (variant === 'dashboard') {
    return (
      <div
        className={cn('flex flex-col items-center justify-center gap-4', className)}
        role="status"
        aria-label={label}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes drip {
            0% { transform: translateY(-10px) scale(0); opacity: 0; }
            30% { opacity: 1; transform: translateY(-5px) scale(1); }
            75% { transform: translateY(12px) scale(1); opacity: 0.8; }
            100% { transform: translateY(22px) scale(0); opacity: 0; }
          }
          .drip-1 { animation: drip 1.5s infinite linear; }
          .drip-2 { animation: drip 1.5s infinite linear 0.5s; }
          .drip-3 { animation: drip 1.5s infinite linear 1.0s; }
        `}} />
        <div className="flex items-center gap-8 relative h-[90px] w-[180px] justify-center">
          {/* Mascot pouring */}
          <div className="transform rotate-[12deg] translate-x-[-10px] animate-pulse">
            <RobotSeedlingIcon size={54} animated={true} glow={true} variant="minimal" />
          </div>
          {/* Water drips */}
          <div className="absolute left-[78px] top-[42px] flex flex-col gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-accent-cyan drip-1" />
            <div className="h-1.5 w-1.5 rounded-full bg-accent-cyan drip-2" />
            <div className="h-1.5 w-1.5 rounded-full bg-accent-cyan drip-3" />
          </div>
          {/* Sprout */}
          <div className="flex flex-col items-center animate-bounce translate-x-[10px]" style={{ animationDuration: '2.5s' }}>
            <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(0,245,160,0.45)]">🌱</span>
          </div>
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-[#00F5A0]">
          {label}
        </span>
      </div>
    );
  }

  // 3. Mascot Scanning Data state (Questionnaire Loading)
  if (variant === 'questionnaire') {
    return (
      <div
        className={cn('flex flex-col items-center justify-center gap-4', className)}
        role="status"
        aria-label={label}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scan {
            0%, 100% { top: 6%; opacity: 0.2; }
            50% { top: 92%; opacity: 1; }
          }
          .scan-line {
            animation: scan 2.2s infinite ease-in-out;
          }
        `}} />
        <div className="relative h-[110px] w-[110px] flex items-center justify-center overflow-hidden rounded-3xl border border-accent-cyan/15 bg-slate-950/40 p-2 backdrop-blur-sm shadow-[0_0_20px_rgba(34,211,238,0.08)]">
          <RobotSeedlingIcon size={size} animated={true} glow={true} />
          {/* Scanner light bar */}
          <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#00F5A0] to-transparent shadow-[0_0_8px_#00F5A0] scan-line pointer-events-none" />
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-[#00F5A0]">
          {label}
        </span>
      </div>
    );
  }

  // 4. Default Pulse Loader
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-4', className)}
      role="status"
      aria-label={label}
    >
      <div
        className="rounded-full bg-aurora animate-pulse-glow"
        style={{ width: size, height: size }}
      />
      <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
