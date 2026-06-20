import type { Metadata } from 'next'
import { Oswald, Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  weight: ['400', '500', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'CW Soundlab - Chicago Recording Studio',
  description:
    "Chicago's premier recording studio. Book professional recording sessions, custom beat production, mixing and mastering. CW Soundlab is where Chicago artists create.",
  keywords:
    'recording studio chicago, music studio chicago, CW Soundlab, beat production chicago, mixing mastering chicago',
  openGraph: {
    title: 'CW Soundlab - Chicago Recording Studio',
    description: "Chicago's premier recording studio. Book your session today.",
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CW Soundlab - Chicago Recording Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CW Soundlab - Chicago Recording Studio',
    description: "Chicago's premier recording studio. Book your session today.",
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable}`}>
      <body className="bg-white text-black antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
