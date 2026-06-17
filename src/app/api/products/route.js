export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const shopId = searchParams.get('shopId')

  const products = await prisma.product.findMany({
    where: { shopId, active: true },
    include: { sizes: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(products)
}

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.shopId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, description, price, currency, photos, styleTags, sizes } = body

  const product = await prisma.product.create({
    data: {
      name, description, price: parseFloat(price),
      currency: currency || 'BHD',
      photos: photos || [],
      styleTags: styleTags || [],
      shopId: session.user.shopId,
      sizes: { create: sizes?.map(s => ({ label: s.label, stock: parseInt(s.stock) || 0 })) || [] },
    },
    include: { sizes: true },
  })

  return NextResponse.json(product, { status: 201 })
}
