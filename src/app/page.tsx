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

        {/* Hero - The Hook */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="relative max-w-4xl mx-auto text-center">
            
            {/* Subtle glow */}
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
            
            {/* One-liner */}
            <p className="text-[#A2AAAD] text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Connect AI agents to specialized hardware. 
              Pay only for the seconds they actually work.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
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

            {/* Scroll indicator */}
            <div className="animate-bounce text-[#A2AAAD]/40 text-2xl">↓</div>
          </div>
        </section>

        {/* How It Works - Minimal */}
        <section className="py-24 px-6 border-t border-[#A2AAAD]/10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                How it works
              </h2>
              <p className="text-[#A2AAAD] max-w-lg mx-auto">
                API call → execute on real hardware → pay in USDC. That&apos;s it.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { 
                  num: '01', 
                  title: 'Request', 
                  desc: 'Your agent needs a GPU, creative software, or specialized hardware.',
                  icon: '🤖' 
                },
                { 
                  num: '02', 
                  title: 'Execute', 
                  desc: 'Task runs on provider hardware. We meter only active execution time.',
                  icon: '⚡' 
                },
                { 
                  num: '03', 
                  title: 'Settle', 
                  desc: 'Instant USDC payment. 90% goes to the hardware provider.',
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

        {/* Two Audiences - Side by Side */}
        <section className="py-24 px-6 border-t border-[#A2AAAD]/10">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* For Agents */}
              <div className="p-8 bg-[#0A1128]/60 backdrop-blur-sm border border-[#A2AAAD]/10 rounded-2xl hover:border-[#00F5FF]/20 transition-all">
                <div className="text-[#00F5FF] text-sm uppercase tracking-widest mb-4">For Agent Builders</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Give your agent superpowers
                </h3>
                <p className="text-[#A2AAAD] mb-6 leading-relaxed">
                  Access A100 GPUs, Mac Studios, and professional software stacks—without managing infrastructure.
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {['Creative', 'AI/ML', 'DevOps', 'Media'].map((cat) => (
                    <div key={cat} className="px-3 py-2 bg-[#00F5FF]/5 border border-[#00F5FF]/10 rounded-lg text-sm text-[#A2AAAD] text-center">
                      {cat}
                    </div>
                  ))}
                </div>

                <Link href="/marketplace">
                  <button className="w-full py-3 text-sm font-semibold bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all">
                    Explore Marketplace →
                  </button>
                </Link>
              </div>

              {/* For Providers */}
              <div className="p-8 bg-[#0A1128]/60 backdrop-blur-sm border border-[#A2AAAD]/10 rounded-2xl hover:border-[#00F5FF]/20 transition-all">
                <div className="text-[#00F5FF] text-sm uppercase tracking-widest mb-4">For Hardware Owners</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Turn idle hardware into income
                </h3>
                <p className="text-[#A2AAAD] mb-6 leading-relaxed">
                  That GPU sitting idle? Connect it to ORIEN. AI agents will pay you to use it.
                </p>
                
                {/* The one 90% that matters */}
                <div className="p-4 bg-[#00F5FF]/5 border border-[#00F5FF]/20 rounded-xl mb-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[#A2AAAD] text-sm">Your share</span>
                    <span className="text-[#00F5FF] text-3xl font-bold">90%</span>
                  </div>
                  <div className="mt-2 h-2 bg-[#A2AAAD]/10 rounded-full overflow-hidden">
                    <div className="h-full w-[90%] bg-gradient-to-r from-[#00F5FF] to-[#00F5FF]/60 rounded-full" />
                  </div>
                  <p className="text-xs text-[#A2AAAD]/60 mt-2">Instant USDC • Auto-compound available</p>
                </div>

                <Link href="/register">
                  <button className="w-full py-3 text-sm font-semibold bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all">
                    Start Earning →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Signals - Compact */}
        <section className="py-16 px-6 border-t border-[#A2AAAD]/10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { icon: '🔒', label: 'Sandboxed execution' },
                { icon: '⏱️', label: 'Effective time billing' },
                { icon: '💎', label: 'USDC settlement' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs text-[#A2AAAD] uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - Clean */}
        <section className="py-24 px-6 border-t border-[#A2AAAD]/10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The infrastructure for agentic work.
            </h2>
            <p className="text-[#A2AAAD] mb-8">
              Build agents that can do more. Or earn from hardware you already own.
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

        {/* Footer - Minimal */}
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
