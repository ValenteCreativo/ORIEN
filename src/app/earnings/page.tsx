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
          Track revenue from compute rental
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Earned"
          value={`$${(totalEarnings / 100).toFixed(2)}`}
          icon="💰"
          variant="success"
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

              <div className="mt-6 flex gap-3">
                <Button variant="primary" className="flex-1" disabled={!selectedStrategy}>
                  Deploy Strategy
                </Button>
                <Button variant="ghost" className="flex-1">
                  Learn More
                </Button>
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
                            {new Date(settlement.settledAt).toLocaleString()}
                          </div>
                        </div>
                        <Badge variant="success">Settled</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
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
              <CardTitle>Withdraw</CardTitle>
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
                Instant USDC transfer
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Sessions served</span>
                  <span className="font-semibold">{settlements.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Platform fee</span>
                  <span className="font-semibold text-zinc-400">7%</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-zinc-800">
                  <span className="text-zinc-500">Your share</span>
                  <span className="font-bold text-lg text-green-400">90%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
