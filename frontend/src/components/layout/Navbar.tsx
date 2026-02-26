'use client'

import { motion } from 'framer-motion'
import { Leaf, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const navLinks = [
  { label: 'Vision Portal', href: '/vision' },
  { label: 'Impact Dashboard', href: '/impact' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'API', href: '/#api' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSmoothScroll = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else if (href.includes('#')) {
      const [path, hash] = href.split('#')
      if (window.location.pathname !== path) {
        router.push(path)
      }
      setTimeout(() => {
        const element = document.querySelector(`#${hash}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else {
      router.push(href)
    }
    setIsOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-eco-dark/90 backdrop-blur-xl border-b border-eco-border/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              className="p-2 rounded-xl bg-gradient-to-br from-eco-glow to-earth-500"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Leaf className="w-5 h-5 text-eco-dark" />
            </motion.div>
            <span className="text-xl font-display font-bold text-white group-hover:text-eco-glow transition-colors">
              Terra<span className="text-eco-glow">Sync</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.button
                key={link.label}
                onClick={() => handleSmoothScroll(link.href)}
                className="text-white/70 hover:text-eco-glow transition-all duration-300 text-sm font-medium relative group"
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-eco-glow group-hover:w-full transition-all duration-300"></span>
              </motion.button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/vision">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Button size="sm" className="bg-eco-glow hover:bg-eco-glow/90 text-eco-dark font-semibold">
                  Start Analyzing
                </Button>
              </motion.div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white/70 hover:text-eco-glow transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden py-4 border-t border-eco-border/50"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <motion.button
                  key={link.label}
                  onClick={() => handleSmoothScroll(link.href)}
                  className="text-white/70 hover:text-eco-glow transition-colors text-sm font-medium text-left"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {link.label}
                </motion.button>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-eco-border/50">
                <Link href="/vision" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-eco-glow hover:bg-eco-glow/90 text-eco-dark font-semibold" size="sm">
                    Start Analyzing
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
