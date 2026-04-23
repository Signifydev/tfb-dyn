import { CATEGORY_DEFINITIONS } from '@/lib/categories';

export interface Product {
  id?: string;
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  scope?: 'domestic' | 'international' | string | null;
  duration: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  heroImage: string;
  gallery: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  faq: FaqItem[];
  featured: boolean;
  location: string;
  groupSize: string;
  description: string;
  highlights: string[];
  destinations?: ProductDestination[];
}

export interface ProductDestination {
  id?: number | string;
  itinerary_id?: string;
  country: string;
  state?: string | null;
  city?: string | null;
  display_label?: string | null;
  sort_order?: number | null;
  created_at?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const CATEGORIES = CATEGORY_DEFINITIONS.map((category) => ({
  id: category.slug,
  name: category.name,
  icon: category.icon,
  description: category.description,
})) as const;

export const SAMPLE_PRODUCTS: Product[] = [
  {
    slug: 'golden-triangle-tour',
    title: 'Golden Triangle Tour',
    category: 'tour-packages',
    subcategory: 'domestic',
    duration: '6 Days / 5 Nights',
    price: 24999,
    originalPrice: 34999,
    rating: 4.8,
    reviews: 256,
    heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
    ],
    inclusions: [
      'Accommodation in 4-star hotels',
      'Daily breakfast and dinner',
      'AC vehicle transportation',
      'Professional tour guide',
      'Monument entry fees',
      'All applicable taxes',
    ],
    exclusions: [
      'Flights/trains',
      'Lunch',
      'Personal expenses',
      'Tips and gratuities',
      'Travel insurance',
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Delhi', description: 'Arrive at Delhi airport, meet and greet, transfer to hotel. Evening visit to India Gate and Connaught Place.' },
      { day: 2, title: 'Delhi Sightseeing', description: 'Full day tour of Old Delhi - Red Fort, Jama Masjid, Raj Ghat. Afternoon visit to New Delhi - Qutub Minar, Humayun\'s Tomb.' },
      { day: 3, title: 'Delhi to Agra', description: 'Morning drive to Agra (4 hours). Visit Agra Fort and Itimad-ud-Daulah (Baby Taj). Evening at leisure to explore local markets.' },
      { day: 4, title: 'Agra to Jaipur', description: 'Early morning visit to Taj Mahal at sunrise. Drive to Jaipur via Fatehpur Sikri (5 hours). Check-in and rest.' },
      { day: 5, title: 'Jaipur Sightseeing', description: 'Full day tour - Amber Fort, City Palace, Jantar Mantar, Hawa Mahal. Evening explore bazaars for shopping.' },
      { day: 6, title: 'Departure', description: 'Morning after breakfast, drive back to Delhi (5 hours) for your onward journey.' },
    ],
    faq: [
      { question: 'What is the best time to visit?', answer: 'October to March is the best time for this tour when weather is pleasant.' },
      { question: 'Is this tour suitable for families?', answer: 'Yes, this tour is perfect for families with children of all ages.' },
      { question: 'What should I pack?', answer: 'Comfortable walking shoes, light cotton clothes, sunscreen, and sunglasses.' },
    ],
    featured: true,
    location: 'Delhi - Agra - Jaipur',
    groupSize: '2-15 people',
    description: 'Experience the rich cultural heritage of India with our Golden Triangle Tour covering Delhi, Agra, and Jaipur. This 6-day journey takes you through ancient monuments, majestic forts, and vibrant markets.',
    highlights: ['Taj Mahal at sunrise', 'Amber Fort', 'Red Fort', 'Professional guides'],
  },
  {
    slug: 'kerala-backwaters',
    title: 'Kerala Backwaters',
    category: 'tour-packages',
    subcategory: 'domestic',
    duration: '5 Days / 4 Nights',
    price: 18999,
    originalPrice: 25999,
    rating: 4.9,
    reviews: 189,
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800',
    ],
    inclusions: ['Houseboat stay', 'All meals', 'Airport transfers', 'Sightseeing'],
    exclusions: ['Flights', 'Personal expenses', 'Activities not mentioned'],
    itinerary: [
      { day: 1, title: 'Arrival in Kochi', description: 'Arrive at Kochi airport, transfer to your hotel. Evening explore Fort Kochi.' },
      { day: 2, title: 'Kochi to Alleppey', description: 'Morning drive to Alleppey. Board traditional houseboat and cruise through backwaters.' },
      { day: 3, title: 'Houseboat Cruise', description: 'Full day cruise through palm-fringed canals, rice paddies, and village life.' },
      { day: 4, title: 'Munnar', description: 'Disembark and drive to Munnar through scenic tea plantations.' },
      { day: 5, title: 'Departure', description: 'Morning visit to tea gardens, then transfer to airport.' },
    ],
    faq: [
      { question: 'Is the houseboat AC?', answer: 'Yes, all houseboats have AC bedrooms and a common deck area.' },
      { question: 'What meals are included?', answer: 'All meals - breakfast, lunch, dinner, and evening snacks on the houseboat.' },
    ],
    featured: true,
    location: 'Kerala',
    groupSize: '2-10 people',
    description: 'Discover the serene beauty of Kerala with our Backwaters package featuring a memorable houseboat stay and visits to Munnar tea gardens.',
    highlights: ['Houseboat stay', 'Backwater cruise', 'Tea gardens', 'Traditional cuisine'],
  },
  {
    slug: 'rajasthan-heritage',
    title: 'Rajasthan Heritage Tour',
    category: 'tour-packages',
    subcategory: 'domestic',
    duration: '8 Days / 7 Nights',
    price: 35999,
    originalPrice: 49999,
    rating: 4.7,
    reviews: 142,
    heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
    ],
    inclusions: ['Heritage hotel stays', 'All meals', 'Camel safari', 'Cultural shows'],
    exclusions: ['Flights', 'Personal shopping', 'Entry fees'],
    itinerary: [
      { day: 1, title: 'Arrival in Jaipur', description: 'Welcome with traditional garlands, transfer to heritage hotel.' },
      { day: 2, title: 'Jaipur', description: 'Amber Fort, City Palace, and local sightseeing.' },
      { day: 3, title: 'Jaipur to Jodhpur', description: 'Drive to Blue City, visit Mehrangarh Fort.' },
      { day: 4, title: 'Jodhpur to Jaisalmer', description: 'Scenic drive to Golden City through desert landscape.' },
      { day: 5, title: 'Jaisalmer', description: 'Fort, Patwon Ki Haveli, and desert camping.' },
      { day: 6, title: 'Desert Safari', description: 'Camel safari and sunset in the dunes.' },
      { day: 7, title: 'Jaisalmer to Udaipur', description: 'Drive to City of Lakes via Ranakpur.' },
      { day: 8, title: 'Departure', description: 'City Palace, Lake Pichola, then departure.' },
    ],
    faq: [
      { question: 'Is desert camping comfortable?', answer: 'Yes, we provide luxury tents with proper bedding and facilities.' },
    ],
    featured: true,
    location: 'Rajasthan',
    groupSize: '2-12 people',
    description: 'Immerse yourself in the royal heritage of Rajasthan with visits to magnificent forts, palaces, and a memorable desert experience.',
    highlights: ['Heritage hotels', 'Camel safari', 'Desert camping', 'Cultural shows'],
  },
  {
    slug: 'goa-beach-escape',
    title: 'Goa Beach Escape',
    category: 'tour-packages',
    subcategory: 'domestic',
    duration: '4 Days / 3 Nights',
    price: 12999,
    originalPrice: 17999,
    rating: 4.6,
    reviews: 312,
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
    ],
    inclusions: ['Beach resort', 'Daily breakfast', 'Airport transfers', 'Water sports'],
    exclusions: ['Flights', 'Lunch & dinner', 'Personal expenses'],
    itinerary: [
      { day: 1, title: 'Arrival', description: 'Arrive in Goa, transfer to beach resort.' },
      { day: 2, title: 'North Goa Tour', description: 'Visit Calangute, Baga, Anjuna beaches.' },
      { day: 3, title: 'South Goa Tour', description: 'Explore Colva, Palolem beaches and Old Goa.' },
      { day: 4, title: 'Departure', description: 'Morning leisure, then airport transfer.' },
    ],
    faq: [],
    featured: false,
    location: 'Goa',
    groupSize: '2-20 people',
    description: 'Perfect beach getaway with water sports, beach parties, and exploration of Goa\'s famous beaches and heritage.',
    highlights: ['Beach resort', 'Water sports', 'Nightlife', 'Portuguese heritage'],
  },
  {
    slug: 'ladakh-adventure',
    title: 'Ladakh Adventure',
    category: 'adventure-activities',
    subcategory: 'trekking',
    duration: '10 Days / 9 Nights',
    price: 49999,
    originalPrice: 69999,
    rating: 4.9,
    reviews: 98,
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    ],
    inclusions: ['Accommodation', 'All meals', 'Trekking gear', 'Expert guides'],
    exclusions: ['Flights', 'Personal expenses', 'Travel insurance'],
    itinerary: [
      { day: 1, title: 'Arrival in Leh', description: 'Arrive at Leh airport, acclimatization day.' },
      { day: 2, title: 'Leh Sightseeing', description: 'Visit Shanti Stupa, Leh Palace, markets.' },
      { day: 3, title: 'Nubra Valley', description: 'Drive via Khardung La to Nubra Valley.' },
      { day: 4, title: 'Diskit & Hunder', description: 'Visit Diskit Monastery, sand dunes.' },
      { day: 5, title: 'Pangong Tso', description: 'Scenic drive to the stunning blue lake.' },
      { day: 6, title: 'Pangong to Leh', description: 'Return drive with stops at Chang La.' },
      { day: 7, title: 'Trek Begins', description: 'Start Markha Valley trek.' },
      { day: 8, title: 'Trek Continues', description: 'Trek to Kang Karpo.' },
      { day: 9, title: 'Trek Ends', description: 'Complete trek, return to Leh.' },
      { day: 10, title: 'Departure', description: 'Morning flight to Delhi.' },
    ],
    faq: [
      { question: 'Is altitude sickness a concern?', answer: 'Yes, we include acclimatization days. Consult your doctor before booking.' },
    ],
    featured: true,
    location: 'Ladakh',
    groupSize: '4-12 people',
    description: 'The ultimate Ladakh adventure combining road trip through the highest passes with an epic trek through Markha Valley.',
    highlights: ['Pangong Lake', 'Nubra Valley', 'Markha Valley trek', 'High altitude passes'],
  },
  {
    slug: 'himachal-trek',
    title: 'Hampta Pass Trek',
    category: 'trekking-camps',
    subcategory: 'trekking',
    duration: '5 Days / 4 Nights',
    price: 8999,
    originalPrice: 12999,
    rating: 4.8,
    reviews: 167,
    heroImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
    ],
    inclusions: ['Camping equipment', 'Meals', 'Guide', 'Porters'],
    exclusions: ['Transport to Manali', 'Personal gear', 'Insurance'],
    itinerary: [
      { day: 1, title: 'Manali to Jobra', description: 'Trek from Manali to Jobra through forests.' },
      { day: 2, title: 'Jobra to Chhika', description: 'Trek through beautiful meadows.' },
      { day: 3, title: 'Chhika to Balu Ka Ghera', description: 'Cross snowfields and streams.' },
      { day: 4, title: 'Summit Day', description: 'Cross Hampta Pass (14,000 ft), descend.' },
      { day: 5, title: 'Return to Manali', description: 'Final trek to Manali.' },
    ],
    faq: [
      { question: 'What fitness level is required?', answer: 'Moderate fitness level required. Previous trekking experience is helpful.' },
    ],
    featured: true,
    location: 'Himachal Pradesh',
    groupSize: '6-15 people',
    description: 'A classic Himalayan trek crossing Hampta Pass with dramatic landscape changes from lush valleys to barren mountains.',
    highlights: ['Hampta Pass', 'Camping', 'Mountain views', 'All gear included'],
  },
  {
    slug: 'spiti-valley-tour',
    title: 'Spiti Valley Expedition',
    category: 'group-tours',
    subcategory: 'adventure',
    duration: '9 Days / 8 Nights',
    price: 42999,
    originalPrice: 57999,
    rating: 4.9,
    reviews: 78,
    heroImage: 'https://images.unsplash.com/photo-1575408264798-b50b252663e6?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1575408264798-b50b252663e6?w=800',
    ],
    inclusions: ['SUV transport', 'Guesthouse stay', 'Meals', 'Guide'],
    exclusions: ['Flights', 'Personal expenses', 'Entry fees'],
    itinerary: [
      { day: 1, title: 'Chandigarh to Sangla', description: 'Scenic drive through Sutlej valley.' },
      { day: 2, title: 'Sangla to Kalpa', description: 'Visit Reckong Peo, observe Kinner Kailash.' },
      { day: 3, title: 'Kalpa to Kaza', description: 'Enter Spiti via Nako,参观Key Monastery.' },
      { day: 4, title: 'Kaza Sightseeing', description: 'Key Monastery, Kibber Village, Chicham Bridge.' },
      { day: 5, title: 'Hikkim & Langza', description: 'Visit highest post office, meet locals.' },
      { day: 6, title: 'Demul & Lhalung', description: 'Traditional villages off the beaten path.' },
      { day: 7, title: 'Kaza to Chandratal', description: 'Drive to the beautiful Chandratal Lake.' },
      { day: 8, title: 'Chandratal to Manali', description: 'Scenic drive over Rohtang.' },
      { day: 9, title: 'Departure', description: 'Buffer day, departure from Manali.' },
    ],
    faq: [],
    featured: true,
    location: 'Himachal Pradesh',
    groupSize: '4-10 people',
    description: 'Explore the raw beauty of Spiti Valley, one of India\'s most remote and stunning destinations.',
    highlights: ['Key Monastery', 'Chandratal Lake', 'Kibber Village', 'Off-road adventure'],
  },
  {
    slug: 'chardham-yatra',
    title: 'CharDham Yatra',
    category: 'char-dham',
    subcategory: 'pilgrimage',
    duration: '12 Days / 11 Nights',
    price: 38999,
    originalPrice: 49999,
    rating: 4.8,
    reviews: 234,
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    ],
    inclusions: ['Hotel stays', 'All meals', 'VIP darshan', 'Purohit services'],
    exclusions: ['Flights to Dehradun', 'Personal expenses', 'Helicopter (if opted)'],
    itinerary: [
      { day: 1, title: 'Arrival in Haridwar', description: 'Welcome, evening Ganga Aarti at Har Ki Pauri.' },
      { day: 2, title: 'Haridwar to Barkot', description: 'Drive to Barkot via Yamunotri road.' },
      { day: 3, title: 'Yamunotri Darshan', description: 'Trek to Yamunotri temple, hot springs.' },
      { day: 4, title: 'Barkot to Uttarkashi', description: 'Drive to Uttarkashi, visit Vishwanath Temple.' },
      { day: 5, title: 'Gangotri Darshan', description: 'Full day trip to Gangotri temple.' },
      { day: 6, title: 'Uttarkashi to Gaurikund', description: 'Drive to Gaurikund, preparation for Kedarnath.' },
      { day: 7, title: 'Kedarnath Darshan', description: 'Trek/pony to Kedarnath temple.' },
      { day: 8, title: 'Kedarnath to Gaurikund', description: 'Return trek, drive to Guptkashi.' },
      { day: 9, title: 'Guptkashi to Badrinath', description: 'Drive to Badrinath via Chopta.' },
      { day: 10, title: 'Badrinath Darshan', description: 'Full day at Badrinath temple, Mana Village.' },
      { day: 11, title: 'Badrinath to Rudraprayag', description: 'Drive to Rudraprayag via Joshimath.' },
      { day: 12, title: 'Departure', description: 'Drive to Haridwar/Rishikesh for departure.' },
    ],
    faq: [
      { question: 'Is helicopter available?', answer: 'Yes, helicopter packages are available at additional cost for Kedarnath.' },
      { question: 'What about high altitude?', answer: 'We include proper acclimatization and medical support.' },
    ],
    featured: true,
    location: 'Uttarakhand',
    groupSize: '10-40 people',
    description: 'Complete CharDham Yatra covering Yamunotri, Gangotri, Kedarnath, and Badrinath - the most sacred pilgrimage circuit in India.',
    highlights: ['All four temples', 'VIP darshan', 'Purohit services', 'Comfortable stays'],
  },
  {
    slug: 'leh-manali-bike-trip',
    title: 'Leh-Manali Bike Expedition',
    category: 'bike-expeditions',
    subcategory: 'motorcycle',
    duration: '10 Days / 9 Nights',
    price: 32999,
    originalPrice: 44999,
    rating: 4.9,
    reviews: 156,
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    ],
    inclusions: ['Royal Enfield bike', 'Accommodation', 'Meals', 'Support vehicle'],
    exclusions: ['Fuel', 'Personal expenses', 'Insurance'],
    itinerary: [
      { day: 1, title: 'Manali Arrival', description: 'Bike allocation, briefing, overnight in Manali.' },
      { day: 2, title: 'Manali to Keylong', description: 'Cross Rohtang, Baralacha La to Keylong.' },
      { day: 3, title: 'Keylong to Sarchu', description: 'Ride through Tanglang La, camp at Sarchu.' },
      { day: 4, title: 'Sarchu to Leh', description: 'Cross Nakee La, Lachung La, arrive Leh.' },
      { day: 5, title: 'Leh Rest Day', description: 'Acclimatization, local sightseeing.' },
      { day: 6, title: 'Leh to Nubra', description: 'Ride over Khardung La to Diskit.' },
      { day: 7, title: 'Nubra Valley', description: 'Explore, sand dunes, monastery visits.' },
      { day: 8, title: 'Nubra to Pangong', description: 'Ride to the stunning Pangong Tso.' },
      { day: 9, title: 'Pangong to Leh', description: 'Return ride via Chang La.' },
      { day: 10, title: 'Departure', description: 'Airport transfer from Leh.' },
    ],
    faq: [
      { question: 'Do I need riding experience?', answer: 'Yes, you need experience riding motorcycles on mountain roads.' },
      { question: 'What if I cant ride?', answer: 'Pillion seats available on all days.' },
    ],
    featured: true,
    location: 'Leh-Ladakh',
    groupSize: '8-20 riders',
    description: "The ultimate motorcycle adventure on the world's highest motorable passes from Manali to Leh and back.",
    highlights: ['Khardung La', 'Pangong Lake', 'Support vehicle', 'Camping nights'],
  },
  {
    slug: 'harley-ride-rajasthan',
    title: 'Harley-Davidson Rajasthan',
    category: 'bike-expeditions',
    subcategory: 'luxury',
    duration: '7 Days / 6 Nights',
    price: 65999,
    originalPrice: 89999,
    rating: 4.8,
    reviews: 45,
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    ],
    inclusions: ['Harley-Davidson bike', 'Luxury hotels', 'All meals', 'SAG vehicle'],
    exclusions: ['Flights', 'Personal shopping', 'Fuel'],
    itinerary: [
      { day: 1, title: 'Delhi to Jaipur', description: 'Kickoff ride to the Pink City.' },
      { day: 2, title: 'Jaipur', description: 'Explore Amber Fort, market ride.' },
      { day: 3, title: 'Jaipur to Jodhpur', description: 'Ride to Blue City via Ajmer.' },
      { day: 4, title: 'Jodhpur to Jaisalmer', description: 'Desert highway ride.' },
      { day: 5, title: 'Jaisalmer', description: 'Desert safari, golden fort.' },
      { day: 6, title: 'Jaisalmer to Udaipur', description: 'Scenic ride to City of Lakes.' },
      { day: 7, title: 'Departure', description: 'Flight from Udaipur to Delhi.' },
    ],
    faq: [],
    featured: false,
    location: 'Rajasthan',
    groupSize: '6-12 riders',
    description: 'Premium motorcycle tour on Harley-Davidson bikes through Rajasthan\'s royal highways and majestic forts.',
    highlights: ['Harley bikes', 'Luxury hotels', 'SAG support', 'Royal routes'],
  },
  {
    slug: 'kedarnath-helicopter',
    title: 'Kedarnath by Helicopter',
    category: 'helicopter-services',
    subcategory: 'pilgrimage',
    duration: '2 Days / 1 Night',
    price: 24999,
    originalPrice: 34999,
    rating: 4.7,
    reviews: 412,
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    ],
    inclusions: ['Helicopter ride', 'Hotel stay', 'VIP darshan', 'Meals'],
    exclusions: ['Flights to Dehradun', 'Personal expenses'],
    itinerary: [
      { day: 1, title: 'Dehradun to Kedarnath', description: 'Morning helicopter to Kedarnath, VIP darshan.' },
      { day: 2, title: 'Kedarnath to Dehradun', description: 'Morning darshan, return helicopter.' },
    ],
    faq: [
      { question: 'Weight limit?', answer: 'Maximum 80kg per person. Additional luggage can be sent separately.' },
    ],
    featured: true,
    location: 'Uttarakhand',
    groupSize: '4-8 per batch',
    description: 'Quick and comfortable Kedarnath darshan by helicopter with VIP temple access.',
    highlights: ['Helicopter ride', 'VIP darshan', 'No trek needed', 'Premium hotel'],
  },
  {
    slug: 'do-dham-helicopter',
    title: 'Do Dham by Helicopter',
    category: 'helicopter-services',
    subcategory: 'pilgrimage',
    duration: '3 Days / 2 Nights',
    price: 49999,
    originalPrice: 69999,
    rating: 4.8,
    reviews: 198,
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    ],
    inclusions: ['Helicopter', 'Hotels', 'VIP darshan', 'All meals'],
    exclusions: ['Flights to Dehradun', 'Personal expenses'],
    itinerary: [
      { day: 1, title: 'Dehradun to Kedarnath', description: 'Helicopter to Kedarnath, darshan, stay at hotel.' },
      { day: 2, title: 'Kedarnath to Badrinath', description: 'Morning darshan, helicopter to Badrinath.' },
      { day: 3, title: 'Return', description: 'Badrinath darshan, return to Dehradun.' },
    ],
    faq: [],
    featured: false,
    location: 'Uttarakhand',
    groupSize: '4-8 per batch',
    description: 'Complete Do Dham yatra (Kedarnath & Badrinath) by helicopter with VIP darshan.',
    highlights: ['Both temples', 'VIP darshan', 'Luxury hotels', 'Time saving'],
  },
  {
    slug: 'corporate-offsite',
    title: 'Corporate Offsite',
    category: 'mice',
    subcategory: 'corporate',
    duration: '3 Days / 2 Nights',
    price: 15999,
    originalPrice: 22999,
    rating: 4.6,
    reviews: 67,
    heroImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    ],
    inclusions: ['Conference venue', 'Accommodation', 'Meals', 'Team activities'],
    exclusions: ['Transport', 'Personal expenses', 'Alcohol'],
    itinerary: [
      { day: 1, title: 'Arrival & Setup', description: 'Team arrival, conference setup, icebreaker activities.' },
      { day: 2, title: 'Sessions & Activities', description: 'Morning sessions, afternoon team building, evening dinner.' },
      { day: 3, title: 'Wrap Up', description: 'Final session, feedback, departure.' },
    ],
    faq: [
      { question: 'Customization possible?', answer: 'Yes, we can customize the entire itinerary for your team.' },
    ],
    featured: false,
    location: 'Flexible',
    groupSize: '20-100 people',
    description: 'Complete corporate offsite packages with conference facilities, team building, and recreational activities.',
    highlights: ['Conference setup', 'Team activities', 'Customizable', 'All-inclusive'],
  },
  {
    slug: 'wedding-destination',
    title: 'Destination Wedding',
    category: 'mice',
    subcategory: 'events',
    duration: '4 Days / 3 Nights',
    price: 79999,
    originalPrice: 99999,
    rating: 4.9,
    reviews: 34,
    heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    ],
    inclusions: ['Venue', 'Decoration', 'Catering', 'Accommodation', 'Photography'],
    exclusions: ['Attire', 'Travel', 'Personal expenses'],
    itinerary: [
      { day: 1, title: 'Haldi & Sangeet', description: 'Guest arrival, haldi ceremony, sangeet night.' },
      { day: 2, title: 'Wedding Day', description: 'Wedding ceremony, reception, dinner.' },
      { day: 3, title: 'Farewell', description: 'Brunch, guest departure.' },
      { day: 4, title: 'Buffer', description: 'Emergency buffer day.' },
    ],
    faq: [
      { question: 'Guest capacity?', answer: 'We can arrange venues from 50 to 500+ guests.' },
    ],
    featured: true,
    location: 'Flexible',
    groupSize: '50-500 guests',
    description: 'Dream destination wedding packages with complete planning, decoration, catering, and hospitality.',
    highlights: ['Complete planning', 'Premium venues', 'Expert decorators', 'Photo/Video'],
  },
  {
    slug: 'ladakh-group-tour',
    title: 'Ladakh Discovery Group',
    category: 'group-tours',
    subcategory: 'adventure',
    duration: '8 Days / 7 Nights',
    price: 36999,
    originalPrice: 49999,
    rating: 4.9,
    reviews: 123,
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    ],
    inclusions: ['SUV transport', 'Hotels', 'Meals', 'Guide'],
    exclusions: ['Flights', 'Personal expenses', 'Entry fees'],
    itinerary: [
      { day: 1, title: 'Leh Arrival', description: 'Airport pickup, acclimatization day.' },
      { day: 2, title: 'Leh Sightseeing', description: 'Shanti Stupa, Leh Palace, markets.' },
      { day: 3, title: 'Nubra Valley', description: 'Drive via Khardung La.' },
      { day: 4, title: 'Diskit & Hunder', description: 'Monastery, sand dunes, double-humped camels.' },
      { day: 5, title: 'Pangong Tso', description: 'Iconic blue lake, sunset view.' },
      { day: 6, title: 'Return via Chang La', description: 'Scenic drive back to Leh.' },
      { day: 7, title: 'Free Day', description: 'Optional rafting or monastery visits.' },
      { day: 8, title: 'Departure', description: 'Airport transfer.' },
    ],
    faq: [],
    featured: true,
    location: 'Ladakh',
    groupSize: '8-15 people',
    description: 'Join our small group tour to discover Ladakh\'s stunning landscapes, monasteries, and the iconic Pangong Lake.',
    highlights: ['Pangong Lake', 'Nubra Valley', 'Small group', 'Expert guide'],
  },
  {
    slug: 'sikkim-trek',
    title: 'Goechala Trek',
    category: 'trekking-camps',
    subcategory: 'trekking',
    duration: '12 Days / 11 Nights',
    price: 32999,
    originalPrice: 44999,
    rating: 4.8,
    reviews: 89,
    heroImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
    ],
    inclusions: ['Camping', 'Meals', 'Permits', 'Guide', 'Porters'],
    exclusions: ['Flights to Bagdogra', 'Personal gear', 'Insurance'],
    itinerary: [
      { day: 1, title: 'Arrival in Bagdogra', description: 'Drive to Siliguri, overnight.' },
      { day: 2, title: 'To Yuksom', description: 'Drive to Yuksom, trek starts.' },
      { day: 3, title: 'Trek to Bakthim', description: 'Enter Khanchendzonga National Park.' },
      { day: 4, title: 'Trek to Dzongri', description: 'Acclimatization day with views.' },
      { day: 5, title: 'Rest Day', description: 'Explore Dzongri, mountain views.' },
      { day: 6, title: 'Trek to Thangsing', description: 'Forest trail to Thangsing.' },
      { day: 7, title: 'Trek to Goechala', description: 'Summit attempt, base camp.' },
      { day: 8, title: 'Goecha La', description: 'Early morning summit, return.' },
      { day: 9, title: 'Return to Thangsing', description: 'Descend to Thangsing.' },
      { day: 10, title: 'Return to Yuksom', description: 'Continue descent.' },
      { day: 11, title: 'Drive to Pelling', description: 'Drive to Pelling, relax.' },
      { day: 12, title: 'Departure', description: 'Return to Bagdogra.' },
    ],
    faq: [
      { question: 'Difficulty level?', answer: 'Strenuous. Prior high-altitude trekking experience required.' },
    ],
    featured: false,
    location: 'Sikkim',
    groupSize: '6-12 people',
    description: 'Epic trek to Goechala Pass with stunning views of Kanchenjunga, India\'s highest peak.',
    highlights: ['Kanchenjunga views', 'High altitude pass', 'Forest trails', 'Base camp camping'],
  },
  {
    slug: 'andaman-island-hop',
    title: 'Andaman Island Hopping',
    category: 'tour-packages',
    subcategory: 'island',
    duration: '6 Days / 5 Nights',
    price: 28999,
    originalPrice: 39999,
    rating: 4.7,
    reviews: 178,
    heroImage: 'https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=800',
    ],
    inclusions: ['Ferry tickets', 'Hotels', 'Daily breakfast', 'Sightseeing'],
    exclusions: ['Flights', 'Water sports', 'Lunch & dinner'],
    itinerary: [
      { day: 1, title: 'Port Blair', description: 'Arrival, Cellular Jail, Light & Sound show.' },
      { day: 2, title: 'Havelock', description: 'Ferry to Havelock, Radhanagar Beach.' },
      { day: 3, title: 'Havelock Activities', description: 'Scuba/-snorkeling, Elephant Beach.' },
      { day: 4, title: 'Neil Island', description: 'Ferry to Neil, Bharatpur, Laxmanpur beaches.' },
      { day: 5, title: 'Return to Port Blair', description: 'Ross Island, North Bay day trip.' },
      { day: 6, title: 'Departure', description: 'Morning transfer to airport.' },
    ],
    faq: [
      { question: 'Best time?', answer: 'October to May is ideal for Andaman trips.' },
    ],
    featured: false,
    location: 'Andaman & Nicobar',
    groupSize: '2-15 people',
    description: 'Explore the pristine islands of Andaman with beautiful beaches, coral reefs, and water sports.',
    highlights: ['Radhanagar Beach', 'Snorkeling', 'Island hopping', 'Ferry rides'],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return SAMPLE_PRODUCTS.find(p => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return SAMPLE_PRODUCTS.filter(p => p.category === category);
}

export function getAllProducts(): Product[] {
  return SAMPLE_PRODUCTS;
}

export function getFeaturedProducts(): Product[] {
  return SAMPLE_PRODUCTS.filter(p => p.featured);
}

export function filterProductsList(products: Product[], filters: ProductSearchFilters): Product[] {
  const query = filters.query?.trim().toLowerCase() ?? '';
  const category = filters.category?.trim().toLowerCase() ?? '';
  const city = filters.city?.trim().toLowerCase() ?? '';

  return products.filter((product) => {
    const matchesQuery =
      !query ||
      product.title.toLowerCase().includes(query) ||
      product.location.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.highlights.some((highlight) => highlight.toLowerCase().includes(query));

    const matchesCategory = !category || product.category.toLowerCase() === category;
    const matchesCity = !city || product.location.toLowerCase() === city;

    return matchesQuery && matchesCategory && matchesCity;
  });
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return SAMPLE_PRODUCTS.filter(p =>
    p.title.toLowerCase().includes(lowerQuery) ||
    p.location.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery)
  );
}

interface ProductSearchFilters {
  query?: string;
  category?: string;
  city?: string;
}

export function filterProducts(filters: ProductSearchFilters): Product[] {
  return filterProductsList(SAMPLE_PRODUCTS, filters);
}

export function getAllCategories(): string[] {
  return [...new Set(SAMPLE_PRODUCTS.map(p => p.category))];
}

export function getDestinations(): { name: string; image: string; packages: number; category: string }[] {
  return getDestinationsFromProducts(SAMPLE_PRODUCTS);
}

export function getDestinationsFromProducts(products: Product[]): { name: string; image: string; packages: number; category: string }[] {
  const locationCounts = products.reduce((acc, p) => {
    acc[p.location] = (acc[p.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(locationCounts).map(([location, count]) => ({
    name: location,
    image: products.find(p => p.location === location)?.heroImage || '',
    packages: count,
    category: products.find(p => p.location === location)?.category || '',
  }));
}

export function getAvailableCities(): string[] {
  return getAvailableCitiesFromProducts(SAMPLE_PRODUCTS);
}

export function getAvailableCitiesFromProducts(products: Product[]): string[] {
  return [...new Set(products.map((product) => product.location))].sort((a, b) =>
    a.localeCompare(b)
  );
}
