import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const seg = (p, a, b, w = 0.06) => clamp01((p - a) / w) * clamp01((b - p) / w)

function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function lineGeomFrom(pts) {
  const arr = new Float32Array(pts.length * 3)
  pts.forEach((pt, i) => {
    arr[i * 3] = pt[0]
    arr[i * 3 + 1] = pt[1]
    arr[i * 3 + 2] = pt[2]
  })
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
  return g
}

/* Primary architecture nodes, revealed in order. */
const PRIMARY = [
  { pos: [-1.25, 1.05, 0], at: 0.32, size: 0.3 },
  { pos: [1.25, 1.05, 0], at: 0.4, size: 0.3 },
  { pos: [1.25, -1.05, 0], at: 0.48, size: 0.3 },
  { pos: [-1.25, -1.05, 0], at: 0.56, size: 0.3 },
]

/* Second layer: the insights that analysis exposes. */
const SECONDARY = [
  { pos: [0, 1.62, 0], at: 0.6, size: 0.2 },
  { pos: [1.62, 0, 0], at: 0.68, size: 0.2 },
  { pos: [0, -1.62, 0], at: 0.76, size: 0.2 },
]

const ALL_NODES = [...PRIMARY, ...SECONDARY]

function makeCloud(positions, initial = 0) {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  g.setDrawRange(0, initial)
  return g
}

/**
 * CodeScreen — the starting repository: a file-tree of thin planks standing in
 * a grid. It is present at the open of the case and dissolves away as the
 * analysis begins, leaving only the architecture behind.
 */
function CodeScreen({ p, reduced }) {
  const group = useRef(null)
  const { planks, lines } = useMemo(() => {
    const rng = mulberry32(3)
    const pl = []
    for (let i = 0; i < 24; i++) {
      const col = i % 4
      const row = Math.floor(i / 4)
      pl.push({
        x: (col - 1.5) * 0.8 + (rng() - 0.5) * 0.3,
        y: (row - 2.5) * 0.62 + (rng() - 0.5) * 0.2,
        w: 0.34 + rng() * 0.34,
        z: (rng() - 0.5) * 0.3,
      })
    }
    const segs = []
    for (let i = 0; i < 28; i++) {
      const x = (i % 6 - 2.5) * 0.72
      const y = -(i % 5) * 0.6 + 1.2
      segs.push([x - 0.3, y, 0.05], [x + 0.3, y, 0.05])
    }
    return { planks: pl, lines: segs }
  }, [])
  const lineGeom = useMemo(() => lineGeomFrom(lines), [lines])

  useFrame(() => {
    const v = reduced ? 0 : clamp01(p.current ? p.current.value : 0)
    if (!group.current) return
    const o = seg(v, 0.02, 0.34, 0.05)
    group.current.scale.setScalar(Math.max(0.0001, o))
    group.current.position.z = -0.6 - (1 - o) * 0.8
    group.current.rotation.y = (1 - o) * -0.5
  })

  return (
    <group ref={group} position={[0, 0, -0.6]} rotation={[0, -0.5, 0]}>
      {planks.map((pl, i) => (
        <mesh key={i} position={[pl.x, pl.y, pl.z]}>
          <boxGeometry args={[pl.w, 0.045, 0.02]} />
          <meshBasicMaterial color="#2e2e38" />
        </mesh>
      ))}
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial color="#4a4a5c" transparent opacity={0.6} />
      </lineSegments>
    </group>
  )
}

/**
 * ArchNode — a single node of the analyzed project. Nodes appear with a pop,
 * glow violet once revealed, and converge into the core at the close.
 */
function ArchNode({ node, conv, reduced }) {
  const ref = useRef(null)
  const solid = useRef(null)
  const halo = useRef(null)

  useFrame((state) => {
    if (!ref.current) return
    const v = reduced ? 0.95 : clamp01(conv.current ? conv.current.value : 0)
    const on = v >= node.at
    const grow = clamp01((v - node.at) / 0.05)
    const close = clamp01((v - 0.82) / 0.16)
    const time = state.clock.elapsedTime

    const s = Math.max(0.0001, grow) * node.size * (1 - close * 0.7)
    ref.current.scale.setScalar(s)
    ref.current.visible = s > 0.0004

    // converge toward the center as the project becomes "understood"
    ref.current.position.x = node.pos[0] * (1 - close)
    ref.current.position.y = node.pos[1] * (1 - close)
    ref.current.position.z = node.pos[2] - close * 1.2

    if (solid.current) {
      solid.current.material.color.set(v >= 0.82 ? '#a78bfa' : on ? '#8B5CF6' : '#34343f')
      const pulse = on ? 1 + Math.sin(time * 3) * 0.08 : 1
      solid.current.scale.setScalar(pulse)
    }
    if (halo.current) {
      const ho = on ? 0.25 + Math.sin(time * 2.4) * 0.1 : 0
      halo.current.material.opacity = ho
    }
  })

  return (
    <group ref={ref} position={[node.pos[0], node.pos[1], node.pos[2]]} scale={0.0001}>
      <mesh ref={solid} rotation={[0.6, 0, 0.4]}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#34343f" />
      </mesh>
      <mesh ref={halo} rotation={[Math.PI / 2.3, 0, 0]}>
        <ringGeometry args={[1.25, 1.45, 24]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/**
 * NetworkLines — connections between the revealed nodes, drawn as the map of
 * the analyzed architecture. Used as a proxy for server-side analysis output.
 */
function NetworkLines({ conv, reduced }) {
  const ref = useRef(null)
  const geometry = useMemo(() => {
    const resolve = (idx) => (idx < PRIMARY.length ? PRIMARY[idx].pos : SECONDARY[idx - PRIMARY.length].pos)
    const edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 6],
      [4, 5],
      [5, 6],
    ]
    const pts = []
    edges.forEach(([a, b]) => {
      pts.push(resolve(a), resolve(b))
    })
    const arr = new Float32Array(pts.length * 3)
    pts.forEach((pt, i) => {
      arr[i * 3] = pt[0]
      arr[i * 3 + 1] = pt[1]
      arr[i * 3 + 2] = pt[2]
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [])

  useFrame(() => {
    if (!ref.current) return
    const v = reduced ? 0.95 : clamp01(conv.current ? conv.current.value : 0)
    const active = PRIMARY.filter((n) => v >= n.at).length + SECONDARY.filter((n) => v >= n.at).length
    ref.current.material.opacity = (active / ALL_NODES.length) * 0.6
  })

  return <lineSegments ref={ref} geometry={geometry}><lineBasicMaterial color="#6d5ce0" transparent opacity={0} /></lineSegments>
}

/**
 * Core — the center of the analyzed project. It assembles as the network
 * completes and glows as the project — and the reader — become "understood".
 */
function Core({ conv, reduced }) {
  const outer = useRef(null)
  const inner = useRef(null)

  useFrame((state) => {
    if (!outer.current || !inner.current) return
    const v = reduced ? 1 : clamp01(conv.current ? conv.current.value : 0)
    const a = clamp01((v - 0.78) / 0.2)
    const time = state.clock.elapsedTime
    const s = 0.2 + a * 1.1
    outer.current.scale.setScalar(s)
    outer.current.rotation.y += 0.004
    inner.current.material.color.set(a > 0 ? '#c4b5fd' : '#4a4a5c')
    inner.current.scale.setScalar(0.7 + Math.sin(time * 2) * 0.05)
  })

  return (
    <group>
      <mesh ref={outer}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshBasicMaterial color="#8B5CF6" wireframe transparent opacity={0.7} />
      </mesh>
      <mesh ref={inner}>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshBasicMaterial color="#4a4a5c" />
      </mesh>
    </group>
  )
}

/**
 * FlowToCore — loose particles that stream inward as the close approaches,
 * the remaining code structure returning to a single understood point.
 */
function FlowToCore({ conv, reduced, isMobile }) {
  const fill = useRef(null)
  const N = isMobile ? 60 : 120
  const positions = useMemo(() => {
    const rng = mulberry32(7)
    const arr = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const a = rng() * Math.PI * 2
      const r = 1.4 + rng() * 2.6
      arr[i * 3] = Math.cos(rng() * Math.PI) * r * 0.8
      arr[i * 3 + 1] = Math.sin(a) * r
      arr[i * 3 + 2] = (rng() - 0.5) * 0.8
    }
    return arr
  }, [N])
  const geom = useMemo(() => {
    const g = makeCloud(positions, reduced ? N : 0)
    return g
  }, [positions, N, reduced])

  useFrame(() => {
    const v = reduced ? 1 : clamp01(conv.current ? conv.current.value : 0)
    const started = clamp01((v - 0.55) / 0.4)
    geom.setDrawRange(0, Math.round(started * N))
  })

  return (
    <points ref={fill} geometry={geom}>
      <pointsMaterial size={0.06} color="#a78bfa" transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function Rig({ progressRef, reducedMotion, children }) {
  const rig = useRef(null)

  useFrame((state) => {
    if (!rig.current || reducedMotion) return
    const pp = progressRef.current ? progressRef.current.value : 0
    rig.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.06
    rig.current.position.z = pp * 0.4
    rig.current.rotation.y = (pp - 0.5) * 0.18
  })

  return <group ref={rig}>{children}</group>
}

/**
 * Scene 04c — RepoReady world.
 * The case starts as a standing code structure, which dissolves into a map of
 * analyzed architecture nodes (CODE · ARCHITECTURE · API · DATABASE), then a
 * second layer of insights (GAPS · QUESTIONS · DEFENSE), and finally converges
 * into a single understood core. Nothing claims product behavior beyond the
 * description — it is a spatial metaphor for "build · understand · defend".
 */
export default function RepoReadyScene({ progressRef, quality = 'high', reducedMotion = false }) {
  const isMobile = quality === 'low'

  return (
    <Canvas
      dpr={[1, isMobile ? 1.4 : 1.7]}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 7.4], fov: 46 }}
      frameloop={reducedMotion ? 'demand' : 'always'}
      style={{ pointerEvents: 'none' }}
    >
      <Rig progressRef={progressRef} reducedMotion={reducedMotion}>
        <CodeScreen p={progressRef} reduced={reducedMotion} />
        <NetworkLines conv={progressRef} reduced={reducedMotion} />
        {PRIMARY.map((n) => (
          <ArchNode key={n.pos.join(',')} node={n} conv={progressRef} reduced={reducedMotion} />
        ))}
        {SECONDARY.map((n) => (
          <ArchNode key={n.pos.join(',')} node={n} conv={progressRef} reduced={reducedMotion} />
        ))}
        <Core conv={progressRef} reduced={reducedMotion} />
        <FlowToCore conv={progressRef} reduced={reducedMotion} isMobile={isMobile} />
      </Rig>
    </Canvas>
  )
}