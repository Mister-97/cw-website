import type { Metadata } from 'next'
import { Suspense } from 'react'
import SuccessClient from './SuccessClient'

export const metadata: Metadata = {
  title: 'Booking Confirmed | CW Soundlab',
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SuccessClient />
    </Suspense>
  )
}
