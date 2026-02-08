'use client';

import { useEffect, useState } from 'react';
import { Provider, ApiResponse } from '@/types';
import { ProviderCard } from './ProviderCard';

interface ProviderListProps {
  availableOnly?: boolean;
}

export function ProviderList({ availableOnly = false }: ProviderListProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, [availableOnly]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-zinc-700 border-t-blue-500"></div>
        <p className="mt-4 text-zinc-500">Loading providers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-400 mb-2">⚠️ Error loading providers</div>
        <p className="text-sm text-zinc-500">{error}</p>
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-500">
        <p className="text-lg mb-4">No providers available</p>
        <p className="text-sm">
          {availableOnly 
            ? 'All providers are currently offline or busy. Check back soon.'
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
    </div>
  );
}
