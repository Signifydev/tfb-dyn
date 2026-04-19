import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

function buildMiceMessage(body: Record<string, string>) {
  return [
    'MICE Requirement',
    `Company Name: ${body.companyName}`,
    `Contact Person: ${body.contactPersonName}`,
    `Phone Number: ${body.phoneNumber}`,
    `Email Address: ${body.emailAddress}`,
    `Event Type: ${body.eventType}`,
    `Number of Participants: ${body.numberOfParticipants}`,
    body.preferredDestination ? `Preferred Destination: ${body.preferredDestination}` : '',
    body.budgetRange ? `Budget Range: ${body.budgetRange}` : '',
    body.additionalRequirements ? `Additional Requirements: ${body.additionalRequirements}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const requiredFields = [
      'companyName',
      'contactPersonName',
      'phoneNumber',
      'emailAddress',
      'eventType',
      'numberOfParticipants',
    ] as const;

    const missingField = requiredFields.find((field) => !String(body[field] ?? '').trim());

    if (missingField) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    const message = buildMiceMessage(body);

    const { data, error } = await supabaseAdmin
      .from('enquiries')
      .insert({
        name: body.contactPersonName.trim(),
        email: body.emailAddress.trim(),
        phone: body.phoneNumber.trim(),
        product_slug: 'mice-corporate-lead',
        message,
      })
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to submit MICE requirement.',
      },
      { status: 500 }
    );
  }
}
