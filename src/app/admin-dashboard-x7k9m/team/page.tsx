'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Shield, UserCog, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface TeamMember {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
}

interface TeamPayload {
  teamMembers: TeamMember[];
  stats: {
    total: number;
    admins: number;
    sales: number;
    recentlyActive: number;
  };
}

export default function AdminTeamPage() {
  const { session } = useAuth();
  const [team, setTeam] = useState<TeamPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.access_token) {
      return;
    }

    void fetchTeam();
  }, [session?.access_token]);

  const fetchTeam = async () => {
    try {
      const response = await fetch('/api/admin/team', {
        headers: {
          Authorization: `Bearer ${session?.access_token || ''}`,
        },
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to fetch team data.');
      }

      setTeam(payload.data);
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRole = async (userId: string, role: 'sales' | 'admin', enabled: boolean) => {
    setUpdatingKey(`${userId}:${role}`);

    try {
      const response = await fetch('/api/admin/team', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify({ userId, role, enabled }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to update role.');
      }

      setTeam(payload.data);
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setUpdatingKey(null);
    }
  };

  const stats = team?.stats ?? { total: 0, admins: 0, sales: 0, recentlyActive: 0 };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sales Team & Admin Access</h1>
        <p className="text-slate-600">
          Control which internal users have admin or sales permissions and review recent sign-in activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <p className="text-sm text-slate-600">Internal members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.admins}</div>
            <p className="text-sm text-slate-600">Admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-violet-600">{stats.sales}</div>
            <p className="text-sm text-slate-600">Sales team</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-emerald-600">{stats.recentlyActive}</div>
            <p className="text-sm text-slate-600">Active in 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center gap-3 p-6 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading team access...
            </div>
          ) : team?.teamMembers?.length ? (
            <div className="divide-y divide-slate-200">
              {team.teamMembers.map((member) => {
                const isAdmin = member.roles.includes('admin');
                const isSales = member.roles.includes('sales');

                return (
                  <div key={member.id} className="flex flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-semibold text-slate-900">{member.full_name}</p>
                        {isAdmin ? (
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                            <Shield className="mr-1 h-3 w-3" />
                            Admin
                          </Badge>
                        ) : null}
                        {isSales ? (
                          <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">
                            <Users className="mr-1 h-3 w-3" />
                            Sales
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{member.email}</p>
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                        <span>
                          Joined {formatDistanceToNow(new Date(member.created_at), { addSuffix: true })}
                        </span>
                        <span>
                          {member.last_sign_in_at
                            ? `Last sign-in ${formatDistanceToNow(new Date(member.last_sign_in_at), { addSuffix: true })}`
                            : 'No recent sign-in recorded'}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-slate-900">Admin access</p>
                            <p className="text-xs text-slate-500">Full dashboard and control rights</p>
                          </div>
                          <Switch
                            checked={isAdmin}
                            disabled={updatingKey === `${member.id}:admin`}
                            onCheckedChange={(checked) => updateRole(member.id, 'admin', checked)}
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-slate-900">Sales team access</p>
                            <p className="text-xs text-slate-500">Lead tracking and internal team visibility</p>
                          </div>
                          <Switch
                            checked={isSales}
                            disabled={updatingKey === `${member.id}:sales`}
                            onCheckedChange={(checked) => updateRole(member.id, 'sales', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-slate-500">
              No admin or sales members found yet. Assign roles in `user_roles` to start managing the internal team.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-start gap-3 p-5 text-sm text-slate-600">
          <UserCog className="mt-0.5 h-5 w-5 text-blue-600" />
          <p>
            This team screen keeps credentials secure by using Supabase Auth accounts and role checks on the server.
            No login password is stored in the frontend code.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
