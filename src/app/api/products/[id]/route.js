export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req, { params }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { sizes: true, shop: { select: { id: true, name: true, city: true, country: true, logoUrl: true, currency: true } } },
  })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.shopId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const product = await prisma.product.findUnique({ where: { id: params.id } })

  if (!product || product.shopId !== session.user.shopId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updated = await prisma.product.update({
    where: { id: params.id },
    data: {
      name: body.name,
      description: body.description,
      price: body.price ? parseFloat(body.price) : undefined,
      active: body.active,
      photos: body.photos,
      styleTags: body.styleTags,
    },
    include: { sizes: true },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.shopId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const product = await prisma.product.findUnique({ where: { id: params.id } })
  if (!product || product.shopId !== session.user.shopId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.product.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
