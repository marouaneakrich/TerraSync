'use client'

import { motion } from 'framer-motion'

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-eco-card/50 backdrop-blur-xl rounded-2xl p-8 border border-eco-border"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
          <div className="text-white/60 space-y-4">
            <p>
              Welcome to TerraSync. These Terms of Service govern your use of our platform and services.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6 mb-3">Services</h2>
            <p>
              TerraSync provides AI-powered circular economy services including item analysis and trade orchestration.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6 mb-3">User Responsibilities</h2>
            <p>
              You are responsible for the accuracy of information you provide and for using our services in compliance with applicable laws.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6 mb-3">Intellectual Property</h2>
            <p>
              Our platform and services are protected by intellectual property laws. You may not use our content without permission.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6 mb-3">Limitation of Liability</h2>
            <p>
              TerraSync is provided "as is" without warranties. We are not liable for damages arising from your use of our services.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6 mb-3">Changes to Terms</h2>
            <p>
              We may update these terms periodically. Continued use of our services constitutes acceptance of any changes.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6 mb-3">Contact Us</h2>
            <p>
              Questions about these Terms of Service can be sent to hello@terrasync.app
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
