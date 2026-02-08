'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Session, Provider, ApiResponse } from '@/types';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Badge, 
  PriceDisplay,
  ProgressBar,
  StatCard 
} from '@/components/ui';
import { TrustIndicators } from '@/components/providers';

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
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-zinc-700 border-t-blue-500 mb-4"></div>
          <p className="text-zinc-500">Loading session...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
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

  const statusConfig = {
    pending: { variant: 'warning' as const, icon: '⏳', label: 'Pending' },
    active: { variant: 'success' as const, icon: '▶', label: 'Active' },
    completed: { variant: 'info' as const, icon: '✓', label: 'Completed' },
    failed: { variant: 'danger' as const, icon: '✗', label: 'Failed' },
    settled: { variant: 'default' as const, icon: '💰', label: 'Settled' },
  };

  const status = statusConfig[session.status];
  const budgetRemaining = session.budgetAllowance - session.consumed;
  const budgetPercentage = (session.consumed / session.budgetAllowance) * 100;
  const effectiveMinutes = (session.effectiveTimeMs / 1000 / 60).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold">Session</h1>
            <Badge variant={status.variant} className="text-base px-3 py-1">
              <span className="mr-2">{status.icon}</span>
              {status.label}
            </Badge>
          </div>
          {session.status === 'active' && (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Session running
            </div>
          )}
        </div>
        <p className="text-sm text-zinc-500 font-mono">{session.id}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Budget Consumed"
          value={`$${(session.consumed / 100).toFixed(2)}`}
          icon="💸"
          variant={budgetPercentage > 80 ? 'danger' : budgetPercentage > 50 ? 'warning' : 'success'}
          trend={budgetPercentage > 0 ? 'up' : 'neutral'}
          trendValue={`${budgetPercentage.toFixed(1)}%`}
        />
        <StatCard
          label="Budget Remaining"
          value={`$${(budgetRemaining / 100).toFixed(2)}`}
          icon="💰"
          variant="info"
        />
        <StatCard
          label="Effective Time"
          value={`${effectiveMinutes}m`}
          icon="⏱"
          variant="default"
        />
        <StatCard
          label="Executions"
          value={session.executions?.length || 0}
          icon="⚡"
          variant="default"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Budget Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Budget Overview</span>
                <span className="text-sm font-normal text-zinc-500">
                  ${(session.budgetAllowance / 100).toFixed(2)} total
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Main progress */}
                <ProgressBar
                  value={session.consumed}
                  max={session.budgetAllowance}
                  label="Consumption"
                  variant={
                    budgetPercentage > 90 ? 'danger' :
                    budgetPercentage > 70 ? 'warning' :
                    'success'
                  }
                  size="lg"
                  animated={session.status === 'active'}
                />

                {/* Budget breakdown */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <PriceDisplay
                      amountCents={session.consumed}
                      label="Consumed"
                      size="md"
                      variant="danger"
                    />
                  </div>
                  <div>
                    <PriceDisplay
                      amountCents={budgetRemaining}
                      label="Remaining"
                      size="md"
                      variant="success"
                    />
                  </div>
                </div>

                {/* Warning if low budget */}
                {budgetPercentage > 80 && session.status === 'active' && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-yellow-500 text-xl">⚠️</span>
                      <div>
                        <div className="font-semibold text-yellow-400">Low Budget Warning</div>
                        <div className="text-sm text-yellow-300/80 mt-1">
                          Only ${(budgetRemaining / 100).toFixed(2)} remaining. Session will end when budget is exhausted.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                  {session.executions.map(exec => {
                    const execStatus = {
                      pending: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400' },
                      running: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' },
                      completed: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400' },
                      failed: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
                    };
                    const style = execStatus[exec.status];

                    return (
                      <div 
                        key={exec.id}
                        className={`p-4 ${style.bg} border ${style.border} rounded-lg hover:${style.border.replace('/20', '/40')} transition-colors`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-semibold text-lg mb-1">{exec.toolId}</div>
                            <div className="text-xs text-zinc-500 font-mono">{exec.id}</div>
                          </div>
                          <Badge variant={exec.status === 'completed' ? 'success' : exec.status === 'failed' ? 'danger' : 'warning'}>
                            {exec.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-zinc-500">Started:</span>
                            <span className="ml-2 text-zinc-300">
                              {new Date(exec.startedAt).toLocaleTimeString()}
                            </span>
                          </div>
                          {exec.durationMs && (
                            <div>
                              <span className="text-zinc-500">Duration:</span>
                              <span className="ml-2 text-zinc-300">
                                {(exec.durationMs / 1000).toFixed(1)}s
                              </span>
                            </div>
                          )}
                          {exec.cost && (
                            <div>
                              <span className="text-zinc-500">Cost:</span>
                              <span className={`ml-2 font-semibold ${style.text}`}>
                                ${(exec.cost / 100).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Args */}
                        {Object.keys(exec.args).length > 0 && (
                          <details className="mt-3 text-xs">
                            <summary className="cursor-pointer text-zinc-500 hover:text-zinc-400">
                              View arguments
                            </summary>
                            <pre className="mt-2 p-2 bg-zinc-900 rounded text-zinc-400 overflow-x-auto">
                              {JSON.stringify(exec.args, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4 opacity-20">⚡</div>
                  <div className="text-zinc-500">No executions yet</div>
                  <div className="text-sm text-zinc-600 mt-1">
                    Execute tools to see history here
                  </div>
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
                <div className="space-y-4">
                  <div>
                    <div className="font-bold text-xl mb-1">{provider.name}</div>
                    <div className="text-xs text-zinc-500 font-mono">{provider.id}</div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800">
                    <PriceDisplay
                      amountCents={provider.pricePerMinute}
                      label="Rate"
                      size="md"
                    />
                    <div className="text-xs text-zinc-600 mt-1">per effective minute</div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800">
                    <TrustIndicators reputation={provider.reputation} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Session Info */}
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Agent ID</span>
                  <span className="font-mono text-zinc-300">{session.agentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Created</span>
                  <span className="text-zinc-300">
                    {new Date(session.createdAt).toLocaleString()}
                  </span>
                </div>
                {session.endedAt && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Ended</span>
                    <span className="text-zinc-300">
                      {new Date(session.endedAt).toLocaleString()}
                    </span>
                  </div>
                )}
                {session.settledAt && (
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Settled</span>
                    <span className="text-zinc-300">
                      {new Date(session.settledAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {session.status === 'active' && (
            <Card>
              <CardContent className="space-y-3">
                <Button variant="primary" className="w-full">
                  ⚡ Execute Tool
                </Button>
                <Button variant="danger" className="w-full">
                  ⏹ End Session
                </Button>
              </CardContent>
            </Card>
          )}

          {session.status === 'completed' && !session.settledAt && (
            <Card>
              <CardContent>
                <Button variant="primary" className="w-full">
                  💰 Settle & Pay
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
