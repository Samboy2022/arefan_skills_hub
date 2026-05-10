"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'

const dashboards = [
  {
    title: "Student Dashboard",
    description: "Personalized learning paths, interactive assignments, and peer collaboration.",
    badge: "Student View"
  },
  {
    title: "Instructor Dashboard",
    description: "Course building, automated gradebooks, and engagement analytics.",
    badge: "Instructor View"
  },
  {
    title: "Admin Dashboard",
    description: "Tenant configuration, role management, and global reporting.",
    badge: "Admin View"
  }
]

export function DashboardSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % dashboards.length)
    }, 3000) // Changing every 3 seconds for better readability, as requested (2-3s)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[400px] md:h-[600px] mt-12 mb-16 perspective-1000">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, rotateX: 10, y: 20 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          exit={{ opacity: 0, rotateX: -10, y: -20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Card className="w-full h-full border-2 border-border/50 bg-background/50 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden flex flex-col relative group">

            {/* Fake Browser Chrome */}
            <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-background/80 px-4 py-1 rounded text-xs text-muted-foreground font-mono flex items-center gap-2">
                  <span className="text-primary">fnskills.com</span> / {dashboards[index].title.toLowerCase().replace(' ', '-')}
                </div>
              </div>
            </div>

            {/* Dashboard Mockup Content Area */}
            <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-background to-muted/20 flex flex-col items-center justify-center p-8">
               <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm z-20">
                 {dashboards[index].badge}
               </div>

               {/* Abstract representation of a dashboard */}
               <div className="w-full max-w-3xl space-y-6 z-10 text-center">
                 <h3 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                   {dashboards[index].title}
                 </h3>
                 <p className="text-xl text-muted-foreground max-w-xl mx-auto">
                   {dashboards[index].description}
                 </p>

                 {/* Abstract UI Elements */}
                 <div className="grid grid-cols-3 gap-4 mt-12 opacity-80">
                   <div className="h-32 rounded-lg bg-muted border border-border/50 shadow-sm animate-pulse" style={{ animationDelay: '0ms' }} />
                   <div className="h-32 rounded-lg bg-primary/10 border border-primary/20 shadow-sm animate-pulse" style={{ animationDelay: '200ms' }} />
                   <div className="h-32 rounded-lg bg-muted border border-border/50 shadow-sm animate-pulse" style={{ animationDelay: '400ms' }} />
                 </div>
               </div>

               {/* Decorative Background Elements */}
               <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
               <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-green-400/10 rounded-full blur-2xl" />
            </div>

          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Slider Indicators */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
        {dashboards.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === index ? 'w-6 bg-primary' : 'bg-border hover:bg-muted-foreground'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
