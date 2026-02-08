import Link from 'next/link';
import { Button } from '@/components/ui';
import { ParticlesBackground } from '@/components/ui/ParticlesBackground';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero with particles */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticlesBackground />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="mb-12">
            <h1 className="text-8xl md:text-9xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
              ORIEN
            </h1>
            <p className="text-2xl md:text-3xl text-zinc-300 mb-6 font-light">
              Specialized Compute for Autonomous Agents
            </p>
            <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
              Rent pre-configured hardware with expensive software. Pay per execution, not per month.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link href="/marketplace">
              <Button variant="primary" size="lg" className="text-lg px-8">
                Explore →
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-zinc-700 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
          </div>
        </div>
      </section>

      {/* The 4 Actors - Visual Flow */}
      <section className="max-w-6xl mx-auto px-4 py-32">
        <h2 className="text-5xl font-bold text-center mb-20">How It Works</h2>
        
        <div className="relative">
          {/* Flow line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-20" />
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* 1. User */}
            <div className="relative">
              <div className="text-center p-8 bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl hover:border-blue-500/50 transition-all">
                <div className="text-6xl mb-6">👤</div>
                <div className="text-2xl font-bold mb-3">User</div>
                <p className="text-sm text-zinc-500">
                  Has a mission requiring specialized software
                </p>
              </div>
            </div>

            {/* 2. Agent */}
            <div className="relative">
              <div className="text-center p-8 bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl hover:border-purple-500/50 transition-all">
                <div className="text-6xl mb-6">🤖</div>
                <div className="text-2xl font-bold mb-3">Agent</div>
                <p className="text-sm text-zinc-500">
                  Finds best price/quality compute for the mission
                </p>
              </div>
            </div>

            {/* 3. Provider */}
            <div className="relative">
              <div className="text-center p-8 bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl hover:border-green-500/50 transition-all">
                <div className="text-6xl mb-6">💻</div>
                <div className="text-2xl font-bold mb-3">Provider</div>
                <p className="text-sm text-zinc-500">
                  Rents specialized hardware with pre-installed tools
                </p>
              </div>
            </div>

            {/* 4. DeFi (Optional) */}
            <div className="relative">
              <div className="text-center p-8 bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl hover:border-cyan-500/50 transition-all">
                <div className="text-6xl mb-6">💎</div>
                <div className="text-2xl font-bold mb-3">DeFi</div>
                <p className="text-sm text-zinc-500">
                  Provider reinvests earnings for compound returns
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key insight */}
        <div className="mt-16 text-center">
          <div className="inline-block p-6 bg-blue-500/5 border border-blue-500/20 rounded-xl">
            <p className="text-lg text-zinc-300">
              Agents pay for <span className="text-blue-400 font-semibold">effective execution time</span> only
            </p>
          </div>
        </div>
      </section>

      {/* Specialized Compute - Core Value */}
      <section className="max-w-6xl mx-auto px-4 py-32 border-t border-zinc-800">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Specialized Compute</h2>
          <p className="text-xl text-zinc-500 max-w-3xl mx-auto">
            Hardware pre-configured with expensive software. No installation, no licenses, no maintenance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group p-8 bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-zinc-800 rounded-2xl hover:border-blue-500/30 transition-all">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-3">Creative Suite</h3>
            <ul className="text-sm text-zinc-500 space-y-2">
              <li>• Adobe CC</li>
              <li>• Final Cut Pro</li>
              <li>• Cinema 4D</li>
              <li>• Blender</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-zinc-800 text-xs text-zinc-600">
              Mac Studio / M2 Ultra
            </div>
          </div>

          <div className="group p-8 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-zinc-800 rounded-2xl hover:border-purple-500/30 transition-all">
            <div className="text-4xl mb-4">🧪</div>
            <h3 className="text-xl font-bold mb-3">Dev & CI/CD</h3>
            <ul className="text-sm text-zinc-500 space-y-2">
              <li>• Docker + K8s</li>
              <li>• Playwright</li>
              <li>• Multiple OS</li>
              <li>• Build pipelines</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-zinc-800 text-xs text-zinc-600">
              Dedicated servers
            </div>
          </div>

          <div className="group p-8 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-zinc-800 rounded-2xl hover:border-green-500/30 transition-all">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-3">ML & AI</h3>
            <ul className="text-sm text-zinc-500 space-y-2">
              <li>• CUDA / ROCm</li>
              <li>• PyTorch</li>
              <li>• Pre-loaded models</li>
              <li>• Training datasets</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-zinc-800 text-xs text-zinc-600">
              RTX 4090 / A100
            </div>
          </div>

          <div className="group p-8 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-zinc-800 rounded-2xl hover:border-cyan-500/30 transition-all">
            <div className="text-4xl mb-4">🎵</div>
            <h3 className="text-xl font-bold mb-3">Media & Audio</h3>
            <ul className="text-sm text-zinc-500 space-y-2">
              <li>• Logic Pro X</li>
              <li>• Ableton Live</li>
              <li>• FFmpeg</li>
              <li>• Audio plugins</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-zinc-800 text-xs text-zinc-600">
              Mac Studio / Pro Tools
            </div>
          </div>
        </div>
      </section>

      {/* Why ORIEN */}
      <section className="max-w-4xl mx-auto px-4 py-32 border-t border-zinc-800">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Why ORIEN?</h2>
        </div>

        <div className="space-y-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xl font-bold">
              1
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Pay Per Use</h3>
              <p className="text-zinc-500">
                Cloud VMs charge for idle time. ORIEN bills for effective execution only. No waste.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xl font-bold">
              2
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Pre-Configured</h3>
              <p className="text-zinc-500">
                Expensive software already installed and licensed. Skip setup, start executing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-xl font-bold">
              3
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Secure by Design</h3>
              <p className="text-zinc-500">
                Tool whitelisting, ephemeral workspaces, no raw shell access. Economic security model.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xl font-bold">
              4
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">USDC Settlement</h3>
              <p className="text-zinc-500">
                Instant, transparent payments in stablecoin. No invoices, no 30-day terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="max-w-4xl mx-auto px-4 py-32 text-center">
        <h2 className="text-5xl font-bold mb-8">Get Started</h2>
        <p className="text-xl text-zinc-500 mb-12 max-w-2xl mx-auto">
          Browse available compute or become a provider
        </p>
        <div className="flex items-center justify-center gap-6">
          <Link href="/marketplace">
            <Button variant="primary" size="lg" className="px-12">
              Marketplace
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="ghost" size="lg" className="px-12">
              Become Provider
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
