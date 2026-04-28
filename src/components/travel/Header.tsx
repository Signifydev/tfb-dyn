'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, Heart, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { usePathname } from 'next/navigation';
import { CATEGORY_DEFINITIONS, getCategoryHref } from '@/lib/categories';
import { readWishlist, syncGlobalWishlistToUser } from '@/lib/wishlist-storage';
import {
  Map,
  Mountain,
  Bike,
  Tent,
  Landmark,
  Helicopter,
  Briefcase,
} from 'lucide-react';

type Category = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
};

const iconMap: Record<string, LucideIcon> = {
  'tour-packages': Map,
  'adventure-activities': Mountain,
  'bike-expeditions': Bike,
  'retreat-events': Mountain,
  'group-tours': Briefcase,
  'trekking-camps': Tent,
  'char-dham': Landmark,
  'yoga-meditation': Mountain,
  'helicopter-services': Helicopter,
  mice: Briefcase,
};

const categories: Category[] = CATEGORY_DEFINITIONS.filter((category) =>
  ['tour-packages', 'adventure-activities', 'bike-expeditions', 'retreat-events', 'group-tours', 'trekking-camps', 'char-dham', 'yoga-meditation', 'helicopter-services', 'mice'].includes(category.slug)
).map((category) => ({
  id: category.slug,
  label: category.name,
  href: getCategoryHref(category.slug),
  icon: iconMap[category.slug] || Map,
}));

function MobileMenu({ user, wishlistCount, signOut }: { user: any; wishlistCount: number; signOut: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const closeMenu = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full border border-slate-200 bg-white/80 text-slate-700 backdrop-blur md:hidden dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[86vw] max-w-sm overflow-y-auto px-0">
        <div className="border-b px-5 py-5">
          <Link href="/" onClick={closeMenu}>
            <Image src="/logo.png" alt="Logo" width={144} height={48} />
          </Link>
        </div>

        <div className="px-5 py-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Categories
          </p>
          <div className="space-y-2">
            {categories.map((cat) => {
              const Icon = cat.icon;

              return (
                <Link
                  key={cat.id}
                  href={cat.href}
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <Icon className="h-4 w-4 text-blue-600" />
                  <span>{cat.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="border-t px-5 py-5">
          {user ? (
            <div className="space-y-2">
              <Link href="/account/profile" onClick={closeMenu} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Profile
              </Link>
              <Link href="/account/bookings" onClick={closeMenu} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Bookings
              </Link>
              <Link href="/account/wishlist" onClick={closeMenu} className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <span>Wishlist</span>
                {wishlistCount > 0 && <Badge>{wishlistCount}</Badge>}
              </Link>
              <button
                onClick={() => {
                  closeMenu();
                  signOut();
                }}
                className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link href="/login" onClick={closeMenu} className="block">
                <Button className="w-full bg-[#2c2c2c]/40 text-white backdrop-blur-md border border-white/10 hover:bg-[#2c2c2c]/50">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" onClick={closeMenu} className="block">
                <Button className="w-full bg-[#2c2c2c]/40 text-white backdrop-blur-md border border-white/10 hover:bg-[#2c2c2c]/50">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Header() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateWishlistCount = () => {
      const items = user ? syncGlobalWishlistToUser(user.id) : readWishlist(null);
      setWishlistCount(items.length);
    };

    updateWishlistCount();
    window.addEventListener('storage', updateWishlistCount);
    window.addEventListener('tfb-wishlist-updated', updateWishlistCount);

    return () => {
      window.removeEventListener('storage', updateWishlistCount);
      window.removeEventListener('tfb-wishlist-updated', updateWishlistCount);
    };
  }, [user]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  return (
    <>
      {isHome && !scrolled && (
        <div className="absolute left-0 top-0 z-40 w-full">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-6">
            <Link href="/">
              <Image src="/logo.png" alt="Logo" width={144} height={48} className="h-auto w-[129.6px] sm:w-[144px]" />
            </Link>

            <div className="hidden items-center gap-3 md:flex">
              {user ? (
                <>
                  <Link href="/account/wishlist">
                    <Button variant="ghost" size="sm" className="relative">
                      <Heart className="h-4 w-4" />
                      {wishlistCount > 0 && (
                        <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs">
                          {wishlistCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <User className="mr-2 h-4 w-4" />
                        {user.email?.split('@')[0]}
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/account/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/account/bookings">Bookings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/staff-login-a7f3k">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Admin
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button className="bg-[#2c2c2c]/40 text-white backdrop-blur-md border border-white/10 hover:bg-[#2c2c2c]/50">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-[#2c2c2c]/40 text-white backdrop-blur-md border border-white/10 hover:bg-[#2c2c2c]/50">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden">
              <MobileMenu user={user} wishlistCount={wishlistCount} signOut={signOut} />
            </div>
          </div>

          <div className="mx-auto mt-1 hidden max-w-6xl rounded-2xl bg-white/80 px-4 py-4 shadow-lg backdrop-blur-md md:block md:px-6">
            <div className="flex justify-between gap-1">
              {categories.map((cat) => {
                const isActive = pathname.startsWith(cat.href);
                const Icon = cat.icon;

                return (
                  <Link
                    key={cat.id}
                    href={cat.href}
                    className={`flex items-center gap-2 rounded-full px-3 py-2 ${
                      isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{cat.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-3 px-4 md:hidden">
            <div className="flex gap-1 overflow-x-auto rounded-2xl bg-white/80 px-3 py-3 shadow-lg backdrop-blur-md">
              {categories.map((cat) => {
                const isActive = pathname.startsWith(cat.href);
                const Icon = cat.icon;

                return (
                  <Link
                    key={cat.id}
                    href={cat.href}
                    className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-medium ${
                      isActive ? 'bg-blue-100 text-blue-700' : 'bg-white text-slate-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="whitespace-nowrap">{cat.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div
        className={`fixed left-0 top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-950/92 ${
          isHome ? (scrolled ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-5 opacity-0') : 'opacity-100'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <MobileMenu user={user} wishlistCount={wishlistCount} signOut={signOut} />
            </div>
            <Link href="/">
              <Image src="/logo.png" alt="Logo" width={120} height={42} className="h-auto w-[108px] sm:w-[120px]" />
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center gap-2 md:flex">
            <button onClick={scrollLeft} className="h-8 w-8 rounded-full border">
              ‹
            </button>

            <div
              ref={scrollRef}
              className="flex max-w-[700px] gap-1 overflow-x-auto scroll-smooth no-scrollbar"
            >
              {categories.map((cat) => {
                const isActive = pathname.startsWith(cat.href);
                const Icon = cat.icon;

                return (
                  <Link
                    key={cat.id}
                    href={cat.href}
                    className={`flex items-center gap-2 rounded-full px-3 py-2 ${
                      isActive ? 'bg-blue-100 text-blue-600' : 'text-slate-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="whitespace-nowrap text-sm font-medium">{cat.label}</span>
                  </Link>
                );
              })}
            </div>

            <button onClick={scrollRight} className="h-8 w-8 rounded-full border">
              ›
            </button>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <Link href="/account/wishlist" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="relative">
                  <Heart className="h-4 w-4" />
                  {wishlistCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs">
                      {wishlistCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            ) : null}

            <Link href={user ? '/account/profile' : '/login'}>
              <Button size="sm" className={`px-3 sm:px-4 ${ !user ? 'bg-[#2c2c2c]/40 text-white backdrop-blur-md border border-white/10 hover:bg-[#2c2c2c]/50' : ''}`}>
                <span className="hidden sm:inline">{user ? 'My Account' : 'Login / Signup'}</span>
                <span className="sm:hidden">{user ? 'Account' : 'Login'}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
