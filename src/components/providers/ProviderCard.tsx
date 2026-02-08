import Link from 'next/link';
import { Provider } from '@/types';
import { Card, CardHeader, CardContent, CardFooter, Badge, Button } from '@/components/ui';

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const statusVariant = {
    online: 'success' as const,
    busy: 'warning' as const,
    offline: 'default' as const,
  };

  const isAvailable = provider.status === 'online';

  return (
    <Card hover={isAvailable}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-semibold">{provider.name}</h3>
              <Badge variant={statusVariant[provider.status]}>
                {provider.status}
              </Badge>
            </div>
            <p className="text-sm text-zinc-500">ID: {provider.id}</p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400">
              ${(provider.pricePerMinute / 100).toFixed(2)}
            </div>
            <div className="text-xs text-zinc-500">per minute</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Tools */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-zinc-400 mb-2">Available Tools</h4>
          {provider.tools.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {provider.tools.map(tool => (
                <span
                  key={tool.id}
                  className="px-3 py-1 bg-zinc-800 rounded-lg text-sm hover:bg-zinc-700 transition-colors"
                  title={tool.description}
                >
                  {tool.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-600">No tools available</p>
          )}
        </div>

        {/* Reputation */}
        <div className="flex items-center gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-1">
            <span className="text-green-400">⬆️</span>
            <span>{provider.reputation.uptime}% uptime</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-blue-400">✅</span>
            <span>{provider.reputation.completedSessions} sessions</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-red-400">⚠️</span>
            <span>{provider.reputation.disputes} disputes</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex items-center justify-end">
          {isAvailable ? (
            <Link href={`/sessions/new?provider=${provider.id}`}>
              <Button variant="primary">Start Session</Button>
            </Link>
          ) : (
            <Button variant="secondary" disabled>
              {provider.status === 'busy' ? 'Currently Busy' : 'Offline'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
