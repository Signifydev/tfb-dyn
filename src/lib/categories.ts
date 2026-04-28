export interface CategoryDefinition {
  slug: string;
  name: string;
  description: string;
  icon: string;
  aliases?: string[];
}

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    slug: 'tour-packages',
    name: 'Tour Packages',
    description: 'Domestic & International',
    icon: 'Map',
  },
  {
    slug: 'group-tours',
    name: 'Group Tours',
    description: 'Guided group experiences',
    icon: 'Users',
  },
  {
    slug: 'adventure-activities',
    name: 'Adventure Activities',
    description: 'Thrilling experiences',
    icon: 'Mountain',
    aliases: ['adventure'],
  },
  {
    slug: 'trekking-camps',
    name: 'Trekking & Camps',
    description: 'Mountain adventures',
    icon: 'Tent',
  },
  {
    slug: 'bike-expeditions',
    name: 'Bike Expeditions',
    description: 'Motorcycle tours',
    icon: 'Bike',
    aliases: ['bike-expedition'],
  },
  {
    slug: 'char-dham',
    name: 'CharDham Yatra',
    description: 'Sacred pilgrimages',
    icon: 'Temple',
    aliases: ['chardham-yatra'],
  },
  {
    slug: 'retreat-events',
    name: 'Retreat & Events',
    description: 'Corporate retreats & celebrations',
    icon: 'Sparkles',
  },
  {
    slug: 'yoga-meditation',
    name: 'Yoga & Meditation',
    description: 'Wellness retreats',
    icon: 'Zap',
  },
  {
    slug: 'helicopter-services',
    name: 'Helicopter Services',
    description: 'Aerial tours',
    icon: 'Helicopter',
    aliases: ['helicopter'],
  },
  {
    slug: 'mice',
    name: 'MICE',
    description: 'Corporate events',
    icon: 'Building',
  },
];

const CATEGORY_LOOKUP = new Map<string, CategoryDefinition>(
  CATEGORY_DEFINITIONS.flatMap((category) => [
    [category.slug, category] as const,
    ...category.aliases?.map((alias) => [alias, category] as const) ?? [],
  ]),
);

export function resolveCategory(categorySlug: string): CategoryDefinition | undefined {
  return CATEGORY_LOOKUP.get(categorySlug);
}

export function getCategoryQuerySlugs(categorySlug: string): string[] {
  const category = resolveCategory(categorySlug);

  if (!category) {
    return [categorySlug];
  }

  return [category.slug, ...(category.aliases ?? [])];
}

export function getCategoryHref(categorySlug: string): string {
  const resolved = resolveCategory(categorySlug);
  const slug = resolved?.slug ?? categorySlug;

  return `/categories/${slug}`;
}
