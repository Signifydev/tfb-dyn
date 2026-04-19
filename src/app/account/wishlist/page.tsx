'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Star, MapPin, Users, Trash2 } from 'lucide-react';
import { getProductBySlug, type Product } from '@/lib/products';
import { readWishlist, syncGlobalWishlistToUser, writeWishlist } from '@/lib/wishlist-storage';

export default function WishlistPage() {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void loadWishlist();
  }, [user]);

  useEffect(() => {
    const handleWishlistChange = () => {
      void loadWishlist();
    };

    window.addEventListener('storage', handleWishlistChange);
    window.addEventListener('tfb-wishlist-updated', handleWishlistChange);

    return () => {
      window.removeEventListener('storage', handleWishlistChange);
      window.removeEventListener('tfb-wishlist-updated', handleWishlistChange);
    };
  }, [user]);

  const loadWishlist = async () => {
    setIsLoading(true);
    try {
      const slugs = user ? syncGlobalWishlistToUser(user.id) : readWishlist(null);
      const products = slugs
        .map((slug) => getProductBySlug(slug))
        .filter(Boolean) as Product[];
      setWishlistItems(products);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (slug: string) => {
    setWishlistItems((prev) => prev.filter((p) => p.slug !== slug));

    const currentItems = user ? readWishlist(user.id) : readWishlist(null);
    writeWishlist(
      currentItems.filter((item) => item !== slug),
      user?.id
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
          <Heart className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Your wishlist is empty</h2>
        <p className="text-slate-600 mb-6">
          Save packages you like to plan your perfect trip later
        </p>
        <Link href="/">
          <Button>Explore Packages</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">
        My Wishlist ({wishlistItems.length})
      </h2>

      <div className="grid grid-cols-2 gap-3 md:gap-6">
        {wishlistItems.map((product) => (
          <Card key={product.slug} className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-48 h-40 sm:h-auto">
                <Image
                  src={product.heroImage}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 line-clamp-1">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                      <MapPin className="h-3 w-3" />
                      <span>{product.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400">({product.reviews})</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromWishlist(product.slug)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                  <Users className="h-3 w-3" />
                  <span>{product.groupSize}</span>
                  <span className="mx-1">•</span>
                  <span>{product.duration}</span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="text-lg font-bold text-blue-600">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-slate-400 line-through ml-1">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <Link href={`/products/${product.slug}`}>
                    <Button size="sm">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
