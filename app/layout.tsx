import type { Metadata } from 'next'
import { Oswald, Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Script from 'next/script'

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
  metadataBase: new URL('https://cwsoundlab.com'),
  title: {
    default: 'CW Soundlab | Recording Studio in Chicago, IL',
    template: '%s | CW Soundlab Chicago',
  },
  description:
    'CW Soundlab is Chicago\'s premier recording studio. Book professional recording sessions, custom beat production, mixing & mastering starting at $65. Located in Chicago, IL. Open 8AM–2AM.',
  keywords: [
    'recording studio chicago',
    'chicago recording studio',
    'music studio chicago il',
    'recording studio chicago il',
    'beat production chicago',
    'mixing mastering chicago',
    'cheap recording studio chicago',
    'affordable recording studio chicago',
    'rap studio chicago',
    'hip hop studio chicago',
    'chicago music production',
    'CW Soundlab',
    'studio time chicago',
    'record a song chicago',
    'chicago audio engineer',
    'Wizz chicago producer',
  ],
  authors: [{ name: 'CW Soundlab', url: 'https://cwsoundlab.com' }],
  creator: 'CW Soundlab',
  publisher: 'CW Soundlab',
  formatDetection: { telephone: true, address: true },
  alternates: { canonical: 'https://cwsoundlab.com' },
  openGraph: {
    title: 'CW Soundlab | Recording Studio in Chicago, IL',
    description: 'Chicago\'s premier recording studio. Sessions from $65. Book online in 2 minutes, open 8AM to 2AM.',
    type: 'website',
    url: 'https://cwsoundlab.com',
    siteName: 'CW Soundlab',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CW Soundlab Chicago Recording Studio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CW Soundlab | Recording Studio in Chicago, IL',
    description: 'Chicago\'s premier recording studio. Sessions from $65. Book online in 2 minutes.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'MusicStore',
  name: 'CW Soundlab',
  description: 'Professional recording studio in Chicago, IL. Recording sessions, beat production, mixing and mastering.',
  url: 'https://cwsoundlab.com',
  telephone: '',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Chicago',
    addressRegion: 'IL',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 41.8781,
    longitude: -87.6298,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '02:00',
    },
  ],
  priceRange: '$65–$400',
  servedCuisine: undefined,
  hasMap: 'https://maps.google.com/?q=CW+Soundlab+Chicago+IL',
  sameAs: [],
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '65',
    highPrice: '400',
    priceCurrency: 'USD',
    offerCount: '14',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable}`}>
      <head>
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="bg-white text-black antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
