'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchFeaturedProducts } from '@/lib/api/products-client';
import type { Product } from '@/lib/products';

export function FeaturedPackages() {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    void fetchFeaturedProducts().then(setProducts);
    const saved = localStorage.getItem('wishlist_global');
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  const toggleWishlist = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
    const updated = wishlist.includes(slug)
      ? wishlist.filter((s) => s !== slug)
      : [...wishlist, slug];
    localStorage.setItem('wishlist_global', JSON.stringify(updated));
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-slate-900 md:text-3xl">Featured Packages</h2>
            <p className="text-slate-600">Handpicked experiences loved by travelers</p>
          </div>
          <Link href="/search">
            <Button variant="outline" className="w-full sm:w-auto">View All Packages</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <Link key={product.slug} href={`/products/${product.slug}`}>
              <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={product.heroImage}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={(e) => toggleWishlist(product.slug, e)}
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-white md:right-3 md:top-3"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        wishlist.includes(product.slug) ? 'fill-red-500 text-red-500' : 'text-slate-600'
                      }`}
                    />
                  </button>
                  {product.featured && (
                    <Badge className="absolute left-2 top-2 bg-amber-500 md:left-3 md:top-3">Featured</Badge>
                  )}
                </div>

                <CardContent className="p-3 md:p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-slate-500" />
                    <span className="line-clamp-1 text-[11px] text-slate-500 md:text-xs">{product.location}</span>
                  </div>

                  <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-blue-600 md:text-base">
                    {product.title}
                  </h3>

                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium md:text-sm">{product.rating}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 md:text-sm">({product.reviews})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-blue-600 md:text-lg">
                        Rs.{product.price.toLocaleString()}
                      </span>
                      <span className="ml-1 text-[11px] text-slate-400 line-through md:ml-2 md:text-sm">
                        Rs.{product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 md:text-xs">
                    <Users className="h-3 w-3" />
                    <span className="line-clamp-1">{product.groupSize}</span>
                    <span className="mx-1">•</span>
                    <span className="line-clamp-1">{product.duration}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
