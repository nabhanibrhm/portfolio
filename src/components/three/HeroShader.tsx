"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { heroFragment, heroVertex } from "@/shaders/hero";

function ShaderPlane() {
  const ref = useRef<THREE.ShaderMaterial>(null);
  const { size, gl } = useThree();

  const mouseRaw = useRef({ x: 0, y: 0 });
  const mouseSmooth = useRef({ x: 0, y: 0 });
  const clickPos = useRef({ x: 0, y: 0 });
  const clickT = useRef(999);
  const heldTarget = useRef(0);
  const heldSmooth = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uClickAge: { value: 999 },
      uClickPos: { value: new THREE.Vector2(0, 0) },
      uHeld: { value: 0 },
    }),
    [],
  );

  useEffect(() => {
    const canvas = gl.domElement;

    const readPoint = (e: PointerEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX: number;
      let clientY: number;
      if ("touches" in e) {
        if (!e.touches[0]) return null;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const dpr = gl.getPixelRatio();
      const x = (clientX - rect.left) * dpr;
      const y = (rect.height - (clientY - rect.top)) * dpr;
      return { x, y };
    };

    const onMove = (e: PointerEvent | TouchEvent) => {
      const p = readPoint(e);
      if (!p) return;
      mouseRaw.current.x = p.x;
      mouseRaw.current.y = p.y;
    };

    const onDown = (e: PointerEvent | TouchEvent) => {
      const p = readPoint(e);
      if (!p) return;
      mouseRaw.current.x = p.x;
      mouseRaw.current.y = p.y;
      clickPos.current.x = p.x;
      clickPos.current.y = p.y;
      clickT.current = 0;
      heldTarget.current = 1;
    };

    const onUp = () => {
      heldTarget.current = 0;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("blur", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchstart", onDown);
      window.removeEventListener("touchend", onUp);
    };
  }, [gl]);

  useFrame((_state, delta) => {
    if (!ref.current) return;
    const dt = Math.min(0.05, delta);
    const dpr = gl.getPixelRatio();

    const lerpM = Math.min(1, dt * 12);
    mouseSmooth.current.x +=
      (mouseRaw.current.x - mouseSmooth.current.x) * lerpM;
    mouseSmooth.current.y +=
      (mouseRaw.current.y - mouseSmooth.current.y) * lerpM;

    const lerpH = Math.min(1, dt * 8);
    heldSmooth.current += (heldTarget.current - heldSmooth.current) * lerpH;

    clickT.current += dt;

    const u = ref.current.uniforms;
    u.uTime.value += dt;
    u.uResolution.value.set(size.width * dpr, size.height * dpr);
    u.uMouse.value.set(mouseSmooth.current.x, mouseSmooth.current.y);
    u.uClickAge.value = clickT.current;
    u.uClickPos.value.set(clickPos.current.x, clickPos.current.y);
    u.uHeld.value = heldSmooth.current;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={ref}
        vertexShader={heroVertex}
        fragmentShader={heroFragment}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function HeroShader() {
  return (
    <Canvas
      gl={{ antialias: false, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 1] }}
      className="!absolute inset-0"
    >
      <ShaderPlane />
    </Canvas>
  );
}
