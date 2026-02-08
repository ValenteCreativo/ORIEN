// Wallet Configuration - wagmi + RainbowKit
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, base, arbitrum, optimism, polygon } from 'viem/chains';

export const config = getDefaultConfig({
  appName: 'ORIEN',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || 'demo',
  chains: [mainnet, base, arbitrum, optimism, polygon],
  ssr: true,
});

// Supported chains for ORIEN
export const SUPPORTED_CHAINS = {
  mainnet,
  base,
  arbitrum,
  optimism,
  polygon,
} as const;
