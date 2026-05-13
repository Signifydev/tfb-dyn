'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';

const commonsImage = (fileName: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1400`;

const POPULAR_DESTINATIONS = [
  {
    name: 'Spiti',
    image: commonsImage('Spiti river and valley.jpg'),
  },
  {
    name: 'Nainital',
    image: commonsImage('Beautiful Nainital Lake.jpg'),
  },
  {
    name: 'Jim Corbett',
    image: commonsImage('Jim Corbett national park scene.jpg'),
  },
  {
    name: 'Shillong',
    image: commonsImage('Elephant Falls - Shillong Meghalaya.jpg'),
  },
  {
    name: 'Munnar',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Ooty',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Thekkady',
    image: 'https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Allepey',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Jaisalmer',
    image: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Udaipur',
    image: commonsImage('Udaipur, India, Lake Pichola.jpg'),
  },
  {
    name: 'Varanasi',
    image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Ujjain',
    image: commonsImage('Mahakaleshwar Temple, Ujjain.jpg'),
  },
  {
    name: 'Ayodhya',
    image: commonsImage('Shri Ram Janambhoomi Mandir, Ayodhya.jpg'),
  },
  {
    name: 'Haridwar',
    image: commonsImage('Har Ki Pauri Ghat.jpg'),
  },
  {
    name: 'Somnath',
    image: commonsImage('Somnath Temple Gujarat.jpg'),
  },
  {
    name: 'Kutch',
    image: commonsImage("'WHITE DESERT' at Dhordo in Great Rann of Kutch.JPG"),
  },
] as const;

function getTileSize(index: number): { cols: number; rows: number } {
  const pattern = [
    { cols: 2, rows: 2 },
    { cols: 2, rows: 1 },
    { cols: 2, rows: 1 },
    { cols: 2, rows: 2 },
    { cols: 2, rows: 1 },
    { cols: 2, rows: 2 },
    { cols: 2, rows: 1 },
    { cols: 2, rows: 1 },
    { cols: 2, rows: 2 },
    { cols: 2, rows: 1 },
  ];
  return pattern[index % pattern.length];
}

export function DestinationGrid({ initialProducts: _initialProducts = [] }: { initialProducts?: unknown[] }) {
  return (
    <section className="bg-slate-50 py-12 dark:bg-slate-950/40 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">Popular Destinations</h2>
          <p className="text-slate-600 dark:text-slate-300">Explore trending travel destinations</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 xl:grid-cols-6" style={{
          gridAutoRows: 'minmax(150px, auto)',
          gridAutoFlow: 'dense',
        }}>
          {POPULAR_DESTINATIONS.map((dest, index) => {
            const size = getTileSize(index);

            return (
              <Link
                key={dest.name}
                href={`/search?q=${encodeURIComponent(dest.name)}`}
                className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg"
                style={{
                  gridColumn: `span ${size.cols}`,
                  gridRow: `span ${size.rows}`,
                  minHeight: `${size.rows * 170}px`,
                }}
              >
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25" />
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-6">
                  <div className="mb-1 flex items-center gap-2 text-white/80">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs md:text-sm">Explore packages</span>
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
