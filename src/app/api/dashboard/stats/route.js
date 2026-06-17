export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.shopId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const shopId = session.user.shopId

  const [orders, products] = await Promise.all([
    prisma.order.findMany({
      where: { shopId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({ where: { shopId }, include: { sizes: true } }),
  ])

  const paidOrders = orders.filter(o => o.status !== 'CANCELLED' && o.status !== 'PENDING')

  const grossRevenue   = paidOrders.reduce((s, o) => s + o.totalAmount, 0)
  const platformFee    = paidOrders.reduce((s, o) => s + o.platformFee, 0)
  const netEarnings    = paidOrders.reduce((s, o) => s + o.shopEarnings, 0)
  const pendingOrders  = orders.filter(o => o.status === 'PAID' || o.status === 'CONFIRMED').length

  // Items sold
  const itemsSold = paidOrders.reduce((s, o) => s + o.items.reduce((ss, i) => ss + i.quantity, 0), 0)

  // Top selling product
  const productSales = {}
  paidOrders.forEach(o => {
    o.items.forEach(i => {
      productSales[i.productId] = (productSales[i.productId] || 0) + i.quantity
    })
  })
  const topProductId = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0]?.[0]
  const topProduct = products.find(p => p.id === topProductId)

  // Monthly revenue (last 6 months)
  const now = new Date()
  const monthlyData = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    const monthOrders = paidOrders.filter(o => new Date(o.createdAt) >= d && new Date(o.createdAt) < end)
    monthlyData.push({
      month: d.toLocaleString('en', { month: 'short' }),
      revenue: monthOrders.reduce((s, o) => s + o.shopEarnings, 0),
    })
  }

  return NextResponse.json({
    grossRevenue,
    platformFee,
    netEarnings,
    pendingOrders,
    itemsSold,
    totalOrders: paidOrders.length,
    topProduct: topProduct?.name ?? '—',
    productsCount: products.length,
    monthlyData,
    recentOrders: orders.slice(0, 5),
  })
}
