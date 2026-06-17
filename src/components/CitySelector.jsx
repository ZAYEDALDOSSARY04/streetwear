'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CitySelector({ cities, shopCounts }) {
  const router = useRouter()
  const [selected, setSelected] = useState('')
  const [locLoading, setLocLoading] = useState(false)

  const activeCities = cities.filter(c => !c.comingSoon)

  function handleExplore() {
    if (selected) router.push(`/browse/${selected}`)
  }

  function handleDetect() {
    setLocLoading(true)
    if (!navigator.geolocation) { alert('Geolocation not supported'); setLocLoading(false); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocLoading(false)
        const COORDS = { bahrain: [26.07, 50.56], riyadh: [24.69, 46.72], jeddah: [21.54, 39.17], dubai: [25.20, 55.27] }
        let nearest = 'bahrain', minD = Infinity
        Object.entries(COORDS).forEach(([id, [lat, lng]]) => {
          const d = Math.hypot(lat - pos.coords.latitude, lng - pos.coords.longitude)
          if (d < minD) { minD = d; nearest = id }
        })
        router.push(`/browse/${nearest}`)
      },
      () => { setLocLoading(false); alert('Could not detect location. Select manually.') }
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
        <select value={selected} onChange={e => setSelected(e.target.value)}
          className="input-dark h-12 flex-1 font-display font-medium appearance-none cursor-pointer"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23888' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px', paddingRight: '40px' }}>
          <option value="">Select a city…</option>
          {activeCities.map(c => {
            const count = shopCounts?.[c.name.toLowerCase()] ?? 0
            return <option key={c.id} value={c.id}>{c.flag} {c.name}, {c.country}{count > 0 ? ` — ${count} shop${count > 1 ? 's' : ''}` : ''}</option>
          })}
        </select>
        <button onClick={handleExplore} disabled={!selected} className="btn-accent h-12 px-8 flex-shrink-0 disabled:opacity-40">Explore →</button>
      </div>
      <button onClick={handleDetect} disabled={locLoading}
        className="mt-4 flex items-center gap-2 text-muted hover:text-accent transition-colors font-mono text-[11px] uppercase tracking-widest">
        <span>{locLoading ? '⟳' : '◎'}</span>
        {locLoading ? 'Detecting…' : 'Detect my location'}
      </button>
    </div>
  )
}
