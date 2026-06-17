export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const city  = searchParams.get('city')
  const style = searchParams.get('style')
  const id    = searchParams.get('id')

  if (id) {
    const shop = await prisma.shop.findUnique({ where: { id }, include: { _count: { select: { products: true } } } })
    return NextResponse.json(shop ? [shop] : [])
  }

  const where = { status: 'APPROVED' }
  if (city)  where.city      = { contains: city, mode: 'insensitive' }
  if (style) where.styleTags = { has: style }

  const shops = await prisma.shop.findMany({
    where,
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(shops)
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.shopId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, bio, city, country, instagram, styleTags, currency } = await req.json()

  const shop = await prisma.shop.update({
    where: { id: session.user.shopId },
    data: { name, bio, city, country, instagram, styleTags, currency },
  })

  return NextResponse.json(shop)
}
