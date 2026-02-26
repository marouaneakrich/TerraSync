import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { Stats } from '@/components/sections/Stats'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { CTA } from '@/components/sections/CTA'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <div id="features">
        <Features />
      </div>
      <div id="stats">
        <Stats />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="api">
        <CTA />
      </div>
      <Footer />
    </main>
  )
}
