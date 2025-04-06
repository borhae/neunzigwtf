import { BubbleBackground } from "@/components/bubble-background"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <BubbleBackground />

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <h1 className="text-6xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#aaff00] to-[#39ff14] animate-pulse">
          neunzig<span className="text-[#00ff44]">.</span>wtf
        </h1>
      </div>
    </div>
  )
}

