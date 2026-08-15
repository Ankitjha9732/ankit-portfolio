import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const clamp01 = (v) => Math.min(1, Math.max(0, v))

function makeCloud(positions) {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  g.setDrawRange(0, 0)
  return g
}

/**
 * LearningPath — a syllabus rendered as a vertical learning spine. Topic ticks
 * climb the spine as progress rises; the active tick (carat) advances ahead of
 * the filled wave, and the "you are here" marker gently pulses.
 */
function LearningPath({ p, reduced, isMobile }) {
  const N = isMobile ? 26 : 44
  const dim = useRef(null)
  const fill = useRef(null)
  const carat = useRef(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1)
      arr[i * 3] = Math.sin(t * 6.2) * 0.75 * (1 - t * 0.35) + Math.sin(t * 23) * 0.05
      arr[i * 3 + 1] = -2.5 + t * 5
      arr[i * 3 + 2] = Math.cos(t * 5) * 0.3
    }
    return arr
  }, [N])

  const dimGeom = useMemo(() => {
    const g = makeCloud(positions)
    g.setDrawRange(0, N)
    return g
  }, [positions, N])
  const fillGeom = useMemo(() => {
    const g = makeCloud(positions)
    g.setDrawRange(0, reduced ? N : 0)
    return g
  }, [positions, N, reduced])

  useFrame((state) => {
    const v = reduced ? 1 : clamp01(p.current ? p.current.value : 0)
    const filled = Math.round(v * N)
    fillGeom.setDrawRange(0, filled)
    if (carat.current) {
      const y = -2.5 + v * 5
      carat.current.position.y = y
      const time = state.clock.elapsedTime
      carat.current.scale.setScalar(1 + Math.sin(time * 4) * 0.4)
      carat.current.material.opacity = 0.35 + Math.sin(time * 4) * 0.25
    }
  })

  return (
    <group>
      <points ref={dim} geometry={dimGeom}>
        <pointsMaterial size={0.075} color="#3a3a46" transparent opacity={0.5} sizeAttenuation depthWrite={false} />
      </points>
      <points ref={fill} geometry={fillGeom}>
        <pointsMaterial size={0.09} color="#8B5CF6" sizeAttenuation depthWrite={false} />
      </points>
      {/* spine */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[0.012, 5.1, 0.012]} />
        <meshBasicMaterial color="#22222a" />
      </mesh>
      {/* "you are here" carat */}
      <mesh ref={carat} position={[0.85, -2.5, 0.05]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.16, 0.16, 0.02]} />
        <meshBasicMaterial color="#c4b5fd" transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

/**
 * ProgressRing — an activity ring: 48 marks around a circle light up in order,
 * like the overall progress readout of the tracking dashboard.
 */
function ProgressRing({ p, reduced, isMobile }) {
  const N = isMobile ? 40 : 60
  const fill = useRef(null)
  const dim = useRef(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2 - Math.PI / 2
      arr[i * 3] = Math.cos(a) * 1.35
      arr[i * 3 + 1] = Math.sin(a) * 1.35
      arr[i * 3 + 2] = 0
    }
    return arr
  }, [N])

  const dimGeom = useMemo(() => {
    const g = makeCloud(positions)
    g.setDrawRange(0, N)
    return g
  }, [positions, N])
  const fillGeom = useMemo(() => {
    const g = makeCloud(positions)
    g.setDrawRange(0, reduced ? N : 0)
    return g
  }, [positions, N, reduced])

  useFrame(() => {
    if (reduced) return
    const v = clamp01(p.current ? p.current.value : 0)
    fillGeom.setDrawRange(0, Math.round(v * N))
  })

  return (
    <group position={[1.9, 1.15, -0.6]} rotation={[0.25, -0.4, 0]}>
      <points ref={dim} geometry={dimGeom}>
        <pointsMaterial size={0.06} color="#34343f" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
      </points>
      <points ref={fill} geometry={fillGeom}>
        <pointsMaterial size={0.075} color="#a78bfa" sizeAttenuation depthWrite={false} />
      </points>
      <mesh>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color="#8B5CF6" />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[1.32, 1.4, 48]} />
        <meshBasicMaterial color="#2c2c33" transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

const MODULES = [
  { label: 1, y: 1.25, at: 0.18 },
  { label: 2, y: 0, at: 0.52 },
  { label: 3, y: -1.25, at: 0.86 },
]

/**
 * ModuleMarkers — one octahedron per module on the path. Each lights up once
 * the reader has passed the module's completion point; a faint halo blooms.
 */
function ModuleMarkers({ p, reduced }) {
  return (
    <group>
      {MODULES.map((m) => (
        <Module key={m.label} index={m.label} y={m.y} at={m.at} p={p} reduced={reduced} />
      ))}
    </group>
  )
}

function Module({ p, at, y, index, reduced }) {
  const solid = useRef(null)
  const halo = useRef(null)

  useFrame((state) => {
    const v = reduced ? 1 : clamp01(p.current ? p.current.value : 0)
    const on = v >= at
    const time = state.clock.elapsedTime
    if (solid.current) {
      solid.current.material.color.set(on ? '#8B5CF6' : '#34343f')
      const pulse = on ? 1 + Math.sin(time * 3 + index) * 0.08 : 1
      solid.current.scale.setScalar(pulse * (on ? 1.25 : 0.9))
    }
    if (halo.current) {
      halo.current.material.opacity = on ? 0.35 + Math.sin(time * 2.2) * 0.12 : 0
      halo.current.scale.setScalar(on ? 1.25 + Math.sin(time * 2.2) * 0.1 : 0.6)
    }
  })

  return (
    <group position={[-1.55, y, 0.15]}>
      <mesh ref={solid} rotation={[0.6, 0, 0.35]}>
        <octahedronGeometry args={[0.34, 0]} />
        <meshBasicMaterial color="#34343f" />
      </mesh>
      <mesh ref={halo} rotation={[Math.PI / 2.4, 0, 0]}>
        <ringGeometry args={[0.42, 0.52, 24]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.52, 0, 0.05]}>
        <boxGeometry args={[0.4, 0.06, 0.02]} />
        <meshBasicMaterial color="#3f3f4c" />
      </mesh>
      <mesh position={[0.52, 0.09, 0.05]}>
        <boxGeometry args={[0.28, 0.04, 0.02]} />
        <meshBasicMaterial color="#2c2c34" />
      </mesh>
    </group>
  )
}

function Rig({ progressRef, reducedMotion, isMobile, children }) {
  const rig = useRef(null)

  useFrame((state) => {
    if (!rig.current || reducedMotion) return
    const pp = progressRef.current ? progressRef.current.value : 0
    rig.current.position.x = Math.sin(state.clock.elapsedTime * 0.16) * 0.08
    rig.current.position.y = Math.cos(state.clock.elapsedTime * 0.2) * 0.05
    rig.current.rotation.y = (pp - 0.5) * 0.1
  })

  return <group ref={rig} scale={isMobile ? 1.05 : 1}>{children}</group>
}

/**
 * Scene 04a — Syllabus Tracker world.
 * A vertical learning spine climbs as the reader moves through the case:
 * topic ticks fill bottom-up, modules complete in order, and the activity ring
 * reports overall progress — a spatial readout of the real tracking app.
 */
export default function SyllabusScene({ progressRef, quality = 'high', reducedMotion = false }) {
  const isMobile = quality === 'low'

  return (
    <Canvas
      dpr={[1, isMobile ? 1.4 : 1.7]}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.1, 6.4], fov: 46 }}
      frameloop={reducedMotion ? 'demand' : 'always'}
      style={{ pointerEvents: 'none' }}
    >
      <Rig progressRef={progressRef} reducedMotion={reducedMotion} isMobile={isMobile}>
        <LearningPath p={progressRef} reduced={reducedMotion} isMobile={isMobile} />
        <ProgressRing p={progressRef} reduced={reducedMotion} isMobile={isMobile} />
        <ModuleMarkers p={progressRef} reduced={reducedMotion} />
      </Rig>
    </Canvas>
  )
}