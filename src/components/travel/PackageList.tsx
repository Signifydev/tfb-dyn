'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Star, Heart, MapPin, Users, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Product } from '@/lib/products';
import { readWishlist, toggleWishlistItem, syncGlobalWishlistToUser } from '@/lib/wishlist-storage';

interface PackageListProps {
  products: Product[];
  showFilters?: boolean;
}

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

export function PackageList({ products: initialProducts, showFilters = true }: PackageListProps) {
  const { user } = useAuth();
  const maxPrice = useMemo(
    () => Math.max(100000, ...initialProducts.map((product) => product.price)),
    [initialProducts]
  );
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [sortBy, setSortBy] = useState('popularity');
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  useEffect(() => {
    const applyWishlist = () => {
      const items = user ? syncGlobalWishlistToUser(user.id) : readWishlist(null);
      setWishlist(items);
    };

    applyWishlist();
    window.addEventListener('storage', applyWishlist);
    window.addEventListener('tfb-wishlist-updated', applyWishlist);

    return () => {
      window.removeEventListener('storage', applyWishlist);
      window.removeEventListener('tfb-wishlist-updated', applyWishlist);
    };
  }, [user]);

  useEffect(() => {
    setProducts(initialProducts);
    setPriceRange((currentRange) => [0, Math.max(currentRange[1], maxPrice)]);
  }, [initialProducts, maxPrice]);

  const toggleWishlist = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleWishlistItem(slug, user?.id);
    setWishlist(updated);
  };

  const filteredProducts = products
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter((p) => !showOnlyFeatured || p.featured)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return b.reviews - a.reviews;
      }
    });

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <Label className="mb-3 block text-base font-semibold">Price Range</Label>
        <Slider
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          min={0}
          max={maxPrice}
          step={500}
          className="mt-2"
        />
        <div className="mt-2 flex justify-between text-sm text-slate-600 dark:text-slate-300">
          <span>Rs.{priceRange[0].toLocaleString()}</span>
          <span>Rs.{priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Options</Label>
        <div className="flex items-center gap-2">
          <Checkbox
            id="featured"
            checked={showOnlyFeatured}
            onCheckedChange={(checked) => setShowOnlyFeatured(checked as boolean)}
          />
          <Label htmlFor="featured" className="cursor-pointer font-normal">
            Featured only
          </Label>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setPriceRange([0, maxPrice]);
          setShowOnlyFeatured(false);
        }}
      >
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-300 md:text-base">
          <span className="font-semibold text-slate-900 dark:text-slate-100">{filteredProducts.length}</span> packages found
        </p>
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-11 flex-1 sm:w-48 sm:flex-none">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {showFilters && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-11 w-11 md:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      <div className="flex gap-6 lg:gap-8">
        {showFilters && (
          <div className="hidden w-64 flex-shrink-0 md:block">
            <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900/90 lg:p-6">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <Filter className="h-4 w-4" />
                Filters
              </h3>
              <FiltersContent />
            </div>
          </div>
        )}

        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="mb-4 text-slate-500 dark:text-slate-400">No packages match your filters</p>
              <Button
                variant="outline"
                onClick={() => {
                  setPriceRange([0, maxPrice]);
                  setShowOnlyFeatured(false);
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:gap-6 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <Link key={product.slug} href={`/products/${product.slug}`}>
                  <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/90">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={product.heroImage}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <button
                        onClick={(e) => toggleWishlist(product.slug, e)}
                        className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-800 md:right-3 md:top-3"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            wishlist.includes(product.slug) ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-300'
                          }`}
                        />
                      </button>
                      {product.featured && (
                        <Badge className="absolute left-2 top-2 bg-amber-500 md:left-3 md:top-3">Featured</Badge>
                      )}
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
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium md:text-sm">{product.rating}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 md:text-sm">({product.reviews})</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-bold text-blue-600 md:text-lg">
                            Rs.{product.price.toLocaleString()}
                          </span>
                          <span className="ml-1 text-[11px] text-slate-400 line-through dark:text-slate-500 md:text-sm">
                            Rs.{product.originalPrice.toLocaleString()}
                          </span>
                        </div>
                        <span className="hidden text-xs font-medium text-green-600 md:inline">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400 md:text-xs">
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
          )}
        </div>
      </div>
    </div>
  );
}
