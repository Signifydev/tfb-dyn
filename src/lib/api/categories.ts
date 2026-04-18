import { supabase } from '@/lib/supabase';
import { CATEGORY_DEFINITIONS, resolveCategory } from '@/lib/categories';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return CATEGORY_DEFINITIONS.map((category) => ({
      id: category.slug,
      name: category.name,
      slug: category.slug,
    }));
  }

  const normalized = (data || []).map((category) => {
    const resolved = resolveCategory(category.slug);

    return {
      id: resolved?.slug ?? category.id,
      name: resolved?.name ?? category.name,
      slug: resolved?.slug ?? category.slug,
    };
  });

  return normalized.length > 0
    ? Array.from(new Map(normalized.map((category) => [category.slug, category])).values())
    : CATEGORY_DEFINITIONS.map((category) => ({
        id: category.slug,
        name: category.name,
        slug: category.slug,
      }));
}
