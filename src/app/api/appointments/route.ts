import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const body = await req.json()
  const { user_id, stylist_id, client_name, service, price, scheduled_at, status = 'scheduled' } = body
  if (!user_id || !stylist_id || !client_name || !service || !price || !scheduled_at) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const { data, error } = await supabaseAdmin.from('appointments').insert({ user_id, stylist_id, client_name, service, price: Number(price), scheduled_at, status }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
