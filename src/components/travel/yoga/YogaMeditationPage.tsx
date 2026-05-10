'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  Globe2,
  Loader2,
  Mail,
  Phone,
  Send,
  Star,
} from 'lucide-react';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  YOGA_CERTIFICATIONS,
  YOGA_DESTINATIONS,
  YOGA_EMAIL,
  YOGA_EXPERT_PHONE,
  YOGA_EXPERT_PHONE_HREF,
  YOGA_FAQS,
  YOGA_FEATURES,
  YOGA_FINAL_CTA,
  YOGA_FOOTER_LINKS,
  YOGA_FORM_OPTIONS,
  YOGA_GALLERY,
  YOGA_HERO_IMAGE,
  YOGA_INTRO_IMAGE,
  YOGA_PROGRAMS,
  YOGA_TESTIMONIALS,
  YOGA_WEBSITE,
} from '@/lib/yoga-content';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

interface WellnessLeadFormState {
  name: string;
  email: string;
  phone: string;
  destinationInterest: string;
  retreatType: string;
  message: string;
}

const initialFormState: WellnessLeadFormState = {
  name: '',
  email: '',
  phone: '',
  destinationInterest: '',
  retreatType: '',
  message: '',
};

function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6d7f3f]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#26321f] md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-[#64705a] md:text-lg">{description}</p>
      ) : null}
    </motion.div>
  );
}

function YogaHeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <Image
        src={YOGA_HERO_IMAGE}
        alt="Yoga and meditation retreat in a peaceful natural setting"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,31,19,0.78),rgba(23,31,19,0.42),rgba(23,31,19,0.68))]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,#fbf7ef_0%,rgba(251,247,239,0)_100%)]" />

      <div className="container relative mx-auto flex min-h-screen items-center px-4 pb-20 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-4xl text-white"
        >
          <motion.p
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12, duration: 0.65 }}
            className="mb-5 inline-flex rounded-full border border-white/25 bg-white/12 px-4 py-2 text-sm font-medium backdrop-blur-md"
          >
            Yoga, meditation, Ayurveda, and mindful travel across India
          </motion.p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] md:text-7xl">
            Reconnect Your Mind, Body &amp; Soul
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/88 md:text-2xl">
            Curated Yoga &amp; Wellness Retreats Across India
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full bg-[#f3d99b] px-7 text-[#26321f] hover:bg-[#f7e6bd]">
              <Link href="#retreats">Explore Retreats</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/50 bg-white/10 px-7 text-white backdrop-blur-md hover:bg-white hover:text-[#26321f]"
            >
              <a href={YOGA_EXPERT_PHONE_HREF}>Talk to Wellness Expert</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function YogaIntroductionSection() {
  return (
    <section className="bg-[#fbf7ef] py-16 md:py-24">
      <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6d7f3f]">
            Mindful Journeys
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#26321f] md:text-5xl">
            Travel slower, breathe deeper, and return with a quieter inner rhythm
          </h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-[#64705a] md:text-lg">
            <p>
              Our yoga and meditation retreats are designed for travelers seeking more than a break.
              They blend mindful movement, spiritual learning, nourishing food, restorative rest,
              and destination experiences that create space for genuine rejuvenation.
            </p>
            <p>
              From the riverbanks of Rishikesh to Himalayan valleys and coastal wellness sanctuaries,
              we help you choose retreats that match your pace, practice level, and personal intention.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          whileHover={{ y: -8 }}
          className="relative min-h-[420px] overflow-hidden rounded-[2rem] shadow-[0_30px_80px_rgba(66,83,45,0.18)]"
        >
          <Image
            src={YOGA_INTRO_IMAGE}
            alt="Person practicing yoga in a calm wellness retreat"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(38,50,31,0.55),transparent_58%)]" />
          <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/20 bg-white/15 p-5 text-white backdrop-blur-md">
            <p className="font-medium">Built around your intention</p>
            <p className="mt-2 text-sm leading-6 text-white/82">
              Detox, spiritual study, teacher training, stress relief, or a quiet reset.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function YogaProgramsSection() {
  return (
    <section id="retreats" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Yoga Programs"
          title="Choose the practice style that supports your body and your season of life"
          description="Every program can be shaped for beginners, regular practitioners, private groups, and certification-focused travelers."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {YOGA_PROGRAMS.map((program) => {
            const Icon = program.icon;

            return (
              <motion.article
                key={program.title}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.35 }}
                className="group rounded-[1.5rem] border border-[#e7dfcc] bg-[#fffdf8] p-6 shadow-[0_18px_45px_rgba(66,83,45,0.08)] transition-shadow hover:shadow-[0_24px_60px_rgba(66,83,45,0.14)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef2df] text-[#5f7335] transition-colors group-hover:bg-[#5f7335] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-[#26321f]">{program.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#64705a]">{program.description}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function YogaCertificationSection() {
  return (
    <section className="bg-[#f4ecd9] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Certification Programs"
          title="Premium training pathways for deeper practice and professional growth"
          description="Explore structured certifications and wellness sessions through trusted partners in India's most respected yoga destinations."
          center
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {YOGA_CERTIFICATIONS.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="rounded-[1.6rem] border border-white/70 bg-white/48 p-[1px] shadow-[0_18px_55px_rgba(77,89,50,0.12)] backdrop-blur-xl"
              >
                <div className="h-full rounded-[1.55rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.86),rgba(247,238,215,0.52))] p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#26321f] text-[#f3d99b]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold leading-snug text-[#26321f]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#65715b]">{item.description}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function YogaDestinationsSection() {
  return (
    <section className="bg-[#fbf7ef] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Signature Destinations"
          title="Retreat settings where nature, stillness, and tradition meet"
          description="Large-visual destination cards help you quickly choose the energy of your next wellness journey."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {YOGA_DESTINATIONS.map((destination, index) => (
            <motion.article
              key={destination.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.04, duration: 0.55 }}
              className="group relative min-h-[390px] overflow-hidden rounded-[1.8rem] bg-[#26321f] shadow-[0_22px_60px_rgba(38,50,31,0.16)]"
            >
              <Image
                src={destination.image}
                alt={`${destination.name} yoga and wellness destination`}
                fill
                loading="lazy"
                sizes="(min-width: 1280px) 20vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(20,28,16,0.82),rgba(20,28,16,0.12)_58%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="text-2xl font-semibold">{destination.name}</h3>
                <p className="mt-3 text-sm leading-6 text-white/84">{destination.focus}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function YogaWhyChooseSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Thoughtful planning for wellness travel that feels calm from the first call"
          center
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {YOGA_FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="rounded-[1.5rem] border border-[#e7dfcc] bg-[#fffdf8] p-6"
              >
                <Icon className="h-6 w-6 text-[#6d7f3f]" />
                <h3 className="mt-5 text-lg font-semibold text-[#26321f]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#64705a]">{feature.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function YogaGallerySection() {
  return (
    <section className="bg-[#fbf7ef] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Gallery"
          title="A glimpse of yoga, meditation, mountains, riversides, and wellness resorts"
          center
        />

        <div className="mt-10 grid auto-rows-[220px] gap-4 md:grid-cols-3">
          {YOGA_GALLERY.map((item, index) => (
            <motion.div
              key={item.alt}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.04, duration: 0.5 }}
              className={`group relative overflow-hidden rounded-[1.5rem] ${
                index === 0 || index === 5 ? 'md:row-span-2' : ''
              }`}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                loading="lazy"
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#26321f]/0 transition-colors duration-300 group-hover:bg-[#26321f]/18" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function YogaTestimonialsSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Traveler Stories"
          title="Restorative journeys, remembered with warmth"
          description="A few words from travelers who chose wellness travel for clarity, rest, and renewal."
          center
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {YOGA_TESTIMONIALS.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.06, duration: 0.5 }}
              className="rounded-[1.6rem] border border-[#e7dfcc] bg-[#fffdf8] p-6 shadow-[0_16px_45px_rgba(66,83,45,0.08)]"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-[#26321f]">{testimonial.name}</h3>
                  <div className="mt-1 flex gap-1 text-[#c4932b]" aria-label={`${testimonial.rating} star rating`}>
                    {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                      <Star key={starIndex} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-[#64705a]">{testimonial.review}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function YogaFaqSection() {
  return (
    <section className="bg-[#f4ecd9] py-16 md:py-24">
      <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <SectionHeading
          eyebrow="FAQ"
          title="Everything travelers usually ask before a wellness retreat"
          description="Beginner-friendly, certification-ready, and planned with practical comfort in mind."
        />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="rounded-[1.6rem] border border-white/70 bg-white/70 p-3 shadow-[0_18px_50px_rgba(77,89,50,0.1)] backdrop-blur-xl"
        >
          <Accordion type="single" collapsible className="w-full">
            {YOGA_FAQS.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`} className="border-[#e4d8bd] px-3">
                <AccordionTrigger className="text-left text-base font-semibold text-[#26321f] hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-7 text-[#64705a]">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

function YogaLeadFormSection() {
  const [form, setForm] = useState<WellnessLeadFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateField =
    (field: keyof WellnessLeadFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const validateForm = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.destinationInterest || !form.retreatType) {
      return 'Please complete all required fields before submitting.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return 'Please enter a valid email address.';
    }

    if (form.phone.replace(/\D/g, '').length < 8) {
      return 'Please enter a valid phone number.';
    }

    return '';
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          product_slug: 'yoga-meditation-wellness-lead',
          message: [
            'Yoga & Meditation Retreat Lead',
            `Destination Interest: ${form.destinationInterest}`,
            `Retreat Type: ${form.retreatType}`,
            '',
            form.message.trim() || 'No additional message provided.',
          ].join('\n'),
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to submit your wellness enquiry.');
      }

      setSuccess('Your wellness enquiry has been received. Our team will contact you shortly.');
      setForm(initialFormState);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Something went wrong while submitting your wellness enquiry.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="wellness-form" className="bg-white py-16 md:py-24">
      <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <SectionHeading
          eyebrow="Plan Your Retreat"
          title="Tell us what kind of inner reset you are looking for"
          description="Share your preferred destination, retreat type, and any special needs. We will guide you toward the right wellness experience."
        />

        <motion.form
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          onSubmit={handleSubmit}
          className="rounded-[1.8rem] border border-[#e7dfcc] bg-[#fffdf8] p-5 shadow-[0_24px_70px_rgba(66,83,45,0.12)] md:p-8"
        >
          <div className="space-y-4">
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            {success ? (
              <Alert className="border-[#bfd19a] bg-[#f0f6e5] text-[#3e4f27]">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <Input value={form.name} onChange={updateField('name')} placeholder="Name *" aria-label="Name" />
              <Input type="email" value={form.email} onChange={updateField('email')} placeholder="Email *" aria-label="Email" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input value={form.phone} onChange={updateField('phone')} placeholder="Phone *" aria-label="Phone" />
              <div className="relative">
                <select
                  value={form.destinationInterest}
                  onChange={updateField('destinationInterest')}
                  aria-label="Destination Interest"
                  className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
                >
                  <option value="">Destination Interest *</option>
                  {YOGA_FORM_OPTIONS.destinations.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64705a]" />
              </div>
            </div>

            <div className="relative">
              <select
                value={form.retreatType}
                onChange={updateField('retreatType')}
                aria-label="Retreat Type"
                className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
              >
                <option value="">Retreat Type *</option>
                {YOGA_FORM_OPTIONS.retreatTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64705a]" />
            </div>

            <Textarea
              value={form.message}
              onChange={updateField('message')}
              placeholder="Message"
              aria-label="Message"
              className="min-h-[140px]"
            />

            <Button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-[#26321f] text-white hover:bg-[#3d4f2a]">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting
                </>
              ) : (
                <>
                  Submit Wellness Enquiry
                  <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

function YogaFinalCtaSection() {
  const Icon = YOGA_FINAL_CTA.icon;

  return (
    <section className="bg-[#fbf7ef] px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
        className="container relative mx-auto min-h-[360px] overflow-hidden rounded-[2rem] px-6 py-12 text-white shadow-[0_30px_90px_rgba(38,50,31,0.22)] md:px-12"
      >
        <Image
          src={YOGA_FINAL_CTA.image}
          alt="Peaceful yoga retreat banner"
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(38,50,31,0.84),rgba(38,50,31,0.34))]" />
        <div className="relative flex min-h-[260px] max-w-3xl flex-col justify-center">
          <Icon className="mb-6 h-9 w-9 text-[#f3d99b]" />
          <h2 className="text-4xl font-semibold leading-tight md:text-6xl">
            Begin Your Journey Towards Balance &amp; Inner Peace
          </h2>
          <Button asChild size="lg" className="mt-8 w-fit rounded-full bg-[#f3d99b] px-7 text-[#26321f] hover:bg-[#f7e6bd]">
            <Link href="#wellness-form">Book Your Wellness Retreat</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

function YogaContactFooterSection() {
  return (
    <section className="bg-[#26321f] py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f3d99b]">
              Travel For Benefits Wellness Desk
            </p>
            <h2 className="mt-3 text-2xl font-semibold md:text-3xl">Speak with a wellness travel expert</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <a href={YOGA_EXPERT_PHONE_HREF} className="rounded-2xl border border-white/12 bg-white/8 p-4 transition-colors hover:bg-white/14">
              <Phone className="h-5 w-5 text-[#f3d99b]" />
              <p className="mt-3 text-sm text-white/70">Phone</p>
              <p className="mt-1 text-sm font-semibold">{YOGA_EXPERT_PHONE}</p>
            </a>
            <a href={`mailto:${YOGA_EMAIL}`} className="rounded-2xl border border-white/12 bg-white/8 p-4 transition-colors hover:bg-white/14">
              <Mail className="h-5 w-5 text-[#f3d99b]" />
              <p className="mt-3 text-sm text-white/70">Email</p>
              <p className="mt-1 break-words text-sm font-semibold">{YOGA_EMAIL}</p>
            </a>
            <a href="/" className="rounded-2xl border border-white/12 bg-white/8 p-4 transition-colors hover:bg-white/14">
              <Globe2 className="h-5 w-5 text-[#f3d99b]" />
              <p className="mt-3 text-sm text-white/70">Website</p>
              <p className="mt-1 text-sm font-semibold">{YOGA_WEBSITE}</p>
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
          {YOGA_FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="rounded-full border border-white/12 px-4 py-2 text-sm text-white/76 transition-colors hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function YogaMeditationPage() {
  return (
    <div className="min-h-screen scroll-smooth bg-[#fbf7ef] text-[#26321f]">
      <YogaHeroSection />
      <YogaIntroductionSection />
      <YogaProgramsSection />
      <YogaCertificationSection />
      <YogaDestinationsSection />
      <YogaWhyChooseSection />
      <YogaGallerySection />
      <YogaTestimonialsSection />
      <YogaFaqSection />
      <YogaLeadFormSection />
      <YogaFinalCtaSection />
      <YogaContactFooterSection />
    </div>
  );
}
