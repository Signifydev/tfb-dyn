import { HeroSection } from "@/components/travel/HeroSection";
import CategoryTabs from "@/components/travel/CategoryTabs";
import { CtaBanner, CustomTourCtaBanner } from "@/components/travel/CtaBanner";
import { FeaturedPackages } from "@/components/travel/FeaturedPackages";
import { HomepagePackageShowcase } from "@/components/travel/HomepagePackageShowcase";
import { DestinationGrid } from "@/components/travel/DestinationGrid";
import { FaqSection } from "@/components/travel/FaqSection";
import { BadgeIndianRupee, Headphones, Route, ShieldCheck, Sparkles } from "lucide-react";

const WHY_CHOOSE_ITEMS = [
  {
    title: "Curated by Travel Experts",
    description:
      "Handpicked stays, routes, activities, and local experiences shaped around real traveler needs.",
    icon: Sparkles,
    className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  {
    title: "Smart Value Planning",
    description:
      "Balanced itineraries with reliable partners, clear inclusions, and thoughtful pricing.",
    icon: BadgeIndianRupee,
    className: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  {
    title: "Support That Travels With You",
    description:
      "Responsive assistance before booking, during the journey, and after you return.",
    icon: Headphones,
    className: "bg-sky-50 text-sky-700 ring-sky-100",
  },
] as const;

const TRUST_POINTS = [
  { label: "Custom trips", value: "100+" },
  { label: "Travel styles", value: "8" },
  { label: "Trip support", value: "24/7" },
] as const;

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedPackages />
      <HomepagePackageShowcase categorySection={<CategoryTabs />} />
      <CtaBanner />
      <DestinationGrid />
      <CustomTourCtaBanner />
      <FaqSection />

      <section className="overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_48%,#eef6ff_100%)] py-16 dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-stretch gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-between rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.14)] md:p-8">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-100">
                  <ShieldCheck className="h-4 w-4" />
                  Trusted travel planning
                </div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Why Choose Travel For Benefits?
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-300 md:text-lg">
                  We design trips with a practical mix of comfort, adventure, local insight, and reliable support, so every journey feels easy to plan and memorable to live.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {TRUST_POINTS.map((point) => (
                  <div key={point.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <p className="text-2xl font-bold text-white md:text-3xl">{point.value}</p>
                    <p className="mt-1 text-xs font-medium text-slate-300 md:text-sm">{point.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
              {WHY_CHOOSE_ITEMS.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group flex min-h-72 flex-col justify-between rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.1)] dark:border-slate-700 dark:bg-slate-900/90"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${item.className}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold leading-tight text-slate-950 dark:text-slate-50">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {item.description}
                      </p>
                    </div>
                    <Route className="h-6 w-6 text-slate-300 transition-all duration-300 group-hover:translate-x-2 group-hover:-translate-y-1 group-hover:text-sky-500" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
