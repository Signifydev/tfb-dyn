'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';
import { fetchAllProducts } from '@/lib/api/products-client';
import { getDestinationsFromProducts } from '@/lib/products';

function getTileSize(index: number): { cols: number; rows: number } {
  const pattern = [
    { cols: 2, rows: 2 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 2 },
    { cols: 2, rows: 1 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
    { cols: 2, rows: 2 },
    { cols: 1, rows: 1 },
    { cols: 2, rows: 1 },
    { cols: 1, rows: 2 },
    { cols: 1, rows: 1 },
    { cols: 1, rows: 1 },
  ];
  return pattern[index % pattern.length];
}

function getStableDestinationWeight(name: string): number {
  return Array.from(name).reduce((weight, char, index) => {
    return weight + char.charCodeAt(0) * (index + 3);
  }, 0);
}

export function DestinationGrid() {
  const [destinations, setDestinations] = useState<
    { name: string; image: string; packages: number; category: string }[]
  >([]);

  useEffect(() => {
    void fetchAllProducts().then((products) => {
      setDestinations(getDestinationsFromProducts(products).slice(0, 12));
    });
  }, []);

  const displayDestinations = useMemo(
    () =>
      [...destinations].sort((a, b) => {
        return getStableDestinationWeight(a.name) - getStableDestinationWeight(b.name);
      }),
    [destinations]
  );

  return (
    <section className="bg-slate-50 py-12 dark:bg-slate-950/40 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">Popular Destinations</h2>
          <p className="text-slate-600 dark:text-slate-300">Explore trending travel destinations</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4" style={{
          gridAutoRows: 'minmax(150px, auto)',
          gridAutoFlow: 'dense',
        }}>
          {displayDestinations.map((dest, index) => {
            const size = getTileSize(index);

            return (
              <Link
                key={dest.name}
                href={`/search?q=${encodeURIComponent(dest.name)}`}
                className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg"
                style={{
                  gridColumn: `span ${size.cols}`,
                  gridRow: `span ${size.rows}`,
                  minHeight: `${size.rows * 160}px`,
                }}
              >
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-6">
                  <div className="mb-1 flex items-center gap-2 text-white/80">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs md:text-sm">{dest.packages} packages</span>
                  </div>
                  <div className="flex w-full items-end justify-between gap-3">
                    <h3 className="text-base font-bold leading-tight tracking-tight text-white md:text-xl" style={{ fontFamily: 'var(--font-cinzel)' }}>{dest.name}</h3>
                    <ArrowRight className="h-7 w-7 shrink-0 text-white transition-all duration-300 group-hover:translate-x-2 group-hover:-translate-y-2" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
