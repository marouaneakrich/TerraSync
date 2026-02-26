'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface AnimatedNumberProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
}

export function AnimatedNumber({ value, prefix = '', suffix = '', duration = 2 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const spring = useSpring(0, { duration: duration * 1000 })
  const display = useTransform(spring, (current) => Math.floor(current).toLocaleString())

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => setDisplayValue(Number(v.replace(/,/g, ''))))
    return unsubscribe
  }, [display])

  return (
    <motion.span className="tabular-nums">
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.span>
  )
}
