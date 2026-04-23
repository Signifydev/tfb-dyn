import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

function extractValue(message: string, label: string) {
  const line = message
    .split('\n')
    .find((entry) => entry.toLowerCase().startsWith(`${label.toLowerCase()}:`));

  return line ? line.split(':').slice(1).join(':').trim() : '';
}

function normalizeBookingStatus(status: string | null) {
  switch (status) {
    case 'replied':
      return 'confirmed';
    case 'closed':
      return 'cancelled';
    case 'pending':
    default:
      return 'pending';
  }
}

function normalizeBookingEntry(entry: {
  id: string;
  created_at: string;
  email: string | null;
  message: string;
  name: string | null;
  phone: string | null;
  product_slug: string | null;
  status: string | null;
}) {
  const totalPriceValue = extractValue(entry.message, 'Total package value')
    .replace('INR', '')
    .replace(/,/g, '')
    .trim();

  return {
    id: entry.id,
    title: entry.product_slug || 'Booking Request',
    customer_name: entry.name || 'Unknown Customer',
    customer_email: entry.email || '',
    created_at: entry.created_at,
    total_price: Number(totalPriceValue) || 0,
    status: normalizeBookingStatus(entry.status),
  };
}

function normalizeEnquiryStatus(status: string | null) {
  return status || 'pending';
}

export async function GET(request: NextRequest) {
  try {
    const { error } = await getAuthenticatedAdmin(request);
    if (error) {
      return NextResponse.json({ error }, { status: error === 'Forbidden' ? 403 : 401 });
    }

    const [bookingsResult, enquiriesResult, rolesResult] = await Promise.all([
      supabaseAdmin
        .from('enquiries')
        .select('*')
        .not('product_slug', 'is', null)
        .ilike('message', 'Booking Request%')
        .order('created_at', { ascending: false }),
      supabaseAdmin
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false }),
      supabaseAdmin
        .from('user_roles')
        .select('user_id, role'),
    ]);

    if (bookingsResult.error) {
      throw bookingsResult.error;
    }

    if (enquiriesResult.error) {
      throw enquiriesResult.error;
    }

    if (rolesResult.error) {
      throw rolesResult.error;
    }

    const bookings = (bookingsResult.data || []).map(normalizeBookingEntry);
    const rawEnquiries = enquiriesResult.data || [];
    const nonBookingEnquiries = rawEnquiries.filter(
      (item) => !(item.product_slug && item.message?.startsWith('Booking Request'))
    );

    const teamRoles = rolesResult.data || [];
    const salesTeamMembers = new Set(teamRoles.filter((entry) => entry.role === 'sales').map((entry) => entry.user_id));
    const adminMembers = new Set(teamRoles.filter((entry) => entry.role === 'admin').map((entry) => entry.user_id));

    const recentActivity = [
      ...bookings.slice(0, 4).map((booking) => ({
        id: `booking-${booking.id}`,
        type: 'booking',
        title: booking.title,
        subtitle: `${booking.customer_name} • ${booking.status}`,
        created_at: booking.created_at,
      })),
      ...nonBookingEnquiries.slice(0, 4).map((enquiry) => ({
        id: `enquiry-${enquiry.id}`,
        type: 'enquiry',
        title: enquiry.name || 'Website enquiry',
        subtitle: `${enquiry.product_slug || 'General enquiry'} • ${normalizeEnquiryStatus(enquiry.status)}`,
        created_at: enquiry.created_at,
      })),
    ]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 8);

    return NextResponse.json({
      data: {
        stats: {
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((booking) => booking.status === 'pending').length,
          confirmedBookings: bookings.filter((booking) => booking.status === 'confirmed').length,
          bookingRevenue: bookings
            .filter((booking) => booking.status === 'confirmed')
            .reduce((sum, booking) => sum + booking.total_price, 0),
          totalEnquiries: nonBookingEnquiries.length,
          pendingEnquiries: nonBookingEnquiries.filter((enquiry) => normalizeEnquiryStatus(enquiry.status) === 'pending').length,
          salesTeamCount: salesTeamMembers.size,
          adminCount: adminMembers.size,
        },
        recentActivity,
      },
    });
  } catch (error) {
    console.error('Admin overview API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch admin overview' },
      { status: 500 }
    );
  }
}
