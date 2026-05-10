'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  Bike,
  Bot,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Helicopter,
  Landmark,
  Map,
  MessageCircle,
  Send,
  Sparkles,
  Tent,
  UserRound,
  X,
  Mountain,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
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
import { fetchAllProducts } from '@/lib/api/products-client';
import {
  dispatchBrowserEvent,
  readLocalStorage,
  readSessionStorage,
  writeLocalStorage,
  writeSessionStorage,
} from '@/lib/browser-storage';
import type { Product } from '@/lib/products';

type TravelCategory =
  | 'tour-packages'
  | 'adventure-activities'
  | 'trekking-camps'
  | 'bike-expeditions'
  | 'char-dham'
  | 'helicopter-services'
  | 'mice'
  | 'custom-trip';
type TravelWindow = 'this-month' | 'next-month' | 'next-3-months' | 'just-exploring';
type TravellerSize = 'solo' | 'couple' | 'family' | 'group';
type ChatStep = 0 | 1 | 2 | 3 | 4 | 5;

interface LeadState {
  intent: TravelCategory | null;
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
const TEASER_DELAY_MS = 60000;
const TEASER_COOLDOWN_MS = 60000;
const DISMISS_DURATION_MS = 6 * 60 * 60 * 1000;
const DISMISS_KEY = 'tfb-chatbot-dismissed-at';
const TEASER_DISMISS_KEY = 'tfb-chatbot-teaser-dismissed-at';
const ROUTE_PROMPT_KEY = 'tfb-chatbot-last-route';
const CHAT_MEMORY_KEY = 'tfb-chatbot-memory';
const CHAT_OPEN_KEY = 'tfb-chatbot-open';
const WHATSAPP_PHONE_NUMBER = '916398522735';

const categoryIcons = {
  'tour-packages': Map,
  'adventure-activities': Mountain,
  'trekking-camps': Tent,
  'bike-expeditions': Bike,
  'char-dham': Landmark,
  'helicopter-services': Helicopter,
  'mice': Briefcase,
  'custom-trip': Map,
} as const;

const intentOptions: Array<QuickOption<TravelCategory>> = [
  {
    value: 'tour-packages',
    label: 'Tour Packages',
    helper: 'Destination-based itineraries and ready packages.',
  },
  {
    value: 'adventure-activities',
    label: 'Adventure Activities',
    helper: 'Thrilling activities and experience-led trips.',
  },
  {
    value: 'trekking-camps',
    label: 'Trekking & Camps',
    helper: 'Treks, camp stays, and outdoor mountain plans.',
  },
  {
    value: 'bike-expeditions',
    label: 'Bike Expeditions',
    helper: 'Motorcycle tours, routes, and riding support.',
  },
  {
    value: 'char-dham',
    label: 'CharDham Yatra',
    helper: 'Pilgrimage planning with route and comfort support.',
  },
  {
    value: 'helicopter-services',
    label: 'Helicopter Services',
    helper: 'Heli bookings, aerial access, and premium transfers.',
  },
  {
    value: 'mice',
    label: 'MICE',
    helper: 'Meetings, incentives, conferences, and events.',
  },
  {
    value: 'custom-trip',
    label: 'Custom Trip',
    helper: 'Tailor-made trips based on your route and style.',
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

const intentLabels: Record<TravelCategory, string> = {
  'tour-packages': 'Tour Packages',
  'adventure-activities': 'Adventure Activities',
  'trekking-camps': 'Trekking & Camps',
  'bike-expeditions': 'Bike Expeditions',
  'char-dham': 'CharDham Yatra',
  'helicopter-services': 'Helicopter Services',
  'mice': 'MICE',
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

function normalizeStoredIntent(value: unknown): TravelCategory | null {
  switch (value) {
    case 'tour-packages':
    case 'adventure-activities':
    case 'trekking-camps':
    case 'bike-expeditions':
    case 'char-dham':
    case 'helicopter-services':
    case 'mice':
    case 'custom-trip':
      return value;
    case 'tour-package':
      return 'tour-packages';
    case 'adventure':
      return 'adventure-activities';
    case 'pilgrimage':
      return 'char-dham';
    default:
      return null;
  }
}

function normalizeStoredTraveller(value: unknown): TravellerSize | null {
  switch (value) {
    case 'solo':
    case 'couple':
    case 'family':
    case 'group':
      return value;
    default:
      return null;
  }
}

function normalizeStoredTravelWindow(value: unknown): TravelWindow | null {
  switch (value) {
    case 'this-month':
    case 'next-month':
    case 'next-3-months':
    case 'just-exploring':
      return value;
    default:
      return null;
  }
}

function getTravellerLabel(category: TravelCategory | null, traveller: TravellerSize): string {
  if (category === 'mice') {
    return {
      'solo': 'Small team',
      'couple': 'Department group',
      'family': 'Company team',
      'group': 'Large event group',
    }[traveller];
  }

  if (category === 'helicopter-services') {
    return {
      'solo': '1 passenger',
      'couple': '2 passengers',
      'family': '3-5 passengers',
      'group': '6+ passengers',
    }[traveller];
  }

  if (category === 'custom-trip') {
    return {
      'solo': 'Solo traveller',
      'couple': 'Couple',
      'family': 'Family trip',
      'group': 'Group trip',
    }[traveller];
  }

  return travellerLabels[traveller];
}

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
  lastAssistantMessage: 'Tell me your travel mood and I will turn it into a sharper shortlist, not a generic enquiry.',
  lastUpdatedAt: 0,
};

function shouldSuppressAutoPrompt() {
  if (typeof window === 'undefined') {
    return true;
  }

  const dismissedAt = readLocalStorage(DISMISS_KEY);
  if (!dismissedAt) {
    return false;
  }

  return Date.now() - Number(dismissedAt) < DISMISS_DURATION_MS;
}

function shouldSuppressTeaserPrompt() {
  if (typeof window === 'undefined') {
    return true;
  }

  const dismissedAt = readSessionStorage(TEASER_DISMISS_KEY);
  if (!dismissedAt) {
    return false;
  }

  return Date.now() - Number(dismissedAt) < TEASER_COOLDOWN_MS;
}

function markTeaserPrompted() {
  writeSessionStorage(TEASER_DISMISS_KEY, String(Date.now()));
}

function readStoredMemory(): ChatMemory {
  if (typeof window === 'undefined') {
    return initialMemory;
  }

  const stored = readLocalStorage(CHAT_MEMORY_KEY);
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
        intent: normalizeStoredIntent(parsed.lead?.intent),
        travelWindow: normalizeStoredTravelWindow(parsed.lead?.travelWindow),
        travellers: normalizeStoredTraveller(parsed.lead?.travellers),
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

  writeLocalStorage(CHAT_OPEN_KEY, isOpen ? 'true' : 'false');
  dispatchBrowserEvent('tfb-chatbot-visibility', { open: isOpen });
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
  const [teaserMessage, setTeaserMessage] = useState('Want me to shortlist trips in under a minute?');
  const [hasUnreadMessage, setHasUnreadMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [whatsAppChatOpen, setWhatsAppChatOpen] = useState(false);
  const [whatsAppMessage, setWhatsAppMessage] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const isDesktop = !isMobile;

  useEffect(() => {
    const memory = readStoredMemory();
    setLead(memory.lead);
    setStep(memory.step);
    setHasSubmitted(memory.hasSubmitted);
    setLastAssistantMessage(memory.lastAssistantMessage);
    setHydrated(true);
  }, []);

  useEffect(() => {
    let active = true;

    void fetchAllProducts()
      .then((items) => {
        if (active) {
          setProducts(items);
        }
      })
      .catch((error) => {
        console.error('Error loading chatbot recommendations:', error);
        if (active) {
          setProducts([]);
        }
      });

    return () => {
      active = false;
    };
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

    writeLocalStorage(CHAT_MEMORY_KEY, JSON.stringify(memory));
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
    const lastRoute = readSessionStorage(ROUTE_PROMPT_KEY);
    const openDelay = lastRoute && lastRoute !== pathname ? REOPEN_DELAY_MS : AUTO_OPEN_DELAY_MS;
    const teaserTimer = window.setTimeout(() => {
      if (shouldSuppressTeaserPrompt()) {
        return;
      }

      if (memory.hasSubmitted && memory.lead.destination) {
        setTeaserMessage(`Still thinking about ${memory.lead.destination}? I can pick up where we left off.`);
      } else if (memory.lead.intent) {
        setTeaserMessage(`I can make your ${intentLabels[memory.lead.intent].toLowerCase()} search much sharper.`);
      } else {
        setTeaserMessage('I found a faster way to plan your next trip.');
      }
      setTeaserVisible(true);
      setHasUnreadMessage(true);
      markTeaserPrompted();
    }, TEASER_DELAY_MS);

    const openTimer = shouldSuppressAutoPrompt()
      ? null
      : window.setTimeout(() => {
          setOpen(true);
          setHasUnreadMessage(false);
          writeSessionStorage(ROUTE_PROMPT_KEY, pathname);
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
      case 'tour-packages':
        return 'Great choice. Which destination or type of destination are you looking for in our tour packages?';
      case 'adventure-activities':
        return 'Nice. Which adventure activity or destination are you looking for?';
      case 'trekking-camps':
        return 'Perfect. Which trek, camp, or mountain destination are you interested in?';
      case 'bike-expeditions':
        return 'Sounds exciting. Which bike expedition route or destination are you planning for?';
      case 'char-dham':
        return 'Understood. Which CharDham route, yatra plan, or spiritual destination are you considering?';
      case 'helicopter-services':
        return 'Sure. Which helicopter service, route, or destination do you need help with?';
      case 'mice':
        return 'Great. Which corporate destination, event city, or MICE requirement are you planning for?';
      case 'custom-trip':
        return 'Perfect. Which destination, route, or kind of custom trip are you looking to build?';
      default:
        return 'Great. Which destination or package are you most interested in right now?';
    }
  }, [lead.intent]);

  const destinationPlaceholder = useMemo(() => {
    switch (lead.intent) {
      case 'tour-packages':
        return 'Example: Kashmir, Goa, Kerala, Bali...';
      case 'adventure-activities':
        return 'Example: River rafting in Rishikesh, skiing in Gulmarg...';
      case 'trekking-camps':
        return 'Example: Kedarkantha, Hampta Pass, Chopta camp...';
      case 'bike-expeditions':
        return 'Example: Leh Ladakh, Spiti Valley, Zanskar...';
      case 'char-dham':
        return 'Example: Kedarnath, Badrinath, CharDham by road...';
      case 'helicopter-services':
        return 'Example: Kedarnath helicopter, Do Dham heli tour...';
      case 'mice':
        return 'Example: Corporate offsite in Goa, conference in Dubai...';
      case 'custom-trip':
        return 'Example: Kashmir with Gulmarg, Rajasthan family circuit, Europe honeymoon...';
      default:
        return 'Example: Char Dham, Kashmir, Leh, Goa...';
    }
  }, [lead.intent]);

  const destinationSuggestions = useMemo(() => {
    switch (lead.intent) {
      case 'tour-packages':
        return ['Kashmir', 'Goa', 'Kerala', 'Dubai'];
      case 'adventure-activities':
        return ['River Rafting', 'Skiing', 'Paragliding', 'Bungee Jumping'];
      case 'trekking-camps':
        return ['Kedarkantha', 'Hampta Pass', 'Chopta', 'Valley of Flowers'];
      case 'bike-expeditions':
        return ['Leh Ladakh', 'Spiti Valley', 'Zanskar', 'Srinagar to Leh'];
      case 'char-dham':
        return ['CharDham Yatra', 'Kedarnath', 'Badrinath', 'Do Dham'];
      case 'helicopter-services':
        return ['Kedarnath Heli', 'Do Dham Heli', 'CharDham Heli', 'Heli Charter'];
      case 'mice':
        return ['Goa Offsite', 'Jaipur Event', 'Dubai Conference', 'Rishikesh Retreat'];
      case 'custom-trip':
        return ['Kashmir Family Trip', 'Europe Honeymoon', 'Rajasthan Circuit', 'Leh with Nubra'];
      default:
        return ['Char Dham', 'Kashmir', 'Leh Ladakh', 'Goa'];
    }
  }, [lead.intent]);

  const planningPrompt = useMemo(() => {
    switch (lead.intent) {
      case 'mice':
        return 'When are you planning this event or business travel?';
      case 'helicopter-services':
        return 'When are you planning this helicopter service?';
      case 'char-dham':
        return 'When are you planning your yatra?';
      case 'custom-trip':
        return 'When are you planning this custom trip?';
      default:
        return 'When are you hoping to travel?';
    }
  }, [lead.intent]);

  const travellerPrompt = useMemo(() => {
    switch (lead.intent) {
      case 'mice':
        return 'How large is the team or event group?';
      case 'helicopter-services':
        return 'How many passengers are we planning for?';
      case 'custom-trip':
        return 'How many travellers are we planning for this custom trip?';
      default:
        return 'How many travellers are we planning for?';
    }
  }, [lead.intent]);

  const travellerOptionsForCategory = useMemo(() => {
    if (lead.intent === 'mice') {
      return [
        { value: 'solo', label: 'Small Team', helper: 'A compact offsite, leadership, or small meeting group.' },
        { value: 'couple', label: 'Department', helper: 'A department-level gathering or focused team event.' },
        { value: 'family', label: 'Company Team', helper: 'A broader internal team or multi-function event.' },
        { value: 'group', label: 'Large Event', helper: 'A major conference, reward trip, or large gathering.' },
      ] satisfies Array<QuickOption<TravellerSize>>;
    }

    if (lead.intent === 'helicopter-services') {
      return [
        { value: 'solo', label: '1 Passenger', helper: 'A single-seat requirement or solo booking.' },
        { value: 'couple', label: '2 Passengers', helper: 'Best for couples or two-person travel.' },
        { value: 'family', label: '3-5 Passengers', helper: 'Suitable for family or small private groups.' },
        { value: 'group', label: '6+ Passengers', helper: 'Useful for batch planning or larger private movement.' },
      ] satisfies Array<QuickOption<TravellerSize>>;
    }

    return travellerOptions;
  }, [lead.intent]);

  const matchingPackages = useMemo(() => {
    const selectedCategory = lead.intent === 'custom-trip' ? null : lead.intent;
    const query = lead.destination.trim().toLowerCase();

    const scored = products.map((product) => {
      let score = 0;

      if (selectedCategory && product.category === selectedCategory) {
        score += 6;
      }

      if (lead.intent === 'custom-trip' && product.featured) {
        score += 2;
      }

      if (query) {
        const haystacks = [
          product.title,
          product.location,
          product.description,
          product.category,
          ...product.highlights,
        ].map((value) => value.toLowerCase());

        if (haystacks.some((value) => value.includes(query))) {
          score += 5;
        } else {
          const queryWords = query.split(/\s+/).filter(Boolean);
          const partialMatches = queryWords.filter((word) =>
            haystacks.some((value) => value.includes(word))
          ).length;
          score += partialMatches;
        }
      }

      if (lead.travelWindow === 'this-month' && product.duration.includes('2 Days')) {
        score += 1;
      }

      if (lead.travellers === 'group' && /people|guests|riders|batch/i.test(product.groupSize)) {
        score += 1;
      }

      return { product, score };
    });

    const primaryMatches = scored
      .filter(({ score, product }) => score > 0 || product.featured)
      .sort((a, b) => b.score - a.score || b.product.rating - a.product.rating)
      .slice(0, 3)
      .map(({ product }) => product);

    return primaryMatches;
  }, [lead.destination, lead.intent, lead.travelWindow, lead.travellers, products]);

  const summaryLine = useMemo(() => {
    if (!lead.intent && !lead.destination && !lead.travelWindow && !lead.travellers) {
      return 'We have not locked your travel brief yet.';
    }

    return [
      lead.intent ? intentLabels[lead.intent] : null,
      lead.destination ? `for ${lead.destination}` : null,
      lead.travelWindow ? travelWindowLabels[lead.travelWindow] : null,
      lead.travellers ? getTravellerLabel(lead.intent, lead.travellers).toLowerCase() : null,
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
      writeLocalStorage(DISMISS_KEY, String(Date.now()));
    }
  };

  const dismissTeaser = () => {
    setTeaserVisible(false);
    setHasUnreadMessage(false);
    markTeaserPrompted();
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
      setJustSubmitted(false);
      setLastAssistantMessage('Welcome back. Your last travel brief is still here, so we can skip the boring repeat questions.');
      setOpen(true);
      return;
    }

    setStep(1);
    setJustSubmitted(false);
    setLastAssistantMessage('Quick trip scan first: pick the travel style, then I will ask only what helps us recommend better.');
    setOpen(true);
  };

  const buildWhatsAppMessage = () => {
    const hasTravelBrief = Boolean(
      lead.intent ||
        lead.destination.trim() ||
        lead.travelWindow ||
        lead.travellers ||
        lead.notes.trim()
    );
    const hasContactDetails = Boolean(lead.name.trim() || lead.email.trim() || lead.phone.trim());

    if (!hasTravelBrief && !hasContactDetails) {
      return 'Hi TFB Team, I want to plan a trip. Please help me with the best packages and details.';
    }

    const conversation = [
      'Hi TFB Team, I want to continue my travel enquiry from the website.',
      lead.intent ? `Travel category: ${intentLabels[lead.intent]}` : null,
      lead.destination.trim() ? `Destination interest: ${lead.destination.trim()}` : null,
      lead.travelWindow ? `Preferred travel window: ${travelWindowLabels[lead.travelWindow]}` : null,
      lead.travellers ? `Traveller type: ${getTravellerLabel(lead.intent, lead.travellers)}` : null,
      lead.notes.trim() ? `Notes: ${lead.notes.trim()}` : null,
      lead.name.trim() ? `Name: ${lead.name.trim()}` : null,
      lead.phone.trim() ? `Phone: ${lead.phone.trim()}` : null,
      lead.email.trim() ? `Email: ${lead.email.trim()}` : null,
      `Page: ${pathname}`,
    ].filter(Boolean);

    return conversation.join('\n');
  };

  const openWhatsAppLauncher = () => {
    setWhatsAppMessage(buildWhatsAppMessage());
    setWhatsAppChatOpen(true);
    setTeaserVisible(false);
    setHasUnreadMessage(false);
  };

  const continueToWhatsApp = () => {
    const message = encodeURIComponent(whatsAppMessage.trim() || buildWhatsAppMessage());
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${message}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setWhatsAppChatOpen(false);
  };

  const handleIntentSelect = (value: TravelCategory) => {
    updateLead('intent', value);
    setStep(2);
    setLastAssistantMessage(
      value === 'adventure-activities'
        ? 'Good pick. Adventure gets better when we match thrill level, season, safety, and the right destination.'
        : value === 'trekking-camps'
          ? 'Nice. I will tune this around trail difficulty, camp comfort, weather, and your preferred mountain mood.'
          : value === 'bike-expeditions'
            ? 'Love it. Bike routes depend on season, riding comfort, permits, and how raw you want the road to feel.'
            : value === 'char-dham'
              ? 'Understood. For CharDham, the magic is in pacing, comfort, darshan flow, and route support.'
              : value === 'helicopter-services'
              ? 'Sure. Heli planning becomes clearer once we know the route, passenger count, and preferred date window.'
              : value === 'mice'
                ? 'Great. For MICE, I will focus on destination fit, group size, venue style, and execution support.'
                : value === 'custom-trip'
                  ? 'Perfect. Custom trips work best when I know the destination style, pace, comfort level, and must-have moments.'
                  : 'Great. I will shortlist better once I know whether you want mountains, beaches, culture, spirituality, or something mixed.'
    );
  };

  const handleDestinationContinue = () => {
    if (!lead.destination.trim()) {
      toast.error('Please share a destination or package interest first.');
      return;
    }

    setStep(3);
    setLastAssistantMessage(
      lead.intent === 'mice'
        ? `Good direction. I will keep ${lead.destination.trim()} as the event focus while we narrow timing and group size.`
        : lead.intent === 'helicopter-services'
          ? `Perfect. I will keep ${lead.destination.trim()} as the heli route focus while we narrow timing and passenger count.`
          : `Beautiful. I will keep ${lead.destination.trim()} as the anchor and now tune it by timing and traveller style.`
    );
  };

  const handleTravelProfileContinue = () => {
    if (!lead.travelWindow || !lead.travellers) {
      toast.error('Please choose both the travel window and traveller type.');
      return;
    }

    setStep(4);
    setLastAssistantMessage(
      `Nice. I have the planning shape now: ${travelWindowLabels[lead.travelWindow]} for a ${getTravellerLabel(lead.intent, lead.travellers).toLowerCase()}. One last step and our team can respond with context.`
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
      setLastAssistantMessage('No problem. Refresh the destination, dates, or group details and I will reshape the brief instantly.');
      return;
    }

    setStep(4);
    setLastAssistantMessage('Perfect. Your contact details are remembered, and you can tweak anything before I save a fresh callback request.');
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
      lead.intent ? `Travel category: ${intentLabels[lead.intent]}` : '',
      lead.destination.trim() ? `Destination interest: ${lead.destination.trim()}` : '',
      lead.travelWindow ? `Preferred travel window: ${travelWindowLabels[lead.travelWindow]}` : '',
      lead.travellers ? `Traveller type: ${getTravellerLabel(lead.intent, lead.travellers)}` : '',
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
      setJustSubmitted(true);
      setStep(5);
      setLastAssistantMessage(
        `Enquiry received for ${lead.destination || 'your trip'}. Our team will get back to you within 24 hours.`
      );
      toast.success('Our team will get back to you within 24 hours.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong while saving the lead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const assistantBubbles = useMemo(() => {
    const bubbles = [
      'I can help you compare destinations, dates, comfort level, and trip style in a few quick taps.',
    ];

    if (hasSubmitted) {
      bubbles.push(
        `Welcome back${lead.name ? `, ${lead.name}` : ''}. I still remember your last travel brief${lead.destination ? ` for ${lead.destination}` : ''}.`
      );
    }

    bubbles.push(lastAssistantMessage);
    return bubbles;
  }, [hasSubmitted, lastAssistantMessage, lead.destination, lead.name]);

  const desktopLauncherPosition = isDesktop ? 'bottom-6 right-6' : 'bottom-4 right-4 sm:bottom-6 sm:right-6';
  const desktopTeaserWidth = isDesktop ? 'max-w-[320px]' : 'max-w-[280px]';
  const categoryGridClassName = isDesktop ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-2 gap-3 lg:grid-cols-3';
  const categoryCardClassName = isDesktop
    ? 'group min-h-[132px] rounded-2xl border border-slate-200 bg-[linear-gradient(145deg,#ffffff,#f8fbff)] px-4 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:shadow-[0_14px_32px_rgba(14,165,233,0.12)] dark:border-slate-700 dark:bg-[linear-gradient(145deg,#0f172a,#111827)] dark:hover:border-sky-500 dark:hover:bg-sky-500/10'
    : 'rounded-2xl border border-slate-200 bg-[linear-gradient(145deg,#ffffff,#f8fbff)] px-3 py-3 text-left shadow-sm transition hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-[linear-gradient(145deg,#0f172a,#111827)] dark:hover:border-sky-500 dark:hover:bg-sky-500/10';
  const desktopChatboxClassName = isDesktop
    ? '!inset-x-auto !left-auto !right-6 !bottom-0 !top-auto h-[560px] w-[380px] rounded-t-2xl border border-b-0 border-slate-200/80 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_22%,#f8fafc_100%)] px-0 pb-0 pt-0 text-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.18)] dark:border-slate-700/80 dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_28%,#111827_100%)] dark:text-slate-50'
    : 'h-[88dvh] rounded-t-[1.75rem] border-0 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_22%,#f8fafc_100%)] px-0 pb-0 pt-0 text-slate-950 shadow-[0_30px_80px_rgba(15,23,42,0.24)] dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_28%,#111827_100%)] dark:text-slate-50 sm:h-full sm:max-w-[450px] sm:rounded-none';

  return (
    <>
      <div className={`fixed z-40 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 ${desktopLauncherPosition}`}>
        {whatsAppChatOpen && (
          <div className={`animate-in fade-in-0 slide-in-from-bottom-3 overflow-hidden rounded-[1.6rem] border border-emerald-200/80 bg-white text-left text-sm text-slate-700 shadow-[0_24px_60px_rgba(15,23,42,0.18)] transition dark:border-emerald-900/50 dark:bg-slate-950 dark:text-slate-200 ${desktopTeaserWidth}`}>
            <div className="relative bg-[linear-gradient(135deg,#075e54_0%,#128c7e_48%,#25d366_100%)] px-4 py-4 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_34%)]" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#128c4a] shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-300" />
                    <FaWhatsapp className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-white">WhatsApp Travel Desk</p>
                      <span className="rounded-full bg-white/18 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90">
                        Fast reply
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-white/82">
                      Send your saved brief directly to our team.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setWhatsAppChatOpen(false)}
                  className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/12 text-white/80 transition hover:bg-white/20 hover:text-white"
                  aria-label="Close WhatsApp chat preview"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mt-3 space-y-2">
                  <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-[#e8f5e9] px-3 py-2 text-xs leading-5 text-[#1f3d2b] shadow-sm dark:bg-emerald-500/12 dark:text-emerald-100">
                    I prepared your travel brief so you do not need to type everything again.
                  </div>
                  <div className="ml-auto max-w-[92%] rounded-2xl rounded-br-md bg-[#dcf8c6] px-3 py-2 text-xs leading-5 text-[#1f3d2b] shadow-sm dark:bg-emerald-400/18 dark:text-emerald-50">
                    Send it to WhatsApp and our expert can continue from there.
                  </div>
                </div>
              </div>
            </div>

            <Textarea
              value={whatsAppMessage}
              onChange={(event) => setWhatsAppMessage(event.target.value)}
              className="mt-4 min-h-[130px] rounded-2xl border-emerald-200 bg-emerald-50/55 text-xs leading-5 focus-visible:ring-emerald-500/30 dark:border-emerald-900/50 dark:bg-emerald-950/20"
              aria-label="WhatsApp message"
            />
            <Button
              type="button"
              onClick={continueToWhatsApp}
              className="mt-3 w-full justify-between rounded-2xl bg-[linear-gradient(135deg,#128c7e,#25d366)] text-white shadow-[0_12px_28px_rgba(37,211,102,0.28)] hover:opacity-95"
            >
              Continue on WhatsApp
              <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
            </Button>
            </div>
          </div>
        )}

        {teaserVisible && !open && (
          <div
            className={`animate-in fade-in-0 slide-in-from-bottom-3 rounded-2xl border border-sky-200 bg-white px-4 py-3 text-left text-sm text-slate-700 shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 ${desktopTeaserWidth}`}
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="min-w-0 flex-1 text-left transition hover:-translate-y-0.5"
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
              <button
                type="button"
                onClick={dismissTeaser}
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Close new message"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={openWhatsAppLauncher}
            className="group relative h-16 rounded-full border border-white/25 bg-[linear-gradient(135deg,#075e54_0%,#128c7e_50%,#25d366_100%)] px-3 pr-4 text-white shadow-[0_20px_45px_rgba(18,140,126,0.34)] hover:scale-[1.03] hover:opacity-100 dark:border-slate-800"
            aria-label="Continue this chat on WhatsApp"
          >
            <span className="absolute inset-0 rounded-full bg-emerald-300/25 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
            <span className="absolute inset-0 rounded-full border border-white/20" />
            <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-300 shadow-[0_0_0_4px_rgba(37,211,102,0.18)]" />
            <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#128c4a] shadow-inner">
              <FaWhatsapp className="h-7 w-7" aria-hidden="true" />
            </span>
            <span className="relative ml-2 hidden text-left leading-tight sm:block">
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/70">WhatsApp</span>
              <span className="block text-sm font-bold">Quick chat</span>
            </span>
          </Button>

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
      </div>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="bottom"
          overlayClassName={isDesktop ? 'hidden' : undefined}
          className={`${desktopChatboxClassName} overflow-y-auto [&>button]:hidden`}
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
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <Sparkles className="h-3.5 w-3.5 text-sky-600 dark:text-sky-300" />
                        Smart shortlist
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <Clock3 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" />
                        60-sec scan
                      </span>
                    </div>
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
                  <div className="max-w-[88%] rounded-[1.4rem] rounded-bl-md bg-[linear-gradient(135deg,#0f172a,#1e3a8a)] px-4 py-3 text-sm leading-6 text-slate-100 shadow-sm dark:bg-[linear-gradient(135deg,#020617,#172554)]">
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
                    {travelWindowLabels[lead.travelWindow]} for a {getTravellerLabel(lead.intent, lead.travellers).toLowerCase()}.
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Trip Finder
                </p>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {progressLabel}
                </span>
              </div>

              {step === 0 && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
                    {hasSubmitted
                      ? `I remembered your last details${lead.destination ? ` for ${lead.destination}` : ''}. Want me to find a stronger match or refresh your callback request?`
                      : 'Pick a travel style and I will shape the next questions around your route, timing, comfort level, and group type.'}
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
                      <Button className="justify-between rounded-2xl bg-[linear-gradient(135deg,#0f172a,#2563eb)] shadow-[0_12px_28px_rgba(37,99,235,0.22)] hover:opacity-95" onClick={beginConversation}>
                        <span className="inline-flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Start smart trip scan
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <div className="grid grid-cols-3 gap-2">
                        {['Destination', 'Timing', 'Traveller'].map((item, index) => (
                          <div key={item} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-center text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                            <span className="mb-1 block text-sm font-bold text-sky-700 dark:text-sky-300">0{index + 1}</span>
                            {item}
                          </div>
                        ))}
                      </div>
                      <div className={categoryGridClassName}>
                        {intentOptions.map((option) => {
                          const Icon = categoryIcons[option.value];

                          return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              beginConversation();
                              handleIntentSelect(option.value);
                            }}
                            className={categoryCardClassName}
                          >
                            <div className={`flex h-full ${isDesktop ? 'flex-col gap-3' : 'items-start gap-2.5'}`}>
                              <span className={`${isDesktop ? 'inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200' : 'mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200'}`}>
                                <Icon className="h-4 w-4" />
                              </span>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold leading-5 text-slate-900 dark:text-slate-50">{option.label}</p>
                                <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{option.helper}</p>
                              </div>
                            </div>
                          </button>
                          );
                        })}
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
                  <div className={categoryGridClassName}>
                    {intentOptions.map((option) => {
                      const Icon = categoryIcons[option.value];

                      return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleIntentSelect(option.value)}
                        className={categoryCardClassName}
                      >
                        <div className={`flex h-full ${isDesktop ? 'flex-col gap-3' : 'items-start gap-2.5'}`}>
                          <span className={`${isDesktop ? 'inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200' : 'mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200'}`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold leading-5 text-slate-900 dark:text-slate-50">{option.label}</p>
                            <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{option.helper}</p>
                          </div>
                        </div>
                      </button>
                      );
                    })}
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
                    placeholder={destinationPlaceholder}
                    className="h-11 rounded-xl"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    {destinationSuggestions.map((option) => (
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
                    {planningPrompt}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
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
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{option.label}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{option.helper}</p>
                      </button>
                    ))}
                  </div>

                  <p className="pt-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                    {travellerPrompt}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {travellerOptionsForCategory.map((option) => (
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
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{option.label}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{option.helper}</p>
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
                      {isSubmitting ? 'Sending...' : 'Enquire Now!'}
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
                      {justSubmitted ? 'Enquiry received' : 'Welcome back'}
                    </div>
                    <p className="mt-2">
                      {justSubmitted
                        ? 'Our team will get back to you within 24 hours.'
                        : `I still have your last brief: ${summaryLine}`}
                    </p>
                    {justSubmitted && (
                      <p className="mt-2">
                        Request summary: {summaryLine}
                      </p>
                    )}
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

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                        Related Packages
                      </p>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Based on your category and destination
                      </span>
                    </div>

                    <div className="grid gap-3">
                      {matchingPackages.map((product) => (
                        <Link
                          key={product.slug}
                          href={`/products/${product.slug}`}
                          onClick={() => closeAssistant(false)}
                          className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-sky-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-sky-500"
                        >
                          <div className="flex gap-3">
                            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                              <Image
                                src={product.heroImage}
                                alt={product.title}
                                fill
                                sizes="96px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
                                {product.title}
                              </p>
                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                                {product.location} | {product.duration}
                              </p>
                              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                {product.highlights.slice(0, 2).join(' | ')}
                              </p>
                              <p className="mt-2 text-xs font-medium text-sky-700 dark:text-sky-300">
                                View itinerary
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
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
