'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { bookableServices, Service } from '@/lib/services'
import BookingCalendar from '@/components/BookingCalendar'

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM',
  '11:00 PM', '12:00 AM', '1:00 AM', '2:00 AM',
]

type Step = 1 | 2 | 3

export default function BookingForm() {
  const searchParams = useSearchParams()
  const preselectedId = searchParams.get('service')

  const [step, setStep] = useState<Step>(1)
  const [selectedService, setSelectedService] = useState<Service | null>(
    bookableServices.find((s) => s.id === preselectedId) ?? null
  )
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })
  const [interestedInMembership, setInterestedInMembership] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (preselectedId && bookableServices.find((s) => s.id === preselectedId)) {
      setStep(2)
    }
  }, [preselectedId])

  useEffect(() => {
    if (!selectedDate) return
    setSlotsLoading(true)
    setSelectedTime('')
    fetch(`/api/bookings/slots?date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => setBookedSlots(data.slots ?? []))
      .catch(() => setBookedSlots([]))
      .finally(() => setSlotsLoading(false))
  }, [selectedDate])

  const canGoTo2 = selectedService !== null
  const canGoTo3 = selectedDate !== '' && selectedTime !== ''
  const canSubmit = form.name.trim() !== '' && form.email.trim() !== '' && form.phone.trim() !== '' && agreed

  function goBack() {
    if (step === 2) setStep(1)
    if (step === 3) setStep(2)
  }

  async function handleCheckout() {
    if (!selectedService) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          serviceName: selectedService.name,
          price: selectedService.price,
          date: selectedDate,
          time: selectedTime,
          name: form.name,
          email: form.email,
          phone: form.phone,
          notes: form.notes,
          addMembership: interestedInMembership,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Something went wrong. Please try again or call us directly.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formattedDate = selectedDate
    ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black pt-20 pb-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-cw-red font-heading tracking-[0.4em] uppercase text-xs mb-3">
            CW Soundlab · Chicago, IL
          </p>
          <h1 className="font-heading text-5xl md:text-6xl text-white">Book a Session</h1>
        </div>
      </div>
      <div className="h-1.5 bg-cw-red" />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center gap-0 mb-10">
          {([1, 2, 3] as Step[]).map((n) => (
            <div key={n} className="flex items-center">
              <button
                onClick={() => n < step && setStep(n)}
                disabled={n >= step}
                className={`w-10 h-10 font-heading text-sm border-2 transition-all duration-200 ${
                  step === n
                    ? 'bg-cw-red border-cw-red text-white'
                    : step > n
                    ? 'border-cw-red text-cw-red hover:bg-cw-red/10 cursor-pointer'
                    : 'border-black/20 text-gray-400 cursor-default'
                }`}
              >
                {n}
              </button>
              {n < 3 && (
                <div
                  className={`w-16 h-0.5 transition-colors duration-300 ${
                    step > n ? 'bg-cw-red' : 'bg-black/15'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 font-body text-xs tracking-widest uppercase mb-10">
          {step === 1 && 'Select service'}
          {step === 2 && 'Choose date & time'}
          {step === 3 && 'Your info & payment'}
        </p>

        {/* Step 1: Service */}
        {step === 1 && (
          <div>
            <div className="space-y-2">
              {bookableServices.map((service) => {
                const active = selectedService?.id === service.id
                return (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`w-full text-left border-2 p-5 transition-all duration-150 ${
                      active
                        ? 'border-cw-red bg-red-50'
                        : 'border-black/20 hover:border-black bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-4 h-4 border-2 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                          active ? 'border-cw-red' : 'border-gray-400'
                        }`}
                      >
                        {active && <div className="w-2 h-2 bg-cw-red rounded-full" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-heading text-base text-black leading-tight">{service.name}</p>
                          <p className="font-heading text-xl text-black flex-shrink-0">
                            {service.priceNote ?? `$${service.price}`}
                          </p>
                        </div>
                        <p className="text-cw-red font-body text-xs mt-0.5 font-semibold">{service.duration}</p>
                        {service.description && (
                          <p className="font-body text-gray-500 text-xs mt-2 leading-relaxed line-clamp-2">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => canGoTo2 && setStep(2)}
                disabled={!canGoTo2}
                className={`font-heading text-xs px-12 py-4 tracking-widest uppercase transition-colors ${
                  canGoTo2
                    ? 'bg-cw-red hover:bg-black text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div>
            <div className="bg-gray-50 border-2 border-black p-5 mb-8 flex items-center justify-between">
              <div>
                <p className="font-heading text-base text-black">{selectedService?.name}</p>
                <p className="font-body text-gray-500 text-xs mt-0.5">
                  {selectedService?.duration} &nbsp;&middot;&nbsp; ${selectedService?.price}
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="font-body text-gray-400 hover:text-cw-red text-xs underline underline-offset-4 transition-colors"
              >
                Change
              </button>
            </div>

            <div className="mb-8">
              <label className="block font-heading text-xs text-black tracking-widest uppercase mb-3">
                Select Date
              </label>
              <BookingCalendar value={selectedDate} onChange={setSelectedDate} />
            </div>

            <div className="mb-8">
              <label className="block font-heading text-xs text-black tracking-widest uppercase mb-3">
                Select Time
                {slotsLoading && (
                  <span className="ml-2 text-gray-400 normal-case font-body tracking-normal">
                    Checking availability...
                  </span>
                )}
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const booked = bookedSlots.includes(slot)
                  const selected = selectedTime === slot
                  return (
                    <button
                      key={slot}
                      onClick={() => !booked && setSelectedTime(slot)}
                      disabled={booked || slotsLoading}
                      title={booked ? 'Already booked' : undefined}
                      className={`font-body text-xs py-3 border-2 transition-colors ${
                        booked
                          ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                          : selected
                          ? 'bg-cw-red border-cw-red text-white'
                          : 'border-black/20 text-black hover:border-cw-red hover:text-cw-red'
                      }`}
                    >
                      {slot}
                    </button>
                  )
                })}
              </div>
              {selectedService?.id === 'early-bird' && (
                <p className="mt-3 text-xs text-amber-600 font-body">
                  * Early Bird session must start before 1:00 PM
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={goBack}
                className="font-heading text-xs px-8 py-4 tracking-widest uppercase border-2 border-black hover:border-cw-red hover:text-cw-red text-black transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => canGoTo3 && setStep(3)}
                disabled={!canGoTo3}
                className={`font-heading text-xs px-12 py-4 tracking-widest uppercase transition-colors ${
                  canGoTo3
                    ? 'bg-cw-red hover:bg-black text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Info + Payment */}
        {step === 3 && (
          <div>
            <div className="bg-black p-6 mb-8">
              <p className="text-cw-red font-heading text-xs tracking-widest uppercase mb-4">
                Booking Summary
              </p>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="font-body text-white/50">Service</span>
                  <span className="font-heading text-white">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-body text-white/50">Date</span>
                  <span className="font-body text-white">{formattedDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-body text-white/50">Time</span>
                  <span className="font-body text-white">{selectedTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-body text-white/50">Duration</span>
                  <span className="font-body text-white">{selectedService?.duration}</span>
                </div>
              </div>
              <div className="border-t border-white/15 mt-4 pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-heading text-sm text-white tracking-widest uppercase">Deposit Due Now</span>
                  <span className="font-heading text-3xl text-cw-red">${Math.round((selectedService?.price ?? 0) / 2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-xs text-white/40">Remaining (cash in studio)</span>
                  <span className="font-body text-sm text-white/40">${Math.round((selectedService?.price ?? 0) / 2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {[
                { key: 'name', label: 'Full Name *', type: 'text', placeholder: 'Your full name' },
                { key: 'email', label: 'Email *', type: 'email', placeholder: 'your@email.com' },
                { key: 'phone', label: 'Phone *', type: 'tel', placeholder: '(312) 555-0000' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block font-heading text-xs text-black tracking-widest uppercase mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="bg-white border-2 border-black focus:border-cw-red text-black font-body text-sm px-4 py-3.5 w-full outline-none transition-colors placeholder:text-gray-300"
                  />
                </div>
              ))}
              <div>
                <label className="block font-heading text-xs text-black tracking-widest uppercase mb-2">
                  Session Notes (optional)
                </label>
                <textarea
                  placeholder="Genre, number of songs, any special requests..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="bg-white border-2 border-black focus:border-cw-red text-black font-body text-sm px-4 py-3.5 w-full outline-none transition-colors placeholder:text-gray-300 resize-none"
                />
              </div>
            </div>

            {/* Membership upsell */}
            <div className={`mb-6 border-2 transition-colors ${interestedInMembership ? 'border-cw-red bg-red-50' : 'border-black/10 bg-gray-50'}`}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-cw-red text-white font-heading text-xs px-2 py-0.5 tracking-wider">MEMBER PERK</span>
                    </div>
                    <p className="font-heading text-base text-black">Save 10% on this session + every future session</p>
                  </div>
                  <p className="font-heading text-2xl text-black flex-shrink-0">$9.99<span className="text-gray-400 font-body text-xs">/mo</span></p>
                </div>
                <ul className="space-y-1 mb-4">
                  {['10% off from your 2nd session onwards', '1 free WAV lease beat every month', '10% off partner cleaning, design & artwork'].map(p => (
                    <li key={p} className="flex items-center gap-2 font-body text-xs text-gray-500">
                      <span className="w-1 h-1 bg-cw-red rounded-full flex-shrink-0" />{p}
                    </li>
                  ))}
                </ul>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setInterestedInMembership(v => !v)}
                    className={`w-4 h-4 border-2 flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer ${interestedInMembership ? 'bg-cw-red border-cw-red' : 'border-black/30'}`}
                  >
                    {interestedInMembership && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span onClick={() => setInterestedInMembership(v => !v)} className="font-body text-sm text-black cursor-pointer">
                    Yes, add Soundlab Member to my checkout — save 10% starting next session
                  </span>
                </label>
              </div>
            </div>

            {/* Studio liability disclaimer */}
            <div className="border-2 border-black p-4 mb-6 bg-gray-50">
              <p className="font-heading text-xs tracking-widest uppercase text-black mb-3">Studio Policy</p>
              <ul className="font-body text-xs text-gray-600 space-y-1.5 mb-4 leading-relaxed">
                <li>• All studio equipment must be handled with care. Do not touch or adjust gear without engineer approval.</li>
                <li>• CW Soundlab is not responsible for damage to personal instruments, hard drives, or equipment brought into the studio.</li>
                <li>• No food or drinks near studio equipment. Water bottles with lids are permitted.</li>
                <li>• Guests are limited to the number agreed upon at booking. Excessive guests may result in session termination without refund.</li>
                <li>• Illegal substances are strictly prohibited on the premises.</li>
                <li>• Any damage to studio equipment caused by the client or their guests will be billed at full replacement cost.</li>
                <li>• Sessions end at the scheduled time. Overtime is billed at the hourly rate and subject to availability.</li>
                <li>• The 50% deposit is non-refundable if cancelled within 24 hours of the session.</li>
              </ul>
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  onClick={() => setAgreed(a => !a)}
                  className={`mt-0.5 w-4 h-4 border-2 flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer ${
                    agreed ? 'bg-cw-red border-cw-red' : 'border-black'
                  }`}
                >
                  {agreed && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  onClick={() => setAgreed(a => !a)}
                  className="font-body text-xs text-gray-700 leading-relaxed"
                >
                  I have read and agree to the studio policies above. I understand I am responsible for any damage caused by myself or my guests.
                </span>
              </label>
            </div>

            {error && (
              <p className="text-cw-red font-body text-xs mb-4 border-2 border-cw-red bg-red-50 px-4 py-3">
                {error}
              </p>
            )}

            <div className="flex justify-between items-center">
              <button
                onClick={goBack}
                className="font-heading text-xs px-8 py-4 tracking-widest uppercase border-2 border-black hover:border-cw-red hover:text-cw-red text-black transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCheckout}
                disabled={!canSubmit || loading}
                className={`font-heading text-sm px-12 py-4 tracking-widest uppercase transition-colors ${
                  canSubmit && !loading
                    ? 'bg-cw-red hover:bg-black text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? 'Processing...' : `Pay $${Math.round((selectedService?.price ?? 0) / 2)} Deposit`}
              </button>
            </div>

            <p className="text-center text-gray-400 font-body text-xs mt-4">
              Secured by Stripe. Your card details are never stored on our servers.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
