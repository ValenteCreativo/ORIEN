// ORIEN Tool Execution API
// This is where agents execute tools on provider infrastructure

import { NextRequest, NextResponse } from 'next/server';
import { sessionDb, providerDb, executionDb } from '@/lib/db';
import { Execution, ApiResponse, DEFAULT_PAYOUT_SPLIT } from '@/types';
import { randomUUID } from 'crypto';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/sessions/[id]/execute - Execute a tool
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id: sessionId } = await params;

  try {
    const body = await request.json();
    const { toolId, args } = body;

    // Validate session
    const session = sessionDb.get(sessionId);
    if (!session) {
      return NextResponse.json({
        success: false,
        error: 'Session not found',
      }, { status: 404 });
    }

    if (session.status !== 'active') {
      return NextResponse.json({
        success: false,
        error: 'Session is not active',
      }, { status: 400 });
    }

    // Check budget
    if (session.consumed >= session.budgetAllowance) {
      return NextResponse.json({
        success: false,
        error: 'Budget exhausted',
      }, { status: 402 }); // Payment Required
    }

    // Validate provider and tool
    const provider = providerDb.get(session.providerId);
    if (!provider) {
      return NextResponse.json({
        success: false,
        error: 'Provider not found',
      }, { status: 404 });
    }

    const tool = provider.tools.find(t => t.id === toolId);
    if (!tool) {
      return NextResponse.json({
        success: false,
        error: `Tool ${toolId} not available on this provider`,
      }, { status: 400 });
    }

    // Create execution record
    const execution: Execution = {
      id: `exec-${randomUUID()}`,
      sessionId,
      toolId,
      args: args || {},
      status: 'running',
      startedAt: new Date(),
    };

    executionDb.create(execution);

    // Simulate execution (in real implementation, this calls provider node)
    // For MVP: mock execution with random duration
    const simulatedDurationMs = Math.floor(Math.random() * 5000) + 1000; // 1-6 seconds
    
    await new Promise(resolve => setTimeout(resolve, Math.min(simulatedDurationMs, 2000)));

    // Calculate cost (price per minute → cost for this execution)
    const durationMinutes = simulatedDurationMs / 60000;
    const cost = Math.ceil(durationMinutes * provider.pricePerMinute);

    // Update execution
    const completedExecution = executionDb.update(execution.id, {
      status: 'completed',
      endedAt: new Date(),
      durationMs: simulatedDurationMs,
      cost,
      result: { 
        output: `Tool ${tool.name} executed successfully`,
        mock: true,
      },
    });

    // Update session totals
    sessionDb.update(sessionId, {
      consumed: session.consumed + cost,
      effectiveTimeMs: session.effectiveTimeMs + simulatedDurationMs,
    });

    const response: ApiResponse<{
      execution: Execution;
      remainingBudget: number;
      effectiveTimeMs: number;
    }> = {
      success: true,
      data: {
        execution: completedExecution!,
        remainingBudget: session.budgetAllowance - session.consumed - cost,
        effectiveTimeMs: session.effectiveTimeMs + simulatedDurationMs,
      },
    };

    return NextResponse.json(response);

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
