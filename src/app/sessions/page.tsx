'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';
import { useDemo } from '@/components/ui';
import { DEMO_SESSIONS, DEMO_PROVIDERS } from '@/lib/demo-data';

interface Session {
  id: string;
  agentId: string;
  providerId: string;
  status: 'pending' | 'active' | 'completed' | 'failed' | 'settled';
  budgetAllowance: number;
  consumed: number;
  effectiveTimeMs: number;
  createdAt: string | Date;
  endedAt?: string | Date;
}

export default function SessionsPage() {
  const { demoMode, toggleDemo } = useDemo();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (demoMode) {
      // Add demo sessions with proper typing
      const demoData: Session[] = [
        // Active session
        {
          id: 'ses_active_demo',
          agentId: 'agent_product_renderer',
          providerId: 'provider-pixel-forge',
          status: 'active',
          budgetAllowance: 5000,
          consumed: 1850,
          effectiveTimeMs: 1320000, // 22 min
          createdAt: new Date(Date.now() - 1500000),
        },
        // Recent completed
        {
          id: 'ses_completed_1',
          agentId: 'agent_ml_trainer',
          providerId: 'provider-neural-nexus',
          status: 'completed',
          budgetAllowance: 15000,
          consumed: 12600,
          effectiveTimeMs: 5040000, // 84 min
          createdAt: new Date(Date.now() - 7200000),
          endedAt: new Date(Date.now() - 2100000),
        },
        // Settled
        {
          id: 'ses_settled_1',
          agentId: 'agent_video_editor',
          providerId: 'provider-frame-flow',
          status: 'settled',
          budgetAllowance: 8000,
          consumed: 4200,
          effectiveTimeMs: 3600000, // 60 min
          createdAt: new Date(Date.now() - 86400000),
          endedAt: new Date(Date.now() - 82800000),
        },
        {
          id: 'ses_settled_2',
          agentId: 'agent_ci_runner',
          providerId: 'provider-ci-storm',
          status: 'settled',
          budgetAllowance: 2000,
          consumed: 875,
          effectiveTimeMs: 1500000, // 25 min
          createdAt: new Date(Date.now() - 172800000),
          endedAt: new Date(Date.now() - 172200000),
        },
      ];
      setSessions(demoData);
      setLoading(false);
    } else {
      fetch('/api/sessions')
        .then(res => res.json())
        .then(data => {
          setSessions(data.data || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [demoMode]);

  const formatDuration = (ms: number) => {
    if (ms < 60000) return `${(ms / 1000).toFixed(0)}s`;
    if (ms < 3600000) return `${(ms / 60000).toFixed(0)}m`;
    return `${(ms / 3600000).toFixed(1)}h`;
  };

  const formatCost = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const getProviderName = (providerId: string) => {
    const provider = DEMO_PROVIDERS.find(p => p.id === providerId);
    return provider?.name || providerId.slice(0, 15) + '...';
  };

  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Pending' },
    active: { bg: 'bg-green-500/20', text: 'text-green-400', label: '● Active' },
    completed: { bg: 'bg-[#00F5FF]/20', text: 'text-[#00F5FF]', label: 'Completed' },
    failed: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Failed' },
    settled: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: '✓ Settled' },
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#00F5FF]/30 border-t-[#00F5FF] rounded-full animate-spin" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Sessions</h1>
            <p className="text-[#A2AAAD]">Track your compute sessions and executions</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDemo}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                demoMode
                  ? 'bg-[#00F5FF] text-[#0A1128] shadow-[0_0_20px_rgba(0,245,255,0.4)]'
                  : 'border border-[#A2AAAD]/30 text-[#A2AAAD] hover:border-[#00F5FF]/50 hover:text-[#00F5FF]'
              }`}
            >
              {demoMode ? '● Demo' : 'Demo Mode'}
            </button>
            <Link href="/marketplace">
              <button className="px-5 py-2 text-sm font-medium bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all">
                + New Session
              </button>
            </Link>
          </div>
        </div>

        {/* Demo Banner */}
        {demoMode && (
          <div className="p-4 bg-[#00F5FF]/10 border border-[#00F5FF]/30 rounded-xl mb-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">🤖</span>
              <div>
                <div className="font-medium text-[#00F5FF]">Agent Session History</div>
                <p className="text-sm text-[#A2AAAD] mt-1">
                  Showing sample sessions. This is what an agent sees when tracking compute usage across providers.
                </p>
              </div>
            </div>
          </div>
        )}

        {sessions.length === 0 ? (
          <div className="text-center py-20 bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10">
            <div className="text-5xl mb-4 opacity-40">◎</div>
            <p className="text-lg text-white mb-2">No sessions yet</p>
            <p className="text-sm text-[#A2AAAD] mb-6">Start a session from the marketplace to see it here.</p>
            <div className="flex items-center justify-center gap-3">
              {!demoMode && (
                <button
                  onClick={toggleDemo}
                  className="px-5 py-2 text-sm font-medium border border-[#A2AAAD]/30 text-[#A2AAAD] rounded-full hover:border-[#00F5FF]/50 hover:text-[#00F5FF] transition-all"
                >
                  Try Demo Mode
                </button>
              )}
              <Link href="/marketplace">
                <button className="px-6 py-2.5 text-sm font-medium bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[#00F5FF] rounded-full hover:bg-[#00F5FF]/20 transition-all">
                  Browse Marketplace
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map(session => {
              const status = statusConfig[session.status];
              const providerName = demoMode ? getProviderName(session.providerId) : session.providerId;
              const budgetUsed = (session.consumed / session.budgetAllowance) * 100;

              return (
                <div
                  key={session.id}
                  className={`bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(0,245,255,0.05)] ${
                    session.status === 'active' ? 'border-green-500/30' : 'border-[#A2AAAD]/10'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                          {session.status === 'active' && (
                            <span className="flex items-center gap-1 text-xs text-green-400">
                              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                              Running
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-[#A2AAAD] font-mono">{session.id}</div>
                      </div>
                      <Link href={`/sessions/${session.id}`}>
                        <button className="px-4 py-1.5 text-xs font-medium border border-[#A2AAAD]/30 text-[#A2AAAD] rounded-full hover:border-[#00F5FF]/50 hover:text-[#00F5FF] transition-all">
                          View Details →
                        </button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-[#A2AAAD]/60 mb-1">Provider</div>
                        <div className="text-sm text-white font-medium">{providerName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#A2AAAD]/60 mb-1">Agent</div>
                        <div className="text-sm text-[#A2AAAD] font-mono">{session.agentId}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#A2AAAD]/60 mb-1">Effective Time</div>
                        <div className="text-sm text-[#00F5FF] font-medium">
                          {formatDuration(session.effectiveTimeMs)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[#A2AAAD]/60 mb-1">Cost</div>
                        <div className="text-sm text-white font-medium">{formatCost(session.consumed)}</div>
                      </div>
                    </div>

                    {/* Budget Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#A2AAAD]/60">Budget Used</span>
                        <span className="text-[#A2AAAD]">
                          {formatCost(session.consumed)} / {formatCost(session.budgetAllowance)}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#A2AAAD]/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            budgetUsed > 90 ? 'bg-red-500' :
                            budgetUsed > 70 ? 'bg-yellow-500' :
                            'bg-[#00F5FF]'
                          }`}
                          style={{ width: `${Math.min(100, budgetUsed)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Demo Footer */}
        {demoMode && sessions.length > 0 && (
          <div className="mt-6 text-center text-sm text-[#00F5FF]/60">
            Showing {sessions.length} demo sessions
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
