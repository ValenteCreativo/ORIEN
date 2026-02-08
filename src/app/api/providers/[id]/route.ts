// ORIEN Provider Detail API
import { NextRequest, NextResponse } from 'next/server';
import { providerDb } from '@/lib/db';
import { Provider, ApiResponse } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/providers/[id] - Get provider details
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const provider = await providerDb.get(id);

  if (!provider) {
    const response: ApiResponse<never> = {
      success: false,
      error: 'Provider not found',
    };
    return NextResponse.json(response, { status: 404 });
  }

  const response: ApiResponse<Provider> = {
    success: true,
    data: provider,
  };

  return NextResponse.json(response);
}

// PATCH /api/providers/[id] - Update provider
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const updated = await providerDb.update(id, body);

    if (!updated) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Provider not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Provider> = {
      success: true,
      data: updated,
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    return NextResponse.json(response, { status: 400 });
  }
}

// DELETE /api/providers/[id] - Remove provider
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const deleted = await providerDb.delete(id);

  if (!deleted) {
    const response: ApiResponse<never> = {
      success: false,
      error: 'Provider not found',
    };
    return NextResponse.json(response, { status: 404 });
  }

  const response: ApiResponse<{ deleted: boolean }> = {
    success: true,
    data: { deleted: true },
  };

  return NextResponse.json(response);
}
