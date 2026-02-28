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
  const [usersRes, apptRes, stylistRes] = await Promise.all([
    supabaseAdmin.from('profiles').select('id', { count: 'exact' }),
    supabaseAdmin.from('appointments').select('id', { count: 'exact' }),
    supabaseAdmin.from('stylists').select('id', { count: 'exact' }),
  ])
  return NextResponse.json({ demo, users: usersRes.count, appointments: apptRes.count, stylists: stylistRes.count })
}
