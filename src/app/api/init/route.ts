// ORIEN Demo Data Initialization
import { NextResponse } from 'next/server';
import { providerDb, agentDb } from '@/lib/db';

// POST /api/init - Initialize demo data
export async function POST() {
  try {
    // TODO: Implement seedDemoData function
    
    const providers = await providerDb.list();
    const agents = await agentDb.list();
    
    return NextResponse.json({
      success: true,
      message: 'Checking data...',
      data: {
        providers: providers.length,
        agents: agents.length,
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
  try {
    const providers = await providerDb.list();
    const agents = await agentDb.list();
    
    return NextResponse.json({
      success: true,
      data: {
        initialized: providers.length > 0,
        providers: providers.length,
        agents: agents.length,
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
