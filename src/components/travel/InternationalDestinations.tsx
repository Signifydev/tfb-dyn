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

const INTERNATIONAL_DESTINATIONS = [
  {
    title: 'Vietnam',
    href: '/search?q=Vietnam',
    fallbackImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200',
    badge: 'Culture Trails',
    badgeClassName: 'border-emerald-300/70 bg-emerald-500/80 text-white shadow-[0_10px_25px_rgba(16,185,129,0.28)]',
    matchTerms: ['vietnam', 'hanoi', 'ho chi minh', 'halong', 'da nang', 'hoi an'],
  },
  {
    title: 'Bali',
    href: '/search?q=Bali',
    fallbackImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200',
    badge: 'Island Escapes',
    badgeClassName: 'border-cyan-300/70 bg-cyan-500/80 text-white shadow-[0_10px_25px_rgba(6,182,212,0.28)]',
    matchTerms: ['bali', 'ubud', 'kuta', 'seminyak', 'indonesia'],
  },
  {
    title: 'Thailand',
    href: '/search?q=Thailand',
    fallbackImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200',
    badge: 'Beach Holidays',
    badgeClassName: 'border-amber-300/70 bg-amber-500/80 text-white shadow-[0_10px_25px_rgba(245,158,11,0.28)]',
    matchTerms: ['thailand', 'bangkok', 'phuket', 'krabi', 'pattaya', 'phi phi'],
  },
  {
    title: 'Nepal',
    href: '/search?q=Nepal',
    fallbackImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200',
    badge: 'Himalayan Views',
    badgeClassName: 'border-indigo-300/70 bg-indigo-500/80 text-white shadow-[0_10px_25px_rgba(99,102,241,0.28)]',
    matchTerms: ['nepal', 'kathmandu', 'pokhara', 'annapurna', 'everest'],
  },
  {
    title: 'Europe',
    href: '/search?q=Europe',
    fallbackImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200',
    badge: 'Grand Tours',
    badgeClassName: 'border-rose-300/70 bg-rose-500/80 text-white shadow-[0_10px_25px_rgba(244,63,94,0.28)]',
    matchTerms: ['europe', 'paris', 'switzerland', 'italy', 'france', 'amsterdam'],
  },
  {
    title: 'Sri Lanka',
    href: '/search?q=Sri%20Lanka',
    fallbackImage: 'https://images.unsplash.com/photo-1588255005005-8b0f46f5ebd3?w=1200',
    badge: 'Tropical Getaways',
    badgeClassName: 'border-lime-300/70 bg-lime-600/80 text-white shadow-[0_10px_25px_rgba(101,163,13,0.28)]',
    matchTerms: ['sri lanka', 'srilanka', 'colombo', 'kandy', 'galle', 'bentota'],
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

function getSearchableProductText(product: Product) {
  return [
    product.title,
    product.location,
    product.description,
    product.subcategory,
    ...product.highlights,
    ...(product.destinations ?? []).flatMap((destination) => [
      destination.country,
      destination.state,
      destination.city,
      destination.display_label,
    ]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function InternationalDestinations({
  initialProducts = [],
  sectionClassName = 'py-12 md:py-16',
  containerClassName = 'container mx-auto px-4',
}: {
  initialProducts?: Product[];
  sectionClassName?: string;
  containerClassName?: string;
}) {
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

  const destinations = useMemo(
    () =>
      INTERNATIONAL_DESTINATIONS.map((item) => {
        const matchingProduct = products.find((product) => {
          const searchable = getSearchableProductText(product);

          return item.matchTerms.some((term) => searchable.includes(term));
        });

        return {
          ...item,
          image: matchingProduct?.heroImage ?? item.fallbackImage,
        };
      }),
    [products]
  );

  const maxIndex = Math.max(0, destinations.length - visibleCardCount);
  const slideGap = 24;
  const slideWidth = `calc((100% - ${(visibleCardCount - 1) * slideGap}px) / ${visibleCardCount})`;

  const scrollByCard = (direction: -1 | 1) => {
    const carousel = scrollRef.current;

    if (!carousel) {
      return;
    }

    const card = carousel.querySelector<HTMLElement>('[data-carousel-card]');
    const distance = ((card?.offsetWidth ?? 0) + slideGap) * direction;
    carousel.scrollBy({ left: distance, behavior: 'smooth' });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

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
    dragStateRef.current.isDragging = false;
  };

  return (
    <section className={sectionClassName}>
      <div className={containerClassName}>
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
              International Places You Will Love
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
              Discover handpicked overseas experiences across Vietnam, Bali, Thailand, Nepal, Europe, and Sri Lanka.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous international destination"
              className="h-10 w-10 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => scrollByCard(1)}
              aria-label="Next international destination"
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
          <div className="flex snap-x snap-mandatory gap-6">
            {destinations.map((item) => (
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

        <div className="mt-6 flex justify-center gap-2" aria-label="International carousel position">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <span key={index} className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          ))}
        </div>
      </div>
    </section>
  );
}
