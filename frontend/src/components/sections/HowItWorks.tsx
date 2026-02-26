'use client'

import { motion } from 'framer-motion'
import { Upload, Scan, Bot, Trophy } from 'lucide-react'
import Link from 'next/link'

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload Item Photo',
    description: 'Snap a photo of any item—electronics, furniture, scrap—and upload it to the AI Vision Portal.',
    href: '/vision',
  },
  {
    icon: Scan,
    step: '02',
    title: 'AI Analysis',
    description: 'Our vision AI categorizes the item, estimates its circular value, and identifies optimal reuse paths.',
    href: '/vision',
  },
  {
    icon: Bot,
    step: '03',
    title: 'Agent Negotiation',
    description: 'AI agents negotiate with NGOs and recycling centers to find the best destination for your item.',
    href: '/vision',
  },
  {
    icon: Trophy,
    step: '04',
    title: 'Earn & Impact',
    description: 'Receive eco-credits, track your carbon impact, and contribute to a sustainable circular economy.',
    href: '/impact',
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            How <span className="gradient-text">TerraSync</span> Works
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Four simple steps to transform waste into sustainable value.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-eco-border to-transparent hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <Link href={step.href} className="block">
                  <div className="glass-card p-6 text-center relative z-10 hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-eco-dark px-3">
                      <span className="text-eco-glow font-display font-bold text-sm">{step.step}</span>
                    </div>
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-eco-glow/20 to-ocean-500/20 border border-eco-glow/30 mb-4 mt-2">
                      <step.icon className="w-8 h-8 text-eco-glow" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-white/60 text-sm">{step.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
