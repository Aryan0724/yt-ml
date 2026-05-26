"use client"

import React, { useEffect, useRef } from "react"

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Handle resize
    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    // Particle class
    class NodeParticle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string

      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        // Very slow drifting speed for a premium, non-distracting effect
        this.vx = (Math.random() - 0.5) * 0.2
        this.vy = (Math.random() - 0.5) * 0.2
        this.radius = Math.random() * 1.75 + 0.75
        this.color = Math.random() > 0.4 ? "rgba(255, 0, 0, 0.45)" : "rgba(255, 255, 255, 0.2)"
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        // Wrap around boundaries
        if (this.x < 0) this.x = width
        if (this.x > width) this.x = 0
        if (this.y < 0) this.y = height
        if (this.y > height) this.y = 0
      }

      draw(context: CanvasRenderingContext2D) {
        context.fillStyle = this.color
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill()
      }
    }

    // Initialize particles
    const particleCount = Math.min(80, Math.floor((width * height) / 18000))
    const particles: NodeParticle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push(new NodeParticle())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw connections
      ctx.lineWidth = 0.75
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        p1.update()
        p1.draw(ctx)

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          // Connect close particles with fading lines
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.25
            ctx.strokeStyle = `rgba(255, 0, 0, ${alpha})`
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none bg-zinc-950">
      {/* 3D cybernetic layout grid */}
      <div 
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px"
        }}
      />

      {/* Floating Ambient Glow Orbs */}
      <div className="absolute top-[10%] left-[-10%] w-[550px] h-[550px] rounded-full bg-red-600/20 blur-[130px] animate-float-slow will-change-transform" />
      <div className="absolute top-[40%] right-[-15%] w-[650px] h-[650px] rounded-full bg-red-500/10 blur-[140px] animate-float-delayed will-change-transform" />
      <div className="absolute bottom-[15%] left-[5%] w-[500px] h-[500px] rounded-full bg-white/5 blur-[125px] animate-float-slow will-change-transform" />

      {/* Live drifting intelligence nodes network canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full opacity-80 mix-blend-screen"
      />

      {/* Extra glow animations styling */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(45px, -65px) scale(1.08); }
        }
        @keyframes floatDelayed {
          0%, 100% { transform: translate(0px, 0px) scale(1.05); }
          50% { transform: translate(-55px, 45px) scale(0.95); }
        }
        .animate-float-slow {
          animation: floatSlow 26s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: floatDelayed 30s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
