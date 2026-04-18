import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PackageList } from '@/components/travel/PackageList';
import { getCategories } from '@/lib/api/categories';
import { getProductsByCategory } from '@/lib/api/products';
import { resolveCategory } from '@/lib/categories';

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categoryParam } = await params;
  const categories = await getCategories();
  const category =
    resolveCategory(categoryParam) ||
    categories.find((item) => item.slug === categoryParam || item.id === categoryParam);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${category.name} | Travel For Benefits`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categoryParam } = await params;
  const categories = await getCategories();
  const category =
    resolveCategory(categoryParam) ||
    categories.find((item) => item.slug === categoryParam || item.id === categoryParam);

  const products = await getProductsByCategory(category?.slug ?? categoryParam);

  if (!category && products.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-8 pt-24 md:pt-28">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {category?.name ?? categoryParam.replace(/-/g, ' ')}
          </h1>
          <p className="text-slate-600">
            {category?.description ?? 'Explore curated travel packages in this category.'}
          </p>
        </div>

        <PackageList products={products} />
      </div>
    </div>
  );
}
