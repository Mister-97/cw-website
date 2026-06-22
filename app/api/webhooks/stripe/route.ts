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

  // Handle membership subscription events
  if (event.type === 'customer.subscription.created') {
    const sub = event.data.object as Stripe.Subscription
    const meta = sub.metadata ?? {}
    const email = meta.email ?? ''
    const name = meta.name ?? ''
    if (email) {
      const { data: member } = await supabase
        .from('members')
        .upsert({
          email,
          name,
          stripe_customer_id: String(sub.customer),
          stripe_subscription_id: sub.id,
          status: 'active',
        }, { onConflict: 'email' })
        .select('token')
        .single()

      if (member?.token) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: 'Welcome to Soundlab Member',
          html: memberWelcomeEmailHtml({ name, token: member.token }),
        })
      }
    }
    return NextResponse.json({ received: true })
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    await supabase
      .from('members')
      .update({ status: 'cancelled' })
      .eq('stripe_subscription_id', sub.id)
    return NextResponse.json({ received: true })
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

  // Skip subscription checkouts (handled above)
  if (session.mode === 'subscription') {
    return NextResponse.json({ received: true })
  }

  const meta = session.metadata ?? {}

  // Use the stored deposit from metadata so the $9.99 membership fee
  // does not inflate the depositPaid figure if addMembership was checked.
  const depositPaid = meta.deposit ? parseInt(meta.deposit) : (session.amount_total ? Math.round(session.amount_total / 100) : 0)
  const fullPrice = meta.fullPrice ? parseInt(meta.fullPrice) : depositPaid * 2

  const customerEmail = session.customer_email ?? meta.email ?? ''
  const customerName = meta.name ?? ''

  const booking = {
    stripe_session_id: session.id,
    service_id: meta.serviceId ?? '',
    service_name: meta.serviceName ?? '',
    price: fullPrice,
    date: meta.date ?? '',
    time: meta.time ?? '',
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: meta.phone ?? '',
    notes: meta.notes ?? '',
    status: 'confirmed',
  }

  // Increment session count if member
  await supabase.rpc('increment_member_sessions', { member_email: customerEmail }).maybeSingle()

  // Upsert so duplicate webhook deliveries don't create duplicate rows
  const { error: dbError } = await supabase
    .from('bookings')
    .upsert(booking, { onConflict: 'stripe_session_id' })

  if (dbError) {
    console.error('DB upsert error:', dbError)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  // Auto-create subscription with 30-day trial when membership was bundled in checkout.
  // The artist already paid $9.99 for month 1 so the trial covers month 1.
  if (meta.addMembership === 'true' && customerEmail) {
    try {
      const MEMBERSHIP_PRICE_ID = process.env.STRIPE_MEMBERSHIP_PRICE_ID ?? 'price_1Tl1FmJlW9Y88JKyFoHNB5x5'
      const trialEnd = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60

      // Find or create Stripe customer
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 })
      let customerId: string
      if (customers.data.length > 0) {
        customerId = customers.data[0].id
      } else {
        const customer = await stripe.customers.create({ email: customerEmail, name: customerName })
        customerId = customer.id
      }

      const sub = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: MEMBERSHIP_PRICE_ID }],
        trial_end: trialEnd,
        metadata: { email: customerEmail, name: customerName },
      })

      // Create member row and send welcome email
      const { data: newMember } = await supabase
        .from('members')
        .upsert({
          email: customerEmail,
          name: customerName,
          stripe_customer_id: customerId,
          stripe_subscription_id: sub.id,
          status: 'active',
        }, { onConflict: 'email' })
        .select('token')
        .single()

      if (newMember?.token) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: customerEmail,
          subject: 'Welcome to Soundlab Member',
          html: memberWelcomeEmailHtml({ name: customerName, token: newMember.token }),
        })
      }
    } catch (subErr) {
      console.error('Auto-subscription creation error:', subErr)
    }
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
      to: customerEmail,
      subject: `You're Booked at CW Soundlab: ${formattedDate}`,
      html: customerEmailHtml({
        name: booking.customer_name,
        service: booking.service_name,
        date: formattedDate,
        time: booking.time,
        depositPaid,
        remainingDue: fullPrice - depositPaid,
        notes: booking.notes,
      }),
    }),
    resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      subject: `New Booking: ${booking.service_name} on ${formattedDate}`,
      html: ownerEmailHtml({
        name: booking.customer_name,
        email: customerEmail,
        phone: booking.customer_phone,
        service: booking.service_name,
        date: formattedDate,
        time: booking.time,
        depositPaid,
        remainingDue: fullPrice - depositPaid,
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
  depositPaid: number
  remainingDue: number
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
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0 4px;color:#111;font-size:15px;font-weight:bold;">Deposit Paid</td>
          <td style="padding:12px 0 4px;color:#e11d48;font-size:22px;font-weight:bold;text-align:right;">$${d.depositPaid}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6b7280;font-size:13px;">Remaining (cash in studio)</td>
          <td style="padding:4px 0;color:#6b7280;font-size:13px;text-align:right;">$${d.remainingDue}</td>
        </tr>
      </table>
    </div>

    ${d.notes ? `<p style="color:#374151;font-size:14px;"><strong>Your notes:</strong> ${d.notes}</p>` : ''}

    <div style="background:#f9fafb;border-left:4px solid #e11d48;padding:16px;margin:24px 0;">
      <p style="margin:0;color:#374151;font-size:13px;line-height:1.6;">
        <strong>Studio Location:</strong> Chicago, IL<br>
        Please bring <strong>$${d.remainingDue} cash</strong> to complete your payment on the day of your session.<br>
        Questions? Reply to this email or call us directly.
      </p>
    </div>

    <p style="color:#374151;font-size:15px;line-height:1.6;">See you in the lab.</p>
    <p style="color:#374151;font-size:15px;font-weight:bold;">CW Soundlab</p>

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
  depositPaid: number
  remainingDue: number
  notes: string
}) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#fff;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="background:#e11d48;padding:24px;margin-bottom:32px;">
      <h1 style="color:#fff;font-size:24px;margin:0;">New Booking</h1>
      <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:4px 0 0;">$${d.depositPaid} deposit paid via Stripe · $${d.remainingDue} cash due in studio</p>
    </div>

    <div style="border:2px solid #000;padding:24px;margin-bottom:24px;">
      <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#6b7280;margin:0 0 16px;">Session Details</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Service</td><td style="padding:8px 0;color:#111;font-size:13px;font-weight:bold;text-align:right;">${d.service}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Date</td><td style="padding:8px 0;color:#111;font-size:13px;text-align:right;">${d.date}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Time</td><td style="padding:8px 0;color:#111;font-size:13px;text-align:right;">${d.time}</td></tr>
        <tr style="border-top:1px solid #e5e7eb;">
          <td style="padding:12px 0 4px;color:#111;font-weight:bold;">Deposit Received</td>
          <td style="padding:12px 0 4px;color:#e11d48;font-size:20px;font-weight:bold;text-align:right;">$${d.depositPaid}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6b7280;font-size:13px;">Cash Due in Studio</td>
          <td style="padding:4px 0;color:#6b7280;font-size:13px;text-align:right;">$${d.remainingDue}</td>
        </tr>
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

function memberWelcomeEmailHtml(d: { name: string; token: string }) {
  const portalUrl = `https://cwsoundlab.com/member?token=${d.token}`
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#000;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:40px;">
      <p style="color:#e11d48;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 12px;">CW Soundlab · Chicago, IL</p>
      <h1 style="color:#fff;font-size:36px;margin:0 0 4px;">Soundlab Member</h1>
      <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0;">Welcome to the lab, ${d.name}.</p>
    </div>

    <div style="background:#111;border:1px solid rgba(255,255,255,0.1);padding:28px;margin-bottom:24px;">
      <p style="color:#e11d48;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0 0 20px;">Your Member Perks</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#fff;font-size:14px;">10% off sessions</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.4);font-size:12px;text-align:right;">From your 2nd booking</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#fff;font-size:14px;">1 WAV lease beat / month</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.4);font-size:12px;text-align:right;">Delivered monthly</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#fff;font-size:14px;">10% off cleaning services</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:rgba(255,255,255,0.4);font-size:12px;text-align:right;">Partner discount</td></tr>
        <tr><td style="padding:10px 0;color:#fff;font-size:14px;">10% off logos, design & artwork</td><td style="padding:10px 0;color:rgba(255,255,255,0.4);font-size:12px;text-align:right;">Partner discount</td></tr>
      </table>
    </div>

    <div style="text-align:center;margin-bottom:32px;">
      <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:0 0 20px;">Access your member portal anytime with your personal link.</p>
      <a href="${portalUrl}" style="display:inline-block;background:#e11d48;color:#fff;font-size:13px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:16px 32px;">
        Open Member Portal
      </a>
      <p style="color:rgba(255,255,255,0.2);font-size:11px;margin:16px 0 0;">Bookmark this link, it's your key to all your perks.</p>
    </div>

    <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:20px;text-align:center;">
      <p style="color:rgba(255,255,255,0.2);font-size:11px;">CW Soundlab · Chicago, IL · cwsoundlab.com</p>
    </div>
  </div>
</body>
</html>`
}
