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

function RisingLine({ progressRef, reduced }) {
  const line = useRef(null)
  const sheath = useRef(null)
  const geo = useMemo(() => {
    const arr = new Float32Array(6)
    arr[3] = 0
    arr[4] = 5.4
    arr[5] = 0
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [])

  useFrame((state) => {
    if (!line.current || reduced) return
    const t = state.clock.elapsedTime
    line.current.material.opacity = 0.5 + Math.sin(t * 1.4) * 0.2
  })

  useFrame(() => {
    if (!sheath.current) return
    const pp = progressRef.current ? progressRef.current.value : 0
    sheath.current.position.y = -2.6 + pp * 5.2
  })

  return (
    <group>
      <lineSegments geometry={geo} ref={line}>
        <lineBasicMaterial color="#4a4a58" transparent opacity={0.5} />
      </lineSegments>
      {/* progress sheath that extends upward with scroll */}
      <mesh ref={sheath} position={[0, -2.6, 0]}>
        <planeGeometry args={[0.014, 5.2]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.9} />
      </mesh>
    </group>
  )
}

function Milestone({ y, progressRef, reduced }) {
  const node = useRef(null)

  useFrame(() => {
    if (!node.current || reduced) return
    const pp = progressRef.current ? progressRef.current.value : 0
    const shown = Math.min(1, Math.max(0, (pp * 3 - (1.5 + y * 0.35)) * 3))
    node.current.scale.setScalar(Math.max(0.0001, shown))
  })

  return (
    <group position={[0, y, 0]}>
      <group ref={node} scale={0}>
        <mesh>
          <octahedronGeometry args={[0.42, 0]} />
          <meshBasicMaterial color="#1d1329" wireframe transparent opacity={0.9} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.12, 14, 14]} />
          <meshBasicMaterial color="#c4b5fd" />
        </mesh>
        <mesh>
          <ringGeometry args={[0.6, 0.72, 24]} />
          <meshBasicMaterial color="#8B5CF6" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}

function Drift({ count, reduced }) {
  const ref = useRef(null)
  const positions = useMemo(() => {
    const rng = mulberry32(22)
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rng() - 0.5) * 9
      arr[i * 3 + 1] = (rng() - 0.5) * 12
      arr[i * 3 + 2] = (rng() - 0.5) * 4 - 1
    }
    return arr
  }, [count])
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [positions])

  useFrame((state) => {
    if (!ref.current || reduced) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.02
  })

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial size={0.02} color="#6b6b7a" transparent opacity={0.5} depthWrite={false} sizeAttenuation />
    </points>
  )
}

function Rig({ progressRef, reducedMotion, children }) {
  const rig = useRef(null)

  useFrame((state) => {
    if (!rig.current || reducedMotion) return
    const pp = progressRef.current ? progressRef.current.value : 0
    rig.current.rotation.y = (pp - 0.9) * 0.35 + Math.sin(state.clock.elapsedTime * 0.06) * 0.03
  })

  return <group ref={rig}>{children}</group>
}

/**
 * Scene 05 — the developer journey. A vertical spatial line rises with scroll,
 * milestone markers pop in; the geometry tracks the same milestones shown in
 * the DOM so the whole section reads as one path.
 */
export default function JourneyScene({ progressRef, quality = 'high', reducedMotion = false }) {
  const isMobile = quality === 'low'

  return (
    <Canvas
      dpr={[1, isMobile ? 1.4 : 1.7]}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 5.4], fov: 46 }}
      frameloop={reducedMotion ? 'demand' : 'always'}
      style={{ pointerEvents: 'none' }}
    >
      <Rig progressRef={progressRef} reducedMotion={reducedMotion}>
        <Drift count={isMobile ? 60 : 150} reduced={reducedMotion} />
        <RisingLine progressRef={progressRef} reduced={reducedMotion} />
        <Milestone y={-2.5} progressRef={progressRef} reduced={reducedMotion} />
        <Milestone y={0} progressRef={progressRef} reduced={reducedMotion} />
        <Milestone y={2.5} progressRef={progressRef} reduced={reducedMotion} />
      </Rig>
    </Canvas>
  )
}