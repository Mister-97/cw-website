import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="h-1.5 bg-cw-red" />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <p className="font-heading text-cw-red tracking-[0.5em] uppercase text-xs mb-4">404</p>
          <h1 className="font-heading text-7xl md:text-9xl text-white leading-none mb-4">
            Lost.
          </h1>
          <p className="font-body text-white/40 text-sm leading-relaxed mb-10 max-w-xs mx-auto">
            This page does not exist. The studio is still open though, 8AM to 2AM.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-cw-red hover:bg-white hover:text-black text-white font-heading text-xs px-10 py-4 tracking-widest uppercase transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/booking"
              className="border-2 border-white/20 hover:border-white text-white/50 hover:text-white font-heading text-xs px-10 py-4 tracking-widest uppercase transition-colors"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </div>
      <div className="h-1.5 bg-cw-red" />
    </div>
  )
}
