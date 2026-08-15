import { useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { techNodes, coreTech } from '../../data/skills'

function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const CAT = {
  Frontend: { radius: 3.0, start: -2.4, step: 1.05, tilt: 0.4 },
  Backend: { radius: 2.55, start: 0.4, step: 1.0, tilt: 0.4 },
  Tools: { radius: 4.0, start: -1.1, step: 0.9, tilt: 0.35 },
  Learning: { radius: 3.6, start: 2.3, step: 0.9, tilt: 0.3 },
}

/**
 * Places every node in its cluster: the front/back bands sit on the middle
 * orbit, tooling and learning on the outer orbit, with the three core
 * technologies grouped at the centre.
 */
function layoutNodes(scale) {
  const rng = mulberry32(19)
  const out = []
  const core = []
  techNodes.forEach((n, i) => {
    const c = CAT[n.category]
    if (coreTech.includes(n.tech)) {
      core.push({
        ...n,
        x: (rng() - 0.5) * scale * 0.6,
        y: (rng() - 0.5) * scale * 0.5,
        z: (rng() - 0.5) * scale * 0.4,
        cluster: i,
      })
      return
    }
    const angle = c.start + (i % 5) * c.step
    out.push({
      ...n,
      x: Math.cos(angle) * c.radius * scale,
      y: (rng() - 0.5) * c.tilt * scale,
      z: Math.sin(angle) * c.radius * scale,
      cluster: i,
    })
  })
  return { orbit: out, core }
}

function Spokes({ nodes, activeTech }) {
  const positions = useMemo(() => {
    const all = [...nodes.core, ...nodes.orbit]
    const arr = new Float32Array(all.length * 6)
    all.forEach((n, i) => {
      arr[i * 6 + 3] = n.x
      arr[i * 6 + 4] = n.y
      arr[i * 6 + 5] = n.z
    })
    return arr
  }, [nodes])

  const colors = useMemo(() => {
    const all = [...nodes.core, ...nodes.orbit]
    const arr = new Float32Array(all.length * 6)
    const faint = new THREE.Color(0.4, 0.38, 0.62)
    const bright = new THREE.Color(0.78, 0.6, 1.0)
    all.forEach((n, i) => {
      const c = activeTech === n.tech ? bright : faint
      arr[i * 6] = c.r
      arr[i * 6 + 1] = c.g
      arr[i * 6 + 2] = c.b
      arr[i * 6 + 3] = c.r
      arr[i * 6 + 4] = c.g
      arr[i * 6 + 5] = c.b
    })
    return arr
  }, [nodes, activeTech])

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return g
  }, [positions, colors])

  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial vertexColors transparent opacity={0.5} />
    </lineSegments>
  )
}

function Node({ n, active, onHover, showLabels }) {
  return (
    <group position={[n.x, n.y, n.z]}>
      <mesh scale={active ? 1.5 : 1}>
        <sphereGeometry args={[0.13, 14, 14]} />
        <meshBasicMaterial
          color={active ? '#c4b5fd' : n.learning ? '#8f8fa3' : '#e2e2ea'}
          transparent
          opacity={active ? 1 : n.learning ? 0.55 : 0.78}
        />
      </mesh>
      {/* invisible larger hit target for easier selection */}
      <mesh
        visible={false}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(n.tech)
        }}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[0.42, 6, 6]} />
        <meshBasicMaterial />
      </mesh>
      {showLabels && (
        <Html center distanceFactor={11} position={[0, 0.32, 0]} zIndexRange={[10, 0]}>
          <span
            className="pointer-events-none select-none whitespace-nowrap font-mono text-[9px] uppercase tracking-label"
            style={{
              color: active ? '#c4b5fd' : 'rgba(235,235,245,0.55)',
              textShadow: '0 0 10px rgba(0,0,0,0.9)',
            }}
          >
            {n.tech}
          </span>
        </Html>
      )}
    </group>
  )
}

function Ecosystem({ activeTech = null, onHover, showLabels, reduced }) {
  const group = useRef(null)
  const camHand = useRef(null)
  const activeRef = useRef(activeTech)

  useEffect(() => {
    activeRef.current = activeTech
  }, [activeTech])

  const nodes = useMemo(() => layoutNodes(1), [])
  const nodesSmall = useMemo(() => layoutNodes(0.68), [])

  useFrame((state, delta) => {
    const d = Math.min(1, delta * 2.4)
    if (group.current) {
      group.current.rotation.y += delta * 0.05
    }
    const target = activeRef.current ? 0.35 : 0
    if (camHand.current) {
      camHand.current.position.z += (target - camHand.current.position.z) * d
    }
  })

  const used = reduced ? nodesSmall : nodes

  return (
    <group ref={camHand}>
      <group ref={group}>
        <Spokes nodes={used} activeTech={activeTech} />
        {used.core.map((n) => (
          <Node key={`core-${n.tech}`} n={n} active={activeTech === n.tech} onHover={onHover} showLabels={false} />
        ))}
        {used.orbit.map((n) => (
          <Node key={n.tech} n={n} active={activeTech === n.tech} onHover={onHover} showLabels={showLabels} />
        ))}

        {/* hub */}
        <mesh>
          <icosahedronGeometry args={[0.34, 1]} />
          <meshBasicMaterial color="#8B5CF6" wireframe transparent opacity={0.7} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshBasicMaterial color="#c4b5fd" />
        </mesh>
      </group>
    </group>
  )
}

/**
 * Scene 03 — the technology ecosystem. Real technologies are nodes in a
 * spatial graph; hovering a node highlights it and its connection to the hub.
 */
export default function EcosystemScene({
  activeTech = null,
  onHover = () => {},
  quality = 'high',
  reducedMotion = false,
}) {
  const isMobile = quality === 'low'
  return (
    <Canvas
      dpr={[1, isMobile ? 1.4 : 1.8]}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.3, 8.4], fov: 48 }}
      frameloop={reducedMotion ? 'demand' : 'always'}
    >
      <Ecosystem
        activeTech={activeTech}
        onHover={onHover}
        showLabels={!isMobile}
        reduced={reducedMotion}
      />
    </Canvas>
  )
}