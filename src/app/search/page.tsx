'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PackageList } from '@/components/travel/PackageList';
import { fetchAllProducts } from '@/lib/api/products-client';
import {
  filterProductsList,
  getAvailableCitiesFromProducts,
  type Product,
} from '@/lib/products';
import { CATEGORY_DEFINITIONS } from '@/lib/categories';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const city = searchParams.get('city') || 'all';

  const [searchQuery, setSearchQuery] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedCity, setSelectedCity] = useState(city);
  const [products, setProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);

  const cities = useMemo(() => getAvailableCitiesFromProducts(products), [products]);

  useEffect(() => {
    void fetchAllProducts().then(setProducts);
  }, []);

  useEffect(() => {
    setSearchQuery(query);
    setSelectedCategory(category);
    setSelectedCity(city);

    setResults(
      filterProductsList(products, {
        query,
        category: category === 'all' ? undefined : category,
        city: city === 'all' ? undefined : city,
      })
    );
  }, [products, query, category, city]);

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

  const hasSearchContext = Boolean(query || category !== 'all' || city !== 'all');

  return (
    <div className="min-h-screen bg-slate-50 px-0 pb-8 pt-28 md:pt-32">
      <div className="container mx-auto px-4">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[1.3fr_0.85fr_0.85fr_auto]">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Search packages
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search packages, destinations, experiences..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 pl-10 text-base"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {CATEGORY_DEFINITIONS.map((item) => (
                      <SelectItem key={item.slug} value={item.slug}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  City
                </label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="All cities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All cities</SelectItem>
                    {cities.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <ButtonLikeSubmit />
              </div>
            </div>
          </form>
        </div>

        {hasSearchContext ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">
                Search Results
              </h1>
              <p className="mt-1 text-slate-600">
                Found {results.length} {results.length === 1 ? 'package' : 'packages'}
                {query ? ` for "${query}"` : ''}
              </p>
            </div>

            {results.length > 0 ? (
              <PackageList products={results} showFilters />
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white py-16 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-slate-900">No packages found</h2>
                <p className="text-slate-600">
                  Try a different category, city, or keyword combination.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <h2 className="mb-2 text-xl font-semibold text-slate-900">
              Search for your dream trip
            </h2>
            <p className="text-slate-600">
              Use category, city, and keyword filters to explore packages on a separate results page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ButtonLikeSubmit() {
  return (
    <button
      type="submit"
      className="inline-flex h-12 w-full items-center justify-center rounded-md bg-blue-600 px-6 text-sm font-medium text-white transition-colors hover:bg-blue-700"
    >
      Search
    </button>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchLoading() {
  return (
    <div className="min-h-screen bg-slate-50 px-0 pb-8 pt-28 md:pt-32">
      <div className="container mx-auto px-4">
        <div className="mb-8 rounded-3xl bg-white p-6">
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
