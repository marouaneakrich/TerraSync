'use client'

import { motion } from 'framer-motion'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-eco-card/50 backdrop-blur-xl rounded-2xl p-8 border border-eco-border"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
          <div className="text-white/60 space-y-4">
            <p>
              TerraSync is committed to protecting your privacy. This policy explains how we collect, use, and protect your information.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6 mb-3">Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you use our AI Vision Portal or contact us for support.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6 mb-3">How We Use Your Information</h2>
            <p>
              We use your information to provide our services, improve our platform, and communicate with you about our offerings.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6 mb-3">Data Protection</h2>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized access.
            </p>
            <h2 className="text-xl font-semibold text-white mt-6 mb-3">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at hello@terrasync.app
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
