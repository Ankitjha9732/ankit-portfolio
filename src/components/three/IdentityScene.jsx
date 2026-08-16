import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Deterministic PRNG so geometry is stable across renders.
 */
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function ringGeometry(kind, count, radius, spreadY, seed) {
  const rng = mulberry32(seed)
  const pos = new Float32Array(count * 3)
  const up = kind === 'A' ? new THREE.Vector3(0.35, 1, 0.35).normalize() : new THREE.Vector3(1, 0.3, 0).normalize()
  const right = new THREE.Vector3().crossVectors(up, new THREE.Vector3(0, 0, 1)).normalize()
  const fwd = new THREE.Vector3().crossVectors(right, up).normalize()
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2
    const p = new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0)
    const v = new THREE.Vector3()
      .addScaledVector(right, p.x)
      .addScaledVector(up, p.y)
      .addScaledVector(fwd, (rng() - 0.5) * spreadY)
    pos[i * 3] = v.x
    pos[i * 3 + 1] = v.y
    pos[i * 3 + 2] = v.z
  }
  return pos
}

function pointsGeom(positionAttr) {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(positionAttr, 3))
  return g
}

function ringLines(positions) {
  const count = positions.length / 3
  const arr = new Float32Array(count * 6)
  for (let i = 0; i < count; i++) {
    const j = (i + 1) % count
    arr[i * 6] = positions[i * 3]
    arr[i * 6 + 1] = positions[i * 3 + 1]
    arr[i * 6 + 2] = positions[i * 3 + 2]
    arr[i * 6 + 3] = positions[j * 3]
    arr[i * 6 + 4] = positions[j * 3 + 1]
    arr[i * 6 + 5] = positions[j * 3 + 2]
  }
  return pointsGeom(arr)
}

function ringSpokes(positions) {
  const count = positions.length / 3
  const arr = new Float32Array(count * 6)
  for (let i = 0; i < count; i++) {
    arr[i * 6 + 3] = positions[i * 3]
    arr[i * 6 + 4] = positions[i * 3 + 1]
    arr[i * 6 + 5] = positions[i * 3 + 2]
  }
  return pointsGeom(arr)
}

function nodeArray(positions) {
  const out = []
  for (let i = 0; i < positions.length / 3; i++) {
    out.push([positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]])
  }
  return out
}

function ParticleField({ count, spread, animate }) {
  const ref = useRef(null)
  const positions = useMemo(() => {
    const rng = mulberry32(11)
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      let x = (rng() - 0.5) * spread * 2
      let y = (rng() - 0.5) * spread * 1.5
      let z = (rng() - 0.5) * spread * 1.3
      const d = Math.sqrt(x * x + y * y + z * z)
      if (d < 1.4 && d > 0) {
        const k = 2.2 / d
        x *= k
        y *= k
        z *= k
      } else if (d === 0) {
        x = 2
        y = 0
        z = 0
      }
      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z
    }
    return pos
  }, [count, spread])

  const colors = useMemo(() => {
    const rng = mulberry32(41)
    const col = new Float32Array(count * 3)
    const a = new THREE.Color('#a78bfa')
    const b = new THREE.Color('#57536b')
    for (let i = 0; i < count; i++) {
      const c = a.clone().lerp(b, rng())
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return col
  }, [count])

  const geom = useMemo(() => {
    const g = pointsGeom(positions)
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return g
  }, [positions, colors])

  useFrame((state) => {
    if (!animate || !ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y = t * 0.015
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.05
  })

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial size={0.024} vertexColors transparent opacity={0.7} depthWrite={false} sizeAttenuation />
    </points>
  )
}

function Core({ pulseRef }) {
  const group = useRef(null)
  const ringA = useRef(null)
  const ringB = useRef(null)
  const coreRef = useRef(null)

  const geoA = useMemo(() => ringGeometry('A', 16, 2.35, 1.6, 3), [])
  const geoB = useMemo(() => ringGeometry('B', 12, 1.65, 1.4, 9), [])
  const lineA = useMemo(() => ringLines(geoA), [geoA])
  const lineB = useMemo(() => ringLines(geoB), [geoB])
  const spokes = useMemo(() => ringSpokes(geoA), [geoA])
  const nodesA = useMemo(() => nodeArray(geoA), [geoA])
  const nodesB = useMemo(() => nodeArray(geoB), [geoB])

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    ringA.current.rotation.z = t * 0.16
    ringB.current.rotation.x = -t * 0.22
    ringB.current.rotation.z = t * 0.1
    group.current.rotation.y += delta * 0.06

    if (coreRef.current && pulseRef) {
      const pulse = Math.max(0, (pulseRef.current ?? 0) - delta * 2.5)
      pulseRef.current = pulse
      coreRef.current.scale.setScalar(1 + pulse * 0.12)
    }
  })

  return (
    <group ref={group}>
      {/* core lattice */}
      <group ref={coreRef}>
        <mesh>
          <icosahedronGeometry args={[1.05, 1]} />
          <meshBasicMaterial color="#8B5CF6" wireframe transparent opacity={0.55} />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.9, 0]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.14} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshBasicMaterial color="#c4b5fd" />
        </mesh>
      </group>

      {/* spokes from core to primary ring */}
      <lineSegments geometry={spokes}>
        <lineBasicMaterial color="#8B5CF6" transparent opacity={0.2} />
      </lineSegments>

      {/* primary ring */}
      <group ref={ringA}>
        <lineSegments geometry={lineA}>
          <lineBasicMaterial color="#6f6fff" transparent opacity={0.5} />
        </lineSegments>
        {nodesA.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial color={i % 3 === 0 ? '#a78bfa' : '#ffffff'} />
          </mesh>
        ))}
      </group>

      {/* secondary ring */}
      <group ref={ringB}>
        <lineSegments geometry={lineB}>
          <lineBasicMaterial color="#8B5CF6" transparent opacity={0.4} />
        </lineSegments>
        {nodesB.map((p, i) => (
          <mesh key={i} position={p} scale={0.7}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Rig({ reducedMotion, scrollRef, mouseRef, children }) {
  const cameraHand = useRef(null)
  const dollyRef = useRef(null)

  useFrame((state, delta) => {
    if (reducedMotion) return
    const d = Math.min(1, delta * 3)
    if (cameraHand.current) {
      cameraHand.current.x += (mouseRef.current.x * 0.55 - cameraHand.current.x) * d
      cameraHand.current.y += (-mouseRef.current.y * 0.35 - cameraHand.current.y) * d
    }
    if (dollyRef.current) {
      dollyRef.current.position.y += (scrollRef.current.y * 0.06 - dollyRef.current.position.y) * Math.min(1, delta * 2)
    }
  })

  return (
    <group ref={cameraHand}>
      <group ref={dollyRef}>{children}</group>
    </group>
  )
}

/**
 * Reports whether the hero canvas is in a compact viewport (small phone or a
 * short landscape screen). In those layouts the lattice is pulled up and
 * slightly scaled so it stays clear of the bottom-anchored identity block.
 */
function useCompactCore() {
  const [layout, setLayout] = useState({
    y: 0.55,
    scale: 1,
  })

  useEffect(() => {
    const phone = window.matchMedia('(max-width: 767px)')
    const short = window.matchMedia('(max-height: 600px) and (orientation: landscape)')
    const apply = () => {
      if (phone.matches) {
        setLayout({ y: 1.15, scale: 0.82 })
      } else if (short.matches) {
        setLayout({ y: 0.9, scale: 0.75 })
      } else {
        setLayout({ y: 0.55, scale: 1 })
      }
    }
    apply()
    phone.addEventListener('change', apply)
    short.addEventListener('change', apply)
    return () => {
      phone.removeEventListener('change', apply)
      short.removeEventListener('change', apply)
    }
  }, [])

  return layout
}

/**
 * Hero identity scene — a connected-node lattice core inside a drifting
 * particle field. Reacts to pointer (parallax), pointer velocity (pulse on
 * the core), and page scroll (slow vertical drift).
 *
 * @param {Function} [onCreated] - Called when the R3F canvas first renders.
 *   Useful for coordinating the parent wrapper fade-in with actual canvas
 *   readiness instead of a fixed timer.
 */
export default function IdentityScene({
  quality = 'high',
  reducedMotion = false,
  scrollRef = { current: { y: 0 } },
  mouseRef = { current: { x: 0, y: 0 } },
  pulseRef = { current: 0 },
  onCreated,
}) {
  const isMobile = quality === 'low'
  const { y, scale } = useCompactCore()

  return (
    <Canvas
      dpr={[1, isMobile ? 1.4 : 1.8]}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6.5], fov: 52 }}
      frameloop={reducedMotion ? 'demand' : 'always'}
      onCreated={onCreated}
    >
      <Rig reducedMotion={reducedMotion} scrollRef={scrollRef} mouseRef={mouseRef}>
        <ParticleField count={isMobile ? 240 : 700} spread={isMobile ? 6.5 : 8} animate={!reducedMotion} />
        <group position={[0, y, 0]} scale={scale}>
          <Core pulseRef={pulseRef} />
        </group>
      </Rig>
    </Canvas>
  )
}
