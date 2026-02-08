'use client';

import { useEffect, useState } from 'react';
import { PageWrapper } from '@/components/layout';

interface Settlement {
  id: string;
  sessionId: string;
  totalAmount: number;
  providerPayout: number;
  platformFee: number;
  reserveAmount: number;
  txHash?: string;
  settledAt: string;
}

interface ReinvestmentStrategy {
  id: string;
  name: string;
  protocol: string;
  apy: number;
  risk: 'low' | 'medium' | 'high';
  description: string;
  icon: string;
}

const STRATEGIES: ReinvestmentStrategy[] = [
  {
    id: 'aave-usdc',
    name: 'Aave USDC',
    protocol: 'Aave V3',
    apy: 4.2,
    risk: 'low',
    description: 'Stable lending protocol',
    icon: '🏦',
  },
  {
    id: 'compound-usdc',
    name: 'Compound',
    protocol: 'Compound',
    apy: 3.8,
    risk: 'low',
    description: 'Established DeFi protocol',
    icon: '📊',
  },
  {
    id: 'stargate-usdc',
    name: 'Stargate LP',
    protocol: 'Stargate',
    apy: 6.5,
    risk: 'medium',
    description: 'Cross-chain liquidity',
    icon: '🌉',
  },
  {
    id: 'yearn-usdc',
    name: 'Yearn Vault',
    protocol: 'Yearn',
    apy: 5.1,
    risk: 'medium',
    description: 'Auto-optimized yield',
    icon: '🚜',
  },
];

export default function EarningsPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoReinvest, setAutoReinvest] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/payments')
      .then(res => res.json())
      .then(data => {
        setSettlements(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalEarnings = settlements.reduce((sum, s) => sum + s.providerPayout, 0);
  const pendingWithdrawal = totalEarnings;

  const riskColors = {
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#00F5FF]/30 border-t-[#00F5FF] rounded-full animate-spin" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-[#00F5FF] via-white to-[#00F5FF] bg-clip-text text-transparent">
              Provider Earnings
            </span>
          </h1>
          <p className="text-[#A2AAAD]">Track revenue from compute rental and manage reinvestment strategies</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Earned', value: `$${(totalEarnings / 100).toFixed(2)}`, icon: '💰', color: 'text-green-400' },
            { label: 'Available', value: `$${(pendingWithdrawal / 100).toFixed(2)}`, icon: '💵', color: 'text-[#00F5FF]' },
            { label: 'Settlements', value: settlements.length, icon: '✅', color: 'text-white' },
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-[#A2AAAD] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Reinvestment Strategies */}
            <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#A2AAAD]/10 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Reinvestment Strategies</h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#A2AAAD]">Auto-reinvest</span>
                  <button
                    onClick={() => setAutoReinvest(!autoReinvest)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoReinvest ? 'bg-[#00F5FF]' : 'bg-[#A2AAAD]/30'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoReinvest ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-3">
                {STRATEGIES.map(strategy => (
                  <div
                    key={strategy.id}
                    onClick={() => setSelectedStrategy(strategy.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedStrategy === strategy.id
                        ? 'border-[#00F5FF] bg-[#00F5FF]/10'
                        : 'border-[#A2AAAD]/10 hover:border-[#A2AAAD]/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{strategy.icon}</span>
                        <div>
                          <div className="font-semibold text-white">{strategy.name}</div>
                          <div className="text-xs text-[#A2AAAD]">{strategy.protocol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">{strategy.apy}%</div>
                        <div className="text-xs text-[#A2AAAD]">APY</div>
                      </div>
                    </div>

                    <p className="text-sm text-[#A2AAAD] mb-3">{strategy.description}</p>

                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${riskColors[strategy.risk]}`}>
                        {strategy.risk} risk
                      </span>
                      {selectedStrategy === strategy.id && (
                        <span className="text-xs text-[#00F5FF] font-semibold">✓ Selected</span>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 pt-4">
                  <button
                    disabled={!selectedStrategy}
                    className={`flex-1 px-6 py-3 text-sm font-medium rounded-full transition-all ${
                      selectedStrategy
                        ? 'bg-[#00F5FF] text-[#0A1128] hover:shadow-[0_0_20px_rgba(0,245,255,0.3)]'
                        : 'bg-[#A2AAAD]/20 text-[#A2AAAD] cursor-not-allowed'
                    }`}
                  >
                    Deploy Strategy
                  </button>
                  <button className="flex-1 px-6 py-3 text-sm font-medium border border-[#A2AAAD]/30 text-[#A2AAAD] rounded-full hover:border-[#00F5FF]/50 hover:text-[#00F5FF] transition-all">
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* Settlement History */}
            <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#A2AAAD]/10">
                <h2 className="text-xl font-semibold text-white">Settlement History</h2>
              </div>
              <div className="p-6">
                {settlements.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4 opacity-20">💰</div>
                    <div className="text-[#A2AAAD]">No settlements yet</div>
                    <div className="text-sm text-[#A2AAAD]/60 mt-1">
                      Complete sessions to start earning
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {settlements.map(settlement => (
                      <div 
                        key={settlement.id}
                        className="p-4 bg-[#0A1128]/40 rounded-xl border border-[#A2AAAD]/10 hover:border-[#00F5FF]/20 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-mono text-sm text-[#A2AAAD]">{settlement.id.slice(0, 20)}...</div>
                            <div className="text-xs text-[#A2AAAD]/60 mt-1">
                              {new Date(settlement.settledAt).toLocaleString()}
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                            Settled
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-[#A2AAAD]">Total</div>
                            <div className="text-sm font-semibold text-white">${(settlement.totalAmount / 100).toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-[#A2AAAD]">Your Payout (90%)</div>
                            <div className="text-sm font-semibold text-green-400">
                              ${(settlement.providerPayout / 100).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Withdrawal Card */}
            <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#A2AAAD]/10">
                <h2 className="text-lg font-semibold text-white">Withdraw</h2>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-xs text-[#A2AAAD] mb-1">Available</div>
                  <div className="text-4xl font-bold text-green-400">${(pendingWithdrawal / 100).toFixed(2)}</div>
                </div>

                <button className="w-full px-6 py-3 text-sm font-medium bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all mb-3">
                  Withdraw to Wallet
                </button>
                <div className="text-xs text-center text-[#A2AAAD]/60">
                  Instant USDC transfer
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#A2AAAD]/10">
                <h2 className="text-lg font-semibold text-white">Stats</h2>
              </div>
              <div className="p-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#A2AAAD]">Sessions served</span>
                  <span className="font-semibold text-white">{settlements.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A2AAAD]">Platform fee</span>
                  <span className="font-semibold text-[#A2AAAD]">7%</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#A2AAAD]/10">
                  <span className="text-[#A2AAAD]">Your share</span>
                  <span className="font-bold text-lg text-[#00F5FF]">90%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
