'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchAllProducts } from '@/lib/api/products-client';
import { getDestinationsFromProducts } from '@/lib/products';

export function DestinationGrid() {
  const [destinations, setDestinations] = useState<
    { name: string; image: string; packages: number; category: string }[]
  >([]);

  useEffect(() => {
    void fetchAllProducts().then((products) => {
      setDestinations(getDestinationsFromProducts(products).slice(0, 6));
    });
  }, []);

  return (
    <section className="bg-slate-50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-bold text-slate-900 md:text-3xl">Popular Destinations</h2>
          <p className="text-slate-600">Explore trending travel destinations</p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {destinations.map((dest) => (
            <Link
              key={dest.name}
              href={`/search?q=${encodeURIComponent(dest.name)}`}
              className="group relative h-44 overflow-hidden rounded-2xl md:h-64"
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
                <h3 className="mb-2 text-base font-bold text-white md:mb-3 md:text-xl">{dest.name}</h3>
                <Button
                  size="sm"
                  className="h-8 border-0 bg-white/20 px-3 text-xs text-white backdrop-blur-sm hover:bg-white/30 md:h-9 md:text-sm"
                >
                  Explore <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
