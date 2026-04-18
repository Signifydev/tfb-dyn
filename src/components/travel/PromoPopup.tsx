'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowRight, Clock3, Flame, MapPinned, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fetchAllProducts } from '@/lib/api/products-client';
import type { Product } from '@/lib/products';

interface PromoContent {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  categoryLabel: string;
  ctaLabel: string;
  badge: string;
  timingLabel: string;
}

const LANDING_PROMO_KEY = 'tfb-landing-promo-shown';

function buildLandingPromo(products: Product[]): PromoContent | null {
  const charDhamProduct =
    products.find((product) => product.slug.includes('char-dham')) ||
    products.find((product) => product.category === 'char-dham');

  if (!charDhamProduct) {
    return null;
  }

  return {
    id: 'char-dham-2026',
    title: 'Char Dham Yatra 2026 Booking Open Now!',
    description:
      'Reserve early for 2026 departures and get first access to premium routing, helicopter options, and smoother pilgrimage planning before peak slots fill up.',
    image: charDhamProduct.heroImage,
    href: `/products/${charDhamProduct.slug}`,
    categoryLabel: 'Char Dham Yatra',
    ctaLabel: 'Explore 2026 Offers',
    badge: 'Early Access',
    timingLabel: 'Limited season inventory',
  };
}

function buildRandomPromo(products: Product[]): PromoContent | null {
  const promoCategories = ['adventure-activities', 'bike-expeditions', 'tour-packages'];
  const shuffledCategories = [...promoCategories].sort(() => Math.random() - 0.5);

  for (const category of shuffledCategories) {
    const categoryProducts = products.filter((product) => product.category === category);
    if (categoryProducts.length === 0) {
      continue;
    }

    const selectedProduct =
      categoryProducts.find((product) => product.featured) ||
      categoryProducts[Math.floor(Math.random() * categoryProducts.length)];

    const categoryMeta = {
      'adventure-activities': {
        label: 'Adventure Activity',
        badge: 'Thrill Deal',
        description:
          'Jump back into high-energy experiences with quick-booking adventure slots and seasonal activity offers.',
      },
      'bike-expeditions': {
        label: 'Bike Expedition',
        badge: 'Ride Offer',
        description:
          'Open-road departures, rider-ready itineraries, and handpicked routes are waiting if you are still deciding.',
      },
      'tour-packages': {
        label: 'Tour Package',
        badge: 'Hot Package',
        description:
          'Discover curated holiday circuits with easy planning, sharper pricing, and customer-ready departure windows.',
      },
    }[category];

    if (!categoryMeta) {
      continue;
    }

    return {
      id: `random-${category}-${selectedProduct.slug}`,
      title: `${selectedProduct.title} - Special Offer Live Now`,
      description: categoryMeta.description,
      image: selectedProduct.heroImage,
      href: `/products/${selectedProduct.slug}`,
      categoryLabel: categoryMeta.label,
      ctaLabel: 'View Offer',
      badge: categoryMeta.badge,
      timingLabel: `${selectedProduct.duration} | ${selectedProduct.location}`,
    };
  }

  return null;
}

export function PromoPopup() {
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [promo, setPromo] = useState<PromoContent | null>(null);
  const [open, setOpen] = useState(false);
  const hasMountedRef = useRef(false);
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    void fetchAllProducts().then((fetchedProducts) => {
      if (isMounted) {
        setProducts(fetchedProducts);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const landingPromo = useMemo(() => buildLandingPromo(products), [products]);

  useEffect(() => {
    if (products.length === 0) {
      return;
    }

    let timer: ReturnType<typeof setTimeout> | null = null;

    const hasSeenLandingPromo =
      typeof window !== 'undefined' && sessionStorage.getItem(LANDING_PROMO_KEY) === 'true';

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      previousPathRef.current = pathname;

      if (!hasSeenLandingPromo && landingPromo) {
        timer = setTimeout(() => {
          setPromo(landingPromo);
          setOpen(true);
          sessionStorage.setItem(LANDING_PROMO_KEY, 'true');
        }, 10000);
      }

      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }

    if (previousPathRef.current !== pathname) {
      previousPathRef.current = pathname;

      timer = setTimeout(() => {
        const nextPromo = buildRandomPromo(products);
        if (nextPromo) {
          setPromo(nextPromo);
          setOpen(true);
        }
      }, 60000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [landingPromo, pathname, products]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl overflow-hidden border-0 bg-white p-0 shadow-[0_40px_120px_rgba(15,23,42,0.24)] dark:bg-slate-950 sm:rounded-[2rem]">
        {promo && (
          <div className="grid md:grid-cols-[1.02fr_0.98fr]">
            <div className="relative min-h-[260px] overflow-hidden md:min-h-[100%]">
              <Image
                src={promo.image}
                alt={promo.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.68))]" />
              <div className="absolute left-5 top-5">
                <Badge className="border-0 bg-amber-400 px-3 py-1 text-slate-950 hover:bg-amber-300">
                  {promo.badge}
                </Badge>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-100 backdrop-blur">
                  <Flame className="h-3.5 w-3.5 text-amber-300" />
                  Offer Spotlight
                </div>
                <p className="mt-3 text-sm text-slate-100">{promo.timingLabel}</p>
              </div>
            </div>

            <div className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] md:p-8">
              <DialogHeader className="text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:bg-sky-500/15 dark:text-sky-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  {promo.categoryLabel}
                </div>
                <DialogTitle className="mt-4 text-3xl font-semibold leading-tight text-slate-950 dark:text-slate-50">
                  {promo.title}
                </DialogTitle>
                <DialogDescription className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {promo.description}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                  <Clock3 className="h-4 w-4 text-sky-700" />
                  Triggered based on time spent exploring the site
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                  <MapPinned className="h-4 w-4 text-emerald-600" />
                  Designed to pull visitors back into a high-intent itinerary
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href={promo.href} className="block flex-1" onClick={() => setOpen(false)}>
                  <Button className="h-12 w-full rounded-xl bg-slate-950 hover:bg-slate-800">
                    {promo.ctaLabel}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="h-12 rounded-xl border-slate-200 px-6 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setOpen(false)}
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
