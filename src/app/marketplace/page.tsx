'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { useDemo } from '@/components/ui';
import { DEMO_PROVIDERS, CATEGORY_INFO, type ProviderCategory, type DemoProvider } from '@/lib/demo-data';
import { Provider } from '@/types';

type CategoryFilter = 'all' | ProviderCategory;

export default function MarketplacePage() {
  const { demoMode, toggleDemo } = useDemo();
  const [providers, setProviders] = useState<(Provider | DemoProvider)[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  useEffect(() => {
    if (demoMode) {
      // Use demo data
      let filtered = DEMO_PROVIDERS as DemoProvider[];
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(p => p.category === categoryFilter);
      }
      if (showAvailableOnly) {
        filtered = filtered.filter(p => p.status === 'online');
      }
      setProviders(filtered);
      setLoading(false);
    } else {
      // Fetch from API
      const params = showAvailableOnly ? '?available=true' : '';
      fetch(`/api/providers${params}`)
        .then(res => res.json())
        .then(data => {
          setProviders(data.data || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [demoMode, categoryFilter, showAvailableOnly]);

  const categories: { key: CategoryFilter; label: string; icon?: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'creative', label: 'Creative', icon: '🎨' },
    { key: 'ai-ml', label: 'AI/ML', icon: '🧠' },
    { key: 'devops', label: 'DevOps', icon: '🚀' },
    { key: 'media', label: 'Media', icon: '🎬' },
    { key: 'research', label: 'Research', icon: '🔬' },
  ];

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Compute Marketplace
              </h1>
              <p className="text-[#A2AAAD]">
                Find specialized hardware for your agents
              </p>
            </div>

            {/* Demo Toggle - Prominent */}
            <button
              onClick={toggleDemo}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                demoMode
                  ? 'bg-[#00F5FF] text-[#0A1128] shadow-[0_0_25px_rgba(0,245,255,0.5)]'
                  : 'bg-[#0A1128] text-[#A2AAAD] border border-[#A2AAAD]/30 hover:border-[#00F5FF]/50 hover:text-[#00F5FF]'
              }`}
            >
              {demoMode ? '● Demo Active' : 'Try Demo Mode'}
            </button>
          </div>

          {/* Demo Mode Banner */}
          {demoMode && (
            <div className="p-4 bg-[#00F5FF]/10 border border-[#00F5FF]/30 rounded-xl mb-6">
              <div className="flex items-start gap-3">
                <span className="text-xl">🎭</span>
                <div>
                  <div className="font-medium text-[#00F5FF]">Demo Mode Active</div>
                  <p className="text-sm text-[#A2AAAD] mt-1">
                    Showing sample providers. Click any provider to see the full session flow.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setCategoryFilter(cat.key)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  categoryFilter === cat.key
                    ? 'bg-[#00F5FF] text-[#0A1128]'
                    : 'text-[#A2AAAD] border border-[#A2AAAD]/20 hover:border-[#00F5FF]/30 hover:text-[#00F5FF]'
                }`}
              >
                {cat.icon && <span className="mr-1.5">{cat.icon}</span>}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Available Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAvailableOnly(!showAvailableOnly)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                showAvailableOnly ? 'bg-[#00F5FF]' : 'bg-[#A2AAAD]/30'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  showAvailableOnly ? 'left-6' : 'left-1'
                }`}
              />
            </button>
            <span className="text-sm text-[#A2AAAD]">Available only</span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#00F5FF]/30 border-t-[#00F5FF] rounded-full animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && providers.length === 0 && (
          <div className="text-center py-20 bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10">
            <div className="text-5xl mb-4 opacity-40">◎</div>
            <p className="text-lg text-white mb-2">No providers found</p>
            <p className="text-sm text-[#A2AAAD] mb-6">
              {demoMode 
                ? 'Try selecting a different category'
                : 'Enable Demo Mode to see sample providers'}
            </p>
            {!demoMode && (
              <button
                onClick={toggleDemo}
                className="px-6 py-2.5 text-sm font-medium bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all"
              >
                Enable Demo Mode
              </button>
            )}
          </div>
        )}

        {/* Provider Grid */}
        {!loading && providers.length > 0 && (
          <div className="grid gap-6">
            {providers.map(provider => {
              const isDemoProvider = 'category' in provider;
              const category = isDemoProvider ? (provider as DemoProvider).category : null;
              const categoryInfo = category ? CATEGORY_INFO[category] : null;
              const isAvailable = provider.status === 'online';

              return (
                <div
                  key={provider.id}
                  className={`relative bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border overflow-hidden transition-all ${
                    isAvailable
                      ? 'border-[#A2AAAD]/10 hover:border-[#00F5FF]/30 hover:shadow-[0_0_30px_rgba(0,245,255,0.1)]'
                      : 'border-[#A2AAAD]/10 opacity-60'
                  }`}
                >
                  {/* Status glow */}
                  {isAvailable && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF]/5 to-transparent pointer-events-none" />
                  )}

                  <div className="relative p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          {categoryInfo && (
                            <span className="text-lg">{categoryInfo.icon}</span>
                          )}
                          <h3 className="text-xl font-bold text-white">{provider.name}</h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              isAvailable
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : provider.status === 'busy'
                                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                : 'bg-[#A2AAAD]/20 text-[#A2AAAD] border-[#A2AAAD]/30'
                            }`}
                          >
                            {isAvailable ? '● Online' : provider.status === 'busy' ? '◐ Busy' : '○ Offline'}
                          </span>
                        </div>
                        {isDemoProvider && (
                          <p className="text-sm text-[#A2AAAD]/80 italic">
                            {(provider as DemoProvider).tagline}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#00F5FF]">
                          ${(provider.pricePerMinute / 100).toFixed(2)}
                        </div>
                        <div className="text-xs text-[#A2AAAD]">per minute</div>
                      </div>
                    </div>

                    {/* Hardware & Location */}
                    {isDemoProvider && (
                      <div className="flex items-center gap-4 mb-4 text-sm text-[#A2AAAD]">
                        <span>🖥️ {(provider as DemoProvider).hardware}</span>
                        <span>📍 {(provider as DemoProvider).location}</span>
                      </div>
                    )}

                    {/* Tools */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {provider.tools.slice(0, 4).map(tool => (
                          <span
                            key={tool.id}
                            className="px-3 py-1.5 text-xs bg-[#0A1128]/60 border border-[#A2AAAD]/10 rounded-lg text-[#A2AAAD]"
                          >
                            {tool.name}
                          </span>
                        ))}
                        {provider.tools.length > 4 && (
                          <span className="px-3 py-1.5 text-xs text-[#A2AAAD]/60">
                            +{provider.tools.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats & Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#A2AAAD]/10">
                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <span className="text-[#A2AAAD]">Uptime</span>
                          <span className="ml-2 text-green-400 font-medium">
                            {provider.reputation.uptime}%
                          </span>
                        </div>
                        <div>
                          <span className="text-[#A2AAAD]">Sessions</span>
                          <span className="ml-2 text-white font-medium">
                            {provider.reputation.completedSessions.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {isAvailable ? (
                        <Link href={`/sessions/new?provider=${provider.id}`}>
                          <button className="px-5 py-2 text-sm font-medium bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all">
                            Start Session →
                          </button>
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="px-5 py-2 text-sm font-medium bg-[#A2AAAD]/10 text-[#A2AAAD] rounded-full cursor-not-allowed"
                        >
                          {provider.status === 'busy' ? 'Currently Busy' : 'Offline'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Demo Footer */}
        {demoMode && providers.length > 0 && (
          <div className="mt-8 text-center text-sm text-[#00F5FF]/60">
            Showing {providers.length} demo providers
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
