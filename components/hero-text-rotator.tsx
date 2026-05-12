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
    <span className="inline-block relative text-center text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-green-400 drop-shadow-sm pb-2 whitespace-nowrap">
      <AnimatePresence>
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute left-0 right-0 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-emerald-500 to-green-400 whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
      <span className="invisible whitespace-nowrap">Command Center</span> {/* Placeholder to maintain width */}
    </span>
  )
}
