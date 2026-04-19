import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

interface BookingRequestPayload {
  product_slug?: string;
  travel_date?: string;
  travellers?: number;
  total_price?: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  special_requests?: string | null;
}

function extractBearerToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.replace('Bearer ', '');
}

async function getAuthenticatedUser(request: NextRequest) {
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

  return { user, error: null as const };
}

async function isAdminUser(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

function buildBookingMessage(body: BookingRequestPayload) {
  return [
    'Booking Request',
    body.travel_date ? `Travel date: ${body.travel_date}` : '',
    body.travellers ? `Travellers: ${body.travellers}` : '',
    typeof body.total_price === 'number'
      ? `Total package value: INR ${body.total_price.toLocaleString('en-IN')}`
      : '',
    body.special_requests ? `Customer notes: ${body.special_requests}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function extractValue(message: string, label: string) {
  const line = message
    .split('\n')
    .find((entry) => entry.toLowerCase().startsWith(`${label.toLowerCase()}:`));

  return line ? line.split(':').slice(1).join(':').trim() : '';
}

function normalizeStatus(status: string | null) {
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

function denormalizeStatus(status: string) {
  switch (status) {
    case 'confirmed':
      return 'replied';
    case 'cancelled':
      return 'closed';
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
    product_slug: entry.product_slug || '',
    travel_date: extractValue(entry.message, 'Travel date') || entry.created_at,
    travellers: Number(extractValue(entry.message, 'Travellers')) || 1,
    total_price: Number(totalPriceValue) || 0,
    status: normalizeStatus(entry.status),
    created_at: entry.created_at,
    customer_name: entry.name || '',
    customer_email: entry.email || '',
    customer_phone: entry.phone || '',
    special_requests: extractValue(entry.message, 'Customer notes'),
  };
}

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(request);
    if (authError || !user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const body = (await request.json()) as BookingRequestPayload;

    if (
      !body.product_slug ||
      !body.travel_date ||
      !body.travellers ||
      !body.customer_name?.trim() ||
      !body.customer_email?.trim() ||
      !body.customer_phone?.trim()
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error: insertError } = await supabaseAdmin
      .from('enquiries')
      .insert({
        name: body.customer_name.trim(),
        email: body.customer_email.trim(),
        phone: body.customer_phone.trim(),
        product_slug: body.product_slug,
        message: buildBookingMessage(body),
      })
      .select()
      .maybeSingle();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create booking request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(request);
    if (authError || !user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const isAdminView = request.nextUrl.searchParams.get('admin') === '1';
    const adminAccess = isAdminView ? await isAdminUser(user.id) : false;

    let query = supabaseAdmin
      .from('enquiries')
      .select('*')
      .not('product_slug', 'is', null)
      .ilike('message', 'Booking Request%')
      .order('created_at', { ascending: false });

    if (!adminAccess) {
      query = query.eq('email', user.email ?? '');
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const normalized = (data || []).map(normalizeBookingEntry);

    return NextResponse.json({ data: normalized });
  } catch (error) {
    console.error('Bookings GET API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(request);
    if (authError || !user) {
      return NextResponse.json({ error: authError }, { status: 401 });
    }

    const adminAccess = await isAdminUser(user.id);
    if (!adminAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = (await request.json()) as { id?: string; status?: string };
    if (!body.id || !body.status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('enquiries')
      .update({ status: denormalizeStatus(body.status) })
      .eq('id', body.id)
      .select('*')
      .maybeSingle();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data: data ? normalizeBookingEntry(data) : null });
  } catch (error) {
    console.error('Bookings PATCH API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update booking status' },
      { status: 500 }
    );
  }
}
