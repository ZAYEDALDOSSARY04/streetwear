import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { shop: { select: { id: true, name: true, status: true } } },
        })

        if (!user) return null

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        return {
          id:     user.id,
          email:  user.email,
          name:   user.name,
          role:   user.role,
          shopId: user.shop?.id ?? null,
          shopName: user.shop?.name ?? null,
          shopStatus: user.shop?.status ?? null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id         = user.id
        token.role       = user.role
        token.shopId     = user.shopId
        token.shopName   = user.shopName
        token.shopStatus = user.shopStatus
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id          = token.id
        session.user.role        = token.role
        session.user.shopId      = token.shopId
        session.user.shopName    = token.shopName
        session.user.shopStatus  = token.shopStatus
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
}
