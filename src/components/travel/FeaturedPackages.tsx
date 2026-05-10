'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { fetchAllProducts } from '@/lib/api/products-client';
import type { Product } from '@/lib/products';

const SPITI_VALLEY_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Key%2C_Spiti_Valley.jpg/1280px-Key%2C_Spiti_Valley.jpg';

const FEATURED_DESTINATION_IMAGE_OVERRIDES: Record<string, string> = {
  Himachal: SPITI_VALLEY_IMAGE,
};

const FEATURED_DESTINATIONS = [
  {
    title: 'Himachal',
    href: '/search?q=Himachal',
    fallbackImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
    badge: 'Mountain Retreats',
    badgeClassName: 'border-emerald-300/70 bg-emerald-500/80 text-white shadow-[0_10px_25px_rgba(16,185,129,0.28)]',
    matchTerms: ['himachal', 'manali', 'shimla', 'dharamshala', 'spiti'],
  },
  {
    title: 'Kashmir',
    href: '/search?q=Kashmir',
    fallbackImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=1200',
    badge: 'Valley Escapes',
    badgeClassName: 'border-sky-300/70 bg-sky-500/80 text-white shadow-[0_10px_25px_rgba(14,165,233,0.28)]',
    matchTerms: ['kashmir', 'srinagar', 'gulmarg', 'pahalgam', 'sonamarg'],
  },
  {
    title: 'Sikkim',
    href: '/search?q=Sikkim',
    fallbackImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200',
    badge: 'Spiritual Trails',
    badgeClassName: 'border-amber-300/70 bg-amber-500/80 text-white shadow-[0_10px_25px_rgba(245,158,11,0.28)]',
    matchTerms: ['sikkim', 'gangtok', 'lachung', 'pelling', 'tsomgo', 'goechala'],
  },
  {
    title: 'Ladakh',
    href: '/search?q=Ladakh',
    fallbackImage: 'https://images.unsplash.com/photo-1581793746485-04698e79a4e8?w=1200',
    badge: 'High Passes',
    badgeClassName: 'border-indigo-300/70 bg-indigo-500/80 text-white shadow-[0_10px_25px_rgba(99,102,241,0.28)]',
    matchTerms: ['ladakh', 'leh', 'pangong', 'nubra', 'khardung', 'zanskar'],
  },
  {
    title: 'Meghalaya',
    href: '/search?q=Meghalaya',
    fallbackImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200',
    badge: 'Hidden Gems',
    badgeClassName: 'border-teal-300/70 bg-teal-500/80 text-white shadow-[0_10px_25px_rgba(20,184,166,0.28)]',
    matchTerms: ['meghalaya', 'shillong', 'cherrapunji', 'mawlynnong', 'dawki', 'root bridge'],
  },
  {
    title: 'Rishikesh',
    href: '/search?q=Rishikesh',
    fallbackImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200',
    badge: 'River Retreats',
    badgeClassName: 'border-lime-300/70 bg-lime-600/80 text-white shadow-[0_10px_25px_rgba(101,163,13,0.28)]',
    matchTerms: ['rishikesh', 'rafting', 'ganga', 'yoga', 'laxman jhula', 'camp'],
  },
] as const;

function getVisibleCardCount() {
  if (typeof window === 'undefined') {
    return 3;
  }

  if (window.matchMedia('(min-width: 1280px)').matches) {
    return 3;
  }

  if (window.matchMedia('(min-width: 768px)').matches) {
    return 2;
  }

  return 1;
}

export function FeaturedPackages({ initialProducts = [] }: { initialProducts?: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [visibleCardCount, setVisibleCardCount] = useState(3);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
    hasDragged: false,
  });

  useEffect(() => {
    if (initialProducts.length > 0) {
      return;
    }

    void fetchAllProducts().then(setProducts);
  }, [initialProducts.length]);

  useEffect(() => {
    const updateVisibleCardCount = () => {
      setVisibleCardCount(getVisibleCardCount());
    };

    updateVisibleCardCount();
    window.addEventListener('resize', updateVisibleCardCount);

    return () => window.removeEventListener('resize', updateVisibleCardCount);
  }, []);

  const featuredDestinations = useMemo(
    () =>
      FEATURED_DESTINATIONS.map((item) => {
        const matchingProduct = products.find((product) => {
          const searchable = [
            product.title,
            product.location,
            product.description,
            ...product.highlights,
          ]
            .join(' ')
            .toLowerCase();

          return item.matchTerms.some((term) => searchable.includes(term));
        });

        return {
          ...item,
          image: FEATURED_DESTINATION_IMAGE_OVERRIDES[item.title] ?? matchingProduct?.heroImage ?? item.fallbackImage,
        };
      }),
    [products]
  );

  const maxIndex = Math.max(0, featuredDestinations.length - visibleCardCount);
  const slideGap = 24;
  const slideWidth = `calc((100% - ${(visibleCardCount - 1) * slideGap}px) / ${visibleCardCount})`;

  const goToPrevious = () => {
    const carousel = scrollRef.current;

    if (!carousel) {
      return;
    }

    const card = carousel.querySelector<HTMLElement>('[data-carousel-card]');
    const distance = (card?.offsetWidth ?? 0) + slideGap;
    carousel.scrollBy({ left: -distance, behavior: 'smooth' });
  };

  const goToNext = () => {
    const carousel = scrollRef.current;

    if (!carousel) {
      return;
    }

    const card = carousel.querySelector<HTMLElement>('[data-carousel-card]');
    const distance = (card?.offsetWidth ?? 0) + slideGap;
    carousel.scrollBy({ left: distance, behavior: 'smooth' });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    dragStateRef.current.hasDragged = false;

    const carousel = scrollRef.current;

    if (!carousel) {
      return;
    }

    dragStateRef.current = {
      isDragging: true,
      startX: event.clientX,
      scrollLeft: carousel.scrollLeft,
      hasDragged: false,
    };
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const carousel = scrollRef.current;
    const dragState = dragStateRef.current;

    if (!carousel || !dragState.isDragging) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;

    if (Math.abs(deltaX) > 12) {
      dragState.hasDragged = true;
      event.preventDefault();
    }

    carousel.scrollLeft = dragState.scrollLeft - deltaX;
  };

  const stopDragging = () => {
    const dragState = dragStateRef.current;
    dragState.isDragging = false;
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
              Explore Our Most Loved Travel Packages
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
              Handpicked journeys across India from peaceful hills to cultural escapes and adventure-led getaways.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              aria-label="Previous package"
              className="h-10 w-10 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={goToNext}
              aria-label="Next package"
              className="h-10 w-10 rounded-full"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          className="no-scrollbar cursor-grab overflow-x-auto scroll-smooth active:cursor-grabbing"
        >
          <div
            className="flex snap-x snap-mandatory gap-6"
          >
            {featuredDestinations.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                data-carousel-card
                className="group block min-w-0 shrink-0 snap-start select-none"
                style={{ flexBasis: slideWidth }}
                draggable={false}
              >
                <Card className="group h-full overflow-hidden rounded-[1.75rem] border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] dark:border-slate-700 dark:bg-slate-900/90">
                  <div className="relative min-h-[28rem] overflow-hidden md:min-h-[30rem]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="pointer-events-none object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <Badge className={`${item.badgeClassName} backdrop-blur-sm`}>
                          {item.badge}
                        </Badge>
                      </div>

                      <div className="flex flex-col items-start justify-end gap-3">
                        <div className="flex w-full items-end justify-between">
                          <h3
                            className="text-left text-xl font-bold leading-tight tracking-tight text-white md:text-2xl lg:text-3xl"
                            style={{ fontFamily: 'var(--font-cinzel)' }}
                          >
                            {item.title}
                          </h3>
                          <ArrowRight className="h-7 w-7 shrink-0 text-white transition-all duration-300 group-hover:translate-x-2 group-hover:-translate-y-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2" aria-label="Package carousel position">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <span key={index} className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          ))}
        </div>
      </div>
    </section>
  );
}
