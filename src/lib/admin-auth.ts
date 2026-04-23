import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

function extractBearerToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.replace('Bearer ', '');
}

export async function getAuthenticatedAdmin(request: NextRequest) {
  const token = extractBearerToken(request);

  if (!token) {
    return { user: null, error: 'Unauthorized' as const };
  }

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return { user: null, error: 'Invalid token' as const };
  }

  const { data: roleData, error: roleError } = await supabaseAdmin
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .maybeSingle();

  if (roleError) {
    throw roleError;
  }

  if (!roleData) {
    return { user: null, error: 'Forbidden' as const };
  }

  return { user, error: null as const };
}
