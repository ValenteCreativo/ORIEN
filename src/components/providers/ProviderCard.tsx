import Link from 'next/link';
import { Provider } from '@/types';
import { Card, Badge, Button, PriceDisplay } from '@/components/ui';
import { TrustIndicators } from './TrustIndicators';

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const statusConfig = {
    online: { variant: 'success' as const, icon: '●', label: 'Available' },
    busy: { variant: 'warning' as const, icon: '◐', label: 'Busy' },
    offline: { variant: 'default' as const, icon: '○', label: 'Offline' },
  };

  const status = statusConfig[provider.status];
  const isAvailable = provider.status === 'online';

  return (
    <Card 
      hover={isAvailable}
      className={`relative overflow-hidden ${isAvailable ? 'border-zinc-700' : ''}`}
    >
      {/* Status indicator glow */}
      {isAvailable && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />
      )}

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold">{provider.name}</h3>
              <Badge variant={status.variant} className="flex items-center gap-1">
                <span className={isAvailable ? 'animate-pulse' : ''}>{status.icon}</span>
                {status.label}
              </Badge>
            </div>
            <div className="text-sm text-zinc-500 font-mono">{provider.id}</div>
          </div>
          
          {/* Price - prominent */}
          <PriceDisplay 
            amountCents={provider.pricePerMinute}
            label="per minute"
            size="lg"
            variant={isAvailable ? 'default' : 'default'}
          />
        </div>

        {/* Trust Indicators */}
        <div className="mb-6 pb-6 border-b border-zinc-800">
          <TrustIndicators reputation={provider.reputation} inline />
        </div>

        {/* Tools */}
        <div className="mb-6">
          <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">
            Available Tools ({provider.tools.length})
          </div>
          {provider.tools.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {provider.tools.map(tool => (
                <div
                  key={tool.id}
                  className="group relative px-3 py-2 bg-zinc-800/50 rounded-lg border border-zinc-700/50 hover:border-blue-500/30 hover:bg-zinc-800 transition-all cursor-help"
                  title={tool.description}
                >
                  <div className="text-sm font-medium">{tool.name}</div>
                  {tool.timeLimit && (
                    <div className="text-xs text-zinc-600">
                      ⏱ {tool.timeLimit}s limit
                    </div>
                  )}
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-xl text-xs max-w-xs">
                      <div className="font-semibold mb-1">{tool.name}</div>
                      <div className="text-zinc-400">{tool.description}</div>
                      {tool.resourceLimit && (
                        <div className="text-zinc-600 mt-1">
                          {tool.resourceLimit.maxCpu && `CPU: ${tool.resourceLimit.maxCpu}%`}
                          {tool.resourceLimit.maxMemory && ` | RAM: ${tool.resourceLimit.maxMemory}MB`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-zinc-600 text-sm">
              No tools configured
            </div>
          )}
        </div>

        {/* Action */}
        <div className="flex items-center gap-3">
          {isAvailable ? (
            <>
              <Link href={`/sessions/new?provider=${provider.id}`} className="flex-1">
                <Button variant="primary" className="w-full group">
                  <span>Start Session</span>
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
              <Link href={`/providers/${provider.id}`}>
                <Button variant="ghost" size="sm">
                  Details
                </Button>
              </Link>
            </>
          ) : (
            <Button variant="secondary" disabled className="flex-1">
              <span className="mr-2">{status.icon}</span>
              {provider.status === 'busy' ? 'Currently Busy' : 'Offline'}
            </Button>
          )}
        </div>

        {/* Footer stats */}
        <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center justify-between text-xs text-zinc-600">
          <div>
            Last active: <span className="text-zinc-500">2 min ago</span>
          </div>
          <div>
            Avg response: <span className="text-zinc-500">230ms</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
