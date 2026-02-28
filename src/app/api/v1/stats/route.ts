import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const userId = url.searchParams.get('user_id')
  if (!userId) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7)

  const [apptRes, stylistRes] = await Promise.all([
    supabaseAdmin.from('appointments').select('*').eq('user_id', userId),
    supabaseAdmin.from('stylists').select('*').eq('user_id', userId).eq('active', true),
  ])

  const appts = apptRes.data || []
  const stylists = stylistRes.data || []

  const todayRevenue = appts.filter(a => a.scheduled_at.startsWith(todayStr) && a.status === 'completed').reduce((s: number, a: { price: number }) => s + Number(a.price), 0)
  const monthRevenue = appts.filter(a => a.scheduled_at.startsWith(monthStr) && a.status === 'completed').reduce((s: number, a: { price: number }) => s + Number(a.price), 0)
  const weekAppts = appts.filter(a => new Date(a.scheduled_at) >= weekAgo && a.status !== 'cancelled')
  const availableSlots = stylists.length * 35
  const utilizationPct = availableSlots > 0 ? Math.round((weekAppts.length / availableSlots) * 100) : 0
  const monthAppts = appts.filter(a => a.scheduled_at.startsWith(monthStr))
  const noShowRate = monthAppts.length > 0 ? Math.round((monthAppts.filter(a => a.status === 'no_show').length / monthAppts.length) * 100) : 0

  return NextResponse.json({ todayRevenue, monthRevenue, utilizationPct, noShowRate, stylistCount: stylists.length })
}
