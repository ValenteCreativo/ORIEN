interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function ProgressBar({ 
  value, 
  max = 100,
  label,
  showPercentage = true,
  variant = 'default',
  size = 'md',
  animated = false
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variants = {
    default: 'from-blue-500 to-purple-500',
    success: 'from-green-500 to-emerald-500',
    danger: 'from-red-500 to-orange-500',
    warning: 'from-yellow-500 to-orange-500',
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2 text-sm">
          {label && <span className="text-zinc-400">{label}</span>}
          {showPercentage && (
            <span className="font-semibold text-zinc-300">{percentage.toFixed(1)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-zinc-800 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${sizes[size]} bg-gradient-to-r ${variants[variant]} transition-all duration-500 ${animated ? 'animate-pulse' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
