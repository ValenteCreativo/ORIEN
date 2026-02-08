'use client';

import Link from 'next/link';
import { PageWrapper } from '@/components/layout';

export default function StrategiesPage() {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link href="/earnings" className="text-sm text-[#A2AAAD] hover:text-[#00F5FF] transition-colors mb-4 inline-block">
            ← Back to Earnings
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            How Payments Work
          </h1>
          <p className="text-[#A2AAAD] text-lg">
            ORIEN uses best-in-class infrastructure to make payments seamless for agents and providers.
          </p>
        </div>

        {/* Payment Flow Overview */}
        <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#00F5FF]/20 p-8 mb-8">
          <h2 className="text-lg font-semibold text-white mb-6">The Payment Flow</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { step: '01', label: 'Agent Pays', desc: 'Any token' },
              { step: '02', label: 'LI.FI Swaps', desc: 'Auto → USDC' },
              { step: '03', label: 'Yellow Batches', desc: 'Off-chain' },
              { step: '04', label: 'Circle Settles', desc: 'On-chain USDC' },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="text-[10px] text-[#00F5FF]/60 font-mono mb-2">{item.step}</div>
                <div className="text-sm font-medium text-white mb-1">{item.label}</div>
                <div className="text-xs text-[#A2AAAD]">{item.desc}</div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 text-[#A2AAAD]/30">→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* LI.FI Section */}
        <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-[#A2AAAD]/10">
            <h2 className="text-lg font-semibold text-white">LI.FI — Pay With Any Token</h2>
          </div>
          <div className="p-6">
            <p className="text-[#A2AAAD] mb-4">
              Agents don&apos;t need to hold USDC. They can pay with <span className="text-white">ETH, MATIC, ARB, or 100+ other tokens</span>. 
              LI.FI automatically finds the best route and swaps to USDC before the payment reaches the provider.
            </p>
            <div className="bg-[#0A1128] rounded-xl p-4 mb-4 border border-[#A2AAAD]/10">
              <div className="text-xs text-[#A2AAAD]/60 mb-3 uppercase tracking-wider">Example</div>
              <div className="flex items-center gap-3 text-sm">
                <span className="px-3 py-1.5 bg-[#A2AAAD]/10 text-[#A2AAAD] rounded-lg font-mono">0.05 ETH</span>
                <span className="text-[#00F5FF]">→</span>
                <span className="text-[#A2AAAD]">LI.FI</span>
                <span className="text-[#00F5FF]">→</span>
                <span className="px-3 py-1.5 bg-[#00F5FF]/10 text-[#00F5FF] rounded-lg font-mono">$150 USDC</span>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-[#A2AAAD]">
              <li className="flex items-start gap-2">
                <span className="text-[#00F5FF] mt-0.5">✓</span>
                <span><span className="text-white">Cross-chain:</span> Pay from Ethereum, receive on Base</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00F5FF] mt-0.5">✓</span>
                <span><span className="text-white">Best rates:</span> Aggregates across 15+ DEXs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00F5FF] mt-0.5">✓</span>
                <span><span className="text-white">No surprises:</span> Quotes locked at session start</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Yellow Section */}
        <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-[#A2AAAD]/10">
            <h2 className="text-lg font-semibold text-white">Yellow — Micropayments Without Gas</h2>
          </div>
          <div className="p-6">
            <p className="text-[#A2AAAD] mb-4">
              During a session, the agent might execute 50 small tasks. Instead of 50 on-chain transactions, 
              Yellow batches them <span className="text-white">off-chain</span>. Only <span className="text-white">one transaction</span> is signed at the end.
            </p>
            <div className="bg-[#0A1128] rounded-xl p-4 mb-4 border border-[#A2AAAD]/10">
              <div className="text-xs text-[#A2AAAD]/60 mb-3 uppercase tracking-wider">Session with 12 executions</div>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-[#A2AAAD]/60">
                  <span>exec_001: render_frame</span>
                  <span>$0.12</span>
                </div>
                <div className="flex justify-between text-[#A2AAAD]/60">
                  <span>exec_002: apply_filter</span>
                  <span>$0.08</span>
                </div>
                <div className="flex justify-between text-[#A2AAAD]/60">
                  <span>exec_003: export_video</span>
                  <span>$0.45</span>
                </div>
                <div className="text-center text-[#A2AAAD]/30 py-1">⋮</div>
                <div className="pt-2 border-t border-[#A2AAAD]/10 flex justify-between">
                  <span className="text-[#A2AAAD]">Total (1 tx)</span>
                  <span className="text-[#00F5FF]">$4.28</span>
                </div>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-[#A2AAAD]">
              <li className="flex items-start gap-2">
                <span className="text-[#00F5FF] mt-0.5">✓</span>
                <span><span className="text-white">Gas savings:</span> 1 tx instead of N txs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00F5FF] mt-0.5">✓</span>
                <span><span className="text-white">Real-time:</span> Costs tracked per-millisecond</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00F5FF] mt-0.5">✓</span>
                <span><span className="text-white">Protected:</span> All executions logged before settlement</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Circle/Arc Section */}
        <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-[#A2AAAD]/10">
            <h2 className="text-lg font-semibold text-white">Circle + Arc — Instant USDC Settlement</h2>
          </div>
          <div className="p-6">
            <p className="text-[#A2AAAD] mb-4">
              When a session ends, Circle&apos;s infrastructure settles the payment in USDC on Base. 
              Arc handles the <span className="text-white">90/7/3 split</span> automatically—provider gets 90%, 
              platform takes 7%, 3% goes to the reserve.
            </p>
            <div className="bg-[#0A1128] rounded-xl p-4 mb-4 border border-[#A2AAAD]/10">
              <div className="text-xs text-[#A2AAAD]/60 mb-3 uppercase tracking-wider">Settlement: $10.00 session</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#A2AAAD]">Provider (90%)</span>
                  <span className="text-[#00F5FF] font-medium">$9.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A2AAAD]/60">Platform (7%)</span>
                  <span className="text-[#A2AAAD]">$0.70</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A2AAAD]/40">Reserve (3%)</span>
                  <span className="text-[#A2AAAD]/60">$0.30</span>
                </div>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-[#A2AAAD]">
              <li className="flex items-start gap-2">
                <span className="text-[#00F5FF] mt-0.5">✓</span>
                <span><span className="text-white">Instant:</span> No waiting for confirmations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00F5FF] mt-0.5">✓</span>
                <span><span className="text-white">Stable:</span> Always USDC, no volatility</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00F5FF] mt-0.5">✓</span>
                <span><span className="text-white">Transparent:</span> Every settlement on-chain</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Reinvestment CTA */}
        <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#00F5FF]/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Auto-Reinvest Your Earnings</h3>
          <p className="text-[#A2AAAD] mb-4 text-sm">
            Don&apos;t let your USDC sit idle. Enable auto-reinvest to deploy earnings to 
            Aave, Compound, or Yearn—earning 3-6% APY while you wait for withdrawals.
          </p>
          <Link href="/earnings">
            <button className="px-5 py-2 text-sm font-medium bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all">
              Configure Auto-Reinvest →
            </button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
