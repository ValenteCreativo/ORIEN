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
            
            {/* Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[600px] h-[600px] bg-[#00F5FF]/5 rounded-full blur-[120px]" />
            </div>
            
            {/* Logo */}
            <div className="relative mb-6 flex justify-center">
              <Image src="/logo.png" alt="ORIEN" width={80} height={80} className="opacity-90" />
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-[#00F5FF] via-white to-[#00F5FF] bg-clip-text text-transparent">
                ORIEN
              </span>
            </h1>
            
            {/* Value Prop */}
            <p className="text-xl md:text-3xl text-white font-medium mb-4 leading-tight">
              Your agent needs an A100 GPU.<br />
              <span className="text-[#00F5FF]">You shouldn&apos;t have to buy one.</span>
            </p>
            
            {/* Description */}
            <p className="text-[#A2AAAD] text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              ORIEN is a compute marketplace where AI agents rent specialized hardware 
              to run missions—rendering, training, processing—and pay only for 
              <span className="text-white"> the seconds they actually execute.</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/marketplace">
                <button className="px-8 py-3.5 text-sm font-semibold bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all duration-300">
                  Find Compute →
                </button>
              </Link>
              <Link href="/register">
                <button className="px-8 py-3.5 text-sm font-medium border border-[#00F5FF]/30 text-[#00F5FF] rounded-full hover:bg-[#00F5FF]/10 transition-all duration-300">
                  List Your Hardware
                </button>
              </Link>
            </div>

            {/* Scroll */}
            <div className="animate-bounce text-[#A2AAAD]/40 text-2xl">↓</div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-6 border-t border-[#A2AAAD]/10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                How it works
              </h2>
              <p className="text-[#A2AAAD] max-w-lg mx-auto">
                API call → real hardware → instant settlement. Three steps, zero friction.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { 
                  num: '01', 
                  title: 'Request', 
                  desc: 'Agent calls the API needing GPU power, creative software, or specialized compute for a mission.',
                  icon: '🤖' 
                },
                { 
                  num: '02', 
                  title: 'Execute', 
                  desc: 'Task runs on provider\'s hardware. Only active execution time is metered—idle time is free.',
                  icon: '⚡' 
                },
                { 
                  num: '03', 
                  title: 'Settle', 
                  desc: 'Instant USDC payment on completion. Provider gets 90%, platform takes 7%, 3% to reserve.',
                  icon: '💰' 
                },
              ].map((item, i) => (
                <div key={i} className="relative">
                  {i < 2 && (
                    <div className="hidden md:block absolute top-10 -right-4 w-8 text-[#00F5FF]/30 text-xl">→</div>
                  )}
                  
                  <div className="p-6 bg-[#0A1128]/60 backdrop-blur-sm border border-[#A2AAAD]/10 rounded-xl hover:border-[#00F5FF]/30 transition-all duration-300 h-full text-center">
                    <div className="text-4xl mb-4">{item.icon}</div>
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
                  Your agent can do more than you think.
                </h2>
                <p className="text-[#A2AAAD] text-lg mb-6 leading-relaxed">
                  Today your agent writes code and analyzes data. But what if it could render 
                  a 3D product visualization? Train a custom model? Master an audio track?
                </p>
                <p className="text-[#A2AAAD] text-lg mb-8 leading-relaxed">
                  ORIEN gives your agent access to <span className="text-white">A100 GPUs, Mac Studios, 
                  and professional software stacks</span>—without you managing any infrastructure. 
                  Just API calls.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Render, train, process, encode—all via API',
                    'Budget caps prevent runaway costs',
                    'Effective time billing: pay for work, not waiting',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[#A2AAAD]">
                      <span className="w-1.5 h-1.5 bg-[#00F5FF] rounded-full flex-shrink-0" />
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
                  { title: 'Creative', tools: ['Adobe CC', 'Cinema 4D', 'Blender'], example: 'Render product shots' },
                  { title: 'AI/ML', tools: ['PyTorch', 'CUDA 12', 'vLLM'], example: 'Fine-tune models' },
                  { title: 'Media', tools: ['Logic Pro', 'FFmpeg', 'DaVinci'], example: 'Process video/audio' },
                  { title: 'DevOps', tools: ['Docker', 'K8s', 'Terraform'], example: 'Build & deploy' },
                ].map((stack, i) => (
                  <div 
                    key={i}
                    className="p-5 bg-[#0A1128]/60 backdrop-blur-sm border border-[#A2AAAD]/10 rounded-xl hover:border-[#00F5FF]/20 transition-all group"
                  >
                    <h3 className="text-base font-semibold text-white mb-2 group-hover:text-[#00F5FF] transition-colors">
                      {stack.title}
                    </h3>
                    <p className="text-xs text-[#00F5FF]/70 mb-3">{stack.example}</p>
                    <ul className="space-y-1">
                      {stack.tools.map((tool, j) => (
                        <li key={j} className="text-xs text-[#A2AAAD] flex items-center gap-2">
                          <span className="w-1 h-1 bg-[#A2AAAD]/40 rounded-full" />
                          {tool}
                        </li>
                      ))}
                    </ul>
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
                {/* RWA Card */}
                <div className="p-8 bg-[#0A1128]/80 backdrop-blur-sm border border-[#00F5FF]/20 rounded-2xl">
                  <div className="text-sm text-[#00F5FF] uppercase tracking-wider mb-6">Your Hardware = Real World Asset</div>
                  
                  <div className="space-y-6">
                    {/* Earnings */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-medium">Your earnings</span>
                        <span className="text-[#00F5FF] font-bold text-2xl">90%</span>
                      </div>
                      <div className="h-3 bg-[#A2AAAD]/10 rounded-full overflow-hidden">
                        <div className="h-full w-[90%] bg-gradient-to-r from-[#00F5FF] to-[#00F5FF]/60 rounded-full" />
                      </div>
                    </div>

                    {/* Example earnings */}
                    <div className="p-4 bg-[#00F5FF]/5 rounded-xl">
                      <div className="text-xs text-[#A2AAAD] mb-2">Example: GPU rendering job</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white">$4.50</span>
                        <span className="text-[#A2AAAD] text-sm">for 5 min of compute</span>
                      </div>
                    </div>

                    {/* Multiplier */}
                    <div className="pt-4 border-t border-[#A2AAAD]/10">
                      <div className="text-sm text-[#A2AAAD] mb-2">
                        <span className="text-white">Add specialized software</span> to charge premium rates
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Adobe CC', 'Logic Pro', 'Cinema 4D'].map((sw) => (
                          <span key={sw} className="px-2 py-1 bg-[#00F5FF]/10 text-[#00F5FF] text-xs rounded">
                            +{sw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Auto-compound */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#A2AAAD]/10">
                      <span className="text-[#A2AAAD] text-sm">Auto-reinvest via DeFi</span>
                      <span className="text-green-400 text-sm font-medium">+APY</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <p className="text-[#00F5FF] text-sm uppercase tracking-widest mb-4">For Hardware Owners</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Your idle compute is a revenue stream waiting to happen.
                </h2>
                <p className="text-[#A2AAAD] text-lg mb-6 leading-relaxed">
                  That Mac Studio you use for client work? It sits idle 80% of the time. 
                  That gaming rig? Same story. Connect them to ORIEN and 
                  <span className="text-white"> turn compute power into a real world asset that earns while you sleep.</span>
                </p>
                <p className="text-[#A2AAAD] text-lg mb-8 leading-relaxed">
                  The more specialized your setup, the more you can charge. 
                  A bare GPU is good. A GPU with Adobe CC, Blender, and CUDA? That&apos;s premium.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'List your hardware in minutes',
                    'Set your own rates—we just connect you to demand',
                    'Instant USDC settlement, no invoicing',
                    'Optional: auto-compound earnings in DeFi',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[#A2AAAD]">
                      <span className="w-1.5 h-1.5 bg-[#00F5FF] rounded-full flex-shrink-0" />
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

        {/* Trust Signals */}
        <section className="py-16 px-6 border-t border-[#A2AAAD]/10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { icon: '🔒', title: 'Sandboxed', desc: 'Tasks run isolated. Your machine stays safe.' },
                { icon: '⏱️', title: 'Effective Time', desc: 'Pay for compute, not clock time.' },
                { icon: '💎', title: 'USDC Instant', desc: 'On-chain settlement, no delays.' },
              ].map((item, i) => (
                <div key={i} className="p-4">
                  <span className="text-3xl block mb-2">{item.icon}</span>
                  <span className="text-sm font-medium text-white block mb-1">{item.title}</span>
                  <span className="text-xs text-[#A2AAAD]">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 border-t border-[#A2AAAD]/10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The compute rail for the agentic era.
            </h2>
            <p className="text-[#A2AAAD] mb-8 text-lg">
              Build agents that can do more. Or monetize the hardware you already own.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/marketplace">
                <button className="px-8 py-3.5 text-sm font-semibold bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all">
                  Enter Marketplace
                </button>
              </Link>
              <a 
                href="https://github.com/ValenteCreativo/ORIEN"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="px-8 py-3.5 text-sm font-medium border border-[#A2AAAD]/30 text-[#A2AAAD] rounded-full hover:border-[#00F5FF]/30 hover:text-[#00F5FF] transition-all">
                  View on GitHub
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-[#A2AAAD]/10">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A2AAAD]/60">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="ORIEN" width={16} height={16} className="opacity-60" />
              <span>ORIEN · From México with 💙</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/docs" className="hover:text-[#00F5FF] transition-colors">Docs</Link>
              <a
                href="https://github.com/ValenteCreativo/ORIEN"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00F5FF] transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com/fruteroclub"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00F5FF] transition-colors"
              >
                Twitter
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
