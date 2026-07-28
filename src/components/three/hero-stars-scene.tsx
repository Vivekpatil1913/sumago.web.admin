"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  ShaderMaterial,
  type Group,
} from "three";

/**
 * A distinct 3D star formation per main page — the same twinkling glow-sprite
 * particle engine as the homepage hero (see hero-scene.tsx), rearranged into a
 * shape that echoes each page's meaning. One engine, many silhouettes.
 */
export type StarFormation =
  | "galaxy" // about        — spiral disk
  | "constellation" // team  — networked clusters + faint links
  | "embers" // life         — warm stars drifting upward
  | "helix" // careers       — ascending double helix
  | "torus" // solutions     — rotating ring
  | "wave" // industries     — undulating grid plane
  | "burst" // impact        — radiating supernova
  | "orbit" // innovation    — concentric orbital rings
  | "stream" // blog         — horizontal flowing ribbon
  | "pulse"; // contact      — converging radar pulse

/* Motion modes handled inside the vertex shader (0 = static, rotated by group). */
const MODE = {
  STATIC: 0,
  EMBERS: 1,
  STREAM: 2,
  WAVE: 3,
  PULSE: 4,
  BURST: 5,
  ORBIT: 6,
} as const;

type Built = { positions: Float32Array; lines?: Float32Array };

/** Deterministic PRNG — keeps each formation stable and avoids impure Math.random in render. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rand = () => number;

type FormationConfig = {
  count: number;
  mode: number;
  /** Static X tilt applied to the group (perspective). */
  tiltX: number;
  /** Y auto-rotation speed for STATIC formations (rad/s). */
  spinY: number;
  /** Shader drift speed (embers/stream/orbit). */
  uSpeed: number;
  /** Shader displacement amplitude (wave/stream) or max radius (burst). */
  uAmp: number;
  build: (count: number, rand: Rand) => Built;
};

/* ----------------------------- shape builders ----------------------------- */

function unit(rand: Rand): [number, number, number] {
  // Uniform-ish direction on a sphere.
  const u = rand() * 2 - 1;
  const t = rand() * Math.PI * 2;
  const r = Math.sqrt(1 - u * u);
  return [r * Math.cos(t), u, r * Math.sin(t)];
}

const buildGalaxy = (count: number, rand: Rand): Built => {
  const positions = new Float32Array(count * 3);
  const arms = 4;
  const maxR = 6;
  for (let i = 0; i < count; i++) {
    const r = Math.pow(rand(), 0.6) * maxR;
    const ang =
      ((i % arms) / arms) * Math.PI * 2 + r * 1.2 + (rand() - 0.5) * 0.6;
    positions[i * 3] = Math.cos(ang) * r;
    positions[i * 3 + 1] = (rand() - 0.5) * Math.max(0.25, 1.3 - r * 0.16);
    positions[i * 3 + 2] = Math.sin(ang) * r;
  }
  return { positions };
};

const buildConstellation = (count: number, rand: Rand): Built => {
  const positions = new Float32Array(count * 3);
  const clusterCount = 7;
  const centers: [number, number, number][] = [];
  for (let c = 0; c < clusterCount; c++) {
    const [dx, dy, dz] = unit(rand);
    const rad = 2.2 + rand() * 2.6;
    centers.push([dx * rad, dy * rad * 0.7, dz * rad]);
  }
  const linePts: number[] = [];
  for (let i = 0; i < count; i++) {
    const c = centers[i % clusterCount];
    const [ux, uy, uz] = unit(rand);
    const spread = rand() * 1.4;
    const x = c[0] + ux * spread;
    const y = c[1] + uy * spread;
    const z = c[2] + uz * spread;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    // Faint link back to the cluster core for ~1 in 4 stars.
    if (i % 4 === 0) {
      linePts.push(c[0], c[1], c[2], x, y, z);
    }
  }
  return { positions, lines: new Float32Array(linePts) };
};

const buildBox = (count: number, rand: Rand): Built => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (rand() - 0.5) * 13;
    positions[i * 3 + 1] = (rand() - 0.5) * 13;
    positions[i * 3 + 2] = (rand() - 0.5) * 9;
  }
  return { positions };
};

const buildHelix = (count: number, rand: Rand): Built => {
  const positions = new Float32Array(count * 3);
  const height = 12;
  const turns = 3;
  const radius = 2.3;
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const strand = i % 2;
    const ang = t * Math.PI * 2 * turns + strand * Math.PI;
    const jitter = 0.9 + (rand() - 0.5) * 0.5;
    positions[i * 3] = Math.cos(ang) * radius * jitter;
    positions[i * 3 + 1] = (t - 0.5) * height + (rand() - 0.5) * 0.2;
    positions[i * 3 + 2] = Math.sin(ang) * radius * jitter;
  }
  return { positions };
};

const buildTorus = (count: number, rand: Rand): Built => {
  const positions = new Float32Array(count * 3);
  const R = 3.4;
  const r = 1.1;
  for (let i = 0; i < count; i++) {
    const u = rand() * Math.PI * 2;
    const v = rand() * Math.PI * 2;
    positions[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
    positions[i * 3 + 1] = r * Math.sin(v);
    positions[i * 3 + 2] = (R + r * Math.cos(v)) * Math.sin(u);
  }
  return { positions };
};

const buildGrid = (count: number, rand: Rand): Built => {
  const positions = new Float32Array(count * 3);
  const n = Math.ceil(Math.sqrt(count));
  for (let i = 0; i < count; i++) {
    const gx = i % n;
    const gz = Math.floor(i / n);
    positions[i * 3] = (gx / (n - 1) - 0.5) * 15 + (rand() - 0.5) * 0.3;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = (gz / (n - 1) - 0.5) * 13 + (rand() - 0.5) * 0.3;
  }
  return { positions };
};

const buildDirs = (count: number, rand: Rand): Built => {
  // Base direction stored in position; the shader animates radius outward.
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const [x, y, z] = unit(rand);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return { positions };
};

const buildRings = (count: number, rand: Rand): Built => {
  const positions = new Float32Array(count * 3);
  const radii = [1.7, 2.9, 4.1, 5.3];
  for (let i = 0; i < count; i++) {
    const rad = radii[i % radii.length] + (rand() - 0.5) * 0.35;
    const ang = rand() * Math.PI * 2;
    positions[i * 3] = Math.cos(ang) * rad;
    positions[i * 3 + 1] = (rand() - 0.5) * 0.6;
    positions[i * 3 + 2] = Math.sin(ang) * rad;
  }
  return { positions };
};

const buildShell = (count: number, rand: Rand): Built => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const [x, y, z] = unit(rand);
    const rad = 2 + rand() * 4;
    positions[i * 3] = x * rad;
    positions[i * 3 + 1] = y * rad;
    positions[i * 3 + 2] = z * rad;
  }
  return { positions };
};

const buildRibbon = (count: number, rand: Rand): Built => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (rand() - 0.5) * 16;
    positions[i * 3 + 1] = (rand() - 0.5) * 3.6;
    positions[i * 3 + 2] = (rand() - 0.5) * 4;
  }
  return { positions };
};

const FORMATIONS: Record<StarFormation, FormationConfig> = {
  galaxy: { count: 600, mode: MODE.STATIC, tiltX: 0.5, spinY: 0.05, uSpeed: 0, uAmp: 0, build: buildGalaxy },
  constellation: { count: 300, mode: MODE.STATIC, tiltX: 0.2, spinY: 0.03, uSpeed: 0, uAmp: 0, build: buildConstellation },
  embers: { count: 420, mode: MODE.EMBERS, tiltX: 0, spinY: 0, uSpeed: 1.1, uAmp: 0, build: buildBox },
  helix: { count: 420, mode: MODE.STATIC, tiltX: 0.15, spinY: 0.18, uSpeed: 0, uAmp: 0, build: buildHelix },
  torus: { count: 560, mode: MODE.STATIC, tiltX: -0.55, spinY: 0.12, uSpeed: 0, uAmp: 0, build: buildTorus },
  wave: { count: 620, mode: MODE.WAVE, tiltX: -0.62, spinY: 0, uSpeed: 0, uAmp: 0.7, build: buildGrid },
  burst: { count: 520, mode: MODE.BURST, tiltX: 0, spinY: 0, uSpeed: 0, uAmp: 6.5, build: buildDirs },
  orbit: { count: 520, mode: MODE.ORBIT, tiltX: -0.5, spinY: 0, uSpeed: 0.5, uAmp: 0, build: buildRings },
  stream: { count: 460, mode: MODE.STREAM, tiltX: 0, spinY: 0, uSpeed: 1.0, uAmp: 0.8, build: buildRibbon },
  pulse: { count: 460, mode: MODE.PULSE, tiltX: -0.3, spinY: 0, uSpeed: 0, uAmp: 0, build: buildShell },
};

/* ------------------------------- shared glow ------------------------------ */

/** Soft, blurry glowing round sprite drawn to a canvas (the point texture). */
function makeStarTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = size / 2;
  const glow = ctx.createRadialGradient(c, c, 0, c, c, c);
  glow.addColorStop(0, "rgba(255,255,255,0.95)");
  glow.addColorStop(0.2, "rgba(255,255,255,0.85)");
  glow.addColorStop(0.5, "rgba(255,255,255,0.35)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);
  const tex = new CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function StarField({ formation }: { formation: StarFormation }) {
  const groupRef = useRef<Group>(null);
  const cfg = FORMATIONS[formation];

  const { positions, lines, scales, phases, seeds } = useMemo(() => {
    const rand = mulberry32(0x51a90 + cfg.mode * 7919 + cfg.count);
    const { positions, lines } = cfg.build(cfg.count, rand);
    const scales = new Float32Array(cfg.count);
    const phases = new Float32Array(cfg.count);
    const seeds = new Float32Array(cfg.count);
    for (let i = 0; i < cfg.count; i++) {
      scales[i] = 1.1 + rand() * 2.8;
      phases[i] = rand() * Math.PI * 2;
      seeds[i] = rand();
    }
    return { positions, lines, scales, phases, seeds };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formation]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uMode: { value: cfg.mode },
          uSpeed: { value: cfg.uSpeed },
          uAmp: { value: cfg.uAmp },
          uColor: { value: new Color("#ffffff") },
          uTexture: { value: makeStarTexture() },
        },
        vertexShader: /* glsl */ `
          attribute float aScale;
          attribute float aPhase;
          attribute float aSeed;
          uniform float uTime;
          uniform int uMode;
          uniform float uSpeed;
          uniform float uAmp;
          varying float vTwinkle;
          varying float vFade;
          const float PI = 3.14159265;
          void main() {
            vec3 p = position;
            vFade = 1.0;
            if (uMode == 1) {            // EMBERS — drift upward, wrap
              float span = 13.0;
              p.y = mod(position.y + uTime * uSpeed + aSeed * span, span) - span * 0.5;
              p.x += sin(uTime * 0.6 + aSeed * 6.2831) * 0.35;
            } else if (uMode == 2) {     // STREAM — flow along X, wrap, sine bob
              float span = 17.0;
              float xx = mod(position.x + uTime * uSpeed + aSeed * span, span) - span * 0.5;
              p.x = xx;
              p.y += sin(xx * 0.45 + uTime) * uAmp;
            } else if (uMode == 3) {     // WAVE — undulating plane
              p.y += sin(position.x * 0.45 + uTime) * uAmp
                   + cos(position.z * 0.5 + uTime * 0.8) * uAmp * 0.5;
            } else if (uMode == 4) {     // PULSE — converge inward, re-emit
              float t = fract(uTime * 0.13 + aSeed);
              p = position * (1.0 - t);
              vFade = sin(t * PI);
            } else if (uMode == 5) {     // BURST — radiate outward from core
              vec3 dir = normalize(position + vec3(0.0001));
              float t = fract(uTime * 0.11 + aSeed);
              p = dir * (t * uAmp);
              vFade = sin(t * PI);
            } else if (uMode == 6) {     // ORBIT — differential angular spin
              float radius = length(position.xz);
              float ang = atan(position.z, position.x) + uTime * uSpeed * (0.35 + aSeed * 0.9);
              p = vec3(cos(ang) * radius, position.y, sin(ang) * radius);
            }
            vTwinkle = 0.4 + 0.6 * (0.5 + 0.5 * sin(uTime * 2.2 + aPhase));
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = aScale * (16.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform sampler2D uTexture;
          uniform vec3 uColor;
          varying float vTwinkle;
          varying float vFade;
          void main() {
            vec4 tex = texture2D(uTexture, gl_PointCoord);
            gl_FragColor = vec4(uColor, tex.a * vTwinkle * vFade);
          }
        `,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formation]
  );

  useFrame((state, delta) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    if (groupRef.current && cfg.spinY) {
      groupRef.current.rotation.y += delta * cfg.spinY;
    }
  });

  return (
    <group ref={groupRef} rotation={[cfg.tiltX, 0, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        </bufferGeometry>
        <primitive object={material} attach="material" />
      </points>

      {lines && lines.length > 0 ? (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[lines, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.1}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </lineSegments>
      ) : null}
    </group>
  );
}

/**
 * @param formation Which shape the stars form (one per main page).
 * @param active When false (hero scrolled out of view), the render loop is
 *   parked so the WebGL scene stops consuming GPU/CPU — keeps the rest of the
 *   page scrolling at 60fps.
 */
export default function HeroStarsScene({
  formation,
  active = true,
}: {
  formation: StarFormation;
  active?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={active ? "always" : "never"}
      aria-hidden
    >
      <StarField formation={formation} />
    </Canvas>
  );
}
