'use client'

import React, { useState } from 'react'

// --- Mock Data ---
const MOCK_MEMBER = {
  name: 'Alex',
  hasActivePlan: true,
  creditsRemaining: 3,
  isUnlimited: false,
}

interface ClassSession {
  id: string
  name: string
  instructor: string
  time: string
  durationMinutes: number
  capacity: number
  bookedCount: number
  isBookedByMe: boolean
  isWaitlistedByMe: boolean
}

interface DaySchedule {
  dateLabel: string
  classes: ClassSession[]
}

const MOCK_SCHEDULE: DaySchedule[] = [
  {
    dateLabel: 'Today',
    classes: [
      {
        id: 'c1',
        name: 'Vinyasa Flow',
        instructor: 'Sarah Jenkins',
        time: '07:00 AM',
        durationMinutes: 60,
        capacity: 12,
        bookedCount: 12,
        isBookedByMe: true, // already booked
        isWaitlistedByMe: false,
      },
      {
        id: 'c2',
        name: 'HIIT Core',
        instructor: 'Marcus Wright',
        time: '12:00 PM',
        durationMinutes: 45,
        capacity: 15,
        bookedCount: 13, // 2 spots left
        isBookedByMe: false,
        isWaitlistedByMe: false,
      },
      {
        id: 'c3',
        name: 'Restorative Yoga',
        instructor: 'Sarah Jenkins',
        time: '06:30 PM',
        durationMinutes: 75,
        capacity: 12,
        bookedCount: 12, // Full, waitlist available
        isBookedByMe: false,
        isWaitlistedByMe: false,
      },
    ]
  },
  {
    dateLabel: 'Tomorrow',
    classes: [
      {
        id: 'c4',
        name: 'Pilates Reformer',
        instructor: 'Elena Rostova',
        time: '08:00 AM',
        durationMinutes: 50,
        capacity: 8,
        bookedCount: 4, // Plenty of room
        isBookedByMe: false,
        isWaitlistedByMe: false,
      }
    ]
  }
]

import { motion } from 'framer-motion'

// ...

export default function PublicBookingPage() {
  const [bookingLoading, setBookingLoading] = useState<string | null>(null)

  const handleBook = (id: string) => {
    setBookingLoading(id)
    setTimeout(() => {
      setBookingLoading(null)
      alert('Booked.')
    }, 800)
  }

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', bounce: 0.3, duration: 0.6 }
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1c1c1a] font-sans selection:bg-black selection:text-white">
      
      {/* Ultra-minimal header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        className="px-6 py-10 max-w-lg mx-auto pt-safe pb-safe"
      >
        <h1 className="text-4xl font-black tracking-tighter mb-4">StudioFlow</h1>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
            {MOCK_MEMBER.name[0]}
          </div>
          <div>
            <p className="font-bold">{MOCK_MEMBER.name}</p>
            <p className="text-sm font-medium text-black/60">
              {MOCK_MEMBER.isUnlimited ? 'Unlimited' : `${MOCK_MEMBER.creditsRemaining} credits left`}
            </p>
          </div>
        </div>
      </motion.header>

      {/* Stripped-down list */}
      <motion.main 
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="max-w-lg mx-auto px-6 pb-24"
      >
        {MOCK_SCHEDULE.map(day => (
          <div key={day.dateLabel} className="mb-12">
            <motion.h2 
              variants={itemVars}
              className="text-2xl font-black mb-6 tracking-tight border-b-4 border-black inline-block pb-1"
            >
              {day.dateLabel}
            </motion.h2>
            
            <div className="space-y-8">
              {day.classes.map(session => {
                const isFull = session.bookedCount >= session.capacity
                const spotsLeft = session.capacity - session.bookedCount
                const isNearlyFull = !isFull && spotsLeft <= 3
                const isLoading = bookingLoading === session.id

                return (
                  <motion.div variants={itemVars} key={session.id} className="group relative">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <span className="text-xl font-bold tracking-tight block">
                          {session.time}
                        </span>
                        <span className="text-black/50 text-sm font-bold uppercase tracking-widest mt-1 block">
                          {session.durationMinutes} min
                        </span>
                      </div>
                      
                      <div className="text-right">
                        {isFull ? (
                          <span className="bg-red-100 text-red-900 font-bold px-2 py-1 text-xs uppercase tracking-widest">Full</span>
                        ) : isNearlyFull ? (
                          <span className="bg-black text-white font-bold px-2 py-1 text-xs uppercase tracking-widest">{spotsLeft} spots left</span>
                        ) : null}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-2xl font-black tracking-tight leading-none mb-1">{session.name}</h3>
                      <p className="font-medium text-black/60">{session.instructor}</p>
                    </div>

                    {/* Massive brutalist buttons */}
                    {session.isBookedByMe ? (
                      <div 
                        className="w-full bg-black text-white font-black text-center py-4 text-lg border-2 border-black uppercase tracking-widest flex items-center justify-center gap-2"
                        role="status"
                        aria-label={`You are booked for ${session.name} at ${session.time}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        You're In
                      </div>
                    ) : session.isWaitlistedByMe ? (
                      <div 
                        className="w-full bg-black/5 text-black font-black text-center py-4 text-lg border-2 border-black border-dashed uppercase tracking-widest"
                        role="status"
                        aria-label={`You are on the waitlist for ${session.name} at ${session.time}`}
                      >
                        On Waitlist
                      </div>
                    ) : isFull ? (
                      <motion.button 
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', bounce: 0.3 }}
                        onClick={() => handleBook(session.id)}
                        disabled={isLoading}
                        aria-label={`Join waitlist for ${session.name} at ${session.time}`}
                        className="w-full bg-white text-black font-black text-center py-4 text-lg border-2 border-black uppercase tracking-widest hover:bg-black/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20 disabled:opacity-50"
                      >
                        {isLoading ? 'Wait...' : 'Join Waitlist'}
                      </motion.button>
                    ) : (
                      <motion.button 
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', bounce: 0.3 }}
                        onClick={() => handleBook(session.id)}
                        disabled={isLoading}
                        aria-label={`Book ${session.name} at ${session.time}`}
                        className="w-full bg-black text-white font-black text-center py-4 text-lg border-2 border-black uppercase tracking-widest hover:bg-black/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/20 focus-visible:ring-offset-2 disabled:opacity-50"
                      >
                        {isLoading ? 'Booking...' : 'Book'}
                      </motion.button>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </motion.main>
    </div>
  )
}
