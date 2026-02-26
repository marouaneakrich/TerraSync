'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Recycle, Sparkles, Globe2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function Hero() {
  const [particles, setParticles] = useState<Array<{ left: number; top: number; duration: number; delay: number; x: number }>>([])
  
  useEffect(() => {
    // Generate random particles only on client to avoid hydration mismatch
    setParticles(
      [...Array(20)].map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 5 + Math.random() * 5,
        delay: Math.random() * 5,
        x: Math.random() * 20 - 10,
      }))
    )
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-eco-glow/10 via-transparent to-transparent"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-radial from-ocean-500/10 via-transparent to-transparent"
        />
      </div>

      {/* Floating particles */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 100 }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            y: [-20, -100],
            x: particle.x,
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
          className="absolute w-1 h-1 bg-eco-glow/30 rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-eco-card/80 border border-eco-border mb-8"
        >
          <Sparkles className="w-4 h-4 text-eco-glow" />
          <span className="text-sm text-white/80">AI-Powered Circular Economy</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-6"
        >
          <span className="block text-white">Transform Waste Into</span>
          <span className="block gradient-text glow-text">Sustainable Value</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-10"
        >
          TerraSync uses AI vision to analyze items, calculate their circular value,
          and orchestrate sustainable reuse pathways—all while earning you eco-credits.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/vision">
            <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Start Analyzing
            </Button>
          </Link>
          <Link href="/impact">
            <Button size="lg" variant="secondary" icon={<Globe2 className="w-5 h-5" />}>
              View Impact Dashboard
            </Button>
          </Link>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {[
            { icon: Leaf, label: 'Carbon Tracking' },
            { icon: Recycle, label: 'Smart Recycling' },
            { icon: Sparkles, label: 'AI Vision Analysis' },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70"
            >
              <feature.icon className="w-4 h-4 text-eco-glow" />
              <span className="text-sm">{feature.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-eco-glow rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
