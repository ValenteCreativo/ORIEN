// ORIEN Payment & Settlement API
import { NextRequest, NextResponse } from 'next/server';
import { sessionDb } from '@/lib/db';
import { prisma } from '@/lib/db/prisma';
import { ApiResponse, DEFAULT_PAYOUT_SPLIT } from '@/types';
import { randomUUID } from 'crypto';

interface SettlementRequest {
  sessionId: string;
}

// GET /api/payments - List settlements
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  const settlements = await prisma.settlement.findMany({
    where: sessionId ? { sessionId } : undefined,
    orderBy: { settledAt: 'desc' },
  });

  return NextResponse.json({
    success: true,
    data: settlements.map(s => ({
      id: s.id,
      sessionId: s.sessionId,
      totalAmount: s.totalAmount,
      providerPayout: s.providerPayout,
      platformFee: s.platformFee,
      reserveAmount: s.reserveAmount,
      txHash: s.txHash,
      settledAt: s.settledAt,
    })),
  });
}

// POST /api/payments - Settle a completed session
export async function POST(request: NextRequest) {
  try {
    const body: SettlementRequest = await request.json();
    const { sessionId } = body;

    // Validate session
    const session = await sessionDb.get(sessionId);
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Session not found',
      }, { status: 404 });
    }

    if (session.status === 'settled') {
      return NextResponse.json({
        success: false,
        error: 'Session already settled',
      }, { status: 400 });
    }

    if (session.status !== 'completed') {
      return NextResponse.json({
        success: false,
        error: 'Session must be completed before settlement',
      }, { status: 400 });
    }

    // Check if already settled
    const existingSettlement = await prisma.settlement.findUnique({
      where: { sessionId },
    });
    if (existingSettlement) {
      return NextResponse.json({
        success: false,
        error: 'Session already settled',
      }, { status: 400 });
    }

    // Calculate payout split
    const totalAmount = session.consumed;
    const providerPayout = Math.floor(totalAmount * DEFAULT_PAYOUT_SPLIT.provider / 100);
    const platformFee = Math.floor(totalAmount * DEFAULT_PAYOUT_SPLIT.platform / 100);
    const reserveAmount = totalAmount - providerPayout - platformFee;

    // Create settlement record
    const settlement = await prisma.settlement.create({
      data: {
        id: `settlement-${randomUUID()}`,
        sessionId,
        providerId: session.providerId,
        totalAmount,
        providerPayout,
        platformFee,
        reserveAmount,
        // txHash would be set after actual on-chain settlement
      },
    });

    // Update session status
    await sessionDb.update(sessionId, { 
      status: 'settled',
      settledAt: new Date(),
    });

    const response: ApiResponse<typeof settlement> = {
      success: true,
      data: settlement,
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
