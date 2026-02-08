'use client';

import { useChainId, useChains } from 'wagmi';
import { NETWORK_INFO } from '@/lib/wallet/config';

export function NetworkBadge() {
  const chainId = useChainId();
  const chains = useChains();
  
  const currentChain = chains.find(c => c.id === chainId);
  const chainName = currentChain?.name || 'Not Connected';
  const isTestnet = currentChain?.testnet ?? NETWORK_INFO.isTestnet;

  if (!currentChain) {
    return null;
  }

  return (
    <div className={`
      flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
      ${isTestnet 
        ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-500' 
        : 'bg-green-500/10 border border-green-500/30 text-green-500'
      }
    `}>
      <span className={`w-1.5 h-1.5 rounded-full ${isTestnet ? 'bg-yellow-500' : 'bg-green-500'}`} />
      <span>{chainName}</span>
      {isTestnet && <span className="opacity-60">Testnet</span>}
    </div>
  );
}
