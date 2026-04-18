'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/products';

interface BookingFormProps {
  product: Product;
}

interface LeadFormState {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

const EXPERT_PHONE = '+91-6398522735';
const EXPERT_PHONE_HREF = 'tel:+916398522735';

export function BookingForm({ product }: BookingFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [travellers, setTravellers] = useState(1);
  const [travelDate, setTravelDate] = useState<Date | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [leadForm, setLeadForm] = useState<LeadFormState>({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = product.price * travellers;
  const formattedPrice = `INR ${product.price.toLocaleString('en-IN')}`;
  const formattedTotalPrice = `INR ${totalPrice.toLocaleString('en-IN')}`;
  const checkoutHref = useMemo(() => {
    const params = new URLSearchParams({
      product: product.slug,
      travellers: String(travellers),
    });

    if (travelDate) {
      params.set('date', travelDate.toISOString());
    }

    return `/checkout?${params.toString()}`;
  }, [product.slug, travellers, travelDate]);

  const loginHref = `/login?redirect=${encodeURIComponent(checkoutHref)}`;
  const signupHref = `/signup?redirect=${encodeURIComponent(checkoutHref)}`;

  const resetFlow = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setStep(1);
      setError('');
      setIsSubmitting(false);
    }
  };

  const handleBookNowClick = () => {
    setError('');
    setStep(1);
    setIsDialogOpen(true);
  };

  const handleLeadFieldChange =
    (field: keyof LeadFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setLeadForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleNextStep = () => {
    if (!leadForm.name.trim() || !leadForm.email.trim() || !leadForm.phone.trim()) {
      setError('Name, email, and phone are required before continuing.');
      return;
    }

    setError('');
    setStep(2);
  };

  const handleBackStep = () => {
    setError('');
    setStep(1);
  };

  const handleConfirmBooking = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const followUpMessage = [
        `Booking lead for: ${product.title}`,
        `Package slug: ${product.slug}`,
        `Travel date: ${travelDate ? format(travelDate, 'PPP') : 'Not selected yet'}`,
        `Travellers: ${travellers}`,
        `Total package value: ${formattedTotalPrice}`,
        leadForm.notes.trim() ? `Customer notes: ${leadForm.notes.trim()}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: leadForm.name.trim(),
          email: leadForm.email.trim(),
          phone: leadForm.phone.trim(),
          message: followUpMessage,
          product_slug: product.slug,
          booking_details: {
            package_title: product.title,
            package_slug: product.slug,
            travel_date: travelDate ? format(travelDate, 'PPP') : 'Not selected yet',
            travellers,
            total_price: formattedTotalPrice,
            location: product.location,
            duration: product.duration,
          },
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to save booking enquiry.');
      }

      setIsDialogOpen(false);
      router.push(user ? checkoutHref : loginHref);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Something went wrong while saving your booking enquiry.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-2">
              <Label>Select Travel Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !travelDate && 'text-muted-foreground'
                    )}
                  >
                    {travelDate ? format(travelDate, 'PPP') : 'Choose a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={travelDate}
                    onSelect={setTravelDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Travellers</Label>
              <div className="flex items-center justify-between gap-2 rounded-md border border-input bg-background px-2 py-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setTravellers(Math.max(1, travellers - 1))}
                  disabled={travellers <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-8 text-center text-lg font-semibold">{travellers}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setTravellers(Math.min(15, travellers + 1))}
                  disabled={travellers >= 15}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2 rounded-xl bg-slate-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Price per person</span>
              <span className="font-medium">{formattedPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Travellers</span>
              <span className="font-medium">x {travellers}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold">
              <span>Total Price</span>
              <span className="text-blue-600">{formattedTotalPrice}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 border-t border-slate-200 pt-4 sm:grid-cols-2">
          <Button onClick={handleBookNowClick} className="w-full" size="lg">
            Book Now
          </Button>

          <Button asChild variant="outline" className="w-full" size="lg">
            <a href={EXPERT_PHONE_HREF}>
              <Phone className="mr-2 h-4 w-4" />
              Connect to Expert
            </a>
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={resetFlow}>
        <DialogContent className="max-h-[92vh] max-w-5xl overflow-hidden border-0 bg-white p-0 shadow-[0_40px_120px_rgba(15,23,42,0.22)] sm:rounded-[2rem]">
          <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
            <div className="p-5 md:p-8">
              <DialogHeader className="text-left">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Step {step} of 2
                </div>
                <DialogTitle className="text-2xl text-slate-950 md:text-3xl">
                  {step === 1 ? 'Tell us who is booking' : 'Confirm your package details'}
                </DialogTitle>
                <DialogDescription className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  {step === 1
                    ? 'We will save these details for quick follow-up and use them to pre-fill your booking journey.'
                    : 'Review the itinerary selection below. Once confirmed, we will save your lead and move you to the booking login or checkout flow.'}
                </DialogDescription>
              </DialogHeader>

              {error && (
                <Alert variant="destructive" className="mt-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {step === 1 ? (
                <div className="mt-6 space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="booking-name">Full Name</Label>
                      <Input
                        id="booking-name"
                        value={leadForm.name}
                        onChange={handleLeadFieldChange('name')}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="booking-email">Email Address</Label>
                      <Input
                        id="booking-email"
                        type="email"
                        value={leadForm.email}
                        onChange={handleLeadFieldChange('email')}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="booking-phone">Phone Number</Label>
                      <Input
                        id="booking-phone"
                        value={leadForm.phone}
                        onChange={handleLeadFieldChange('phone')}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="booking-travel-date">Selected Travel Date</Label>
                      <div
                        id="booking-travel-date"
                        className="flex h-10 items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700"
                      >
                        {travelDate ? format(travelDate, 'PPP') : 'Not selected yet'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="booking-notes">Requirements or Notes</Label>
                    <Textarea
                      id="booking-notes"
                      value={leadForm.notes}
                      onChange={handleLeadFieldChange('notes')}
                      placeholder="Share preferred dates, pickup requests, room needs, or anything our team should know."
                      className="min-h-[110px]"
                    />
                  </div>

                  <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Close
                    </Button>
                    <Button onClick={handleNextStep}>
                      Continue to Confirmation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#f1f5f9_100%)]">
                    <div className="border-b border-slate-200 px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                        Selected Itinerary
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-950">
                        {product.title}
                      </h3>
                    </div>
                    <div className="grid gap-4 p-5 md:grid-cols-2">
                      <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <CalendarDays className="h-4 w-4 text-sky-700" />
                          Trip details
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                          <p>Duration: {product.duration}</p>
                          <p>Location: {product.location}</p>
                          <p>Group size: {product.groupSize}</p>
                          <p>Travel date: {travelDate ? format(travelDate, 'PPP') : 'To be confirmed'}</p>
                          <p>Travellers: {travellers}</p>
                        </div>
                      </div>

                      <div className="space-y-3 rounded-2xl bg-slate-950 p-4 text-white shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-medium text-sky-200">
                          <ShieldCheck className="h-4 w-4 text-emerald-300" />
                          Booking summary
                        </div>
                        <div className="space-y-2 text-sm text-slate-200">
                          <p>Price per person: {formattedPrice}</p>
                          <p>Total package value: {formattedTotalPrice}</p>
                          <p>Lead captured for: {leadForm.name}</p>
                          <p>Email: {leadForm.email}</p>
                          <p>Phone: {leadForm.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-between">
                    <Button variant="outline" onClick={handleBackStep}>
                      Back
                    </Button>
                    <Button onClick={handleConfirmBooking} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving and continuing
                        </>
                      ) : (
                        <>
                          Confirm and Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 bg-slate-950 p-5 text-white lg:border-l lg:border-t-0 md:p-8">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">
                  Booking Access
                </p>
                <h3 className="mt-3 text-2xl font-semibold">
                  Log in or sign up to complete this itinerary booking
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Your selected package, traveller count, and travel date will carry into the booking flow automatically.
                </p>

                <div className="mt-6 space-y-3">
                  <Link href={loginHref} className="block">
                    <Button className="w-full bg-white text-slate-950 hover:bg-slate-100">
                      Log In to Continue
                    </Button>
                  </Link>
                  <Link href={signupHref} className="block">
                    <Button variant="outline" className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10">
                      Sign Up for Booking
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-200">
                      <UserRound className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Need instant help?
                      </p>
                      <p className="text-xs text-slate-400">Speak with our booking expert directly.</p>
                    </div>
                  </div>

                  <a
                    href={EXPERT_PHONE_HREF}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    {EXPERT_PHONE}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
