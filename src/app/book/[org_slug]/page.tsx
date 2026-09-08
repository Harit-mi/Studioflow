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

export default function PublicBookingPage() {
  const [bookingLoading, setBookingLoading] = useState<string | null>(null)

  const handleBook = (id: string) => {
    setBookingLoading(id)
    setTimeout(() => {
      setBookingLoading(null)
      alert('Booked.')
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1c1c1a] font-sans selection:bg-black selection:text-white">
      
      {/* Ultra-minimal header */}
      <header className="px-6 py-10 max-w-lg mx-auto">
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
      </header>

      {/* Stripped-down list */}
      <main className="max-w-lg mx-auto px-6 pb-24">
        {MOCK_SCHEDULE.map(day => (
          <div key={day.dateLabel} className="mb-12">
            <h2 className="text-2xl font-black mb-6 tracking-tight border-b-4 border-black inline-block pb-1">
              {day.dateLabel}
            </h2>
            
            <div className="space-y-8">
              {day.classes.map(session => {
                const isFull = session.bookedCount >= session.capacity
                const spotsLeft = session.capacity - session.bookedCount
                const isNearlyFull = !isFull && spotsLeft <= 3
                const isLoading = bookingLoading === session.id

                return (
                  <div key={session.id} className="group relative">
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
                          <span className="text-orange-600 font-bold text-sm">{spotsLeft} spots left</span>
                        ) : null}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-2xl font-black tracking-tight leading-none mb-1">{session.name}</h3>
                      <p className="font-medium text-black/60">{session.instructor}</p>
                    </div>

                    {/* Massive brutalist buttons */}
                    {session.isBookedByMe ? (
                      <div className="w-full bg-green-100 text-green-900 font-black text-center py-4 text-lg border-2 border-green-900 uppercase tracking-widest">
                        You're In
                      </div>
                    ) : session.isWaitlistedByMe ? (
                      <div className="w-full bg-black/5 text-black font-black text-center py-4 text-lg border-2 border-black border-dashed uppercase tracking-widest">
                        On Waitlist
                      </div>
                    ) : isFull ? (
                      <button 
                        onClick={() => handleBook(session.id)}
                        disabled={isLoading}
                        className="w-full bg-white text-black font-black text-center py-4 text-lg border-2 border-black uppercase tracking-widest hover:bg-black/5 active:scale-[0.98] transition-transform disabled:opacity-50"
                      >
                        {isLoading ? 'Wait...' : 'Join Waitlist'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleBook(session.id)}
                        disabled={isLoading}
                        className="w-full bg-black text-white font-black text-center py-4 text-lg border-2 border-black uppercase tracking-widest hover:bg-black/90 active:scale-[0.98] transition-transform disabled:opacity-50"
                      >
                        {isLoading ? 'Booking...' : 'Book'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
