'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, Camera, Sparkles, Leaf, Recycle, MapPin, 
  DollarSign, Coins, TrendingUp, Check, AlertCircle, Loader2 
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { GlowCard } from '@/components/ui/GlowCard'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { analyzeItem, orchestrateTrade, type AnalysisResult, type TradeResult } from '@/lib/api'

export default function VisionPortalPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isNegotiating, setIsNegotiating] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [trade, setTrade] = useState<TradeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      await processImage(file)
    }
  }, [])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await processImage(file)
    }
  }, [])

  const processImage = async (file: File) => {
    setError(null)
    setAnalysis(null)
    setTrade(null)
    setIsAnalyzing(true)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => setPreviewUrl(e.target?.result as string)
    reader.readAsDataURL(file)
    
    try {
      const result = await analyzeItem(file)
      setAnalysis(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleNegotiate = async () => {
    if (!analysis) return
    
    setIsNegotiating(true)
    setError(null)
    
    try {
      const result = await orchestrateTrade(
        analysis.item_id,
        'user-demo', // In production, use actual user ID
        analysis.recommended_paths[0]
      )
      setTrade(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Negotiation failed')
    } finally {
      setIsNegotiating(false)
    }
  }

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-eco-glow/10 border border-eco-glow/30 mb-6">
            <Camera className="w-4 h-4 text-eco-glow" />
            <span className="text-sm text-eco-glow">AI Vision Portal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Analyze Your <span className="gradient-text">Item</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Upload a photo and let AI determine its circular value, condition, and optimal reuse path.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlowCard className="h-full">
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
                  ${isDragging ? 'border-eco-glow bg-eco-glow/10' : 'border-eco-border hover:border-eco-glow/50'}
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {previewUrl ? (
                  <div className="relative group">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="max-h-64 mx-auto rounded-lg object-contain"
                    />
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-eco-dark/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-white mx-auto mb-2" />
                        <p className="text-white text-sm font-medium">Click to change image</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-16 h-16 text-white/40 mx-auto mb-4" />
                    <p className="text-lg text-white/60 mb-2">
                      Drag & drop an image here
                    </p>
                    <p className="text-sm text-white/40">
                      or click to select a file
                    </p>
                  </>
                )}
              </div>

              {isAnalyzing && (
                <div className="mt-6 flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 text-eco-glow animate-spin" />
                  <span className="text-white/60">Analyzing with AI...</span>
                </div>
              )}

              {error && (
                <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}
            </GlowCard>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <GlowCard>
                    {/* Category & Condition */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-xs text-white/40 uppercase tracking-wider">Category</span>
                        <h3 className="text-xl font-semibold text-white capitalize">{analysis.category}</h3>
                        <p className="text-sm text-white/50">{analysis.subcategory}</p>
                      </div>
                      <div className="px-4 py-2 rounded-full bg-eco-glow/20 border border-eco-glow/30">
                        <span className="text-eco-glow font-medium capitalize">{analysis.condition}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/60 mb-6">{analysis.description}</p>

                    {/* Circular Value */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-4 rounded-xl bg-eco-card border border-eco-border">
                        <DollarSign className="w-5 h-5 text-eco-glow mb-2" />
                        <div className="text-2xl font-bold text-white">
                          ${analysis.circular_value.monetary_value.toFixed(2)}
                        </div>
                        <span className="text-xs text-white/40">Est. Value</span>
                      </div>
                      <div className="p-4 rounded-xl bg-eco-card border border-eco-border">
                        <Coins className="w-5 h-5 text-eco-glow mb-2" />
                        <div className="text-2xl font-bold text-white">
                          <AnimatedNumber value={analysis.circular_value.eco_credits} />
                        </div>
                        <span className="text-xs text-white/40">Eco-Credits</span>
                      </div>
                      <div className="p-4 rounded-xl bg-eco-card border border-eco-border">
                        <Leaf className="w-5 h-5 text-eco-glow mb-2" />
                        <div className="text-2xl font-bold text-white">
                          <AnimatedNumber value={analysis.circular_value.carbon_savings_kg} prefix="" suffix=" kg" />
                        </div>
                        <span className="text-xs text-white/40">CO₂ Saved</span>
                      </div>
                      <div className="p-4 rounded-xl bg-eco-card border border-eco-border">
                        <TrendingUp className="w-5 h-5 text-eco-glow mb-2" />
                        <div className="text-2xl font-bold text-white">
                          <AnimatedNumber value={analysis.circular_value.confidence_score * 100} suffix="%" />
                        </div>
                        <span className="text-xs text-white/40">Confidence</span>
                      </div>
                    </div>

                    {/* Recommended Paths */}
                    <div className="mb-6">
                      <h4 className="text-sm text-white/40 uppercase tracking-wider mb-3">Recommended Paths</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.recommended_paths.map((path, i) => (
                          <span 
                            key={i}
                            className="px-3 py-1 rounded-full bg-ocean-500/20 border border-ocean-500/30 text-ocean-400 text-sm capitalize"
                          >
                            {path}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Matching Organizations */}
                    <div className="mb-6">
                      <h4 className="text-sm text-white/40 uppercase tracking-wider mb-3">Matching Organizations</h4>
                      <div className="space-y-2">
                        {analysis.matching_organizations.slice(0, 3).map((org, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-eco-card border border-eco-border">
                            <div className="flex items-center gap-3">
                              <Recycle className="w-4 h-4 text-eco-glow" />
                              <div>
                                <span className="text-white text-sm">{org.name}</span>
                                <span className="text-white/40 text-xs ml-2 capitalize">({org.type})</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-white/40" />
                              <span className="text-white/60 text-xs">{org.distance_km} km</span>
                              <span className="text-eco-glow text-xs font-medium">{(org.match_score * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Negotiate Button */}
                    <Button 
                      onClick={handleNegotiate}
                      disabled={isNegotiating}
                      className="w-full"
                      size="lg"
                      icon={isNegotiating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    >
                      {isNegotiating ? 'Negotiating...' : 'Start AI Negotiation'}
                    </Button>
                  </GlowCard>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex items-center justify-center"
                >
                  <GlowCard className="text-center py-16">
                    <Camera className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white/40 mb-2">No Analysis Yet</h3>
                    <p className="text-white/30">Upload an image to see AI insights</p>
                  </GlowCard>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Trade Result */}
        <AnimatePresence>
          {trade && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <GlowCard glowColor="rgba(0, 255, 136, 0.2)">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-full bg-eco-glow/20">
                    <Check className="w-6 h-6 text-eco-glow" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Trade Orchestrated Successfully!</h3>
                    <p className="text-white/50 text-sm">Trade ID: {trade.trade_id}</p>
                  </div>
                </div>

                {trade.best_match && (
                  <div className="p-4 rounded-xl bg-eco-glow/10 border border-eco-glow/30 mb-6">
                    <h4 className="text-sm text-eco-glow uppercase tracking-wider mb-2">Best Match</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-semibold text-white">{trade.best_match.organization_name}</span>
                        <span className="text-white/50 text-sm ml-2 capitalize">({trade.best_match.organization_type})</span>
                      </div>
                      <span className="text-eco-glow font-bold">{(trade.best_match.match_score * 100).toFixed(0)}% Match</span>
                    </div>
                    <div className="flex gap-6 mt-3">
                      <div>
                        <span className="text-white/40 text-xs">Eco-Credits</span>
                        <div className="text-white font-medium">{trade.best_match.proposed_terms.credit_offer}</div>
                      </div>
                      <div>
                        <span className="text-white/40 text-xs">Pickup</span>
                        <div className="text-white font-medium">{trade.best_match.proposed_terms.pickup_available ? 'Available' : 'Not Available'}</div>
                      </div>
                      <div>
                        <span className="text-white/40 text-xs">Distance</span>
                        <div className="text-white font-medium">{trade.best_match.distance_km} km</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-eco-card border border-eco-border text-center">
                    <Coins className="w-6 h-6 text-eco-glow mx-auto mb-2" />
                    <div className="text-3xl font-bold text-white">{trade.eco_credits_earned}</div>
                    <span className="text-white/40 text-sm">Eco-Credits Earned</span>
                  </div>
                  <div className="p-4 rounded-xl bg-eco-card border border-eco-border text-center">
                    <Leaf className="w-6 h-6 text-eco-glow mx-auto mb-2" />
                    <div className="text-3xl font-bold text-white">{trade.carbon_impact_kg.toFixed(1)} kg</div>
                    <span className="text-white/40 text-sm">Carbon Impact</span>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
