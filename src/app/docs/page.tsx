import Link from 'next/link'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">✂️</span>
            <span className="font-bold text-gray-900 text-lg">SalonIQ</span>
          </Link>
          <Link href="/auth" className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg font-medium">Get Started Free</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">API Documentation</h1>
        <p className="text-gray-600 mb-12">Integrate SalonIQ into your tools with the REST API or MCP endpoint.</p>

        {/* REST API */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">REST API</h2>

          <div className="space-y-8">
            {[
              {
                method: 'GET', path: '/api/v1/stats',
                desc: 'Returns key business intelligence metrics for a salon.',
                params: [{ name: 'user_id', type: 'string', required: true, desc: 'Your user/salon ID' }],
                response: `{ "todayRevenue": 450, "monthRevenue": 12500, "utilizationPct": 72, "noShowRate": 14, "stylistCount": 3 }`,
              },
              {
                method: 'POST', path: '/api/appointments',
                desc: 'Create a new appointment.',
                body: `{ "user_id": "...", "stylist_id": "...", "client_name": "Sarah L", "service": "Color", "price": 120, "scheduled_at": "2025-03-01T10:00:00Z", "status": "scheduled" }`,
                response: `{ "data": { "id": "...", "status": "scheduled", ... } }`,
              },
            ].map(e => (
              <div key={e.path} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${e.method === 'GET' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{e.method}</span>
                  <code className="text-sm font-mono text-gray-900">{e.path}</code>
                </div>
                <div className="px-6 py-4">
                  <p className="text-gray-700 text-sm mb-4">{e.desc}</p>
                  {e.params && <div className="mb-4"><div className="text-xs font-medium text-gray-500 uppercase mb-2">Query Parameters</div>{e.params.map(p => <div key={p.name} className="flex items-start gap-2 text-sm"><code className="text-green-700 font-mono">{p.name}</code><span className="text-gray-500">{p.type} {p.required && '(required)'} — {p.desc}</span></div>)}</div>}
                  {e.body && <div className="mb-4"><div className="text-xs font-medium text-gray-500 uppercase mb-2">Request Body</div><pre className="bg-gray-50 rounded-lg p-3 text-xs text-gray-800 overflow-x-auto">{e.body}</pre></div>}
                  <div><div className="text-xs font-medium text-gray-500 uppercase mb-2">Response</div><pre className="bg-gray-50 rounded-lg p-3 text-xs text-gray-800 overflow-x-auto">{e.response}</pre></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MCP */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">MCP Endpoint</h2>
          <p className="text-gray-600 mb-6">Use SalonIQ with Claude, Cursor, and other MCP-compatible AI tools.</p>
          <div className="border border-gray-200 rounded-xl p-6">
            <div className="text-sm font-medium text-gray-700 mb-2">Endpoint URL</div>
            <code className="block bg-gray-50 rounded-lg px-4 py-2 text-sm font-mono mb-6">POST /api/mcp</code>
            <div className="space-y-4">
              {[
                { name: 'get_stats', desc: 'Get utilization, no-show rate, and revenue stats' },
                { name: 'add_appointment', desc: 'Create a new appointment' },
                { name: 'get_stylists', desc: 'List active stylists for a salon' },
              ].map(t => (
                <div key={t.name} className="flex items-start gap-3">
                  <code className="text-green-700 font-mono text-sm">{t.name}</code>
                  <span className="text-gray-600 text-sm">— {t.desc}</span>
                </div>
              ))}
            </div>
            <pre className="bg-gray-50 rounded-lg p-4 text-xs mt-6 overflow-x-auto">{`// Example: initialize
POST /api/mcp
{ "jsonrpc": "2.0", "method": "initialize", "id": 1 }

// Example: get stats
{ "jsonrpc": "2.0", "method": "tools/call", "id": 2, "params": { "name": "get_stats", "arguments": { "user_id": "your-user-id" } } }`}</pre>
          </div>
        </section>
      </div>
    </div>
  )
}
