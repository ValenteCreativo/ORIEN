// ORIEN Session Detail API
import { NextRequest, NextResponse } from 'next/server';
import { sessionDb, providerDb, executionDb } from '@/lib/db';
import { Session, ApiResponse, DEFAULT_PAYOUT_SPLIT } from '@/types';
import { closeYellowSession, executeSettlement, centsToUSDC } from '@/lib/payments';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/sessions/[id] - Get session details
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const session = sessionDb.get(id);

  if (!session) {
    return NextResponse.json({
      success: false,
      error: 'Session not found',
    }, { status: 404 });
  }

  // Include executions
  const executions = executionDb.listBySession(id);
  const sessionWithExecutions = { ...session, executions };

  const response: ApiResponse<Session> = {
    success: true,
    data: sessionWithExecutions,
  };

  return NextResponse.json(response);
}

// PATCH /api/sessions/[id] - Update session (start, end)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const session = sessionDb.get(id);

    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Session not found',
      }, { status: 404 });
    }

    // Handle session lifecycle
    if (body.action === 'start') {
      if (session.status !== 'pending') {
        return NextResponse.json({
          success: false,
          error: 'Session cannot be started',
        }, { status: 400 });
      }
      const updated = sessionDb.update(id, { status: 'active' });
      return NextResponse.json({ success: true, data: updated });
    }

    if (body.action === 'end') {
      if (session.status !== 'active') {
        return NextResponse.json({
          success: false,
          error: 'Session is not active',
        }, { status: 400 });
      }

      // Close Yellow session and get final totals
      const yellowSessionId = `yellow-${id}`;
      const yellowResult = closeYellowSession(yellowSessionId);
      
      // Calculate payout split
      const totalConsumed = session.consumed;
      const providerPayout = Math.floor(totalConsumed * DEFAULT_PAYOUT_SPLIT.provider / 100);
      const platformFee = Math.floor(totalConsumed * DEFAULT_PAYOUT_SPLIT.platform / 100);
      const reserveAmount = totalConsumed - providerPayout - platformFee;

      // Get provider for settlement
      const provider = providerDb.get(session.providerId);

      // Execute settlement via Circle/Arc
      const settlement = await executeSettlement({
        sessionId: id,
        providerAddress: provider?.walletAddress || '',
        agentAddress: '', // Would come from session
        totalAmount: centsToUSDC(totalConsumed),
        providerPayout: centsToUSDC(providerPayout),
        platformFee: centsToUSDC(platformFee),
        reserveAmount: centsToUSDC(reserveAmount),
      });

      console.log(`💰 Session ${id} settled:`, {
        total: totalConsumed,
        providerPayout,
        platformFee,
        reserveAmount,
        txHash: settlement.txHash,
      });

      const updated = sessionDb.update(id, { 
        status: 'completed',
        endedAt: new Date(),
      });

      // Free up provider
      providerDb.update(session.providerId, { status: 'online' });

      return NextResponse.json({ 
        success: true, 
        data: {
          ...updated,
          settlement: {
            providerPayout,
            platformFee,
            reserveAmount,
            txHash: settlement.txHash,
          },
        },
      });
    }

    // Generic update
    const updated = sessionDb.update(id, body);
    return NextResponse.json({ success: true, data: updated });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 400 });
  }
}
