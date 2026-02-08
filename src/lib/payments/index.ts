// ORIEN Payment Rails
// Unified payment interface combining Yellow, Circle/Arc, and LI.FI

export * from './yellow';
export * from './circle';
export * from './lifi';

import { initializeLiFi } from './lifi';
import { initializeCircle } from './circle';

/**
 * Initialize all payment rails
 */
export function initializePaymentRails(): {
  yellow: boolean;
  circle: boolean;
  lifi: boolean;
} {
  const results = {
    yellow: true, // Yellow is WebSocket-based, no init needed
    circle: initializeCircle(),
    lifi: false,
  };

  try {
    initializeLiFi();
    results.lifi = true;
  } catch (error) {
    console.error('LI.FI initialization failed:', error);
  }

  console.log('Payment Rails Status:', results);
  return results;
}

/**
 * Payment flow for ORIEN sessions:
 * 
 * 1. Session Start:
 *    - Agent deposits USDC (or swaps via LI.FI)
 *    - Yellow session created with budget
 * 
 * 2. During Session:
 *    - Each tool execution triggers Yellow micropayment
 *    - Real-time balance tracking
 * 
 * 3. Session End:
 *    - Yellow session closed
 *    - Circle/Arc settlement triggered
 *    - Provider receives 90% of consumed amount
 *    - Platform takes 7% fee
 *    - 3% goes to reserve
 * 
 * 4. Reinvestment (optional):
 *    - Provider can route earnings to DeFi via LI.FI
 */
