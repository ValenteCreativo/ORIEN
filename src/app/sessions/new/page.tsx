'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Provider, ApiResponse } from '@/types';
import { PageWrapper } from '@/components/layout';

// Loading component for Suspense fallback
function LoadingState() {
  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 p-8">
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-[#00F5FF]/30 border-t-[#00F5FF] rounded-full animate-spin" />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

// Inner component that uses useSearchParams
function NewSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const providerId = searchParams.get('provider');

  const [provider, setProvider] = useState<Provider | null>(null);
  const [budget, setBudget] = useState('1000'); // cents = $10
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch provider details
  useEffect(() => {
    if (!providerId) {
      setError('No provider selected');
      return;
    }

    fetch(`/api/providers/${providerId}`)
      .then(res => res.json())
      .then((data: ApiResponse<Provider>) => {
        if (data.success && data.data) {
          setProvider(data.data);
        } else {
          setError(data.error || 'Provider not found');
        }
      })
      .catch(err => setError(err.message));
  }, [providerId]);

  const handleCreateSession = async () => {
    if (!provider) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: 'agent-demo', // TODO: Get from auth
          providerId: provider.id,
          budgetAllowance: parseInt(budget, 10),
        }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        // Redirect to session detail page
        router.push(`/sessions/${data.data.id}`);
      } else {
        setError(data.error || 'Failed to create session');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (error && !provider) {
    return (
      <PageWrapper>
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-red-500/20 p-8 text-center">
            <div className="text-red-400 text-lg mb-2">⚠️ Error</div>
            <p className="text-[#A2AAAD]">{error}</p>
            <button 
              onClick={() => router.push('/marketplace')}
              className="mt-6 px-6 py-2.5 text-sm font-medium border border-[#A2AAAD]/30 text-[#A2AAAD] rounded-full hover:border-[#00F5FF]/50 hover:text-[#00F5FF] transition-all"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!provider) {
    return (
      <PageWrapper>
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 p-8">
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-[#00F5FF]/30 border-t-[#00F5FF] rounded-full animate-spin" />
            </div>
            <p className="text-center text-[#A2AAAD]">Loading provider...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const estimatedTime = Math.floor(parseInt(budget, 10) / provider.pricePerMinute);

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">Start New Session</h1>

        {/* Provider Info */}
        <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#A2AAAD]/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Selected Provider</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
              provider.status === 'online' 
                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
            }`}>
              {provider.status}
            </span>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <div className="text-2xl font-bold text-white">{provider.name}</div>
              <div className="text-sm text-[#A2AAAD]/60 font-mono">{provider.id}</div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-[#A2AAAD]">Price:</span>
                <span className="ml-2 font-semibold text-[#00F5FF]">
                  ${(provider.pricePerMinute / 100).toFixed(2)}/min
                </span>
              </div>
              <div>
                <span className="text-[#A2AAAD]">Tools:</span>
                <span className="ml-2 font-semibold text-white">{provider.tools.length}</span>
              </div>
              <div>
                <span className="text-[#A2AAAD]">Uptime:</span>
                <span className="ml-2 font-semibold text-green-400">
                  {provider.reputation.uptime}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Configuration */}
        <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#A2AAAD]/10">
            <h2 className="text-lg font-semibold text-white">Session Budget</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#A2AAAD] mb-2">
                Budget Allowance (USDC)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#A2AAAD]">$</span>
                <input
                  type="number"
                  value={parseInt(budget, 10) / 100}
                  onChange={(e) => setBudget(String(Math.round(parseFloat(e.target.value) * 100)))}
                  min="1"
                  step="1"
                  className="flex-1 px-4 py-3 bg-[#0A1128] border border-[#A2AAAD]/20 rounded-xl text-xl font-semibold text-white focus:outline-none focus:border-[#00F5FF]/50 transition-colors"
                />
              </div>
            </div>

            <div className="p-4 bg-[#00F5FF]/5 rounded-xl border border-[#00F5FF]/10">
              <div className="text-sm text-[#A2AAAD] mb-1">Estimated execution time:</div>
              <div className="text-2xl font-bold text-[#00F5FF]">
                ~{estimatedTime} {estimatedTime === 1 ? 'minute' : 'minutes'}
              </div>
              <div className="text-xs text-[#A2AAAD]/60 mt-1">
                Based on provider&apos;s rate. Actual cost depends on effective execution time.
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div className="text-red-400 text-sm">{error}</div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/marketplace')}
            disabled={loading}
            className="px-6 py-3 text-sm font-medium border border-[#A2AAAD]/30 text-[#A2AAAD] rounded-full hover:border-[#00F5FF]/50 hover:text-[#00F5FF] transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateSession}
            disabled={loading || provider.status !== 'online'}
            className={`flex-1 px-6 py-3 text-sm font-medium rounded-full transition-all ${
              provider.status === 'online' && !loading
                ? 'bg-[#00F5FF] text-[#0A1128] hover:shadow-[0_0_20px_rgba(0,245,255,0.3)]'
                : 'bg-[#A2AAAD]/20 text-[#A2AAAD] cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-[#0A1128]/30 border-t-[#0A1128] rounded-full animate-spin" />
                Creating...
              </span>
            ) : provider.status === 'online' ? 'Create Session' : 'Provider Unavailable'}
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}

// Main page component with Suspense wrapper
export default function NewSessionPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <NewSessionContent />
    </Suspense>
  );
}
