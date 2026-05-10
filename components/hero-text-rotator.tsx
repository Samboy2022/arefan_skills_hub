"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const words = ["Platform", "Virtual Campus", "Learning Engine", "Digital Academy", "Command Center"]

export function HeroTextRotator() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <span className="inline-block relative w-[250px] md:w-[400px] text-left text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute left-0"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
      <span className="invisible">Virtual Campus</span> {/* Placeholder to maintain width */}
    </span>
  )
}
