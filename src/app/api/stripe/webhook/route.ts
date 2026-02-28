import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature') || ''
  const secret = process.env.STRIPE_WEBHOOK_SECRET || ''
  if (!secret || secret === 'whsec_placeholder') return NextResponse.json({ received: true })
  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch { return new Response('Invalid signature', { status: 400 }) }
  switch (event.type) {
    case 'checkout.session.completed':
      // TODO: provision subscription
      break
    case 'customer.subscription.deleted':
      // TODO: downgrade user
      break
  }
  return NextResponse.json({ received: true })
}
