"use client"

import { useEffect, useRef } from "react"

interface Bubble {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  state: "rising" | "condensing" | "drop"
  stateTime: number
  droplets: Droplet[]
  isPlinging: boolean
  plingSize: number
  plingOpacity: number
}

interface Droplet {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  lifeTime: number
}

export function BubbleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize Web Audio API context
  useEffect(() => {
    // Create audio context on first user interaction to comply with autoplay policies
    const handleInteraction = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      // Remove event listeners after initialization
      document.removeEventListener("click", handleInteraction)
      document.removeEventListener("touchstart", handleInteraction)
    }

    document.addEventListener("click", handleInteraction)
    document.addEventListener("touchstart", handleInteraction)

    return () => {
      document.removeEventListener("click", handleInteraction)
      document.removeEventListener("touchstart", handleInteraction)
      // Clean up audio context
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create bubbles
    const bubbles: Bubble[] = []
    const bubbleCount = Math.floor(window.innerWidth / 20) // More bubbles

    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push(createBubble(canvas.width, canvas.height))
    }

    // Helper function to create a new bubble
    function createBubble(width: number, height: number): Bubble {
      return {
        x: Math.random() * width,
        y: height + Math.random() * 100,
        size: Math.random() * 30 + 15,
        speedX: Math.random() * 0.7 - 0.35,
        speedY: -Math.random() * 0.8 - 0.7,
        opacity: Math.random() * 0.7 + 0.3,
        state: "rising",
        stateTime: 0,
        droplets: [],
        isPlinging: false,
        plingSize: 0,
        plingOpacity: 0,
      }
    }

    // Play pling sound (throttled to avoid too many sounds)
    let lastPlingTime = 0
    const playPling = () => {
      const now = Date.now()
      if (now - lastPlingTime > 100 && audioContextRef.current) {
        try {
          const oscillator = audioContextRef.current.createOscillator()
          const gainNode = audioContextRef.current.createGain()

          // Connect nodes
          oscillator.connect(gainNode)
          gainNode.connect(audioContextRef.current.destination)

          // Configure sound - more of a "splat" sound
          oscillator.type = "sine"
          oscillator.frequency.setValueAtTime(600, audioContextRef.current.currentTime) // Start higher
          oscillator.frequency.exponentialRampToValueAtTime(
            200,
            audioContextRef.current.currentTime + 0.2, // Drop down for a "splat" effect
          )

          // Configure volume envelope
          gainNode.gain.setValueAtTime(0.0001, audioContextRef.current.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.1, audioContextRef.current.currentTime + 0.01)
          gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContextRef.current.currentTime + 0.3)

          // Play and stop
          oscillator.start()
          oscillator.stop(audioContextRef.current.currentTime + 0.3)

          lastPlingTime = now
        } catch (error) {
          console.error("Error playing sound:", error)
        }
      }
    }

    // Animation loop
    let lastTime = 0
    const animate = (time: number) => {
      const deltaTime = time - lastTime
      lastTime = time

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create dark background
      ctx.fillStyle = "rgb(10, 10, 10)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw and update bubbles
      bubbles.forEach((bubble, index) => {
        // Update based on state
        if (bubble.state === "rising") {
          // Update position for rising bubbles
          bubble.x += bubble.speedX
          bubble.y += bubble.speedY

          // Check if bubble reached the top
          if (bubble.y <= bubble.size) {
            bubble.state = "condensing"
            bubble.stateTime = 0
            bubble.isPlinging = true
            bubble.plingSize = bubble.size * 1.5
            bubble.plingOpacity = 1
            bubble.y = bubble.size // Snap to top
            playPling()

            // Create initial droplets
            const dropletCount = Math.floor(bubble.size / 5) + 3
            for (let i = 0; i < dropletCount; i++) {
              bubble.droplets.push({
                x: bubble.x + (Math.random() - 0.5) * bubble.size * 0.5,
                y: bubble.size + Math.random() * 5,
                size: Math.random() * (bubble.size / 4) + bubble.size / 6,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: Math.random() * 0.2 + 0.1,
                opacity: bubble.opacity * 0.9,
                lifeTime: 0,
              })
            }
          }
        } else if (bubble.state === "condensing") {
          // Update condensing state
          bubble.stateTime += deltaTime

          // Shrink the bubble as it condenses
          const shrinkRate = 0.002 * deltaTime
          bubble.size = Math.max(0, bubble.size - shrinkRate * bubble.size)
          bubble.opacity = Math.max(0, bubble.opacity - 0.001 * deltaTime)

          // Update existing droplets
          bubble.droplets.forEach((droplet, i) => {
            // Apply gravity
            droplet.speedY += 0.001 * deltaTime
            droplet.x += droplet.speedX
            droplet.y += droplet.speedY
            droplet.lifeTime += deltaTime

            // Elongate droplets as they fall (teardrop shape)
            if (droplet.speedY > 0.5) {
              droplet.size *= 1.001
            }

            // Remove droplets that have fallen too far
            if (droplet.y > canvas.height || droplet.lifeTime > 10000) {
              bubble.droplets.splice(i, 1)
            }
          })

          // Add new droplets occasionally while condensing
          if (bubble.size > 5 && Math.random() < 0.05) {
            bubble.droplets.push({
              x: bubble.x + (Math.random() - 0.5) * bubble.size,
              y: bubble.size,
              size: Math.random() * (bubble.size / 4) + bubble.size / 8,
              speedX: (Math.random() - 0.5) * 0.3,
              speedY: Math.random() * 0.2 + 0.1,
              opacity: bubble.opacity * 0.8,
              lifeTime: 0,
            })
          }

          // When bubble is fully condensed, transition to drop state
          if (bubble.size < 2 || bubble.opacity <= 0.05) {
            bubble.state = "drop"
            bubble.stateTime = 0
          }
        } else if (bubble.state === "drop") {
          // Just manage the remaining droplets
          if (bubble.droplets.length === 0) {
            // Reset bubble when all droplets are gone
            bubbles[index] = createBubble(canvas.width, canvas.height)
          } else {
            // Update remaining droplets
            bubble.droplets.forEach((droplet, i) => {
              // Apply gravity
              droplet.speedY += 0.001 * deltaTime
              droplet.x += droplet.speedX
              droplet.y += droplet.speedY
              droplet.lifeTime += deltaTime

              // Remove droplets that have fallen too far
              if (droplet.y > canvas.height || droplet.lifeTime > 10000) {
                bubble.droplets.splice(i, 1)
              }
            })
          }
        }

        // Draw bubble if it's rising or condensing
        if (bubble.state !== "drop" && bubble.size > 0) {
          ctx.beginPath()
          ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2)

          // Create radial gradient for bubble - acid green colors
          const bubbleGradient = ctx.createRadialGradient(bubble.x, bubble.y, 0, bubble.x, bubble.y, bubble.size)
          bubbleGradient.addColorStop(0, `rgba(170, 255, 0, ${bubble.opacity})`) // Acid green
          bubbleGradient.addColorStop(0.7, `rgba(57, 255, 20, ${bubble.opacity * 0.8})`) // Bright green
          bubbleGradient.addColorStop(1, `rgba(0, 255, 68, ${bubble.opacity * 0.6})`) // Poisonous green

          ctx.fillStyle = bubbleGradient
          ctx.fill()

          // Add highlight
          if (bubble.size > 5) {
            ctx.beginPath()
            ctx.arc(bubble.x - bubble.size * 0.3, bubble.y - bubble.size * 0.3, bubble.size * 0.2, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity * 0.6})`
            ctx.fill()
          }
        }

        // Draw droplets
        bubble.droplets.forEach((droplet) => {
          // Draw teardrop shape for faster droplets
          if (droplet.speedY > 0.8) {
            // Draw teardrop shape
            ctx.beginPath()
            ctx.moveTo(droplet.x, droplet.y - droplet.size * 0.5)

            // Control points for teardrop shape
            const stretch = Math.min(2, droplet.speedY) * 0.5

            ctx.bezierCurveTo(
              droplet.x + droplet.size * 0.5,
              droplet.y - droplet.size * 0.3,
              droplet.x + droplet.size * 0.5,
              droplet.y + droplet.size * stretch,
              droplet.x,
              droplet.y + droplet.size * stretch,
            )

            ctx.bezierCurveTo(
              droplet.x - droplet.size * 0.5,
              droplet.y + droplet.size * stretch,
              droplet.x - droplet.size * 0.5,
              droplet.y - droplet.size * 0.3,
              droplet.x,
              droplet.y - droplet.size * 0.5,
            )
          } else {
            // Draw circle for slower droplets
            ctx.beginPath()
            ctx.arc(droplet.x, droplet.y, droplet.size, 0, Math.PI * 2)
          }

          // Create gradient for droplet
          const dropletGradient = ctx.createRadialGradient(droplet.x, droplet.y, 0, droplet.x, droplet.y, droplet.size)
          dropletGradient.addColorStop(0, `rgba(170, 255, 0, ${droplet.opacity})`)
          dropletGradient.addColorStop(0.7, `rgba(57, 255, 20, ${droplet.opacity * 0.8})`)
          dropletGradient.addColorStop(1, `rgba(0, 255, 68, ${droplet.opacity * 0.6})`)

          ctx.fillStyle = dropletGradient
          ctx.fill()

          // Add small highlight to droplet
          if (droplet.size > 3) {
            ctx.beginPath()
            ctx.arc(droplet.x - droplet.size * 0.2, droplet.y - droplet.size * 0.2, droplet.size * 0.15, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255, 255, 255, ${droplet.opacity * 0.5})`
            ctx.fill()
          }
        })

        // Draw pling effect
        if (bubble.isPlinging) {
          ctx.beginPath()
          ctx.arc(bubble.x, bubble.y, bubble.plingSize, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(170, 255, 0, ${bubble.plingOpacity})`
          ctx.lineWidth = 2
          ctx.stroke()

          // Update pling effect
          bubble.plingSize += 1
          bubble.plingOpacity -= 0.05

          if (bubble.plingOpacity <= 0) {
            bubble.isPlinging = false
          }
        }

        // Reset bubble if it goes off screen (sides or bottom) while rising
        if (
          bubble.state === "rising" &&
          (bubble.y > canvas.height + bubble.size ||
            bubble.x < -bubble.size * 2 ||
            bubble.x > canvas.width + bubble.size * 2)
        ) {
          bubbles[index] = createBubble(canvas.width, canvas.height)
        }
      })

      requestAnimationFrame(animate)
    }

    animate(0)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" style={{ pointerEvents: "none" }} />
  )
}

