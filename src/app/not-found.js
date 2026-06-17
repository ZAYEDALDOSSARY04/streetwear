import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="relative mb-8 select-none">
          <p className="font-display font-black text-[8rem] sm:text-[12rem] leading-none text-border">404</p>
          <p className="absolute inset-0 flex items-center justify-center font-display font-black text-2xl text-accent">NOT FOUND</p>
        </div>
        <p className="section-label mb-3">// page missing</p>
        <p className="text-muted mb-8">This page doesn't exist or was removed. Browse local streetwear instead.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-accent">Back to Home</Link>
          <Link href="/browse/bahrain" className="btn-ghost">Browse Shops</Link>
        </div>
      </div>
    </main>
  )
}
