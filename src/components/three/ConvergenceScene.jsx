import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function ConvergingCloud({ progressRef, count, reduced }) {
  const ref = useRef(null)
  const data = useMemo(() => {
    const rng = mulberry32(99)
    const home = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const r = 1.6 + rng() * 3.6
      const theta = rng() * Math.PI * 2
      const phi = Math.acos(2 * rng() - 1)
      home[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      home[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7
      home[i * 3 + 2] = r * Math.cos(phi)
      seed[i] = rng()
    }
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(home.slice(), 3))
    return { home, seed, geom }
  }, [count])

  useFrame((state) => {
    const el = ref.current
    if (!el) return
    const pp = reduced ? 1 : progressRef.current.value
    const c = smooth(0.55, 0.96, pp)
    const arr = el.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      arr[i3] = data.home[i3] * (1 - c) + data.seed[i] * 0.35 * c * Math.sin(state.clock.elapsedTime + data.seed[i] * 10)
      arr[i3 + 1] = data.home[i3 + 1] * (1 - c) + (0.5 - data.seed[i]) * 0.3 * c
      arr[i3 + 2] = data.home[i3 + 2] * (1 - c)
    }
    el.geometry.attributes.position.needsUpdate = true
    el.material.size = 0.03 - c * 0.012
    el.material.opacity = 0.7 - c * 0.3
    el.rotation.y = state.clock.elapsedTime * 0.02
  })

  return (
    <points ref={ref} geometry={data.geom}>
      <pointsMaterial size={0.03} color="#a78bfa" transparent opacity={0.7} depthWrite={false} sizeAttenuation />
    </points>
  )
}

function CollapsingShell({ progressRef, reduced }) {
  const shell = useRef(null)
  const core = useRef(null)

  useFrame(() => {
    if (reduced) return
    const pp = progressRef.current.value
    const c = smooth(0.55, 0.96, pp)
    if (shell.current) {
      shell.current.scale.setScalar(1 - c * 0.9)
      shell.current.material.opacity = 0.5 - c * 0.45
      shell.current.rotation.y -= 0.002
    }
    if (core.current) {
      core.current.scale.setScalar(0.15 + c * 0.9)
      core.current.material.opacity = (0.5 + c * 0.5) * 1
    }
  })

  return (
    <group>
      <mesh ref={shell}>
        <icosahedronGeometry args={[3.4, 1]} />
        <meshBasicMaterial color="#8B5CF6" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh ref={core}>
        <sphereGeometry args={[0.5, 22, 22]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

function Rig({ reducedMotion, children }) {
  const rig = useRef(null)

  useFrame((state, delta) => {
    if (!rig.current || reducedMotion) return
    const cx = Math.sin(state.clock.elapsedTime * 0.14) * 0.15
    const cy = Math.cos(state.clock.elapsedTime * 0.1) * 0.1
    rig.current.position.x += (cx - rig.current.position.x) * Math.min(1, delta * 2)
    rig.current.position.y += (cy - rig.current.position.y) * Math.min(1, delta * 2)
  })

  return <group ref={rig}>{children}</group>
}

/**
 * Scene 06 — final convergence. The particle halo and the structural shell
 * collapse into a single point as the reader reaches the end of the journey;
 * the meeting point for the closing statement.
 */
export default function ConvergenceScene({ progressRef, quality = 'high', reducedMotion = false }) {
  const isMobile = quality === 'low'

  return (
    <Canvas
      dpr={[1, isMobile ? 1.4 : 1.8]}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 7], fov: 46 }}
      frameloop={reducedMotion ? 'demand' : 'always'}
      style={{ pointerEvents: 'none' }}
    >
      <Rig reducedMotion={reducedMotion}>
        <ConvergingCloud progressRef={progressRef} count={isMobile ? 160 : 460} reduced={reducedMotion} />
        <CollapsingShell progressRef={progressRef} reduced={reducedMotion} />
      </Rig>
    </Canvas>
  )
}