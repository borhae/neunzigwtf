'use client'
import { useEffect, useRef, useState } from 'react'
import RocketPath from '@/components/RocketPath'

export default function Rocket() {
  const rocketRef = useRef<HTMLDivElement>(null)
  const [initialStyle, setInitialStyle] = useState({})
  const [innerRotation, setInnerRotation] = useState(0)
  

  useEffect(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight

    // Define possible edges
    const edges = ['top', 'bottom', 'left', 'right']
    // Pick a random start edge
    const startEdge = edges[Math.floor(Math.random() * edges.length)]
    // Determine the opposite edge for the destination:
    let endEdge = ''
    if (startEdge === 'top') endEdge = 'bottom'
    else if (startEdge === 'bottom') endEdge = 'top'
    else if (startEdge === 'left') endEdge = 'right'
    else if (startEdge === 'right') endEdge = 'left'

    // Determine random start coordinates along the chosen edge
    let startX = 0, startY = 0
    if (startEdge === 'top') {
      startX = Math.random() * vw
      startY = 0
    } else if (startEdge === 'bottom') {
      startX = Math.random() * vw
      startY = vh
    } else if (startEdge === 'left') {
      startX = 0
      startY = Math.random() * vh
    } else if (startEdge === 'right') {
      startX = vw
      startY = Math.random() * vh
    }

    // Determine random end coordinates along the opposite edge
    let endX = 0, endY = 0
    if (endEdge === 'top') {
      endX = Math.random() * vw
      endY = 0
    } else if (endEdge === 'bottom') {
      endX = Math.random() * vw
      endY = vh
    } else if (endEdge === 'left') {
      endX = 0
      endY = Math.random() * vh
    } else if (endEdge === 'right') {
      endX = vw
      endY = Math.random() * vh
    }

    // Calculate the total movement (deltas)
    const deltaX = endX - startX
    const deltaY = endY - startY

    // We want (startX, startY) to be the center of the rocket.
    setInitialStyle({
      position: 'absolute',
      left: `${startX}px`,
      top: `${startY}px`,
      transform: 'translate(-50%, -50%)',
      animation: 'fly-rocket 6s ease-in forwards',
    })

    // Calculate flight angle in radians and then convert to degrees.
    // Math.atan2(deltaY, deltaX) returns the angle relative to the positive x-axis.
    const flightAngleRad = Math.atan2(deltaY, deltaX)
    const flightAngleDeg = flightAngleRad * (180 / Math.PI)
    // Your SVG is drawn rotated 45° clockwise by default,
    // so subtract 45° to get the correct final rotation.
    setInnerRotation(flightAngleDeg + 45)

    // Generate dynamic keyframes (with slowdown between 40% and 60% of flight)
    const keyframes = `
      @keyframes fly-rocket {
        0% {
          transform: translate(-50%, -50%) translate(0, 0);
          opacity: 1;
        }
        40% {
          transform: translate(-50%, -50%) translate(${deltaX * 0.4}px, ${deltaY * 0.4}px);
          opacity: 1;
        }
        60% {
          transform: translate(-50%, -50%) translate(${deltaX * 0.6}px, ${deltaY * 0.6}px);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) translate(${deltaX}px, ${deltaY}px);
          opacity: 1;
        }
      }
    `
    const styleEl = document.createElement('style')
    styleEl.innerHTML = keyframes
    document.head.appendChild(styleEl)

    return () => {
      document.head.removeChild(styleEl)
    }
  }, [])

  return (
    <div ref={rocketRef} className="z-50 animate-flash" style={initialStyle}>
        <a href="https://onk.style/s/9yeK7WEimtkjp8m">
        {/* 
            The inner container scales the rocket and applies the computed rotation so that it points along its flight path.
            We remove the hard-coded rotate-[-45deg] class and instead apply the rotation via inline style.
        */}
        <div className="group relative origin-center w-[200px] md:w-[300px] lg:w-[400px] xl:w-[500px]" style={{ transform: `rotate(${innerRotation}deg) scale(1)` }}>
            <svg
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_#39ff14] group-hover:scale-110"
            fill="url(#rainbowGradient)"
            stroke="white"
            strokeWidth="0.5"
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
            {/* The SVG path data is provided by the RocketPath component */}
            <RocketPath />
            {/* SVG Text inside the rocket */}
            <text
                x="35"
                y="32"
                textAnchor="middle"
                alignmentBaseline="middle"
                fontFamily='Orbitron'
                fontSize="4"
                fontWeight="bold"
                fill="url(#rainbowGradientText)"
                strokeWidth="0.1"
            >
                06.09.2025
            </text>
            </svg>
        </div>
        </a>
    </div>
  )
}
