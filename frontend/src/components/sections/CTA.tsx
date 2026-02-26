'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-eco-glow/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-12 text-center glow-border"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-eco-glow/10 border border-eco-glow/30 mb-6">
            <Sparkles className="w-4 h-4 text-eco-glow" />
            <span className="text-sm text-eco-glow">Join the Movement</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Ready to Make a <span className="gradient-text">Difference</span>?
          </h2>

          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
            Start your journey towards a sustainable future. Upload your first item and see the impact you can create.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/vision">
              <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Get Started Free
              </Button>
            </Link>
            <Link href="https://terrasync.up.railway.app/docs" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="ghost">
                View Documentation
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
