interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
}

export function StatCard({ 
  label, 
  value, 
  icon, 
  trend, 
  trendValue,
  variant = 'default' 
}: StatCardProps) {
  const variants = {
    default: 'border-zinc-800 bg-zinc-900/50',
    success: 'border-green-500/20 bg-green-500/5',
    danger: 'border-red-500/20 bg-red-500/5',
    warning: 'border-yellow-500/20 bg-yellow-500/5',
    info: 'border-blue-500/20 bg-blue-500/5',
  };

  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-zinc-500',
  };

  return (
    <div className={`p-4 rounded-lg border ${variants[variant]} transition-all hover:border-zinc-700`}>
      <div className="flex items-start justify-between mb-2">
        <div className="text-xs text-zinc-500 uppercase tracking-wide">{label}</div>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      {trend && trendValue && (
        <div className={`text-xs ${trendColors[trend]} flex items-center gap-1`}>
          {trend === 'up' && '↗'}
          {trend === 'down' && '↘'}
          {trend === 'neutral' && '→'}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}
