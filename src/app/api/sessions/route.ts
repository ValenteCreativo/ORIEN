// ORIEN Session Manager API
import { NextRequest, NextResponse } from 'next/server';
import { sessionDb, providerDb, agentDb } from '@/lib/db';
import { Session, ApiResponse } from '@/types';
import { randomUUID } from 'crypto';

// GET /api/sessions - List sessions
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get('agentId');
  const providerId = searchParams.get('providerId');

  let sessions: Session[];

  if (agentId) {
    sessions = sessionDb.listByAgent(agentId);
  } else if (providerId) {
    sessions = sessionDb.listByProvider(providerId);
  } else {
    sessions = sessionDb.list();
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
    const agent = agentDb.get(agentId);
    if (!agent) {
      return NextResponse.json({
        success: false,
        error: 'Agent not found',
      }, { status: 404 });
    }

    // Validate provider exists and is available
    const provider = providerDb.get(providerId);
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
    const session: Session = {
      id: `session-${randomUUID()}`,
      agentId,
      providerId,
      status: 'pending',
      budgetAllowance: budgetAllowance || 1000, // default $10
      consumed: 0,
      effectiveTimeMs: 0,
      executions: [],
      createdAt: new Date(),
    };

    const created = sessionDb.create(session);

    // Mark provider as busy
    providerDb.update(providerId, { status: 'busy' });

    const response: ApiResponse<Session> = {
      success: true,
      data: created,
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
