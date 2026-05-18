import Link from 'next/link';
import { Clock, Mail, MapPin, PhoneCall } from 'lucide-react';
import { EnquiryForm } from '@/components/travel/EnquiryForm';
import { Button } from '@/components/ui/button';
import { MICE_EXPERT_PHONE, MICE_EXPERT_PHONE_HREF } from '@/lib/mice-content';

const CONTACT_EMAIL = 'info@travelforbenefits.com';
const CONTACT_ADDRESS = 'Sahastradhara Road, Dehradun, U.K India.';

export default function ContactPage() {
  const contactItems = [
    {
      icon: PhoneCall,
      label: 'Phone',
      value: MICE_EXPERT_PHONE,
      href: MICE_EXPERT_PHONE_HREF,
    },
    {
      icon: Mail,
      label: 'Email',
      value: CONTACT_EMAIL,
      href: `mailto:${CONTACT_EMAIL}`,
    },
    {
      icon: MapPin,
      label: 'Office',
      value: CONTACT_ADDRESS,
      href: 'https://maps.google.com/?q=Sahastradhara%20Road%2C%20Dehradun%2C%20Uttarakhand%2C%20India',
    },
    {
      icon: Clock,
      label: 'Hours',
      value: 'Mon-Sat: 9AM - 8PM',
      href: null,
    },
  ];

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
            <section className="rounded-[1.75rem] bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.22)] sm:p-8">
              <h2 className="text-2xl font-semibold">Contact information</h2>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                Reach out for customized tour packages, family trips, honeymoon plans, group
                departures, pilgrimages, hotels, transport, sightseeing, and activity support.
              </p>

              <div className="mt-7 space-y-4">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex items-start gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm transition hover:bg-white/15">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-700">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-sky-100">{item.label}</span>
                        <span className="mt-1 block text-sm leading-6 text-white md:text-base">
                          {item.value}
                        </span>
                      </span>
                    </div>
                  );

                  return item.href ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div key={item.label}>{content}</div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-sm font-medium text-sky-100">Need immediate assistance?</p>
                <p className="mt-2 text-lg font-semibold text-white">{MICE_EXPERT_PHONE}</p>
                <Button
                  asChild
                  size="lg"
                  className="mt-4 w-full rounded-xl bg-white text-slate-950 hover:bg-slate-100"
                >
                  <Link href={MICE_EXPERT_PHONE_HREF}>
                    <PhoneCall className="mr-2 h-4 w-4" />
                    Call Expert
                  </Link>
                </Button>
              </div>
            </section>

            <EnquiryForm />
          </div>
        </div>
      </div>
    </main>
  );
}
