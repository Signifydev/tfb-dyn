import { supabase } from '@/lib/supabase';
import { getCategoryQuerySlugs, resolveCategory } from '@/lib/categories';
import {
  Product,
  getAllProducts as getLocalAllProducts,
  getProductBySlug as getLocalProductBySlug,
  getProductsByCategory as getLocalProductsByCategory,
} from '@/lib/products';

const ACTIVE_PRODUCT_FILTER = 'is_active.is.null,is_active.eq.true';

// Helper to map DB → UI
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

// Get by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product by slug:', error);
  }

  return data ? mapProduct(data) : getLocalProductBySlug(slug) ?? null;
}

// Get featured
export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('featured', true)
    .or(ACTIVE_PRODUCT_FILTER);

  if (error) {
    console.error('Error fetching featured products:', error);
  }

  return data?.map(mapProduct) || [];
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('itineraries')
    .select('*')
    .or(ACTIVE_PRODUCT_FILTER);

  if (error) {
    console.error('Error fetching all products:', error);
  }

  const products = data?.map(mapProduct) || [];

  return products.length > 0 ? products : getLocalAllProducts();
}

// Get by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const categorySlugs = getCategoryQuerySlugs(category);
  const { data, error } = await supabase
    .from('itineraries')
    .select('*')
    .in('category', categorySlugs)
    .or(ACTIVE_PRODUCT_FILTER);

  if (error) {
    console.error('Error fetching products by category:', error);
  }

  const products = data?.map(mapProduct) || [];

  return products.length > 0 ? products : getLocalProductsByCategory(categorySlugs[0]);
}
