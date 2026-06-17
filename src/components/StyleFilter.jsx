'use client'
import { useRouter } from 'next/navigation'

export default function StyleFilter({ styles, currentStyle, cityId }) {
  const router = useRouter()

  function setStyle(s) {
    router.push(s ? `/browse/${cityId}?style=${encodeURIComponent(s)}` : `/browse/${cityId}`)
  }

  return (
    <div className="border-b border-border sticky top-14 bg-bg/95 backdrop-blur z-30">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-3 flex items-center gap-3 overflow-x-auto">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted flex-shrink-0">Filter:</span>
        <button onClick={() => setStyle('')} className={`tag flex-shrink-0 cursor-pointer ${!currentStyle ? 'active' : ''}`}>All Styles</button>
        {styles.map(s => (
          <button key={s} onClick={() => setStyle(s)} className={`tag flex-shrink-0 cursor-pointer ${currentStyle === s ? 'active' : ''}`}>{s}</button>
        ))}
      </div>
    </div>
  )
}
