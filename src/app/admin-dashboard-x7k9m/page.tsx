'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  Activity,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  IndianRupee,
  MessageSquare,
  Shield,
  Users,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface OverviewResponse {
  stats: {
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    bookingRevenue: number;
    totalEnquiries: number;
    pendingEnquiries: number;
    salesTeamCount: number;
    adminCount: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'booking' | 'enquiry';
    title: string;
    subtitle: string;
    created_at: string;
  }>;
}

const quickActions = [
  {
    title: 'Review Bookings',
    description: 'Confirm upcoming requests and follow up with customers.',
    href: '/admin-dashboard-x7k9m/bookings',
    icon: BookOpen,
  },
  {
    title: 'Handle Enquiries',
    description: 'Prioritize pending messages and close answered leads.',
    href: '/admin-dashboard-x7k9m/enquiries',
    icon: MessageSquare,
  },
  {
    title: 'Manage Team',
    description: 'View admins, sales members, and recent sign-in activity.',
    href: '/admin-dashboard-x7k9m/team',
    icon: Users,
  },
];

export default function AdminDashboardHomePage() {
  const { session } = useAuth();
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.access_token) {
      return;
    }

    void fetchOverview();
  }, [session?.access_token]);

  const fetchOverview = async () => {
    try {
      const response = await fetch('/api/admin/overview', {
        headers: {
          Authorization: `Bearer ${session?.access_token || ''}`,
        },
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to fetch admin overview.');
      }

      setOverview(payload.data);
    } catch (error) {
      console.error('Error fetching admin overview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = overview?.stats ?? {
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    bookingRevenue: 0,
    totalEnquiries: 0,
    pendingEnquiries: 0,
    salesTeamCount: 0,
    adminCount: 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Internal Admin Control</Badge>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Admin overview and operational control</h1>
          <p className="mt-2 text-slate-600">
            Track bookings, enquiry volume, sales follow-up pressure, and team access from one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/admin-dashboard-x7k9m/team">Open Team Controls</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin-dashboard-x7k9m/bookings">View Booking Queue</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats.totalBookings}</div>
                <p className="text-sm text-slate-600">Total bookings</p>
              </div>
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <p className="mt-3 text-xs text-slate-500">{stats.pendingBookings} pending confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  INR {stats.bookingRevenue.toLocaleString('en-IN')}
                </div>
                <p className="text-sm text-slate-600">Confirmed booking value</p>
              </div>
              <IndianRupee className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-3 text-xs text-slate-500">{stats.confirmedBookings} confirmed bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats.totalEnquiries}</div>
                <p className="text-sm text-slate-600">Customer enquiries</p>
              </div>
              <MessageSquare className="h-5 w-5 text-amber-600" />
            </div>
            <p className="mt-3 text-xs text-slate-500">{stats.pendingEnquiries} need response</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats.salesTeamCount}</div>
                <p className="text-sm text-slate-600">Sales team members</p>
              </div>
              <BriefcaseBusiness className="h-5 w-5 text-violet-600" />
            </div>
            <p className="mt-3 text-xs text-slate-500">{stats.adminCount} admin accounts active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Recent activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-slate-500">Loading recent activity...</p>
            ) : overview?.recentActivity?.length ? (
              <div className="space-y-4">
                {overview.recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{item.subtitle}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {item.type}
                    </Badge>
                    <span className="shrink-0 text-xs text-slate-500">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No recent admin-facing activity found yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Admin control areas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="block rounded-[1.5rem] border border-slate-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="font-semibold text-slate-900">{action.title}</p>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{action.description}</p>
                    </div>
                    <ArrowRight className="mt-2 h-4 w-4 text-slate-400" />
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
