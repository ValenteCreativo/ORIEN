// ORIEN Metering Engine API
import { NextRequest, NextResponse } from 'next/server';
import { sessionDb, executionDb } from '@/lib/db';
import { ApiResponse } from '@/types';

interface MeteringReport {
  sessionId: string;
  totalExecutions: number;
  effectiveTimeMs: number;
  totalCost: number;
  executions: {
    id: string;
    toolId: string;
    durationMs: number;
    cost: number;
    status: string;
  }[];
}

// GET /api/metering?sessionId=xxx - Get metering report for a session
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({
      success: false,
      error: 'sessionId is required',
    }, { status: 400 });
  }

  const session = await sessionDb.get(sessionId);
  if (!session) {
    return NextResponse.json({
      success: false,
      error: 'Session not found',
    }, { status: 404 });
  }

  const executions = await executionDb.listBySession(sessionId);

  const report: MeteringReport = {
    sessionId,
    totalExecutions: executions.length,
    effectiveTimeMs: session.effectiveTimeMs,
    totalCost: session.consumed,
    executions: executions.map(e => ({
      id: e.id,
      toolId: e.toolId,
      durationMs: e.durationMs || 0,
      cost: e.cost || 0,
      status: e.status,
    })),
  };

  const response: ApiResponse<MeteringReport> = {
    success: true,
    data: report,
  };

  return NextResponse.json(response);
}
