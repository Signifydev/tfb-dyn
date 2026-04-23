import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Globe2, MapPin, TentTree } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/products';
import {
  buildTourPackageStateCollections,
  isInternationalTourPackage,
  sortTourPackageProducts,
} from '@/lib/tour-packages';

interface TourPackagesHubProps {
  products: Product[];
}

function ScopeCard({
  title,
  href,
  image,
  count,
  description,
  icon,
  accentClassName,
}: {
  title: string;
  href: string;
  image: string;
  count: number;
  description: string;
  icon: React.ReactNode;
  accentClassName: string;
}) {
  return (
    <Link href={href} className="group block">
      <div className="relative h-60 overflow-hidden rounded-[2rem] md:h-72">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`absolute inset-0 ${accentClassName}`} />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.16)_0%,rgba(15,23,42,0.82)_100%)]" />
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <Badge className="border-white/20 bg-white/15 text-white backdrop-blur">
              {count} packages
            </Badge>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur">
              {icon}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">{title}</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/80 md:text-base">
              {description}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
              Explore
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function StateCard({
  name,
  href,
  image,
  count,
  packages,
}: {
  name: string;
  href: string;
  image: string;
  count: number;
  packages: string[];
}) {
  return (
    <Link href={href} className="group block">
      <div className="relative h-52 overflow-hidden rounded-[1.75rem] md:h-64">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.78)_100%)]" />
        <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <Badge className="border-white/20 bg-white/15 text-white backdrop-blur">
              {count} packages
            </Badge>
            <div className="rounded-full border border-white/20 bg-white/10 p-2 text-white backdrop-blur">
              <MapPin className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white md:text-2xl">{name}</h3>
            <p className="mt-2 line-clamp-2 max-w-sm text-sm leading-6 text-white/80">
              {packages.join(' • ')}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
              View packages
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function TourPackagesHub({ products }: TourPackagesHubProps) {
  const sortedProducts = sortTourPackageProducts(products);
  const domesticProducts = sortedProducts.filter((product) => !isInternationalTourPackage(product));
  const internationalProducts = sortedProducts.filter((product) => isInternationalTourPackage(product));
  const stateCollections = buildTourPackageStateCollections(domesticProducts);
  const domesticHeroImage = domesticProducts[0]?.heroImage ?? '';
  const internationalHeroImage = internationalProducts[0]?.heroImage ?? '';

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_25%,#ffffff_100%)] pb-16 pt-24 dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_32%,#111827_100%)] md:pt-28">
      <div className="container mx-auto px-4">
        <section className="grid gap-5 lg:grid-cols-2">
          <ScopeCard
            title="Domestic Tour Packages"
            href="/categories/tour-packages?scope=domestic"
            image={domesticHeroImage}
            count={domesticProducts.length}
            description="Browse India journeys by destination and state."
            icon={<TentTree className="h-5 w-5" />}
            accentClassName="bg-[linear-gradient(135deg,#0f766e_0%,#0f172a_58%,#082f49_100%)]"
          />
          <ScopeCard
            title="International Tour Packages"
            href="/categories/tour-packages?scope=international"
            image={internationalHeroImage}
            count={internationalProducts.length}
            description="Browse overseas holidays separately from domestic trips."
            icon={<Globe2 className="h-5 w-5" />}
            accentClassName="bg-[linear-gradient(135deg,#1d4ed8_0%,#312e81_60%,#0f172a_100%)]"
          />
        </section>

        <section className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-50 md:text-3xl">
              Domestic Tour Packages
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Explore tour packages by state.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stateCollections.map((collection) => (
              <StateCard
                key={collection.id}
                name={collection.name}
                href={`/categories/tour-packages?state=${encodeURIComponent(collection.name)}`}
                image={collection.heroImage}
                count={collection.products.length}
                packages={collection.products.slice(0, 2).map((product) => product.title)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
