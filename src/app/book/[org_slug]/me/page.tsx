'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Check, Calendar, ArrowRight, Activity } from 'lucide-react'

// --- Mock Data ---
const MOCK_MEMBER = {
  name: 'Alex Johnson',
  planName: '4 Classes / Mo',
  creditsRemaining: 3,
  isUnlimited: false,
  nextBillingDate: 'Oct 1, 2026',
  price: 89,
}

const MOCK_UPCOMING = [
  {
    id: 'b1',
    className: 'Vinyasa Flow',
    instructor: 'Sarah Jenkins',
    date: 'Today, Sep 7',
    time: '07:00 AM',
  },
  {
    id: 'b2',
    className: 'Pilates Reformer',
    instructor: 'Elena Rostova',
    date: 'Tomorrow, Sep 8',
    time: '08:00 AM',
  },
]

export default function MemberProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      {/* Header */}
      <header className="bg-slate-900 text-white px-5 py-8 pb-12">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-xl font-bold border border-white/20">
            {MOCK_MEMBER.name[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{MOCK_MEMBER.name}</h1>
            <p className="text-slate-400 text-sm font-medium">Member since 2024</p>
          </div>
        </div>
      </header>

      <div className="px-4 -mt-6 max-w-lg mx-auto space-y-6">
        
        {/* Membership Status Card */}
        <Card className="bg-white border-0 shadow-sm ring-1 ring-slate-200 overflow-hidden rounded-xl">
          <div className="p-5 border-b border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Current Plan</p>
                <h2 className="text-xl font-bold text-slate-900">{MOCK_MEMBER.planName}</h2>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-slate-900">${MOCK_MEMBER.price}</span>
                <span className="text-sm font-medium text-slate-500">/mo</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-lg text-slate-900">
                  {MOCK_MEMBER.isUnlimited ? 'Unlimited Access' : `${MOCK_MEMBER.creditsRemaining} Credits Left`}
                </p>
                <p className="text-sm text-slate-500 font-medium">Renews on {MOCK_MEMBER.nextBillingDate}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-50/50 p-4">
            <button className="text-sm font-bold text-slate-600 w-full text-center hover:text-slate-900 transition-colors">
              Manage Billing & Subscription
            </button>
          </div>
        </Card>

        {/* Upcoming Classes */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Upcoming Classes</h3>
          </div>
          
          <div className="space-y-3">
            {MOCK_UPCOMING.length === 0 ? (
              <p className="text-sm text-slate-500 bg-white p-4 rounded-xl border border-slate-200 text-center">
                No upcoming classes booked.
              </p>
            ) : (
              MOCK_UPCOMING.map(booking => (
                <Card key={booking.id} className="p-4 border-0 shadow-sm ring-1 ring-slate-200 rounded-xl flex items-center gap-4 bg-white">
                  <div className="bg-slate-100 p-3 rounded-lg text-slate-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">{booking.className}</h4>
                    <p className="text-sm font-medium text-slate-600">
                      {booking.date} • {booking.time}
                    </p>
                  </div>
                  <button className="text-slate-400 hover:text-slate-900">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Card>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  )
}
