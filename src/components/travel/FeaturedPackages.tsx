'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { fetchAllProducts } from '@/lib/api/products-client';
import type { Product } from '@/lib/products';

const animationStyles = ``;


const FEATURED_DESTINATIONS = [
  {
    title: 'Himachal',
    description:
      'Snowy mountains, scenic valleys, adventure activities, honeymoon trips, family holidays and peaceful stays in Manali, Shimla, Dharamshala and beyond.',
    cta: 'Explore Himachal',
    href: '/search?q=Himachal',
    fallbackImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
    badge: 'Mountain Retreats',
    badgeClassName: 'border-emerald-300/70 bg-emerald-500/80 text-white shadow-[0_10px_25px_rgba(16,185,129,0.28)]',
    matchTerms: ['himachal', 'manali', 'shimla', 'dharamshala', 'spiti'],
  },
  {
    title: 'Sikkim & Meghalaya',
    description:
      'Discover waterfalls, living root bridges, monasteries, lakes, valleys and the untouched beauty of Northeast India.',
    cta: 'Explore Northeast',
    href: '/search?q=Sikkim%20Meghalaya',
    fallbackImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200',
    badge: 'Hidden Gems',
    badgeClassName: 'border-sky-300/70 bg-sky-500/80 text-white shadow-[0_10px_25px_rgba(14,165,233,0.28)]',
    matchTerms: ['sikkim', 'meghalaya', 'gangtok', 'goechala', 'northeast', 'north east'],
  },
  {
    title: 'Nepal',
    description:
      'Experience temples, mountain views, adventure, culture and spiritual travel across Kathmandu, Pokhara and Himalayan regions.',
    cta: 'Explore Nepal',
    href: '/search?q=Nepal',
    fallbackImage: 'https://res.cloudinary.com/dunva5eod/image/upload/v1777300267/pexels-tkirkgoz-11479025_ciempl.jpg',
    badge: 'Spiritual Trails',
    badgeClassName: 'border-amber-300/70 bg-amber-500/80 text-white shadow-[0_10px_25px_rgba(245,158,11,0.28)]',
    matchTerms: ['nepal', 'kathmandu', 'nagarkot', 'heritage', 'pashupatinath', 'boudhanath', 'swayambhunath', 'thamel', 'himalayan'],
  },
] as const;

export function FeaturedPackages() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    void fetchAllProducts().then(setProducts);
  }, []);

  const featuredDestinations = useMemo(
    () =>
      FEATURED_DESTINATIONS.map((item) => {
        // First, try to match by location directly
        let matchingProduct = products.find((product) => 
          product.location?.toLowerCase() === item.title.toLowerCase()
        );
        
        // If no location match, then try matchTerms
        if (!matchingProduct) {
          matchingProduct = products.find((product) => {
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
        }

        return {
          ...item,
          image: matchingProduct?.heroImage ?? item.fallbackImage,
        };
      }),
    [products]
  );

  return (
    <section className="py-12 md:py-16">
      <style>{animationStyles}</style>
      <div className="container mx-auto px-4">
        <div className="mb-8 max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
            Explore Our Most Loved Travel Packages
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300 md:text-lg">
            Handpicked journeys across India and beyond — from peaceful hills to cultural escapes and international adventures.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
          {featuredDestinations.map((item) => {
            return (
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

                      <div className="flex flex-col items-start justify-end gap-3">
                        <div className="flex w-full items-end justify-between">
                          <h3 className="text-xl font-bold leading-tight text-white md:text-2xl lg:text-3xl tracking-tight text-left" style={{ fontFamily: 'var(--font-cinzel)' }}>
                            {item.title}
                          </h3>
                          <ArrowRight className="h-7 w-7 text-white transition-all duration-300 group-hover:translate-x-2 group-hover:-translate-y-2 shrink-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
