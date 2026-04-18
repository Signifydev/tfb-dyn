import { supabase } from '@/lib/supabase';

export interface CtaBanner {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  offerText?: string;
  buttonLabel: string;
  buttonHref: string;
  imageUrl: string;
  badge?: string;
  placement: string;
}

const DEFAULT_HOME_CTA: CtaBanner = {
  id: 'char-dham-home-cta',
  slug: 'char-dham-yatra-offer',
  title: 'Char Dham Yatra 2026',
  subtitle: 'Upcoming high-demand departure',
  description:
    'Reserve your Char Dham tour package early with curated stays, guided support, and priority planning for the coming season.',
  offerText: 'Limited Offer: Save up to 20% on early bookings',
  buttonLabel: 'Explore Char Dham Packages',
  buttonHref: '/categories/char-dham',
  imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600',
  badge: 'Upcoming Demand',
  placement: 'home_between_featured_destinations',
};

function mapCtaBanner(data: Record<string, any>): CtaBanner {
  return {
    id: String(data.id ?? data.slug ?? DEFAULT_HOME_CTA.id),
    slug: String(data.slug ?? DEFAULT_HOME_CTA.slug),
    title: String(data.title ?? DEFAULT_HOME_CTA.title),
    subtitle: data.subtitle ?? data.sub_title ?? DEFAULT_HOME_CTA.subtitle,
    description: String(data.description ?? DEFAULT_HOME_CTA.description),
    offerText: data.offer_text ?? data.offerText ?? DEFAULT_HOME_CTA.offerText,
    buttonLabel: String(data.button_label ?? data.buttonLabel ?? DEFAULT_HOME_CTA.buttonLabel),
    buttonHref: String(data.button_href ?? data.buttonHref ?? DEFAULT_HOME_CTA.buttonHref),
    imageUrl: String(data.image_url ?? data.imageUrl ?? DEFAULT_HOME_CTA.imageUrl),
    badge: data.badge ?? data.tag ?? DEFAULT_HOME_CTA.badge,
    placement: String(data.placement ?? DEFAULT_HOME_CTA.placement),
  };
}

export async function getHomepageCta(): Promise<CtaBanner> {
  try {
    const { data, error } = await supabase
      .from('cta_banners')
      .select('*')
      .limit(10);

    if (error) {
      if (error.code !== 'PGRST205') {
        console.error('Error fetching CTA banners:', error);
      }
      return DEFAULT_HOME_CTA;
    }

    const banners = (data ?? []) as Record<string, any>[];
    const selected =
      banners.find((item) => item.is_active !== false && item.placement === DEFAULT_HOME_CTA.placement) ??
      banners.find((item) => item.is_active !== false) ??
      null;

    return selected ? mapCtaBanner(selected) : DEFAULT_HOME_CTA;
  } catch (error) {
    console.error('Unexpected CTA banner fetch error:', error);
    return DEFAULT_HOME_CTA;
  }
}
