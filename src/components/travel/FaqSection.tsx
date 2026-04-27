'use client';

import Image from 'next/image';
import { MessageCircleQuestion } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';

const FAQ_ITEMS = [
  {
    question: 'What are the best tour packages available in India?',
    answer:
      'India offers a wide variety of tour packages for every kind of traveler. Popular choices include Himalayan hill station tours like Shimla, Manali, and Darjeeling, spiritual journeys such as Char Dham Yatra, adventure trips to Ladakh and Spiti Valley, beach holidays in Goa and Andaman, and cultural circuits across Rajasthan and Varanasi. The right package depends on your travel style, budget, and the kind of experience you want.',
  },
  {
    question: 'How do I choose the right travel package for my trip?',
    answer:
      'The best package depends on your destination, trip duration, budget, travel season, and group size. Travelers seeking relaxation usually prefer hill stations or beach escapes, while adventure lovers often choose trekking routes or bike expeditions. Families generally benefit from comfortable itineraries with less travel time, while couples may prefer romantic and scenic destinations.',
  },
  {
    question: 'What is included in your tour packages?',
    answer:
      'Most tour packages include hotel accommodation, daily meals such as breakfast or MAP plan, private transportation for transfers and sightseeing, driver charges, toll taxes, and itinerary-based activities. Some premium packages may also include guided tours and special experiences. It is always best to review the final inclusions carefully before booking.',
  },
  {
    question: 'Are flights and train tickets included in the package?',
    answer:
      'Flights and train tickets are generally not included in standard tour packages unless they are specifically mentioned. They can usually be arranged on request as part of a customized travel plan.',
  },
  {
    question: 'What is the best time to travel to popular destinations in India?',
    answer:
      'The ideal travel season depends on the destination. Hill stations like Shimla, Manali, and Darjeeling are popular from March to June, with December preferred for snowfall. Rajasthan and other cultural destinations are best from October to March. Ladakh and Spiti are usually best explored from May to September, while Kerala and South India are most comfortable from October to March.',
  },
  {
    question: 'Are your tour packages customizable?',
    answer:
      'Yes, tour packages can be customized based on your preferences. You can adjust hotels, destinations, trip duration, transportation type, and experiences. Customized plans are especially helpful for honeymoon trips, family vacations, and group travel.',
  },
  {
    question: 'Is it safe to travel with your packages?',
    answer:
      'Yes, safety and comfort are treated as top priorities. Packages are planned with verified hotels, experienced drivers, and travel support throughout the journey. Itineraries are also designed with extra care for hill stations, remote routes, and spiritually important travel circuits.',
  },
  {
    question: 'Do you provide packages for group tours and corporate travel?',
    answer:
      'Yes, specialized packages are available for group tours, corporate travel, MICE requirements, and large family trips. These plans can include customized itineraries, group transportation, and special pricing based on group size and travel needs.',
  },
  {
    question: 'What are the payment and cancellation policies?',
    answer:
      'Most bookings require an advance payment, while the remaining balance is paid before departure. Cancellation terms depend on the package, hotel, and supplier policies, but the terms are shared transparently before final confirmation.',
  },
  {
    question: 'Why should I book my trip through your platform?',
    answer:
      'The platform offers carefully curated tour packages, competitive pricing, verified stays, and a smooth booking experience. With expert itinerary planning, dependable support, and customizable options, travelers get a more reliable and memorable trip-planning experience.',
  },
] as const;

const FAQ_IMAGES = [
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200',
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200',
] as const;

export function FaqSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_38%,#f8fafc_100%)] py-16 dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] md:py-20">
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.12),transparent_55%)]" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div className="grid gap-4 lg:sticky lg:top-24">
              <div className="relative min-h-[20rem] overflow-hidden rounded-[2rem]">
                <Image
                  src={FAQ_IMAGES[0]}
                  alt="Mountain travel inspiration"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.72),rgba(15,23,42,0.22),rgba(2,132,199,0.18))]" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                    <MessageCircleQuestion className="h-4 w-4" />
                    Frequently Asked Questions
                  </div>
                  <h2 className="mt-4 max-w-md text-3xl font-bold tracking-tight text-white md:text-4xl">
                    Clear travel answers, without the usual confusion
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {FAQ_IMAGES.slice(1).map((image, index) => (
                  <div key={image} className="relative min-h-[12rem] overflow-hidden rounded-[1.75rem]">
                    <Image
                      src={image}
                      alt={index === 0 ? 'Adventure travel inspiration' : 'Cultural travel inspiration'}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
                  </div>
                ))}
              </div>
            </div>

            <Card className="overflow-hidden rounded-[2rem] border-slate-200/80 bg-white/95 shadow-[0_24px_60px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-900/85">
              <div className="border-b border-slate-200/80 bg-slate-50/90 px-6 py-5 dark:border-slate-700 dark:bg-slate-900/60 md:px-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-sky-100 p-3 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200">
                    <MessageCircleQuestion className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950 dark:text-slate-50">
                      Frequently Asked Questions
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Clear answers for planning domestic, international, and customized trips.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 md:px-6 md:py-4">
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {FAQ_ITEMS.map((item, index) => (
                    <AccordionItem
                      key={item.question}
                      value={`item-${index}`}
                      className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white px-5 dark:border-slate-700 dark:bg-slate-900/70"
                    >
                      <AccordionTrigger className="py-5 text-left text-base font-semibold text-slate-900 hover:text-blue-600 hover:no-underline dark:text-slate-100 dark:hover:text-sky-300">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-[15px]">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
