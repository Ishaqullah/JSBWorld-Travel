import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.$transaction([
    prisma.reviewImage.deleteMany(),
    prisma.review.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.wishlist.deleteMany(),
    prisma.bookingTraveler.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.booking.deleteMany(),
    prisma.tourDate.deleteMany(),
    prisma.tourItinerary.deleteMany(),
    prisma.tourInclusion.deleteMany(),
    prisma.tourHighlight.deleteMany(),
    prisma.tourImage.deleteMany(),
    prisma.tour.deleteMany(),
    prisma.category.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log('✅ Cleared existing data');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Beach',
        slug: 'beach',
        icon: 'Waves',
        description: 'Relax on pristine beaches and enjoy ocean views',
        displayOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Mountain',
        slug: 'mountain',
        icon: 'Mountain',
        description: 'Explore majestic mountains and breathtaking peaks',
        displayOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Wildlife',
        slug: 'wildlife',
        icon: 'Bird',
        description: 'Encounter amazing wildlife in their natural habitat',
        displayOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Culture',
        slug: 'culture',
        icon: 'Landmark',
        description: 'Immerse yourself in rich cultural experiences',
        displayOrder: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Adventure',
        slug: 'adventure',
        icon: 'Compass',
        description: 'Embark on thrilling adventures and expeditions',
        displayOrder: 5,
      },
    }),
  ]);

  console.log('✅ Created categories');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@travecations.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      isVerified: true,
      avatarUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=0ea5e9&color=fff',
    },
  });

  console.log('✅ Created admin user (admin@travecations.com / admin123)');

  // Create sample tours (using existing tours.js data structure)
  const toursData = [
    {
      title: 'Bali Island Adventure',
      slug: 'bali-island-adventure',
      categoryId: categories.find(c => c.slug === 'beach').id,
      location: 'Bali, Indonesia',
      price: 1299,
      duration: 7,
      rating: 4.9,
      reviewCount: 0,
      maxGroupSize: 12,
      difficulty: 'EASY',
      featuredImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      description: 'Experience the magic of Bali with pristine beaches, ancient temples, and vibrant culture.',
      status: 'PUBLISHED',
      createdById: admin.id,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', displayOrder: 0 },
        { imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80', displayOrder: 1 },
        { imageUrl: 'https://images.unsplash.com/photo-1555400082-6093e3e8c5e6?w=800&q=80', displayOrder: 2 },
      ],
      highlights: [
        { highlight: 'Visit iconic Tanah Lot Temple', displayOrder: 0 },
        { highlight: 'Relax on stunning beaches', displayOrder: 1 },
        { highlight: 'Traditional Balinese cooking class', displayOrder: 2 },
        { highlight: 'Sunrise at Mount Batur', displayOrder: 3 },
        { highlight: 'Ubud rice terraces tour', displayOrder: 4 },
      ],
      inclusions: [
        { item: 'Accommodation in 4-star hotels', type: 'INCLUDED', displayOrder: 0 },
        { item: 'Daily breakfast and 4 dinners', type: 'INCLUDED', displayOrder: 1 },
        { item: 'Professional English-speaking guide', type: 'INCLUDED', displayOrder: 2 },
        { item: 'All entrance fees', type: 'INCLUDED', displayOrder: 3 },
        { item: 'Airport transfers', type: 'INCLUDED', displayOrder: 4 },
        { item: 'International flights', type: 'EXCLUDED', displayOrder: 5 },
        { item: 'Travel insurance', type: 'EXCLUDED', displayOrder: 6 },
        { item: 'Personal expenses', type: 'EXCLUDED', displayOrder: 7 },
      ],
      itinerary: [
        { dayNumber: 1, title: 'Arrival in Bali', description: 'Welcome to paradise! Transfer to hotel and evening welcome dinner.', displayOrder: 0 },
        { dayNumber: 2, title: 'Ubud Cultural Tour', description: 'Explore Ubud Palace, art markets, and rice terraces.', displayOrder: 1 },
        { dayNumber: 3, title: 'Temple & Beach Day', description: 'Visit Tanah Lot and relax at Seminyak Beach.', displayOrder: 2 },
        { dayNumber: 4, title: 'Mount Batur Sunrise Trek', description: 'Early morning trek to catch spectacular sunrise.', displayOrder: 3 },
        { dayNumber: 5, title: 'Cooking Class & Spa', description: 'Learn Balinese cuisine and enjoy traditional spa treatment.', displayOrder: 4 },
        { dayNumber: 6, title: 'Beach Activities', description: 'Water sports, snorkeling, or relaxation day.', displayOrder: 5 },
        { dayNumber: 7, title: 'Departure', description: 'Breakfast and airport transfer for your journey home.', displayOrder: 6 },
      ],
      dates: [
        { startDate: new Date('2025-06-15'), endDate: new Date('2025-06-22'), availableSlots: 12, status: 'AVAILABLE' },
        { startDate: new Date('2025-07-10'), endDate: new Date('2025-07-17'), availableSlots: 12, status: 'AVAILABLE' },
        { startDate: new Date('2025-08-05'), endDate: new Date('2025-08-12'), availableSlots: 12, status: 'AVAILABLE' },
      ],
    },
    {
      title: 'Swiss Alps Mountain Trek',
      slug: 'swiss-alps-mountain-trek',
      categoryId: categories.find(c => c.slug === 'mountain').id,
      location: 'Swiss Alps, Switzerland',
      price: 2499,
      duration: 10,
      rating: 5.0,
      reviewCount: 0,
      maxGroupSize: 8,
      difficulty: 'MODERATE',
      featuredImage: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
      description: 'Trek through breathtaking Alpine landscapes with professional mountain guides.',
      status: 'PUBLISHED',
      createdById: admin.id,
      images: [
        { imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80', displayOrder: 0 },
        { imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', displayOrder: 1 },
      ],
      highlights: [
        { highlight: 'Jungfrau summit experience', displayOrder: 0 },
        { highlight: 'Glacier hiking adventure', displayOrder: 1 },
        { highlight: 'Traditional Swiss village stays', displayOrder: 2 },
        { highlight: 'Cable car rides with panoramic views', displayOrder: 3 },
      ],
      inclusions: [
        { item: 'Mountain lodge accommodation', type: 'INCLUDED', displayOrder: 0 },
        { item: 'All meals during trek', type: 'INCLUDED', displayOrder: 1 },
        { item: 'Professional mountain guide', type: 'INCLUDED', displayOrder: 2 },
        { item: 'International flights', type: 'EXCLUDED', displayOrder: 3 },
        { item: 'Travel insurance', type: 'EXCLUDED', displayOrder: 4 },
      ],
      itinerary: [
        { dayNumber: 1, title: 'Zurich Arrival', description: 'Meet the group and transfer to Interlaken.', displayOrder: 0 },
        { dayNumber: 2, title: 'Jungfrau Region', description: 'Cable car to Jungfraujoch - Top of Europe.', displayOrder: 1 },
        { dayNumber: 3, title: 'Trek to Grindelwald', description: 'Scenic mountain trail with glacier views.', displayOrder: 2 },
      ],
      dates: [
        { startDate: new Date('2025-06-20'), endDate: new Date('2025-06-30'), availableSlots: 8, status: 'AVAILABLE' },
        { startDate: new Date('2025-07-15'), endDate: new Date('2025-07-25'), availableSlots: 8, status: 'AVAILABLE' },
      ],
    },
  ];

  for (const tourData of toursData) {
    const { images, highlights, inclusions, itinerary, dates, ...tourFields } = tourData;

    await prisma.tour.create({
      data: {
        ...tourFields,
        images: { create: images },
        highlights: { create: highlights },
        inclusions: { create: inclusions },
        itinerary: { create: itinerary },
        dates: { create: dates },
      },
    });
  }

  console.log('✅ Created sample tours');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
