// LI.FI Integration
// Cross-chain swaps and DeFi reinvestment

import { createConfig, getQuote, getRoutes, executeRoute } from '@lifi/sdk';

// Initialize LI.FI with API key
const LIFI_API_KEY = process.env.LIFI_API_KEY || '';

// Configure LI.FI SDK
export function initializeLiFi() {
  createConfig({
    apiKey: LIFI_API_KEY,
    integrator: 'orien',
  });
}

export interface SwapQuote {
  fromChain: number;
  toChain: number;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  estimatedGas: string;
  executionTime: number; // seconds
  route: unknown;
}

export interface ReinvestmentStrategy {
  id: string;
  name: string;
  description: string;
  apy: number; // estimated APY
  risk: 'low' | 'medium' | 'high';
  minAmount: bigint;
  chain: number;
  protocol: string;
}

// Common chain IDs
export const CHAINS = {
  ETHEREUM: 1,
  POLYGON: 137,
  ARBITRUM: 42161,
  OPTIMISM: 10,
  BASE: 8453,
  AVALANCHE: 43114,
} as const;

// USDC addresses by chain
export const USDC_ADDRESSES: Record<number, string> = {
  [CHAINS.ETHEREUM]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [CHAINS.POLYGON]: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  [CHAINS.ARBITRUM]: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  [CHAINS.OPTIMISM]: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  [CHAINS.BASE]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
};

/**
 * Get quote for swapping any token to USDC
 * Used for "pay with anything" feature
 */
export async function getSwapToUSDCQuote(
  fromChain: number,
  fromToken: string,
  fromAmount: string,
  toChain: number = CHAINS.ETHEREUM
): Promise<SwapQuote | null> {
  try {
    const routes = await getRoutes({
      fromChainId: fromChain,
      toChainId: toChain,
      fromTokenAddress: fromToken,
      toTokenAddress: USDC_ADDRESSES[toChain],
      fromAmount,
      options: {
        slippage: 0.005, // 0.5% slippage
        order: 'CHEAPEST',
      },
    });

    if (!routes.routes || routes.routes.length === 0) {
      return null;
    }

    const bestRoute = routes.routes[0];

    return {
      fromChain,
      toChain,
      fromToken,
      toToken: USDC_ADDRESSES[toChain],
      fromAmount,
      toAmount: bestRoute.toAmount,
      estimatedGas: bestRoute.gasCostUSD || '0',
      executionTime: bestRoute.steps.reduce(
        (acc, step) => acc + (step.estimate?.executionDuration || 0), 
        0
      ),
      route: bestRoute,
    };
  } catch (error) {
    console.error('LI.FI quote error:', error);
    return null;
  }
}

/**
 * Get reinvestment routes for provider earnings
 * Converts USDC to yield-bearing positions
 */
export async function getReinvestmentOptions(
  fromChain: number,
  usdcAmount: string
): Promise<ReinvestmentStrategy[]> {
  // For MVP, return static strategies
  // In production, this would query DeFi protocols
  return [
    {
      id: 'aave-usdc-eth',
      name: 'Aave USDC (Ethereum)',
      description: 'Lend USDC on Aave for yield',
      apy: 4.5,
      risk: 'low',
      minAmount: BigInt(100_000_000), // $100 minimum
      chain: CHAINS.ETHEREUM,
      protocol: 'aave',
    },
    {
      id: 'compound-usdc-base',
      name: 'Compound USDC (Base)',
      description: 'Supply USDC to Compound on Base',
      apy: 5.2,
      risk: 'low',
      minAmount: BigInt(50_000_000), // $50 minimum
      chain: CHAINS.BASE,
      protocol: 'compound',
    },
    {
      id: 'yearn-usdc-arb',
      name: 'Yearn USDC (Arbitrum)',
      description: 'Auto-compounding USDC vault',
      apy: 6.8,
      risk: 'medium',
      minAmount: BigInt(100_000_000), // $100 minimum
      chain: CHAINS.ARBITRUM,
      protocol: 'yearn',
    },
  ];
}

/**
 * Execute a swap/bridge via LI.FI
 * Returns transaction hash
 */
export async function executeSwap(
  route: unknown,
  walletClient: unknown // ethers signer or viem wallet client
): Promise<string> {
  try {
    const result = await executeRoute(route as Parameters<typeof executeRoute>[0], {
      // @ts-expect-error - wallet client type varies
      signer: walletClient,
    });
    
    // Get the transaction hash from the result
    // Type varies by LI.FI SDK version, use safe access
    const execution = (result as { steps?: { execution?: { txHash?: string } }[] })?.steps?.[0]?.execution;
    const txHash = execution?.txHash;
    return txHash || '';
  } catch (error) {
    console.error('LI.FI execution error:', error);
    throw error;
  }
}

/**
 * Format USDC amount from cents to human readable
 */
export function formatUSDC(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Convert USDC cents to 6-decimal format
 */
export function centsToUSDC(cents: number): bigint {
  return BigInt(cents) * BigInt(10_000); // cents to 6 decimals
}
