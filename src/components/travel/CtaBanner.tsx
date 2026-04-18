import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarClock, Flame } from 'lucide-react';
import { getHomepageCta } from '@/lib/api/cta';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export async function CtaBanner() {
  const cta = await getHomepageCta();

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl">
          <div className="absolute inset-0">
            <Image
              src={cta.imageUrl}
              alt={cta.title}
              fill
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(2,6,23,0.92),rgba(15,23,42,0.78),rgba(30,41,59,0.45))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.30),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.22),transparent_28%)]" />
          </div>

          <div className="relative grid gap-8 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
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
