import Link from 'next/link';
import { getCategories } from '@/lib/api/categories';
import { getCategoryHref } from '@/lib/categories';
import {
  Map,
  Users,
  Mountain,
  Tent,
  Bike,
  Church,
  Plane,
  Building2,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  'tour-packages': Map,
  'group-tours': Users,
  'adventure-activities': Mountain,
  'trekking-camps': Tent,
  'bike-expeditions': Bike,
  'char-dham': Church,
  'helicopter-services': Plane,
  mice: Building2,
};

export default async function CategoryTabs() {
  const categories = await getCategories();

  return (
    <section className="bg-slate-50 py-10 dark:bg-slate-950/40 md:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">
            Explore by Category
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Find your perfect trip from our diverse range of experiences
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categories.map((cat) => {
            const Icon = iconMap[cat.slug] || Map;

            return (
              <Link key={cat.id} href={getCategoryHref(cat.slug)}>
                <div className="flex h-full flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-4 text-center text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 md:px-6">
                  <Icon className="h-5 w-5 md:h-6 md:w-6" />
                  <span className="text-xs font-medium leading-snug md:text-sm">
                    {cat.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
