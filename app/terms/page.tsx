import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Use | CW Soundlab Chicago',
  description: 'Terms of use for CW Soundlab recording studio in Chicago, IL.',
  robots: { index: false, follow: false },
}

const sections = [
  {
    title: 'Acceptance of Terms',
    body: 'By booking a session, accessing cwsoundlab.com, or using any services provided by CW Soundlab, you agree to these Terms of Use. If you do not agree, do not use our services.',
  },
  {
    title: 'Booking and Payment',
    body: 'All sessions require a 50% non-refundable deposit paid online at the time of booking. The remaining 50% is due in cash at the studio before the session begins. Deposits are non-refundable if a session is cancelled within 24 hours of the scheduled start time. CW Soundlab reserves the right to cancel or reschedule any booking at its discretion with notice provided to the client.',
  },
  {
    title: 'Studio Conduct',
    body: 'Clients and their guests are expected to behave professionally and respectfully at all times. CW Soundlab reserves the right to terminate any session without refund if a client or their guests engage in disruptive, threatening, or illegal behavior. Illegal substances are strictly prohibited on the premises.',
  },
  {
    title: 'Equipment and Property',
    body: 'Clients are responsible for any damage caused to studio equipment, furnishings, or property by themselves or their guests. Damage will be billed at full replacement or repair cost. CW Soundlab is not liable for loss, theft, or damage to any personal items, instruments, hard drives, or equipment brought into the studio.',
  },
  {
    title: 'Intellectual Property',
    body: 'Clients retain ownership of the recordings made during their sessions. CW Soundlab may use session photos or brief audio clips for promotional purposes on social media and its website unless the client requests in writing at the time of booking that no promotional use be made.',
  },
  {
    title: 'Soundlab Member Subscription',
    body: 'The Soundlab Member program is a monthly subscription at $9.99 per month billed through Stripe. Membership benefits include a 10% session discount starting from the second booking, one WAV lease beat per month, and partner discounts. To cancel your membership, email cwsoundlab@gmail.com. Cancellation takes effect at the end of the current billing period. No refunds are issued for partial months.',
  },
  {
    title: 'Limitation of Liability',
    body: 'CW Soundlab is not liable for any indirect, incidental, or consequential damages arising from the use of our services, including loss of recordings due to equipment failure. Clients are encouraged to maintain personal backups of all recorded materials.',
  },
  {
    title: 'Changes to These Terms',
    body: 'CW Soundlab reserves the right to update these Terms of Use at any time. Continued use of our services after any changes constitutes acceptance of the updated terms.',
  },
  {
    title: 'Contact',
    body: 'Questions about these terms can be directed to cwsoundlab@gmail.com.',
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black pt-40 md:pt-32 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-cw-red font-heading tracking-[0.5em] uppercase text-xs mb-3">Legal</p>
          <h1 className="font-heading text-5xl text-white leading-none">Terms of Use</h1>
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
          <Link href="/privacy" className="font-body text-sm text-cw-red hover:underline mr-6">Privacy Policy</Link>
          <Link href="/" className="font-body text-sm text-gray-500 hover:text-black">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
