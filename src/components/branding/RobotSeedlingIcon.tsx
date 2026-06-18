'use client';

import { useEffect, useId, useRef, type PointerEvent } from 'react';
import { cn } from '@/lib/utils';

export interface RobotSeedlingIconProps {
  /** Width/height of the icon in pixels (defaults to 32) */
  size?: number;
  /** Whether the mascot eye movements, blinks, and breathing are animated */
  animated?: boolean;
  /** Whether to show the cyan-mint radial glowing background */
  glow?: boolean;
  /** Visual detail variation: 'default' | 'hero' | 'minimal' */
  variant?: 'default' | 'hero' | 'minimal';
  personality?:
    | 'greenGuardian'
    | 'natureProtector'
    | 'climateChampion'
    | 'futureBuilder'
    | 'communityCatalyst';
  /** Manual focus eye directions (disables auto-glancing loop when defined) */
  lookDirection?: 'center' | 'left' | 'right' | 'email' | 'password' | 'closed';
  className?: string;
}

export function RobotSeedlingIcon({
  size = 32,
  animated = true,
  glow = true,
  variant = 'default',
  personality,
  lookDirection,
  className,
}: RobotSeedlingIconProps) {
  const id = useId().replace(/:/g, '');
  const glowGradient = `${id}-glow`;
  const faceGradient = `${id}-face`;
  const leafGradient = `${id}-leaf`;
  const eyeGradient = `${id}-eye`;
  const filterId = `${id}-soft-glow`;
  const mascotRef = useRef<SVGSVGElement | null>(null);
  const eyeMotionRef = useRef<SVGGElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const frameRef = useRef<number | null>(null);
  const touchRef = useRef(false);
  const trackingRef = useRef({ currentX: 0, currentY: 0, targetX: 0, targetY: 0 });

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  const updateEyeTransform = (x: number, y: number) => {
    if (!eyeMotionRef.current) return;
    eyeMotionRef.current.setAttribute('transform', `translate(${x}, ${y})`);
  };

  const animateEyes = () => {
    const tracking = trackingRef.current;
    const nextX = tracking.currentX + (tracking.targetX - tracking.currentX) * 0.15;
    const nextY = tracking.currentY + (tracking.targetY - tracking.currentY) * 0.15;
    tracking.currentX = nextX;
    tracking.currentY = nextY;
    updateEyeTransform(nextX, nextY);

    if (Math.abs(tracking.targetX - nextX) > 0.1 || Math.abs(tracking.targetY - nextY) > 0.1) {
      frameRef.current = requestAnimationFrame(animateEyes);
    } else {
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = null;
      updateEyeTransform(tracking.targetX, tracking.targetY);
    }
  };

  const updateTarget = (x: number, y: number) => {
    trackingRef.current.targetX = x;
    trackingRef.current.targetY = y;
    if (frameRef.current == null) {
      frameRef.current = requestAnimationFrame(animateEyes);
    }
  };

  const refreshRect = () => {
    const container = mascotRef.current;
    if (!container) return;
    rectRef.current = container.getBoundingClientRect();
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (lookDirection || touchRef.current) return;
    if (event.pointerType === 'touch') {
      touchRef.current = true;
      return;
    }

    refreshRect();
    const rect = rectRef.current;
    if (!rect) return;

    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const maxDistance = 160;
    const eyeX = clamp(dx / maxDistance, -1, 1);
    const eyeY = clamp(dy / maxDistance, -1, 1);
    const offsetX = eyeX * 8;
    const offsetY = eyeY * 6;

    console.debug('mascot eye tracking', { dx, dy, eyeX, eyeY, offsetX, offsetY });
    updateTarget(offsetX, offsetY);
  };

  const handlePointerLeave = () => {
    if (touchRef.current || lookDirection) return;
    updateTarget(0, 0);
  };

  useEffect(() => {
    const handleResizeScroll = () => {
      refreshRect();
    };

    handleResizeScroll();
    window.addEventListener('resize', handleResizeScroll);
    window.addEventListener('scroll', handleResizeScroll, true);

    return () => {
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener('resize', handleResizeScroll);
      window.removeEventListener('scroll', handleResizeScroll, true);
    };
  }, []);

  // Animation CSS styles embedded directly inside the SVG to ensure portability and GPU acceleration
  const animationStyles = animated
    ? `
      @media (prefers-reduced-motion: no-preference) {
        .mascot-glow-${id} {
          animation: glow-breathe-${id} 7s ease-in-out infinite;
          transform-origin: 48px 52px;
        }
        .mascot-head-${id} {
          animation: head-breathe-${id} 7s ease-in-out infinite;
          transform-origin: 48px 53px;
        }
        .mascot-leaf-${id} {
          animation: leaf-sway-${id} 7s ease-in-out infinite;
          transform-origin: 48px 30px;
        }
        .mascot-eyes-${id} {
          animation: eyes-action-${id} 8s ease-in-out infinite;
          transform-origin: 48px 53px;
        }
      }

      @keyframes glow-breathe-${id} {
        0%, 100% { transform: scale(0.96); opacity: 0.75; }
        50% { transform: scale(1.05); opacity: 1; }
      }
      @keyframes head-breathe-${id} {
        0%, 100% { transform: scale(0.98); }
        50% { transform: scale(1.01); }
      }
      @keyframes leaf-sway-${id} {
        0%, 100% { transform: rotate(-2deg) scale(0.98); }
        50% { transform: rotate(3deg) scale(1.02); }
      }
      @keyframes eyes-action-${id} {
        0%, 35% { transform: scaleY(1); }
        37% { transform: scaleY(0.08); }
        39% { transform: scaleY(1); }
        44%, 52% { transform: scaleY(1); }
        57%, 65% { transform: scaleY(1); }
        70% { transform: scaleY(1); }
        72% { transform: scaleY(0.08); }
        74% { transform: scaleY(1); }
        76% { transform: scaleY(0.08); }
        78%, 100% { transform: scaleY(1); }
      }
    `
    : '';

  // Class helper for detail variant styles
  const isHero = variant === 'hero';
  const isMinimal = variant === 'minimal';

  return (
    <svg
      ref={mascotRef}
      viewBox="0 0 96 96"
      width={size}
      height={size}
      className={cn('block shrink-0 overflow-visible', className)}
      role="img"
      aria-label="EcoVerse AI robot seedling mascot"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <defs>
        <radialGradient id={glowGradient} cx="50%" cy="54%" r="54%">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity={isHero ? 0.55 : 0.38} />
          <stop offset="60%" stopColor="#00F5A0" stopOpacity={isHero ? 0.28 : 0.18} />
          <stop offset="100%" stopColor="#00F5A0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={faceGradient} x1="22" y1="18" x2="74" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0A2B45" />
          <stop offset="46%" stopColor="#041A2F" />
          <stop offset="100%" stopColor="#021327" />
        </linearGradient>
        <linearGradient id={leafGradient} x1="39" y1="7" x2="62" y2="31" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B8FFE8" />
          <stop offset="44%" stopColor="#00F5A0" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
        <radialGradient id={eyeGradient} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F0FFFB" />
          <stop offset="62%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#00F5A0" stopOpacity="0.75" />
        </radialGradient>
        <filter id={filterId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={isHero ? 3.5 : 2.5} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 1. Ambient Glow (if enabled) */}
      {glow && (
        <g className={cn(animated && `mascot-glow-${id}`)}>
          <circle cx="48" cy="52" r="42" fill={`url(#${glowGradient})`} />
        </g>
      )}

      {/* 2. Sprouting Plant Seedling (Leaf + Stem) */}
      <g className={cn(animated && `mascot-leaf-${id}`)}>
        <path
          d="M48 15 C45 11 43 8 44 4 C51 5 56 10 57 17 C62 13 69 13 75 17 C72 25 64 29 56 25 C54 29 51 32 48 34 C45 31 43 28 41 25 C33 29 25 25 22 17 C28 13 35 13 40 17 C41 15 44 15 48 15 Z"
          fill={`url(#${leafGradient})`}
          filter={`url(#${filterId})`}
        />
        {!isMinimal && (
          <path
            d="M48 35 C48 26 48 18 48 12"
            fill="none"
            stroke="#A7F3D0"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />
        )}
      </g>

      {/* 3. Robot Head Body */}
      <g className={cn(animated && `mascot-head-${id}`)}>
        <rect
          x="20"
          y="28"
          width="56"
          height="50"
          rx="20"
          fill={`url(#${faceGradient})`}
          stroke={isHero ? '#00F5A0' : 'rgba(167, 243, 208, 0.45)'}
          strokeWidth={isHero ? 2.5 : 2}
          className="transition-colors duration-300"
        />
        
        {/* Soft biophilic border accent lines */}
        {!isMinimal && (
          <>
            <path
              d="M27 47 C33 39 63 39 69 47"
              fill="none"
              stroke="rgba(34, 211, 238, 0.24)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M32 68 C38 72 58 72 64 68"
              fill="none"
              stroke="rgba(167, 243, 208, 0.36)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </>
        )}

        {/* 4. Glowing Cyan Eyes with Blinking and Glancing */}
        <g ref={eyeMotionRef} style={{ willChange: 'transform' }} transform="translate(0, 0)">
          <g
            style={
              lookDirection
                ? {
                    transform:
                      lookDirection === 'email'
                        ? 'translate(2.5px, 0px)'
                        : lookDirection === 'password'
                        ? 'translate(2.5px, 1.8px)'
                        : lookDirection === 'left'
                        ? 'translate(-2.5px, 0px)'
                        : lookDirection === 'right'
                        ? 'translate(2.5px, 0px)'
                        : lookDirection === 'closed'
                        ? 'translate(0px, 0px)'
                        : 'translate(0px, 0px)',
                    transformOrigin: '48px 53px',
                    transition: 'transform 0.25s ease-out',
                  }
                : undefined
            }
          >
            <g
              className={cn(animated && !lookDirection && `mascot-eyes-${id}`)}
              filter={`url(#${filterId})`}
              style={
                lookDirection
                  ? {
                      transform:
                        lookDirection === 'closed'
                          ? 'scaleY(0.08)'
                          : 'scaleY(1)',
                      transformOrigin: '48px 53px',
                    }
                  : undefined
              }
            >
              <ellipse cx="38" cy="53" rx={isHero ? 6.5 : 5.5} ry={isHero ? 5.2 : 4.4} fill={`url(#${eyeGradient})`} />
              <ellipse cx="58" cy="53" rx={isHero ? 6.5 : 5.5} ry={isHero ? 5.2 : 4.4} fill={`url(#${eyeGradient})`} />
            </g>
          </g>
        </g>

        {/* 5. Minimal Friendly Smile */}
        {!isMinimal && (
          <path
            d="M43 64 C46 66 50 66 53 64"
            fill="none"
            stroke="#A7F3D0"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.75"
          />
        )}

        {/* Bottom accent collar */}
        {!isMinimal && (
          <path
            d="M28 79 C34 86 62 86 68 79"
            fill="none"
            stroke="rgba(34, 211, 238, 0.28)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </g>

      {/* 2a. Personality overlay details */}
      {personality === 'natureProtector' && (
        <g opacity="0.95">
          <path
            d="M26 22 C32 12 40 8 48 12 C56 8 64 12 70 22 C74 26 76 32 74 36 C68 44 60 44 54 38 C50 42 46 42 42 38 C36 44 28 44 22 36 C20 32 22 26 26 22 Z"
            fill="#79F2C7"
            opacity="0.28"
          />
          <path
            d="M36 18 C38 14 42 13 45 16"
            fill="none"
            stroke="#D1FAE5"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M56 18 C58 14 62 13 65 16"
            fill="none"
            stroke="#D1FAE5"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      )}
      {personality === 'climateChampion' && (
        <g opacity="0.92">
          <path
            d="M32 28 C28 28 26 32 26 36 C22 38 22 42 24 45 C20 45 18 49 20 52 C20 58 26 62 32 62 H62 C68 62 74 58 74 52 C78 50 80 46 78 42 C80 38 78 32 72 30 C70 26 64 24 58 26 C54 22 48 20 42 22 C38 22 34 26 32 28 Z"
            fill="#C0FDFB"
            opacity="0.34"
          />
          <path
            d="M48 34 L44 46 H52 L46 60"
            fill="none"
            stroke="#22D3EE"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
      {personality === 'futureBuilder' && (
        <g opacity="0.92">
          <rect x="24" y="28" width="8" height="14" rx="2" fill="#A5F3FC" opacity="0.24" />
          <rect x="36" y="24" width="6" height="18" rx="1.5" fill="#7DD3FC" opacity="0.24" />
          <rect x="50" y="30" width="10" height="12" rx="2" fill="#67E8F9" opacity="0.2" />
          <rect x="64" y="26" width="6" height="16" rx="1.5" fill="#22D3EE" opacity="0.18" />
          <path d="M30 32 H32 M30 36 H32 M30 40 H32" stroke="#E0F7FF" strokeWidth="1" opacity="0.95" />
          <path d="M38 28 H40 M38 32 H40 M38 36 H40" stroke="#E0F7FF" strokeWidth="1" opacity="0.95" />
          <path d="M52 34 H54 M52 38 H54" stroke="#E0F7FF" strokeWidth="1" opacity="0.95" />
        </g>
      )}
      {personality === 'communityCatalyst' && (
        <g opacity="0.9">
          <circle cx="48" cy="48" r="26" fill="none" stroke="#A7F3D0" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.55" />
          <circle cx="34" cy="44" r="3" fill="#D9FFF1" />
          <circle cx="62" cy="38" r="3" fill="#D9FFF1" />
          <circle cx="58" cy="62" r="3" fill="#D9FFF1" />
          <circle cx="38" cy="64" r="3" fill="#D9FFF1" />
          <path d="M34 44 L46 48" stroke="#94F3C3" strokeWidth="1.2" opacity="0.8" />
          <path d="M62 38 L52 52" stroke="#94F3C3" strokeWidth="1.2" opacity="0.8" />
          <path d="M58 62 L48 54" stroke="#94F3C3" strokeWidth="1.2" opacity="0.8" />
          <path d="M38 64 L46 52" stroke="#94F3C3" strokeWidth="1.2" opacity="0.8" />
        </g>
      )}
    </svg>
  );
}
