import {
  dispatchBrowserEvent,
  readLocalStorage,
  removeLocalStorage,
  writeLocalStorage,
} from '@/lib/browser-storage';

export const WISHLIST_UPDATED_EVENT = 'tfb-wishlist-updated';

export function getWishlistStorageKey(userId?: string | null) {
  return userId ? `wishlist_${userId}` : 'wishlist_global';
}

export function readWishlist(userId?: string | null) {
  if (typeof window === 'undefined') {
    return [];
  }

  const key = getWishlistStorageKey(userId);
  const saved = readLocalStorage(key);

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function writeWishlist(items: string[], userId?: string | null) {
  if (typeof window === 'undefined') {
    return;
  }

  const uniqueItems = Array.from(new Set(items));
  const key = getWishlistStorageKey(userId);
  writeLocalStorage(key, JSON.stringify(uniqueItems));
  dispatchBrowserEvent(WISHLIST_UPDATED_EVENT, {
    userId: userId || null,
    items: uniqueItems,
  });
}

export function toggleWishlistItem(slug: string, userId?: string | null) {
  const currentItems = readWishlist(userId);
  const nextItems = currentItems.includes(slug)
    ? currentItems.filter((item) => item !== slug)
    : [...currentItems, slug];

  writeWishlist(nextItems, userId);
  return nextItems;
}

export function syncGlobalWishlistToUser(userId?: string | null) {
  if (!userId || typeof window === 'undefined') {
    return readWishlist(userId);
  }

  const userItems = readWishlist(userId);
  const globalItems = readWishlist(null);
  const mergedItems = Array.from(new Set([...userItems, ...globalItems]));

  writeWishlist(mergedItems, userId);

  if (globalItems.length > 0) {
    removeLocalStorage(getWishlistStorageKey(null));
  }

  return mergedItems;
}
