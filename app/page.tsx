'use client'

import { useEffect, useState } from 'react'
import { BubbleBackground } from '@/components/bubble-background'
import Rocket from '@/components/rocket'

export default function Home() {
  const [showRocket, setShowRocket] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowRocket(true)

      // Hide rocket after 6 seconds
      setTimeout(() => setShowRocket(false), 6000)
    }, Math.random() * 10000 + 5000) // Between 5 and 15 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <BubbleBackground />

      <div className="relative z-10 flex items-center justify-center min-h-screen">
      {showRocket && <Rocket />}
          <h1 className="text-3xl md:text-6xl xl:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#aaff00] to-[#39ff14] animate-pulse">
            neunzig.wtf
          </h1>
      </div>
    </div>
  )
}
