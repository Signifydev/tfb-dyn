import Link from 'next/link';
import { PhoneCall } from 'lucide-react';
import { EnquiryForm } from '@/components/travel/EnquiryForm';
import { Button } from '@/components/ui/button';
import { MICE_EXPERT_PHONE, MICE_EXPERT_PHONE_HREF } from '@/lib/mice-content';

export default function ContactPage() {
  return (
    <main className="bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_55%,#f8fafc_100%)] py-16 dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
              Travel Expert Support
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-5xl">
              Let us curate your next trip
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
              Share your destination ideas, travel dates, group size, and preferences. Our team
              will help design a customized tour package that fits your plan and budget.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
              <h2 className="text-2xl font-semibold">What you can ask for</h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-slate-200 md:text-base">
                <p>Customized domestic and international tour packages</p>
                <p>Family trips, honeymoon plans, group departures, and pilgrimages</p>
                <p>Hotel, transport, sightseeing, and activity recommendations</p>
                <p>Flexible options based on your budget and travel style</p>
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-sm font-medium text-sky-100">Need immediate assistance?</p>
                <p className="mt-2 text-lg font-semibold text-white">{MICE_EXPERT_PHONE}</p>
                <Button asChild size="lg" className="mt-4 w-full rounded-xl bg-white text-slate-950 hover:bg-slate-100">
                  <Link href={MICE_EXPERT_PHONE_HREF}>
                    <PhoneCall className="mr-2 h-4 w-4" />
                    Call Expert
                  </Link>
                </Button>
              </div>
            </div>

            <EnquiryForm />
          </div>
        </div>
      </div>
    </main>
  );
}
