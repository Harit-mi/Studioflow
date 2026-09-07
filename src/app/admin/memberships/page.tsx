'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react'

// --- Mock Data ---
interface MembershipPlan {
  id: string
  name: string
  price: number
  interval: string
  credits: number | 'Unlimited'
}

const MOCK_PLANS: MembershipPlan[] = [
  { id: 'p1', name: 'Drop-In', price: 25, interval: 'one-time', credits: 1 },
  { id: 'p2', name: '4 Classes / Mo', price: 89, interval: 'month', credits: 4 },
  { id: 'p3', name: 'Unlimited Monthly', price: 150, interval: 'month', credits: 'Unlimited' },
]

interface MemberSubscription {
  id: string
  memberName: string
  planName: string
  stripeStatus: 'active' | 'past_due' | 'canceled'
  nextBillingDate: string
}

const MOCK_MEMBERS: MemberSubscription[] = [
  { id: 'm1', memberName: 'Alice Chen', planName: 'Unlimited Monthly', stripeStatus: 'active', nextBillingDate: 'Oct 1, 2026' },
  { id: 'm2', memberName: 'Bob Smith', planName: '4 Classes / Mo', stripeStatus: 'past_due', nextBillingDate: 'Sep 15, 2026' },
  { id: 'm3', memberName: 'Charlie Davis', planName: 'Unlimited Monthly', stripeStatus: 'canceled', nextBillingDate: 'Sep 30, 2026' },
]

// --- Helpers ---
function StatusBadge({ status }: { status: MemberSubscription['stripeStatus'] }) {
  switch (status) {
    case 'active':
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-semibold gap-1.5 px-2.5 py-0.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> Active
        </Badge>
      )
    case 'past_due':
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-semibold gap-1.5 px-2.5 py-0.5">
          <AlertCircle className="w-3.5 h-3.5" /> Payment Failed
        </Badge>
      )
    case 'canceled':
      return (
        <Badge variant="outline" className="bg-zinc-100 text-zinc-500 border-zinc-200 font-semibold gap-1.5 px-2.5 py-0.5">
          <XCircle className="w-3.5 h-3.5" /> Canceled
        </Badge>
      )
  }
}

export default function MembershipsAdminPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Memberships & Billing</h1>
          <p className="text-slate-500">Manage your studio&apos;s plans and view member subscription health.</p>
        </header>

        {/* Active Plans Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Active Plans</h2>
            <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md">
              + Create Plan
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_PLANS.map(plan => (
              <Card key={plan.id} className="p-5 border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 text-slate-900 mb-4">
                    <span className="text-2xl font-black">${plan.price}</span>
                    {plan.interval !== 'one-time' && (
                      <span className="text-sm font-medium text-slate-500">/ {plan.interval}</span>
                    )}
                  </div>
                </div>
                <div className="bg-slate-50 px-3 py-2 rounded-md border border-slate-100 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-600">Allowance</span>
                  <span className="font-bold text-slate-900">
                    {plan.credits === 'Unlimited' ? 'Unlimited' : `${plan.credits} Credits`}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Members Directory */}
        <section>
          <h2 className="text-xl font-bold mb-4">Member Subscriptions</h2>
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-600">Member</TableHead>
                  <TableHead className="font-semibold text-slate-600">Active Plan</TableHead>
                  <TableHead className="font-semibold text-slate-600">Billing Status</TableHead>
                  <TableHead className="font-semibold text-slate-600">Next Billing Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_MEMBERS.map(member => (
                  <TableRow key={member.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-semibold">{member.memberName}</TableCell>
                    <TableCell className="text-slate-600 font-medium">{member.planName}</TableCell>
                    <TableCell>
                      <StatusBadge status={member.stripeStatus} />
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">
                      {member.stripeStatus === 'canceled' ? (
                        <span className="text-slate-400 line-through">{member.nextBillingDate}</span>
                      ) : (
                        member.nextBillingDate
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>

      </div>
    </div>
  )
}
