'use client';

import Link from 'next/link';
import { Provider } from '@/types';

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const statusConfig = {
    online: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '●', label: 'Available' },
    busy: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: '◐', label: 'Busy' },
    offline: { color: 'bg-[#A2AAAD]/20 text-[#A2AAAD] border-[#A2AAAD]/30', icon: '○', label: 'Offline' },
  };

  const status = statusConfig[provider.status];
  const isAvailable = provider.status === 'online';

  return (
    <div 
      className={`relative bg-[#0A1128]/60 backdrop-blur-sm rounded-xl border overflow-hidden transition-all ${
        isAvailable 
          ? 'border-[#A2AAAD]/10 hover:border-[#00F5FF]/30 hover:shadow-[0_0_30px_rgba(0,245,255,0.1)]' 
          : 'border-[#A2AAAD]/10 opacity-70'
      }`}
    >
      {/* Status indicator glow */}
      {isAvailable && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#00F5FF]/5 to-transparent pointer-events-none" />
      )}

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-white">{provider.name}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                <span className={isAvailable ? 'animate-pulse' : ''}>{status.icon}</span>
                <span className="ml-1">{status.label}</span>
              </span>
            </div>
            <div className="text-sm text-[#A2AAAD]/60 font-mono">{provider.id}</div>
          </div>
          
          {/* Price */}
          <div className="text-right">
            <div className="text-3xl font-bold text-[#00F5FF]">${(provider.pricePerMinute / 100).toFixed(2)}</div>
            <div className="text-xs text-[#A2AAAD]">per minute</div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mb-6 pb-6 border-b border-[#A2AAAD]/10">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-sm">
                ⬆️
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{provider.reputation.uptime}%</div>
                <div className="text-xs text-[#A2AAAD]">Uptime</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#00F5FF]/10 flex items-center justify-center text-sm">
                ✓
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{provider.reputation.completedSessions}</div>
                <div className="text-xs text-[#A2AAAD]">Sessions</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-sm">
                ⚠️
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{provider.reputation.disputes}</div>
                <div className="text-xs text-[#A2AAAD]">Disputes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tools */}
        <div className="mb-6">
          <div className="text-sm font-medium text-[#A2AAAD] uppercase tracking-wide mb-3">
            Available Tools ({provider.tools.length})
          </div>
          {provider.tools.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {provider.tools.map(tool => (
                <div
                  key={tool.id}
                  className="group relative px-3 py-2 bg-[#0A1128]/40 rounded-lg border border-[#A2AAAD]/10 hover:border-[#00F5FF]/20 transition-all cursor-help"
                  title={tool.description}
                >
                  <div className="text-sm font-medium text-white">{tool.name}</div>
                  {tool.timeLimit && (
                    <div className="text-xs text-[#A2AAAD]/60">
                      ⏱ {tool.timeLimit}s limit
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-[#A2AAAD]/60 text-sm">
              No tools configured
            </div>
          )}
        </div>

        {/* Action */}
        <div className="flex items-center gap-3">
          {isAvailable ? (
            <>
              <Link href={`/sessions/new?provider=${provider.id}`} className="flex-1">
                <button className="w-full px-6 py-3 text-sm font-medium bg-[#00F5FF] text-[#0A1128] rounded-full hover:shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all group">
                  <span>Start Session</span>
                  <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </Link>
              <Link href={`/providers/${provider.id}`}>
                <button className="px-4 py-3 text-sm font-medium border border-[#A2AAAD]/30 text-[#A2AAAD] rounded-full hover:border-[#00F5FF]/50 hover:text-[#00F5FF] transition-all">
                  Details
                </button>
              </Link>
            </>
          ) : (
            <button disabled className="flex-1 px-6 py-3 text-sm font-medium bg-[#A2AAAD]/10 text-[#A2AAAD] rounded-full cursor-not-allowed">
              <span className="mr-2">{status.icon}</span>
              {provider.status === 'busy' ? 'Currently Busy' : 'Offline'}
            </button>
          )}
        </div>

        {/* Footer stats */}
        <div className="mt-4 pt-4 border-t border-[#A2AAAD]/5 flex items-center justify-between text-xs text-[#A2AAAD]/60">
          <div>
            Last active: <span className="text-[#A2AAAD]">2 min ago</span>
          </div>
          <div>
            Avg response: <span className="text-[#A2AAAD]">230ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
