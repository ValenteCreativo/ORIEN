'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useDemo } from '@/components/ui';

const navLinks = [
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/earnings', label: 'My Profile' },
];

export function Navigation() {
  const pathname = usePathname();
  const { demoMode } = useDemo();
  const [walletConnected, setWalletConnected] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);

  // Demo wallet address
  const demoAddress = '0x1a2b...3c4d';
  const demoEns = 'agent.orien.eth';

  const handleConnect = () => {
    // In demo mode, just toggle connected state
    if (demoMode) {
      setWalletConnected(true);
    } else {
      // In production, this would trigger actual wallet connect
      setWalletConnected(true);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0A1128]/80 border-b border-[#00F5FF]/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="ORIEN" width={32} height={32} className="opacity-90" />
          <span className="text-lg font-semibold tracking-wider text-white">ORIEN</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map(link => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`transition-colors ${
                pathname.startsWith(link.href)
                  ? 'text-[#00F5FF]'
                  : 'text-[#A2AAAD] hover:text-[#00F5FF]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {/* Sessions link - visible when wallet connected */}
          {walletConnected && (
            <Link 
              href="/sessions" 
              className={`transition-colors ${
                pathname.startsWith('/sessions')
                  ? 'text-[#00F5FF]'
                  : 'text-[#A2AAAD] hover:text-[#00F5FF]'
              }`}
            >
              Sessions
            </Link>
          )}
        </div>
        
        {/* Wallet Section */}
        <div className="flex items-center gap-3">
          {walletConnected ? (
            <div className="relative">
              <button
                onClick={() => setShowWalletMenu(!showWalletMenu)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[#00F5FF] rounded-full hover:bg-[#00F5FF]/20 transition-all"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                {demoMode ? demoEns : demoAddress}
              </button>

              {showWalletMenu && (
                <div className="absolute right-0 top-12 w-48 bg-[#0A1128] border border-[#A2AAAD]/20 rounded-xl shadow-xl overflow-hidden">
                  <div className="p-3 border-b border-[#A2AAAD]/10">
                    <div className="text-xs text-[#A2AAAD]">Connected as</div>
                    <div className="text-sm text-white font-mono">{demoAddress}</div>
                    {demoMode && (
                      <div className="text-xs text-[#00F5FF]">{demoEns}</div>
                    )}
                  </div>
                  <Link href="/earnings" className="block px-3 py-2 text-sm text-[#A2AAAD] hover:bg-[#00F5FF]/10 hover:text-[#00F5FF]">
                    My Profile
                  </Link>
                  <Link href="/sessions" className="block px-3 py-2 text-sm text-[#A2AAAD] hover:bg-[#00F5FF]/10 hover:text-[#00F5FF]">
                    Sessions
                  </Link>
                  <button
                    onClick={() => {
                      setWalletConnected(false);
                      setShowWalletMenu(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-left text-red-400 hover:bg-red-500/10"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="px-5 py-2 text-sm font-medium bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[#00F5FF] rounded-full hover:bg-[#00F5FF]/20 hover:border-[#00F5FF]/50 transition-all"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
