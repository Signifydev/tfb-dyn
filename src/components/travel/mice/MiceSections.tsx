import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarRange,
  CircleCheckBig,
  Handshake,
  Hotel,
  MapPinned,
  Mic2,
  Route,
  SearchCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  MICE_DESTINATIONS,
  MICE_EXPLAINERS,
  MICE_EXPERT_PHONE,
  MICE_EXPERT_PHONE_HREF,
  MICE_INDUSTRIES,
  MICE_PROCESS,
  MICE_SERVICES,
  MICE_USPS,
} from '@/lib/mice-content';

const serviceIcons = [SearchCheck, Hotel, CalendarRange, Route, Users, Mic2];

export function MiceHeroSection() {
  return (
    <section className="relative overflow-hidden pb-14 pt-[110px] md:pb-18 md:pt-[130px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.2),transparent_22%),linear-gradient(180deg,#eff6ff_0%,#f8fafc_44%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.14),transparent_22%),linear-gradient(180deg,#020617_0%,#0f172a_48%,#111827_100%)]" />
      <div className="container relative mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Badge className="border-0 bg-sky-100 px-3 py-1 text-sky-800 hover:bg-sky-100 dark:bg-sky-500/15 dark:text-sky-200">
              MICE Planning & Coordination
            </Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-slate-950 dark:text-slate-50 md:text-6xl">
              Corporate travel &amp; event solutions
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
              We plan and manage meetings, incentives, conferences, and exhibitions
              for businesses that need dependable coordination, faster proposals, and
              practical execution support.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-xl">
                <Link href="#proposal-form">
                  Request a Proposal
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <a href={MICE_EXPERT_PHONE_HREF}>Talk to an Expert</a>
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 dark:border-slate-700 dark:bg-slate-900/80">
                Dedicated account support
              </span>
              <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 dark:border-slate-700 dark:bg-slate-900/80">
                Partner-led ticketing on request
              </span>
              <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 dark:border-slate-700 dark:bg-slate-900/80">
                Fast proposal turnaround
              </span>
            </div>
          </div>

          <Card className="overflow-hidden rounded-[2rem] border-0 bg-slate-950 text-white shadow-[0_32px_90px_rgba(15,23,42,0.28)]">
            <CardContent className="p-0">
              <div className="relative overflow-hidden p-7 md:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.34),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.18),transparent_28%)]" />
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
                    Built for B2B outcomes
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold md:text-3xl">
                    One partner for venue, stay, vendor, and execution alignment
                  </h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <Building2 className="h-5 w-5 text-sky-300" />
                      <p className="mt-3 font-medium">Venue-first planning</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Business-fit venue options with negotiation support and commercial clarity.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <Handshake className="h-5 w-5 text-amber-300" />
                      <p className="mt-3 font-medium">Coordination-led delivery</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Hotels, transport, vendors, and local execution handled through one stream.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <p className="text-sm font-medium text-sky-200">Ticketing support note</p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      Flights and train ticketing are not handled directly by TFB, but can be coordinated
                      through trusted partners whenever your program requires it.
                    </p>
                  </div>
                  <p className="mt-6 text-sm text-slate-300">
                    Need immediate guidance? Call <a className="font-semibold text-white" href={MICE_EXPERT_PHONE_HREF}>{MICE_EXPERT_PHONE}</a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export function MiceAboutSection() {
  return (
    <section className="py-14 md:py-18">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
            About MICE
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50 md:text-4xl">
            A business-focused format for corporate travel and event programs
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
            MICE stands for Meetings, Incentives, Conferences, and Exhibitions. For companies,
            it is less about leisure travel and more about planning structured business programs
            with the right venue, logistics, hospitality, and execution support.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {MICE_EXPLAINERS.map((item) => (
            <Card key={item.title} className="rounded-[1.5rem] border-slate-200 bg-white/90 shadow-sm dark:border-slate-700 dark:bg-slate-900/85">
              <CardContent className="p-6">
                <p className="text-lg font-semibold text-slate-950 dark:text-slate-50">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MiceServicesSection() {
  return (
    <section className="bg-slate-50 py-14 dark:bg-slate-950/50 md:py-18">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
              Our Services
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50 md:text-4xl">
              Practical MICE support built around coordination, control, and delivery
            </h2>
          </div>
          <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
            Ticketing for flights and trains is coordinated through partners on request.
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {MICE_SERVICES.map((service, index) => {
            const Icon = serviceIcons[index] || BriefcaseBusiness;

            return (
              <Card key={service} className="rounded-[1.5rem] border-0 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:bg-slate-900/90">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-slate-950 dark:text-slate-50">{service}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function MiceDestinationsSection() {
  return (
    <section className="py-14 md:py-18">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
            Destinations Covered
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50 md:text-4xl">
            Corporate programs across high-demand domestic and international locations
          </h2>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="rounded-[1.75rem] border-0 bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_100%)] shadow-sm dark:bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <MapPinned className="h-5 w-5 text-sky-700 dark:text-sky-300" />
                <h3 className="text-xl font-semibold text-slate-950 dark:text-slate-50">Domestic</h3>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {MICE_DESTINATIONS.domestic.map((destination) => (
                  <span key={destination} className="rounded-full border border-sky-200 bg-white px-4 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    {destination}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border-0 bg-[linear-gradient(180deg,#fff8eb_0%,#ffffff_100%)] shadow-sm dark:bg-[linear-gradient(180deg,#1f2937_0%,#111827_100%)]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                <h3 className="text-xl font-semibold text-slate-950 dark:text-slate-50">International</h3>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {MICE_DESTINATIONS.international.map((destination) => (
                  <span key={destination} className="rounded-full border border-amber-200 bg-white px-4 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    {destination}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export function MiceWhyChooseSection() {
  return (
    <section className="bg-slate-50 py-14 dark:bg-slate-950/50 md:py-18">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
            Why Choose TFB
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50 md:text-4xl">
            A coordination partner focused on business value, not generic travel sales
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {MICE_USPS.map((item) => (
            <div key={item} className="rounded-[1.5rem] border border-slate-200 bg-white px-5 py-5 dark:border-slate-700 dark:bg-slate-900/85">
              <CircleCheckBig className="h-5 w-5 text-emerald-500" />
              <p className="mt-3 text-sm font-medium leading-7 text-slate-700 dark:text-slate-200">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MiceProcessSection() {
  return (
    <section className="py-14 md:py-18">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50 md:text-4xl">
            A straightforward four-step flow for corporate planning
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {MICE_PROCESS.map((item) => (
            <Card key={item.step} className="rounded-[1.75rem] border-0 bg-slate-950 text-white shadow-[0_20px_45px_rgba(15,23,42,0.16)] dark:bg-slate-900">
              <CardContent className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-200">{item.step}</p>
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MiceIndustriesSection() {
  return (
    <section className="bg-slate-50 py-14 dark:bg-slate-950/50 md:py-18">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
            Industries We Serve
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-slate-50 md:text-4xl">
            Flexible enough for different business types and institutional needs
          </h2>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {MICE_INDUSTRIES.map((industry) => (
            <span key={industry} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {industry}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MiceCaseStudiesPlaceholderSection() {
  return (
    <section className="pb-16 pt-14 md:pb-20 md:pt-18">
      <div className="container mx-auto px-4">
        <Card className="overflow-hidden rounded-[2rem] border-0 bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] text-white shadow-[0_28px_80px_rgba(15,23,42,0.2)]">
          <CardContent className="p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">
              Future Scope
            </p>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
              Testimonials and case studies can plug in here next
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 md:text-base">
              This block is reserved for future corporate proof points such as event outcomes,
              client stories, repeat engagement metrics, or sector-specific case studies.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
