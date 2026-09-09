'use client'

import React, { useState } from 'react'
import { Users, Clock, MapPin, ChevronRight, Check } from 'lucide-react'

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

// Chalk-style colors
function getCapacityColor(booked: number, capacity: number) {
  const ratio = booked / capacity
  if (ratio >= 1) return 'text-rose-400' // Full - red chalk
  if (ratio >= 0.8) return 'text-amber-300' // Near full - yellow chalk
  return 'text-emerald-300' // Calm - green chalk
}

export default function ScheduleView() {
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null)

  const toggleRoster = (id: string) => {
    setExpandedClassId(prev => prev === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 p-4 md:p-8 font-sans selection:bg-slate-700 selection:text-white">
      <div className="max-w-4xl mx-auto border-[12px] border-[#2c1d11] rounded-sm bg-[#1e293b] relative shadow-2xl overflow-hidden shadow-black/50">
        
        {/* Chalk dust overlay texture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        
        <div className="p-6 md:p-10 relative z-10">
          <header className="mb-8 border-b-2 border-dashed border-slate-600/60 pb-6">
            <h1 className="text-4xl md:text-5xl font-chalk font-bold text-slate-100 tracking-wide text-center">
              Weekly Schedule
            </h1>
            <p className="text-center font-chalk text-xl text-slate-400 mt-2">Week of Sep 7</p>
          </header>

          <div className="space-y-12">
            {MOCK_SCHEDULE.map(day => (
              <section key={day.date}>
                <h2 className="text-3xl font-chalk font-bold text-white mb-4 flex items-baseline gap-4">
                  {day.dayName}
                  <span className="text-lg text-slate-500">{day.date.split('-').slice(1).join('/')}</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {day.classes.map(session => {
                    const isExpanded = expandedClassId === session.id
                    const capacityColor = getCapacityColor(session.bookedCount, session.capacity)
                    const isFull = session.bookedCount >= session.capacity

                    return (
                      <button 
                        key={session.id} 
                        className="group border-2 border-slate-700/60 hover:border-slate-500/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-500/50 transition-all cursor-pointer flex flex-col rounded-sm text-left relative"
                        onClick={() => toggleRoster(session.id)}
                        aria-expanded={isExpanded}
                        aria-controls={`roster-${session.id}`}
                      >
                        <div className="p-5 flex-1 relative w-full">
                          {/* Corner decorative chalk strokes */}
                          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-slate-600/30 -translate-x-[2px] -translate-y-[2px]"></div>
                          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-slate-600/30 translate-x-[2px] translate-y-[2px]"></div>

                          <div className="flex justify-between items-start mb-4">
                            <span className="text-xl font-chalk font-bold text-white">{session.startTime}</span>
                            <div className={`font-chalk text-xl font-bold ${capacityColor} flex items-center`}>
                              {session.bookedCount}/{session.capacity}
                              {isFull && session.waitlistCount > 0 && (
                                <span className="ml-2 text-sm opacity-80 border-l-2 border-current pl-2">+{session.waitlistCount} WL</span>
                              )}
                            </div>
                          </div>
                          
                          <h3 className="text-2xl font-chalk font-bold text-white mb-2 leading-tight">{session.name}</h3>
                          <p className="text-lg font-chalk text-slate-400 mb-6">{session.instructor}</p>

                          <div className="flex gap-4 text-sm font-sans text-slate-500">
                            <div className="flex items-center gap-1.5 uppercase tracking-wider">
                              <Clock className="w-3.5 h-3.5" />
                              {session.durationMinutes}m
                            </div>
                            <div className="flex items-center gap-1.5 uppercase tracking-wider">
                              <MapPin className="w-3.5 h-3.5" />
                              {session.location}
                            </div>
                          </div>
                        </div>

                        {/* Inline Roster Expansion - Rough lines */}
                        {isExpanded && (
                          <div id={`roster-${session.id}`} className="border-t-2 border-dashed border-slate-700/60 p-5 bg-slate-800/30 w-full" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-chalk text-2xl text-slate-200">Roster</h4>
                              <span className="text-sm font-sans text-slate-500 uppercase tracking-wider">{session.roster.length} signed up</span>
                            </div>
                            
                            {session.roster.length === 0 ? (
                              <p className="font-chalk text-xl text-slate-500">crickets...</p>
                            ) : (
                              <ul className="space-y-3 mb-6">
                                {session.roster.map(member => (
                                  <li key={member.id} className="flex items-center justify-between font-chalk text-xl">
                                    <div className="flex items-center gap-3">
                                      {member.checkedIn ? (
                                        <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />
                                      ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-slate-600" />
                                      )}
                                      <span className={member.checkedIn ? 'text-slate-400 line-through decoration-slate-600' : 'text-slate-200'}>
                                        {member.name}
                                      </span>
                                    </div>
                                    <span className="text-sm font-sans uppercase tracking-widest text-slate-500">
                                      {member.status === 'waitlisted' ? 'WL' : ''}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            <button 
                              type="button"
                              className="w-full bg-transparent border-2 border-slate-600 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-500/50 text-slate-300 hover:text-white font-chalk text-xl py-2 rounded-sm transition-all"
                            >
                              Check In All
                            </button>
                          </div>
                        )}
                        
                        <div className="py-2 border-t border-slate-700/30 flex justify-center text-slate-600 group-hover:text-slate-400 w-full transition-colors">
                          <ChevronRight className={`w-5 h-5 opacity-50 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
