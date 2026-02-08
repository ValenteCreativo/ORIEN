'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ThreeBackground } from '@/components/ui/ThreeBackground';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A1128] overflow-hidden">
      {/* Three.js Background */}
      <div className="fixed inset-0 z-0">
        <ThreeBackground />
      </div>

      {/* Content */}
      <div className="relative z-10">
        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0A1128]/80 border-b border-[#00F5FF]/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="ORIEN" width={32} height={32} className="opacity-90" />
              <span className="text-lg font-semibold tracking-wider text-white">ORIEN</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm">
              <Link href="/marketplace" className="text-[#A2AAAD] hover:text-[#00F5FF] transition-colors">Marketplace</Link>
              <Link href="/network" className="text-[#A2AAAD] hover:text-[#00F5FF] transition-colors">Network</Link>
              <Link href="/sessions" className="text-[#A2AAAD] hover:text-[#00F5FF] transition-colors">Sessions</Link>
              <Link href="/earnings" className="text-[#A2AAAD] hover:text-[#00F5FF] transition-colors">Earnings</Link>
            </div>
            <Link href="/marketplace">
              <button className="px-5 py-2 text-sm font-medium bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[#00F5FF] rounded-full hover:bg-[#00F5FF]/20 hover:border-[#00F5FF]/50 transition-all">
                Launch App
              </button>
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="relative max-w-4xl mx-auto text-center">
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[600px] h-[600px] bg-[#00F5FF]/5 rounded-full blur-[120px]" />
            </div>
            
            {/* Logo */}
            <div className="relative mb-6 flex justify-center">
              <Image 
                src="/logo.png" 
                alt="ORIEN" 
                width={80} 
                height={80}
                className="opacity-90"
              />
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-[#00F5FF] via-white to-[#00F5FF] bg-clip-text text-transparent">
                ORIEN
              </span>
            </h1>
            
            {/* Value Prop - The Hook */}
            <p className="text-xl md:text-3xl text-white font-medium mb-4 leading-tight">
              Your agent needs an A100 GPU.<br />
              <span className="text-[#00F5FF]">You shouldn&apos;t have to buy one.</span>
            </p>
            
            {/* Description */}
            <p className="text-[#A2AAAD] text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              ORIEN connects AI agents to specialized hardware on-demand. 
              Render a video. Train a model. Run a simulation. 
              <span className="text-white"> Pay only for the seconds your agent actually works.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/marketplace">
                <button className="px-8 py-3.5 text-sm font-semibold bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all duration-300">
                  Find Compute →
                </button>
              </Link>
              <Link href="/register">
                <button className="px-8 py-3.5 text-sm font-medium border border-[#00F5FF]/30 text-[#00F5FF] rounded-full hover:bg-[#00F5FF]/10 transition-all duration-300">
                  Rent Out Hardware
                </button>
              </Link>
            </div>

            {/* Stats - Minimal */}
            <div className="flex items-center justify-center gap-8 md:gap-12 text-center">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-[#00F5FF]">$0</div>
                <div className="text-[10px] md:text-xs text-[#A2AAAD] mt-1 uppercase tracking-wider">When Idle</div>
              </div>
              <div className="w-px h-8 bg-[#A2AAAD]/20" />
              <div>
                <div className="text-2xl md:text-3xl font-bold text-[#00F5FF]">90%</div>
                <div className="text-[10px] md:text-xs text-[#A2AAAD] mt-1 uppercase tracking-wider">To Providers</div>
              </div>
              <div className="w-px h-8 bg-[#A2AAAD]/20" />
              <div>
                <div className="text-2xl md:text-3xl font-bold text-[#00F5FF]">USDC</div>
                <div className="text-[10px] md:text-xs text-[#A2AAAD] mt-1 uppercase tracking-wider">Instant Pay</div>
              </div>
            </div>
          </div>
        </section>

        {/* The Problem / Opportunity */}
        <section className="py-24 px-6 border-t border-[#A2AAAD]/10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[#00F5FF] text-sm uppercase tracking-widest mb-4">The Opportunity</p>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Agents are the new workforce.<br />
                <span className="text-[#A2AAAD]">They just need better tools.</span>
              </h2>
              <p className="text-[#A2AAAD] max-w-2xl mx-auto text-lg">
                Today&apos;s AI agents can write code, analyze data, and create content. 
                But when they need to render a 3D scene, train a model, or process video—they hit a wall.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* The Problem */}
              <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-2xl">
                <div className="text-red-400 text-sm font-medium uppercase tracking-wider mb-4">Without ORIEN</div>
                <ul className="space-y-4 text-[#A2AAAD]">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-0.5">✗</span>
                    <span>Agents limited to basic cloud VMs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-0.5">✗</span>
                    <span>Pay for servers 24/7, use them 2% of the time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-0.5">✗</span>
                    <span>No access to specialized software (Adobe, Logic Pro, etc.)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-0.5">✗</span>
                    <span>Hardware providers leave machines idle</span>
                  </li>
                </ul>
              </div>

              {/* The Solution */}
              <div className="p-8 bg-[#00F5FF]/5 border border-[#00F5FF]/20 rounded-2xl">
                <div className="text-[#00F5FF] text-sm font-medium uppercase tracking-wider mb-4">With ORIEN</div>
                <ul className="space-y-4 text-[#A2AAAD]">
                  <li className="flex items-start gap-3">
                    <span className="text-[#00F5FF] mt-0.5">✓</span>
                    <span>Agents access A100s, Mac Studios, pro software</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00F5FF] mt-0.5">✓</span>
                    <span>Pay per second of <em>actual execution</em></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00F5FF] mt-0.5">✓</span>
                    <span>Pre-configured stacks, zero setup</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00F5FF] mt-0.5">✓</span>
                    <span>Providers earn 90% on every job</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 px-6 border-t border-[#A2AAAD]/10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[#00F5FF] text-sm uppercase tracking-widest mb-4">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Four steps. Zero friction.
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { 
                  num: '01', 
                  title: 'Agent Requests', 
                  desc: 'Your agent needs GPU power, creative software, or specialized hardware',
                  icon: '🤖' 
                },
                { 
                  num: '02', 
                  title: 'ORIEN Matches', 
                  desc: 'We find the best provider based on tools, price, and reputation',
                  icon: '⚡' 
                },
                { 
                  num: '03', 
                  title: 'Provider Executes', 
                  desc: 'Task runs on real hardware. Timer counts only active execution',
                  icon: '🖥️' 
                },
                { 
                  num: '04', 
                  title: 'USDC Settles', 
                  desc: 'Instant payment. 90% to provider, with optional DeFi auto-compound',
                  icon: '💰' 
                },
              ].map((item, i) => (
                <div key={i} className="group relative">
                  {i < 3 && (
                    <div className="hidden md:block absolute top-8 -right-3 w-6 h-px bg-gradient-to-r from-[#00F5FF]/40 to-transparent" />
                  )}
                  
                  <div className="p-6 bg-[#0A1128]/60 backdrop-blur-sm border border-[#A2AAAD]/10 rounded-xl hover:border-[#00F5FF]/30 transition-all duration-300 h-full">
                    <div className="text-3xl mb-4">{item.icon}</div>
                    <div className="text-[10px] text-[#00F5FF]/60 font-mono mb-2">{item.num}</div>
                    <div className="text-lg font-semibold text-white mb-2">{item.title}</div>
                    <p className="text-sm text-[#A2AAAD] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For Agents */}
        <section className="py-24 px-6 border-t border-[#A2AAAD]/10">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[#00F5FF] text-sm uppercase tracking-widest mb-4">For Agent Builders</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Give your agent superpowers.
                </h2>
                <p className="text-[#A2AAAD] text-lg mb-8 leading-relaxed">
                  Your agent shouldn&apos;t be limited by the hardware it runs on. 
                  With ORIEN, any agent can access professional-grade compute—GPUs, 
                  creative suites, specialized software—without you managing infrastructure.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    'API-first: integrate in minutes',
                    'Effective time billing: pay for work, not waiting',
                    'Budget caps: set limits, never overspend',
                    'Verified providers: reputation system you can trust',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[#A2AAAD]">
                      <span className="w-1.5 h-1.5 bg-[#00F5FF] rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/marketplace">
                  <button className="px-6 py-3 text-sm font-semibold bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all">
                    Explore Marketplace →
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'Creative', tools: ['Adobe CC', 'Cinema 4D', 'Blender'], hw: 'Mac Studio M2 Ultra' },
                  { title: 'AI/ML', tools: ['PyTorch', 'CUDA 12', 'vLLM'], hw: 'NVIDIA A100 80GB' },
                  { title: 'DevOps', tools: ['Docker', 'Kubernetes', 'Terraform'], hw: 'Dedicated Server' },
                  { title: 'Media', tools: ['Logic Pro', 'FFmpeg', 'DaVinci'], hw: 'Pro Audio Rig' },
                ].map((stack, i) => (
                  <div 
                    key={i}
                    className="p-5 bg-[#0A1128]/60 backdrop-blur-sm border border-[#A2AAAD]/10 rounded-xl hover:border-[#00F5FF]/20 transition-all group"
                  >
                    <h3 className="text-base font-semibold text-white mb-3 group-hover:text-[#00F5FF] transition-colors">
                      {stack.title}
                    </h3>
                    <ul className="space-y-1.5 mb-4">
                      {stack.tools.map((tool, j) => (
                        <li key={j} className="text-xs text-[#A2AAAD] flex items-center gap-2">
                          <span className="w-1 h-1 bg-[#00F5FF]/50 rounded-full" />
                          {tool}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-3 border-t border-[#A2AAAD]/10 text-[10px] text-[#A2AAAD]/60">
                      {stack.hw}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* For Providers */}
        <section className="py-24 px-6 border-t border-[#A2AAAD]/10 bg-gradient-to-b from-[#00F5FF]/5 to-transparent">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                {/* Earnings visualization */}
                <div className="p-8 bg-[#0A1128]/80 backdrop-blur-sm border border-[#00F5FF]/20 rounded-2xl">
                  <div className="text-sm text-[#A2AAAD] mb-6">Revenue Split</div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-medium">You (Provider)</span>
                        <span className="text-[#00F5FF] font-bold text-xl">90%</span>
                      </div>
                      <div className="h-4 bg-[#A2AAAD]/10 rounded-full overflow-hidden">
                        <div className="h-full w-[90%] bg-gradient-to-r from-[#00F5FF] to-[#00F5FF]/60 rounded-full" />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-[#A2AAAD]">Platform</span>
                        <span className="text-[#A2AAAD]">7%</span>
                      </div>
                      <div className="h-2 bg-[#A2AAAD]/10 rounded-full overflow-hidden">
                        <div className="h-full w-[7%] bg-[#A2AAAD]/40 rounded-full" />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-[#A2AAAD]/60">Reserve</span>
                        <span className="text-[#A2AAAD]/60">3%</span>
                      </div>
                      <div className="h-2 bg-[#A2AAAD]/10 rounded-full overflow-hidden">
                        <div className="h-full w-[3%] bg-[#A2AAAD]/20 rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#A2AAAD]/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[#A2AAAD]">Auto-compound via DeFi</span>
                      <span className="text-green-400 text-sm font-medium">+4.2% APY</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <p className="text-[#00F5FF] text-sm uppercase tracking-widest mb-4">For Hardware Owners</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Your idle GPU is leaving money on the table.
                </h2>
                <p className="text-[#A2AAAD] text-lg mb-8 leading-relaxed">
                  That Mac Studio sitting idle? That gaming rig between sessions? 
                  Connect it to ORIEN and let AI agents pay you to use it. 
                  No babysitting required—set your rate and let the work come to you.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    '90% of every transaction goes to you',
                    'Instant USDC settlement—no invoicing',
                    'Auto-reinvest earnings via Aave, Compound, Yearn',
                    'Reputation system rewards reliability',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[#A2AAAD]">
                      <span className="w-1.5 h-1.5 bg-[#00F5FF] rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <button className="px-6 py-3 text-sm font-semibold bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all">
                    Start Earning →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust / Security */}
        <section className="py-24 px-6 border-t border-[#A2AAAD]/10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[#00F5FF] text-sm uppercase tracking-widest mb-4">Built for Trust</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Secure. Transparent. Fair.
            </h2>
            <p className="text-[#A2AAAD] max-w-2xl mx-auto mb-12 text-lg">
              Every execution is metered on-chain. Every payment is instant. 
              No lock-in, no hidden fees, no games.
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { 
                  icon: '🔒', 
                  title: 'Sandboxed Execution', 
                  desc: 'Tasks run in isolated environments. Your machine stays safe.' 
                },
                { 
                  icon: '⏱️', 
                  title: 'Effective Time Only', 
                  desc: 'Pay for CPU cycles, not clock time. Fair by design.' 
                },
                { 
                  icon: '💎', 
                  title: 'USDC Settlement', 
                  desc: 'Stable, instant, on-chain. No payment delays or fees.' 
                },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-[#0A1128]/60 backdrop-blur-sm border border-[#A2AAAD]/10 rounded-xl">
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-[#A2AAAD]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 border-t border-[#A2AAAD]/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              The future of work is agentic.<br />
              <span className="text-[#00F5FF]">The infrastructure is ORIEN.</span>
            </h2>
            <p className="text-[#A2AAAD] mb-10 text-lg max-w-xl mx-auto">
              Whether you&apos;re building the next generation of AI agents or 
              have hardware ready to work—there&apos;s a place for you here.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/marketplace">
                <button className="px-10 py-4 text-base font-semibold bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_40px_rgba(0,245,255,0.4)] transition-all duration-300">
                  Enter Marketplace
                </button>
              </Link>
              <Link href="/register">
                <button className="px-10 py-4 text-base font-medium border border-[#00F5FF]/30 text-[#00F5FF] rounded-full hover:bg-[#00F5FF]/10 transition-all duration-300">
                  Become a Provider
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-[#A2AAAD]/10">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A2AAAD]/60">
            <span>© 2026 ORIEN — The Compute Rail for Agents</span>
            <div className="flex items-center gap-6">
              <Link href="/docs" className="hover:text-[#00F5FF] transition-colors">Docs</Link>
              <Link href="/github" className="hover:text-[#00F5FF] transition-colors">GitHub</Link>
              <Link href="https://warpcast.com/orien" className="hover:text-[#00F5FF] transition-colors">Warpcast</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
