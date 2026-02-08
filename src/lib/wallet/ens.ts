// ENS Resolution utilities
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

/**
 * Resolve ENS name to address
 */
export async function resolveENS(name: string): Promise<string | null> {
  try {
    const address = await publicClient.getEnsAddress({
      name: normalize(name),
    });
    return address;
  } catch {
    return null;
  }
}

/**
 * Get ENS name for address (reverse lookup)
 */
export async function getENSName(address: `0x${string}`): Promise<string | null> {
  try {
    const name = await publicClient.getEnsName({
      address,
    });
    return name;
  } catch {
    return null;
  }
}

/**
 * Get ENS avatar
 */
export async function getENSAvatar(name: string): Promise<string | null> {
  try {
    const avatar = await publicClient.getEnsAvatar({
      name: normalize(name),
    });
    return avatar;
  } catch {
    return null;
  }
}

/**
 * Format address with ENS or truncated
 */
export function formatAddress(address: string, ensName?: string | null): string {
  if (ensName) return ensName;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
