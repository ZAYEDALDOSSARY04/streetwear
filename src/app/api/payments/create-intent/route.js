import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { items } = await req.json()
  if (!items?.length) return NextResponse.json({ error: 'No items' }, { status: 400 })

  const stripe     = getStripe()
  const productIds = items.map(i => i.productId)
  const products   = await prisma.product.findMany({ where: { id: { in: productIds } } })

  const totalAmount = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId)
    return sum + (product?.price ?? 0) * item.quantity
  }, 0)

  const amountInSmallestUnit = Math.round(totalAmount * 100)
  const currency             = products[0]?.currency?.toLowerCase() ?? 'usd'
  const stripeCurrency       = ['bhd', 'sar', 'aed', 'usd', 'eur', 'gbp'].includes(currency) ? currency : 'usd'

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInSmallestUnit,
    currency: stripeCurrency,
    metadata: { userId: session.user.id, itemCount: items.length.toString() },
  })

  return NextResponse.json({ clientSecret: paymentIntent.client_secret })
}
