export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: { include: { product: { include: { shop: true } } } },
      customer: { select: { name: true, email: true } },
    },
  })

  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(order)
}

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.shopId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { status, trackingNumber } = await req.json()

  const ALLOWED_TRANSITIONS = {
    PAID:      ['CONFIRMED'],
    CONFIRMED: ['SHIPPED'],
    SHIPPED:   ['DELIVERED'],
  }

  const order = await prisma.order.findUnique({ where: { id: params.id } })
  if (!order || order.shopId !== session.user.shopId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const allowed = ALLOWED_TRANSITIONS[order.status] ?? []
  if (status && !allowed.includes(status)) {
    return NextResponse.json({ error: `Cannot transition from ${order.status} to ${status}` }, { status: 400 })
  }

  const updated = await prisma.order.update({
    where: { id: params.id },
    data: {
      ...(status && { status }),
      ...(trackingNumber && { trackingNumber }),
    },
  })

  return NextResponse.json(updated)
}
