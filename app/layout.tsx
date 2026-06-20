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
  title: 'CW Soundlabs | Chicago Recording Studio',
  description:
    "Chicago's premier recording studio. Book professional recording sessions, custom beat production, mixing & mastering. CW Soundlabs — where Chicago artists create.",
  keywords:
    'recording studio chicago, music studio chicago, CW Soundlabs, beat production chicago, mixing mastering chicago',
  openGraph: {
    title: 'CW Soundlabs | Chicago Recording Studio',
    description: "Chicago's premier recording studio. Book your session today.",
    type: 'website',
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
