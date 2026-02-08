// ORIEN Payment Quote API
// Get quotes for paying with any token (converts to USDC via LI.FI)

import { NextRequest, NextResponse } from 'next/server';
import { getSwapToUSDCQuote, CHAINS, USDC_ADDRESSES } from '@/lib/payments/lifi';

// GET /api/payments/quote - Get swap quote to USDC
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const fromChain = parseInt(searchParams.get('fromChain') || String(CHAINS.ETHEREUM));
  const fromToken = searchParams.get('fromToken');
  const fromAmount = searchParams.get('fromAmount');
  const toChain = parseInt(searchParams.get('toChain') || String(CHAINS.ETHEREUM));

  if (!fromToken || !fromAmount) {
    return NextResponse.json({
      success: false,
      error: 'Missing required params: fromToken, fromAmount',
    }, { status: 400 });
  }

  try {
    const quote = await getSwapToUSDCQuote(
      fromChain,
      fromToken,
      fromAmount,
      toChain
    );

    if (!quote) {
      return NextResponse.json({
        success: false,
        error: 'No route found for this swap',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...quote,
        // Don't expose raw route to frontend
        route: undefined,
        routeId: Buffer.from(JSON.stringify(quote.route)).toString('base64').slice(0, 32),
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
