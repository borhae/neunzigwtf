'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { useRef } from 'react'

// This component uses useFrame to rotate the text.
function RotatingText() {
  const textRef = useRef<any>()
  useFrame((state, delta) => {
    if (textRef.current) {
      textRef.current.rotation.y += delta * 0.5
    }
  })
  return (
    <Text
      ref={textRef}
      position={[0, 0, 0]}
      fontSize={2}
      color="hotpink"
      anchorX="center"
      anchorY="middle"
    >
      neunzig.wtf
    </Text>
  )
}

// This component wraps the rotating text in a Canvas.
export default function ThreeDText() {
  return (
    <Canvas style={{ height: '100vh', width: '100vw' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <RotatingText />
    </Canvas>
  )
}
