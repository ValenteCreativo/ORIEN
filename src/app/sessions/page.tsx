'use client';

import { useEffect, useState } from 'react';

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
    pending: 'bg-yellow-500/20 text-yellow-400',
    active: 'bg-blue-500/20 text-blue-400',
    completed: 'bg-green-500/20 text-green-400',
    failed: 'bg-red-500/20 text-red-400',
    settled: 'bg-purple-500/20 text-purple-400',
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center text-zinc-500">Loading sessions...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Sessions</h1>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-lg mb-4">No sessions yet</p>
          <p className="text-sm">Start a session from the marketplace to see it here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-zinc-500 border-b border-zinc-800">
                <th className="pb-4 font-medium">Session ID</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium">Effective Time</th>
                <th className="pb-4 font-medium">Cost</th>
                <th className="pb-4 font-medium">Budget</th>
                <th className="pb-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(session => (
                <tr key={session.id} className="border-b border-zinc-800/50">
                  <td className="py-4">
                    <div className="font-mono text-sm">{session.id.slice(0, 20)}...</div>
                    <div className="text-xs text-zinc-500">Provider: {session.providerId.slice(0, 15)}...</div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[session.status]}`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="py-4 font-mono">
                    {formatDuration(session.effectiveTimeMs)}
                  </td>
                  <td className="py-4 font-mono">
                    {formatCost(session.consumed)}
                  </td>
                  <td className="py-4">
                    <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500"
                        style={{ width: `${Math.min(100, (session.consumed / session.budgetAllowance) * 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      {formatCost(session.consumed)} / {formatCost(session.budgetAllowance)}
                    </div>
                  </td>
                  <td className="py-4">
                    <a 
                      href={`/sessions/${session.id}`}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      View Details
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
