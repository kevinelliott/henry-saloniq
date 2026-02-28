import Link from 'next/link'

const FEATURES = [
  { icon: '🪑', title: 'Chair Utilization', desc: 'Track what % of available appointment slots are booked each week. See dead hours and underperforming chairs instantly.', color: 'bg-green-50 text-green-600' },
  { icon: '💇', title: 'Stylist Rankings', desc: 'Compare revenue, ticket size, appointment count, and no-show rate for every active stylist.', color: 'bg-blue-50 text-blue-600' },
  { icon: '📉', title: 'No-Show Tracking', desc: 'Industry average is 18%. Know where you stand and which stylists have the highest no-show rates.', color: 'bg-red-50 text-red-600' },
  { icon: '🎯', title: 'Revenue Goals', desc: 'Set monthly revenue goals and see a live daily progress bar. Know at 10am if you\'re on pace.', color: 'bg-amber-50 text-amber-600' },
  { icon: '📊', title: 'Appointment Log', desc: 'Full log with color-coded status badges. Filter by stylist, service, or date range. CSV export on Pro.', color: 'bg-purple-50 text-purple-600' },
  { icon: '🔌', title: 'API & MCP Endpoint', desc: 'REST API and stateless MCP server. Connect SalonIQ to Claude, Zapier, or your own dashboard.', color: 'bg-gray-50 text-gray-600' },
  { icon: '🔐', title: 'Secure Auth', desc: 'Sign in with Google, GitHub, or email. Row-Level Security means your data is completely isolated.', color: 'bg-indigo-50 text-indigo-600' },
  { icon: '📱', title: 'Mobile Responsive', desc: 'Check your metrics from anywhere. Dashboard looks great on phone, tablet, and desktop.', color: 'bg-pink-50 text-pink-600' },
  { icon: '⚡', title: 'Real-Time Data', desc: 'No overnight batch jobs. Your stats update the moment appointments are added or updated.', color: 'bg-yellow-50 text-yellow-600' },
]

export default function FeaturesPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to run a smarter salon</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Focused business intelligence — not another booking platform. We do one thing brilliantly.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map(f => (
            <div key={f.title} className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center text-2xl mb-4`}>{f.icon}</div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <Link href="/auth" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors inline-block">
            Start Free Today
          </Link>
        </div>
      </div>
    </div>
  )
}
