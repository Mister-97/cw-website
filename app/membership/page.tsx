import type { Metadata } from 'next'
import MembershipClient from './MembershipClient'

export const metadata: Metadata = {
  title: 'Soundlab Member | CW Soundlab Chicago',
  description:
    'Join Soundlab Member for $9.99/month. Get 10% off recording sessions, a free WAV lease beat every month, and partner discounts on cleaning, design and artwork in Chicago.',
  alternates: { canonical: 'https://cwsoundlab.com/membership' },
  openGraph: {
    title: 'Soundlab Member | CW Soundlab Chicago',
    description: '$9.99/month. 10% off sessions, monthly beat, partner discounts.',
    url: 'https://cwsoundlab.com/membership',
  },
}

export default function MembershipPage() {
  return <MembershipClient />
}
