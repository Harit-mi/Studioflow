'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Check, Plus, Clock } from 'lucide-react'

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
    dateLabel: 'Today, Sep 7',
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
    dateLabel: 'Tomorrow, Sep 8',
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
      // Optimistic update would go here
      alert('Class booked successfully! 1 credit deducted.')
    }, 800)
  }

  const handleWaitlist = (id: string) => {
    setBookingLoading(id)
    setTimeout(() => {
      setBookingLoading(null)
      alert('Joined waitlist! You will be notified if a spot opens.')
    }, 800)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white px-5 py-6 sticky top-0 z-20 shadow-sm">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">StudioFlow</h1>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold border border-slate-200">
            {MOCK_MEMBER.name[0]}
          </div>
        </div>
        <div className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full inline-flex mt-2 border border-emerald-100">
          <Check className="w-4 h-4 mr-1.5" />
          {MOCK_MEMBER.isUnlimited 
            ? 'Unlimited Plan Active' 
            : `${MOCK_MEMBER.creditsRemaining} Credits Remaining`}
        </div>
      </header>

      {/* Schedule Feed */}
      <div className="px-4 mt-6 space-y-8 max-w-lg mx-auto">
        {MOCK_SCHEDULE.map(day => (
          <div key={day.dateLabel}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">
              {day.dateLabel}
            </h2>
            <div className="space-y-4">
              {day.classes.map(session => {
                const isFull = session.bookedCount >= session.capacity
                const spotsLeft = session.capacity - session.bookedCount
                const isNearlyFull = !isFull && spotsLeft <= 3
                const isLoading = bookingLoading === session.id

                return (
                  <Card key={session.id} className="bg-white border-0 shadow-sm ring-1 ring-slate-200 overflow-hidden">
                    <div className="p-4 flex gap-4">
                      {/* Time Column */}
                      <div className="flex flex-col min-w-[70px]">
                        <span className="font-bold text-slate-900 text-lg leading-tight">
                          {session.time.split(' ')[0]}
                        </span>
                        <span className="text-sm font-semibold text-slate-500">
                          {session.time.split(' ')[1]}
                        </span>
                        <span className="text-xs text-slate-400 mt-1 font-medium flex items-center">
                          {session.durationMinutes}m
                        </span>
                      </div>

                      {/* Details Column */}
                      <div className="flex-1 border-l border-slate-100 pl-4">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-lg text-slate-900 leading-tight">
                            {session.name}
                          </h3>
                        </div>
                        <p className="text-slate-600 text-sm font-medium mb-3">
                          {session.instructor}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          {/* Scarcity Indicator */}
                          <div className="text-xs font-semibold">
                            {isFull ? (
                              <span className="text-slate-500">Class Full</span>
                            ) : isNearlyFull ? (
                              <span className="text-amber-600">{spotsLeft} spots left</span>
                            ) : (
                              <span className="text-emerald-600">Available</span>
                            )}
                          </div>

                          {/* Action Button */}
                          {session.isBookedByMe ? (
                            <Button disabled variant="outline" size="sm" className="rounded-full bg-slate-50 text-slate-600 border-slate-200 font-bold h-8 px-4">
                              <Check className="w-4 h-4 mr-1.5" /> Booked
                            </Button>
                          ) : session.isWaitlistedByMe ? (
                            <Button disabled variant="outline" size="sm" className="rounded-full bg-slate-50 text-slate-600 border-slate-200 font-bold h-8 px-4">
                              <Check className="w-4 h-4 mr-1.5" /> Waitlisted
                            </Button>
                          ) : isFull ? (
                            <Button 
                              onClick={() => handleWaitlist(session.id)}
                              disabled={isLoading}
                              variant="secondary" 
                              size="sm" 
                              className="rounded-full font-bold h-8 px-4 bg-slate-100 text-slate-700 hover:bg-slate-200"
                            >
                              {isLoading ? 'Joining...' : 'Join Waitlist'}
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleBook(session.id)}
                              disabled={isLoading || MOCK_MEMBER.creditsRemaining === 0}
                              size="sm" 
                              className="rounded-full font-bold h-8 px-5 bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                            >
                              {isLoading ? 'Booking...' : 'Book'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
