'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { RevenueGoal } from '@/types'

export default function GoalsPage() {
  const [goals, setGoals] = useState<RevenueGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [month, setMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [goalAmount, setGoalAmount] = useState('')
  const [actualRevenues, setActualRevenues] = useState<Record<string, number>>({})

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const [goalRes, apptRes] = await Promise.all([
      supabase.from('revenue_goals').select('*').eq('user_id', user.id).order('month', { ascending: false }),
      supabase.from('appointments').select('*').eq('user_id', user.id).eq('status', 'completed'),
    ])
    const fetchedGoals: RevenueGoal[] = goalRes.data || []
    setGoals(fetchedGoals)

    // Calculate actual revenues per month
    const revMap: Record<string, number> = {}
    ;(apptRes.data || []).forEach(a => {
      const m = a.scheduled_at.slice(0, 7)
      revMap[m] = (revMap[m] || 0) + Number(a.price)
    })
    setActualRevenues(revMap)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function saveGoal(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    // Upsert
    const existing = goals.find(g => g.month === month)
    if (existing) {
      await supabase.from('revenue_goals').update({ goal_amount: Number(goalAmount) }).eq('id', existing.id)
    } else {
      await supabase.from('revenue_goals').insert({ user_id: user.id, month, goal_amount: Number(goalAmount) })
    }
    setGoalAmount('')
    setSaving(false)
    load()
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full" /></div>

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Revenue Goals</h1>
        <p className="text-gray-500 text-sm mt-1">Set monthly targets and track progress</p>
      </div>

      <form onSubmit={saveGoal} className="bg-white border border-gray-200 rounded-xl p-6 mb-8 flex items-end gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
          <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Revenue Goal ($)</label>
          <input type="number" value={goalAmount} onChange={e => setGoalAmount(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="e.g. 15000" min="0" required />
        </div>
        <button type="submit" disabled={saving} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium">
          {saving ? 'Saving...' : 'Set Goal'}
        </button>
      </form>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Month', 'Goal', 'Actual', 'Progress', 'Status'].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {goals.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No goals set yet.</td></tr>
            ) : goals.map(g => {
              const actual = actualRevenues[g.month] || 0
              const pct = Math.min(100, Math.round((actual / g.goal_amount) * 100))
              const now = new Date()
              const isCurrentMonth = g.month === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
              return (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {new Date(g.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    {isCurrentMonth && <span className="ml-2 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Current</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-700">${g.goal_amount.toLocaleString()}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">${actual.toFixed(0)}</td>
                  <td className="px-6 py-4 w-48">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-sm text-gray-600 w-10">{pct}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${pct >= 100 ? 'bg-green-100 text-green-700' : pct >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                      {pct >= 100 ? '✅ Achieved' : pct >= 70 ? '⚡ On Track' : '⚠️ Behind'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
