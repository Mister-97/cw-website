import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { name, email } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email required' }, { status: 400 })
  }

  const origin = req.headers.get('origin') ?? 'https://cwsoundlab.com'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: email,
    line_items: [{ price: process.env.STRIPE_MEMBERSHIP_PRICE_ID!, quantity: 1 }],
    metadata: { name, email },
    subscription_data: { metadata: { name, email } },
    success_url: `${origin}/member/welcome?email=${encodeURIComponent(email)}`,
    cancel_url: `${origin}/membership`,
  })

  return NextResponse.json({ url: session.url })
}
