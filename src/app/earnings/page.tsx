'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { useDemo } from '@/components/ui';
import { DEMO_SETTLEMENTS } from '@/lib/demo-data';

interface Settlement {
  id: string;
  sessionId: string;
  totalAmount: number;
  providerPayout: number;
  platformFee: number;
  reserveAmount: number;
  txHash?: string;
  settledAt: string | Date;
}

interface Strategy {
  id: string;
  name: string;
  protocol: string;
  apy: number;
  risk: 'low' | 'medium' | 'high';
  description: string;
  tvl: string;
}

const STRATEGIES: Strategy[] = [
  {
    id: 'aave-usdc',
    name: 'Aave USDC Lending',
    protocol: 'Aave V3',
    apy: 4.2,
    risk: 'low',
    description: 'Blue-chip lending protocol. Your USDC earns yield from borrowers.',
    tvl: '$2.1B',
  },
  {
    id: 'compound-usdc',
    name: 'Compound Supply',
    protocol: 'Compound V3',
    apy: 3.8,
    risk: 'low',
    description: 'Algorithmic money market. Battle-tested since 2018.',
    tvl: '$1.4B',
  },
  {
    id: 'yearn-usdc',
    name: 'Yearn USDC Vault',
    protocol: 'Yearn Finance',
    apy: 5.1,
    risk: 'medium',
    description: 'Automated yield optimization across multiple protocols.',
    tvl: '$890M',
  },
];

export default function EarningsPage() {
  const { demoMode } = useDemo();
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [autoReinvest, setAutoReinvest] = useState(false);

  useEffect(() => {
    if (demoMode) {
      setSettlements(DEMO_SETTLEMENTS.map(s => ({ ...s, settledAt: s.settledAt.toISOString() })));
      setLoading(false);
    } else {
      fetch('/api/payments')
        .then(res => res.json())
        .then(data => {
          setSettlements(data.data || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [demoMode]);

  const totalEarnings = settlements.reduce((sum, s) => sum + s.providerPayout, 0);
  const totalSessions = settlements.length;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#00F5FF]/30 border-t-[#00F5FF] rounded-full animate-spin" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Earnings</h1>
          <p className="text-[#A2AAAD]">Track your compute revenue and manage reinvestment</p>
        </div>

        {/* Your Hardware - Demo Mode */}
        {demoMode && (
          <div className="bg-gradient-to-r from-[#00F5FF]/10 to-purple-500/10 rounded-xl border border-[#00F5FF]/20 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Your Hardware</h2>
              <span className="text-xs text-green-400">● All Online</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[#0A1128]/60 rounded-xl p-4 border border-[#A2AAAD]/10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">🖥️</span>
                  <div>
                    <div className="font-medium text-white">Mac Studio M2 Ultra</div>
                    <div className="text-xs text-[#A2AAAD]">Neon Canvas Provider</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#A2AAAD]">Rate: $0.45/min</span>
                  <span className="text-green-400">12 sessions today</span>
                </div>
              </div>
              <div className="bg-[#0A1128]/60 rounded-xl p-4 border border-[#A2AAAD]/10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">🎮</span>
                  <div>
                    <div className="font-medium text-white">RTX 4090 × 2</div>
                    <div className="text-xs text-[#A2AAAD]">Pixel Forge Provider</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#A2AAAD]">Rate: $0.85/min</span>
                  <span className="text-green-400">8 sessions today</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {/* Total Earnings */}
          <div className="p-6 bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10">
            <div className="text-sm text-[#A2AAAD] mb-2">Total Earned</div>
            <div className="text-3xl font-bold text-white">
              ${(totalEarnings / 100).toFixed(2)}
            </div>
            <div className="text-xs text-[#A2AAAD]/60 mt-1">USDC</div>
          </div>

          {/* Available to Withdraw */}
          <div className="p-6 bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#00F5FF]/20">
            <div className="text-sm text-[#A2AAAD] mb-2">Available</div>
            <div className="text-3xl font-bold text-[#00F5FF]">
              ${(totalEarnings / 100).toFixed(2)}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button className="px-4 py-1.5 text-xs font-medium bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all">
                Withdraw
              </button>
              <span className="text-xs text-[#A2AAAD]/60">Instant transfer</span>
            </div>
          </div>

          {/* Sessions */}
          <div className="p-6 bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10">
            <div className="text-sm text-[#A2AAAD] mb-2">Sessions Completed</div>
            <div className="text-3xl font-bold text-white">{totalSessions}</div>
            <div className="text-xs text-[#A2AAAD]/60 mt-1">90% payout per session</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Settlements - Main Column */}
          <div className="lg:col-span-3">
            <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#A2AAAD]/10">
                <h2 className="text-lg font-semibold text-white">Settlement History</h2>
              </div>

              {settlements.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-4xl opacity-20 mb-4">💰</div>
                  <p className="text-[#A2AAAD]">No settlements yet</p>
                  <p className="text-sm text-[#A2AAAD]/60 mt-1">
                    Complete sessions to start earning
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#A2AAAD]/5">
                  {settlements.map(settlement => (
                    <div key={settlement.id} className="px-6 py-4 hover:bg-[#00F5FF]/5 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                            <span className="text-green-400 text-sm">✓</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              +${(settlement.providerPayout / 100).toFixed(2)}
                            </div>
                            <div className="text-xs text-[#A2AAAD]/60">
                              {formatDate(settlement.settledAt)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-[#A2AAAD]">
                            Session total: ${(settlement.totalAmount / 100).toFixed(2)}
                          </div>
                          {settlement.txHash && (
                            <a
                              href={`https://basescan.org/tx/${settlement.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-[#00F5FF] hover:underline"
                            >
                              View tx →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reinvestment - Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Auto-Reinvest Toggle */}
            <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-white">Auto-Reinvest</h3>
                  <p className="text-xs text-[#A2AAAD]/60 mt-0.5">
                    Automatically deploy earnings to DeFi
                  </p>
                </div>
                <button
                  onClick={() => setAutoReinvest(!autoReinvest)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    autoReinvest ? 'bg-[#00F5FF]' : 'bg-[#A2AAAD]/30'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      autoReinvest ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {autoReinvest && !selectedStrategy && (
                <p className="text-xs text-yellow-400/80">Select a strategy below</p>
              )}
            </div>

            {/* Strategies */}
            <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#A2AAAD]/10 flex items-center justify-between">
                <h3 className="font-medium text-white">Yield Strategies</h3>
                <Link href="/earnings/strategies" className="text-xs text-[#00F5FF] hover:underline">
                  Learn more →
                </Link>
              </div>

              <div className="p-4 space-y-3">
                {STRATEGIES.map(strategy => (
                  <button
                    key={strategy.id}
                    onClick={() => setSelectedStrategy(strategy.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      selectedStrategy === strategy.id
                        ? 'border-[#00F5FF] bg-[#00F5FF]/5'
                        : 'border-[#A2AAAD]/10 hover:border-[#A2AAAD]/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-white text-sm">{strategy.name}</div>
                        <div className="text-xs text-[#A2AAAD]/60">{strategy.protocol}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-400">{strategy.apy}%</div>
                        <div className="text-[10px] text-[#A2AAAD]/60 uppercase">APY</div>
                      </div>
                    </div>

                    <p className="text-xs text-[#A2AAAD] mb-2">{strategy.description}</p>

                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-0.5 rounded-full ${
                        strategy.risk === 'low' 
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {strategy.risk} risk
                      </span>
                      <span className="text-[#A2AAAD]/60">TVL: {strategy.tvl}</span>
                    </div>
                  </button>
                ))}
              </div>

              {selectedStrategy && (
                <div className="px-4 pb-4">
                  <Link
                    href={`/earnings/deploy?strategy=${selectedStrategy}`}
                    className="block w-full py-2.5 text-sm font-medium bg-[#00F5FF] text-[#0A1128] rounded-full text-center hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all"
                  >
                    Deploy to {STRATEGIES.find(s => s.id === selectedStrategy)?.protocol}
                  </Link>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 bg-[#0A1128]/40 rounded-xl border border-[#A2AAAD]/10 text-xs text-[#A2AAAD]/60">
              <p>
                All yields are variable and depend on market conditions. 
                DeFi strategies involve smart contract risk. 
                Powered by <span className="text-[#A2AAAD]">LI.FI</span>, <span className="text-[#A2AAAD]">Arc</span>, and <span className="text-[#A2AAAD]">Yellow</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
