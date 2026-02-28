import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const TOOLS = [
  {
    name: 'get_stats',
    description: 'Get salon business intelligence stats including utilization, no-show rate, and revenue',
    inputSchema: { type: 'object', properties: { user_id: { type: 'string', description: 'The user/salon ID' } }, required: ['user_id'] },
  },
  {
    name: 'add_appointment',
    description: 'Add a new appointment to the salon',
    inputSchema: { type: 'object', properties: { user_id: { type: 'string' }, stylist_id: { type: 'string' }, client_name: { type: 'string' }, service: { type: 'string' }, price: { type: 'number' }, scheduled_at: { type: 'string', description: 'ISO8601 datetime' }, status: { type: 'string', enum: ['scheduled', 'completed', 'no_show', 'cancelled'] } }, required: ['user_id', 'stylist_id', 'client_name', 'service', 'price', 'scheduled_at'] },
  },
  {
    name: 'get_stylists',
    description: 'Get list of active stylists for a salon',
    inputSchema: { type: 'object', properties: { user_id: { type: 'string' } }, required: ['user_id'] },
  },
]

export async function POST(req: Request) {
  const body = await req.json()
  const { method, params, id } = body

  if (method === 'initialize') {
    return NextResponse.json({ jsonrpc: '2.0', id, result: { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'saloniq', version: '1.0.0' } } })
  }

  if (method === 'tools/list') {
    return NextResponse.json({ jsonrpc: '2.0', id, result: { tools: TOOLS } })
  }

  if (method === 'tools/call') {
    const { name, arguments: args } = params
    try {
      if (name === 'get_stats') {
        const { user_id } = args
        const [apptRes, stylistRes] = await Promise.all([
          supabaseAdmin.from('appointments').select('*').eq('user_id', user_id),
          supabaseAdmin.from('stylists').select('*').eq('user_id', user_id).eq('active', true),
        ])
        const appts = apptRes.data || []
        const stylists = stylistRes.data || []
        const now = new Date()
        const todayStr = now.toISOString().split('T')[0]
        const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7)
        const todayRevenue = appts.filter(a => a.scheduled_at.startsWith(todayStr) && a.status === 'completed').reduce((s: number, a: { price: number }) => s + Number(a.price), 0)
        const weekAppts = appts.filter(a => new Date(a.scheduled_at) >= weekAgo && a.status !== 'cancelled')
        const utilizationPct = stylists.length > 0 ? Math.round((weekAppts.length / (stylists.length * 35)) * 100) : 0
        const monthAppts = appts.filter(a => a.scheduled_at.startsWith(monthStr))
        const noShowRate = monthAppts.length > 0 ? Math.round((monthAppts.filter(a => a.status === 'no_show').length / monthAppts.length) * 100) : 0
        return NextResponse.json({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify({ todayRevenue, utilizationPct, noShowRate, stylistCount: stylists.length }) }] } })
      }
      if (name === 'add_appointment') {
        const { data, error } = await supabaseAdmin.from('appointments').insert({ ...args, price: Number(args.price), status: args.status || 'scheduled' }).select().single()
        if (error) throw new Error(error.message)
        return NextResponse.json({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(data) }] } })
      }
      if (name === 'get_stylists') {
        const { data } = await supabaseAdmin.from('stylists').select('*').eq('user_id', args.user_id).eq('active', true)
        return NextResponse.json({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(data || []) }] } })
      }
      return NextResponse.json({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Unknown tool' } })
    } catch (e: unknown) {
      return NextResponse.json({ jsonrpc: '2.0', id, error: { code: -32603, message: (e as Error).message } })
    }
  }

  return NextResponse.json({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } })
}

export async function GET() {
  return NextResponse.json({ name: 'SalonIQ MCP', version: '1.0.0', tools: TOOLS.map(t => t.name) })
}
