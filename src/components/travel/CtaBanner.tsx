import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarClock, Flame } from 'lucide-react';
import { type CtaBanner as CtaBannerData, getHomepageCta } from '@/lib/api/cta';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const CHAR_DHAM_CTA_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/3/30/Kedarnath_Temple.jpg';

function CtaBannerSection({ cta }: { cta: CtaBannerData }) {
  const isCharDhamCta = cta.slug.includes('char-dham') || cta.buttonHref.includes('char-dham');
  const imageUrl = isCharDhamCta ? CHAR_DHAM_CTA_IMAGE : cta.imageUrl;

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="relative min-h-[28rem] overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl md:min-h-[25rem]">
          <div className="absolute inset-0">
            <Image
              src={imageUrl}
              alt={cta.title}
              fill
              className={`object-cover opacity-70 ${isCharDhamCta ? 'object-bottom' : 'object-center'}`}
            />
            <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(2,6,23,0.88)_0%,rgba(15,23,42,0.72)_42%,rgba(15,23,42,0.22)_72%,rgba(15,23,42,0.08)_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
          </div>

          <div className="relative grid min-h-[28rem] gap-8 px-6 py-8 md:min-h-[25rem] md:px-10 md:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                {cta.badge && (
                  <Badge className="border border-amber-300/30 bg-amber-300/15 text-amber-200 hover:bg-amber-300/15">
                    <Flame className="mr-1 h-3.5 w-3.5" />
                    {cta.badge}
                  </Badge>
                )}
                {cta.subtitle && (
                  <span className="inline-flex items-center gap-2 text-sm text-slate-200">
                    <CalendarClock className="h-4 w-4 text-blue-300" />
                    {cta.subtitle}
                  </span>
                )}
              </div>

              <h2 className="text-3xl font-bold text-white md:text-4xl">
                {cta.title}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-200 md:text-lg">
                {cta.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                {cta.offerText && (
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm">
                    {cta.offerText}
                  </div>
                )}
                <Link href={cta.buttonHref}>
                  <Button size="lg" className="rounded-xl bg-blue-600 hover:bg-blue-700">
                    {cta.buttonLabel}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function CtaBanner() {
  const cta = await getHomepageCta();

  return <CtaBannerSection cta={cta} />;
}

const CUSTOM_TOUR_CTA: CtaBannerData = {
  id: 'custom-tour-home-cta',
  slug: 'customized-curated-tour-package',
  title: 'Need a Customized or Curated Tour Package?',
  subtitle: 'Personalized planning for every kind of traveler',
  description:
    'Tell us your destination, travel style, budget, and dates, and our experts will help craft a journey built around exactly what you want.',
  offerText: 'Perfect for families, couples, groups, pilgrimages, and special interest travel',
  buttonLabel: 'Talk to Expert',
  buttonHref: '/contact',
  imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600',
  badge: 'Custom Planning',
  placement: 'home_after_popular_destinations',
};

export function CustomTourCtaBanner() {
  return <CtaBannerSection cta={CUSTOM_TOUR_CTA} />;
}
