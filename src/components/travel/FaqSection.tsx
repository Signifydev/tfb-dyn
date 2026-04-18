'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ_ITEMS = [
  {
    question: 'How do I book a tour package?',
    answer: 'Simply browse our collection of packages, select your preferred destination and dates, and click "Book Now". You will be guided through a secure checkout process where you can pay using credit/debit cards, UPI, or net banking.',
  },
  {
    question: 'Are the prices inclusive of all taxes?',
    answer: 'Yes, all prices displayed on our website are inclusive of applicable taxes. There are no hidden charges. The only additional costs would be for personal expenses, tips, and optional activities not mentioned in the itinerary.',
  },
  {
    question: 'Can I customize my tour package?',
    answer: 'Absolutely! We offer customizable packages for group tours, corporate events, and special occasions. Contact our travel experts through the enquiry form or call us directly to discuss your requirements.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Our standard cancellation policy allows full refund if cancelled 30+ days before departure, 50% refund for 15-29 days, and no refund for cancellations within 14 days. Terms may vary for specific packages.',
  },
  {
    question: 'Do you provide travel insurance?',
    answer: 'Travel insurance is not included by default but can be added at an additional cost. We recommend purchasing comprehensive travel insurance for international trips and adventure activities.',
  },
  {
    question: 'How do I contact customer support?',
    answer: 'Our customer support team is available 24/7 via phone, email, and WhatsApp. You can also use the live chat feature on our website for instant assistance.',
  },
];

export function FaqSection() {
  return (
    <section className="bg-slate-50 py-16 dark:bg-slate-950/40">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
            <p className="text-slate-600 dark:text-slate-300">Find answers to common queries about our services</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-slate-200 dark:border-slate-700">
                <AccordionTrigger className="text-left font-medium text-slate-900 hover:text-blue-600 dark:text-slate-100 dark:hover:text-sky-300">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
