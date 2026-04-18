import Image from 'next/image';
import Link from 'next/link';
import { getCategoryHref } from '@/lib/categories';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
            <Link href="/" className="mb-4 inline-block">
              <Image src="/logo.png" alt="Travel For Benefit" width={140} height={46} />
            </Link>
            <p className="mb-4 text-sm leading-relaxed text-slate-400">
              Your trusted partner for unforgettable travel experiences across India. We specialize in curated tour packages, adventure trips, and pilgrimages.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="text-sm text-slate-400 hover:text-blue-400">Facebook</a>
              <a href="#" className="text-sm text-slate-400 hover:text-blue-400">Twitter</a>
              <a href="#" className="text-sm text-slate-400 hover:text-blue-400">Instagram</a>
              <a href="#" className="text-sm text-slate-400 hover:text-blue-400">YouTube</a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Tour Packages', href: getCategoryHref('tour-packages') },
                { label: 'Group Tours', href: getCategoryHref('group-tours') },
                { label: 'Adventure Activities', href: getCategoryHref('adventure-activities') },
                { label: 'CharDham Yatra', href: getCategoryHref('char-dham') },
                { label: 'Corporate Tours', href: getCategoryHref('mice') },
                { label: 'Search', href: '/search' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-colors hover:text-blue-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Support</h3>
            <ul className="space-y-2">
              {[
                { label: 'Help Center', href: '#' },
                { label: 'Cancellation Policy', href: '#' },
                { label: 'Travel Insurance', href: '#' },
                { label: 'FAQs', href: '#' },
                { label: 'Terms & Conditions', href: '#' },
                { label: 'Privacy Policy', href: '#' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm transition-colors hover:text-blue-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" />
                <span className="text-sm">Sahastradhara Road, Dehradun, U.K India.</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-blue-400" />
                <span className="text-sm">+91-63985 22735</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-blue-400" />
                <span className="text-sm">info@travelforbenefit.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 flex-shrink-0 text-blue-400" />
                <span className="text-sm">Mon-Sat: 9AM - 8PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-center md:mt-12 md:flex-row md:text-left">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Travel For Benefits. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 md:justify-end md:gap-6">
            <Link href="#" className="transition-colors hover:text-blue-400">Privacy</Link>
            <Link href="#" className="transition-colors hover:text-blue-400">Terms</Link>
            <Link href="#" className="transition-colors hover:text-blue-400">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
