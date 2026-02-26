'use client'

import { motion } from 'framer-motion'
import { Camera, Bot, BarChart3, Leaf, Recycle, Coins } from 'lucide-react'
import { GlowCard } from '@/components/ui/GlowCard'
import Link from 'next/link'

const features = [
  {
    icon: Camera,
    title: 'AI Vision Portal',
    description: 'Upload photos of items and let our AI analyze, categorize, and determine the best circular economy path.',
    gradient: 'from-eco-glow to-earth-500',
    href: '/vision',
  },
  {
    icon: Bot,
    title: 'Agentic Negotiation',
    description: 'AI agents negotiate with NGOs and recycling centers on your behalf to maximize value recovery.',
    gradient: 'from-ocean-400 to-ocean-600',
    href: '/vision',
  },
  {
    icon: BarChart3,
    title: 'Impact Dashboard',
    description: 'Real-time visualization of your environmental impact: carbon sequestered, waste diverted, eco-credits earned.',
    gradient: 'from-earth-400 to-eco-glow',
    href: '/impact',
  },
  {
    icon: Leaf,
    title: 'Carbon Tracking',
    description: 'Precise measurement of carbon footprint reduction for every item processed through the platform.',
    gradient: 'from-earth-500 to-earth-700',
    href: '/impact',
  },
  {
    icon: Recycle,
    title: 'Smart Routing',
    description: 'Intelligent matching algorithms connect items to optimal recycling or reuse destinations.',
    gradient: 'from-ocean-500 to-ocean-700',
    href: '/vision',
  },
  {
    icon: Coins,
    title: 'Eco-Credits',
    description: 'Earn tradable eco-credits for sustainable actions, redeemable for rewards or carbon offsets.',
    gradient: 'from-eco-glow to-ocean-500',
    href: '/impact',
  },
]

export function Features() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Built for the <span className="gradient-text">Circular Future</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Every feature designed to maximize environmental impact while minimizing effort.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link key={index} href={feature.href} className="block">
              <GlowCard delay={index * 0.1} className="h-full cursor-pointer hover:scale-[1.02] transition-transform">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </GlowCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
