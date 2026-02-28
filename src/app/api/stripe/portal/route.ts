import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { customerId } = await req.json()
  const stripeKey = process.env.STRIPE_SECRET_KEY || ''
  if (!stripeKey || stripeKey === 'sk_test_placeholder') {
    return NextResponse.json({ url: '/pricing?demo=true' })
  }
  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(stripeKey)
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })
  return NextResponse.json({ url: session.url })
}
