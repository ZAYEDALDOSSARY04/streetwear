import Link from 'next/link'

export default function VerifyEmailPage() {
  return (
    <main className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-surface border border-border p-10">
          <div className="w-16 h-16 bg-accent/10 border border-accent flex items-center justify-center mx-auto mb-6">
            <span className="text-accent text-3xl">✉</span>
          </div>
          <p className="section-label mb-2">// registration submitted</p>
          <h1 className="font-display font-black text-2xl mb-3">Check Your Inbox</h1>
          <p className="text-muted text-sm mb-6">
            We've sent a verification link to your email. Your shop application will be reviewed within 24 hours.
          </p>
          <div className="bg-bg border border-border p-4 mb-6 text-left">
            <p className="section-label mb-2">What happens next?</p>
            <ol className="space-y-2 text-sm text-muted">
              <li>1. Verify your email address</li>
              <li>2. Origin Wear reviews your shop (within 24h)</li>
              <li>3. You receive approval + dashboard access</li>
              <li>4. Add products and start selling</li>
            </ol>
          </div>
          <Link href="/login" className="btn-accent inline-block w-full text-center">Continue to Login</Link>
        </div>
      </div>
    </main>
  )
}
