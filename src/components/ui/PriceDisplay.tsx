interface PriceDisplayProps {
  amountCents: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'danger' | 'warning';
  className?: string;
}

export function PriceDisplay({ 
  amountCents, 
  label, 
  size = 'md',
  variant = 'default',
  className = '' 
}: PriceDisplayProps) {
  const dollars = Math.floor(amountCents / 100);
  const cents = amountCents % 100;

  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const variants = {
    default: 'text-white',
    success: 'text-green-400',
    danger: 'text-red-400',
    warning: 'text-yellow-400',
  };

  return (
    <div className={className}>
      {label && <div className="text-xs text-zinc-500 uppercase tracking-wide mb-1">{label}</div>}
      <div className={`font-bold ${sizes[size]} ${variants[variant]}`}>
        <span className="text-zinc-500 mr-0.5">$</span>
        {dollars}
        <span className="text-sm opacity-70">.{cents.toString().padStart(2, '0')}</span>
      </div>
    </div>
  );
}
