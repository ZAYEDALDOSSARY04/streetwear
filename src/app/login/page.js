'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)

    if (res?.error) {
      setError('Invalid email or password')
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <main className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-display font-bold text-2xl"><span className="text-primary">STREET</span><span className="text-accent">MAP</span></Link>
          <p className="section-label mt-3">// shop owner login</p>
          <h1 className="font-display font-bold text-2xl mt-1">Sign In</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="section-label block mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-dark" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="section-label block mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-dark" placeholder="••••••••" required />
          </div>

          {error && <p className="font-mono text-[11px] text-red-400">{error}</p>}

          <button type="submit" disabled={loading} className="btn-accent w-full h-12 mt-2">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="text-muted text-sm">
            Don't have a shop account?{' '}
            <Link href="/register/shop" className="text-accent hover:underline">Register your shop</Link>
          </p>
          <div className="bg-surface border border-border p-3 text-left">
            <p className="section-label mb-2">Demo accounts</p>
            <div className="space-y-1 font-mono text-[10px] text-muted">
              <p>Shop: manama@origin-wear.com / Shop1234!</p>
              <p>Admin: admin@origin-wear.com / Admin1234!</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
