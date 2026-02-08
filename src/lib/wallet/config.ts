// Wallet Configuration - wagmi + RainbowKit
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { 
  mainnet, 
  sepolia,
  base, 
  baseSepolia,
  arbitrum, 
  arbitrumSepolia,
  optimism, 
  optimismSepolia,
  polygon,
  polygonAmoy
} from 'viem/chains';

// Environment check
const IS_TESTNET = process.env.NEXT_PUBLIC_NETWORK_MODE !== 'mainnet';

// Testnet chains (default for development & hackathons)
const TESTNET_CHAINS = [sepolia, baseSepolia, arbitrumSepolia, optimismSepolia, polygonAmoy] as const;

// Mainnet chains (for production)
const MAINNET_CHAINS = [mainnet, base, arbitrum, optimism, polygon] as const;

// Use testnet by default (ETH Global hackathon mode)
const chains = IS_TESTNET ? TESTNET_CHAINS : MAINNET_CHAINS;

export const config = getDefaultConfig({
  appName: 'ORIEN',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || 'demo',
  chains: chains as any,
  ssr: true,
});

// Supported chains for ORIEN
export const SUPPORTED_CHAINS = IS_TESTNET ? {
  sepolia,
  baseSepolia,
  arbitrumSepolia,
  optimismSepolia,
  polygonAmoy,
} : {
  mainnet,
  base,
  arbitrum,
  optimism,
  polygon,
};

// Default chain
export const DEFAULT_CHAIN = IS_TESTNET ? sepolia : mainnet;

// USDC addresses by chain (testnet uses mock USDC or faucet tokens)
export const USDC_ADDRESSES: Record<number, string> = {
  // Testnets
  [sepolia.id]: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Circle USDC on Sepolia
  [baseSepolia.id]: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // USDC on Base Sepolia
  [arbitrumSepolia.id]: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d', // USDC on Arb Sepolia
  [optimismSepolia.id]: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7', // USDC on OP Sepolia
  
  // Mainnets
  [mainnet.id]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [base.id]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  [arbitrum.id]: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  [optimism.id]: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  [polygon.id]: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
};

// Network info for display
export const NETWORK_INFO = {
  isTestnet: IS_TESTNET,
  defaultChain: DEFAULT_CHAIN,
  chains: Object.values(SUPPORTED_CHAINS),
};
