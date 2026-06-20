import type { Metadata } from 'next'
import { Suspense } from 'react'
import BookingForm from './BookingForm'

export const metadata: Metadata = {
  title: 'Book a Session | CW Soundlab Chicago',
  description:
    'Book your recording session at CW Soundlab in Chicago. Select your service, pick a time, and pay securely with Stripe.',
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <BookingForm />
    </Suspense>
  )
}
