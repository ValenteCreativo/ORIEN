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
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray/30 border-t-cyan"></div>
        <p className="mt-4 text-gray">Loading providers...</p>
      </div>
    );
  }

  if (error && !demoMode) {
    return (
      <div className="text-center py-16">
        <div className="text-red-400 mb-2">⚠️ Error loading providers</div>
        <p className="text-sm text-gray">{error}</p>
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="text-center py-16 text-gray">
        <p className="text-lg mb-4">No providers available</p>
        <p className="text-sm">
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
        <div className="text-center py-4 text-cyan text-sm border-t border-cyan/20">
          ● Demo Mode Active - Showing {providers.length} simulated providers
        </div>
      )}
    </div>
  );
}
