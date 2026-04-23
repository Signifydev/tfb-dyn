import type { Product, ProductDestination } from '@/lib/products';

export interface TourPackageStateCollection {
  id: string;
  name: string;
  heroImage: string;
  products: Product[];
}

const INTERNATIONAL_KEYWORDS = [
  'bali',
  'bangkok',
  'bhutan',
  'dubai',
  'europe',
  'indonesia',
  'malaysia',
  'maldives',
  'nepal',
  'phuket',
  'singapore',
  'sri lanka',
  'switzerland',
  'thailand',
  'vietnam',
];

const FALLBACK_STATE_MATCHERS: Array<{ name: string; terms: string[] }> = [
  { name: 'Gujarat', terms: ['gujarat', 'ahmedabad', 'dwarka', 'somnath', 'gir', 'diu', 'bhuj'] },
  { name: 'Kerala', terms: ['kerala', 'kochi', 'alleppey', 'munnar'] },
  { name: 'Rajasthan', terms: ['rajasthan', 'jaipur', 'jodhpur', 'udaipur', 'jaisalmer', 'pushkar', 'mount abu'] },
  { name: 'Goa', terms: ['goa', 'calangute', 'baga', 'palolem'] },
  { name: 'Andaman & Nicobar', terms: ['andaman', 'nicobar', 'havelock', 'port blair'] },
  { name: 'Uttarakhand', terms: ['uttarakhand', 'dehradun', 'rishikesh', 'haridwar'] },
  { name: 'Himachal Pradesh', terms: ['himachal', 'spiti', 'manali', 'shimla'] },
  { name: 'Ladakh', terms: ['ladakh', 'leh', 'pangong', 'nubra'] },
  { name: 'Sikkim', terms: ['sikkim', 'yuksom', 'goechala'] },
];

function includesAny(product: Product, terms: string[]) {
  const haystack = `${product.title} ${product.location} ${product.description}`.toLowerCase();
  return terms.some((term) => haystack.includes(term));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeValue(value?: string | null) {
  return value?.trim().toLowerCase() ?? '';
}

function sortDestinations(destinations: ProductDestination[]) {
  return [...destinations].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

function getFallbackStateLabels(product: Product) {
  return FALLBACK_STATE_MATCHERS.filter((matcher) => includesAny(product, matcher.terms)).map(
    (matcher) => matcher.name
  );
}

export function sortTourPackageProducts(products: Product[]) {
  return [...products].sort((a, b) => b.reviews - a.reviews || b.rating - a.rating);
}

export function isInternationalTourPackage(product: Product) {
  if (normalizeValue(product.scope) === 'international') {
    return true;
  }

  if (normalizeValue(product.scope) === 'domestic') {
    return false;
  }

  if (Array.isArray(product.destinations) && product.destinations.length > 0) {
    return product.destinations.some((destination) => normalizeValue(destination.country) !== 'india');
  }

  const subcategory = product.subcategory.toLowerCase();

  if (
    subcategory.includes('international') ||
    subcategory.includes('overseas') ||
    subcategory.includes('global')
  ) {
    return true;
  }

  return includesAny(product, INTERNATIONAL_KEYWORDS);
}

export function getTourPackageStateLabels(product: Product) {
  const destinations = Array.isArray(product.destinations) ? sortDestinations(product.destinations) : [];
  const destinationStates = destinations
    .filter((destination) => normalizeValue(destination.country) === 'india' && destination.state)
    .map((destination) => destination.state!.trim());

  const uniqueDestinationStates = [...new Set(destinationStates)];

  if (uniqueDestinationStates.length > 0) {
    return uniqueDestinationStates;
  }

  const fallbackStates = getFallbackStateLabels(product);

  if (fallbackStates.length > 0) {
    return [...new Set(fallbackStates)];
  }

  return product.location ? [product.location] : [];
}

export function buildTourPackageStateCollections(products: Product[]): TourPackageStateCollection[] {
  const grouped = new Map<string, TourPackageStateCollection>();

  for (const product of sortTourPackageProducts(products)) {
    const stateLabels = getTourPackageStateLabels(product);

    for (const stateLabel of stateLabels) {
      const existingCollection = grouped.get(stateLabel);

      if (existingCollection) {
        if (!existingCollection.products.some((existingProduct) => existingProduct.slug === product.slug)) {
          existingCollection.products.push(product);
        }
        continue;
      }

      grouped.set(stateLabel, {
        id: slugify(stateLabel),
        name: stateLabel,
        heroImage: product.heroImage,
        products: [product],
      });
    }
  }

  return [...grouped.values()].sort(
    (a, b) => b.products.length - a.products.length || a.name.localeCompare(b.name)
  );
}
