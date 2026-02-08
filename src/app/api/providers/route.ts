// ORIEN Provider Registry API
import { NextRequest, NextResponse } from 'next/server';
import { providerDb } from '@/lib/db';
import { Provider, ApiResponse } from '@/types';
import { randomUUID } from 'crypto';

// GET /api/providers - List all providers
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const availableOnly = searchParams.get('available') === 'true';

  const providers = availableOnly 
    ? await providerDb.listAvailable() 
    : await providerDb.list();

  const response: ApiResponse<Provider[]> = {
    success: true,
    data: providers,
  };

  return NextResponse.json(response);
}

// POST /api/providers - Register a new provider
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const providerData = {
      id: `provider-${randomUUID()}`,
      name: body.name,
      walletAddress: body.walletAddress,
      status: 'offline' as const,
      pricePerMinute: body.pricePerMinute || 100,
      tools: body.tools || [],
      reputation: {
        uptime: 100,
        completedSessions: 0,
        disputes: 0,
      },
    };

    const created = await providerDb.create(providerData);

    const response: ApiResponse<Provider> = {
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
