import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { priceId, userId } = await req.json()
  const stripeKey = process.env.STRIPE_SECRET_KEY || ''
  if (!stripeKey || stripeKey === 'sk_test_placeholder') {
    return NextResponse.json({ url: '/pricing?demo=true' })
  }
  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(stripeKey)
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: { userId: userId || '' },
  })
  return NextResponse.json({ url: session.url })
}
