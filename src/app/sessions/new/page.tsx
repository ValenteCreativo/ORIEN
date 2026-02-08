'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Provider, ApiResponse } from '@/types';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';

// Loading component for Suspense fallback
function LoadingState() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Card>
        <CardContent className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-zinc-700 border-t-blue-500 mb-4"></div>
          <p className="text-zinc-500">Loading...</p>
        </CardContent>
      </Card>
    </div>
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
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-red-400 text-lg mb-2">⚠️ Error</div>
            <p className="text-zinc-500">{error}</p>
            <Button variant="secondary" className="mt-4" onClick={() => router.push('/marketplace')}>
              Back to Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardContent className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-zinc-700 border-t-blue-500 mb-4"></div>
            <p className="text-zinc-500">Loading provider...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const estimatedTime = Math.floor(parseInt(budget, 10) / provider.pricePerMinute);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Start New Session</h1>

      {/* Provider Info */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Selected Provider</CardTitle>
            <Badge variant={provider.status === 'online' ? 'success' : 'warning'}>
              {provider.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="text-2xl font-bold">{provider.name}</div>
              <div className="text-sm text-zinc-500">{provider.id}</div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-zinc-500">Price:</span>
                <span className="ml-2 font-semibold text-blue-400">
                  ${(provider.pricePerMinute / 100).toFixed(2)}/min
                </span>
              </div>
              <div>
                <span className="text-zinc-500">Tools:</span>
                <span className="ml-2 font-semibold">{provider.tools.length}</span>
              </div>
              <div>
                <span className="text-zinc-500">Uptime:</span>
                <span className="ml-2 font-semibold text-green-400">
                  {provider.reputation.uptime}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Configuration */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Session Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Budget Allowance (USDC)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-zinc-500">$</span>
                <input
                  type="number"
                  value={parseInt(budget, 10) / 100}
                  onChange={(e) => setBudget(String(Math.round(parseFloat(e.target.value) * 100)))}
                  min="1"
                  step="1"
                  className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xl font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-4 bg-zinc-800 rounded-lg">
              <div className="text-sm text-zinc-500 mb-1">Estimated execution time:</div>
              <div className="text-2xl font-bold text-blue-400">
                ~{estimatedTime} {estimatedTime === 1 ? 'minute' : 'minutes'}
              </div>
              <div className="text-xs text-zinc-600 mt-1">
                Based on provider&apos;s rate. Actual cost depends on effective execution time.
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="text-red-400 text-sm">{error}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={() => router.push('/marketplace')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleCreateSession}
          loading={loading}
          disabled={provider.status !== 'online'}
          className="flex-1"
        >
          {provider.status === 'online' ? 'Create Session' : 'Provider Unavailable'}
        </Button>
      </div>
    </div>
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
