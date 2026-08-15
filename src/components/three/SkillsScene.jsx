import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ecosystemTech } from '../../data/skills'

/**
 * 3D "technology ecosystem": a central core with technology nodes connected by lines.
 * Nodes float + orbit slowly; hover state is passed via data-* attributes from DOM
 * (nodes respond to the same hover as the DOM skill list via a shared `activeTech`).
 *
 * Props:
 * - activeTech: string|null — which tech is currently hovered in the DOM list
 * - quality: 'high' | 'low'
 */
export default function SkillsScene({ activeTech = null, quality = 'high' }) {
  const isMobile = quality === 'low'

  const nodes = useMemo(() => {
    const radius = isMobile ? 2.4 : 3.2
    const total = ecosystemTech.length
    return ecosystemTech.map((tech, i) => {
      const angle = (i / total) * Math.PI * 2
      return {
        tech,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius * 0.7,
        z: 0,
      }
    })
  }, [isMobile])

  return (
    <Canvas
      dpr={[1, isMobile ? 1.25 : 1.75]}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 9], fov: 50 }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 5]} intensity={1.4} color="#8B5CF6" />
      <SceneContent nodes={nodes} activeTech={activeTech} />
    </Canvas>
  )
}

function SceneContent({ nodes, activeTech }) {
  const group = useRef(null)

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.08
    // subtle parallax on mouse
    const mx = state.pointer.x * 0.4
    const my = state.pointer.y * 0.3
    group.current.rotation.x += (0 - group.current.rotation.x) * 0.02
    group.current.position.x += (mx - group.current.position.x) * 0.04
    group.current.position.y += (my - group.current.position.y) * 0.04
  })

  const lineGeom = useMemo(() => {
    const positions = new Float32Array(nodes.length * 6)
    nodes.forEach((n, i) => {
      positions[i * 6] = n.x
      positions[i * 6 + 1] = n.y
      positions[i * 6 + 2] = n.z
      positions[i * 6 + 3] = 0
      positions[i * 6 + 4] = 0
      positions[i * 6 + 5] = 0
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [nodes])

  return (
    <group ref={group}>
      {/* Core */}
      <mesh>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial
          color="#8B5CF6"
          emissive="#8B5CF6"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Core glow sphere */}
      <mesh>
        <sphereGeometry args={[0.35, 20, 20]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.35} />
      </mesh>

      {/* Connection lines */}
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial color="#8B5CF6" transparent opacity={0.25} />
      </lineSegments>

      {/* Tech nodes */}
      {nodes.map((node) => {
        const active = activeTech === node.tech
        return (
          <group key={node.tech} position={[node.x, node.y, node.z]}>
            <mesh scale={active ? 1.25 : 1}>
              <sphereGeometry args={[0.12, 12, 12]} />
              <meshStandardMaterial
                color={active ? '#a78bfa' : '#8B5CF6'}
                emissive={active ? '#8B5CF6' : '#6D28D9'}
                emissiveIntensity={active ? 1.4 : 0.4}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}