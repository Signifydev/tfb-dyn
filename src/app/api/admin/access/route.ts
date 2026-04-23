import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

function extractBearerToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.replace('Bearer ', '');
}

export async function GET(request: NextRequest) {
  try {
    const token = extractBearerToken(request);

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      data: {
        isAdmin: Boolean(data),
        userId: user.id,
        email: user.email || '',
      },
    });
  } catch (error) {
    console.error('Admin access API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to verify admin access' },
      { status: 500 }
    );
  }
}
