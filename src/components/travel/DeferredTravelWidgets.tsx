'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const PromoPopup = dynamic(
  () => import('@/components/travel/PromoPopup').then((mod) => mod.PromoPopup),
  { ssr: false }
);

const LeadChatbot = dynamic(
  () => import('@/components/travel/LeadChatbot').then((mod) => mod.LeadChatbot),
  { ssr: false }
);

export function DeferredTravelWidgets() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsReady(true);
    }, 800);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <>
      <PromoPopup />
      <LeadChatbot />
    </>
  );
}
