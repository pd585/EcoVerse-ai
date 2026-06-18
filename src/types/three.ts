/**
 * Three.js / React Three Fiber type definitions.
 * @module types/three
 */

import type { Vector3Tuple } from 'three';

/** Configuration for the 3D scene */
export interface SceneConfig {
  readonly backgroundColor: string;
  readonly ambientLightIntensity: number;
  readonly fogColor?: string;
  readonly fogNear?: number;
  readonly fogFar?: number;
}

/** Camera configuration */
export interface CameraConfig {
  readonly position: Vector3Tuple;
  readonly fov: number;
  readonly near: number;
  readonly far: number;
  readonly autoRotate: boolean;
  readonly autoRotateSpeed: number;
  readonly enableZoom: boolean;
  readonly enablePan: boolean;
  readonly minDistance: number;
  readonly maxDistance: number;
}

/** Earth globe rendering options */
export interface EarthOptions {
  readonly radius: number;
  readonly segments: number;
  readonly rotationSpeed: number;
  readonly showAtmosphere: boolean;
  readonly showClouds: boolean;
  readonly highlightRegions?: readonly string[];
  readonly emissionOverlay: boolean;
}

/** Star field configuration */
export interface StarFieldConfig {
  readonly count: number;
  readonly radius: number;
  readonly depth: number;
  readonly size: number;
  readonly sizeAttenuation: boolean;
  readonly color: string;
  readonly opacity: number;
}

/** Animation state for 3D elements */
export interface AnimationState {
  readonly isPlaying: boolean;
  readonly progress: number;
  readonly speed: number;
  readonly loop: boolean;
  readonly direction: 'forward' | 'reverse';
}

/** Effect configuration for Earth post-processing */
export interface EarthEffectsConfig {
  readonly bloom: boolean;
  readonly bloomIntensity: number;
  readonly glow: boolean;
  readonly glowColor: string;
  readonly atmosphere: boolean;
  readonly atmosphereColor: string;
}
