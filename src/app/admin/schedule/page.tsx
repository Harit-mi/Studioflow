'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Clock, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react'

// --- Types ---
type ClassStatus = 'scheduled' | 'in_progress' | 'completed'

interface MemberBooking {
  id: string
  name: string
  status: 'booked' | 'waitlisted'
  checkedIn: boolean
}

interface ClassSession {
  id: string
  name: string
  instructor: string
  startTime: string
  durationMinutes: number
  capacity: number
  bookedCount: number
  waitlistCount: number
  status: ClassStatus
  location: string
  roster: MemberBooking[]
}

interface DaySchedule {
  date: string
  dayName: string
  classes: ClassSession[]
}

// --- Realistic Sample Data ---
const MOCK_SCHEDULE: DaySchedule[] = [
  {
    date: '2026-09-07',
    dayName: 'Monday',
    classes: [
      {
        id: 'c1',
        name: 'Vinyasa Flow',
        instructor: 'Sarah Jenkins',
        startTime: '07:00 AM',
        durationMinutes: 60,
        capacity: 12,
        bookedCount: 12, // Full
        waitlistCount: 2,
        status: 'completed',
        location: 'Studio A',
        roster: [
          { id: 'm1', name: 'Alice Chen', status: 'booked', checkedIn: true },
          { id: 'm2', name: 'Bob Smith', status: 'booked', checkedIn: true },
          { id: 'w1', name: 'Charlie Davis', status: 'waitlisted', checkedIn: false },
        ],
      },
      {
        id: 'c2',
        name: 'HIIT Core',
        instructor: 'Marcus Wright',
        startTime: '12:00 PM',
        durationMinutes: 45,
        capacity: 15,
        bookedCount: 5, // Calm
        waitlistCount: 0,
        status: 'scheduled',
        location: 'Studio B',
        roster: [
          { id: 'm3', name: 'Dana Lee', status: 'booked', checkedIn: false },
        ],
      },
      {
        id: 'c3',
        name: 'Restorative Yoga',
        instructor: 'Sarah Jenkins',
        startTime: '06:30 PM',
        durationMinutes: 75,
        capacity: 12,
        bookedCount: 10, // Urgent (near full)
        waitlistCount: 0,
        status: 'scheduled',
        location: 'Studio A',
        roster: [
          { id: 'm4', name: 'Evan Cole', status: 'booked', checkedIn: false },
        ],
      },
    ]
  },
  {
    date: '2026-09-08',
    dayName: 'Tuesday',
    classes: [
      {
        id: 'c4',
        name: 'Pilates Reformer',
        instructor: 'Elena Rostova',
        startTime: '08:00 AM',
        durationMinutes: 50,
        capacity: 8,
        bookedCount: 7, // Urgent
        waitlistCount: 0,
        status: 'scheduled',
        location: 'Studio C',
        roster: [],
      }
    ]
  }
]

// --- Helper Functions ---
function getCapacityUrgency(booked: number, capacity: number) {
  const ratio = booked / capacity
  if (ratio >= 1) return 'bg-red-500/20 text-red-400 border-red-500/50' // Full
  if (ratio >= 0.8) return 'bg-amber-500/20 text-amber-400 border-amber-500/50' // Near full
  return 'bg-zinc-800 text-zinc-300 border-zinc-700' // Calm / plenty of room
}

export default function ScheduleView() {
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null)

  const toggleRoster = (id: string) => {
    setExpandedClassId(prev => prev === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-[#1c1c1a] text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex justify-between items-end border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Class Schedule</h1>
            <p className="text-zinc-400">Owner & Instructor View</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-500">Week of Sep 7, 2026</p>
          </div>
        </header>

        {/* Chalkboard Grid Concept */}
        <div className="space-y-8">
          {MOCK_SCHEDULE.map(day => (
            <section key={day.date} className="relative">
              <div className="sticky top-0 z-10 bg-[#1c1c1a]/95 backdrop-blur py-2 mb-3 border-b border-zinc-800/50">
                <h2 className="text-xl font-semibold text-zinc-200">
                  {day.dayName} <span className="text-zinc-500 text-sm ml-2 font-normal">{day.date}</span>
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {day.classes.map(session => {
                  const isExpanded = expandedClassId === session.id
                  const urgencyClasses = getCapacityUrgency(session.bookedCount, session.capacity)
                  const isFull = session.bookedCount >= session.capacity

                  return (
                    <Card 
                      key={session.id} 
                      className={`bg-[#252523] border-zinc-700/50 hover:border-zinc-500 transition-colors cursor-pointer overflow-hidden flex flex-col`}
                      onClick={() => toggleRoster(session.id)}
                    >
                      <div className="p-5 flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-lg font-bold text-zinc-100">{session.startTime}</span>
                          <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${urgencyClasses} flex items-center gap-1.5`}>
                            <Users className="w-3.5 h-3.5" />
                            {session.bookedCount}/{session.capacity}
                            {isFull && session.waitlistCount > 0 && (
                              <span className="ml-1 pl-1.5 border-l border-current opacity-80">
                                +{session.waitlistCount} WL
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-1">{session.name}</h3>
                        <p className="text-zinc-400 font-medium mb-4">{session.instructor}</p>

                        <div className="flex gap-4 text-sm text-zinc-500 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {session.durationMinutes} min
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {session.location}
                          </div>
                        </div>
                      </div>

                      {/* Inline Roster Expansion */}
                      {isExpanded && (
                        <div className="bg-[#1a1a18] border-t border-zinc-800 p-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-zinc-300">Roster</h4>
                            <span className="text-xs text-zinc-500">{session.roster.length} members</span>
                          </div>
                          
                          {session.roster.length === 0 ? (
                            <p className="text-sm text-zinc-500 italic">No bookings yet.</p>
                          ) : (
                            <ul className="space-y-2">
                              {session.roster.map(member => (
                                <li key={member.id} className="flex items-center justify-between bg-[#252523] p-2.5 rounded-md border border-zinc-800/50">
                                  <div className="flex items-center gap-2">
                                    {member.checkedIn ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    ) : (
                                      <div className="w-4 h-4 rounded-full border-2 border-zinc-600" />
                                    )}
                                    <span className="text-sm font-medium text-zinc-200">{member.name}</span>
                                  </div>
                                  <Badge variant={member.status === 'waitlisted' ? 'secondary' : 'outline'} className="text-[10px] uppercase tracking-wider bg-transparent border-zinc-700 text-zinc-400">
                                    {member.status}
                                  </Badge>
                                </li>
                              ))}
                            </ul>
                          )}
                          <button className="w-full mt-4 bg-[#2a2a28] hover:bg-[#333330] text-zinc-300 text-sm font-semibold py-2 rounded-md transition-colors border border-zinc-700">
                            Check In All
                          </button>
                        </div>
                      )}
                      
                      {!isExpanded && (
                        <div className="bg-[#1a1a18]/50 border-t border-zinc-800/50 py-2 px-5 flex justify-center items-center text-zinc-500 group-hover:text-zinc-400">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
