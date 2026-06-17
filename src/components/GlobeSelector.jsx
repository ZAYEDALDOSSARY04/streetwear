'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

const CITIES = [
  { name: 'Bahrain',   cityId: 'bahrain',   lat: 26.0275,  lng: 50.5500,   active: true,  shops: 2  },
  { name: 'Riyadh',    cityId: 'riyadh',    lat: 24.6877,  lng: 46.7219,   active: true,  shops: 1  },
  { name: 'Dubai',     cityId: 'dubai',     lat: 25.2048,  lng: 55.2708,   active: false, shops: 0  },
  { name: 'Kuwait',    cityId: 'kuwait',    lat: 29.3759,  lng: 47.9774,   active: false, shops: 0  },
  { name: 'Doha',      cityId: 'doha',      lat: 25.2854,  lng: 51.5310,   active: false, shops: 0  },
  { name: 'Cairo',     cityId: 'cairo',     lat: 30.0444,  lng: 31.2357,   active: false, shops: 0  },
  { name: 'Beirut',    cityId: 'beirut',    lat: 33.8938,  lng: 35.5018,   active: false, shops: 0  },
  { name: 'Istanbul',  cityId: 'istanbul',  lat: 41.0082,  lng: 28.9784,   active: false, shops: 0  },
  { name: 'London',    cityId: 'london',    lat: 51.5074,  lng: -0.1278,   active: false, shops: 0  },
  { name: 'Paris',     cityId: 'paris',     lat: 48.8566,  lng:  2.3522,   active: false, shops: 0  },
  { name: 'New York',  cityId: 'new-york',  lat: 40.7128,  lng: -74.006,   active: false, shops: 0  },
  { name: 'Tokyo',     cityId: 'tokyo',     lat: 35.6762,  lng: 139.6503,  active: false, shops: 0  },
  { name: 'Singapore', cityId: 'singapore', lat:  1.3521,  lng: 103.8198,  active: false, shops: 0  },
  { name: 'Sydney',    cityId: 'sydney',    lat: -33.8688, lng: 151.2093,  active: false, shops: 0  },
  { name: 'Lagos',     cityId: 'lagos',     lat:  6.5244,  lng:   3.3792,  active: false, shops: 0  },
  { name: 'Nairobi',   cityId: 'nairobi',   lat: -1.2921,  lng:  36.8219,  active: false, shops: 0  },
]

export default function GlobeSelector() {
  const router     = useRouter()
  const globeRef   = useRef()
  const [ready, setReady]       = useState(false)
  const [hovered, setHovered]   = useState(null)
  const [dims, setDims]         = useState({ w: 600, h: 520 })

  useEffect(() => {
    function resize() {
      const w = Math.min(window.innerWidth - 32, 700)
      setDims({ w, h: Math.max(420, Math.min(w * 0.85, 560)) })
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    if (!globeRef.current) return
    // Point camera at Middle East on load
    globeRef.current.pointOfView({ lat: 26, lng: 48, altitude: 1.8 }, 0)
    // Slow auto-rotate
    globeRef.current.controls().autoRotate      = true
    globeRef.current.controls().autoRotateSpeed = 0.4
    globeRef.current.controls().enableZoom      = false
    setReady(true)
  }, [])

  function handleClick(point) {
    if (!point) return
    if (point.active) {
      router.push(`/browse/${point.cityId}`)
    }
  }

  function handleHover(point) {
    setHovered(point)
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = !point
    }
  }

  const ringsData = CITIES.filter(c => c.active).map(c => ({
    ...c,
    maxR: 3,
    propagationSpeed: 1.5,
    repeatPeriod: 1200,
  }))

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative" style={{ width: dims.w, height: dims.h }}>
        {/* Glow backdrop */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,107,0,0.08) 0%, transparent 70%)',
        }} />

        <Globe
          ref={globeRef}
          width={dims.w}
          height={dims.h}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          atmosphereColor="#FF6B00"
          atmosphereAltitude={0.15}

          pointsData={CITIES}
          pointLat="lat"
          pointLng="lng"
          pointColor={d => d.active ? '#FF6B00' : 'rgba(255,255,255,0.2)'}
          pointAltitude={d => d === hovered ? 0.08 : 0.04}
          pointRadius={d => d.active ? (d === hovered ? 0.7 : 0.5) : 0.25}
          pointResolution={12}
          onPointClick={handleClick}
          onPointHover={handleHover}

          ringsData={ringsData}
          ringLat="lat"
          ringLng="lng"
          ringColor={() => t => `rgba(255,107,0,${1 - t})`}
          ringMaxRadius="maxR"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"

          labelsData={CITIES.filter(c => c.active || c === hovered)}
          labelLat="lat"
          labelLng="lng"
          labelText="name"
          labelSize={d => d.active ? 0.6 : 0.45}
          labelDotRadius={0}
          labelColor={d => d.active ? '#FF6B00' : 'rgba(255,255,255,0.5)'}
          labelResolution={3}
          labelAltitude={0.06}
        />

        {/* Hover tooltip */}
        {hovered && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-10">
            <div className="bg-surface border border-accent/40 px-4 py-2 text-center">
              <p className="font-display font-bold text-sm text-accent">{hovered.name}</p>
              {hovered.active
                ? <p className="font-mono text-[10px] text-muted mt-0.5">{hovered.shops} shop{hovered.shops !== 1 ? 's' : ''} · Click to browse</p>
                : <p className="font-mono text-[10px] text-muted mt-0.5">Coming soon</p>
              }
            </div>
          </div>
        )}

        {/* Loading state */}
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Active city pills */}
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {CITIES.filter(c => c.active).map(c => (
          <button key={c.cityId} onClick={() => router.push(`/browse/${c.cityId}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-accent/40 hover:border-accent hover:bg-accent/5 transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-accent">{c.name}</span>
          </button>
        ))}
        <div className="flex items-center gap-1.5 px-3 py-1.5 border border-border">
          <span className="w-1.5 h-1.5 rounded-full bg-muted" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">More cities soon</span>
        </div>
      </div>
    </div>
  )
}
