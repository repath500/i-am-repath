import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Mesh, Group } from 'three'

function Gem() {
  const group = useRef<Group>(null)
  const spin = useRef(0.25)

  useFrame((_, delta) => {
    const node = group.current
    if (!node) return
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduce) spin.current += delta * 0.35
    node.rotation.y += (spin.current - node.rotation.y) * 0.08
    node.rotation.x += (0.18 - node.rotation.x) * 0.06
  })

  return (
    <group
      ref={group}
      onPointerMove={(event) => {
        spin.current = event.pointer.x * 1.2
      }}
    >
      <mesh scale={[0.78, 1.22, 0.78]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color="#f4fbff"
          roughness={0.04}
          metalness={0.05}
          transmission={0.94}
          thickness={1.5}
          ior={1.56}
          iridescence={1}
          iridescenceIOR={1.4}
          clearcoat={1}
          clearcoatRoughness={0.05}
          attenuationColor="#9ecbff"
          attenuationDistance={0.7}
          emissive="#1a2744"
          emissiveIntensity={0.25}
        />
      </mesh>
      <Sparkle position={[0.15, 0.72, 0.45]} />
    </group>
  )
}

function Sparkle({ position }: { position: [number, number, number] }) {
  const ref = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.scale.setScalar(0.7 + Math.sin(clock.elapsedTime * 3) * 0.25)
  })
  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.06, 0]} />
      <meshBasicMaterial color="#fff6d0" />
    </mesh>
  )
}

export default function Crystal() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.4], fov: 32 }}
      dpr={[1, 1.6]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.55} />
      <pointLight position={[2.2, 1.6, 2]} intensity={18} color="#ffd36b" />
      <pointLight position={[-2.1, -0.4, 1.4]} intensity={14} color="#6aa4ff" />
      <pointLight position={[0.2, -1.8, 1.6]} intensity={8} color="#ff7eb3" />
      <Gem />
    </Canvas>
  )
}
