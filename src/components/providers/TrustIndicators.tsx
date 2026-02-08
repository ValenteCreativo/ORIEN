import { ProviderReputation } from '@/types';
import { Badge } from '@/components/ui';

interface TrustIndicatorsProps {
  reputation: ProviderReputation;
  inline?: boolean;
}

export function TrustIndicators({ reputation, inline = false }: TrustIndicatorsProps) {
  const getUptimeBadge = (uptime: number) => {
    if (uptime >= 99) return { variant: 'success' as const, label: 'Excellent' };
    if (uptime >= 95) return { variant: 'info' as const, label: 'Good' };
    if (uptime >= 90) return { variant: 'warning' as const, label: 'Fair' };
    return { variant: 'danger' as const, label: 'Poor' };
  };

  const uptimeBadge = getUptimeBadge(reputation.uptime);

  const trustScore = Math.round(
    (reputation.uptime * 0.5) +
    (Math.min(reputation.completedSessions / 100, 1) * 30) +
    (Math.max(20 - reputation.disputes * 5, 0))
  );

  if (inline) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-zinc-400">{reputation.uptime}% uptime</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-blue-400">✓</span>
          <span className="text-zinc-400">{reputation.completedSessions} sessions</span>
        </div>
        {reputation.disputes === 0 && (
          <Badge variant="success" className="text-xs">
            No disputes
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Trust Score */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500">Trust Score</span>
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold text-blue-400">{trustScore}</div>
          <span className="text-xs text-zinc-600">/100</span>
        </div>
      </div>

      {/* Uptime */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500">Uptime</span>
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold">{reputation.uptime}%</div>
          <Badge variant={uptimeBadge.variant} className="text-xs">
            {uptimeBadge.label}
          </Badge>
        </div>
      </div>

      {/* Completed Sessions */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500">Completed Sessions</span>
        <div className="text-sm font-semibold text-green-400">
          {reputation.completedSessions.toLocaleString()}
        </div>
      </div>

      {/* Disputes */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500">Disputes</span>
        <div className="text-sm font-semibold">
          {reputation.disputes === 0 ? (
            <span className="text-green-400">None</span>
          ) : (
            <span className="text-red-400">{reputation.disputes}</span>
          )}
        </div>
      </div>
    </div>
  );
}
