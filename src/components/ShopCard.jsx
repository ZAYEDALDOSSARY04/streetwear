import Link from 'next/link'

export default function ShopCard({ shop }) {
  const itemCount = shop._count?.products ?? shop.itemCount ?? 0

  return (
    <Link href={`/shop/${shop.id}`} className="group block">
      <div className="bg-surface border border-border group-hover:border-accent/50 transition-all duration-200 overflow-hidden">
        <div className="relative h-40 overflow-hidden">
          <img src={shop.coverUrl ?? shop.coverImage} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
          <span className="absolute top-3 left-3 bg-bg/80 backdrop-blur px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted">{shop.city}</span>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display font-bold text-base group-hover:text-accent transition-colors leading-tight">{shop.name}</h3>
            {shop.logoUrl && <img src={shop.logoUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-border flex-shrink-0" />}
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {shop.styleTags?.map(s => <span key={s} className="tag">{s}</span>)}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-muted"><span className="text-primary font-bold">{itemCount}</span> items</span>
            {shop.currency && <span className="font-mono text-[11px] text-muted">{shop.currency}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
