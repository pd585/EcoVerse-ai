/**
 * EcosphereBackground component.
 * Renders the approved EcoVerse background image as the global environmental
 * backdrop with a subtle readability overlay.
 *
 * Applied once globally via AppShell — automatically covers Dashboard,
 * AI Coach, Simulator, Learn Hub, Roadmap, and all future modules.
 *
 * @module components/shared/EcosphereBackground
 */

'use client';

export interface EcosphereBackgroundProps {
  /** Kept for interface compatibility — unused */
  particleCount?: number;
}

export function EcosphereBackground({ particleCount }: EcosphereBackgroundProps) {
  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
      aria-hidden
    >
      {/* Background image layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/assests/Ecoverse Bg image/ecoverse-bg-image.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          opacity: 'var(--bg-image-opacity, 1)',
        }}
      />

      {/* Readability overlay — preserves image visibility while improving text contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--readability-overlay-bg, rgba(2, 11, 28, 0.25))',
        }}
      />
    </div>
  );
}
