'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { fetchAllProducts } from '@/lib/api/products-client';
import type { Product } from '@/lib/products';
import { isInternationalTourPackage, sortTourPackageProducts } from '@/lib/tour-packages';

const animationStyles = ``;


const EXPERIENCE_SHOWCASE = [
  {
    title: 'Adventure Activities',
    description:
      'Rafting, bungee jumping, paragliding, zipline, giant swing and more thrilling activities for adventure lovers.',
    cta: 'View Adventures',
    href: '/categories/adventure-activities',
    category: 'adventure-activities',
    fallbackImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200',
    badge: 'Thrill Picks',
    badgeClassName: 'border-rose-300/70 bg-rose-500/80 text-white shadow-[0_10px_25px_rgba(244,63,94,0.28)]',
  },
  {
    title: 'Trekking & Camps',
    description:
      'Explore scenic treks, riverside camps, jungle camps, weekend getaways and mountain camping experiences.',
    cta: 'View Treks & Camps',
    href: '/categories/trekking-camps',
    category: 'trekking-camps',
    fallbackImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
    badge: 'Camp Escapes',
    badgeClassName: 'border-emerald-300/70 bg-emerald-500/80 text-white shadow-[0_10px_25px_rgba(16,185,129,0.28)]',
  },
  {
    title: 'Bike Expeditions',
    description:
      'Ride through Himalayan roads, high passes and scenic routes with planned bike expeditions and group departures.',
    cta: 'View Bike Trips',
    href: '/categories/bike-expeditions',
    category: 'bike-expeditions',
    fallbackImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
    badge: 'Open Road',
    badgeClassName: 'border-sky-300/70 bg-sky-500/80 text-white shadow-[0_10px_25px_rgba(14,165,233,0.28)]',
  },
] as const;

function TourScopeCard({
  title,
  href,
  image,
  count,
  description,
  accentClassName,
}: {
  title: string;
  href: string;
  image: string;
  count: number;
  description: string;
  accentClassName: string;
}) {
  return (
    <Link href={href} className="group block">
      <Card className="group h-full overflow-hidden rounded-[1.75rem] border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] dark:border-slate-700 dark:bg-slate-900/90">
        <div className="relative min-h-[28rem] overflow-hidden md:min-h-[30rem]">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className={`absolute inset-0 ${accentClassName}`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6">
            <div className="flex items-start gap-3">
              <Badge className="border-white/25 bg-white/15 text-white backdrop-blur">
                {count} packages
              </Badge>
            </div>
            <div className="flex flex-col items-start justify-between h-full">
              <h3 className="text-2xl font-black leading-tight text-white md:text-3xl lg:text-4xl tracking-tight">{title}</h3>
              <div className="flex justify-end w-full">
                <ArrowRight className="h-7 w-7 text-white transition-all duration-300 group-hover:translate-x-2 group-hover:-translate-y-2" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function HomepagePackageShowcase({ categorySection }: { categorySection?: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    void fetchAllProducts().then(setProducts);
  }, []);

  const tourPackages = sortTourPackageProducts(products.filter((product) => product.category === 'tour-packages'));
  const domesticTourPackages = tourPackages.filter((product) => !isInternationalTourPackage(product));
  const internationalTourPackages = tourPackages.filter((product) => isInternationalTourPackage(product));
  const experienceProducts = products
    .filter((product) => ['adventure-activities', 'trekking-camps', 'bike-expeditions'].includes(product.category))
    .sort((a, b) => b.reviews - a.reviews || b.rating - a.rating);
  const experienceShowcase = EXPERIENCE_SHOWCASE.map((item) => ({
    ...item,
    image:
      experienceProducts.find((product) => product.category === item.category)?.heroImage ?? item.fallbackImage,
  }));

  if (!products.length) {
    return null;
  }

  return (
    <section className="overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_45%,#eef6ff_100%)] py-12 dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl">
              Find Your Perfect Trip - India & Beyond
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
              Browse the best domestic and international tour packages crafted for every traveler - whether
              you seek adventure, relaxation, spirituality, or exploration, your next unforgettable journey
              starts here.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/categories/tour-packages">View Tour Packages</Link>
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <TourScopeCard
            title="Domestic Tour Packages"
            href="/categories/tour-packages?scope=domestic"
            image={domesticTourPackages[0]?.heroImage ?? ''}
            count={domesticTourPackages.length}
            description="India journeys, state-wise circuits, heritage routes, beaches, hills, and spiritual escapes."
            accentClassName="bg-[linear-gradient(135deg,#0f766e_0%,#0f172a_58%,#082f49_100%)]"
          />
          <TourScopeCard
            title="International Tour Packages"
            href="/categories/tour-packages?scope=international"
            image={internationalTourPackages[0]?.heroImage ?? ''}
            count={internationalTourPackages.length}
            description="Overseas holiday collections kept separate for easier discovery and planning."
            accentClassName="bg-[linear-gradient(135deg,#1d4ed8_0%,#312e81_60%,#0f172a_100%)]"
          />
        </div>

        {categorySection ? <div className="mt-14">{categorySection}</div> : null}

        <div className="mt-14 max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl">
            Choose Your Travel Experience
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
            Whether you love thrill, mountains, camping or open-road journeys - Travel For Benefits brings every experience under one platform.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
          <style>{animationStyles}</style>
          {experienceShowcase.map((item) => (
            <Link key={item.title} href={item.href} className="group block">
              <Card className="group h-full overflow-hidden rounded-[1.75rem] border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] dark:border-slate-700 dark:bg-slate-900/90">
                <div className="relative min-h-[28rem] overflow-hidden md:min-h-[30rem]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <Badge className={`${item.badgeClassName} backdrop-blur-sm`}>
                        {item.badge}
                      </Badge>
                    </div>

                    <div className="flex flex-col items-start justify-between h-full">
                      <h3 className="text-2xl font-black leading-tight text-white md:text-3xl lg:text-4xl tracking-tight">
                        {item.title}
                      </h3>
                      <div className="flex justify-end w-full">
                        <ArrowRight className="h-7 w-7 text-white transition-all duration-300 group-hover:translate-x-2 group-hover:-translate-y-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
