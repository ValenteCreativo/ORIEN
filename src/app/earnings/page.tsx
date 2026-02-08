'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  PriceDisplay,
  StatCard,
  Badge 
} from '@/components/ui';

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
    name: 'Aave USDC Lending',
    protocol: 'Aave V3',
    apy: 4.2,
    risk: 'low',
    description: 'Supply USDC to Aave for stable, low-risk yield',
    icon: '🏦',
  },
  {
    id: 'compound-usdc',
    name: 'Compound USDC',
    protocol: 'Compound',
    apy: 3.8,
    risk: 'low',
    description: 'Lend USDC on Compound protocol',
    icon: '📊',
  },
  {
    id: 'stargate-usdc',
    name: 'Stargate USDC LP',
    protocol: 'Stargate',
    apy: 6.5,
    risk: 'medium',
    description: 'Provide liquidity for cross-chain USDC transfers',
    icon: '🌉',
  },
  {
    id: 'yearn-usdc',
    name: 'Yearn USDC Vault',
    protocol: 'Yearn',
    apy: 5.1,
    risk: 'medium',
    description: 'Automated yield farming strategies',
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
  const pendingWithdrawal = totalEarnings; // Simplified - in real app track withdrawals
  
  // Calculate projected earnings
  const avgSessionValue = settlements.length > 0 
    ? totalEarnings / settlements.length 
    : 500; // $5 average
  const projectedMonthlyEarnings = avgSessionValue * 30; // Assume 1 session/day
  const selectedStrategyAPY = selectedStrategy 
    ? STRATEGIES.find(s => s.id === selectedStrategy)?.apy || 0
    : 0;
  const yearlyCompound = pendingWithdrawal * (1 + selectedStrategyAPY / 100) - pendingWithdrawal;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-zinc-700 border-t-blue-500 mb-4"></div>
          <p className="text-zinc-500">Loading earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Provider Earnings</h1>
        <p className="text-zinc-500">
          Track your compute revenue and reinvest earnings into DeFi strategies for compound returns
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Earned"
          value={`$${(totalEarnings / 100).toFixed(2)}`}
          icon="💰"
          variant="success"
          trend="up"
          trendValue="+12% this week"
        />
        <StatCard
          label="Available"
          value={`$${(pendingWithdrawal / 100).toFixed(2)}`}
          icon="💵"
          variant="info"
        />
        <StatCard
          label="Settlements"
          value={settlements.length}
          icon="✅"
          variant="default"
        />
        <StatCard
          label="Projected (30d)"
          value={`$${(projectedMonthlyEarnings / 100).toFixed(2)}`}
          icon="📈"
          variant="warning"
        />
      </div>

      {/* Economic Opportunity Banner */}
      <div className="mb-8 p-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-500/30 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 animate-pulse" />
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-2">
                Economic Derivative
              </div>
              <h2 className="text-3xl font-bold mb-2">The Circular Economy</h2>
              <p className="text-zinc-300 max-w-2xl">
                You're not just renting compute — you're earning from AI agent activity. 
                Reinvest earnings into DeFi for compound returns. Early providers capture more network value.
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-green-400">↗</div>
              <div className="text-xs text-zinc-500 mt-1">Network Effects</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="text-center p-4 bg-zinc-900/50 rounded-lg border border-zinc-700">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-sm text-zinc-400">Agents execute</div>
              <div className="text-lg font-bold text-blue-400">→ You earn</div>
            </div>
            <div className="text-center p-4 bg-zinc-900/50 rounded-lg border border-zinc-700">
              <div className="text-3xl mb-2">💎</div>
              <div className="text-sm text-zinc-400">Reinvest in DeFi</div>
              <div className="text-lg font-bold text-purple-400">→ Compound</div>
            </div>
            <div className="text-center p-4 bg-zinc-900/50 rounded-lg border border-zinc-700">
              <div className="text-3xl mb-2">🚀</div>
              <div className="text-sm text-zinc-400">Network grows</div>
              <div className="text-lg font-bold text-green-400">→ More value</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Reinvestment Strategies */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reinvestment Strategies</CardTitle>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-zinc-500">Auto-reinvest</span>
                  <button
                    onClick={() => setAutoReinvest(!autoReinvest)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoReinvest ? 'bg-green-600' : 'bg-zinc-700'
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
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {STRATEGIES.map(strategy => (
                  <div
                    key={strategy.id}
                    onClick={() => setSelectedStrategy(strategy.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedStrategy === strategy.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{strategy.icon}</span>
                        <div>
                          <div className="font-semibold">{strategy.name}</div>
                          <div className="text-xs text-zinc-500">{strategy.protocol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">{strategy.apy}%</div>
                        <div className="text-xs text-zinc-500">APY</div>
                      </div>
                    </div>

                    <p className="text-sm text-zinc-400 mb-3">{strategy.description}</p>

                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={
                          strategy.risk === 'low' ? 'success' :
                          strategy.risk === 'medium' ? 'warning' :
                          'danger'
                        }
                      >
                        {strategy.risk} risk
                      </Badge>
                      {selectedStrategy === strategy.id && (
                        <span className="text-xs text-purple-400 font-semibold">✓ Selected</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selectedStrategy && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-400 text-lg">💡</span>
                    <span className="font-semibold text-green-400">Projected Returns</span>
                  </div>
                  <div className="text-sm text-zinc-300">
                    With <span className="font-semibold">${(pendingWithdrawal / 100).toFixed(2)}</span> at{' '}
                    <span className="font-semibold">{selectedStrategyAPY}% APY</span>:
                  </div>
                  <div className="text-2xl font-bold text-green-400 mt-2">
                    +${(yearlyCompound / 100).toFixed(2)} / year
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    Compound interest on your compute earnings
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <Button variant="primary" className="flex-1" disabled={!selectedStrategy}>
                  Deploy Strategy
                </Button>
                <Link href="/reinvest" className="flex-1">
                  <Button variant="ghost" className="w-full">
                    Advanced Strategies →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Settlement History */}
          <Card>
            <CardHeader>
              <CardTitle>Settlement History</CardTitle>
            </CardHeader>
            <CardContent>
              {settlements.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4 opacity-20">💰</div>
                  <div className="text-zinc-500">No settlements yet</div>
                  <div className="text-sm text-zinc-600 mt-1">
                    Complete sessions to start earning
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {settlements.map(settlement => (
                    <div 
                      key={settlement.id}
                      className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-mono text-sm text-zinc-500">{settlement.id.slice(0, 20)}...</div>
                          <div className="text-xs text-zinc-600 mt-1">
                            Session: {settlement.sessionId.slice(0, 15)}...
                          </div>
                        </div>
                        <Badge variant="success">Settled</Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs text-zinc-500">Total</div>
                          <div className="text-sm font-semibold">${(settlement.totalAmount / 100).toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-zinc-500">Your Payout (90%)</div>
                          <div className="text-sm font-semibold text-green-400">
                            ${(settlement.providerPayout / 100).toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-zinc-500">Date</div>
                          <div className="text-sm">{new Date(settlement.settledAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Withdrawal Card */}
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceDisplay
                amountCents={pendingWithdrawal}
                label="Available"
                size="lg"
                variant="success"
                className="mb-6"
              />

              <Button variant="primary" className="w-full mb-3">
                Withdraw to Wallet
              </Button>
              <div className="text-xs text-center text-zinc-600">
                Instant USDC transfer to your wallet
              </div>
            </CardContent>
          </Card>

          {/* Early Provider Advantage */}
          <Card className="border-2 border-yellow-500/30 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="text-yellow-400">Early Provider Advantage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-semibold mb-1">Network Effects</div>
                  <div className="text-zinc-400">
                    More agents → higher demand → premium pricing
                  </div>
                </div>

                <div>
                  <div className="font-semibold mb-1">Reputation Building</div>
                  <div className="text-zinc-400">
                    High uptime now = trust advantage later
                  </div>
                </div>

                <div>
                  <div className="font-semibold mb-1">Compound Returns</div>
                  <div className="text-zinc-400">
                    Reinvest early → maximize time in DeFi
                  </div>
                </div>

                <div className="pt-4 border-t border-yellow-500/20">
                  <div className="text-yellow-400 font-bold text-lg mb-1">
                    Up to 3x advantage
                  </div>
                  <div className="text-xs text-zinc-500">
                    vs providers joining 6 months later
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Sessions served</span>
                  <span className="font-semibold">{settlements.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Avg. payout</span>
                  <span className="font-semibold text-green-400">
                    ${(avgSessionValue / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Platform fee paid</span>
                  <span className="font-semibold">
                    ${((totalEarnings * 0.07) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-zinc-800">
                  <span className="text-zinc-500">Your share</span>
                  <span className="font-bold text-lg">90%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
