'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Bike, Globe2, Heart, MapPin, Mountain, Star, TentTree, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { fetchAllProducts } from '@/lib/api/products-client';
import type { Product } from '@/lib/products';
import { isInternationalTourPackage, sortTourPackageProducts } from '@/lib/tour-packages';
import { readWishlist, syncGlobalWishlistToUser, toggleWishlistItem } from '@/lib/wishlist-storage';

const EXPERIENCE_CATEGORY_LABELS: Record<string, string> = {
  'adventure-activities': 'Adventure',
  'trekking-camps': 'Trekking & Camps',
  'bike-expeditions': 'Bike Expedition',
};

function PackageCard({
  product,
  wishlist,
  onToggleWishlist,
}: {
  product: Product;
  wishlist: string[];
  onToggleWishlist: (slug: string, event: React.MouseEvent) => void;
}) {
  return (
    <Link key={product.slug} href={`/products/${product.slug}`}>
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/90">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.heroImage}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <button
            onClick={(event) => onToggleWishlist(product.slug, event)}
            className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-800 md:right-3 md:top-3"
          >
            <Heart
              className={`h-4 w-4 ${
                wishlist.includes(product.slug) ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-300'
              }`}
            />
          </button>
          <Badge className="absolute left-2 top-2 bg-white/90 text-slate-800 hover:bg-white md:left-3 md:top-3">
            {EXPERIENCE_CATEGORY_LABELS[product.category] || 'Tour Package'}
          </Badge>
        </div>

        <CardContent className="p-3 md:p-4">
          <div className="mb-2 flex items-center gap-2">
            <MapPin className="h-3 w-3 text-slate-500 dark:text-slate-400" />
            <span className="line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400 md:text-xs">{product.location}</span>
          </div>

          <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-sky-300 md:text-base">
            {product.title}
          </h3>

          <div className="mb-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium md:text-sm">{product.rating}</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 md:text-sm">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-blue-600 md:text-lg">
                Rs.{product.price.toLocaleString()}
              </span>
              <span className="ml-1 text-[11px] text-slate-400 line-through dark:text-slate-500 md:ml-2 md:text-sm">
                Rs.{product.originalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 md:text-xs">
            <Users className="h-3 w-3" />
            <span className="line-clamp-1">{product.groupSize}</span>
            <span className="mx-1">•</span>
            <span className="line-clamp-1">{product.duration}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function TourScopeCard({
  title,
  href,
  image,
  count,
  icon,
  description,
  accentClassName,
}: {
  title: string;
  href: string;
  image: string;
  count: number;
  icon: React.ReactNode;
  description: string;
  accentClassName: string;
}) {
  return (
    <Link href={href} className="group block">
      <div className="relative h-52 overflow-hidden rounded-[1.75rem] md:h-64">
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
          <div className="flex items-start justify-between gap-3">
            <Badge className="border-white/25 bg-white/15 text-white backdrop-blur">
              {count} packages
            </Badge>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-2 text-white backdrop-blur">
              {icon}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white md:text-2xl">{title}</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-white/80">{description}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
              Explore
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function HomepagePackageShowcase() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const applyWishlist = () => {
      const items = user ? syncGlobalWishlistToUser(user.id) : readWishlist(null);
      setWishlist(items);
    };

    void fetchAllProducts().then(setProducts);
    applyWishlist();

    window.addEventListener('storage', applyWishlist);
    window.addEventListener('tfb-wishlist-updated', applyWishlist);

    return () => {
      window.removeEventListener('storage', applyWishlist);
      window.removeEventListener('tfb-wishlist-updated', applyWishlist);
    };
  }, [user]);

  const toggleWishlist = (slug: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const updated = toggleWishlistItem(slug, user?.id);
    setWishlist(updated);
  };

  const tourPackages = sortTourPackageProducts(products.filter((product) => product.category === 'tour-packages'));
  const domesticTourPackages = tourPackages.filter((product) => !isInternationalTourPackage(product));
  const internationalTourPackages = tourPackages.filter((product) => isInternationalTourPackage(product));
  const experienceProducts = products
    .filter((product) => ['adventure-activities', 'trekking-camps', 'bike-expeditions'].includes(product.category))
    .sort((a, b) => b.reviews - a.reviews || b.rating - a.rating);

  if (!products.length) {
    return null;
  }

  return (
    <section className="overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_45%,#eef6ff_100%)] py-12 dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <Badge className="mb-3 bg-sky-100 text-sky-700 hover:bg-sky-100 dark:bg-sky-500/15 dark:text-sky-200">
              Tour Packages
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl">
              Handpicked tour packages for every kind of journey
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
              Browse domestic and international holidays separately, then continue into curated adventure,
              trekking, camping, and bike expedition experiences.
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
            icon={<TentTree className="h-5 w-5" />}
            description="India journeys, state-wise circuits, heritage routes, beaches, hills, and spiritual escapes."
            accentClassName="bg-[linear-gradient(135deg,#0f766e_0%,#0f172a_58%,#082f49_100%)]"
          />
          <TourScopeCard
            title="International Tour Packages"
            href="/categories/tour-packages?scope=international"
            image={internationalTourPackages[0]?.heroImage ?? ''}
            count={internationalTourPackages.length}
            icon={<Globe2 className="h-5 w-5" />}
            description="Overseas holiday collections kept separate for easier discovery and planning."
            accentClassName="bg-[linear-gradient(135deg,#1d4ed8_0%,#312e81_60%,#0f172a_100%)]"
          />
        </div>

        {tourPackages.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
            {tourPackages.slice(0, 4).map((product) => (
              <PackageCard
                key={product.slug}
                product={product}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        ) : null}

        <div className="mt-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="mb-3 bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/15 dark:text-amber-200">
              Adventure Collection
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl">
              Adventure, trekking camps & bike expeditions
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
              One powerful collection for thrill-seekers, mountain lovers, campsite explorers, and riders.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 shadow-sm dark:bg-slate-900">
              <Mountain className="h-4 w-4 text-emerald-600" /> Adventure
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 shadow-sm dark:bg-slate-900">
              <TentTree className="h-4 w-4 text-amber-600" /> Camps
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 shadow-sm dark:bg-slate-900">
              <Bike className="h-4 w-4 text-blue-600" /> Bike Trips
            </span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
          {experienceProducts.slice(0, 8).map((product) => (
            <PackageCard
              key={product.slug}
              product={product}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
