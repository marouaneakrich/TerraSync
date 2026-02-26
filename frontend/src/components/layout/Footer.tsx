'use client'

import { Leaf, Github, Linkedin } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const footerLinks = {
  product: [
    { label: 'Vision Portal', href: '/vision' },
    { label: 'Impact Dashboard', href: '/impact' },
    { label: 'API', href: '/#api' },
    { label: 'Documentation', href: 'https://terrasync.up.railway.app/docs' },
  ],
  company: [
    { label: 'About', href: '/#about' },
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Contact', href: 'mailto:hello@terrasync.app' },
  ],
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
}

export function Footer() {
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
  }

  return (
    <footer className="border-t border-eco-border/50 bg-eco-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-eco-glow to-earth-500 group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 text-eco-dark flex-shrink-0" />
              </div>
              <span className="text-xl font-display font-bold text-white group-hover:text-eco-glow transition-colors">
                Terra<span className="text-eco-glow">Sync</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm mb-4">
              Transforming waste into sustainable value through AI-powered circular economy orchestration.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/marouaneakrich/TerraSync" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-eco-glow transition-all duration-300 hover:scale-110">
                <Github className="w-5 h-5 flex-shrink-0" />
              </a>
              <a href="https://linkedin.com/company/terrasync" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-eco-glow transition-all duration-300 hover:scale-110">
                <Linkedin className="w-5 h-5 flex-shrink-0" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('http') ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-eco-glow text-sm transition-all duration-300 hover:translate-x-1 inline-block">
                      {link.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => handleSmoothScroll(link.href)}
                      className="text-white/50 hover:text-eco-glow text-sm transition-all duration-300 hover:translate-x-1 inline-block text-left"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('mailto') || link.href.startsWith('http') ? (
                    <a href={link.href} className="text-white/50 hover:text-eco-glow text-sm transition-all duration-300 hover:translate-x-1 inline-block">
                      {link.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => handleSmoothScroll(link.href)}
                      className="text-white/50 hover:text-eco-glow text-sm transition-all duration-300 hover:translate-x-1 inline-block text-left"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleSmoothScroll(link.href)}
                    className="text-white/50 hover:text-eco-glow text-sm transition-all duration-300 hover:translate-x-1 inline-block text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-eco-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © 2026 TerraSync. All rights reserved.
          </p>
          <p className="text-white/40 text-sm">
            Built by Marouane Akrich
          </p>
        </div>
      </div>
    </footer>
  )
}
