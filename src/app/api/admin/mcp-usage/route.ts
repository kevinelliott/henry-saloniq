import { NextResponse } from 'next/server'

function checkAuth(req: Request) {
  const key = req.headers.get('X-Admin-Key') || req.headers.get('x-admin-key')
  const expected = process.env.ADMIN_API_KEY || ''
  if (!expected) return true
  return key === expected
}

export async function GET(req: Request) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ demo: !process.env.ADMIN_API_KEY, data: [], topTools: ['get_stats', 'add_appointment', 'get_stylists'], total: 0 })
}
