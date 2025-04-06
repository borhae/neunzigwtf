'use client'

import { useEffect, useState } from 'react'
import { BubbleBackground } from '@/components/bubble-background'
import Rocket from '@/components/rocket'
import ThreeDText from '@/components/ThreeDText'

export default function Home() {
  // "regular": stable text; "rocket": shows the Rocket component;
  // "wild": shows one of three wild effects.
  const [displayState, setDisplayState] = useState("regular")
  // For wild state, we'll choose one of three variants.
  const [wildVariant, setWildVariant] = useState("wild1")

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly decide to show rocket or wild state.
      const newState = Math.random() < 0.5 ? "rocket" : "wild"
      if (newState === "wild") {
        // Choose one wild variant randomly: wild1, wild2, or wild3.
        const variants = ["wild1", "wild2", "wild3"]
        const chosen = variants[Math.floor(Math.random() * variants.length)]
        setWildVariant(chosen)
      }
      setDisplayState(newState)
      // After 6 seconds, revert back to regular state.
      setTimeout(() => setDisplayState("regular"), 6000)
    }, Math.random() * 10000 + 5000) // Between 5 and 15 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <BubbleBackground />

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        {displayState === "rocket" ? (
          <Rocket />
        ) : displayState === "wild" ? (
          <>
            {wildVariant === "wild1" && (
              // Wild Variant 1: Spinning effect.
              <h1 className="text-6xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-spin">
                neunzig<span className="text-white">.</span>wtf
              </h1>
            )}
            {wildVariant === "wild2" && (
              // Wild Variant 2: 3D rotating text.
              <ThreeDText />
            )}
            {wildVariant === "wild3" && (
              // Wild Variant 3: Explosion effect.
              <h1 className="text-6xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 animate-explode">
                neunzig<span className="text-white">.</span>wtf
              </h1>
            )}
          </>
        ) : (
          // Regular state: stable (non-animated) text.
          <h1 className="text-6xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#aaff00] to-[#39ff14]">
            neunzig<span className="text-[#00ff44]">.</span>wtf
          </h1>
        )}
      </div>
    </div>
  )
}
