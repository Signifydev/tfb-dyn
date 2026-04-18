'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircleMore, Send, Sparkles, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type TravelIntent = 'tour-package' | 'adventure' | 'pilgrimage' | 'custom-trip';
type TravelWindow = 'this-month' | 'next-month' | 'next-3-months' | 'just-exploring';
type TravellerSize = 'solo' | 'couple' | 'family' | 'group';

interface LeadState {
  intent: TravelIntent | null;
  destination: string;
  travelWindow: TravelWindow | null;
  travellers: TravellerSize | null;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

const AUTO_OPEN_DELAY_MS = 20000;
const REOPEN_DELAY_MS = 45000;
const DISMISS_DURATION_MS = 12 * 60 * 60 * 1000;
const DISMISS_KEY = 'tfb-chatbot-dismissed-at';
const SUBMITTED_KEY = 'tfb-chatbot-submitted';
const ROUTE_PROMPT_KEY = 'tfb-chatbot-last-route';

const intentOptions: Array<{ value: TravelIntent; label: string; helper: string }> = [
  { value: 'tour-package', label: 'Tour package', helper: 'Compare ready-made itineraries and offers.' },
  { value: 'adventure', label: 'Adventure trip', helper: 'Find treks, rides, and activity-driven departures.' },
  { value: 'pilgrimage', label: 'Pilgrimage', helper: 'Get help with spiritual circuits and travel timing.' },
  { value: 'custom-trip', label: 'Custom trip', helper: 'Plan around your own route, dates, and group needs.' },
];

const travelWindowOptions: Array<{ value: TravelWindow; label: string }> = [
  { value: 'this-month', label: 'This month' },
  { value: 'next-month', label: 'Next month' },
  { value: 'next-3-months', label: 'In 2-3 months' },
  { value: 'just-exploring', label: 'Just exploring' },
];

const travellerOptions: Array<{ value: TravellerSize; label: string }> = [
  { value: 'solo', label: 'Solo' },
  { value: 'couple', label: 'Couple' },
  { value: 'family', label: 'Family' },
  { value: 'group', label: 'Group' },
];

const intentLabels: Record<TravelIntent, string> = {
  'tour-package': 'Tour Package',
  'adventure': 'Adventure Trip',
  'pilgrimage': 'Pilgrimage',
  'custom-trip': 'Custom Trip',
};

const travelWindowLabels: Record<TravelWindow, string> = {
  'this-month': 'This month',
  'next-month': 'Next month',
  'next-3-months': 'In 2-3 months',
  'just-exploring': 'Just exploring',
};

const travellerLabels: Record<TravellerSize, string> = {
  'solo': 'Solo traveller',
  'couple': 'Couple',
  'family': 'Family',
  'group': 'Group',
};

const initialLeadState: LeadState = {
  intent: null,
  destination: '',
  travelWindow: null,
  travellers: null,
  name: '',
  email: '',
  phone: '',
  notes: '',
};

function shouldSuppressAutoOpen() {
  if (typeof window === 'undefined') {
    return true;
  }

  if (window.localStorage.getItem(SUBMITTED_KEY) === 'true') {
    return true;
  }

  const dismissedAt = window.localStorage.getItem(DISMISS_KEY);
  if (!dismissedAt) {
    return false;
  }

  return Date.now() - Number(dismissedAt) < DISMISS_DURATION_MS;
}

export function LeadChatbot() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lead, setLead] = useState<LeadState>(initialLeadState);

  useEffect(() => {
    if (shouldSuppressAutoOpen()) {
      return;
    }

    const lastRoute = window.sessionStorage.getItem(ROUTE_PROMPT_KEY);
    const delay = lastRoute && lastRoute !== pathname ? REOPEN_DELAY_MS : AUTO_OPEN_DELAY_MS;

    const timer = window.setTimeout(() => {
      setOpen(true);
      window.sessionStorage.setItem(ROUTE_PROMPT_KEY, pathname);
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [pathname]);

  const destinationPrompt = useMemo(() => {
    switch (lead.intent) {
      case 'adventure':
        return 'What kind of adventure or destination is on your mind?';
      case 'pilgrimage':
        return 'Which pilgrimage route or spiritual destination are you considering?';
      case 'custom-trip':
        return 'What route, city, or kind of custom trip would you like help with?';
      case 'tour-package':
      default:
        return 'Which destination or package are you interested in?';
    }
  }, [lead.intent]);

  const progressLabel = useMemo(() => {
    const totalSteps = 5;
    return `${Math.min(step + 1, totalSteps)}/${totalSteps}`;
  }, [step]);

  const updateLead = <K extends keyof LeadState>(key: K, value: LeadState[K]) => {
    setLead((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleClose = () => {
    setOpen(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      handleClose();
      return;
    }

    setOpen(true);
  };

  const handleStart = () => {
    setOpen(true);
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!lead.name.trim() || !lead.email.trim() || !lead.phone.trim()) {
      toast.error('Please share your name, email, and phone so we can reach out.');
      return;
    }

    setIsSubmitting(true);

    const message = [
      'Lead captured from chatbot assistant.',
      `Page path: ${pathname}`,
      lead.intent ? `Travel intent: ${intentLabels[lead.intent]}` : '',
      lead.destination.trim() ? `Destination interest: ${lead.destination.trim()}` : '',
      lead.travelWindow ? `Preferred travel window: ${travelWindowLabels[lead.travelWindow]}` : '',
      lead.travellers ? `Traveller type: ${travellerLabels[lead.travellers]}` : '',
      lead.notes.trim() ? `Extra notes: ${lead.notes.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: lead.name.trim(),
          email: lead.email.trim(),
          phone: lead.phone.trim(),
          message,
          product_slug: pathname.startsWith('/products/') ? pathname.replace('/products/', '') : null,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to save the chatbot enquiry.');
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(SUBMITTED_KEY, 'true');
        window.localStorage.removeItem(DISMISS_KEY);
      }

      toast.success('Travel lead captured. Our team can follow up with the right options.');
      setLead(initialLeadState);
      setStep(0);
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong while saving the lead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        size="icon"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-40 h-14 w-14 rounded-full bg-[linear-gradient(135deg,#0f172a,#2563eb)] text-white shadow-[0_20px_45px_rgba(37,99,235,0.35)] hover:opacity-95 dark:bg-[linear-gradient(135deg,#020617,#1d4ed8)] sm:bottom-6 sm:right-6"
      >
        <MessageCircleMore className="h-6 w-6" />
        <span className="sr-only">Open travel assistant</span>
      </Button>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side={isMobile ? 'bottom' : 'right'}
          className="h-[85dvh] overflow-y-auto rounded-t-[1.75rem] border-0 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_22%,#f8fafc_100%)] px-0 pb-0 pt-0 text-slate-950 shadow-[0_30px_80px_rgba(15,23,42,0.24)] dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_28%,#111827_100%)] dark:text-slate-50 sm:h-full sm:max-w-[440px] sm:rounded-none [&>button]:right-4 [&>button]:top-4 [&>button]:rounded-full [&>button]:border [&>button]:border-slate-200 [&>button]:bg-white/90 [&>button]:p-1.5 [&>button]:text-slate-600 [&>button]:opacity-100 dark:[&>button]:border-slate-700 dark:[&>button]:bg-slate-950/90 dark:[&>button]:text-slate-200"
        >
          <div className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/85 px-5 pb-4 pt-5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
            <SheetHeader className="text-left">
              <div className="flex items-center gap-3 pr-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#dbeafe,#bfdbfe)] text-sky-700 dark:bg-sky-500/15 dark:text-sky-200">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <SheetTitle className="text-xl text-slate-950 dark:text-slate-50">
                    Travel Assistant
                  </SheetTitle>
                  <SheetDescription className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    A quick guided chat to understand intent and capture a lead.
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>
          </div>

          <div className="space-y-4 px-5 py-5">
            <div className="rounded-[1.5rem] border border-sky-100 bg-[linear-gradient(135deg,#eff6ff,#f8fafc)] p-4 dark:border-sky-500/20 dark:bg-sky-500/10">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950">
                  <MessageCircleMore className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                    Let&apos;s find the right trip faster.
                  </p>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    I&apos;ll ask a few short questions, then your team can follow up with better-matched packages.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Chat Flow
                </p>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {progressLabel}
                </span>
              </div>

              {step === 0 && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
                    Want help with the best package, dates, or a faster callback? Start the chat and I&apos;ll prepare the lead details for your team.
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button className="flex-1 rounded-xl" onClick={handleStart}>
                      Start Chat
                    </Button>
                    <Button variant="outline" className="rounded-xl" onClick={handleClose}>
                      Maybe Later
                    </Button>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    What are you planning right now?
                  </p>
                  <div className="grid gap-3">
                    {intentOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          updateLead('intent', option.value);
                          setStep(2);
                        }}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-sky-500 dark:hover:bg-sky-500/10"
                      >
                        <p className="font-semibold text-slate-900 dark:text-slate-50">{option.label}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{option.helper}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {destinationPrompt}
                  </p>
                  <Input
                    value={lead.destination}
                    onChange={(event) => updateLead('destination', event.target.value)}
                    placeholder="Example: Char Dham, Kashmir, Leh, Goa..."
                    className="h-11 rounded-xl"
                  />
                  <div className="flex justify-between gap-3">
                    <Button variant="outline" className="rounded-xl" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button
                      className="rounded-xl"
                      onClick={() => {
                        if (!lead.destination.trim()) {
                          toast.error('Please share a destination or trip preference.');
                          return;
                        }

                        setStep(3);
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    When are you hoping to travel?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {travelWindowOptions.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={lead.travelWindow === option.value ? 'default' : 'outline'}
                        className="h-auto min-h-12 rounded-2xl px-4 py-3"
                        onClick={() => updateLead('travelWindow', option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    How many travellers are we planning for?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {travellerOptions.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={lead.travellers === option.value ? 'default' : 'outline'}
                        className="h-auto min-h-12 rounded-2xl px-4 py-3"
                        onClick={() => updateLead('travellers', option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                  <div className="flex justify-between gap-3">
                    <Button variant="outline" className="rounded-xl" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button
                      className="rounded-xl"
                      onClick={() => {
                        if (!lead.travelWindow || !lead.travellers) {
                          toast.error('Please choose your travel window and traveller type.');
                          return;
                        }

                        setStep(4);
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/80">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                      <UserRound className="h-4 w-4 text-sky-600 dark:text-sky-300" />
                      Share your contact details
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      We&apos;ll save the lead with your trip context so the follow-up feels relevant instead of generic.
                    </p>
                  </div>

                  <Input
                    value={lead.name}
                    onChange={(event) => updateLead('name', event.target.value)}
                    placeholder="Your full name"
                    className="h-11 rounded-xl"
                  />
                  <Input
                    type="email"
                    value={lead.email}
                    onChange={(event) => updateLead('email', event.target.value)}
                    placeholder="Email address"
                    className="h-11 rounded-xl"
                  />
                  <Input
                    value={lead.phone}
                    onChange={(event) => updateLead('phone', event.target.value)}
                    placeholder="Phone number"
                    className="h-11 rounded-xl"
                  />
                  <Textarea
                    value={lead.notes}
                    onChange={(event) => updateLead('notes', event.target.value)}
                    placeholder="Anything else your team should know? Budget, dates, pickup city, hotel preference..."
                    className="min-h-[110px] rounded-xl"
                  />

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
                    <p className="font-semibold text-slate-900 dark:text-slate-50">Lead summary</p>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">
                      {lead.intent ? intentLabels[lead.intent] : 'Trip type pending'} for{' '}
                      {lead.destination || 'destination pending'}, {lead.travelWindow ? travelWindowLabels[lead.travelWindow] : 'timing pending'}, {lead.travellers ? travellerLabels[lead.travellers].toLowerCase() : 'traveller count pending'}.
                    </p>
                  </div>

                  <div className="flex justify-between gap-3">
                    <Button variant="outline" className="rounded-xl" onClick={() => setStep(3)}>
                      Back
                    </Button>
                    <Button className="rounded-xl" onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? 'Saving lead...' : 'Send to Team'}
                      {!isSubmitting && <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">
                Why this helps
              </p>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-300">
                <li>It waits before appearing, so it engages without interrupting the first impression.</li>
                <li>It asks short, intent-based questions instead of showing one big cold form.</li>
                <li>It sends the full travel context to the same enquiry pipeline your team already uses.</li>
              </ul>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
