'use client';

import { useState } from 'react';
import { ProviderList } from '@/components/providers/ProviderList';
import { Button } from '@/components/ui';

export default function MarketplacePage() {
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Compute Marketplace</h1>
        <p className="text-zinc-500">
          Rent specialized compute infrastructure from providers. Pay only for effective execution time.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6 p-4 bg-zinc-900 rounded-lg border border-zinc-800">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Show:</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={showAvailableOnly ? 'primary' : 'ghost'}
              onClick={() => setShowAvailableOnly(true)}
            >
              Available Only
            </Button>
            <Button
              size="sm"
              variant={!showAvailableOnly ? 'primary' : 'ghost'}
              onClick={() => setShowAvailableOnly(false)}
            >
              All Providers
            </Button>
          </div>
        </div>

        <div className="text-sm text-zinc-500">
          Sort by: <span className="text-white font-medium">Price (Low to High)</span>
        </div>
      </div>

      {/* Provider List */}
      <ProviderList availableOnly={showAvailableOnly} />
    </div>
  );
}
