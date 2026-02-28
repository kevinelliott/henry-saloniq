'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Appointment, Stylist, RevenueGoal } from '@/types'

interface Stats {
  todayRevenue: number
  monthGoal: number
  utilizationPct: number
  noShowRate: number
  topStylists: { name: string; revenue: number; id: string }[]
  stylistCount: number
}

function pct(n: number) { return Math.min(100, Math.round(n)) }

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const seeded = useRef(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Auto-seed on first login
      if (!seeded.current) {
        seeded.current = true
        const { data: existingStylists } = await supabase.from('stylists').select('id').eq('user_id', user.id).limit(1)
        if (!existingStylists || existingStylists.length === 0) {
          await fetch('/api/seed', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.id }) })
        }
      }

      const now = new Date()
      const todayStr = now.toISOString().split('T')[0]
      const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7)

      const [apptRes, goalRes, stylistRes] = await Promise.all([
        supabase.from('appointments').select('*, stylist:stylists(name)').eq('user_id', user.id),
        supabase.from('revenue_goals').select('*').eq('user_id', user.id).eq('month', monthStr).single(),
        supabase.from('stylists').select('*').eq('user_id', user.id).eq('active', true),
      ])

      const appts: Appointment[] = apptRes.data || []
      const goal: RevenueGoal | null = goalRes.data
      const stylists: Stylist[] = stylistRes.data || []

      const todayAppts = appts.filter(a => a.scheduled_at.startsWith(todayStr) && a.status === 'completed')
      const todayRevenue = todayAppts.reduce((s, a) => s + Number(a.price), 0)

      const weekAppts = appts.filter(a => new Date(a.scheduled_at) >= weekAgo && a.status !== 'cancelled')
      const availableSlots = stylists.length * 35
      const utilizationPct = availableSlots > 0 ? (weekAppts.length / availableSlots) * 100 : 0

      const monthAppts = appts.filter(a => a.scheduled_at.startsWith(monthStr))
      const noShows = monthAppts.filter(a => a.status === 'no_show').length
      const noShowRate = monthAppts.length > 0 ? (noShows / monthAppts.length) * 100 : 0

      const stylistRevMap: Record<string, { name: string; revenue: number; id: string }> = {}
      appts.filter(a => a.status === 'completed').forEach(a => {
        if (!stylistRevMap[a.stylist_id]) {
          stylistRevMap[a.stylist_id] = { id: a.stylist_id, name: (a.stylist as unknown as Stylist)?.name || 'Unknown', revenue: 0 }
        }
        stylistRevMap[a.stylist_id].revenue += Number(a.price)
      })
      const topStylists = Object.values(stylistRevMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

      setStats({ todayRevenue, monthGoal: goal?.goal_amount || 0, utilizationPct, noShowRate, topStylists, stylistCount: stylists.length })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full" />
    </div>
  )

  if (!stats) return null

  const dailyTarget = stats.monthGoal / 30
  const goalPct = dailyTarget > 0 ? pct((stats.todayRevenue / dailyTarget) * 100) : 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Your salon&apos;s performance at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="text-sm text-gray-500 mb-2">Today&apos;s Revenue</div>
          <div className="text-3xl font-bold text-gray-900">${stats.todayRevenue.toFixed(0)}</div>
          {stats.monthGoal > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Daily goal pace</span><span>{goalPct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${goalPct}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="stat-card">
          <div className="text-sm text-gray-500 mb-2">Chair Utilization (Week)</div>
          <div className="text-3xl font-bold text-gray-900">{pct(stats.utilizationPct)}%</div>
          <div className="mt-3">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct(stats.utilizationPct)}%` }} />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {stats.utilizationPct >= 70 ? '✅ On target' : '⚠️ Below 70% target'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="text-sm text-gray-500 mb-2">No-Show Rate (Month)</div>
          <div className={`text-3xl font-bold ${stats.noShowRate > 18 ? 'text-red-600' : 'text-gray-900'}`}>
            {stats.noShowRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-3">
            {stats.noShowRate > 18 ? '🔴 Above industry avg (18%)' : '🟢 Below industry avg (18%)'}
          </div>
        </div>

        <div className="stat-card">
          <div className="text-sm text-gray-500 mb-2">Monthly Goal</div>
          {stats.monthGoal > 0 ? (
            <>
              <div className="text-3xl font-bold text-gray-900">${stats.monthGoal.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-3">Daily target: ${dailyTarget.toFixed(0)}</div>
            </>
          ) : (
            <div className="text-sm text-gray-500 mt-1">
              <a href="/dashboard/goals" className="text-green-600 hover:underline">Set a goal →</a>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Top Stylists by Revenue</h2>
          <a href="/dashboard/stylists" className="text-sm text-green-600 hover:underline">View all →</a>
        </div>
        {stats.topStylists.length === 0 ? (
          <p className="text-gray-500 text-sm">No data yet. <a href="/dashboard/appointments" className="text-green-600 hover:underline">Add appointments →</a></p>
        ) : (
          <div className="space-y-3">
            {stats.topStylists.map((s, i) => (
              <div key={s.id} className="flex items-center gap-4">
                <span className="text-gray-400 text-sm w-6">#{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{s.name}</span>
                    <span className="text-sm font-bold text-green-600">${s.revenue.toFixed(0)}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${(s.revenue / (stats.topStylists[0]?.revenue || 1)) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
