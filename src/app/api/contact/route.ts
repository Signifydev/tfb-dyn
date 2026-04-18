import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

interface BookingDetails {
  package_title?: string;
  package_slug?: string;
  travel_date?: string;
  travellers?: number;
  total_price?: string;
  location?: string;
  duration?: string;
}

function buildStoredMessage(message: string, bookingDetails?: BookingDetails) {
  if (!bookingDetails?.package_title) {
    return message;
  }

  return [
    'Booking Request',
    `Package: ${bookingDetails.package_title}`,
    bookingDetails.package_slug ? `Slug: ${bookingDetails.package_slug}` : '',
    bookingDetails.travel_date ? `Travel date: ${bookingDetails.travel_date}` : '',
    bookingDetails.travellers ? `Travellers: ${bookingDetails.travellers}` : '',
    bookingDetails.total_price ? `Total package value: ${bookingDetails.total_price}` : '',
    bookingDetails.location ? `Location: ${bookingDetails.location}` : '',
    bookingDetails.duration ? `Duration: ${bookingDetails.duration}` : '',
    '',
    message,
  ]
    .filter(Boolean)
    .join('\n');
}

async function sendNotificationEmail(params: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  productSlug?: string;
  bookingDetails?: BookingDetails;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const notificationEmail = process.env.BOOKING_NOTIFICATION_EMAIL;

  if (!resendApiKey || !fromEmail || !notificationEmail) {
    return { sent: false, skipped: true };
  }

  const emailSubject = params.bookingDetails?.package_title
    ? `New booking lead: ${params.bookingDetails.package_title}`
    : `New enquiry from ${params.name}`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin-bottom: 12px;">${emailSubject}</h2>
      <p><strong>Name:</strong> ${params.name}</p>
      <p><strong>Email:</strong> ${params.email}</p>
      <p><strong>Phone:</strong> ${params.phone || 'Not provided'}</p>
      <p><strong>Product Slug:</strong> ${params.productSlug || 'Not provided'}</p>
      ${
        params.bookingDetails?.package_title
          ? `
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid #e2e8f0;" />
      <h3 style="margin-bottom: 12px;">Booking Details</h3>
      <p><strong>Package:</strong> ${params.bookingDetails.package_title}</p>
      <p><strong>Travel Date:</strong> ${params.bookingDetails.travel_date || 'Not selected yet'}</p>
      <p><strong>Travellers:</strong> ${params.bookingDetails.travellers || 'Not provided'}</p>
      <p><strong>Total Price:</strong> ${params.bookingDetails.total_price || 'Not provided'}</p>
      <p><strong>Location:</strong> ${params.bookingDetails.location || 'Not provided'}</p>
      <p><strong>Duration:</strong> ${params.bookingDetails.duration || 'Not provided'}</p>
      `
          : ''
      }
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid #e2e8f0;" />
      <h3 style="margin-bottom: 12px;">Customer Message</h3>
      <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${params.message}</pre>
    </div>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [notificationEmail],
      reply_to: params.email,
      subject: emailSubject,
      html: emailHtml,
    }),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Failed to send email notification: ${payload}`);
  }

  return { sent: true, skipped: false };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, product_slug, booking_details } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Insert enquiry
    const storedMessage = buildStoredMessage(message, booking_details);

    const { data, error } = await supabaseAdmin
      .from('enquiries')
      .insert({
        name,
        email,
        phone: phone || null,
        message: storedMessage,
        product_slug: product_slug || null,
      })
      .select()
      .maybeSingle();

    if (error) throw error;

    const emailStatus = await sendNotificationEmail({
      name,
      email,
      phone,
      message,
      productSlug: product_slug,
      bookingDetails: booking_details,
    });

    return NextResponse.json({
      success: true,
      data,
      email: emailStatus,
    });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}
