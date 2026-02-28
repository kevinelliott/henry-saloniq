import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">✂️</span>
            <span className="font-bold text-gray-900 text-lg">SalonIQ</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <Link href="/features" className="hover:text-gray-900">Features</Link>
            <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
            <Link href="/docs" className="hover:text-gray-900">Docs</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
            <Link href="/auth" className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm px-4 py-2 rounded-full mb-8 font-medium">
          <span>💡</span>
          <span>Focused BI for salons & spas — not another booking platform</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Know exactly which chairs<br />
          <span className="text-green-500">are making money.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Stop guessing. Track chair utilization, stylist revenue rankings, no-show rates, and daily revenue vs. goal — all in one clean dashboard.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/auth" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
            Start Free Today
          </Link>
          <Link href="/pricing" className="border border-gray-200 text-gray-700 hover:border-gray-300 px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
            See Pricing
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-4">Free forever • No credit card required</p>
      </section>

      {/* Stats bar */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Average no-show rate in salons', value: '18%' },
            { label: 'Revenue lost to empty chairs', value: '$340/wk' },
            { label: 'Vagaro monthly cost', value: '$90+/mo' },
            { label: 'SalonIQ Pro monthly cost', value: '$19/mo' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-green-500">{s.value}</div>
              <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">One tool. Four metrics that matter.</h2>
        <p className="text-gray-600 text-center mb-16 text-lg">Most salons are flying blind. SalonIQ gives you the numbers you need in under 30 seconds.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '🪑',
              title: 'Chair Utilization',
              desc: 'See exactly what % of available appointment slots are being booked each week. Identify dead hours and underperforming chairs instantly.',
            },
            {
              icon: '💇',
              title: 'Stylist Revenue Rankings',
              desc: 'Know who\'s carrying the business. Compare revenue, appointment count, average ticket, and no-show rate for every stylist.',
            },
            {
              icon: '📉',
              title: 'No-Show Rate Tracking',
              desc: 'Track no-shows by month and by stylist. Industry average is 18% — know exactly where you stand and who needs a reminder policy.',
            },
            {
              icon: '🎯',
              title: 'Daily Revenue vs Goal',
              desc: 'Set monthly revenue goals and track daily pacing. See a live progress bar so you always know if you\'re on track.',
            },
            {
              icon: '📊',
              title: 'Appointment Intelligence',
              desc: 'Full appointment log with status badges. Filter by stylist, service, or date. Export to CSV on Pro.',
            },
            {
              icon: '🔌',
              title: 'API & MCP Endpoint',
              desc: 'Integrate with your tools. REST API returns stats in real-time. MCP endpoint works with Claude and other AI agents.',
            },
          ].map((f) => (
            <div key={f.title} className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple pricing</h2>
          <p className="text-gray-600 mb-12">Start free. Upgrade when you need more.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Free', price: '$0', desc: '1 location, 3 stylists, 30 days history', cta: 'Get Started' },
              { name: 'Pro', price: '$19/mo', desc: 'Unlimited stylists, full history, CSV export', cta: 'Start Pro', highlight: true },
              { name: 'Studio', price: '$49/mo', desc: 'Multi-location, team access, API', cta: 'Go Studio' },
            ].map((t) => (
              <div key={t.name} className={`rounded-xl p-6 ${t.highlight ? 'bg-green-500 text-white' : 'bg-white border border-gray-200'}`}>
                <div className={`text-sm font-medium mb-2 ${t.highlight ? 'text-green-100' : 'text-gray-500'}`}>{t.name}</div>
                <div className={`text-3xl font-bold mb-3 ${t.highlight ? 'text-white' : 'text-gray-900'}`}>{t.price}</div>
                <p className={`text-sm mb-6 ${t.highlight ? 'text-green-100' : 'text-gray-600'}`}>{t.desc}</p>
                <Link href="/auth" className={`block text-center py-2 px-4 rounded-lg font-medium text-sm transition-colors ${t.highlight ? 'bg-white text-green-600 hover:bg-green-50' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                  {t.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to know your numbers?</h2>
        <p className="text-gray-600 text-lg mb-10">Join salon owners who stopped guessing and started growing.</p>
        <Link href="/auth" className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-colors inline-block">
          Start Free — No Credit Card Needed
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>✂️</span>
            <span className="font-medium text-gray-700">SalonIQ</span>
            <span>— Salon & Spa Business Intelligence</span>
          </div>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-gray-700">Pricing</Link>
            <Link href="/docs" className="hover:text-gray-700">Docs</Link>
            <Link href="/features" className="hover:text-gray-700">Features</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
