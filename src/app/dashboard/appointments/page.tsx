'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Appointment, Stylist, AppointmentStatus } from '@/types'

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  completed: 'bg-green-100 text-green-700',
  no_show: 'bg-red-100 text-red-700',
  cancelled: 'bg-amber-100 text-amber-700',
  scheduled: 'bg-blue-100 text-blue-700',
}

const SERVICES = ['Haircut', 'Color', 'Highlights', 'Blowout', 'Perm', 'Treatment', 'Extensions', 'Wax', 'Facial', 'Massage', 'Manicure', 'Pedicure']

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    stylist_id: '', client_name: '', service: 'Haircut',
    price: '', scheduled_at: new Date().toISOString().slice(0, 16), status: 'scheduled' as AppointmentStatus
  })

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const [apptRes, stylistRes] = await Promise.all([
      supabase.from('appointments').select('*, stylist:stylists(name)').eq('user_id', user.id).order('scheduled_at', { ascending: false }).limit(100),
      supabase.from('stylists').select('*').eq('user_id', user.id).eq('active', true),
    ])
    setAppointments(apptRes.data || [])
    setStylists(stylistRes.data || [])
    if ((stylistRes.data || []).length > 0) setForm(f => ({ ...f, stylist_id: stylistRes.data![0].id }))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function addAppointment(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('appointments').insert({ ...form, user_id: user.id, price: Number(form.price) })
    setShowAdd(false); setSaving(false)
    load()
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500 text-sm mt-1">Full appointment log</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + New Appointment
        </button>
      </div>

      {showAdd && (
        <form onSubmit={addAppointment} className="bg-white border border-gray-200 rounded-xl p-6 mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stylist</label>
            <select value={form.stylist_id} onChange={e => setForm(f => ({ ...f, stylist_id: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required>
              {stylists.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
            <input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="Client name" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
            <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              {SERVICES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="85" min="0" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
            <input type="datetime-local" value={form.scheduled_at} onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as AppointmentStatus }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="no_show">No Show</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="col-span-2 md:col-span-3 flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium">Save</button>
            <button type="button" onClick={() => setShowAdd(false)} className="border border-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Date', 'Client', 'Stylist', 'Service', 'Price', 'Status'].map(h => (
                <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {appointments.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No appointments yet.</td></tr>
            ) : appointments.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-600">{new Date(a.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.client_name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{(a.stylist as unknown as Stylist)?.name || '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{a.service}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">${Number(a.price).toFixed(0)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_STYLES[a.status]}`}>
                    {a.status.replace('_', ' ')}
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
