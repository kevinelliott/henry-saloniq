'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Stylist, Appointment } from '@/types'

interface StylistStats {
  stylist: Stylist
  revenue: number
  appointmentCount: number
  avgTicket: number
  noShowRate: number
}

export default function StylistsPage() {
  const [stylistStats, setStylistStats] = useState<StylistStats[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newHireDate, setNewHireDate] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const [stylistRes, apptRes] = await Promise.all([
      supabase.from('stylists').select('*').eq('user_id', user.id).eq('active', true),
      supabase.from('appointments').select('*').eq('user_id', user.id),
    ])
    const stylists: Stylist[] = stylistRes.data || []
    const appts: Appointment[] = apptRes.data || []
    const stats = stylists.map(s => {
      const sAppts = appts.filter(a => a.stylist_id === s.id)
      const completed = sAppts.filter(a => a.status === 'completed')
      const revenue = completed.reduce((sum, a) => sum + Number(a.price), 0)
      const noShows = sAppts.filter(a => a.status === 'no_show').length
      return {
        stylist: s,
        revenue,
        appointmentCount: completed.length,
        avgTicket: completed.length > 0 ? revenue / completed.length : 0,
        noShowRate: sAppts.length > 0 ? (noShows / sAppts.length) * 100 : 0,
      }
    }).sort((a, b) => b.revenue - a.revenue)
    setStylistStats(stats)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function addStylist(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('stylists').insert({ user_id: user.id, name: newName, hire_date: newHireDate, active: true })
    setNewName(''); setShowAdd(false); setSaving(false)
    load()
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stylists</h1>
          <p className="text-gray-500 text-sm mt-1">Performance breakdown by stylist</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Add Stylist
        </button>
      </div>

      {showAdd && (
        <form onSubmit={addStylist} className="bg-white border border-gray-200 rounded-xl p-6 mb-6 flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={newName} onChange={e => setNewName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Stylist name" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
            <input type="date" value={newHireDate} onChange={e => setNewHireDate(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <button type="submit" disabled={saving} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Save</button>
        </form>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Stylist', 'Revenue', 'Appointments', 'Avg Ticket', 'No-Show Rate'].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stylistStats.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No stylists yet. Add your first stylist above.</td></tr>
            ) : stylistStats.map((s, i) => (
              <tr key={s.stylist.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm">#{i + 1}</span>
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold text-sm">{s.stylist.name[0]}</div>
                    <span className="font-medium text-gray-900">{s.stylist.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-green-600">${s.revenue.toFixed(0)}</td>
                <td className="px-6 py-4 text-gray-700">{s.appointmentCount}</td>
                <td className="px-6 py-4 text-gray-700">${s.avgTicket.toFixed(0)}</td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${s.noShowRate > 18 ? 'text-red-600' : 'text-green-600'}`}>
                    {s.noShowRate.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
