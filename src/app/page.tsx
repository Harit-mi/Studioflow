import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { ArrowRight, Calendar, Users, Home } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">StudioFlow</h1>
          <p className="text-slate-500 text-lg">Class schedules, memberships, and check-in without the friction.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Owner Portal Link */}
          <Link href="/admin/schedule">
            <Card className="p-6 hover:border-slate-400 transition-colors h-full flex flex-col justify-between group cursor-pointer border-slate-200">
              <div>
                <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Owner / Instructor View</h2>
                <p className="text-slate-500 text-sm font-medium">Manage class schedules, view live capacities, and check in members.</p>
              </div>
              <div className="mt-6 flex items-center text-sm font-bold text-slate-900 group-hover:text-slate-600 transition-colors">
                View Schedule <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Member Portal Link */}
          <Link href="/book/studio-demo">
            <Card className="p-6 hover:border-emerald-400 transition-colors h-full flex flex-col justify-between group cursor-pointer border-slate-200">
              <div>
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Public Booking Page</h2>
                <p className="text-slate-500 text-sm font-medium">The unauthenticated, high-speed mobile booking flow for your members.</p>
              </div>
              <div className="mt-6 flex items-center text-sm font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                Book a Class <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Memberships Admin Link */}
          <Link href="/admin/memberships" className="md:col-span-2">
            <Card className="p-6 hover:border-slate-400 transition-colors group cursor-pointer border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center shrink-0">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Memberships & Billing Dashboard</h2>
                  <p className="text-slate-500 text-sm font-medium">Manage Stripe plans and view member subscription health.</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
            </Card>
          </Link>
        </div>
      </div>
    </main>
  )
}
