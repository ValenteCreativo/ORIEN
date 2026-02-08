'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { ThreeBackground } from '@/components/ui/ThreeBackground';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A1128] overflow-hidden">
      {/* Three.js Background - fixed z-index */}
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
          <div className="max-w-4xl mx-auto text-center">
            
            {/* Subtle glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00F5FF]/5 rounded-full blur-[120px] pointer-events-none" />
            
            {/* Logo */}
            <div className="mb-6 relative">
              <Image 
                src="/logo.png" 
                alt="ORIEN" 
                width={80} 
                height={80}
                className="mx-auto opacity-90"
              />
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-[#00F5FF] via-white to-[#00F5FF] bg-clip-text text-transparent">
                ORIEN
              </span>
            </h1>
            
            {/* Tagline */}
            <p className="text-xl md:text-2xl text-[#00F5FF]/80 font-light mb-3 tracking-wide">
              The Compute Rail for Agents
            </p>
            
            {/* Description */}
            <p className="text-[#A2AAAD] text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Specialized hardware. Pre-configured software stacks. 
              Pay only for execution time. Settle in USDC.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/marketplace">
                <button className="px-8 py-3 text-sm font-semibold bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_30px_rgba(0,245,255,0.4)] transition-all duration-300">
                  Enter Marketplace
                </button>
              </Link>
              <Link href="#how-it-works">
                <button className="px-8 py-3 text-sm font-medium border border-[#A2AAAD]/30 text-[#A2AAAD] rounded-full hover:border-[#00F5FF]/50 hover:text-[#00F5FF] transition-all duration-300">
                  How It Works
                </button>
              </Link>
            </div>

            {/* Stats - Minimal */}
            <div className="flex items-center justify-center gap-12 text-center">
              <div>
                <div className="text-3xl font-bold text-[#00F5FF]">0%</div>
                <div className="text-xs text-[#A2AAAD] mt-1 uppercase tracking-wider">Idle Cost</div>
              </div>
              <div className="w-px h-8 bg-[#A2AAAD]/20" />
              <div>
                <div className="text-3xl font-bold text-[#00F5FF]">90%</div>
                <div className="text-xs text-[#A2AAAD] mt-1 uppercase tracking-wider">To Provider</div>
              </div>
              <div className="w-px h-8 bg-[#A2AAAD]/20" />
              <div>
                <div className="text-3xl font-bold text-[#00F5FF]">USDC</div>
                <div className="text-xs text-[#A2AAAD] mt-1 uppercase tracking-wider">Settlement</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                The Flow
              </h2>
              <p className="text-[#A2AAAD] max-w-lg mx-auto">
                Four actors. One seamless economy.
              </p>
            </div>
            
            {/* Flow Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { num: '01', title: 'User', desc: 'Defines mission', icon: '◉' },
                { num: '02', title: 'Agent', desc: 'Finds best compute', icon: '◎' },
                { num: '03', title: 'Provider', desc: 'Executes tasks', icon: '◈' },
                { num: '04', title: 'DeFi', desc: 'Reinvests earnings', icon: '◇' },
              ].map((item, i) => (
                <div key={i} className="group relative">
                  {/* Connector line */}
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-px bg-gradient-to-r from-[#00F5FF]/40 to-transparent" />
                  )}
                  
                  <div className="p-6 bg-[#0A1128]/60 backdrop-blur-sm border border-[#A2AAAD]/10 rounded-xl hover:border-[#00F5FF]/30 transition-all duration-500">
                    <div className="text-[10px] text-[#00F5FF]/60 font-mono mb-3">{item.num}</div>
                    <div className="text-xl text-[#00F5FF]/40 mb-3">{item.icon}</div>
                    <div className="text-lg font-semibold text-white mb-1">{item.title}</div>
                    <p className="text-sm text-[#A2AAAD]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compute Stacks */}
        <section className="py-24 px-6 border-t border-[#A2AAAD]/10">
          <div className="max-w-5xl mx-auto">
            
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Specialized Compute
              </h2>
              <p className="text-[#A2AAAD] max-w-lg mx-auto">
                Pre-configured stacks ready for immediate execution.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Creative', tools: ['Adobe CC', 'Cinema 4D', 'Blender'], hw: 'Mac Studio' },
                { title: 'DevOps', tools: ['Docker', 'K8s', 'CI/CD'], hw: 'Dedicated' },
                { title: 'AI/ML', tools: ['PyTorch', 'CUDA', 'Models'], hw: 'A100 GPU' },
                { title: 'Media', tools: ['Logic Pro', 'FFmpeg', 'DAW'], hw: 'Pro Tools' },
              ].map((stack, i) => (
                <div 
                  key={i}
                  className="p-5 bg-[#0A1128]/40 backdrop-blur-sm border border-[#A2AAAD]/10 rounded-xl hover:border-[#00F5FF]/20 transition-all duration-300 group"
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
                  <div className="pt-3 border-t border-[#A2AAAD]/10 text-[10px] text-[#A2AAAD]/60 uppercase tracking-wider">
                    {stack.hw}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Economic Model */}
        <section className="py-24 px-6 border-t border-[#A2AAAD]/10">
          <div className="max-w-3xl mx-auto text-center">
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Economic Primitive
            </h2>
            <p className="text-[#A2AAAD] mb-12 max-w-xl mx-auto">
              A new coordination layer for compute and capital.
            </p>
            
            {/* Split visualization */}
            <div className="flex items-center justify-center gap-6 mb-12">
              <div className="flex-1 max-w-[200px]">
                <div className="h-2 bg-[#00F5FF] rounded-full mb-3" style={{width: '90%'}} />
                <div className="text-2xl font-bold text-[#00F5FF]">90%</div>
                <div className="text-xs text-[#A2AAAD] uppercase tracking-wider mt-1">Provider</div>
              </div>
              <div className="flex-1 max-w-[60px]">
                <div className="h-2 bg-[#A2AAAD]/40 rounded-full mb-3" style={{width: '70%'}} />
                <div className="text-lg font-bold text-[#A2AAAD]">7%</div>
                <div className="text-xs text-[#A2AAAD]/60 uppercase tracking-wider mt-1">Platform</div>
              </div>
              <div className="flex-1 max-w-[40px]">
                <div className="h-2 bg-[#A2AAAD]/20 rounded-full mb-3" style={{width: '50%'}} />
                <div className="text-lg font-bold text-[#A2AAAD]/60">3%</div>
                <div className="text-xs text-[#A2AAAD]/40 uppercase tracking-wider mt-1">Reserve</div>
              </div>
            </div>
            
            <p className="text-sm text-[#A2AAAD]/80 max-w-md mx-auto">
              Providers earn 90% of execution fees. Earnings auto-compound via integrated DeFi strategies.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 border-t border-[#A2AAAD]/10">
          <div className="max-w-2xl mx-auto text-center">
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Begin?
            </h2>
            <p className="text-[#A2AAAD] mb-8">
              Browse compute or become a provider.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/marketplace">
                <button className="px-10 py-3.5 text-sm font-semibold bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_40px_rgba(0,245,255,0.4)] transition-all duration-300">
                  Enter Marketplace
                </button>
              </Link>
              <Link href="/register">
                <button className="px-10 py-3.5 text-sm font-medium border border-[#A2AAAD]/30 text-[#A2AAAD] rounded-full hover:border-[#00F5FF]/50 hover:text-[#00F5FF] transition-all duration-300">
                  Become Provider
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-[#A2AAAD]/10">
          <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-[#A2AAAD]/60">
            <span>© 2026 ORIEN</span>
            <div className="flex items-center gap-6">
              <Link href="/docs" className="hover:text-[#00F5FF] transition-colors">Docs</Link>
              <Link href="/github" className="hover:text-[#00F5FF] transition-colors">GitHub</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
