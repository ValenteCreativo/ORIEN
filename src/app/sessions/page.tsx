'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout';

interface Session {
  id: string;
  agentId: string;
  providerId: string;
  status: 'pending' | 'active' | 'completed' | 'failed' | 'settled';
  budgetAllowance: number;
  consumed: number;
  effectiveTimeMs: number;
  createdAt: string;
  endedAt?: string;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sessions')
      .then(res => res.json())
      .then(data => {
        setSessions(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatCost = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    active: 'bg-[#00F5FF]/20 text-[#00F5FF] border-[#00F5FF]/30',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    failed: 'bg-red-500/20 text-red-400 border-red-500/30',
    settled: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center py-16">
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Sessions</h1>
            <p className="text-[#A2AAAD]">Track your compute sessions and executions</p>
          </div>
          <Link href="/marketplace">
            <button className="px-5 py-2.5 text-sm font-medium bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all">
              + New Session
            </button>
          </Link>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-20 bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border border-[#A2AAAD]/10">
            <div className="text-5xl mb-4 opacity-40">◎</div>
            <p className="text-lg text-white mb-2">No sessions yet</p>
            <p className="text-sm text-[#A2AAAD] mb-6">Start a session from the marketplace to see it here.</p>
            <Link href="/marketplace">
              <button className="px-6 py-2.5 text-sm font-medium bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[#00F5FF] rounded-full hover:bg-[#00F5FF]/20 transition-all">
                Browse Marketplace
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#A2AAAD]/10">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-[#A2AAAD] border-b border-[#A2AAAD]/10 bg-[#0A1128]/40">
                  <th className="px-6 py-4 font-medium">Session ID</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Effective Time</th>
                  <th className="px-6 py-4 font-medium">Cost</th>
                  <th className="px-6 py-4 font-medium">Budget</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(session => (
                  <tr key={session.id} className="border-b border-[#A2AAAD]/5 hover:bg-[#00F5FF]/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm text-white">{session.id.slice(0, 20)}...</div>
                      <div className="text-xs text-[#A2AAAD]/60">Provider: {session.providerId.slice(0, 15)}...</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[session.status]}`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[#00F5FF]">
                      {formatDuration(session.effectiveTimeMs)}
                    </td>
                    <td className="px-6 py-4 font-mono text-white">
                      {formatCost(session.consumed)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32 h-2 bg-[#A2AAAD]/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#00F5FF] to-[#00F5FF]/60"
                          style={{ width: `${Math.min(100, (session.consumed / session.budgetAllowance) * 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-[#A2AAAD]/60 mt-1">
                        {formatCost(session.consumed)} / {formatCost(session.budgetAllowance)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/sessions/${session.id}`}
                        className="text-[#00F5FF] hover:text-white text-sm transition-colors"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
