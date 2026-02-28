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
  const url = new URL(req.url)
  const page = Number(url.searchParams.get('page') || 1)
  const limit = Number(url.searchParams.get('limit') || 20)
  const demo = !process.env.ADMIN_API_KEY
  const from = (page - 1) * limit
  const { data, count } = await supabaseAdmin.from('profiles').select('*', { count: 'exact' }).range(from, from + limit - 1)
  return NextResponse.json({ demo, data, total: count, page, limit, totalPages: Math.ceil((count || 0) / limit) })
}
