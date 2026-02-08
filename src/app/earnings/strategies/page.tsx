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
          <h2 className="text-xl font-semibold text-white mb-6">The Payment Flow</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {[
              { step: '1', label: 'Agent Pays', desc: 'Any token', color: 'from-blue-500' },
              { step: '2', label: 'LI.FI Swaps', desc: 'Auto → USDC', color: 'from-purple-500' },
              { step: '3', label: 'Yellow Batches', desc: 'Off-chain', color: 'from-yellow-500' },
              { step: '4', label: 'Circle Settles', desc: 'On-chain USDC', color: 'from-green-500' },
            ].map((item, i) => (
              <div key={i} className="flex-1 text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br ${item.color} to-[#0A1128] flex items-center justify-center text-white font-bold`}>
                  {item.step}
                </div>
                <div className="font-medium text-white">{item.label}</div>
                <div className="text-sm text-[#A2AAAD]">{item.desc}</div>
                {i < 3 && (
                  <div className="hidden md:block absolute text-[#A2AAAD]/30 text-2xl" style={{right: '-1rem', top: '50%'}}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* LI.FI Section */}
        <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-[#A2AAAD]/10 flex items-center gap-3">
            <span className="text-2xl">🔀</span>
            <h2 className="text-lg font-semibold text-white">LI.FI — Pay With Any Token</h2>
          </div>
          <div className="p-6">
            <p className="text-[#A2AAAD] mb-4">
              Agents don&apos;t need to hold USDC. They can pay with <span className="text-white">ETH, MATIC, ARB, or 100+ other tokens</span>. 
              LI.FI automatically finds the best route and swaps to USDC before the payment reaches the provider.
            </p>
            <div className="bg-[#0A1128] rounded-xl p-4 mb-4">
              <div className="text-sm text-[#A2AAAD] mb-2">Example:</div>
              <div className="flex items-center gap-4 text-sm">
                <div className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg">Agent pays 0.05 ETH</div>
                <span className="text-[#A2AAAD]">→</span>
                <div className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg">LI.FI swaps</div>
                <span className="text-[#A2AAAD]">→</span>
                <div className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg">Provider receives $150 USDC</div>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-[#A2AAAD]">
              <li className="flex items-start gap-2">
                <span className="text-[#00F5FF]">✓</span>
                Cross-chain: Pay from Ethereum, receive on Base
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00F5FF]">✓</span>
                Best rates: Aggregates across 15+ DEXs
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00F5FF]">✓</span>
                No slippage surprises: Quotes locked at session start
              </li>
            </ul>
          </div>
        </div>

        {/* Yellow Section */}
        <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-[#A2AAAD]/10 flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <h2 className="text-lg font-semibold text-white">Yellow — Micropayments, No Gas</h2>
          </div>
          <div className="p-6">
            <p className="text-[#A2AAAD] mb-4">
              During a session, the agent might execute 50 small tasks. Instead of 50 on-chain transactions, 
              Yellow batches them <span className="text-white">off-chain</span>. Only <span className="text-white">one transaction</span> is signed at the end.
            </p>
            <div className="bg-[#0A1128] rounded-xl p-4 mb-4">
              <div className="text-sm text-[#A2AAAD] mb-3">Session with 12 executions:</div>
              <div className="space-y-2 text-xs font-mono">
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
                <div className="text-[#A2AAAD]/40 text-center">... 9 more executions ...</div>
                <div className="pt-2 border-t border-[#A2AAAD]/10 flex justify-between text-[#00F5FF]">
                  <span>Total (1 tx)</span>
                  <span>$4.28</span>
                </div>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-[#A2AAAD]">
              <li className="flex items-start gap-2">
                <span className="text-[#00F5FF]">✓</span>
                Gas savings: 1 tx instead of N txs
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00F5FF]">✓</span>
                Real-time metering: Costs tracked per-millisecond
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00F5FF]">✓</span>
                Dispute protection: All executions logged before settlement
              </li>
            </ul>
          </div>
        </div>

        {/* Circle/Arc Section */}
        <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-[#A2AAAD]/10 flex items-center gap-3">
            <span className="text-2xl">💵</span>
            <h2 className="text-lg font-semibold text-white">Circle + Arc — Instant USDC Settlement</h2>
          </div>
          <div className="p-6">
            <p className="text-[#A2AAAD] mb-4">
              When a session ends, Circle&apos;s infrastructure settles the payment in USDC on Base. 
              Arc handles the <span className="text-white">90/7/3 split</span> automatically—provider gets 90%, 
              platform takes 7%, 3% goes to the reserve.
            </p>
            <div className="bg-[#0A1128] rounded-xl p-4 mb-4">
              <div className="text-sm text-[#A2AAAD] mb-3">Settlement breakdown ($10.00 session):</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#A2AAAD]">Provider (90%)</span>
                  <span className="text-green-400 font-medium">$9.00</span>
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
                <span className="text-[#00F5FF]">✓</span>
                Instant: No waiting for confirmations
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00F5FF]">✓</span>
                Stable: Always USDC, no volatility
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00F5FF]">✓</span>
                Transparent: Every settlement on-chain
              </li>
            </ul>
          </div>
        </div>

        {/* Reinvestment */}
        <div className="bg-gradient-to-r from-[#00F5FF]/10 to-purple-500/10 rounded-xl border border-[#00F5FF]/20 p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl">📈</span>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Auto-Reinvest Your Earnings</h3>
              <p className="text-[#A2AAAD] mb-4">
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
        </div>
      </div>
    </PageWrapper>
  );
}
