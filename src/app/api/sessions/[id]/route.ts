// ORIEN Session Detail API
import { NextRequest, NextResponse } from 'next/server';
import { sessionDb, providerDb, executionDb } from '@/lib/db';
import { Session, ApiResponse } from '@/types';

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
      const updated = sessionDb.update(id, { 
        status: 'completed',
        endedAt: new Date(),
      });

      // Free up provider
      providerDb.update(session.providerId, { status: 'online' });

      return NextResponse.json({ success: true, data: updated });
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
