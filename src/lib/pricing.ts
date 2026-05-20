import type { Product } from '@/lib/products';

export function hasTrekkingGstNote(product: Pick<Product, 'category' | 'subcategory'>): boolean {
  return product.category === 'trekking-camps' || product.subcategory.toLowerCase().includes('trekking');
}
