"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  ShaderMaterial,
  type Points as ThreePoints,
} from "three";

/** Soft, blurry glowing round sprite drawn to a canvas (used as the point texture). */
function makeStarTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = size / 2;

  // Soft round dot with a bright core fading into a blurry glow halo.
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

/** Drifting field of twinkling, glowing stars in brand tones. */
function Particles({ count = 500 }: { count?: number }) {
  const ref = useRef<ThreePoints>(null);

  const { positions, scales, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
      scales[i] = 1.2 + Math.random() * 3.0;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, scales, phases };
  }, [count]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new Color("#ffffff") },
          uTexture: { value: makeStarTexture() },
        },
        vertexShader: /* glsl */ `
          attribute float aScale;
          attribute float aPhase;
          uniform float uTime;
          varying float vTwinkle;
          void main() {
            // Individual blink: each star fades in and out on its own phase.
            vTwinkle = 0.4 + 0.6 * (0.5 + 0.5 * sin(uTime * 2.2 + aPhase));
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aScale * (16.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform sampler2D uTexture;
          uniform vec3 uColor;
          varying float vTwinkle;
          void main() {
            vec4 tex = texture2D(uTexture, gl_PointCoord);
            gl_FragColor = vec4(uColor, tex.a * vTwinkle);
          }
        `,
      }),
    []
  );

  useFrame((state, delta) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    if (ref.current) ref.current.rotation.y += delta * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
}

/**
 * @param active When false (hero scrolled out of view), the render loop is
 *   parked so the WebGL scene stops consuming GPU/CPU — this is what keeps the
 *   rest of the page scrolling at 60fps.
 */
export default function HeroScene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={active ? "always" : "never"}
      aria-hidden
    >
      <Particles />
    </Canvas>
  );
}
