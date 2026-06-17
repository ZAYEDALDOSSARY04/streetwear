export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req) {
  try {
    const body = await req.json()
    const { email, password, name, phone, shopName, shopCity, shopCountry, shopBio, shopInstagram, styleTags } = body

    if (!email || !password || !name || !shopName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

    const hash = await bcrypt.hash(password, 10)
    const token = Math.random().toString(36).slice(2) + Date.now().toString(36)

    const user = await prisma.user.create({
      data: {
        email, password: hash, name, phone,
        role: 'SHOP_OWNER',
        emailVerified: false,
        shop: {
          create: {
            name: shopName,
            bio: shopBio,
            city: shopCity,
            country: shopCountry,
            instagram: shopInstagram,
            styleTags: styleTags || [],
            status: 'PENDING',
          },
        },
      },
    })

    // Send verification email (non-blocking)
    sendVerificationEmail({ to: email, name, token }).catch(console.error)

    return NextResponse.json({ success: true, userId: user.id })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
