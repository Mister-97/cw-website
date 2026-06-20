export interface Service {
  id: string
  name: string
  description: string
  duration: string
  durationMins: number
  price: number
  priceNote?: string
  category: 'recording' | 'production' | 'post' | 'content'
  featured?: boolean
  includes?: string[]
  bestFor?: string
}

export const services: Service[] = [
  {
    id: 'quick-song',
    name: 'Record a Quick Song',
    description: 'Come in for a quick session and knock out one song. Perfect for artists who know exactly what they want.',
    duration: '1.5 hrs',
    durationMins: 90,
    price: 65,
    category: 'recording',
  },
  {
    id: 'early-bird',
    name: 'Early Bird Session',
    description: '2-hour session block at a discounted rate. Must start before 1PM — early bird gets the beat.',
    duration: '2 hrs',
    durationMins: 120,
    price: 80,
    category: 'recording',
    featured: true,
  },
  {
    id: 'recording-2hr',
    name: '2hr Recording Session',
    description: 'Perfect for singles, punch-ins, freestyles, hooks, or quick vocal sessions. Come prepared and lock in with professional sound in a creative environment.',
    duration: '2 hrs',
    durationMins: 120,
    price: 100,
    category: 'recording',
    includes: ['Professional recording', 'Basic vocal leveling', 'Session file save'],
    bestFor: '1 song or quick vocal work',
  },
  {
    id: 'recording-3hr',
    name: '3hr Recording Session',
    description: 'Three hours of uninterrupted professional studio time to dig into your music.',
    duration: '3 hrs',
    durationMins: 180,
    price: 150,
    category: 'recording',
  },
  {
    id: 'recording-4hr',
    name: '4hr Recording Session',
    description: 'The perfect balance for serious artists looking to fully lock into their sound without feeling rushed. Ideal for multiple songs, vocal layering, and creative experimentation.',
    duration: '4 hrs',
    durationMins: 240,
    price: 200,
    category: 'recording',
    featured: true,
    includes: ['Professional recording', 'Vocal arrangement assistance', 'Rough mix preview', 'Session file save'],
    bestFor: '2-4 songs or full creative sessions',
  },
  {
    id: 'full-day',
    name: '8 Hour Full Studio Day',
    description: 'Built for artists ready to create at a high level. A full day to record, shoot content, experiment with sounds, and focus on your music without watching the clock.',
    duration: '8 hrs',
    durationMins: 480,
    price: 400,
    category: 'recording',
    featured: true,
    includes: ['Full-day studio access', 'Professional engineering', 'Priority session workflow', 'Creative flexibility', 'Rough mixes included'],
    bestFor: 'EPs, albums, content days, or serious artist development',
  },
  {
    id: 'custom-production',
    name: 'Recording + Custom Production',
    description: 'Bring your vision to life with a complete session that includes custom beat production tailored to your unique sound. Our producers build your beat, then you record — all in one session.',
    duration: '2 hrs',
    durationMins: 120,
    price: 200,
    category: 'production',
    featured: true,
    includes: ['Custom beat creation', 'Full recording session', 'Artist collaboration', 'Session file save'],
  },
  {
    id: 'custom-beat',
    name: 'Custom Beat Production',
    description: 'A sound built specifically around your vision and style. Perfect for artists wanting original production tailored to their voice and brand.',
    duration: '2 hrs',
    durationMins: 120,
    price: 140,
    category: 'production',
    includes: ['Custom production', 'Artist collaboration', 'Revisions included', 'WAV delivery'],
  },
  {
    id: 'beats-lease',
    name: 'Beats for Lease',
    description: 'Wide selection of professional beats available for immediate lease. Starting at $150.',
    duration: '30 mins',
    durationMins: 30,
    price: 150,
    priceNote: 'From $150',
    category: 'production',
  },
  {
    id: 'beat-license',
    name: 'Beat License',
    description: 'Secure the rights to your selected beat for your upcoming release. High-quality production ready for recording and distribution. Exclusive rights available upon request.',
    duration: '30 mins',
    durationMins: 30,
    price: 0,
    priceNote: 'Price varies',
    category: 'production',
    includes: ['High-quality WAV file', 'MP3 version', 'Basic license agreement'],
  },
  {
    id: 'mixing-mastering',
    name: 'Mixing & Mastering',
    description: 'Take your song from demo quality to release-ready. Vocals and production balanced, cleaned, and enhanced for professional streaming across all major platforms.',
    duration: '3-5 business days',
    durationMins: 0,
    price: 175,
    category: 'post',
    includes: ['Vocal balancing', 'EQ & compression', 'Effects processing', 'Stereo mastering', 'Streaming-ready export'],
  },
  {
    id: 'bandlab-mix',
    name: 'BandLab Mix & Master',
    description: 'Recorded on BandLab and ready to level up? Bring your project in and we\'ll give it a professional finish.',
    duration: '1 hr',
    durationMins: 60,
    price: 60,
    category: 'post',
  },
  {
    id: 'show-mix',
    name: 'Show Mix / Live Set',
    description: 'Got a show with limited performance time? Let us put together your show mix so you sound great from the jump.',
    duration: '1 hr',
    durationMins: 60,
    price: 50,
    category: 'post',
  },
  {
    id: 'video-shoot',
    name: 'Lab Video Shoot',
    description: 'Come to the lab and get high-quality content for your next music video. Studio environment, professional lighting, real energy.',
    duration: '1 hr',
    durationMins: 60,
    price: 50,
    category: 'content',
  },
]

export const categories: Record<Service['category'], string> = {
  recording: 'Recording Sessions',
  production: 'Beat Production',
  post: 'Mix & Master',
  content: 'Content Creation',
}

export const bookableServices = services.filter((s) => s.price > 0)
