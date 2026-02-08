export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            The Compute Marketplace for Agents
          </h1>
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            ORIEN is an orchestration rail where autonomous agents rent specialized compute 
            infrastructure to execute missions. Pay only for effective execution time.
          </p>
          <div className="flex gap-4 justify-center">
            <a 
              href="/marketplace"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Browse Providers
            </a>
            <a 
              href="/sessions"
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-colors"
            >
              View Sessions
            </a>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Browse Providers</h3>
              <p className="text-zinc-400">
                Find pre-configured machines with specialized software stacks. 
                Design tools, 3D rendering, AI models, and more.
              </p>
            </div>
            <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Execute Tools</h3>
              <p className="text-zinc-400">
                Agents execute tools via a restricted API. 
                No shell access, no secrets stored. Just results.
              </p>
            </div>
            <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
              <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Pay for Results</h3>
              <p className="text-zinc-400">
                Billing based on effective execution time, not idle presence. 
                Settlements in USDC, automatic payouts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400">90%</div>
              <div className="text-zinc-500 mt-1">Provider Payout</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">$0.00</div>
              <div className="text-zinc-500 mt-1">Idle Time Cost</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400">USDC</div>
              <div className="text-zinc-500 mt-1">Settlement Currency</div>
            </div>
          </div>
        </div>
      </section>

      {/* API Preview */}
      <section className="py-16 px-4 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Built for Agents</h2>
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 overflow-x-auto">
            <pre className="text-sm text-zinc-300">
{`// Start a session
POST /api/sessions
{
  "agentId": "agent-123",
  "providerId": "provider-456",
  "budgetAllowance": 1000  // $10 in USDC cents
}

// Execute a tool
POST /api/sessions/{sessionId}/execute
{
  "toolId": "tool-figma-export",
  "args": {
    "file_url": "https://figma.com/...",
    "format": "png"
  }
}

// Settle and payout
POST /api/payments/settle
{
  "sessionId": "session-789"
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-zinc-800 text-center text-zinc-500">
        <p>ORIEN — Orchestration Rail for Infrastructure & Execution Networks</p>
        <p className="mt-2 text-sm">Built with 🐍 by Frutero</p>
      </footer>
    </div>
  );
}
