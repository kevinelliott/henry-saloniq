import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const { user_id } = await req.json()
  if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

  // Check if already seeded
  const { data: existing } = await supabaseAdmin.from('stylists').select('id').eq('user_id', user_id).limit(1)
  if (existing && existing.length > 0) return NextResponse.json({ message: 'Already seeded' })

  // Create profile
  await supabaseAdmin.from('profiles').upsert({ user_id, business_name: 'Luxe Salon & Spa' }, { onConflict: 'user_id' })

  // Create stylists
  const { data: stylists } = await supabaseAdmin.from('stylists').insert([
    { user_id, name: 'Emma Chen', hire_date: '2022-03-15', active: true },
    { user_id, name: 'Sofia Martinez', hire_date: '2021-06-01', active: true },
    { user_id, name: 'Marcus Williams', hire_date: '2023-01-10', active: true },
  ]).select()

  if (!stylists || stylists.length === 0) return NextResponse.json({ error: 'Failed to create stylists' }, { status: 500 })

  const [emma, sofia, marcus] = stylists

  const SERVICES = [
    { name: 'Haircut', price: 65 },
    { name: 'Color', price: 120 },
    { name: 'Highlights', price: 160 },
    { name: 'Blowout', price: 45 },
    { name: 'Treatment', price: 80 },
    { name: 'Extensions', price: 300 },
  ]
  const CLIENTS = ['Sarah L', 'Emily K', 'Jessica M', 'Amanda P', 'Rachel T', 'Olivia S', 'Hannah B', 'Mia C', 'Chloe D', 'Anna W', 'Grace F', 'Lily N']
  const STATUSES: ('completed' | 'no_show' | 'cancelled' | 'scheduled')[] = ['completed', 'completed', 'completed', 'completed', 'completed', 'completed', 'no_show', 'no_show', 'cancelled', 'scheduled']

  const appointments = []
  const now = new Date()

  for (let day = -30; day <= 2; day++) {
    const date = new Date(now)
    date.setDate(date.getDate() + day)
    const dayOfWeek = date.getDay()
    if (dayOfWeek === 0) continue // skip Sundays

    const stylisArr = [emma, sofia, marcus]
    for (const stylist of stylisArr) {
      const apptCount = Math.floor(Math.random() * 4) + 3 // 3-6 per stylist per day
      for (let i = 0; i < apptCount; i++) {
        const hour = 9 + Math.floor(Math.random() * 8)
        const service = SERVICES[Math.floor(Math.random() * SERVICES.length)]
        const status = day < 0 ? STATUSES[Math.floor(Math.random() * STATUSES.length)] : 'scheduled'
        const apptDate = new Date(date)
        apptDate.setHours(hour, 0, 0, 0)
        appointments.push({
          user_id,
          stylist_id: stylist.id,
          client_name: CLIENTS[Math.floor(Math.random() * CLIENTS.length)],
          service: service.name,
          price: service.price,
          scheduled_at: apptDate.toISOString(),
          status,
        })
      }
    }
  }

  await supabaseAdmin.from('appointments').insert(appointments)

  // Set monthly goals
  const months = [
    { month: `${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}`, goal_amount: 18000 },
    { month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`, goal_amount: 20000 },
  ]
  for (const m of months) {
    if (m.month.endsWith('-00')) continue
    await supabaseAdmin.from('revenue_goals').upsert({ user_id, ...m }, { onConflict: 'user_id,month' })
  }

  return NextResponse.json({ success: true, stylists: stylists.length, appointments: appointments.length })
}
