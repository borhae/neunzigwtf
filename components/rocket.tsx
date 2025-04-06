'use client'
import { useEffect, useRef, useState } from 'react'
import RocketPath from '@/components/RocketPath'

export default function Rocket() {
    const rocketRef = useRef<HTMLDivElement>(null)
    const [style, setStyle] = useState({})

    useEffect(() => {
        const angle = -60 - Math.random() * 60 // -60° to -120°
        const horizontalShift = (Math.random() - 0.5) * 100 // -50 to +50 px

        setStyle({
            animation: `launch 6s ease-in forwards`, // slower animation
        })
    }, [])

    return (
        <div
            ref={rocketRef}
            className="absolute bottom-0 right-0 z-50 animate-flash"
            style={style}
        >
            <div className="scale-[3] origin-bottom text-center rotate-[-45deg]  w-[128px]">
                <svg
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="url(#rainbowGradient)"
                    stroke="white"               // ← changed from "black" to "white"
                    strokeWidth="0.5"            // tweak this higher if you need more definition
                >
                    <defs>
                        <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="red" />
                            <stop offset="16%" stopColor="orange" />
                            <stop offset="32%" stopColor="yellow" />
                            <stop offset="48%" stopColor="green" />
                            <stop offset="64%" stopColor="blue" />
                            <stop offset="80%" stopColor="indigo" />
                            <stop offset="100%" stopColor="violet" />
                        </linearGradient>
                        <linearGradient id="rainbowGradientText" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="red" />
                            <stop offset="16%" stopColor="orange" />
                            <stop offset="32%" stopColor="yellow" />
                            <stop offset="48%" stopColor="green" />
                            <stop offset="64%" stopColor="blue" />
                            <stop offset="80%" stopColor="indigo" />
                            <stop offset="100%" stopColor="violet" />
                        </linearGradient>
                    </defs>
                    <RocketPath />
                    <g id="rocket-text">
                        <text
                            x="35"
                            y="32"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            fontSize="6"
                            fontWeight="bold"
                            fill="url(#rainbowGradientText)"
                        >
                            06.09.2025
                        </text>
                    </g>
                </svg>
            </div>
        </div>
    )
}
