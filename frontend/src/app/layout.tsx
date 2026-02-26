import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TerraSync | Circular Economy Orchestration Platform',
  description: 'Transform waste into value. AI-powered circular economy platform for sustainable resource management.',
  keywords: ['circular economy', 'sustainability', 'AI', 'recycling', 'eco-friendly', 'carbon credits'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-eco-dark earth-grid overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
