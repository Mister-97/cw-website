import type { Metadata } from 'next'
import { Suspense } from 'react'
import BookingForm from './BookingForm'

export const metadata: Metadata = {
  title: 'Book a Recording Session in Chicago | CW Soundlab',
  description:
    'Book a professional recording session at CW Soundlab in Chicago, IL. Sessions from $65. Choose your service, pick a date and time, and pay your 50% deposit online. Open 8AM–2AM.',
  alternates: { canonical: 'https://cwsoundlab.com/booking' },
  openGraph: {
    title: 'Book a Recording Session in Chicago | CW Soundlab',
    description: 'Sessions from $65. Book online in 2 minutes. Open 8AM–2AM in Chicago, IL.',
    url: 'https://cwsoundlab.com/booking',
  },
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <BookingForm />
    </Suspense>
  )
}
