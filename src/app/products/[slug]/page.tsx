import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronRight,
  CircleCheckBig,
  Clock3,
  MapPin,
  Mountain,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { getAllProducts, getProductBySlug } from '@/lib/api/products';

import ProductGallery from '@/components/travel/ProductGallery';
import ProductStickyNav from '@/components/travel/ProductStickyNav';
import { BookingForm } from '@/components/travel/BookingForm';
import { EnquiryForm } from '@/components/travel/EnquiryForm';

export const revalidate = 120;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: 'Package Not Found' };

  return {
    title: `${product.title} | Travel For Benefits`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const allProducts = await getAllProducts();
  const suggestions = allProducts
    .filter((item) => item.slug !== product.slug)
    .sort((a, b) => {
      const aScore = Number(a.category !== product.category) + Number(a.featured);
      const bScore = Number(b.category !== product.category) + Number(b.featured);

      return bScore - aScore || b.reviews - a.reviews;
    })
    .slice(0, 10);

  const allImages = [product.heroImage, ...(product.gallery || [])].filter(Boolean);
  const savings = Math.max(product.originalPrice - product.price, 0);
  const itineraryCount = product.itinerary.length;
  const itineraryLabel =
    itineraryCount > 0
      ? `${itineraryCount} curated day${itineraryCount > 1 ? 's' : ''}`
      : 'Flexible itinerary';
  const categoryLabel = product.category.replace(/-/g, ' ');
  const quickFacts = [
    {
      icon: MapPin,
      label: 'Route',
      value: product.location,
    },
    {
      icon: Clock3,
      label: 'Duration',
      value: product.duration,
    },
    {
      icon: Users,
      label: 'Group size',
      value: product.groupSize,
    },
    {
      icon: Calendar,
      label: 'Trip format',
      value: itineraryLabel,
    },
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f8fb_0%,#eef4f7_32%,#f8fafc_100%)] pt-[90px] text-slate-900 dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_35%,#111827_100%)] dark:text-slate-100 md:pt-[100px]">
      <section id="gallery" className="scroll-mt-[120px]">
        <ProductGallery images={allImages} title={product.title} />
      </section>

      <ProductStickyNav />

      <div className="container mx-auto grid gap-8 px-4 py-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.14),_transparent_26%)]" />
            <div className="relative">
              <Link
                href="/"
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Packages
              </Link>

              <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-slate-950 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
                <div className="relative isolate overflow-hidden px-6 py-8 md:px-8 md:py-10">
                  <div className="absolute inset-0">
                    <Image
                      src={product.heroImage}
                      alt={product.title}
                      fill
                      className="object-cover opacity-30"
                      priority
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.88),rgba(15,23,42,0.68),rgba(8,47,73,0.72))]" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex flex-wrap items-center gap-3">
                      {product.featured && (
                        <Badge className="border-0 bg-amber-400 px-3 py-1 text-slate-950 hover:bg-amber-300">
                          Featured Escape
                        </Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className="border border-white/20 bg-white/10 px-3 py-1 text-white backdrop-blur hover:bg-white/20"
                      >
                        {categoryLabel}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-emerald-100 hover:bg-emerald-400/20"
                      >
                        Save Rs.{savings.toLocaleString()}
                      </Badge>
                    </div>

                    <div className="mt-6 max-w-3xl">
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">
                        Signature Journey
                      </p>
                      <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
                        {product.title}
                      </h1>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-100">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
                        <MapPin className="h-4 w-4 text-sky-300" />
                        {product.location}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
                        <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                        {product.rating} rating from {product.reviews} travellers
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
                        <Users className="h-4 w-4 text-sky-300" />
                        {product.groupSize}
                      </span>
                    </div>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {quickFacts.map((fact) => {
                        const Icon = fact.icon;

                        return (
                          <div
                            key={fact.label}
                            className="rounded-2xl border border-white/12 bg-white/10 p-4 backdrop-blur-sm"
                          >
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                              <Icon className="h-4 w-4 text-sky-300" />
                              {fact.label}
                            </div>
                            <p className="mt-3 text-sm font-medium text-white">{fact.value}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Card
            id="overview"
            className="scroll-mt-[120px] overflow-hidden border-0 bg-white/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:bg-slate-900/80"
          >
            <CardContent className="p-0">
              <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="p-6 md:p-8">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:bg-sky-500/15 dark:text-sky-200">
                    <Mountain className="h-3.5 w-3.5" />
                    Premium Travel Overview
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-50 md:text-3xl">
                    Crafted like a seamless journey, not just a booking
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
                    {product.description}
                  </p>

                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    {product.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70"
                      >
                        <CircleCheckBig className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200 bg-slate-950 p-6 text-white md:p-8 lg:border-l lg:border-t-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-200">
                    Why travellers love it
                  </p>
                  <div className="mt-5 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-300">Value advantage</p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        Save Rs.{savings.toLocaleString()}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Better packaged value versus the standard listed price.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-300">Journey pace</p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {itineraryCount} well-planned days
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Enough structure to feel premium, with room to enjoy each destination.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-300">Social proof</p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {product.rating} / 5 rating
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Backed by {product.reviews} traveler reviews and repeat interest.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            id="itinerary"
          className="scroll-mt-[120px] overflow-hidden border-0 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:bg-slate-900/85"
          >
            <CardContent className="p-0">
              <div className="border-b border-slate-200 bg-[linear-gradient(120deg,#082f49,#0f172a,#1d4ed8)] px-4 py-6 text-white md:px-6">
                <div className="mb-2 flex items-center gap-2">
                  <Clock3 className="h-5 w-5 text-amber-300" />
                  <span className="text-sm uppercase tracking-[0.2em] text-slate-200">
                    Day Wise Journey
                  </span>
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold md:text-3xl">Itinerary</h2>
                    <p className="mt-2 max-w-2xl text-sm text-slate-200">
                      Explore the trip like a luxury day card timeline with each stop clearly mapped out.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100 backdrop-blur">
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    {itineraryLabel}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 border-b border-slate-200 bg-slate-50 px-4 py-5 dark:border-slate-700 dark:bg-slate-800/60 md:grid-cols-3 md:px-6">
                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900/80">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Starting from
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {product.itinerary[0]?.title || product.location}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900/80">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Ending with
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {product.itinerary[itineraryCount - 1]?.title || 'Departure'}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900/80">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Travel style
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Curated premium routing
                  </p>
                </div>
              </div>

              <Accordion
                type="single"
                collapsible
                defaultValue="day-0"
                className="space-y-4 px-4 py-5 md:px-6 md:py-6"
              >
                {product.itinerary.map((day, index) => (
                  <AccordionItem
                    key={day.day}
                    value={`day-${index}`}
                    className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] dark:border-slate-700 dark:bg-slate-900/90"
                  >
                    <AccordionTrigger className="px-4 py-5 text-left hover:no-underline md:px-6">
                      <div className="flex w-full flex-col gap-4 md:flex-row md:items-start md:gap-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] text-sm font-bold text-white shadow-lg">
                            {day.day}
                          </div>
                          <div className="md:hidden">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
                              Day {day.day}
                            </p>
                            <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                              {day.title}
                            </h3>
                          </div>
                        </div>

                        <div className="hidden min-w-0 flex-1 md:block">
                          <div className="flex items-center gap-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">
                              Day {day.day}
                            </p>
                            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                              Detail view
                              <ChevronRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                          <h3 className="mt-3 text-xl font-semibold text-slate-950 dark:text-slate-50">
                            {day.title}
                          </h3>
                          <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {day.description}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-5 pt-0 md:px-6 md:pb-6">
                      <div className="grid gap-4 rounded-[1.5rem] bg-slate-50 p-4 dark:bg-slate-800/70 md:grid-cols-[0.9fr_1.1fr] md:p-5">
                        <div className="rounded-2xl bg-white p-4 dark:bg-slate-900">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                            Route checkpoint
                          </p>
                          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                            Day {day.day}: {day.title}
                          </p>
                          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            A thoughtfully sequenced stop inside your overall travel circuit.
                          </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                            Experience details
                          </p>
                          <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                            {day.description}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card
              id="inclusions"
              className="scroll-mt-[120px] overflow-hidden border-0 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:bg-slate-900/85"
            >
              <CardContent className="p-0">
                <div className="border-b border-emerald-100 bg-emerald-50 px-6 py-5 dark:border-emerald-900/40 dark:bg-emerald-950/30">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                    <Check className="h-5 w-5 text-emerald-600" />
                    Inclusions
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    What is already arranged for a smoother premium journey.
                  </p>
                </div>
                <div className="space-y-3 p-6">
                  {product.inclusions.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span className="text-sm text-slate-700 dark:text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:bg-slate-900/85">
              <CardContent className="p-0">
                <div className="border-b border-rose-100 bg-rose-50 px-6 py-5 dark:border-rose-900/40 dark:bg-rose-950/20">
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                    <X className="h-5 w-5 text-rose-600" />
                    Exclusions
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Items travellers should plan separately before departure.
                  </p>
                </div>
                <div className="space-y-3 p-6">
                  {product.exclusions.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50/60 px-4 py-3 dark:border-rose-900/40 dark:bg-rose-950/20"
                    >
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                      <span className="text-sm text-slate-700 dark:text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {product.faq?.length > 0 && (
            <Card
              id="faq"
              className="scroll-mt-[120px] overflow-hidden border-0 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:bg-slate-900/85"
            >
              <CardContent className="p-0">
                <div className="border-b border-slate-200 bg-slate-950 px-6 py-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                    Travel Answers
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">FAQs</h2>
                  <p className="mt-2 text-sm text-slate-300">
                    Quick clarity on the most common pre-booking questions.
                  </p>
                </div>
                <div className="p-4 md:p-6">
                  <Accordion type="single" collapsible className="space-y-3">
                    {product.faq.map((item, i) => (
                      <AccordionItem
                        key={i}
                        value={`faq-${i}`}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 dark:border-slate-700 dark:bg-slate-800/70"
                      >
                        <AccordionTrigger className="text-left text-sm font-semibold text-slate-900 hover:no-underline dark:text-slate-100">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          )}

          <Card
            id="expert-help"
            className="scroll-mt-[120px] overflow-hidden border-0 bg-white/85 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:bg-slate-900/85"
          >
            <CardContent className="p-0">
              <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#0f172a,#1e3a8a)] px-6 py-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                  Expert Assistance
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Need Help Before Booking?</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-200">
                  Share your travel date, group size, or custom requirements and our team will
                  reach out with the best plan for this package.
                </p>
              </div>
              <div className="p-4 md:p-6">
                <EnquiryForm productSlug={product.slug} />
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="self-start lg:sticky lg:top-[120px]">
          <Card className="overflow-hidden rounded-[2rem] border-0 bg-white/90 shadow-[0_28px_80px_rgba(15,23,42,0.14)] backdrop-blur dark:bg-slate-900/90">
            <CardContent className="flex flex-col p-0">
              <div className="bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] px-5 py-5 text-white">
                <div className="rounded-[1.25rem] border border-white/15 bg-white/10 p-3">
                  <p className="text-lg font-semibold line-through decoration-white/70">
                    Rs.{product.originalPrice.toLocaleString()}
                  </p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[11px] text-slate-200">Our price</p>
                      <p className="mt-0.5 text-2xl font-semibold text-white">
                        Rs.{product.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-slate-200">You save</p>
                      <p className="mt-0.5 text-sm font-semibold text-amber-300">
                        Rs.{savings.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <BookingForm product={product} />

                <div className="space-y-2 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                  <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                    <Calendar className="h-4 w-4 text-sky-700" />
                    Free cancellation support available
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Trip coordination designed for low-friction planning
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                    <Wallet className="h-4 w-4 text-amber-600" />
                    Transparent pricing with visible savings
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {suggestions.length > 0 && (
        <section className="pb-16 pt-4">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:bg-amber-500/15 dark:text-amber-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  Explore More
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Check These As Well
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  More journeys with a similar premium feel across tours, adventure, pilgrimage, and beyond.
                </p>
              </div>
            </div>

            <Carousel
              opts={{
                align: 'start',
                loop: suggestions.length > 3,
              }}
              className="mx-0 px-10 md:mx-12 md:px-0"
            >
              <CarouselContent>
                {suggestions.map((item) => (
                  <CarouselItem
                    key={item.slug}
                    className="basis-1/2 md:basis-1/2 xl:basis-1/3"
                  >
                    <Link href={`/products/${item.slug}`} className="block h-full">
                      <Card className="group h-full overflow-hidden border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900/90">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={item.heroImage}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-4">
                            <Badge className="bg-white/90 text-slate-900 hover:bg-white dark:bg-slate-100 dark:text-slate-950">
                              {item.category.replace(/-/g, ' ')}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-3 md:p-5">
                          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 md:text-sm">
                            <MapPin className="h-4 w-4" />
                            <span>{item.location}</span>
                          </div>
                          <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-sky-300 md:text-lg">
                            {item.title}
                          </h3>
                          <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 md:text-sm">
                            <span className="inline-flex items-center gap-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              {item.rating}
                            </span>
                            <span>{item.duration}</span>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-blue-600 md:text-xl">
                                Rs.{item.price.toLocaleString()}
                              </p>
                              <p className="text-[11px] text-slate-400 line-through dark:text-slate-500 md:text-sm">
                                Rs.{item.originalPrice.toLocaleString()}
                              </p>
                            </div>
                            <span className="hidden text-sm font-medium text-slate-600 dark:text-slate-300 md:inline">
                              {item.groupSize}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
              <CarouselNext className="right-0 border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
            </Carousel>
          </div>
        </section>
      )}
    </div>
  );
}
