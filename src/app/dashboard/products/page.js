export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AddProductModal from '@/components/dashboard/AddProductModal'

export default async function ProductsPage() {
  const session  = await getServerSession(authOptions)
  const products = await prisma.product.findMany({
    where: { shopId: session.user.shopId },
    include: { sizes: true, _count: { select: { orderItems: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-label mb-1">// inventory</p>
          <h1 className="font-display font-black text-3xl">Products</h1>
        </div>
        <AddProductModal shopId={session.user.shopId} />
      </div>

      {products.length === 0 ? (
        <div className="bg-surface border border-border p-16 text-center">
          <p className="text-5xl mb-4">📦</p>
          <p className="font-display font-bold text-xl mb-2">No products yet</p>
          <p className="text-muted text-sm mb-6">Add your first item to start selling</p>
        </div>
      ) : (
        <div className="bg-surface border border-border overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border">
            {['', 'Product', 'Price', 'Sizes', 'Sold', 'Status'].map((h, i) => (
              <p key={i} className="section-label text-[10px]">{h}</p>
            ))}
          </div>
          <div className="divide-y divide-border">
            {products.map(product => (
              <div key={product.id} className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-4 hover:bg-border/20 transition-colors">
                <img src={product.photos?.[0] ?? `https://picsum.photos/seed/${product.id}/200/200`} alt="" className="w-12 h-14 object-cover bg-border" />
                <div className="min-w-0">
                  <p className="font-display font-semibold text-sm truncate">{product.name}</p>
                  {product.styleTags?.[0] && <span className="tag mt-1 inline-block">{product.styleTags[0]}</span>}
                </div>
                <p className="font-mono text-sm text-accent font-bold whitespace-nowrap">{product.currency} {product.price}</p>
                <p className="font-mono text-sm text-muted">{product.sizes.length} sizes</p>
                <p className="font-mono text-sm">{product._count.orderItems}</p>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-1 ${product.active ? 'bg-green-500/10 text-green-400' : 'bg-border text-muted'}`}>
                    {product.active ? 'Active' : 'Draft'}
                  </span>
                  <Link href={`/product/${product.id}`} className="font-mono text-[10px] text-muted hover:text-accent transition-colors">View</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
