// ORIEN Payment & Settlement API
// Handles session settlements and payouts

import { NextRequest, NextResponse } from 'next/server';
import { sessionDb, providerDb } from '@/lib/db';
import { Settlement, ApiResponse, DEFAULT_PAYOUT_SPLIT } from '@/types';
import { randomUUID } from 'crypto';

// In-memory settlements store (would be DB in production)
const settlements: Map<string, Settlement> = new Map();

interface SettlementRequest {
  sessionId: string;
}

// GET /api/payments - List settlements
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  let results: Settlement[];

  if (sessionId) {
    const settlement = Array.from(settlements.values()).find(s => s.sessionId === sessionId);
    results = settlement ? [settlement] : [];
  } else {
    results = Array.from(settlements.values());
  }

  return NextResponse.json({
    success: true,
    data: results,
  });
}

// POST /api/payments/settle - Settle a completed session
export async function POST(request: NextRequest) {
  try {
    const body: SettlementRequest = await request.json();
    const { sessionId } = body;

    // Validate session
    const session = sessionDb.get(sessionId);
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
    const existingSettlement = Array.from(settlements.values()).find(s => s.sessionId === sessionId);
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
    const settlement: Settlement = {
      id: `settlement-${randomUUID()}`,
      sessionId,
      totalAmount,
      providerPayout,
      platformFee,
      reserveAmount,
      settledAt: new Date(),
      // txHash would be set after actual on-chain settlement
    };

    settlements.set(settlement.id, settlement);

    // Update session status
    sessionDb.update(sessionId, { 
      status: 'settled',
      settledAt: new Date(),
    });

    // In production: trigger actual USDC transfer via Arc/Circle
    // For MVP: just return the settlement record

    const response: ApiResponse<Settlement> = {
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
