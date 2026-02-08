// ORIEN Session Manager API
import { NextRequest, NextResponse } from 'next/server';
import { sessionDb, providerDb, agentDb } from '@/lib/db';
import { Session, ApiResponse } from '@/types';
import { randomUUID } from 'crypto';
import { createYellowSession, centsToUSDC } from '@/lib/payments';

// GET /api/sessions - List sessions
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get('agentId');
  const providerId = searchParams.get('providerId');

  let sessions: Session[];

  if (agentId) {
    sessions = await sessionDb.listByAgent(agentId);
  } else if (providerId) {
    sessions = await sessionDb.listByProvider(providerId);
  } else {
    sessions = await sessionDb.list();
  }

  const response: ApiResponse<Session[]> = {
    success: true,
    data: sessions,
  };

  return NextResponse.json(response);
}

// POST /api/sessions - Create a new session (agent rents compute)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, providerId, budgetAllowance } = body;

    // Validate agent exists
    const agent = await agentDb.get(agentId);
    if (!agent) {
      return NextResponse.json({
        success: false,
        error: 'Agent not found',
      }, { status: 404 });
    }

    // Validate provider exists and is available
    const provider = await providerDb.get(providerId);
    if (!provider) {
      return NextResponse.json({
        success: false,
        error: 'Provider not found',
      }, { status: 404 });
    }

    if (provider.status !== 'online') {
      return NextResponse.json({
        success: false,
        error: 'Provider is not available',
      }, { status: 400 });
    }

    // Create session
    const sessionData = {
      id: `session-${randomUUID()}`,
      agentId,
      providerId,
      status: 'pending' as const,
      budgetAllowance: budgetAllowance || 1000,
      consumed: 0,
      effectiveTimeMs: 0,
    };

    const created = await sessionDb.create(sessionData);

    // Create Yellow session for micropayment tracking
    const yellowSession = createYellowSession(
      agent.walletAddress,
      provider.walletAddress,
      centsToUSDC(budgetAllowance || 1000)
    );
    console.log(`💳 Yellow session created: ${yellowSession.sessionId} for ORIEN session ${created.id}`);

    // Mark provider as busy
    await providerDb.update(providerId, { status: 'busy' });

    const response: ApiResponse<Session & { yellowSessionId: string }> = {
      success: true,
      data: {
        ...created,
        yellowSessionId: yellowSession.sessionId,
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    return NextResponse.json(response, { status: 400 });
  }
}
