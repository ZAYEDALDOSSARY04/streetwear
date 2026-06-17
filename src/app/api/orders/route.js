export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmation, sendShopNewOrder } from '@/lib/email'

export async function GET(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let orders
  if (session.user.role === 'SHOP_OWNER' && session.user.shopId) {
    orders = await prisma.order.findMany({
      where: { shopId: session.user.shopId },
      include: { items: { include: { product: true } }, customer: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    })
  } else {
    orders = await prisma.order.findMany({
      where: { customerId: session.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  return NextResponse.json(orders)
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { items, shippingAddress, stripePaymentId } = body

  if (!items?.length) return NextResponse.json({ error: 'No items' }, { status: 400 })

  const productIds = items.map(i => i.productId)
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } })

  const totalAmount = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId)
    return sum + (product?.price ?? 0) * item.quantity
  }, 0)

  const platformFee   = totalAmount * 0.1
  const shopEarnings  = totalAmount * 0.9
  const shopId        = products[0]?.shopId

  const order = await prisma.order.create({
    data: {
      customerId: session.user.id,
      shopId,
      status: stripePaymentId ? 'PAID' : 'PENDING',
      totalAmount, platformFee, shopEarnings,
      stripePaymentId,
      shippingAddress,
      items: {
        create: items.map(item => ({
          productId: item.productId,
          size: item.size,
          quantity: item.quantity,
          price: products.find(p => p.id === item.productId)?.price ?? 0,
        })),
      },
    },
    include: { items: { include: { product: true } }, customer: true },
  })

  // Non-blocking emails
  const shop = shopId ? await prisma.shop.findUnique({ where: { id: shopId }, include: { owner: true } }) : null
  sendOrderConfirmation({
    to: session.user.email,
    orderNumber: order.id,
    items: order.items,
    total: totalAmount.toFixed(0),
    currency: products[0]?.currency ?? 'BHD',
    shippingAddress,
  }).catch(console.error)

  if (shop?.owner?.email) {
    sendShopNewOrder({
      to: shop.owner.email,
      shopName: shop.name,
      orderNumber: order.id,
      item: order.items[0]?.product?.name ?? 'item',
      total: totalAmount,
      currency: products[0]?.currency ?? 'BHD',
    }).catch(console.error)
  }

  return NextResponse.json(order, { status: 201 })
}
