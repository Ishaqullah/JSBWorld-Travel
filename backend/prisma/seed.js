import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const tours = [
  {
    id: '1',
    title: 'Bali Island Adventure',
    category: 'Beach',
    location: 'Bali, Indonesia',
    price: 10,
    duration: 7,
    rating: 4.9,
    reviewCount: 342,
    maxGroupSize: 12,
    difficulty: 'EASY',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      'https://images.unsplash.com/photo-1555400082-6093e3e8c5e6?w=800&q=80',
    ],
    description: 'Experience the magic of Bali with pristine beaches, ancient temples, and vibrant culture.',
    highlights: [
      'Visit iconic Tanah Lot Temple',
      'Relax on stunning beaches',
      'Traditional Balinese cooking class',
      'Sunrise at Mount Batur',
      'Ubud rice terraces tour',
    ],
    included: [
      'Accommodation in 4-star hotels',
      'Daily breakfast and 4 dinners',
      'Professional English-speaking guide',
      'All entrance fees',
      'Airport transfers',
    ],
    excluded: [
      'International flights',
      'Travel insurance',
      'Personal expenses',
      'Lunch (except mentioned)',
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Bali', description: 'Welcome to paradise! Transfer to hotel and evening welcome dinner.' },
      { day: 2, title: 'Ubud Cultural Tour', description: 'Explore Ubud Palace, art markets, and rice terraces.' },
      { day: 3, title: 'Temple & Beach Day', description: 'Visit Tanah Lot and relax at Seminyak Beach.' },
      { day: 4, title: 'Mount Batur Sunrise Trek', description: 'Early morning trek to catch spectacular sunrise.' },
      { day: 5, title: 'Cooking Class & Spa', description: 'Learn Balinese cuisine and enjoy traditional spa treatment.' },
      { day: 6, title: 'Beach Activities', description: 'Water sports, snorkeling, or relaxation day.' },
      { day: 7, title: 'Departure', description: 'Breakfast and airport transfer for your journey home.' },
    ],
    availableDates: ['2025-06-15', '2025-07-10', '2025-08-05', '2025-09-12'],
  },
  {
    id: '2',
    title: 'Swiss Alps Mountain Trek',
    category: 'Mountain',
    location: 'Swiss Alps, Switzerland',
    price: 20,
    duration: 10,
    rating: 5.0,
    reviewCount: 218,
    maxGroupSize: 8,
    difficulty: 'MODERATE',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&q=80',
    ],
    description: 'Trek through breathtaking Alpine landscapes with professional mountain guides.',
    highlights: [
      'Jungfrau summit experience',
      'Glacier hiking adventure',
      'Traditional Swiss village stays',
      'Cable car rides with panoramic views',
      'Mountain photography workshops',
    ],
    included: [
      'Mountain lodge accommodation',
      'All meals during trek',
      'Professional mountain guide',
      'Trekking permits and equipment',
      'Cable car tickets',
    ],
    excluded: [
      'International flights',
      'Travel insurance',
      'Personal gear',
      'Tips for guides',
    ],
    itinerary: [
      { day: 1, title: 'Zurich Arrival', description: 'Meet the group and transfer to Interlaken.' },
      { day: 2, title: 'Jungfrau Region', description: 'Cable car to Jungfraujoch - Top of Europe.' },
      { day: 3, title: 'Trek to Grindelwald', description: 'Scenic mountain trail with glacier views.' },
      { day: 4, title: 'Glacier Hiking', description: 'Guided glacier hiking experience.' },
      { day: 5, title: 'Lauterbrunnen Valley', description: 'Explore stunning waterfalls and valleys.' },
      { day: 6, title: 'Mount Titlis', description: 'Visit rotating cable car and ice grotto.' },
      { day: 7, title: 'Alpine Village Day', description: 'Experience traditional Swiss culture.' },
      { day: 8, title: 'Photography Trek', description: 'Capture stunning mountain landscapes.' },
      { day: 9, title: 'Farewell Dinner', description: 'Celebrate with traditional Swiss fondue.' },
      { day: 10, title: 'Departure', description: 'Transfer to Zurich airport.' },
    ],
    availableDates: ['2025-06-20', '2025-07-15', '2025-08-10'],
  },
  {
    id: '3',
    title: 'African Safari Experience',
    category: 'Wildlife',
    location: 'Serengeti, Tanzania',
    price: 30,
    duration: 8,
    rating: 4.8,
    reviewCount: 156,
    maxGroupSize: 10,
    difficulty: 'EASY',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
      'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80',
      'https://images.unsplash.com/photo-1535338788023-51d1a4d98c95?w=800&q=80',
    ],
    description: 'Witness the Great Migration and encounter the Big Five on this unforgettable safari.',
    highlights: [
      'Big Five game drives',
      'Hot air balloon safari',
      'Maasai village visit',
      'Ngorongoro Crater exploration',
      'Professional wildlife photography guidance',
    ],
    included: [
      'Luxury safari lodge accommodation',
      'All meals',
      'Game drives in 4x4 vehicles',
      'Professional safari guide',
      'Park entrance fees',
    ],
    excluded: [
      'International flights',
      'Visa fees',
      'Travel insurance',
      'Alcoholic beverages',
    ],
    itinerary: [
      { day: 1, title: 'Arusha Arrival', description: 'Welcome briefing and overnight in Arusha.' },
      { day: 2, title: 'Serengeti National Park', description: 'Transfer and afternoon game drive.' },
      { day: 3, title: 'Central Serengeti', description: 'Full day wildlife viewing.' },
      { day: 4, title: 'Hot Air Balloon Safari', description: 'Dawn balloon ride followed by champagne breakfast.' },
      { day: 5, title: 'Ngorongoro Crater', description: 'Descend into the crater for game viewing.' },
      { day: 6, title: 'Maasai Cultural Experience', description: 'Visit traditional Maasai village.' },
      { day: 7, title: 'Tarangire National Park', description: 'Elephant herds and baobab trees.' },
      { day: 8, title: 'Departure', description: 'Morning game drive and transfer to airport.' },
    ],
    availableDates: ['2025-07-01', '2025-08-15', '2025-09-20', '2025-10-10'],
  },
  {
    id: '4',
    title: 'Tokyo Cultural Discovery',
    category: 'Culture',
    location: 'Tokyo, Japan',
    price: 40,
    duration: 6,
    rating: 4.9,
    reviewCount: 289,
    maxGroupSize: 15,
    difficulty: 'EASY',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
      'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800&q=80',
      'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=800&q=80',
    ],
    description: 'Immerse yourself in the perfect blend of ancient traditions and modern innovation.',
    highlights: [
      'Authentic tea ceremony',
      'Sushi making class',
      'Mount Fuji day trip',
      'Traditional ryokan stay',
      'Anime and technology district tours',
    ],
    included: [
      'Hotel and ryokan accommodation',
      'Daily breakfast',
      'All transportation',
      'English-speaking guide',
      'Entrance fees',
    ],
    excluded: [
      'International flights',
      'Lunch and dinner',
      'Travel insurance',
      'Optional activities',
    ],
    itinerary: [
      { day: 1, title: 'Tokyo Arrival', description: 'Check-in and evening exploration of Shibuya.' },
      { day: 2, title: 'Historic Tokyo', description: 'Visit Senso-ji Temple, Imperial Palace, and tea ceremony.' },
      { day: 3, title: 'Mount Fuji Excursion', description: 'Day trip to Mt. Fuji and Hakone.' },
      { day: 4, title: 'Modern Tokyo', description: 'Akihabara, TeamLab Borderless, and sushi class.' },
      { day: 5, title: 'Ryokan Experience', description: 'Traditional inn stay with kaiseki dinner.' },
      { day: 6, title: 'Departure', description: 'Free morning and airport transfer.' },
    ],
    availableDates: ['2025-05-10', '2025-06-15', '2025-09-05', '2025-10-20'],
  },
  {
    id: '5',
    title: 'Amazon Rainforest Expedition',
    category: 'Adventure',
    location: 'Amazon Basin, Peru',
    price: 50,
    duration: 9,
    rating: 4.7,
    reviewCount: 127,
    maxGroupSize: 12,
    difficulty: 'CHALLENGING',
    image: 'https://images.unsplash.com/photo-1516442719524-a603408c90cb?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1516442719524-a603408c90cb?w=800&q=80',
      'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800&q=80',
      'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800&q=80',
    ],
    description: 'Venture deep into the Amazon for an authentic jungle experience with local guides.',
    highlights: [
      'Jungle canopy walks',
      'Piranha fishing',
      'Indigenous community visits',
      'Night wildlife spotting',
      'River kayaking adventures',
    ],
    included: [
      'Eco-lodge accommodation',
      'All meals',
      'Experienced jungle guides',
      'Boat transfers',
      'Safety equipment',
    ],
    excluded: [
      'International flights',
      'Travel insurance',
      'Vaccinations',
      'Personal gear',
    ],
    itinerary: [
      { day: 1, title: 'Iquitos Arrival', description: 'Arrive and transfer to eco-lodge.' },
      { day: 2, title: 'Jungle Introduction', description: 'Guided nature walk and wildlife spotting.' },
      { day: 3, title: 'Canopy Experience', description: 'Canopy walkway and bird watching.' },
      { day: 4, title: 'River Expedition', description: 'Kayaking and pink dolphin search.' },
      { day: 5, title: 'Indigenous Culture', description: 'Visit local community and learn traditions.' },
      { day: 6, title: 'Deep Jungle Trek', description: 'Full-day expedition into primary forest.' },
      { day: 7, title: 'Night Safari', description: 'Nocturnal wildlife observation.' },
      { day: 8, title: 'Piranha Fishing', description: 'Try traditional fishing methods.' },
      { day: 9, title: 'Return', description: 'Morning bird watching and transfer to Iquitos.' },
    ],
    availableDates: ['2025-06-01', '2025-07-20', '2025-08-15'],
  },
  {
    id: '6',
    title: 'Greek Islands Sailing',
    category: 'Beach',
    location: 'Cyclades, Greece',
    price: 60,
    duration: 7,
    rating: 5.0,
    reviewCount: 203,
    maxGroupSize: 10,
    difficulty: 'EASY',
    image: 'https://images.unsplash.com/photo-1601581987809-a874a81309c9?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1601581987809-a874a81309c9?w=800&q=80',
      'https://images.unsplash.com/photo-1613395877780-e4697d61f33a?w=800&q=80',
      'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80',
    ],
    description: 'Sail through the stunning Cyclades islands with crystal-clear waters and white-washed villages.',
    highlights: [
      'Private yacht sailing',
      'Swimming in secluded coves',
      'Sunset in Santorini',
      'Fresh Greek cuisine',
      'Ancient ruins exploration',
    ],
    included: [
      'Yacht accommodation',
      'All meals on board',
      'Professional skipper',
      'Snorkeling equipment',
      'Fuel and port fees',
    ],
    excluded: [
      'Flights to Athens',
      'Alcohol (except wine with meals)',
      'Shore excursions',
      'Personal expenses',
    ],
    itinerary: [
      { day: 1, title: 'Athens to Mykonos', description: 'Board yacht and sail to Mykonos.' },
      { day: 2, title: 'Mykonos Exploration', description: 'Explore the island and nightlife.' },
      { day: 3, title: 'Paros', description: 'Swim stops and Paros village tour.' },
      { day: 4, title: 'Naxos', description: 'Beaches and Temple of Apollo.' },
      { day: 5, title: 'Small Cyclades', description: 'Secluded islands and snorkeling.' },
      { day: 6, title: 'Santorini', description: 'Iconic sunset and caldera views.' },
      { day: 7, title: 'Return to Athens', description: 'Morning swim and sail back.' },
    ],
    availableDates: ['2025-05-20', '2025-06-25', '2025-07-30', '2025-08-20'],
  },
];

const categories = [
  { name: 'Beach', icon: 'Waves', description: 'Relax on pristine beaches and enjoy water activities.' },
  { name: 'Mountain', icon: 'Mountain', description: 'Explore majestic peaks and breathtaking landscapes.' },
  { name: 'Wildlife', icon: 'Bird', description: 'Encounter exotic animals in their natural habitats.' },
  { name: 'Culture', icon: 'Landmark', description: 'Immerse yourself in local traditions and history.' },
  { name: 'Adventure', icon: 'Compass', description: 'Thrilling experiences for the daring traveler.' },
];

async function main() {
  console.log('Start seeding ...');

  // 1. Create Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@travecations.com' },
    update: {},
    create: {
      email: 'admin@travecations.com',
      name: 'Admin User',
      passwordHash,
      role: 'ADMIN',
      isVerified: true,
    },
  });
  console.log('Created admin user:', admin.email);

  // 2. Create Categories
  const categoryMap = new Map();
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        name: cat.name,
        slug: cat.name.toLowerCase(),
        icon: cat.icon,
        description: cat.description,
      },
    });
    categoryMap.set(cat.name, category.id);
  }
  console.log('Created categories');

  // 3. Create Tours
  for (const tourData of tours) {
    const categoryId = categoryMap.get(tourData.category);
    if (!categoryId) {
      console.warn(`Category not found for tour: ${tourData.title}`);
      continue;
    }

    // Clean up existing dates before re-seeding to avoidduplicates or past dates issues
    await prisma.tourDate.deleteMany({
      where: { tourId: tourData.id }
    });

    const difficulty = tourData.difficulty.toUpperCase() === 'CHALLENGING' ? 'CHALLENGING' : 
                       tourData.difficulty.toUpperCase() === 'MODERATE' ? 'MODERATE' : 'EASY';

    const tour = await prisma.tour.upsert({
      where: { id: tourData.id },
      update: {},
      create: {
        id: tourData.id,
        title: tourData.title,
        slug: tourData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        categoryId,
        location: tourData.location,
        price: tourData.price,
        duration: tourData.duration,
        rating: tourData.rating,
        reviewCount: tourData.reviewCount,
        maxGroupSize: tourData.maxGroupSize,
        difficulty,
        featuredImage: tourData.image,
        description: tourData.description,
        status: 'PUBLISHED',
        createdById: admin.id,
        
        // Relations
        images: {
          create: tourData.images.map((url, index) => ({
            imageUrl: url,
            displayOrder: index,
          })),
        },
        highlights: {
          create: tourData.highlights.map((highlight, index) => ({
            highlight,
            displayOrder: index,
          })),
        },
        inclusions: {
          create: [
            ...tourData.included.map((item, index) => ({
              item,
              type: 'INCLUDED',
              displayOrder: index,
            })),
            ...tourData.excluded.map((item, index) => ({
              item,
              type: 'EXCLUDED',
              displayOrder: index,
            })),
          ],
        },
        itinerary: {
          create: tourData.itinerary.map((item, index) => ({
            dayNumber: item.day,
            title: item.title,
            description: item.description,
            displayOrder: index,
          })),
        },
        // Dates will be created below since upsert create is done
      },
    });

    // Create dynamic future dates (next year relative to seeding)
    const futureDates = tourData.availableDates.map(dateStr => {
        const originalDate = new Date(dateStr);
        // Add 1 year to ensure they are in the future relative to Dec 2025
        const futureDate = new Date(originalDate);
        futureDate.setFullYear(2026); // Force 2026
        
        const endDate = new Date(futureDate);
        endDate.setDate(endDate.getDate() + tourData.duration);
        
        return {
          tourId: tour.id,
          startDate: futureDate,
          endDate: endDate,
          availableSlots: tourData.maxGroupSize,
          bookedSlots: 0,
          status: 'AVAILABLE',
      };
    });

    await prisma.tourDate.createMany({
        data: futureDates
    });

    console.log(`Created tour: ${tour.title} with dates for 2026`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
