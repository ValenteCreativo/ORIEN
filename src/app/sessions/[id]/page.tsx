'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Session, Provider, ApiResponse } from '@/types';
import { PageWrapper } from '@/components/layout';
import { useDemo } from '@/components/ui';
import { DEMO_PROVIDERS, DEMO_SESSIONS } from '@/lib/demo-data';

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = params.id as string;
  const { demoMode } = useDemo();

  const demoBudget = useMemo(() => {
    const b = searchParams.get('budget');
    const parsed = b ? parseInt(b, 10) : NaN;
    return Number.isFinite(parsed) ? parsed : null;
  }, [searchParams]);

  const [session, setSession] = useState<Session | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch session details
  useEffect(() => {
    if (!sessionId) return;

    // Demo path: resolve sessions/providers locally
    if (demoMode) {
      try {
        // 1) sessions/new creates ses_demo_<providerId>
        if (sessionId.startsWith('ses_demo_')) {
          const providerId = sessionId.replace('ses_demo_', '');
          const demoProvider = (DEMO_PROVIDERS as unknown as Provider[]).find(p => p.id === providerId);
          if (!demoProvider) throw new Error('Session not found');

          const budgetAllowance = demoBudget ?? 10000;
          const consumed = Math.min(1850, Math.max(0, Math.floor(budgetAllowance * 0.18)));

          const demoSession: Session = {
            id: sessionId,
            agentId: 'agent-demo',
            providerId,
            status: 'active',
            budgetAllowance,
            consumed,
            effectiveTimeMs: 22 * 60 * 1000,
            executions: [
              {
                id: `exec_${sessionId}`,
                sessionId,
                toolId: demoProvider.tools[0]?.id ?? 'tool-demo',
                args: { task: 'demo-mission' },
                status: 'running',
                startedAt: new Date(Date.now() - 8 * 60 * 1000),
                endedAt: undefined,
                durationMs: undefined,
                cost: consumed,
                result: undefined,
              },
            ],
            createdAt: new Date(Date.now() - 25 * 60 * 1000),
          };

          setSession(demoSession);
          setProvider(demoProvider);
          setLoading(false);
          return;
        }

        // 2) fallback to DEMO_SESSIONS (from demo-data.ts)
        const demoSession = (DEMO_SESSIONS as unknown as Session[]).find(s => s.id === sessionId);
        if (!demoSession) throw new Error('Session not found');

        const demoProvider = (DEMO_PROVIDERS as unknown as Provider[]).find(p => p.id === demoSession.providerId) ?? null;
        setSession(demoSession);
        setProvider(demoProvider);
        setLoading(false);
        return;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Session not found');
        setLoading(false);
        return;
      }
    }

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
  }, [sessionId, demoMode, demoBudget]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#00F5FF]/30 border-t-[#00F5FF] rounded-full animate-spin" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !session) {
    return (
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-red-500/20 p-8 text-center">
            <div className="text-red-400 text-lg mb-2">⚠️ Error</div>
            <p className="text-[#A2AAAD]">{error || 'Session not found'}</p>
            <button 
              onClick={() => router.push('/sessions')}
              className="mt-6 px-6 py-2.5 text-sm font-medium border border-[#A2AAAD]/30 text-[#A2AAAD] rounded-full hover:border-[#00F5FF]/50 hover:text-[#00F5FF] transition-all"
            >
              Back to Sessions
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const statusConfig = {
    pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: '⏳', label: 'Pending' },
    active: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '▶', label: 'Active' },
    completed: { color: 'bg-[#00F5FF]/20 text-[#00F5FF] border-[#00F5FF]/30', icon: '✓', label: 'Completed' },
    failed: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '✗', label: 'Failed' },
    settled: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: '💰', label: 'Settled' },
  };

  const status = statusConfig[session.status];
  const budgetRemaining = session.budgetAllowance - session.consumed;
  const budgetPercentage = (session.consumed / session.budgetAllowance) * 100;
  const effectiveMinutes = (session.effectiveTimeMs / 1000 / 60).toFixed(2);

  const execStatusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    running: 'bg-[#00F5FF]/10 border-[#00F5FF]/20 text-[#00F5FF]',
    completed: 'bg-green-500/10 border-green-500/20 text-green-400',
    failed: 'bg-red-500/10 border-red-500/20 text-red-400',
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-white">Session</h1>
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${status.color}`}>
                <span className="mr-2">{status.icon}</span>
                {status.label}
              </span>
            </div>
            {session.status === 'active' && (
              <div className="flex items-center gap-2 text-sm text-[#A2AAAD]">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Session running
              </div>
            )}
          </div>
          <p className="text-sm text-[#A2AAAD]/60 font-mono">{session.id}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Budget Consumed', value: `$${(session.consumed / 100).toFixed(2)}`, icon: '💸', color: budgetPercentage > 80 ? 'text-red-400' : 'text-[#00F5FF]' },
            { label: 'Budget Remaining', value: `$${(budgetRemaining / 100).toFixed(2)}`, icon: '💰', color: 'text-green-400' },
            { label: 'Effective Time', value: `${effectiveMinutes}m`, icon: '⏱', color: 'text-white' },
            { label: 'Executions', value: session.executions?.length || 0, icon: '⚡', color: 'text-[#00F5FF]' },
          ].map((stat, i) => (
            <div key={i} className="p-5 bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-[#A2AAAD] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Budget Visualization */}
            <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#A2AAAD]/10 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Budget Overview</h2>
                <span className="text-sm text-[#A2AAAD]">${(session.budgetAllowance / 100).toFixed(2)} total</span>
              </div>
              <div className="p-6 space-y-6">
                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-[#A2AAAD]">Consumption</span>
                    <span className="text-white font-medium">{budgetPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-[#A2AAAD]/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        budgetPercentage > 90 ? 'bg-red-500' :
                        budgetPercentage > 70 ? 'bg-yellow-500' :
                        'bg-gradient-to-r from-[#00F5FF] to-[#00F5FF]/60'
                      } ${session.status === 'active' ? 'animate-pulse' : ''}`}
                      style={{ width: `${Math.min(100, budgetPercentage)}%` }}
                    />
                  </div>
                </div>

                {/* Budget breakdown */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0A1128]/40 rounded-xl border border-red-500/10">
                    <div className="text-xs text-[#A2AAAD] mb-1">Consumed</div>
                    <div className="text-2xl font-bold text-red-400">${(session.consumed / 100).toFixed(2)}</div>
                  </div>
                  <div className="p-4 bg-[#0A1128]/40 rounded-xl border border-green-500/10">
                    <div className="text-xs text-[#A2AAAD] mb-1">Remaining</div>
                    <div className="text-2xl font-bold text-green-400">${(budgetRemaining / 100).toFixed(2)}</div>
                  </div>
                </div>

                {/* Warning if low budget */}
                {budgetPercentage > 80 && session.status === 'active' && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
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
            </div>

            {/* Execution History */}
            <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#A2AAAD]/10">
                <h2 className="text-lg font-semibold text-white">Execution History</h2>
              </div>
              <div className="p-6">
                {session.executions && session.executions.length > 0 ? (
                  <div className="space-y-3">
                    {session.executions.map(exec => (
                      <div 
                        key={exec.id}
                        className={`p-4 rounded-xl border ${execStatusColors[exec.status]} transition-colors`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-semibold text-lg text-white mb-1">{exec.toolId}</div>
                            <div className="text-xs text-[#A2AAAD]/60 font-mono">{exec.id}</div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            exec.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            exec.status === 'failed' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                            'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }`}>
                            {exec.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-[#A2AAAD]">Started:</span>
                            <span className="ml-2 text-white">
                              {new Date(exec.startedAt).toLocaleTimeString()}
                            </span>
                          </div>
                          {exec.durationMs && (
                            <div>
                              <span className="text-[#A2AAAD]">Duration:</span>
                              <span className="ml-2 text-white">
                                {(exec.durationMs / 1000).toFixed(1)}s
                              </span>
                            </div>
                          )}
                          {exec.cost && (
                            <div>
                              <span className="text-[#A2AAAD]">Cost:</span>
                              <span className="ml-2 font-semibold text-[#00F5FF]">
                                ${(exec.cost / 100).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Args */}
                        {Object.keys(exec.args).length > 0 && (
                          <details className="mt-3 text-xs">
                            <summary className="cursor-pointer text-[#A2AAAD] hover:text-[#00F5FF] transition-colors">
                              View arguments
                            </summary>
                            <pre className="mt-2 p-3 bg-[#0A1128] rounded-lg text-[#A2AAAD] overflow-x-auto border border-[#A2AAAD]/10">
                              {JSON.stringify(exec.args, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4 opacity-20">⚡</div>
                    <div className="text-[#A2AAAD]">No executions yet</div>
                    <div className="text-sm text-[#A2AAAD]/60 mt-1">
                      Execute tools to see history here
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Provider Info */}
            {provider && (
              <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#A2AAAD]/10">
                  <h2 className="text-lg font-semibold text-white">Provider</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <div className="font-bold text-xl text-white mb-1">{provider.name}</div>
                    <div className="text-xs text-[#A2AAAD]/60 font-mono">{provider.id}</div>
                  </div>

                  <div className="pt-4 border-t border-[#A2AAAD]/10">
                    <div className="text-xs text-[#A2AAAD] mb-1">Rate</div>
                    <div className="text-2xl font-bold text-[#00F5FF]">${(provider.pricePerMinute / 100).toFixed(2)}</div>
                    <div className="text-xs text-[#A2AAAD]/60">per effective minute</div>
                  </div>

                  <div className="pt-4 border-t border-[#A2AAAD]/10 grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-[#A2AAAD]">Uptime</div>
                      <div className="text-lg font-semibold text-green-400">{provider.reputation.uptime}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#A2AAAD]">Sessions</div>
                      <div className="text-lg font-semibold text-[#00F5FF]">{provider.reputation.completedSessions}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Session Info */}
            <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#A2AAAD]/10">
                <h2 className="text-lg font-semibold text-white">Session Details</h2>
              </div>
              <div className="p-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#A2AAAD]">Agent ID</span>
                  <span className="font-mono text-white">{session.agentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A2AAAD]">Created</span>
                  <span className="text-white">
                    {new Date(session.createdAt).toLocaleString()}
                  </span>
                </div>
                {session.endedAt && (
                  <div className="flex justify-between">
                    <span className="text-[#A2AAAD]">Ended</span>
                    <span className="text-white">
                      {new Date(session.endedAt).toLocaleString()}
                    </span>
                  </div>
                )}
                {session.settledAt && (
                  <div className="flex justify-between">
                    <span className="text-[#A2AAAD]">Settled</span>
                    <span className="text-white">
                      {new Date(session.settledAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {session.status === 'active' && (
              <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 p-6 space-y-3">
                <button className="w-full px-6 py-3 text-sm font-medium bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all">
                  ⚡ Execute Tool
                </button>
                <button className="w-full px-6 py-3 text-sm font-medium border border-red-500/30 text-red-400 rounded-full hover:bg-red-500/10 transition-all">
                  ⏹ End Session
                </button>
              </div>
            )}

            {session.status === 'completed' && !session.settledAt && (
              <div className="bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10 p-6">
                <button className="w-full px-6 py-3 text-sm font-medium bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all">
                  💰 Settle & Pay
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
