'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  Send,
  UserRound,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type TravelIntent = 'tour-package' | 'adventure' | 'pilgrimage' | 'custom-trip';
type TravelWindow = 'this-month' | 'next-month' | 'next-3-months' | 'just-exploring';
type TravellerSize = 'solo' | 'couple' | 'family' | 'group';
type ChatStep = 0 | 1 | 2 | 3 | 4 | 5;

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

interface ChatMemory {
  lead: LeadState;
  step: ChatStep;
  hasSubmitted: boolean;
  lastAssistantMessage: string;
  lastUpdatedAt: number;
}

interface QuickOption<T extends string> {
  value: T;
  label: string;
  helper: string;
}

const AUTO_OPEN_DELAY_MS = 20000;
const REOPEN_DELAY_MS = 45000;
const TEASER_DELAY_MS = 15000;
const DISMISS_DURATION_MS = 6 * 60 * 60 * 1000;
const DISMISS_KEY = 'tfb-chatbot-dismissed-at';
const ROUTE_PROMPT_KEY = 'tfb-chatbot-last-route';
const CHAT_MEMORY_KEY = 'tfb-chatbot-memory';
const CHAT_OPEN_KEY = 'tfb-chatbot-open';

const intentOptions: Array<QuickOption<TravelIntent>> = [
  {
    value: 'tour-package',
    label: 'Tour package',
    helper: 'Ready-made itineraries, pricing, and best-match offers.',
  },
  {
    value: 'adventure',
    label: 'Adventure trip',
    helper: 'Treks, rides, and activity-heavy travel plans.',
  },
  {
    value: 'pilgrimage',
    label: 'Pilgrimage',
    helper: 'Spiritual circuits with timing and comfort in mind.',
  },
  {
    value: 'custom-trip',
    label: 'Custom trip',
    helper: 'Flexible planning around your route and travel style.',
  },
];

const travelWindowOptions: Array<QuickOption<TravelWindow>> = [
  { value: 'this-month', label: 'This month', helper: 'Urgent plans and currently available departures.' },
  { value: 'next-month', label: 'Next month', helper: 'Near-term travel with stronger availability.' },
  { value: 'next-3-months', label: 'In 2-3 months', helper: 'Better planning room and more options.' },
  { value: 'just-exploring', label: 'Just exploring', helper: 'Early-stage browsing before locking dates.' },
];

const travellerOptions: Array<QuickOption<TravellerSize>> = [
  { value: 'solo', label: 'Solo', helper: 'You are planning for yourself.' },
  { value: 'couple', label: 'Couple', helper: 'Two travellers, usually comfort-focused.' },
  { value: 'family', label: 'Family', helper: 'A family-friendly pacing and stay preference.' },
  { value: 'group', label: 'Group', helper: 'Friends, corporate, or larger mixed travel plans.' },
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

const initialMemory: ChatMemory = {
  lead: initialLeadState,
  step: 0,
  hasSubmitted: false,
  lastAssistantMessage: 'I can help you compare packages, lock the right dates, and connect you to your best next option.',
  lastUpdatedAt: 0,
};

function shouldSuppressAutoPrompt() {
  if (typeof window === 'undefined') {
    return true;
  }

  const dismissedAt = window.localStorage.getItem(DISMISS_KEY);
  if (!dismissedAt) {
    return false;
  }

  return Date.now() - Number(dismissedAt) < DISMISS_DURATION_MS;
}

function readStoredMemory(): ChatMemory {
  if (typeof window === 'undefined') {
    return initialMemory;
  }

  const stored = window.localStorage.getItem(CHAT_MEMORY_KEY);
  if (!stored) {
    return initialMemory;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<ChatMemory>;
    return {
      ...initialMemory,
      ...parsed,
      lead: {
        ...initialLeadState,
        ...(parsed.lead ?? {}),
      },
    };
  } catch {
    return initialMemory;
  }
}

function broadcastChatVisibility(isOpen: boolean) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(CHAT_OPEN_KEY, isOpen ? 'true' : 'false');
  window.dispatchEvent(
    new CustomEvent('tfb-chatbot-visibility', {
      detail: { open: isOpen },
    })
  );
}

function BuddyAvatar({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses =
    size === 'sm'
      ? 'h-10 w-10'
      : size === 'lg'
        ? 'h-16 w-16'
        : 'h-12 w-12';

  return (
    <div className={`relative ${sizeClasses} ${className}`}>
      <div className="absolute inset-0 rounded-[34%] bg-[linear-gradient(145deg,#0f172a,#2563eb)] shadow-[0_12px_25px_rgba(37,99,235,0.28)]" />
      <div className="absolute inset-[10%] rounded-[30%] bg-[radial-gradient(circle_at_top,#dbeafe_0%,#bfdbfe_28%,#60a5fa_62%,#1d4ed8_100%)]" />
      <div className="absolute inset-x-[24%] top-[28%] h-[18%] rounded-full bg-slate-950/15" />
      <div className="absolute left-[28%] top-[36%] h-[12%] w-[12%] rounded-full bg-slate-950 shadow-[0_0_0_3px_rgba(255,255,255,0.24)]" />
      <div className="absolute right-[28%] top-[36%] h-[12%] w-[12%] rounded-full bg-slate-950 shadow-[0_0_0_3px_rgba(255,255,255,0.24)]" />
      <div className="absolute inset-x-[31%] bottom-[26%] h-[10%] rounded-full border-2 border-slate-950/80 border-t-0 border-l-0 border-r-0" />
      <div className="absolute -right-[4%] -top-[4%] flex h-[28%] w-[28%] items-center justify-center rounded-full border border-white/60 bg-white/90 text-[10px] font-bold text-sky-700">
        AI
      </div>
    </div>
  );
}

export function LeadChatbot() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<ChatStep>(0);
  const [lead, setLead] = useState<LeadState>(initialLeadState);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [lastAssistantMessage, setLastAssistantMessage] = useState(initialMemory.lastAssistantMessage);
  const [teaserVisible, setTeaserVisible] = useState(false);
  const [teaserMessage, setTeaserMessage] = useState('Need help choosing the right trip?');
  const [hasUnreadMessage, setHasUnreadMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const memory = readStoredMemory();
    setLead(memory.lead);
    setStep(memory.step);
    setHasSubmitted(memory.hasSubmitted);
    setLastAssistantMessage(memory.lastAssistantMessage);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') {
      return;
    }

    const memory: ChatMemory = {
      lead,
      step,
      hasSubmitted,
      lastAssistantMessage,
      lastUpdatedAt: Date.now(),
    };

    window.localStorage.setItem(CHAT_MEMORY_KEY, JSON.stringify(memory));
  }, [hydrated, lead, step, hasSubmitted, lastAssistantMessage]);

  useEffect(() => {
    broadcastChatVisibility(open);
    if (open) {
      setTeaserVisible(false);
      setHasUnreadMessage(false);
    }

    return () => {
      broadcastChatVisibility(false);
    };
  }, [open]);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') {
      return;
    }

    const memory = readStoredMemory();
    const lastRoute = window.sessionStorage.getItem(ROUTE_PROMPT_KEY);
    const openDelay = lastRoute && lastRoute !== pathname ? REOPEN_DELAY_MS : AUTO_OPEN_DELAY_MS;
    const teaserTimer = window.setTimeout(() => {
      if (memory.hasSubmitted && memory.lead.destination) {
        setTeaserMessage(`Welcome back. Still planning ${memory.lead.destination}?`);
      } else if (memory.lead.intent) {
        setTeaserMessage(`Want smarter ${intentLabels[memory.lead.intent].toLowerCase()} suggestions?`);
      } else {
        setTeaserMessage('New message from TFB Buddy');
      }
      setTeaserVisible(true);
      setHasUnreadMessage(true);
    }, TEASER_DELAY_MS);

    const openTimer = shouldSuppressAutoPrompt()
      ? null
      : window.setTimeout(() => {
          setOpen(true);
          setHasUnreadMessage(false);
          window.sessionStorage.setItem(ROUTE_PROMPT_KEY, pathname);
        }, openDelay);

    return () => {
      window.clearTimeout(teaserTimer);
      if (openTimer) {
        window.clearTimeout(openTimer);
      }
    };
  }, [hydrated, pathname]);

  const destinationPrompt = useMemo(() => {
    switch (lead.intent) {
      case 'adventure':
        return 'Nice choice. What kind of adventure or destination are you thinking about?';
      case 'pilgrimage':
        return 'That helps. Which pilgrimage route or spiritual destination are you considering?';
      case 'custom-trip':
        return 'Perfect. What route, city, or custom plan should I help shape first?';
      case 'tour-package':
      default:
        return 'Great. Which destination or package are you most interested in right now?';
    }
  }, [lead.intent]);

  const summaryLine = useMemo(() => {
    if (!lead.intent && !lead.destination && !lead.travelWindow && !lead.travellers) {
      return 'We have not locked your travel brief yet.';
    }

    return [
      lead.intent ? intentLabels[lead.intent] : null,
      lead.destination ? `for ${lead.destination}` : null,
      lead.travelWindow ? travelWindowLabels[lead.travelWindow] : null,
      lead.travellers ? travellerLabels[lead.travellers].toLowerCase() : null,
    ]
      .filter(Boolean)
      .join(', ');
  }, [lead]);

  const progressLabel = useMemo(() => {
    const totalSteps = 5;
    if (step === 5) {
      return 'Saved';
    }

    return `${Math.max(step, 1)}/${totalSteps}`;
  }, [step]);

  const updateLead = <K extends keyof LeadState>(key: K, value: LeadState[K]) => {
    setLead((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const closeAssistant = (persistDismiss: boolean) => {
    setOpen(false);
    setTeaserVisible(false);
    setHasUnreadMessage(false);

    if (persistDismiss && typeof window !== 'undefined') {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      closeAssistant(true);
      return;
    }

    setOpen(true);
  };

  const beginConversation = () => {
    if (hasSubmitted) {
      setStep(5);
      setLastAssistantMessage('Welcome back. I remembered your last travel brief so we can continue from there.');
      setOpen(true);
      return;
    }

    setStep(1);
    setLastAssistantMessage('Let me understand what kind of trip you are planning so I can keep this useful and quick.');
    setOpen(true);
  };

  const handleIntentSelect = (value: TravelIntent) => {
    updateLead('intent', value);
    setStep(2);
    setLastAssistantMessage(
      value === 'adventure'
        ? 'Adventure trips get better when we match season, route, and difficulty.'
        : value === 'pilgrimage'
          ? 'Pilgrimage planning works best when we balance comfort, timing, and route flow.'
          : value === 'custom-trip'
            ? 'Custom trips are easiest when we anchor the route first and shape the rest around it.'
            : 'Packages are easier to compare once I know the destination you are leaning toward.'
    );
  };

  const handleDestinationContinue = () => {
    if (!lead.destination.trim()) {
      toast.error('Please share a destination or package interest first.');
      return;
    }

    setStep(3);
    setLastAssistantMessage(`Good direction. I will use ${lead.destination.trim()} as the main interest while we narrow the timing and group style.`);
  };

  const handleTravelProfileContinue = () => {
    if (!lead.travelWindow || !lead.travellers) {
      toast.error('Please choose both the travel window and traveller type.');
      return;
    }

    setStep(4);
    setLastAssistantMessage(
      `Nice. I have enough context to make follow-up feel sharper: ${travelWindowLabels[lead.travelWindow]} for a ${travellerLabels[lead.travellers].toLowerCase()}.`
    );
  };

  const handleReturnWithExistingLead = (mode: 'offers' | 'update' | 'callback') => {
    if (mode === 'offers') {
      setStep(5);
      setLastAssistantMessage(
        `I still remember your interest in ${lead.destination || 'that trip'}. If you want, I can keep this conversation active and help surface a better matching offer.`
      );
      return;
    }

    if (mode === 'update') {
      setStep(2);
      setLastAssistantMessage('No problem. Let us refresh the destination, dates, or group details and make the next follow-up more relevant.');
      return;
    }

    setStep(4);
    setLastAssistantMessage('Perfect. Your contact details are remembered, but you can update anything before I save a fresh callback request.');
  };

  const handleSubmit = async (submissionType: 'lead' | 'more-offers' = 'lead') => {
    if (!lead.name.trim() || !lead.email.trim() || !lead.phone.trim()) {
      toast.error('Please share your name, email, and phone so we can reach out.');
      return;
    }

    setIsSubmitting(true);

    const message = [
      submissionType === 'more-offers'
        ? 'Returning visitor reopened chatbot and requested more offers or a fresh follow-up.'
        : 'Lead captured from chatbot assistant.',
      `Page path: ${pathname}`,
      lead.intent ? `Travel intent: ${intentLabels[lead.intent]}` : '',
      lead.destination.trim() ? `Destination interest: ${lead.destination.trim()}` : '',
      lead.travelWindow ? `Preferred travel window: ${travelWindowLabels[lead.travelWindow]}` : '',
      lead.travellers ? `Traveller type: ${travellerLabels[lead.travellers]}` : '',
      lead.notes.trim() ? `Extra notes: ${lead.notes.trim()}` : '',
      hasSubmitted ? 'Customer had an earlier remembered chat session.' : '',
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

      setHasSubmitted(true);
      setStep(5);
      setLastAssistantMessage(
        `Saved. I will remember that you were exploring ${lead.destination || 'this trip'} so we can continue from here next time.`
      );
      toast.success('Your details are saved. TFB Buddy will remember this conversation next time too.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong while saving the lead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const assistantBubbles = useMemo(() => {
    const bubbles = [
      'I can help you compare packages, discover better timings, and make trip planning feel much easier.',
    ];

    if (hasSubmitted) {
      bubbles.push(
        `Welcome back${lead.name ? `, ${lead.name}` : ''}. I still remember your last travel brief${lead.destination ? ` for ${lead.destination}` : ''}.`
      );
    }

    bubbles.push(lastAssistantMessage);
    return bubbles;
  }, [hasSubmitted, lastAssistantMessage, lead.destination, lead.name]);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        {teaserVisible && !open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="animate-in fade-in-0 slide-in-from-bottom-3 max-w-[280px] rounded-2xl border border-sky-200 bg-white px-4 py-3 text-left text-sm text-slate-700 shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200">
                <Bot className="h-4 w-4" />
              </span>
              <p className="font-semibold text-slate-950 dark:text-slate-50">TFB Buddy</p>
              <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                New
              </span>
            </div>
            <p className="mt-1 leading-6">{teaserMessage}</p>
          </button>
        )}

        <Button
          type="button"
          size="icon"
          onClick={() => setOpen(true)}
          className={`group relative h-16 w-16 rounded-full border border-white/20 bg-[linear-gradient(135deg,#0f172a,#2563eb)] p-0 text-white shadow-[0_20px_45px_rgba(37,99,235,0.35)] hover:opacity-95 dark:border-slate-800 dark:bg-[linear-gradient(135deg,#020617,#1d4ed8)] ${hasUnreadMessage && !open ? 'animate-bounce' : ''}`}
        >
          <span className="absolute inset-0 rounded-full bg-sky-400/25 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
          <span className="absolute inset-0 rounded-full border border-white/20 animate-pulse" />
          {hasUnreadMessage && !open && (
            <>
              <span className="absolute -right-0.5 -top-0.5 z-20 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1 text-[10px] font-bold text-white shadow-lg dark:border-slate-950">
                1
              </span>
              <span className="absolute -right-0.5 -top-0.5 z-10 h-6 w-6 animate-ping rounded-full bg-rose-400/70" />
              <span className="absolute -left-28 top-1/2 hidden -translate-y-1/2 rounded-full bg-rose-500 px-3 py-1 text-[11px] font-semibold text-white shadow-lg sm:block">
                1 new message
              </span>
            </>
          )}
          <div className="relative flex h-full w-full items-center justify-center rounded-full">
            <BuddyAvatar size="md" className="scale-[0.92]" />
          </div>
          <span className="sr-only">Open TFB Buddy</span>
        </Button>
      </div>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side={isMobile ? 'bottom' : 'right'}
          className="h-[88dvh] overflow-y-auto rounded-t-[1.75rem] border-0 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_22%,#f8fafc_100%)] px-0 pb-0 pt-0 text-slate-950 shadow-[0_30px_80px_rgba(15,23,42,0.24)] dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_28%,#111827_100%)] dark:text-slate-50 sm:h-full sm:max-w-[450px] sm:rounded-none [&>button]:hidden"
        >
          <div className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 px-5 pb-4 pt-5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
            <SheetHeader className="text-left">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <BuddyAvatar size="lg" />
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-800 dark:bg-sky-500/15 dark:text-sky-200">
                      AI Travel Agent
                    </div>
                    <SheetTitle className="mt-2 bg-[linear-gradient(135deg,#0f172a,#2563eb,#0ea5e9)] bg-clip-text text-2xl font-semibold tracking-tight text-transparent dark:bg-[linear-gradient(135deg,#f8fafc,#7dd3fc,#60a5fa)]">
                      TFB Buddy
                    </SheetTitle>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      Your smart trip planning companion
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-1 shrink-0 rounded-full border border-slate-200 bg-white/80 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={() => closeAssistant(true)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close TFB Buddy</span>
                </Button>
              </div>
            </SheetHeader>
          </div>

          <div className="space-y-4 px-5 py-5">
            <div className="space-y-3">
              {assistantBubbles.map((bubble, index) => (
                <div key={`${bubble}-${index}`} className="flex justify-start">
                  <div className="max-w-[88%] rounded-[1.4rem] rounded-bl-md bg-slate-950 px-4 py-3 text-sm leading-6 text-slate-100 shadow-sm dark:bg-slate-900">
                    {bubble}
                  </div>
                </div>
              ))}

              {lead.intent && (
                <div className="flex justify-end">
                  <div className="max-w-[84%] rounded-[1.4rem] rounded-br-md bg-sky-100 px-4 py-3 text-sm leading-6 text-sky-950 dark:bg-sky-500/15 dark:text-sky-100">
                    I&apos;m planning a {intentLabels[lead.intent].toLowerCase()}.
                  </div>
                </div>
              )}

              {lead.destination && (
                <div className="flex justify-end">
                  <div className="max-w-[84%] rounded-[1.4rem] rounded-br-md bg-sky-100 px-4 py-3 text-sm leading-6 text-sky-950 dark:bg-sky-500/15 dark:text-sky-100">
                    Destination interest: {lead.destination}
                  </div>
                </div>
              )}

              {lead.travelWindow && lead.travellers && (
                <div className="flex justify-end">
                  <div className="max-w-[84%] rounded-[1.4rem] rounded-br-md bg-sky-100 px-4 py-3 text-sm leading-6 text-sky-950 dark:bg-sky-500/15 dark:text-sky-100">
                    {travelWindowLabels[lead.travelWindow]} for a {travellerLabels[lead.travellers].toLowerCase()}.
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  TFB Buddy
                </p>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {progressLabel}
                </span>
              </div>

              {step === 0 && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
                    {hasSubmitted
                      ? `I remembered your last details${lead.destination ? ` for ${lead.destination}` : ''}. Want me to help you push this further before you leave?`
                      : 'Start with a few quick taps and I will make the follow-up feel more tailored than a generic enquiry.'}
                  </div>

                  {hasSubmitted ? (
                    <div className="grid gap-3">
                      <Button className="justify-between rounded-2xl" onClick={() => handleReturnWithExistingLead('offers')}>
                        Show me better offers
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" className="justify-between rounded-2xl" onClick={() => handleReturnWithExistingLead('update')}>
                        Update my plan
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" className="justify-between rounded-2xl" onClick={() => handleReturnWithExistingLead('callback')}>
                        Request a callback
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      <Button className="justify-between rounded-2xl" onClick={beginConversation}>
                        Start smart chat
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {intentOptions.slice(0, 2).map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              beginConversation();
                              handleIntentSelect(option.value);
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

                  <Button variant="ghost" className="w-full rounded-xl" onClick={() => closeAssistant(true)}>
                    Maybe later
                  </Button>
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
                        onClick={() => handleIntentSelect(option.value)}
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
                  <div className="grid grid-cols-2 gap-3">
                    {['Char Dham', 'Kashmir', 'Leh Ladakh', 'Goa'].map((option) => (
                      <Button
                        key={option}
                        type="button"
                        variant="outline"
                        className="rounded-2xl"
                        onClick={() => updateLead('destination', option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                  <div className="flex justify-between gap-3">
                    <Button variant="outline" className="rounded-xl" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button className="rounded-xl" onClick={handleDestinationContinue}>
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
                  <div className="grid gap-3">
                    {travelWindowOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateLead('travelWindow', option.value)}
                        className={`rounded-2xl border px-4 py-4 text-left transition ${
                          lead.travelWindow === option.value
                            ? 'border-sky-300 bg-sky-50 dark:border-sky-500 dark:bg-sky-500/10'
                            : 'border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-sky-500 dark:hover:bg-sky-500/10'
                        }`}
                      >
                        <p className="font-semibold text-slate-900 dark:text-slate-50">{option.label}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{option.helper}</p>
                      </button>
                    ))}
                  </div>

                  <p className="pt-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                    How many travellers are we planning for?
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {travellerOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateLead('travellers', option.value)}
                        className={`rounded-2xl border px-4 py-4 text-left transition ${
                          lead.travellers === option.value
                            ? 'border-sky-300 bg-sky-50 dark:border-sky-500 dark:bg-sky-500/10'
                            : 'border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-sky-500 dark:hover:bg-sky-500/10'
                        }`}
                      >
                        <p className="font-semibold text-slate-900 dark:text-slate-50">{option.label}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{option.helper}</p>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between gap-3">
                    <Button variant="outline" className="rounded-xl" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button className="rounded-xl" onClick={handleTravelProfileContinue}>
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
                      I will remember these details next time so the chat can resume instead of starting over.
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
                    placeholder="Budget, preferred stay type, departure city, age group, or anything else..."
                    className="min-h-[110px] rounded-xl"
                  />

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
                    <p className="font-semibold text-slate-900 dark:text-slate-50">Your trip summary</p>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">{summaryLine}</p>
                  </div>

                  <div className="flex justify-between gap-3">
                    <Button variant="outline" className="rounded-xl" onClick={() => setStep(3)}>
                      Back
                    </Button>
                    <Button className="rounded-xl" onClick={() => handleSubmit('lead')} disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save and Remember'}
                      {!isSubmitting && <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200">
                    <div className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="h-4 w-4" />
                      Welcome back
                    </div>
                    <p className="mt-2">
                      I still have your last brief: {summaryLine}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <Button className="justify-between rounded-2xl" onClick={() => handleSubmit('more-offers')} disabled={isSubmitting}>
                      Offer me something better
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="justify-between rounded-2xl" onClick={() => handleReturnWithExistingLead('update')}>
                      Update destination or dates
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="justify-between rounded-2xl" onClick={() => handleReturnWithExistingLead('callback')}>
                      Refresh callback request
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
                    Before you exit, I can keep nudging toward a better match using the context already saved here instead of making you repeat everything.
                  </div>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
