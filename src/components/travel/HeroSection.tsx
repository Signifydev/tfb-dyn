'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORY_DEFINITIONS } from '@/lib/categories';
import { fetchAllProducts } from '@/lib/api/products-client';
import { getAvailableCitiesFromProducts, type Product } from '@/lib/products';

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600',
    eyebrow: 'Heritage Escapes',
    title: 'Trace legendary journeys across India',
    description: 'From royal circuits to timeless temple towns, discover handcrafted itineraries with seamless planning.',
  },
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600',
    eyebrow: 'Road Adventures',
    title: 'Ride, trek, and explore beyond the usual',
    description: 'Choose bike expeditions, mountain camps, and raw Himalayan routes built for travelers who want stories.',
  },
  {
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600',
    eyebrow: 'Sacred Journeys',
    title: 'Plan pilgrimages and helicopter darshan with ease',
    description: 'Compare Char Dham, helicopter services, and spiritual circuits with destination-first search.',
  },
];

export function HeroSection() {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);

  const categories = useMemo(
    () =>
      CATEGORY_DEFINITIONS.map((category) => ({
        value: category.slug,
        label: category.name,
      })),
    []
  );

  const cities = useMemo(() => getAvailableCitiesFromProducts(products), [products]);
  const stats = useMemo(() => {
    const featuredCount = products.filter((product) => product.featured).length;

    return [
      { label: 'Live Packages', value: `${products.length}+` },
      { label: 'Featured Trips', value: `${featuredCount}+` },
      { label: 'Destinations', value: `${cities.length}+` },
      { label: 'Support', value: '24/7' },
    ];
  }, [cities.length]);

  const activeHero = HERO_SLIDES[activeSlide];

  useEffect(() => {
    void fetchAllProducts().then(setProducts);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }

    if (selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }

    if (selectedCity !== 'all') {
      params.set('city', selectedCity);
    }

    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === activeSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.64) 38%, rgba(0,0,0,0.8) 100%), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.18),transparent_30%)]" />
      </div>

      <div className="relative container mx-auto px-4 pb-20 pt-40 md:pb-28 md:pt-52">
        <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-3xl">
            <Badge className="mb-6 border border-white/20 bg-white/10 px-4 py-1.5 text-white backdrop-blur-sm">
              Trusted by 10,000+ travelers
            </Badge>

            <div className="min-h-[260px]">
              <div key={activeHero.title} className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
                  {activeHero.eyebrow}
                </p>
                <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                  {activeHero.title}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200 md:text-xl">
                  {activeHero.description}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeSlide ? 'w-12 bg-amber-300' : 'w-2.5 bg-white/45'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-[2rem] border border-white/15 bg-white/12 p-4 shadow-2xl backdrop-blur-md md:mt-10 md:p-6">
            <div className="rounded-[1.5rem] bg-white p-5 text-slate-900 dark:bg-slate-900/95 dark:text-slate-100 md:p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Find your next trip faster</h2>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      Select Category
                    </label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      Select City
                    </label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                        <SelectValue placeholder="All cities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All cities</SelectItem>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                    What are you looking for?
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                    <Input
                      type="text"
                      placeholder="Try Char Dham, helicopter, Ladakh, wedding, trekking..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-12 rounded-xl border-slate-200 pl-11 text-base dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="h-12 w-full rounded-xl bg-blue-600 text-base hover:bg-blue-700">
                  Search Packages
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-5 flex flex-wrap gap-2">
                {['Char Dham', 'Helicopter', 'Bike Expedition', 'Kerala', 'Corporate'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSearchQuery(item)}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-white md:text-3xl">{stat.value}</div>
              <div className="mt-1 text-sm text-slate-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
