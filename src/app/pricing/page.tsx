import Link from 'next/link'

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for a single chair shop just getting started.',
    features: ['1 location', '3 stylists max', '30 days history', 'Basic dashboard', 'Appointment log'],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    desc: 'The full BI suite for growing salons.',
    features: ['1 location', 'Unlimited stylists', 'Full history', 'CSV export', 'Revenue goals', 'API access', 'Priority support'],
    cta: 'Start Pro — $19/mo',
    highlight: true,
  },
  {
    name: 'Studio',
    price: '$49',
    period: '/month',
    desc: 'Multi-location operations with team access.',
    features: ['Unlimited locations', 'Unlimited stylists', 'Full history', 'CSV export', 'API + MCP endpoint', 'Team access', 'Dedicated support'],
    cta: 'Go Studio — $49/mo',
    highlight: false,
  },
]

const COMPETITORS = [
  { name: 'Vagaro', price: '$90+/mo', bi: '❌', utilization: '❌', noshow: '⚠️', mcp: '❌' },
  { name: 'Mindbody', price: '$139+/mo', bi: '⚠️', utilization: '❌', noshow: '⚠️', mcp: '❌' },
  { name: 'Boulevard', price: '$175+/mo', bi: '⚠️', utilization: '❌', noshow: '⚠️', mcp: '❌' },
  { name: 'SalonIQ Pro', price: '$19/mo', bi: '✅', utilization: '✅', noshow: '✅', mcp: '✅' },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">✂️</span>
            <span className="font-bold text-gray-900 text-lg">SalonIQ</span>
          </Link>
          <Link href="/auth" className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg font-medium">Get Started Free</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, honest pricing</h1>
          <p className="text-gray-600 text-lg">Start free. Upgrade when you&apos;re ready. No long-term contracts.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {TIERS.map(t => (
            <div key={t.name} className={`rounded-2xl p-8 ${t.highlight ? 'bg-green-500 text-white ring-4 ring-green-200' : 'bg-white border border-gray-200'}`}>
              <div className={`text-sm font-medium mb-2 ${t.highlight ? 'text-green-100' : 'text-gray-500'}`}>{t.name}</div>
              <div className={`text-4xl font-bold ${t.highlight ? 'text-white' : 'text-gray-900'}`}>
                {t.price}<span className={`text-lg font-normal ${t.highlight ? 'text-green-100' : 'text-gray-500'}`}>{t.period}</span>
              </div>
              <p className={`text-sm mt-3 mb-6 ${t.highlight ? 'text-green-100' : 'text-gray-600'}`}>{t.desc}</p>
              <Link href="/auth" className={`block text-center py-3 px-6 rounded-xl font-semibold transition-colors mb-8 ${t.highlight ? 'bg-white text-green-600 hover:bg-green-50' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                {t.cta}
              </Link>
              <ul className="space-y-3">
                {t.features.map(f => (
                  <li key={f} className={`flex items-center gap-2 text-sm ${t.highlight ? 'text-green-100' : 'text-gray-700'}`}>
                    <span className={t.highlight ? 'text-white' : 'text-green-500'}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Competitor table */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">How we compare</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  {['Platform', 'Monthly Cost', 'BI Dashboard', 'Chair Utilization', 'No-Show Tracking', 'MCP/API'].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {COMPETITORS.map(c => (
                  <tr key={c.name} className={c.name === 'SalonIQ Pro' ? 'bg-green-50' : ''}>
                    <td className={`px-6 py-4 font-medium ${c.name === 'SalonIQ Pro' ? 'text-green-700' : 'text-gray-900'}`}>{c.name}</td>
                    <td className={`px-6 py-4 text-sm ${c.name === 'SalonIQ Pro' ? 'font-bold text-green-600' : 'text-gray-700'}`}>{c.price}</td>
                    <td className="px-6 py-4 text-sm">{c.bi}</td>
                    <td className="px-6 py-4 text-sm">{c.utilization}</td>
                    <td className="px-6 py-4 text-sm">{c.noshow}</td>
                    <td className="px-6 py-4 text-sm">{c.mcp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          {[
            { q: 'Can I change plans anytime?', a: 'Yes. Upgrade, downgrade, or cancel at any time with no penalties.' },
            { q: 'What happens to my data if I downgrade?', a: 'Your data is preserved for 90 days. You\'ll just lose access to features above your plan.' },
            { q: 'Is this a replacement for my booking software?', a: 'No — SalonIQ is a BI layer. It shows you the numbers that your booking software generates but doesn\'t surface clearly.' },
            { q: 'Do you have a free trial for Pro?', a: 'Start with the free tier and upgrade when you\'re ready. No credit card needed to start.' },
          ].map(faq => (
            <div key={faq.q} className="border-b border-gray-100 py-6">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-600 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
