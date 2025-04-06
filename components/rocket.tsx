'use client'
import { useEffect, useRef, useState } from 'react'
import RocketPath from '@/components/RocketPath'

// A helper function to generate keyframes dynamically.
// `deltaX` and `deltaY` are the total movements (end - start).
// `config` lets you specify at what percentage the slowdown starts and ends,
// plus an optional mid-flight offset to simulate slowing down.
function generateKeyframes(
    deltaX: number,
    deltaY: number,
    config: { slowStart: number; slowEnd: number; midOffset: number }
  ): string {
    return `
      @keyframes fly-rocket {
        0% {
          transform: translateX(-50%) translate(0, 0);
          opacity: 1;
        }
        ${config.slowStart}% {
          transform: translateX(-50%) translate(${deltaX * (config.slowStart / 100)}px, ${deltaY * (config.slowStart / 100)}px);
          opacity: 1;
        }
        ${config.slowEnd}% {
          transform: translateX(-50%) translate(${deltaX * (config.slowEnd / 100)}px, ${deltaY * (config.slowEnd / 100) + config.midOffset}px);
          opacity: 1;
        }
        100% {
          transform: translateX(-50%) translate(${deltaX}px, ${deltaY}px);
          opacity: 1;
        }
      }
    `;
  }
  

export default function Rocket() {
    const rocketRef = useRef<HTMLDivElement>(null)
    const [initialStyle, setInitialStyle] = useState({})

    useEffect(() => {
        // Calculate the viewport dimensions
        const vw = window.innerWidth
        const vh = window.innerHeight

        // For a bottom-center to top-center launch, we use these:
        const startX = vw / 2
        const startY = vh
        const endX = vw / 2
        const endY = 0

        // Calculate the deltas relative to the starting point
        const deltaX = endX - startX  // should be 0 since both are centered horizontally
        const deltaY = endY - startY

        // Set the initial absolute position of the rocket.
        // Notice that we no longer include a transform here.
        setInitialStyle({
            position: 'absolute',
            left: `${startX}px`,
            top: `${startY}px`,
            // The animation property will be handled by the dynamically generated keyframes
            animation: 'fly-rocket 4s ease-in forwards',
        })

        // Create dynamic keyframes including the horizontal centering offset.
        // This ensures that the rocket's horizontal offset (translateX(-50%))
        // is applied throughout the animation.
        const styleEl = document.createElement('style')
        const config = { slowStart: 40, slowEnd: 60, midOffset: -20 }
        const keyframes = generateKeyframes(deltaX, deltaY, config)
       styleEl.innerHTML = keyframes
 
         document.head.appendChild(styleEl)

        // Clean up the dynamic style element when the component unmounts.
        return () => {
            document.head.removeChild(styleEl)
        }
    }, [])

    return (
        // This outer div gets the initialStyle with the absolute position and animation.
        <div ref={rocketRef} className="z-50 animate-flash" style={initialStyle}>
            {/* The inner container that scales, rotates, and holds the SVG */}
            <div className="relative scale-[10] origin-center rotate-[-45deg] w-[32px]">
                <svg
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="url(#rainbowGradient)"
                    stroke="white"
                    strokeWidth="1"
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
                    {/* Import the SVG paths from the separate component */}
                    <RocketPath />
                    {/* SVG Text inside the rocket */}
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
                </svg>
            </div>
        </div>
    )
}
