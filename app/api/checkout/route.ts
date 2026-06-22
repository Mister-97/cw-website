import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const stripe = new Stripe(secretKey)

  try {
    const body = await req.json()
    const { serviceId, serviceName, price, date, time, name, email, phone, notes, addMembership } = body as {
      serviceId: string
      serviceName: string
      price: number
      date: string
      time: string
      name: string
      email: string
      phone: string
      notes?: string
      addMembership?: boolean
    }

    if (!serviceName || !price || !date || !time || !name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const origin = req.headers.get('origin') ?? 'http://localhost:3000'

    // Check if active member with at least 1 prior session (discount starts on 2nd booking)
    const { data: member } = await supabase
      .from('members')
      .select('session_count')
      .eq('email', email)
      .eq('status', 'active')
      .single()

    const isMemberDiscount = member && member.session_count >= 1
    const discountedPrice = isMemberDiscount ? Math.round(price * 0.9) : price
    const deposit = Math.round(discountedPrice / 2)

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `CW Soundlab ${serviceName}: 50% Deposit${isMemberDiscount ? ' (Member 10% off)' : ''}`,
            description: `Session on ${date} at ${time}. Remaining $${deposit} due in cash at the studio.`,
          },
          unit_amount: deposit * 100,
        },
        quantity: 1,
      },
    ]

    // When the artist checks "add membership", include $9.99 as a line item.
    // The webhook will auto-create the Stripe subscription with a 30-day trial
    // so they are not charged again until next month.
    if (addMembership && !member) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Soundlab Member: First Month',
            description: '10% off sessions, 1 WAV lease beat/month, partner discounts. Renews at $9.99/month. Cancel anytime.',
          },
          unit_amount: 999,
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: email,
      metadata: {
        serviceId: serviceId ?? '',
        serviceName,
        name,
        email,
        phone,
        date,
        time,
        notes: notes ?? '',
        fullPrice: String(discountedPrice),
        deposit: String(deposit),
        addMembership: addMembership && !member ? 'true' : 'false',
      },
      success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
