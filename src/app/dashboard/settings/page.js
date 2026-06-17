'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const STYLE_OPTIONS = ['streetwear', 'techwear', 'gorpcore', 'vintage', 'luxury', 'workwear', 'skate', 'athletic', 'minimal']

export default function SettingsPage() {
  const { data: session } = useSession()
  const [form, setForm]   = useState({ name: '', bio: '', city: '', country: '', instagram: '', styleTags: [], currency: 'BHD' })
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    if (!session?.user?.shopId) return
    fetch(`/api/shops?id=${session.user.shopId}`)
      .then(r => r.json())
      .then(shops => {
        const shop = Array.isArray(shops) ? shops[0] : shops
        if (shop) setForm({ name: shop.name ?? '', bio: shop.bio ?? '', city: shop.city ?? '', country: shop.country ?? '', instagram: shop.instagram ?? '', styleTags: shop.styleTags ?? [], currency: shop.currency ?? 'BHD' })
        setLoading(false)
      })
  }, [session])

  function toggleTag(tag) {
    setForm(f => ({ ...f, styleTags: f.styleTags.includes(tag) ? f.styleTags.filter(t => t !== tag) : [...f.styleTags, tag].slice(0, 5) }))
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true); setError(''); setSaved(false)
    const res = await fetch(`/api/products`, { method: 'GET' }) // health-check then save
    const saveRes = await fetch('/api/shops', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (saveRes.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    else { const d = await saveRes.json(); setError(d.error ?? 'Failed to save') }
    setSaving(false)
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="mb-8">
        <p className="section-label mb-1">// shop profile</p>
        <h1 className="font-display font-black text-3xl">Settings</h1>
      </div>

      <form onSubmit={save} className="max-w-2xl space-y-6">
        <div className="bg-surface border border-border p-6">
          <h2 className="font-display font-bold mb-5 pb-3 border-b border-border">Basic Info</h2>
          <div className="space-y-4">
            <div>
              <label className="section-label block mb-1.5">Shop Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-dark" required />
            </div>
            <div>
              <label className="section-label block mb-1.5">Bio</label>
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} className="input-dark min-h-[80px] resize-y" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="section-label block mb-1.5">City</label>
                <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="input-dark" required />
              </div>
              <div>
                <label className="section-label block mb-1.5">Country</label>
                <input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className="input-dark" required />
              </div>
            </div>
            <div>
              <label className="section-label block mb-1.5">Instagram Handle</label>
              <div className="flex"><span className="flex items-center px-3 bg-border border border-r-0 border-border font-mono text-sm text-muted">@</span><input value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} className="input-dark rounded-none flex-1" placeholder="yourhandle" /></div>
            </div>
            <div>
              <label className="section-label block mb-1.5">Currency</label>
              <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} className="input-dark">
                {['BHD','SAR','AED','USD','GBP','EUR','KWD','QAR','OMR'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border p-6">
          <h2 className="font-display font-bold mb-1 pb-0">Style Tags</h2>
          <p className="font-mono text-[10px] text-muted mb-4">Select up to 5 styles that describe your shop</p>
          <div className="flex flex-wrap gap-2">
            {STYLE_OPTIONS.map(tag => (
              <button key={tag} type="button" onClick={() => toggleTag(tag)}
                className={`tag cursor-pointer transition-all ${form.styleTags.includes(tag) ? 'bg-accent text-bg border-accent' : 'hover:border-muted'}`}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="font-mono text-[11px] text-red-400 border border-red-400/30 bg-red-400/5 px-4 py-3">{error}</p>}

        <button type="submit" disabled={saving} className={`btn-accent h-12 px-8 ${saving ? 'opacity-70' : ''}`}>
          {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </form>

      <div className="max-w-2xl mt-8 bg-surface border border-border p-6">
        <h2 className="font-display font-bold mb-3">Account</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-muted">Email</span><span className="font-mono">{session?.user?.email}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted">Role</span><span className="font-mono">{session?.user?.role}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted">Shop ID</span><span className="font-mono text-[10px]">{session?.user?.shopId}</span></div>
        </div>
      </div>
    </div>
  )
}
