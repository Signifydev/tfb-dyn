import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

async function buildTeamResponse() {
  const [usersResult, rolesResult] = await Promise.all([
    supabaseAdmin.auth.admin.listUsers(),
    supabaseAdmin.from('user_roles').select('user_id, role'),
  ]);

  if (usersResult.error) {
    throw usersResult.error;
  }

  if (rolesResult.error) {
    throw rolesResult.error;
  }

  const rolesByUser = new Map<string, string[]>();

  for (const roleEntry of rolesResult.data || []) {
    const currentRoles = rolesByUser.get(roleEntry.user_id) ?? [];
    currentRoles.push(roleEntry.role);
    rolesByUser.set(roleEntry.user_id, currentRoles);
  }

  const teamMembers = (usersResult.data.users || [])
    .map((user) => ({
      id: user.id,
      email: user.email || '',
      full_name:
        (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name) ||
        (typeof user.user_metadata?.name === 'string' && user.user_metadata.name) ||
        user.email?.split('@')[0] ||
        'Team member',
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      roles: rolesByUser.get(user.id) ?? [],
    }))
    .filter((user) => user.roles.includes('admin') || user.roles.includes('sales'))
    .sort((a, b) => {
      const aSignIn = a.last_sign_in_at ? new Date(a.last_sign_in_at).getTime() : 0;
      const bSignIn = b.last_sign_in_at ? new Date(b.last_sign_in_at).getTime() : 0;
      return bSignIn - aSignIn;
    });

  return {
    teamMembers,
    stats: {
      total: teamMembers.length,
      admins: teamMembers.filter((member) => member.roles.includes('admin')).length,
      sales: teamMembers.filter((member) => member.roles.includes('sales')).length,
      recentlyActive: teamMembers.filter((member) => {
        if (!member.last_sign_in_at) {
          return false;
        }

        const lastSignInAt = new Date(member.last_sign_in_at).getTime();
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return lastSignInAt >= sevenDaysAgo;
      }).length,
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const { error } = await getAuthenticatedAdmin(request);
    if (error) {
      return NextResponse.json({ error }, { status: error === 'Forbidden' ? 403 : 401 });
    }

    return NextResponse.json({ data: await buildTeamResponse() });
  } catch (error) {
    console.error('Admin team GET API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch team data' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { error } = await getAuthenticatedAdmin(request);
    if (error) {
      return NextResponse.json({ error }, { status: error === 'Forbidden' ? 403 : 401 });
    }

    const body = (await request.json()) as {
      userId?: string;
      role?: 'sales' | 'admin';
      enabled?: boolean;
    };

    if (!body.userId || !body.role || typeof body.enabled !== 'boolean') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.enabled) {
      const { data: existingRole, error: existingRoleError } = await supabaseAdmin
        .from('user_roles')
        .select('user_id, role')
        .eq('user_id', body.userId)
        .eq('role', body.role)
        .maybeSingle();

      if (existingRoleError) {
        throw existingRoleError;
      }

      if (!existingRole) {
        const { error: insertError } = await supabaseAdmin
          .from('user_roles')
          .insert({ user_id: body.userId, role: body.role });

        if (insertError) {
          throw insertError;
        }
      }
    } else {
      const { error: deleteError } = await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', body.userId)
        .eq('role', body.role);

      if (deleteError) {
        throw deleteError;
      }
    }

    return NextResponse.json({ success: true, data: await buildTeamResponse() });
  } catch (error) {
    console.error('Admin team PATCH API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update team role' },
      { status: 500 }
    );
  }
}
