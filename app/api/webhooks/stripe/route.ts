import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY!)

const OWNER_EMAIL = 'cwsoundlab@gmail.com'
const FROM_EMAIL = 'bookings@cwsoundlab.com'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  const snapshotSecret = process.env.STRIPE_WEBHOOK_SECRET_SNAPSHOT!
  const thinSecret = process.env.STRIPE_WEBHOOK_SECRET_THIN!

  let event: Stripe.Event
  let isThinPayload = false

  // Try snapshot secret first, then thin
  try {
    event = stripe.webhooks.constructEvent(body, sig, snapshotSecret)
  } catch {
    try {
      event = stripe.webhooks.constructEvent(body, sig, thinSecret)
      isThinPayload = true
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  // Thin payload only has the session ID — fetch the full session from Stripe
  let session: Stripe.Checkout.Session
  if (isThinPayload) {
    const partial = event.data.object as { id: string }
    session = await stripe.checkout.sessions.retrieve(partial.id, {
      expand: ['line_items'],
    })
  } else {
    session = event.data.object as Stripe.Checkout.Session
  }

  const meta = session.metadata ?? {}

  const booking = {
    stripe_session_id: session.id,
    service_id: meta.serviceId ?? '',
    service_name: meta.serviceName ?? '',
    price: session.amount_total ? Math.round(session.amount_total / 100) : 0,
    date: meta.date ?? '',
    time: meta.time ?? '',
    customer_name: meta.name ?? '',
    customer_email: session.customer_email ?? meta.email ?? '',
    customer_phone: meta.phone ?? '',
    notes: meta.notes ?? '',
    status: 'confirmed',
  }

  // Upsert so duplicate webhook deliveries don't create duplicate rows
  const { error: dbError } = await supabase
    .from('bookings')
    .upsert(booking, { onConflict: 'stripe_session_id' })

  if (dbError) {
    console.error('DB upsert error:', dbError)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  const formattedDate = booking.date
    ? new Date(booking.date + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'TBD'

  await Promise.all([
    resend.emails.send({
      from: FROM_EMAIL,
      to: booking.customer_email,
      subject: `You're Booked at CW Soundlab — ${formattedDate}`,
      html: customerEmailHtml({
        name: booking.customer_name,
        service: booking.service_name,
        date: formattedDate,
        time: booking.time,
        price: booking.price,
        notes: booking.notes,
      }),
    }),
    resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      subject: `New Booking — ${booking.service_name} on ${formattedDate}`,
      html: ownerEmailHtml({
        name: booking.customer_name,
        email: booking.customer_email,
        phone: booking.customer_phone,
        service: booking.service_name,
        date: formattedDate,
        time: booking.time,
        price: booking.price,
        notes: booking.notes,
      }),
    }),
  ])

  return NextResponse.json({ received: true })
}

function customerEmailHtml(d: {
  name: string
  service: string
  date: string
  time: string
  price: number
  notes: string
}) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#fff;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="background:#000;padding:32px;text-align:center;margin-bottom:32px;">
      <p style="color:#e11d48;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 8px;">CW Soundlab · Chicago, IL</p>
      <h1 style="color:#fff;font-size:32px;margin:0;">You're Booked!</h1>
    </div>

    <p style="color:#374151;font-size:15px;line-height:1.6;">Hey ${d.name},</p>
    <p style="color:#374151;font-size:15px;line-height:1.6;">Your session is confirmed and locked in. Here are your booking details:</p>

    <div style="border:2px solid #000;padding:24px;margin:24px 0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Service</td><td style="padding:8px 0;color:#111;font-size:13px;font-weight:bold;text-align:right;">${d.service}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Date</td><td style="padding:8px 0;color:#111;font-size:13px;text-align:right;">${d.date}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Time</td><td style="padding:8px 0;color:#111;font-size:13px;text-align:right;">${d.time}</td></tr>
        <tr style="border-top:1px solid #e5e7eb;"><td style="padding:12px 0 0;color:#111;font-size:15px;font-weight:bold;">Total Paid</td><td style="padding:12px 0 0;color:#e11d48;font-size:22px;font-weight:bold;text-align:right;">$${d.price}</td></tr>
      </table>
    </div>

    ${d.notes ? `<p style="color:#374151;font-size:14px;"><strong>Your notes:</strong> ${d.notes}</p>` : ''}

    <div style="background:#f9fafb;border-left:4px solid #e11d48;padding:16px;margin:24px 0;">
      <p style="margin:0;color:#374151;font-size:13px;line-height:1.6;">
        <strong>Studio Location:</strong> Chicago, IL<br>
        Questions? Reply to this email or call us directly.
      </p>
    </div>

    <p style="color:#374151;font-size:15px;line-height:1.6;">See you in the lab.</p>
    <p style="color:#374151;font-size:15px;font-weight:bold;">— CW Soundlab</p>

    <div style="border-top:1px solid #e5e7eb;margin-top:32px;padding-top:16px;">
      <p style="color:#9ca3af;font-size:11px;text-align:center;">CW Soundlab · Chicago, IL · cwsoundlab.com</p>
    </div>
  </div>
</body>
</html>`
}

function ownerEmailHtml(d: {
  name: string
  email: string
  phone: string
  service: string
  date: string
  time: string
  price: number
  notes: string
}) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#fff;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="background:#e11d48;padding:24px;margin-bottom:32px;">
      <h1 style="color:#fff;font-size:24px;margin:0;">New Booking</h1>
      <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:4px 0 0;">Payment confirmed via Stripe</p>
    </div>

    <div style="border:2px solid #000;padding:24px;margin-bottom:24px;">
      <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#6b7280;margin:0 0 16px;">Session Details</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Service</td><td style="padding:8px 0;color:#111;font-size:13px;font-weight:bold;text-align:right;">${d.service}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Date</td><td style="padding:8px 0;color:#111;font-size:13px;text-align:right;">${d.date}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Time</td><td style="padding:8px 0;color:#111;font-size:13px;text-align:right;">${d.time}</td></tr>
        <tr style="border-top:1px solid #e5e7eb;"><td style="padding:12px 0 0;color:#111;font-weight:bold;">Amount</td><td style="padding:12px 0 0;color:#e11d48;font-size:20px;font-weight:bold;text-align:right;">$${d.price}</td></tr>
      </table>
    </div>

    <div style="border:2px solid #000;padding:24px;">
      <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#6b7280;margin:0 0 16px;">Customer Info</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Name</td><td style="padding:6px 0;color:#111;font-size:13px;text-align:right;">${d.name}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Email</td><td style="padding:6px 0;color:#111;font-size:13px;text-align:right;"><a href="mailto:${d.email}" style="color:#e11d48;">${d.email}</a></td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;">Phone</td><td style="padding:6px 0;color:#111;font-size:13px;text-align:right;"><a href="tel:${d.phone}" style="color:#e11d48;">${d.phone}</a></td></tr>
        ${d.notes ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px;vertical-align:top;">Notes</td><td style="padding:6px 0;color:#111;font-size:13px;text-align:right;">${d.notes}</td></tr>` : ''}
      </table>
    </div>
  </div>
</body>
</html>`
}
