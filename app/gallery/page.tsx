import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Studio Gallery | CW Soundlab Chicago Recording Studio',
  description:
    'Photos inside CW Soundlab, a professional recording studio in Chicago, IL. See the booth, control room, lounge and equipment.',
  alternates: { canonical: 'https://cwsoundlab.com/gallery' },
  openGraph: {
    title: 'Studio Gallery | CW Soundlab Chicago',
    description: 'Inside CW Soundlab, a professional recording studio in Chicago, IL.',
    url: 'https://cwsoundlab.com/gallery',
  },
}

const photos = [
  {
    src: '/gallery/studio-setup.png',
    alt: 'CW Soundlab control room with KRK monitors and dual screens',
    label: 'Control Room',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    src: '/gallery/vocal-booth.png',
    alt: 'Vocal booth with geometric acoustic panels and condenser mic',
    label: 'Vocal Booth',
    span: '',
  },
  {
    src: '/gallery/lounge.png',
    alt: 'Studio lounge with hexagonal LED lights and leather sofa',
    label: 'Artist Lounge',
    span: '',
  },
  {
    src: '/gallery/control-room.png',
    alt: 'CW Soundlab recording setup with KRK studio monitors',
    label: 'Recording Setup',
    span: 'md:col-span-2',
  },
]

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black pt-40 md:pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-cw-red font-heading tracking-[0.4em] uppercase text-xs mb-4">
            The Studio
          </p>
          <h1 className="font-heading text-6xl md:text-8xl text-white leading-none">Gallery</h1>
          <div className="w-20 h-1 bg-cw-red mx-auto mt-6" />
          <p className="font-body text-white/50 mt-6 text-base max-w-xl mx-auto">
            Take a look inside CW Soundlab, where Chicago artists create their sound.
          </p>
        </div>
      </div>
      <div className="h-2 bg-cw-red" />

      {/* Photo grid */}
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[280px]">
          {photos.map((photo) => (
            <div
              key={photo.src}
              className={`${photo.span} relative overflow-hidden group border-2 border-black hover:border-cw-red transition-colors`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* Label overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-end">
                <div className="translate-y-full group-hover:translate-y-0 transition-transform duration-300 w-full p-4">
                  <p className="font-heading text-white text-lg tracking-widest uppercase">
                    {photo.label}
                  </p>
                  <div className="w-8 h-0.5 bg-cw-red mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 border-t-2 border-black/10 pt-12">
          <p className="text-cw-red font-heading text-xs tracking-widest uppercase mb-3">
            Ready to be in here?
          </p>
          <h2 className="font-heading text-4xl text-black mb-4">Book Your Session</h2>
          <p className="font-body text-gray-400 text-sm mb-8 max-w-sm mx-auto">
            Professional sound. Real energy. Chicago&apos;s best studio is ready for you.
          </p>
          <Link
            href="/booking"
            className="inline-block bg-cw-red hover:bg-black text-white font-heading text-sm px-12 py-4 tracking-widest uppercase transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  )
}
