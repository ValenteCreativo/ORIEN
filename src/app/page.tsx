import Link from 'next/link';
import { Button } from '@/components/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <div className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400 mb-6">
            The Compute Marketplace for Agents
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            ORIEN
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-4">
            Orchestration Rail for Infrastructure & Execution Networks
          </p>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
            Autonomous agents rent specialized compute infrastructure and pay for <span className="text-white font-semibold">effective execution time only</span>. No idle charges. USDC settlements.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-16">
          <Link href="/marketplace">
            <Button variant="primary" size="lg" className="text-lg">
              Browse Marketplace →
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="ghost" size="lg" className="text-lg">
              Read Docs
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <div className="text-4xl font-bold text-blue-400 mb-2">0%</div>
            <div className="text-sm text-zinc-500">Idle Time Charges</div>
          </div>
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <div className="text-4xl font-bold text-green-400 mb-2">90%</div>
            <div className="text-sm text-zinc-500">Provider Payout</div>
          </div>
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <div className="text-4xl font-bold text-purple-400 mb-2">USDC</div>
            <div className="text-sm text-zinc-500">Native Settlement</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 py-20 border-t border-zinc-800">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* For Agents */}
          <div className="p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-3">For Agents</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Browse specialized compute providers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Set budget allowance per session</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Execute via restricted tool API</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Pay only for effective execution time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">✓</span>
                <span>Automatic settlement in USDC</span>
              </li>
            </ul>
          </div>

          {/* For Providers */}
          <div className="p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="text-xl font-bold mb-3">For Providers</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>List your specialized hardware</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Set your own pricing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Whitelist allowed tools</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Receive 90% of revenue</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Auto-reinvest into DeFi (optional)</span>
              </li>
            </ul>
          </div>

          {/* Technical */}
          <div className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3">Technical</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✓</span>
                <span>No raw shell access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✓</span>
                <span>Ephemeral workspaces</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✓</span>
                <span>Resource limits per tool</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✓</span>
                <span>Effective time metering</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">✓</span>
                <span>Yellow + Arc + LI.FI rails</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-6xl mx-auto px-4 py-20 border-t border-zinc-800">
        <h2 className="text-3xl font-bold text-center mb-4">Use Cases</h2>
        <p className="text-center text-zinc-500 mb-12 max-w-2xl mx-auto">
          Specialized compute infrastructure for agents that need more than generic cloud VMs
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
            <div className="text-2xl mb-3">🎨</div>
            <h3 className="text-lg font-semibold mb-2">Design & Rendering</h3>
            <p className="text-sm text-zinc-500">
              Mac minis with Adobe Creative Cloud, Blender, Cinema 4D. Pay per render, not per month.
            </p>
          </div>

          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
            <div className="text-2xl mb-3">🧪</div>
            <h3 className="text-lg font-semibold mb-2">Dev & Testing</h3>
            <p className="text-sm text-zinc-500">
              Pre-configured CI/CD environments, browsers with automation, specific OS versions.
            </p>
          </div>

          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
            <div className="text-2xl mb-3">🤖</div>
            <h3 className="text-lg font-semibold mb-2">ML Training</h3>
            <p className="text-sm text-zinc-500">
              GPUs with pre-loaded models and datasets. Pay for training time, not idle capacity.
            </p>
          </div>

          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
            <div className="text-2xl mb-3">🎵</div>
            <h3 className="text-lg font-semibold mb-2">Media Processing</h3>
            <p className="text-sm text-zinc-500">
              Video encoding, audio mastering, image processing. Expensive licenses, affordable usage.
            </p>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="max-w-6xl mx-auto px-4 py-20 border-t border-zinc-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Security Model</h2>
          <p className="text-center text-zinc-500 mb-12">
            ORIEN is an orchestration rail, not a hypervisor. Security is economic and operational.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <span className="text-2xl">🔒</span>
              <div>
                <div className="font-semibold mb-1">No Secrets on Provider Machines</div>
                <div className="text-sm text-zinc-500">
                  Agents never store credentials on rented compute. Keep secrets local or in vaults.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <span className="text-2xl">🛡️</span>
              <div>
                <div className="font-semibold mb-1">Tool Whitelisting</div>
                <div className="text-sm text-zinc-500">
                  Providers define allowed tools. Agents cannot execute arbitrary commands.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <span className="text-2xl">🗑️</span>
              <div>
                <div className="font-semibold mb-1">Ephemeral Workspaces</div>
                <div className="text-sm text-zinc-500">
                  Each session gets a temporary workspace. Auto-deleted after session ends.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
              <span className="text-2xl">⏱️</span>
              <div>
                <div className="font-semibold mb-1">Resource & Time Limits</div>
                <div className="text-sm text-zinc-500">
                  Hard caps on CPU, memory, and execution time per tool. Budget-based access control.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="p-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
            Join the compute marketplace for autonomous agents. Rent specialized infrastructure or provide your own.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/marketplace">
              <Button variant="primary" size="lg">
                Browse Providers
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary" size="lg">
                Become a Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
