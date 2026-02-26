'use client'

import { motion } from 'framer-motion'

export default function CookiesPage() {
  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-eco-card/50 backdrop-blur-xl rounded-2xl p-8 border border-eco-border"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Cookie Policy</h1>
          <div className="text-white/60 space-y-4">
            <p>
              TerraSync uses cookies and similar technologies to enhance your experience on our platform.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6 mb-3">What Are Cookies</h2>
            <p>
              Cookies are small text files stored on your device that help us provide and improve our services.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6 mb-3">How We Use Cookies</h2>
            <p>
              We use cookies to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Remember your preferences</li>
              <li>Analyze platform usage</li>
              <li>Provide personalized features</li>
              <li>Ensure security and fraud prevention</li>
            </ul>
            <h2 className="text-xl font-semibold text-white mt-6 mb-3">Cookie Types</h2>
            <p>
              <strong>Essential Cookies:</strong> Required for basic platform functionality<br/>
              <strong>Analytics Cookies:</strong> Help us understand how you use our services<br/>
              <strong>Functional Cookies:</strong> Remember your preferences and settings
            </p>
            <h2 className="text-xl font-semibold text-white mt-6 mb-3">Managing Cookies</h2>
            <p>
              You can control cookies through your browser settings. Note that disabling certain cookies may affect platform functionality.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6 mb-3">Third-Party Cookies</h2>
            <p>
              Some services on our platform may use third-party cookies. These are subject to the respective third-party's privacy policies.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6 mb-3">Updates</h2>
            <p>
              We may update this cookie policy periodically. Changes will be posted on this page.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6 mb-3">Contact Us</h2>
            <p>
              Questions about our Cookie Policy can be sent to hello@terrasync.app
            </p>
            <p className="text-sm mt-8">
              Last updated: February 2026
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
