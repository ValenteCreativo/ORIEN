// ORIEN Reinvestment API
// Routes provider earnings to DeFi strategies via LI.FI

import { NextRequest, NextResponse } from 'next/server';
import { getReinvestmentOptions, getSwapToUSDCQuote, CHAINS } from '@/lib/payments/lifi';
import { ApiResponse } from '@/types';

// GET /api/payments/reinvest - List available reinvestment strategies
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const amountParam = searchParams.get('amount');
  const chainParam = searchParams.get('chain');

  const amount = amountParam || '1000000'; // Default $1
  const chain = chainParam ? parseInt(chainParam) : CHAINS.ETHEREUM;

  try {
    const strategies = await getReinvestmentOptions(chain, amount);

    return NextResponse.json({
      success: true,
      data: {
        strategies,
        chain,
        requestedAmount: amount,
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// POST /api/payments/reinvest - Execute reinvestment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { strategyId, amount, providerAddress } = body;

    if (!strategyId || !amount || !providerAddress) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: strategyId, amount, providerAddress',
      }, { status: 400 });
    }

    // For MVP: simulate reinvestment
    // In production: execute via LI.FI

    const mockTxHash = `0x${Array.from({ length: 64 }, () => 
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('')}`;

    return NextResponse.json({
      success: true,
      data: {
        strategyId,
        amount,
        providerAddress,
        txHash: mockTxHash,
        status: 'pending',
        message: 'Reinvestment queued. This is a simulated transaction for MVP.',
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
