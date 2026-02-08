// ORIEN Demo Data Initialization
// Call this endpoint to seed demo data for testing

import { NextResponse } from 'next/server';
import { seedDemoData, providerDb, agentDb } from '@/lib/db';

// POST /api/init - Initialize demo data
export async function POST() {
  try {
    seedDemoData();
    
    return NextResponse.json({
      success: true,
      message: 'Demo data initialized',
      data: {
        providers: providerDb.list().length,
        agents: agentDb.list().length,
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// GET /api/init - Check initialization status
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      providers: providerDb.list().length,
      agents: agentDb.list().length,
      initialized: providerDb.list().length > 0,
    },
  });
}
