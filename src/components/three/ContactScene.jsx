import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

function ContactParticles({ count = 300 }) {
  const points = useRef(null)
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const rng = (i) => {
      // deterministic
      const x = Math.sin(i * 127.1 + 311.7) * 0.5 + Math.sin(i * 269.5 + 183.3) * 0.5
      return x - Math.floor(x)
    }
    for (let i = 0; i < count; i++) {
      const r = 2 + rng(i * 3) * 4
      const theta = rng(i * 3 + 1) * Math.PI * 2
      const phi = Math.acos(2 * rng(i * 3 + 2) - 1)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [count])

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [positions])

  useFrame((state, delta) => {
    if (!points.current) return
    points.current.rotation.y -= delta * 0.03
  })

  return (
    <points ref={points} geometry={geom}>
      <pointsMaterial size={0.025} color="#a78bfa" transparent opacity={0.7} depthWrite={false} />
    </points>
  )
}

function CenterTorus() {
  return (
    <Float speed={1.4} rotationIntensity={1} floatIntensity={1.2}>
      <group>
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[1.4, 0.02, 12, 64]} />
          <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={0.6} />
        </mesh>
        <mesh rotation={[Math.PI / 2.4, Math.PI / 3, 0]}>
          <torusGeometry args={[1.4, 0.02, 12, 64]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.7} />
        </mesh>
      </group>
    </Float>
  )
}

/**
 * Final scene for the contact section: soft violet torus ring + particle halo.
 */
export default function ContactScene({ quality = 'high' }) {
  const isMobile = quality === 'low'
  return (
    <Canvas
      dpr={[1, isMobile ? 1.25 : 1.6]}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 7], fov: 50 }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.7} />
      <CenterTorus />
      <ContactParticles count={isMobile ? 150 : 400} />
    </Canvas>
  )
}