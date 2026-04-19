'use client';

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MICE_FORM_OPTIONS } from '@/lib/mice-content';

interface MiceLeadFormState {
  companyName: string;
  contactPersonName: string;
  phoneNumber: string;
  emailAddress: string;
  eventType: string;
  numberOfParticipants: string;
  preferredDestination: string;
  budgetRange: string;
  additionalRequirements: string;
}

const initialFormState: MiceLeadFormState = {
  companyName: '',
  contactPersonName: '',
  phoneNumber: '',
  emailAddress: '',
  eventType: '',
  numberOfParticipants: '',
  preferredDestination: '',
  budgetRange: '',
  additionalRequirements: '',
};

export function MiceLeadForm() {
  const [form, setForm] = useState<MiceLeadFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateField =
    (field: keyof MiceLeadFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (
      !form.companyName.trim() ||
      !form.contactPersonName.trim() ||
      !form.phoneNumber.trim() ||
      !form.emailAddress.trim() ||
      !form.eventType.trim() ||
      !form.numberOfParticipants.trim()
    ) {
      setError('Please complete all required fields before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/mice-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to submit MICE requirement.');
      }

      setSuccess('Your requirement has been received. Our team will share a customized proposal soon.');
      setForm(initialFormState);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Something went wrong while submitting your requirement.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="proposal-form" className="py-14 md:py-18">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
              Request a Proposal
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50 md:text-4xl">
              Share your requirement and get a customized corporate solution
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
              Tell us what you are planning, the expected group size, and the destination or budget
              direction. We will review the brief and respond with a tailored proposal.
            </p>
          </div>

          <Card className="rounded-[2rem] border-0 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.12)] dark:bg-slate-900/90">
            <CardContent className="p-6 md:p-8">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    value={form.companyName}
                    onChange={updateField('companyName')}
                    placeholder="Company Name *"
                  />
                  <Input
                    value={form.contactPersonName}
                    onChange={updateField('contactPersonName')}
                    placeholder="Contact Person Name *"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    value={form.phoneNumber}
                    onChange={updateField('phoneNumber')}
                    placeholder="Phone Number *"
                  />
                  <Input
                    type="email"
                    value={form.emailAddress}
                    onChange={updateField('emailAddress')}
                    placeholder="Email Address *"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <select
                    value={form.eventType}
                    onChange={updateField('eventType')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
                  >
                    <option value="">Event Type *</option>
                    {MICE_FORM_OPTIONS.eventTypes.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <Input
                    value={form.numberOfParticipants}
                    onChange={updateField('numberOfParticipants')}
                    placeholder="Number of Participants *"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    value={form.preferredDestination}
                    onChange={updateField('preferredDestination')}
                    placeholder="Preferred Destination"
                  />

                  <select
                    value={form.budgetRange}
                    onChange={updateField('budgetRange')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
                  >
                    <option value="">Budget Range</option>
                    {MICE_FORM_OPTIONS.budgetRanges.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <Textarea
                  value={form.additionalRequirements}
                  onChange={updateField('additionalRequirements')}
                  placeholder="Additional Requirements"
                  className="min-h-[130px]"
                />

                <Button type="submit" className="w-full rounded-xl" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting
                    </>
                  ) : (
                    <>
                      Get Custom Proposal
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
