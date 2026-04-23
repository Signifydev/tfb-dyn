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
  Helicopter,
  Building2,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  'tour-packages': Map,
  'group-tours': Users,
  'adventure-activities': Mountain,
  'trekking-camps': Tent,
  'bike-expeditions': Bike,
  'char-dham': Church,
  'helicopter-services': Helicopter,
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

        <div className="no-scrollbar -mx-2 flex gap-3 overflow-x-auto scroll-smooth px-2 py-2">
          {categories.map((cat) => {
            const Icon = iconMap[cat.slug] || Map;

            return (
              <Link
                key={cat.id}
                href={getCategoryHref(cat.slug)}
                className="group flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-700 dark:hover:bg-slate-800 dark:hover:text-sky-200 md:px-5"
              >
                <Icon className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                <span className="whitespace-nowrap text-sm font-medium">
                    {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
