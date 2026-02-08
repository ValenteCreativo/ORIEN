'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Session, Provider, ApiResponse } from '@/types';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch session details
  useEffect(() => {
    if (!sessionId) return;

    Promise.all([
      fetch(`/api/sessions/${sessionId}`).then(res => res.json()),
    ])
      .then(([sessionData]) => {
        if (sessionData.success && sessionData.data) {
          setSession(sessionData.data);
          
          // Fetch provider details
          return fetch(`/api/providers/${sessionData.data.providerId}`).then(res => res.json());
        } else {
          throw new Error(sessionData.error || 'Session not found');
        }
      })
      .then((providerData: ApiResponse<Provider>) => {
        if (providerData.success && providerData.data) {
          setProvider(providerData.data);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-zinc-700 border-t-blue-500 mb-4"></div>
          <p className="text-zinc-500">Loading session...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-red-400 text-lg mb-2">⚠️ Error</div>
            <p className="text-zinc-500">{error || 'Session not found'}</p>
            <Button variant="secondary" className="mt-4" onClick={() => router.push('/sessions')}>
              Back to Sessions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusVariant = {
    pending: 'warning' as const,
    active: 'success' as const,
    completed: 'info' as const,
    failed: 'danger' as const,
    settled: 'default' as const,
  };

  const budgetRemaining = session.budgetAllowance - session.consumed;
  const budgetPercentage = (session.consumed / session.budgetAllowance) * 100;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold">Session Details</h1>
          <Badge variant={statusVariant[session.status]}>
            {session.status}
          </Badge>
        </div>
        <p className="text-sm text-zinc-500">ID: {session.id}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Budget & Consumption */}
          <Card>
            <CardHeader>
              <CardTitle>Budget & Consumption</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Consumed</span>
                  <span className="font-semibold text-red-400">
                    ${(session.consumed / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Remaining</span>
                  <span className="font-semibold text-green-400">
                    ${(budgetRemaining / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-zinc-800 pt-3">
                  <span className="text-zinc-500">Total Budget</span>
                  <span className="font-bold text-xl">
                    ${(session.budgetAllowance / 100).toFixed(2)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="pt-2">
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                      style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-zinc-600 mt-1 text-center">
                    {budgetPercentage.toFixed(1)}% consumed
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Execution History */}
          <Card>
            <CardHeader>
              <CardTitle>Execution History</CardTitle>
            </CardHeader>
            <CardContent>
              {session.executions && session.executions.length > 0 ? (
                <div className="space-y-3">
                  {session.executions.map(exec => (
                    <div 
                      key={exec.id}
                      className="p-4 bg-zinc-800 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{exec.toolId}</span>
                        <Badge variant={
                          exec.status === 'completed' ? 'success' :
                          exec.status === 'failed' ? 'danger' :
                          'warning'
                        }>
                          {exec.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-zinc-500">
                        Started: {new Date(exec.startedAt).toLocaleString()}
                      </div>
                      {exec.cost && (
                        <div className="text-xs text-zinc-500 mt-1">
                          Cost: ${(exec.cost / 100).toFixed(2)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-600">
                  No executions yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Provider Info */}
          {provider && (
            <Card>
              <CardHeader>
                <CardTitle>Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-semibold text-lg">{provider.name}</div>
                    <div className="text-xs text-zinc-500">{provider.id}</div>
                  </div>
                  <div className="pt-3 border-t border-zinc-800 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Rate</span>
                      <span className="font-semibold">
                        ${(provider.pricePerMinute / 100).toFixed(2)}/min
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Uptime</span>
                      <span className="font-semibold text-green-400">
                        {provider.reputation.uptime}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Session Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Effective Time</span>
                  <span className="font-semibold">
                    {Math.round(session.effectiveTimeMs / 1000)}s
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Executions</span>
                  <span className="font-semibold">
                    {session.executions?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Created</span>
                  <span className="font-semibold">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {session.endedAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Ended</span>
                    <span className="font-semibold">
                      {new Date(session.endedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {session.status === 'active' && (
            <Card>
              <CardContent className="space-y-2">
                <Button variant="primary" className="w-full">
                  Execute Tool
                </Button>
                <Button variant="danger" className="w-full">
                  End Session
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
