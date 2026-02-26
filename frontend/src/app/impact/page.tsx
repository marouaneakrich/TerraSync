'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Leaf, Recycle, Coins, TrendingUp, Users, Package, 
  ArrowUpRight, ArrowDownRight, Calendar, MapPin, Zap 
} from 'lucide-react'
import { GlowCard } from '@/components/ui/GlowCard'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'

interface ImpactStats {
  co2_sequestered_tons: number
  waste_diverted_kg: number
  eco_credits_earned: number
  recovery_rate_percent: number
  items_processed: number
  active_users: number
}

interface Activity {
  id: string
  type: 'analysis' | 'trade' | 'credit'
  description: string
  impact: number
  timestamp: string
  location?: string
}

// Mock data for demonstration
const mockStats: ImpactStats = {
  co2_sequestered_tons: 2847,
  waste_diverted_kg: 156420,
  eco_credits_earned: 892340,
  recovery_rate_percent: 94,
  items_processed: 45231,
  active_users: 12847,
}

const mockActivities: Activity[] = [
  { id: '1', type: 'trade', description: 'Laptop donated to Tech for All', impact: 45, timestamp: '2024-01-15T10:30:00Z', location: 'New York, NY' },
  { id: '2', type: 'analysis', description: 'Furniture analyzed for reuse', impact: 12, timestamp: '2024-01-15T09:45:00Z' },
  { id: '3', type: 'credit', description: 'Eco-credits earned from recycling', impact: 38, timestamp: '2024-01-15T09:00:00Z' },
  { id: '4', type: 'trade', description: 'Industrial scrap matched with recycler', impact: 67, timestamp: '2024-01-15T08:30:00Z', location: 'Brooklyn, NY' },
  { id: '5', type: 'analysis', description: 'Electronics analyzed for refurbishment', impact: 23, timestamp: '2024-01-15T08:00:00Z' },
]

const weeklyData = [
  { day: 'Mon', value: 120 },
  { day: 'Tue', value: 180 },
  { day: 'Wed', value: 150 },
  { day: 'Thu', value: 220 },
  { day: 'Fri', value: 190 },
  { day: 'Sat', value: 280 },
  { day: 'Sun', value: 240 },
]

export default function ImpactDashboardPage() {
  const [stats] = useState<ImpactStats>(mockStats)
  const [activities] = useState<Activity[]>(mockActivities)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
              Impact <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-white/60">Real-time metrics of your environmental contribution</p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex gap-2 mt-4 md:mt-0">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-eco-glow text-eco-dark'
                    : 'bg-eco-card border border-eco-border text-white/60 hover:text-white'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              icon: Leaf, 
              label: 'CO₂ Sequestered', 
              value: stats.co2_sequestered_tons, 
              suffix: 't',
              change: '+12.5%',
              positive: true,
              color: 'text-eco-glow'
            },
            { 
              icon: Recycle, 
              label: 'Waste Diverted', 
              value: stats.waste_diverted_kg, 
              suffix: 'kg',
              change: '+8.3%',
              positive: true,
              color: 'text-ocean-400'
            },
            { 
              icon: Coins, 
              label: 'Eco-Credits Earned', 
              value: stats.eco_credits_earned, 
              suffix: '',
              change: '+15.2%',
              positive: true,
              color: 'text-yellow-400'
            },
            { 
              icon: TrendingUp, 
              label: 'Recovery Rate', 
              value: stats.recovery_rate_percent, 
              suffix: '%',
              change: '+2.1%',
              positive: true,
              color: 'text-purple-400'
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlowCard className="relative overflow-hidden">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-eco-card border border-eco-border`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.positive ? 'text-eco-glow' : 'text-red-400'}`}>
                    {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {stat.change}
                  </div>
                </div>
                <div className="text-4xl font-display font-bold text-white mb-1">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-white/50 text-sm">{stat.label}</div>
                
                {/* Decorative gradient */}
                <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl ${stat.color.replace('text-', 'bg-')}/20`} />
              </GlowCard>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <GlowCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Weekly Activity</h3>
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <Calendar className="w-4 h-4" />
                  Last 7 days
                </div>
              </div>
              
              {/* Simple Bar Chart */}
              <div className="flex items-end justify-between gap-4 h-48">
                {weeklyData.map((day, index) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.value / 300) * 100}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      className="w-full bg-gradient-to-t from-eco-glow to-ocean-400 rounded-t-lg min-h-[20px]"
                    />
                    <span className="text-white/40 text-xs mt-2">{day.day}</span>
                  </div>
                ))}
              </div>
              
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-eco-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    <AnimatedNumber value={stats.items_processed} />
                  </div>
                  <div className="text-white/40 text-sm flex items-center justify-center gap-1">
                    <Package className="w-3 h-3" />
                    Items Processed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    <AnimatedNumber value={stats.active_users} />
                  </div>
                  <div className="text-white/40 text-sm flex items-center justify-center gap-1">
                    <Users className="w-3 h-3" />
                    Active Users
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-eco-glow">A+</div>
                  <div className="text-white/40 text-sm flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3" />
                    Impact Score
                  </div>
                </div>
              </div>
            </GlowCard>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlowCard>
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-eco-card/50 border border-eco-border/50"
                  >
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'trade' ? 'bg-eco-glow/20 text-eco-glow' :
                      activity.type === 'analysis' ? 'bg-ocean-500/20 text-ocean-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {activity.type === 'trade' ? <Recycle className="w-4 h-4" /> :
                       activity.type === 'analysis' ? <Leaf className="w-4 h-4" /> :
                       <Coins className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-white/40 text-xs">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </span>
                        {activity.location && (
                          <>
                            <span className="text-white/20">•</span>
                            <span className="text-white/40 text-xs flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {activity.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-eco-glow font-medium text-sm">
                      +{activity.impact}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2 text-center text-white/50 hover:text-white text-sm transition-colors">
                View All Activity →
              </button>
            </GlowCard>
          </motion.div>
        </div>

        {/* Impact Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <GlowCard>
            <h3 className="text-lg font-semibold text-white mb-6">Environmental Impact Breakdown</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Trees Equivalent', value: '12,847', icon: '🌳' },
                { label: 'Water Saved', value: '2.4M L', icon: '💧' },
                { label: 'Energy Saved', value: '847 MWh', icon: '⚡' },
                { label: 'Landfill Avoided', value: '156 tons', icon: '🏭' },
              ].map((item, index) => (
                <div key={item.label} className="text-center">
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <div className="text-2xl font-bold text-white">{item.value}</div>
                  <div className="text-white/40 text-sm">{item.label}</div>
                </div>
              ))}
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </main>
  )
}
