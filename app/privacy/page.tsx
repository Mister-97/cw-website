import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | CW Soundlab Chicago',
  description: 'Privacy policy for CW Soundlab recording studio in Chicago, IL.',
  robots: { index: false, follow: false },
}

const sections = [
  {
    title: 'Information We Collect',
    body: 'When you book a session or sign up for Soundlab Member, we collect your name, email address, and phone number. Payment information is processed securely by Stripe and is never stored on our servers. We may also collect basic usage data from our website such as pages visited and browser type.',
  },
  {
    title: 'How We Use Your Information',
    body: 'We use your information to confirm and manage your bookings, send booking confirmation and cancellation emails, deliver your Soundlab Member benefits including the monthly beat download, and communicate about your session or membership. We do not sell your personal information to third parties.',
  },
  {
    title: 'Email Communications',
    body: 'By booking a session or joining Soundlab Member, you agree to receive transactional emails related to your booking or membership. These include confirmation emails, cancellation notices, and membership welcome emails. You can opt out of non-transactional communications at any time by emailing cwsoundlab@gmail.com.',
  },
  {
    title: 'Third-Party Services',
    body: 'We use Stripe for payment processing, Supabase for data storage, and Resend for transactional email delivery. These services have their own privacy policies and security practices. We share only the information necessary to provide our services.',
  },
  {
    title: 'Data Retention',
    body: 'Booking records are retained for a minimum of two years for business and accounting purposes. Member records are retained while your subscription is active and for a reasonable period after cancellation. You may request deletion of your data by emailing cwsoundlab@gmail.com.',
  },
  {
    title: 'Cookies',
    body: 'Our website uses session storage (not persistent cookies) to remember whether you have dismissed the announcement banner. No tracking cookies or advertising pixels are used on this website.',
  },
  {
    title: 'Security',
    body: 'We take reasonable measures to protect your personal information. All data is transmitted over HTTPS. Payment data is handled exclusively by Stripe and is PCI-compliant. We do not store credit card numbers or payment details.',
  },
  {
    title: 'Your Rights',
    body: 'You have the right to request access to the personal information we hold about you, request correction of inaccurate information, and request deletion of your data where we are not legally required to retain it. Contact us at cwsoundlab@gmail.com to exercise any of these rights.',
  },
  {
    title: 'Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised date. Continued use of our services after changes are posted constitutes acceptance of the updated policy.',
  },
  {
    title: 'Contact',
    body: 'For any privacy-related questions or requests, contact us at cwsoundlab@gmail.com.',
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black pt-40 md:pt-32 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-cw-red font-heading tracking-[0.5em] uppercase text-xs mb-3">Legal</p>
          <h1 className="font-heading text-5xl text-white leading-none">Privacy Policy</h1>
          <p className="font-body text-white/30 text-xs mt-3">Last updated: June 2026</p>
        </div>
      </div>
      <div className="h-1.5 bg-cw-red" />

      <div className="max-w-3xl mx-auto px-4 py-14">
        {sections.map((s) => (
          <div key={s.title} className="mb-8">
            <h2 className="font-heading text-lg text-black mb-2">{s.title}</h2>
            <p className="font-body text-gray-600 text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
        <div className="border-t border-black/10 pt-8 mt-8">
          <Link href="/terms" className="font-body text-sm text-cw-red hover:underline mr-6">Terms of Use</Link>
          <Link href="/" className="font-body text-sm text-gray-500 hover:text-black">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
