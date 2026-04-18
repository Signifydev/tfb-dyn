'use client';

import { useEffect, useState } from 'react';
import { Check, Clock3, Compass, MessageCircleQuestion } from 'lucide-react';

const items = [
  { id: 'overview', label: 'Overview', icon: Compass },
  { id: 'itinerary', label: 'Itinerary', icon: Clock3 },
  { id: 'inclusions', label: 'Inclusions', icon: Check },
  { id: 'faq', label: 'FAQs', icon: MessageCircleQuestion },
];

export default function ProductStickyNav() {
  const [activeId, setActiveId] = useState('overview');
  const [visibleIds, setVisibleIds] = useState<string[]>(items.map((item) => item.id));

  useEffect(() => {
    setVisibleIds(
      items
        .filter((item) => document.getElementById(item.id))
        .map((item) => item.id)
    );

    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: [0.2, 0.4, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  return (
    <div className="sticky top-[60px] z-[45] w-full border-b border-slate-200/80 bg-white/92 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-950/92 md:top-[72px]">
      <div className="container mx-auto px-4">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent dark:from-slate-950 md:hidden" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent dark:from-slate-950 md:hidden" />

          <div className="flex gap-2 overflow-x-auto py-2.5 no-scrollbar md:gap-3 md:py-3">
            {items
              .filter((item) => visibleIds.includes(item.id))
              .map((item) => {
              const Icon = item.icon;
              const isActive = activeId === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`group relative inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'border-sky-200 bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] text-white shadow-[0_12px_30px_rgba(29,78,216,0.28)]'
                      : 'border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-sky-200 hover:text-slate-950 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-sky-400/60 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-transform duration-300 ${
                      isActive ? 'scale-100 text-sky-100' : 'text-sky-700 dark:text-sky-300 group-hover:scale-110'
                    }`}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute inset-0 rounded-full ring-1 ring-white/20" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
