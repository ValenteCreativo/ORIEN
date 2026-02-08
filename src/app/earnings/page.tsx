'use client';

import { useEffect, useState } from 'react';

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

export default function EarningsPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/payments')
      .then(res => res.json())
      .then(data => {
        setSettlements(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatCost = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const totalEarnings = settlements.reduce((sum, s) => sum + s.providerPayout, 0);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center text-zinc-500">Loading earnings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Earnings</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="text-sm text-zinc-500 mb-2">Total Earned</div>
          <div className="text-3xl font-bold text-green-400">{formatCost(totalEarnings)}</div>
          <div className="text-xs text-zinc-600 mt-1">USDC</div>
        </div>
        <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="text-sm text-zinc-500 mb-2">Settlements</div>
          <div className="text-3xl font-bold">{settlements.length}</div>
          <div className="text-xs text-zinc-600 mt-1">completed</div>
        </div>
        <div className="p-6 bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="text-sm text-zinc-500 mb-2">Pending Withdrawal</div>
          <div className="text-3xl font-bold text-yellow-400">$0.00</div>
          <div className="text-xs text-zinc-600 mt-1">available now</div>
        </div>
      </div>

      {/* Reinvestment CTA */}
      <div className="p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl border border-purple-800/50 mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Reinvest Your Earnings</h3>
            <p className="text-zinc-400 text-sm">
              Put your USDC to work with DeFi strategies via LI.FI integration.
            </p>
          </div>
          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
            Explore Strategies
          </button>
        </div>
      </div>

      {/* Settlements Table */}
      <h2 className="text-xl font-semibold mb-4">Settlement History</h2>
      
      {settlements.length === 0 ? (
        <div className="text-center py-16 text-zinc-500 bg-zinc-900 rounded-xl border border-zinc-800">
          <p className="text-lg mb-4">No settlements yet</p>
          <p className="text-sm">Complete sessions to see your earnings here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-zinc-500 border-b border-zinc-800">
                <th className="pb-4 font-medium">Settlement ID</th>
                <th className="pb-4 font-medium">Session</th>
                <th className="pb-4 font-medium">Total</th>
                <th className="pb-4 font-medium">Your Payout</th>
                <th className="pb-4 font-medium">Platform Fee</th>
                <th className="pb-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map(settlement => (
                <tr key={settlement.id} className="border-b border-zinc-800/50">
                  <td className="py-4 font-mono text-sm">{settlement.id.slice(0, 15)}...</td>
                  <td className="py-4 font-mono text-sm text-zinc-500">{settlement.sessionId.slice(0, 15)}...</td>
                  <td className="py-4 font-mono">{formatCost(settlement.totalAmount)}</td>
                  <td className="py-4 font-mono text-green-400">{formatCost(settlement.providerPayout)}</td>
                  <td className="py-4 font-mono text-zinc-500">{formatCost(settlement.platformFee)}</td>
                  <td className="py-4 text-sm text-zinc-500">
                    {new Date(settlement.settledAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
