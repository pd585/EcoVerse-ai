/**
 * Shared Canvas wrapper for React Three Fiber scenes.
 * Provides the bridge between the 2D React tree and the 3D scene graph.
 * Handles renderer config, lighting, SSR safety, and accessibility.
 * @module components/three/SceneCanvas
 */

'use client';

import { type ReactNode, Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import type { CameraConfig, SceneConfig } from '@/types';
import { APP_CONFIG } from '@/constants/config';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// ─── Prop Interface ───────────────────────────────────────────────────────────

export interface SceneCanvasProps {
  /** 3D scene children (R3F components) */
  readonly children: ReactNode;
  /** Scene configuration — merged over defaults */
  readonly config?: Partial<SceneConfig>;
  /** Custom className for the canvas container */
  readonly className?: string;
  /** Whether to show performance stats (dev only) */
  readonly showStats?: boolean;
  /** Accessible description of the 3D scene */
  readonly ariaLabel?: string;
  /** Optional camera configuration override (Phase 3: scroll-driven pose) */
  readonly cameraConfig?: Partial<CameraConfig>;
  /** Whether to enable shadow maps (falls back to APP_CONFIG.three.enableShadows) */
  readonly enableShadows?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Default deep-space background colour */
const DEFAULT_BG = '#02040a';
const DEFAULT_AMBIENT_INTENSITY = 0.4;
const DEFAULT_CAMERA_POSITION: [number, number, number] = [0, 0.5, 6];
const DEFAULT_FOV = 45;
const DEFAULT_NEAR = 0.1;
const DEFAULT_FAR = 100;

// ─── WebGL Feature Detection ──────────────────────────────────────────────────

/**
 * Lightweight, synchronous WebGL capability test.
 * Only call on the client — never on the server.
 */
function supportsWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

// ─── Inner Canvas (client-only) ───────────────────────────────────────────────

interface InnerCanvasProps {
  readonly children: ReactNode;
  readonly config?: Partial<SceneConfig>;
  readonly cameraConfig?: Partial<CameraConfig>;
  readonly showStats: boolean;
  readonly shadows: boolean;
  readonly isMobile: boolean;
}

/**
 * The real R3F Canvas — only rendered after mount and WebGL confirmation.
 * Isolated into its own component so SceneCanvas stays SSR-safe and avoids
 * importing Canvas at module-evaluation time on the server.
 */
function InnerCanvas({
  children,
  config,
  cameraConfig,
  showStats,
  shadows,
  isMobile,
}: InnerCanvasProps) {
  const bgColor = config?.backgroundColor ?? DEFAULT_BG;
  const ambientIntensity =
    config?.ambientLightIntensity ?? DEFAULT_AMBIENT_INTENSITY;
  const camPos = cameraConfig?.position ?? DEFAULT_CAMERA_POSITION;
  const fov = cameraConfig?.fov ?? DEFAULT_FOV;
  const near = cameraConfig?.near ?? DEFAULT_NEAR;
  const far = cameraConfig?.far ?? DEFAULT_FAR;

  // Tighter DPR cap on mobile to reduce fill-rate pressure
  const maxDpr = isMobile ? 1.25 : APP_CONFIG.three.defaultPixelRatio;
  const dpr: [number, number] = [1, maxDpr];

  return (
    <Canvas
      dpr={dpr}
      frameloop="always"
      shadows={shadows}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        alpha: true,
      }}
      camera={{
        position: camPos,
        fov,
        near,
        far,
      }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Scene background colour */}
      <color attach="background" args={[bgColor]} />

      {/*
       * Ambient fill — keeps the night side non-black without faking shadows.
       */}
      <ambientLight intensity={ambientIntensity} />

      {/*
       * Directional "sun" light — upper-right front to produce a clear
       * day/night terminator across the Earth sphere.
       * Shadow map enabled only when `shadows` is true (desktop only).
       */}
      <directionalLight
        position={[5, 3, 5]}
        intensity={1.4}
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
      />

      {/*
       * Soft back-fill — tints the unlit hemisphere with a cool blue to
       * suggest Earth-shine / indirect scatter. Low intensity.
       */}
      <directionalLight position={[-4, -2, -3]} intensity={0.15} color="#1a3a6e" />

      {/* Async drei resources (textures, loaders) won't crash the tree */}
      <Suspense fallback={null}>{children}</Suspense>

      {/* Performance overlay — only in dev, only when requested */}
      {showStats && process.env.NODE_ENV === 'development' && <Stats />}
    </Canvas>
  );
}

// ─── Non-WebGL Fallback ───────────────────────────────────────────────────────

/**
 * Shown when WebGL is unavailable.  Preserves layout space and communicates
 * the limitation without hard-failing the page.
 */
function WebGLFallback() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: DEFAULT_BG,
        color: '#60a5fa',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.875rem',
        textAlign: 'center',
        padding: '1rem',
      }}
      aria-hidden="true"
    >
      <p>
        3D visualization is unavailable — your browser does not support WebGL.
        <br />
        Try enabling hardware acceleration or upgrading your browser.
      </p>
    </div>
  );
}

// ─── SceneCanvas ──────────────────────────────────────────────────────────────

/**
 * Single bridge between the 2D React UI and the 3D R3F scene graph.
 *
 * Responsibilities:
 * - SSR-safe: the R3F Canvas only mounts after hydration (isMounted guard)
 * - WebGL feature-detect: renders WebGLFallback when unavailable
 * - DPR clamping: [1, 1.5] desktop · [1, 1.25] mobile
 * - Renderer: antialias + powerPreference='high-performance' + alpha
 * - Lighting: ambient fill + directional sun + soft back-fill
 * - Suspense boundary for async drei resources
 * - Accessibility: role="img" + aria-label + <noscript> text
 *
 * Phase 3 integration:
 * - Import this via `next/dynamic(() => import(...), { ssr: false })` in the
 *   intro page so Next never server-renders the Canvas bundle.
 * - env.NEXT_PUBLIC_ENABLE_3D gate belongs in the calling page/layout.
 */
export function SceneCanvas({
  children,
  config,
  className,
  showStats = false,
  ariaLabel = 'Interactive 3D visualization',
  cameraConfig,
  enableShadows,
}: SceneCanvasProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);
  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    const supported = supportsWebGL();
    requestAnimationFrame(() => {
      setWebGLSupported(supported);
      setIsMounted(true);
    });
  }, []);

  // Disable shadows entirely on mobile; desktop respects explicit prop → config flag → APP_CONFIG
  const shadowsEnabled =
    !isMobile && (enableShadows ?? APP_CONFIG.three.enableShadows);

  return (
    <div
      className={className}
      role="img"
      aria-label={ariaLabel}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      {isMounted ? (
        webGLSupported ? (
          <InnerCanvas
            config={config}
            cameraConfig={cameraConfig}
            showStats={showStats}
            shadows={shadowsEnabled}
            isMobile={isMobile}
          >
            {children}
          </InnerCanvas>
        ) : (
          <WebGLFallback />
        )
      ) : (
        /* Pre-mount placeholder — holds layout space before hydration */
        <div
          style={{ width: '100%', height: '100%', background: DEFAULT_BG }}
          aria-hidden="true"
        />
      )}

      {/* Visible only when JS is disabled entirely */}
      <noscript>
        <p
          style={{
            position: 'absolute',
            inset: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: DEFAULT_BG,
            color: '#fff',
            margin: '0',
            padding: '1rem',
            textAlign: 'center',
          }}
        >
          This interactive visualization requires JavaScript and WebGL support.
        </p>
      </noscript>
    </div>
  );
}
