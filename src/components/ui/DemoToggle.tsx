'use client';

import { useState, createContext, useContext, ReactNode } from 'react';

interface DemoContextType {
  demoMode: boolean;
  toggleDemo: () => void;
}

const DemoContext = createContext<DemoContextType>({
  demoMode: false,
  toggleDemo: () => {},
});

export function DemoProvider({ children }: { children: ReactNode }) {
  const [demoMode, setDemoMode] = useState(false);

  const toggleDemo = () => {
    setDemoMode(prev => !prev);
  };

  return (
    <DemoContext.Provider value={{ demoMode, toggleDemo }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  return useContext(DemoContext);
}

export function DemoToggle() {
  const { demoMode, toggleDemo } = useDemo();

  return (
    <button
      onClick={toggleDemo}
      className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
        demoMode
          ? 'bg-cyan text-navy shadow-[0_0_20px_#00F5FF]'
          : 'bg-navy/80 text-gray border border-gray/30 hover:border-cyan'
      }`}
    >
      {demoMode ? '● DEMO ACTIVE' : 'Demo Mode'}
    </button>
  );
}
