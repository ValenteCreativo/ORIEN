'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NETWORK_INFO } from '@/lib/wallet/config';

const navLinks = [
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/network', label: 'Network' },
  { href: '/sessions', label: 'Sessions' },
  { href: '/earnings', label: 'Earnings' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0A1128]/80 border-b border-[#00F5FF]/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="ORIEN" width={32} height={32} className="opacity-90" />
          <span className="text-lg font-semibold tracking-wider text-white">ORIEN</span>
          {NETWORK_INFO.isTestnet && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-yellow-500/20 text-yellow-400 rounded uppercase tracking-wider">
              Testnet
            </span>
          )}
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
        </div>
        
        {/* Real Wallet Connection */}
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => {
            const ready = mounted;
            const connected = ready && account && chain;

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        className="px-5 py-2 text-sm font-medium bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[#00F5FF] rounded-full hover:bg-[#00F5FF]/20 hover:border-[#00F5FF]/50 transition-all"
                      >
                        Connect Wallet
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        className="px-4 py-2 text-sm font-medium bg-red-500/20 border border-red-500/30 text-red-400 rounded-full hover:bg-red-500/30 transition-all"
                      >
                        Wrong Network
                      </button>
                    );
                  }

                  return (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={openChainModal}
                        className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm bg-[#0A1128]/60 border border-[#A2AAAD]/20 text-[#A2AAAD] rounded-full hover:border-[#00F5FF]/30 transition-all"
                      >
                        {chain.hasIcon && chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain'}
                            src={chain.iconUrl}
                            className="w-4 h-4 rounded-full"
                          />
                        )}
                        <span>{chain.name}</span>
                      </button>

                      <button
                        onClick={openAccountModal}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[#00F5FF] rounded-full hover:bg-[#00F5FF]/20 transition-all"
                      >
                        <span className="w-2 h-2 bg-green-400 rounded-full" />
                        {account.ensName || account.displayName}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </nav>
  );
}
