// ORIEN Demo Data Initialization
import { NextResponse } from 'next/server';
import { seedDemoData, providerDb, agentDb } from '@/lib/db';

// POST /api/init - Initialize demo data
export async function POST() {
  try {
    await seedDemoData();
    
    const providers = await providerDb.list();
    const agents = await agentDb.list();
    
    return NextResponse.json({
      success: true,
      message: 'Demo data initialized',
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
  const providers = await providerDb.list();
  const agents = await agentDb.list();
  
  return NextResponse.json({
    success: true,
    data: {
      providers: providers.length,
      agents: agents.length,
      initialized: providers.length > 0,
    },
  });
}
