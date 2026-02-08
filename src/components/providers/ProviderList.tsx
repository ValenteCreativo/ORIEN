'use client';

import { useEffect, useState } from 'react';
import { Provider, ApiResponse } from '@/types';
import { ProviderCard } from './ProviderCard';
import { useDemo } from '@/components/ui';
import { DEMO_PROVIDERS } from '@/lib/demo-data';

interface ProviderListProps {
  availableOnly?: boolean;
}

export function ProviderList({ availableOnly = false }: ProviderListProps) {
  const { demoMode } = useDemo();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use demo data if demo mode is active
    if (demoMode) {
      const demoData = availableOnly 
        ? DEMO_PROVIDERS.filter(p => p.status === 'online')
        : DEMO_PROVIDERS;
      setProviders(demoData as any);
      setLoading(false);
      return;
    }

    // Real API call
    const params = availableOnly ? '?available=true' : '';
    
    fetch(`/api/providers${params}`)
      .then(res => res.json())
      .then((data: ApiResponse<Provider[]>) => {
        if (data.success && data.data) {
          setProviders(data.data);
        } else {
          setError(data.error || 'Failed to load providers');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [availableOnly, demoMode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#00F5FF]/30 border-t-[#00F5FF] rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !demoMode) {
    return (
      <div className="text-center py-16 bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-red-500/20">
        <div className="text-red-400 mb-2">⚠️ Error loading providers</div>
        <p className="text-sm text-[#A2AAAD]">{error}</p>
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="text-center py-16 bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10">
        <div className="text-4xl mb-4 opacity-40">◎</div>
        <p className="text-lg text-white mb-2">No providers available</p>
        <p className="text-sm text-[#A2AAAD]">
          {availableOnly 
            ? 'All providers are currently offline or busy. Check back soon.'
            : demoMode 
            ? 'Demo data not loaded.'
            : 'No providers have registered yet.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {providers.map(provider => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
      
      {demoMode && (
        <div className="text-center py-4 text-[#00F5FF] text-sm border-t border-[#00F5FF]/20">
          ● Demo Mode Active — Showing {providers.length} simulated providers
        </div>
      )}
    </div>
  );
}
