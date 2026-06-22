import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
const OWNER_EMAIL = 'cwsoundlab@gmail.com'
const FROM_EMAIL = 'bookings@cwsoundlab.com'

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json()
  if (!sessionId) return NextResponse.json({ error: 'Missing session ID' }, { status: 400 })

  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('stripe_session_id', sessionId)
    .single()

  if (error || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  if (booking.status === 'cancelled') {
    return NextResponse.json({ error: 'Already cancelled' }, { status: 400 })
  }

  await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('stripe_session_id', sessionId)

  const formattedDate = booking.date
    ? new Date(booking.date + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      })
    : 'TBD'

  await Promise.all([
    resend.emails.send({
      from: FROM_EMAIL,
      to: booking.customer_email,
      subject: 'Your CW Soundlab Booking Has Been Cancelled',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;padding:32px;">
          <div style="background:#000;padding:24px 32px;margin-bottom:0;">
            <h1 style="color:#fff;font-size:22px;margin:0;letter-spacing:2px;">CW SOUNDLAB</h1>
          </div>
          <div style="border-left:4px solid #B91C1C;padding:24px 32px;background:#fafafa;">
            <p style="color:#111;font-size:15px;margin:0 0 16px;">Hi ${booking.customer_name},</p>
            <p style="color:#374151;font-size:14px;margin:0 0 16px;">Your booking has been cancelled.</p>
            <table style="width:100%;border-collapse:collapse;margin:0 0 16px;">
              <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;">Service</td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#111;font-size:13px;text-align:right;">${booking.service_name}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;">Date</td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#111;font-size:13px;text-align:right;">${formattedDate}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;">Time</td><td style="padding:8px 0;color:#111;font-size:13px;text-align:right;">${booking.time}</td></tr>
            </table>
            <p style="color:#6b7280;font-size:13px;">Please note: deposits are non-refundable if cancelled within 24 hours of the session. If you have questions, reply to this email or contact us at cwsoundlab@gmail.com.</p>
            <p style="color:#6b7280;font-size:13px;margin:16px 0 0;">Want to rebook? <a href="https://cwsoundlab.com/booking" style="color:#B91C1C;">Book a new session here.</a></p>
          </div>
        </div>
      `,
    }),
    resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      subject: `Booking Cancelled: ${booking.service_name} on ${formattedDate}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;">
          <h2 style="color:#B91C1C;">Booking Cancelled</h2>
          <p><strong>${booking.customer_name}</strong> (${booking.customer_email}) cancelled their booking.</p>
          <p>Service: ${booking.service_name}<br/>Date: ${formattedDate}<br/>Time: ${booking.time}</p>
          <p style="color:#6b7280;font-size:13px;">The slot is now available to rebook.</p>
        </div>
      `,
    }),
  ])

  return NextResponse.json({ success: true })
}
