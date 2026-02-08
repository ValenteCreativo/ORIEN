'use client';

import { useState } from 'react';
import { ProviderList } from '@/components/providers/ProviderList';
import { PageWrapper } from '@/components/layout';

export default function MarketplacePage() {
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-[#00F5FF] via-white to-[#00F5FF] bg-clip-text text-transparent">
              Compute Marketplace
            </span>
          </h1>
          <p className="text-[#A2AAAD] max-w-xl mx-auto">
            Rent specialized compute infrastructure from providers. Pay only for effective execution time.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-4 bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[#A2AAAD]">Show:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAvailableOnly(true)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  showAvailableOnly
                    ? 'bg-[#00F5FF] text-[#0A1128]'
                    : 'text-[#A2AAAD] hover:text-[#00F5FF] border border-[#A2AAAD]/20 hover:border-[#00F5FF]/30'
                }`}
              >
                Available Only
              </button>
              <button
                onClick={() => setShowAvailableOnly(false)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  !showAvailableOnly
                    ? 'bg-[#00F5FF] text-[#0A1128]'
                    : 'text-[#A2AAAD] hover:text-[#00F5FF] border border-[#A2AAAD]/20 hover:border-[#00F5FF]/30'
                }`}
              >
                All Providers
              </button>
            </div>
          </div>

          <div className="text-sm text-[#A2AAAD]">
            Sort by: <span className="text-[#00F5FF] font-medium">Price (Low to High)</span>
          </div>
        </div>

        {/* Provider List */}
        <ProviderList availableOnly={showAvailableOnly} />
      </div>
    </PageWrapper>
  );
}
