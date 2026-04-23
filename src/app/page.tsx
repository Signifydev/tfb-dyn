import { HeroSection } from "@/components/travel/HeroSection";
import CategoryTabs from "@/components/travel/CategoryTabs";
import { CtaBanner } from "@/components/travel/CtaBanner";
import { FeaturedPackages } from "@/components/travel/FeaturedPackages";
import { HomepagePackageShowcase } from "@/components/travel/HomepagePackageShowcase";
import { DestinationGrid } from "@/components/travel/DestinationGrid";
import { FaqSection } from "@/components/travel/FaqSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryTabs />
      <FeaturedPackages />
      <HomepagePackageShowcase />
      <CtaBanner />
      <DestinationGrid />
      <FaqSection />

      {/* SEO Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why Choose Travel For Benefits?
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We are more than just a travel agency. We are your trusted partner in creating
              memorable journeys. With years of experience and a passion for travel, we curate
              experiences that go beyond the ordinary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                title: "Curated Experiences",
                description: "Every package is carefully crafted by travel experts who have explored these destinations personally.",
                icon: "🎯",
              },
              {
                title: "Best Value",
                description: "We negotiate the best rates with our partners to bring you premium experiences at competitive prices.",
                icon: "💰",
              },
              {
                title: "24/7 Support",
                description: "Our dedicated support team is always available to assist you before, during, and after your trip.",
                icon: "🤝",
              },
            ].map((item, index) => (
              <div key={index} className="text-center p-6 bg-slate-50 rounded-xl">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
