'use client';

import { Navigation } from './Navigation';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-[#0A1128]">
      <Navigation />
      <main className={`pt-20 ${className}`}>
        {children}
      </main>
    </div>
  );
}
