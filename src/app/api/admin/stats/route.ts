import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function checkAuth(req: Request) {
  const key = req.headers.get('X-Admin-Key') || req.headers.get('x-admin-key')
  const expected = process.env.ADMIN_API_KEY || ''
  if (!expected) return true
  return key === expected
}

export async function GET(req: Request) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const demo = !process.env.ADMIN_API_KEY
  const [usersRes, apptRes, stylistRes, goalRes] = await Promise.all([
    supabaseAdmin.from('profiles').select('id', { count: 'exact' }),
    supabaseAdmin.from('appointments').select('status, price'),
    supabaseAdmin.from('stylists').select('id', { count: 'exact' }),
    supabaseAdmin.from('revenue_goals').select('goal_amount'),
  ])
  const appts = apptRes.data || []
  const totalRevenue = appts.filter(a => a.status === 'completed').reduce((s, a) => s + Number(a.price), 0)
  const noShowRate = appts.length > 0 ? Math.round((appts.filter(a => a.status === 'no_show').length / appts.length) * 100) : 0
  return NextResponse.json({ demo, users: usersRes.count, appointments: apptRes.count, stylists: stylistRes.count, totalRevenue, noShowRate, goals: goalRes.count })
}
