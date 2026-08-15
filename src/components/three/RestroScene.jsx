import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const seg = (p, a, b, w = 0.05) => clamp01((p - a) / w) * clamp01((b - p) / w)

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

function rowsGeometry(height, count, halfWidth = 0.3) {
  const arr = new Float32Array(count * 6)
  for (let i = 0; i < count; i++) {
    const y = (i + 1) * (height / (count + 1))
    arr[i * 6] = -halfWidth
    arr[i * 6 + 1] = y
    arr[i * 6 + 2] = 0
    arr[i * 6 + 3] = halfWidth
    arr[i * 6 + 4] = y
    arr[i * 6 + 5] = 0
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
  return g
}

/* ---------------- stages (each fades in/out via scale) ---------------- */

function TableQR({ p, reduced }) {
  const qr = useRef(null)
  const glow = useRef(null)

  useFrame((state) => {
    const pp = reduced ? 0.9 : p.current.value
    const time = state.clock.elapsedTime
    const fly = clamp01((pp - 0.16) / 0.16)
    if (qr.current) {
      const o = seg(pp, -0.2, 0.22, 0.06) * (1 - fly * 0.9)
      qr.current.scale.setScalar(Math.max(0.0001, o))
      qr.current.position.y = 0.14 + fly * 3
      qr.current.position.z = 0 - fly * 1.6
      qr.current.position.x = 0 + fly * 0.8
      qr.current.rotation.y = fly * Math.PI * 0.5
    }
    if (glow.current) {
      const o = seg(pp, -0.1, 0.28, 0.07)
      glow.current.scale.setScalar(1 + Math.sin(time * 3) * 0.18)
      glow.current.material.opacity = o * 0.7
    }
  })

  return (
    <group>
      <mesh position={[0, -1.05, 0]}>
        <cylinderGeometry args={[1.6, 1.45, 0.12, 28]} />
        <meshBasicMaterial color="#16161b" />
      </mesh>
      <mesh position={[0, -1.13, 0]}>
        <cylinderGeometry args={[1.45, 1.5, 0.08, 28]} />
        <meshBasicMaterial color="#111115" />
      </mesh>

      {/* QR tile */}
      <group ref={qr} position={[0, 0.14, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.55, 0.55]} />
          <meshBasicMaterial color="#e8e8ee" />
        </mesh>
        <gridHelper args={[0.46, 4, 0x121218, 0x121218]} position={[0, 0, 0.006]} />
        <mesh rotation={[0, 0, 0]}>
          <boxGeometry args={[0.14, 0.14, 0.02]} />
          <meshBasicMaterial color="#121218" />
        </mesh>
      </group>

      {/* QR floor glow */}
      <mesh ref={glow} position={[0, -0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.62, 32]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function MenuFan({ p, reduced }) {
  const group = useRef(null)
  const rows = useMemo(() => rowsGeometry(1.4, 5, 0.27), [])

  useFrame(() => {
    const pp = reduced ? 0.9 : p.current.value
    if (!group.current) return
    const fan = clamp01((pp - 0.12) / 0.1)
    const fly = clamp01((pp - 0.42) / 0.14)
    const o = seg(pp, 0.1, 0.46, 0.05) * (1 - fly)
    group.current.scale.setScalar(Math.max(0.0001, o))
    const yOff = fly * 1.2
    for (let i = 0; i < group.current.children.length; i++) {
      const card = group.current.children[i]
      card.position.y = yOff
      card.rotation.y = fan * 0.3 * (i - 1) + fly * 0.6
    }
  })

  return (
    <group ref={group} position={[1.95, -0.6, 0.15]}>
      <group position={[0, 0, 0]}>
        <mesh>
          <planeGeometry args={[0.64, 1.5]} />
          <meshBasicMaterial color="#14141a" />
        </mesh>
        <lineSegments geometry={rows} position={[0, 0, 0.01]}>
          <lineBasicMaterial color="#66667a" />
        </lineSegments>
        <mesh position={[0, 0.56, 0.01]}>
          <planeGeometry args={[0.3, 0.05]} />
          <meshBasicMaterial color="#8B5CF6" />
        </mesh>
      </group>
      <group position={[0.42, 0, 0]}>
        <mesh>
          <planeGeometry args={[0.64, 1.5]} />
          <meshBasicMaterial color="#16161c" />
        </mesh>
        <lineSegments geometry={rows} position={[0, 0, 0.01]}>
          <lineBasicMaterial color="#77778b" />
        </lineSegments>
      </group>
      <group position={[-0.42, 0.05, 0]}>
        <mesh>
          <planeGeometry args={[0.64, 1.5]} />
          <meshBasicMaterial color="#121218" />
        </mesh>
        <lineSegments geometry={rows} position={[0, 0, 0.01]}>
          <lineBasicMaterial color="#5a5a6e" />
        </lineSegments>
      </group>
    </group>
  )
}

function CartTicket({ p, reduced }) {
  const group = useRef(null)
  const rows = useMemo(() => rowsGeometry(1.1, 4, 0.4), [])

  useFrame(() => {
    const pp = reduced ? 0.9 : p.current.value
    if (!group.current) return
    const drop = clamp01((pp - 0.6) / 0.12)
    const o = seg(pp, 0.28, 0.66, 0.06) * (1 - drop)
    group.current.scale.setScalar(Math.max(0.0001, o))
    group.current.position.x = -2.2 + drop * 0.6
    group.current.position.y = -0.5 - drop * 1.5
    group.current.rotation.z = drop * -0.5
  })

  return (
    <group ref={group} position={[-2.2, -0.5, 0.35]} rotation={[0, 0.35, 0]}>
      <mesh>
        <planeGeometry args={[1.6, 1.4]} />
        <meshBasicMaterial color="#1b1b22" />
      </mesh>
      <lineSegments geometry={rows} position={[0, 0.05, 0.01]}>
        <lineBasicMaterial color="#8B5CF6" />
      </lineSegments>
      <mesh position={[0, -0.5, 0.01]}>
        <planeGeometry args={[1, 0.09]} />
        <meshBasicMaterial color="#8B5CF6" />
      </mesh>
    </group>
  )
}

function StatusChain({ p, reduced }) {
  const group = useRef(null)
  const chip = useRef(null)
  const beads = useRef([])

  useFrame((state) => {
    const pp = reduced ? 0.9 : p.current.value
    const time = state.clock.elapsedTime
    const o = seg(pp, 0.5, 0.9, 0.05)
    if (group.current) {
      group.current.scale.setScalar(Math.max(0.0001, o))
    }
    const c = clamp01((pp - 0.55) / 0.3)
    if (chip.current) {
      chip.current.position.x = -1.5 + c * 3
    }
    beads.current.forEach((b, i) => {
      if (!b) return
      const on = i === 0 ? c > 0 : i === 1 ? c > 0.4 : c > 0.8
      const pulse = on ? 1 + Math.sin(time * 4 + i * 2) * 0.16 : 1
      b.scale.setScalar(pulse * (on ? 1 : 0.8))
      if (b.material) b.material.color.set(on ? '#8B5CF6' : '#3a3a44')
      if (b.material) b.material.opacity = on ? 0.9 : 0.25
    })
  })

  return (
    <group ref={group} position={[0, 0.9, -0.25]}>
      <lineSegments geometry={useMemo(() => lineGeomFrom([[-1.5, 0, 0], [0, 0, 0], [1.5, 0, 0]]), [])}>
        <lineBasicMaterial color="#4a4a58" />
      </lineSegments>
      {['K', 'C', 'D'].map((l, i) => (
        <group key={l} position={[-1.5 + i * 1.5, 0, 0]}>
          <mesh
            ref={(el) => (beads.current[i] = el)}
          >
            <sphereGeometry args={[0.1, 14, 14]} />
            <meshBasicMaterial color="#3a3a44" transparent opacity={0.25} />
          </mesh>
        </group>
      ))}
      <group ref={chip} position={[-1.5, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.18, 0.07, 0.05]} />
          <meshBasicMaterial color="#c4b5fd" />
        </mesh>
      </group>
    </group>
  )
}

function AdminPanel({ p, reduced }) {
  const group = useRef(null)
  const rows = useMemo(() => rowsGeometry(1.7, 7, 0.75), [])

  useFrame(() => {
    const pp = reduced ? 0.9 : p.current.value
    if (!group.current) return
    const o = seg(pp, 0.7, 1.12, 0.06)
    group.current.scale.setScalar(Math.max(0.0001, o))
    group.current.position.z = -1.3 + (1 - o) * 0.9
    group.current.position.x = -3.6 + o * 0.5
    group.current.rotation.y = (1 - o) * 0.6
  })

  return (
    <group ref={group} position={[-3.6, 0.5, -1.3]} rotation={[0.05, 0.4, 0]}>
      <mesh>
        <planeGeometry args={[2.4, 1.9]} />
        <meshBasicMaterial color="#101016" />
      </mesh>
      <lineSegments geometry={rows}>
        <lineBasicMaterial color="#6a6a80" />
      </lineSegments>
      <mesh position={[0, 0.78, 0.01]}>
        <planeGeometry args={[1.1, 0.12]} />
        <meshBasicMaterial color="#8B5CF6" />
      </mesh>
    </group>
  )
}

function Rig({ progressRef, reducedMotion, children }) {
  const rig = useRef(null)

  useFrame((state) => {
    if (!rig.current || reducedMotion) return
    const pp = progressRef.current ? progressRef.current.value : 0
    rig.current.rotation.y = pp * 0.75 + Math.sin(state.clock.elapsedTime * 0.1) * 0.01
    rig.current.rotation.x = (pp - 0.5) * 0.04
  })

  return <group ref={rig}>{children}</group>
}

/**
 * Scene 04a — RestroOrder workflow world.
 * A procedurally staged restaurant ordering system: table + QR → menu →
 * cart/order → real-time status chain → kitchen/admin panel. Stage travel is
 * driven by horizontal page progress (progressRef 0→1).
 */
export default function RestroScene({ progressRef, quality = 'high', reducedMotion = false }) {
  const isMobile = quality === 'low'

  return (
    <Canvas
      dpr={[1, isMobile ? 1.4 : 1.7]}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.35, 7.4], fov: 46 }}
      frameloop={reducedMotion ? 'demand' : 'always'}
      style={{ pointerEvents: 'none' }}
    >
      <Rig progressRef={progressRef} reducedMotion={reducedMotion} isMobile={isMobile}>
        <TableQR p={progressRef} reduced={reducedMotion} />
        {!isMobile && <MenuFan p={progressRef} reduced={reducedMotion} />}
        {!isMobile && <CartTicket p={progressRef} reduced={reducedMotion} />}
        {!isMobile && <StatusChain p={progressRef} reduced={reducedMotion} />}
        {!isMobile && <AdminPanel p={progressRef} reduced={reducedMotion} />}
      </Rig>
    </Canvas>
  )
}