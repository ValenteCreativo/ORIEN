'use client';

import { useEffect, useState } from 'react';

interface Provider {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy';
  pricePerMinute: number;
  tools: { id: string; name: string; description: string }[];
  reputation: {
    uptime: number;
    completedSessions: number;
    disputes: number;
  };
}

export default function MarketplacePage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/providers')
      .then(res => res.json())
      .then(data => {
        setProviders(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center text-zinc-500">Loading providers...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm">
          Filter
        </button>
      </div>

      {providers.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-lg mb-4">No providers available</p>
          <p className="text-sm">Check back soon or register as a provider.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {providers.map(provider => (
            <div 
              key={provider.id}
              className="p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">{provider.name}</h2>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      provider.status === 'online' 
                        ? 'bg-green-500/20 text-green-400'
                        : provider.status === 'busy'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-zinc-500/20 text-zinc-400'
                    }`}>
                      {provider.status}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-sm mt-1">ID: {provider.id}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">
                    ${(provider.pricePerMinute / 100).toFixed(2)}
                  </div>
                  <div className="text-xs text-zinc-500">per minute</div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-zinc-400 mb-2">Available Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {provider.tools.map(tool => (
                    <span 
                      key={tool.id}
                      className="px-3 py-1 bg-zinc-800 rounded-lg text-sm"
                      title={tool.description}
                    >
                      {tool.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <div className="flex gap-6 text-sm text-zinc-500">
                  <span>⬆️ {provider.reputation.uptime}% uptime</span>
                  <span>✅ {provider.reputation.completedSessions} sessions</span>
                  <span>⚠️ {provider.reputation.disputes} disputes</span>
                </div>
                <button 
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    provider.status === 'online'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-zinc-700 cursor-not-allowed'
                  }`}
                  disabled={provider.status !== 'online'}
                >
                  {provider.status === 'online' ? 'Start Session' : 'Unavailable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
