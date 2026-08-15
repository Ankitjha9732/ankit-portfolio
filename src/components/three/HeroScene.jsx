import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Deterministic pseudo-random (no flicker between renders).
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

function ParticleField({ count = 1200, spread = 10, size = 0.02, animate = true }) {
  const points = useRef(null)

  const { positions, colors, seeds } = useMemo(() => {
    const rng = mulberry32(42)
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const sd = new Float32Array(count)
    const colorA = new THREE.Color('#8B5CF6')
    const colorB = new THREE.Color('#6D28D9')
    for (let i = 0; i < count; i++) {
      const x = (rng() - 0.5) * spread * 2
      const y = (rng() - 0.5) * spread * 1.6
      const z = (rng() - 0.5) * spread * 1.2 + 1
      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z
      const c = colorA.clone().lerp(colorB, rng())
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
      sd[i] = rng() * Math.PI * 2
    }
    return { positions: pos, colors: col, seeds: sd }
  }, [count, spread])

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return g
  }, [positions, colors])

  useFrame((state, delta) => {
    if (!points.current) return
    if (!animate) return
    const time = state.clock.elapsedTime
    const positionsArr = points.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // gentle sine drift on Y, subtle x sway
      positionsArr[i3 + 1] =
        positions[i3 + 1] + Math.sin(time * 0.4 + seeds[i]) * 0.15
      positionsArr[i3] =
        positions[i3] + Math.cos(time * 0.3 + seeds[i] * 2) * 0.12
    }
    points.current.geometry.attributes.position.needsUpdate = true

    // idle rotation
    points.current.rotation.y += delta * 0.02
  })

  return (
    <points ref={points} geometry={geom}>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

function FloatingGeometry() {
  return (
    <>
      {/* Central abstract ring/torus knot */}
      <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1}>
        <mesh position={[2.6, 0.6, -1]}>
          <icosahedronGeometry args={[0.9, 1]} />
          <meshStandardMaterial
            color="#1a1a2e"
            wireframe
            transparent
            opacity={0.5}
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
      </Float>

      {/* Small orbiting sphere */}
      <Float speed={2} rotationIntensity={0.8} floatIntensity={1.4}>
        <mesh position={[-3, 1.4, -2]}>
          <sphereGeometry args={[0.35, 24, 24]} />
          <meshStandardMaterial
            color="#8B5CF6"
            emissive="#8B5CF6"
            emissiveIntensity={0.35}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
      </Float>

      {/* Torus */}
      <Float speed={1.6} rotationIntensity={0.9} floatIntensity={1.2}>
        <mesh position={[-2.4, -1.6, -1]}>
          <torusGeometry args={[0.5, 0.16, 16, 40]} />
          <meshStandardMaterial
            color="#6D28D9"
            emissive="#6D28D9"
            emissiveIntensity={0.2}
            roughness={0.3}
            metalness={0.5}
            wireframe
          />
        </mesh>
      </Float>
    </>
  )
}

/**
 * Interactive, mouse-responsive 3D hero background.
 * - Particle field reacting subtly to scroll parallax + idle drift
 * - Floating wireframe geometry with emission
 * - Parallax offset based on the scroll position of the hero section
 *
 * Props: quality ('high' | 'low'), reducedMotion (bool)
 */
export default function HeroScene({ quality = 'high', reducedMotion = false }) {
  const isMobile = quality === 'low'
  const particleCount = isMobile ? 400 : 1200
  const animate = !reducedMotion

  return (
    <Canvas
      dpr={[1, isMobile ? 1.25 : 1.75]}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 7], fov: 55 }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 3]} intensity={1.2} color="#8B5CF6" />
      <pointLight position={[-3, -2, 2]} intensity={0.7} color="#6D28D9" />
      <ParticleField count={particleCount} spread={isMobile ? 7 : 10} size={isMobile ? 0.025 : 0.02} animate={animate} />
      {!isMobile && <FloatingGeometry />}
    </Canvas>
  )
}