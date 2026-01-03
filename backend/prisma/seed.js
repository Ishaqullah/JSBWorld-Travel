import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Clean up existing data
  await prisma.bookingAddOn.deleteMany({});
  await prisma.bookingTraveler.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.tourDate.deleteMany({});
  await prisma.tourAddOn.deleteMany({});
  await prisma.tourItinerary.deleteMany({});
  await prisma.tourInclusion.deleteMany({});
  await prisma.tourHighlight.deleteMany({});
  await prisma.tourImage.deleteMany({});
  await prisma.tour.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Cleaned existing data');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@travecations.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      isVerified: true,
    },
  });
  console.log('Created admin user:', admin.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Adventure', slug: 'adventure', icon: 'Mountain', description: 'Thrilling outdoor adventures' },
    }),
    prisma.category.create({
      data: { name: 'Beach', slug: 'beach', icon: 'Umbrella', description: 'Relaxing beach getaways' },
    }),
    prisma.category.create({
      data: { name: 'Cultural', slug: 'cultural', icon: 'Landmark', description: 'Immersive cultural experiences' },
    }),
    prisma.category.create({
      data: { name: 'Safari', slug: 'safari', icon: 'Binoculars', description: 'Wildlife safari expeditions' },
    }),
  ]);
  console.log('Created categories');

  // Sample tours with complete data
  const toursData = [
    {
      title: 'Bali Island Adventure',
      slug: 'bali-island-adventure',
      categorySlug: 'beach',
      location: 'Bali, Indonesia',
      basePrice: 1299,
      duration: 7,
      maxGroupSize: 12,
      difficulty: 'EASY',
      featuredImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      description: 'Discover the magic of Bali on this 7-day adventure through ancient temples, pristine beaches, and lush rice terraces. Experience traditional Balinese culture, enjoy water sports, and relax in luxury accommodations.',
      images: [
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800',
        'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800',
      ],
      highlights: [
        'Visit the iconic Tanah Lot Temple at sunset',
        'Explore the sacred Monkey Forest in Ubud',
        'Snorkel in crystal-clear waters',
        'Traditional Balinese cooking class',
        'Sunrise trek to Mount Batur',
      ],
      included: [
        '6 nights accommodation in 4-star hotels',
        'Daily breakfast and 3 dinners',
        'All entrance fees and activities',
        'English-speaking guide',
        'Airport transfers',
        'Private air-conditioned transport',
      ],
      excluded: [
        'International flights',
        'Travel insurance',
        'Personal expenses',
        'Tips for guides and drivers',
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Bali', description: 'Welcome to Bali! Transfer to your hotel in Seminyak. Free time to explore the local area and enjoy the beach. Evening welcome dinner.' },
        { day: 2, title: 'Ubud Exploration', description: 'Visit the Sacred Monkey Forest and Ubud Royal Palace. Explore traditional art markets and enjoy a Balinese lunch surrounded by rice paddies.' },
        { day: 3, title: 'Mount Batur Sunrise', description: 'Early morning trek to Mount Batur for a spectacular sunrise. Return for breakfast, then visit Tirta Empul Temple for a spiritual cleansing ritual.' },
        { day: 4, title: 'Water Temple & Rice Terraces', description: 'Explore Ulun Danu Beratan Temple on the lake. Visit the stunning Jatiluwih Rice Terraces (UNESCO World Heritage Site).' },
        { day: 5, title: 'Beach & Water Sports', description: 'Free morning at the beach. Afternoon snorkeling trip to Nusa Penida with chances to see manta rays.' },
        { day: 6, title: 'Tanah Lot & Cooking Class', description: 'Morning cooking class learning Balinese cuisine. Afternoon visit to Tanah Lot Temple for sunset photos.' },
        { day: 7, title: 'Departure', description: 'Free morning for last-minute shopping. Transfer to airport for departure.' },
      ],
      dates: [
        { startDate: '2026-02-15', priceWithout: 1299, priceWith: 1899, earlyBirdWithout: 1099, earlyBirdWith: 1699, earlyBirdDeadline: '2026-01-15', childWithout: 899, childWith: 1399, singleSupplement: 350 },
        { startDate: '2026-03-10', priceWithout: 1399, priceWith: 1999, earlyBirdWithout: 1199, earlyBirdWith: 1799, earlyBirdDeadline: '2026-02-10', childWithout: 999, childWith: 1499, singleSupplement: 350 },
        { startDate: '2026-04-05', priceWithout: 1499, priceWith: 2099, earlyBirdWithout: null, earlyBirdWith: null, earlyBirdDeadline: null, childWithout: 1099, childWith: 1599, singleSupplement: 400 },
        { startDate: '2026-05-20', priceWithout: 1299, priceWith: 1899, earlyBirdWithout: 1099, earlyBirdWith: 1699, earlyBirdDeadline: '2026-04-20', childWithout: 899, childWith: 1399, singleSupplement: 350 },
      ],
      addOns: [
        { name: 'Travel Insurance', description: 'Comprehensive travel insurance covering medical emergencies and trip cancellation.', price: 99 },
        { name: 'Airport Fast Track', description: 'Priority immigration and customs clearance service.', price: 75 },
        { name: 'Spa Package', description: 'Traditional Balinese spa treatment including massage and body scrub.', price: 120 },
        { name: 'Photography Session', description: 'Professional photographer for a 2-hour photo shoot at iconic locations.', price: 199 },
      ],
    },
    {
      title: 'Swiss Alps Expedition',
      slug: 'swiss-alps-expedition',
      categorySlug: 'adventure',
      location: 'Switzerland',
      basePrice: 2499,
      duration: 8,
      maxGroupSize: 10,
      difficulty: 'MODERATE',
      featuredImage: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
      description: 'Experience the breathtaking beauty of the Swiss Alps on this 8-day expedition. Hike through alpine meadows, ride scenic trains, and explore charming mountain villages.',
      images: [
        'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800',
        'https://images.unsplash.com/photo-1527095655658-4febb3e5b3d0?w=800',
      ],
      highlights: [
        'Ride the famous Glacier Express',
        'Hike to the Matterhorn viewpoint',
        'Visit Jungfraujoch - Top of Europe',
        'Explore medieval Lucerne',
        'Swiss chocolate and cheese tasting',
      ],
      included: [
        '7 nights in mountain lodges and hotels',
        'Daily breakfast and 5 dinners',
        'Swiss Travel Pass for trains',
        'Professional mountain guide',
        'Cable car and funicular tickets',
      ],
      excluded: [
        'International flights',
        'Travel insurance',
        'Lunches and drinks',
        'Personal equipment',
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Zurich', description: 'Arrive in Zurich and transfer to Lucerne. Walking tour of the old town and dinner by the lake.' },
        { day: 2, title: 'Mount Pilatus', description: 'Take the world\'s steepest cogwheel railway to Mount Pilatus. Enjoy panoramic views and hiking trails.' },
        { day: 3, title: 'Jungfraujoch', description: 'Train to Interlaken then up to Jungfraujoch, the highest railway station in Europe at 3,454m.' },
        { day: 4, title: 'Grindelwald Hiking', description: 'Full day hiking in the Grindelwald valley with stunning views of the Eiger North Face.' },
        { day: 5, title: 'Glacier Express', description: 'Board the panoramic Glacier Express for the scenic 8-hour journey to Zermatt.' },
        { day: 6, title: 'Matterhorn', description: 'Take the Gornergrat railway for the best views of the Matterhorn. Optional hiking trails.' },
        { day: 7, title: 'Zermatt Exploration', description: 'Free day in Zermatt. Options include hiking, mountain biking, or spa relaxation.' },
        { day: 8, title: 'Departure', description: 'Transfer to Geneva or Zurich airport for departure.' },
      ],
      dates: [
        { startDate: '2026-06-01', priceWithout: 2499, priceWith: 3299, earlyBirdWithout: 2299, earlyBirdWith: 3099, earlyBirdDeadline: '2026-05-01', childWithout: 1899, childWith: 2699, singleSupplement: 600 },
        { startDate: '2026-07-15', priceWithout: 2699, priceWith: 3499, earlyBirdWithout: 2499, earlyBirdWith: 3299, earlyBirdDeadline: '2026-06-15', childWithout: 1999, childWith: 2799, singleSupplement: 650 },
        { startDate: '2026-08-20', priceWithout: 2599, priceWith: 3399, earlyBirdWithout: null, earlyBirdWith: null, earlyBirdDeadline: null, childWithout: 1899, childWith: 2699, singleSupplement: 600 },
      ],
      addOns: [
        { name: 'Travel Insurance', description: 'Comprehensive coverage including mountain rescue.', price: 149 },
        { name: 'Equipment Rental', description: 'High-quality hiking boots and poles.', price: 80 },
        { name: 'Photography Package', description: 'Professional photos of your adventure.', price: 249 },
      ],
    },
    {
      title: 'African Safari Experience',
      slug: 'african-safari-experience',
      categorySlug: 'safari',
      location: 'Kenya & Tanzania',
      basePrice: 3999,
      duration: 10,
      maxGroupSize: 8,
      difficulty: 'EASY',
      featuredImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
      description: 'Embark on the ultimate African safari adventure across Kenya and Tanzania. Witness the Great Migration, spot the Big Five, and experience authentic African culture.',
      images: [
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
        'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800',
      ],
      highlights: [
        'Witness the Great Migration in Serengeti',
        'Spot the Big Five in Masai Mara',
        'Visit a Maasai village',
        'Ngorongoro Crater game drive',
        'Hot air balloon safari over the Serengeti',
      ],
      included: [
        '9 nights in luxury safari lodges',
        'All meals during safari',
        'Private 4x4 safari vehicle',
        'Expert safari guide',
        'Park entrance fees',
        'Bush breakfast and sundowners',
      ],
      excluded: [
        'International flights',
        'Visa fees',
        'Travel insurance',
        'Optional hot air balloon',
        'Gratuities',
      ],
      itinerary: [
        { day: 1, title: 'Arrival in Nairobi', description: 'Welcome to Kenya! Transfer to your hotel. Evening briefing and welcome dinner.' },
        { day: 2, title: 'Masai Mara', description: 'Fly to Masai Mara National Reserve. Afternoon game drive to spot lions, elephants, and more.' },
        { day: 3, title: 'Full Day Masai Mara', description: 'Full day exploring the Mara. Visit a Maasai village in the afternoon.' },
        { day: 4, title: 'Great Migration', description: 'Early morning game drive focused on the wildebeest migration (seasonal). Picnic lunch in the bush.' },
        { day: 5, title: 'Lake Nakuru', description: 'Drive to Lake Nakuru National Park, famous for flamingos and rhinos.' },
        { day: 6, title: 'Cross to Tanzania', description: 'Cross the border to Tanzania. Evening arrival at Serengeti National Park.' },
        { day: 7, title: 'Serengeti Safari', description: 'Full day game drives in the Serengeti. Optional hot air balloon at dawn (extra cost).' },
        { day: 8, title: 'Serengeti to Ngorongoro', description: 'Morning game drive, then drive to Ngorongoro Conservation Area.' },
        { day: 9, title: 'Ngorongoro Crater', description: 'Descend into the Ngorongoro Crater for a full day game drive in this unique ecosystem.' },
        { day: 10, title: 'Departure', description: 'Transfer to Arusha airport for departure.' },
      ],
      dates: [
        { startDate: '2026-07-01', priceWithout: 3999, priceWith: 5299, earlyBirdWithout: 3699, earlyBirdWith: 4999, earlyBirdDeadline: '2026-05-01', childWithout: 2999, childWith: 4299, singleSupplement: 1200 },
        { startDate: '2026-08-15', priceWithout: 4299, priceWith: 5599, earlyBirdWithout: 3999, earlyBirdWith: 5299, earlyBirdDeadline: '2026-06-15', childWithout: 3199, childWith: 4499, singleSupplement: 1300 },
        { startDate: '2026-09-10', priceWithout: 3799, priceWith: 5099, earlyBirdWithout: null, earlyBirdWith: null, earlyBirdDeadline: null, childWithout: 2799, childWith: 4099, singleSupplement: 1100 },
      ],
      addOns: [
        { name: 'Hot Air Balloon Safari', description: 'Sunrise balloon flight over the Serengeti with champagne breakfast.', price: 599 },
        { name: 'Travel Insurance', description: 'Safari-specific coverage including evacuation.', price: 199 },
        { name: 'Photography Guide', description: 'Personal photography guide for the duration of the trip.', price: 499 },
      ],
    },
  ];

  // Create tours with all related data
  for (const tourData of toursData) {
    const category = categories.find(c => c.slug === tourData.categorySlug);
    if (!category) {
      console.warn(`Category not found for tour: ${tourData.title}`);
      continue;
    }

    const tour = await prisma.tour.create({
      data: {
        title: tourData.title,
        slug: tourData.slug,
        categoryId: category.id,
        location: tourData.location,
        price: tourData.basePrice,
        duration: tourData.duration,
        maxGroupSize: tourData.maxGroupSize,
        difficulty: tourData.difficulty,
        featuredImage: tourData.featuredImage,
        description: tourData.description,
        status: 'PUBLISHED',
        createdById: admin.id,
        rating: 4.5,
        reviewCount: Math.floor(Math.random() * 100) + 20,
      },
    });

    // Create images
    await prisma.tourImage.createMany({
      data: tourData.images.map((url, index) => ({
        tourId: tour.id,
        imageUrl: url,
        displayOrder: index,
      })),
    });

    // Create highlights
    await prisma.tourHighlight.createMany({
      data: tourData.highlights.map((highlight, index) => ({
        tourId: tour.id,
        highlight,
        displayOrder: index,
      })),
    });

    // Create inclusions
    await prisma.tourInclusion.createMany({
      data: [
        ...tourData.included.map((item, index) => ({
          tourId: tour.id,
          item,
          type: 'INCLUDED',
          displayOrder: index,
        })),
        ...tourData.excluded.map((item, index) => ({
          tourId: tour.id,
          item,
          type: 'EXCLUDED',
          displayOrder: index,
        })),
      ],
    });

    // Create itinerary
    await prisma.tourItinerary.createMany({
      data: tourData.itinerary.map((day, index) => ({
        tourId: tour.id,
        dayNumber: day.day,
        title: day.title,
        description: day.description,
        displayOrder: index,
      })),
    });

    // Create tour dates with all pricing
    for (const dateInfo of tourData.dates) {
      const startDate = new Date(dateInfo.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + tourData.duration);

      await prisma.tourDate.create({
        data: {
          tourId: tour.id,
          startDate,
          endDate,
          availableSlots: tourData.maxGroupSize,
          bookedSlots: 0,
          status: 'AVAILABLE',
          priceWithoutFlight: dateInfo.priceWithout,
          priceWithFlight: dateInfo.priceWith,
          earlyBirdPriceWithout: dateInfo.earlyBirdWithout,
          earlyBirdPriceWith: dateInfo.earlyBirdWith,
          earlyBirdDeadline: dateInfo.earlyBirdDeadline ? new Date(dateInfo.earlyBirdDeadline) : null,
          childPriceWithout: dateInfo.childWithout,
          childPriceWithFlight: dateInfo.childWith,
          singleSupplement: dateInfo.singleSupplement,
        },
      });
    }

    // Create add-ons
    await prisma.tourAddOn.createMany({
      data: tourData.addOns.map((addOn, index) => ({
        tourId: tour.id,
        name: addOn.name,
        description: addOn.description,
        price: addOn.price,
        displayOrder: index,
        isActive: true,
      })),
    });

    console.log(`Created tour: ${tour.title} with dates, itinerary, and add-ons`);
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
