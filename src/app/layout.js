import './globals.css'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SessionProviderWrapper from '@/components/SessionProviderWrapper'
import Navbar from '@/components/Navbar'
import CartSidebar from '@/components/CartSidebar'

export const metadata = {
  title: 'ORIGIN WEAR — Discover Local Streetwear',
  description: 'Shop local streetwear stores by city. Bahrain, Saudi Arabia, UAE and beyond.',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SessionProviderWrapper session={session}>
          <div className="min-h-screen bg-bg text-primary font-body">
            <Navbar />
            <CartSidebar />
            {children}
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
