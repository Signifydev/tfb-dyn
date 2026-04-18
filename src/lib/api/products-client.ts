import { supabase } from '@/integrations/supabase/client';
import { resolveCategory } from '@/lib/categories';
import {
  getAllProducts as getLocalAllProducts,
  getFeaturedProducts as getLocalFeaturedProducts,
  getProductBySlug as getLocalProductBySlug,
  type Product,
} from '@/lib/products';

const ACTIVE_PRODUCT_FILTER = 'is_active.is.null,is_active.eq.true';

function mapProduct(data: any): Product {
  const normalizedCategory = resolveCategory(data.category)?.slug ?? data.category;

  return {
    ...data,
    category: normalizedCategory,
    heroImage: data.hero_image,
    originalPrice: data.original_price,
    groupSize: data.group_size,
  };
}

export async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('itineraries')
    .select('*')
    .or(ACTIVE_PRODUCT_FILTER);

  if (error) {
    console.error('Error fetching all products on client:', error);
  }

  const products = data?.map(mapProduct) || [];

  return products.length > 0 ? products : getLocalAllProducts();
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('featured', true)
    .or(ACTIVE_PRODUCT_FILTER);

  if (error) {
    console.error('Error fetching featured products on client:', error);
  }

  const products = data?.map(mapProduct) || [];

  return products.length > 0 ? products : getLocalFeaturedProducts();
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product by slug on client:', error);
  }

  return data ? mapProduct(data) : getLocalProductBySlug(slug) ?? null;
}
