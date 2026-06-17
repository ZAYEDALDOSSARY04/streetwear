'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const STEPS = ['Account Info', 'Shop Profile', 'Agreement']
const STYLES = ['Y2K', 'techwear', 'vintage', 'skate', 'luxury street']
const COUNTRIES = ['Bahrain', 'Saudi Arabia', 'UAE', 'Kuwait', 'Qatar', 'Oman', 'Jordan', 'Egypt', 'Other']

export default function RegisterShopPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '',
    shopName: '', shopCity: '', shopCountry: '', shopBio: '', shopInstagram: '',
    styleTags: [], agreed: false,
  })

  function setField(key, val) { setForm(f => ({ ...f, [key]: val })) }
  function toggleStyle(s) {
    setForm(f => ({ ...f, styleTags: f.styleTags.includes(s) ? f.styleTags.filter(x => x !== s) : [...f.styleTags, s] }))
  }

  function nextStep() {
    setError('')
    if (step === 0) {
      if (!form.name || !form.email || !form.password) { setError('All fields required'); return }
      if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
      if (form.password.length < 8) { setError('Password must be 8+ characters'); return }
    }
    if (step === 1) {
      if (!form.shopName || !form.shopCity || !form.shopCountry) { setError('Shop name, city and country required'); return }
    }
    setStep(s => s + 1)
  }

  async function handleSubmit() {
    if (!form.agreed) { setError('You must agree to the commission terms'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed'); return }
      router.push('/register/verify-email')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display font-bold text-2xl"><span className="text-primary">STREET</span><span className="text-accent">MAP</span></Link>
          <h1 className="font-display font-bold text-2xl mt-3">Register Your Shop</h1>
          <p className="text-muted text-sm mt-1">Join the local streetwear movement</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex-1 h-px ${i < step ? 'bg-accent' : 'bg-border'}`} />
              <div className={`w-7 h-7 flex items-center justify-center font-mono text-[11px] border flex-shrink-0 ${
                i < step ? 'bg-accent text-bg border-accent' : i === step ? 'border-accent text-accent' : 'border-border text-muted'
              }`}>{i + 1}</div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step - 1 ? 'bg-accent' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-surface border border-border p-6 space-y-4">
          <h2 className="font-display font-bold text-base mb-4">{STEPS[step]}</h2>

          {step === 0 && <>
            <div><label className="section-label block mb-1.5">Full Name *</label><input value={form.name} onChange={e => setField('name', e.target.value)} className="input-dark" placeholder="Your name" /></div>
            <div><label className="section-label block mb-1.5">Email *</label><input type="email" value={form.email} onChange={e => setField('email', e.target.value)} className="input-dark" placeholder="you@example.com" /></div>
            <div><label className="section-label block mb-1.5">Phone (WhatsApp)</label><input value={form.phone} onChange={e => setField('phone', e.target.value)} className="input-dark" placeholder="+973 XXXX XXXX" /></div>
            <div><label className="section-label block mb-1.5">Password *</label><input type="password" value={form.password} onChange={e => setField('password', e.target.value)} className="input-dark" placeholder="Min 8 characters" /></div>
            <div><label className="section-label block mb-1.5">Confirm Password *</label><input type="password" value={form.confirmPassword} onChange={e => setField('confirmPassword', e.target.value)} className="input-dark" placeholder="Repeat password" /></div>
          </>}

          {step === 1 && <>
            <div><label className="section-label block mb-1.5">Shop Name *</label><input value={form.shopName} onChange={e => setField('shopName', e.target.value)} className="input-dark" placeholder="Manama Drip" /></div>
            <div><label className="section-label block mb-1.5">City *</label><input value={form.shopCity} onChange={e => setField('shopCity', e.target.value)} className="input-dark" placeholder="Bahrain, Riyadh, Dubai…" /></div>
            <div>
              <label className="section-label block mb-1.5">Country *</label>
              <select value={form.shopCountry} onChange={e => setField('shopCountry', e.target.value)} className="input-dark">
                <option value="">Select country…</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="section-label block mb-1.5">Bio <span className="text-muted">(160 chars)</span></label><textarea value={form.shopBio} onChange={e => setField('shopBio', e.target.value.slice(0, 160))} rows={3} className="input-dark resize-none" placeholder="Tell the story of your shop…" /></div>
            <div><label className="section-label block mb-1.5">Instagram Handle</label><input value={form.shopInstagram} onChange={e => setField('shopInstagram', e.target.value.replace('@', ''))} className="input-dark" placeholder="manamadrip" /></div>
            <div>
              <label className="section-label block mb-2">Style Tags</label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map(s => (
                  <button type="button" key={s} onClick={() => toggleStyle(s)} className={`tag cursor-pointer ${form.styleTags.includes(s) ? 'active' : ''}`}>{s}</button>
                ))}
              </div>
            </div>
          </>}

          {step === 2 && <>
            <div className="bg-bg border border-border p-4 space-y-3 text-sm">
              <p className="font-display font-bold">Commission Terms</p>
              <ul className="space-y-2 text-muted">
                <li>• StreetMap charges <span className="text-accent font-bold">10% commission</span> on every sold item</li>
                <li>• Payouts are processed every <span className="text-primary">2 weeks</span> to your registered bank account</li>
                <li>• You are responsible for shipping orders within 3 business days of confirmation</li>
                <li>• StreetMap handles payment processing, platform hosting, and customer support</li>
                <li>• Your shop will be reviewed and approved within 24 hours</li>
              </ul>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.agreed} onChange={e => setField('agreed', e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#E8FF00]" />
              <span className="text-sm text-muted">I agree to the StreetMap commission terms and platform policies</span>
            </label>
          </>}

          {error && <p className="font-mono text-[11px] text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            {step > 0 && <button onClick={() => setStep(s => s - 1)} className="btn-ghost flex-1">← Back</button>}
            {step < 2
              ? <button onClick={nextStep} className="btn-accent flex-1">Next →</button>
              : <button onClick={handleSubmit} disabled={loading} className="btn-accent flex-1">{loading ? 'Submitting…' : 'Submit Application'}</button>
            }
          </div>
        </div>

        <p className="text-center text-muted text-sm mt-4">Already have an account? <Link href="/login" className="text-accent hover:underline">Sign in</Link></p>
      </div>
    </main>
  )
}
