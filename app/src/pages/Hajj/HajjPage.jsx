import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ChevronDown, Upload, Check, Info, FileText, Trash2, Phone } from 'lucide-react';
import Button from '../../components/UI/Button';
import banner from '../../assets/umrahBanner.png';
import bbqTonight1 from '../../assets/bbqTonight1.jpg';
import bbqTonight2 from '../../assets/bbqTonight2.jpg';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Hajj Packages Data
const hajjPackages = [
  {
    id: 'affordable',
    name: 'AFFORDABLE HAJJ - 10 DAYS (PAKISTANI PASSPORT HOLDERS)',
    price: 7899,
    roomType: 'Quad Room',
    includes: ['Meet and assist with JSBWORLD-TRAVEL staff',
      '5 Star Dar Al Hijra Intercontinental (21 May - 23 May) 4-6 Zill Hujja',
      'Aziziya Hotel from 23 May - 31 May (6-14 zill Hujja) ',
    'VIP MAKTAB A - Mina & Arafah (Step Away from Jamarat)',
  'Private washrooms for our tents in Mina',
  'Sleeping Quilled and box meal in Muzdalfa',
  'Breakfast, Lunch, Dinner and refreshments available in Mina and Arafat',
  'VIP Group Transportation (Add-on: Private transportation available)',
  'Sleeping Quilled and box meal in Muzdalfa',
  'Visa & Qurbani Included ',
  'Meals in Madina, Makkah Mina & Arafah',
  'Train Transfer from Madina to Makkah ',
  '24/7 JSBWORLD-TRAVEL Staff Assistance'
  ],
    fullDetails: {
      description: `Our package has been meticulously curated to combine affordability and quality offering a worry free Hajj experience. We've partnered with experienced professionals who specialize in group Hajj journeys from Karachi. With Travecation, we have carefully chosen multiple tiers to ensure flexibility, comfort, and well-being during your blessed journey. Your well-being and journey in worship are our top priorities, and our team will be with you every step of the way throughout the pilgrimage journey, resolved. We're in this together to ensure that your Hajj is nothing short of extraordinary.`,
      hotels: [
        { name: 'Madinah', dates: '21 MAY - 23 May (4 - 8 Zil Hijja)', description: '' },
        { name: 'Dar Al Hijra Intercontinental', dates: '', description: 'One of the latest luxuries the 5 star, a testament to luxurious living that is nestled in the heart of Madinah, just footsteps away from Al-Masjid an-Nabawi. The hotel offers world-class 5-star services. With its close proximity to the Prophet\'s Mosque it offers effortless access for prayer and reflection while providing first-rate hospitality and modern comforts. Come and let us be your hosts for a magical evening!' },
        { name: 'MAKKAH Al Aziziyah', dates: '23 May - 31 May (8 - 14 Zil Hijja)', description: 'Mareb Al Andalus offers a luxurious blend of tradition and contemporary comfort, making it an ideal choice for Travellers seeking a serene and affordable stay. Strategically located in the heart of Makkah Al Aziziyah, it is just a few minutes away from the Ibrahim Mosque. Just a free shuttle bus that runs throughout the day to Masjidul Haram.' },
        { name: 'Mina, Arafat, Muzdalifa', dates: '26 May - 31 May (9 - 12 Zil Hijja)', description: 'Our private, air-conditioned and well-maintained Maktab VIP tents are situated just steps away from the Jamarat, providing an excellent fully air-conditioned experience complete with private washrooms and kitchen facilities. Designed for convenience with a fully equipped kitchen, dining area, and sleeping facility. The tents are comfortably between 16 and 30 guests, striking the perfect balance between privacy and group interaction.' }
      ],
      roomPrices: [
        { type: 'Quad Room (4 People in one room)', price: 'USD 7899.00' },
        { type: 'Triple Room (3 People in one room)', price: 'USD 8399.00' },
        { type: 'Double Room (2 People in one room)', price: 'USD 10,399.00' }
      ],
      excludes: [
        'Airline Tickets (We can arrange this at group with same card',
        'Qurbani (we strongly recommend Qurbani groups with additional cost)',
        'Extra baggage (additional bags/box charges)',
        'Private transportation (2016 +US)',
        'All personal expenses'
      ],
      terms: [
        '25% Payment to secure spot.',
        'All Passports are collected 2 months before the package start date. All others to pay in full.',
        'Visa processing takes 2-3 weeks.',
        'Passport holders of the U.S., UK, EURO, Canada can stay for 2 days at our available flights and cover lodging',
        'If in doubt: Butter, Breakfast, Grain Breakfast, Lunch Dinner, Late dinner of choice',
        'Sab, Check: Available in Makkah only',
        'Mattress: Available in Makkah only',
        'Transport: Travelling in a comfortable bus with Air Conditioner from Makkah to Madinah to Jeddah',
        'Travelling in comfortable Bus with Air Conditioner from Makkah to Mina & Arafat area. Travel back to Mina with comfortable bus with A/C, from Jeddah to Airport'
      ]
    }
  },
  {
  id: 'premium-vip',
  name: 'PREMIUM VIP HAJJ PACKAGE - 2025',
  price: 8399,
  roomType: 'Quad',
  includes: [
    '5 Star Dar Al Hijra Intercontinental (18 - 21 May) - Madinah',
    '5 Star Swissotel Clocktower (21 - 23 May) - 0 min walk',
    'Aziziyah Hotel (23 - 31 May)',
    'VIP MAKTAB A - Mina & Arafah (Steps away from Jamarat)',
    'Train Transfer from Madinah to Makkah',
    'Meals in Madinah, Makkah, Mina & Arafah',
    'Visa & Qurbani Included',
    'Sleeping Quilt & Box Meal in Muzdalifah',
    'VIP Group Transportation',
    '24/7 JSBWORLD-TRAVEL Staff Assistance'
  ],
  fullDetails: {
    description: `Elevate your pilgrimage experience with our thoughtfully curated Premium VIP Hajj Package, designed for comfort, convenience, and spiritual focus. This package includes premium five-star accommodations near Masjid al-Haram and Al-Masjid an-Nabawi, upgraded VIP tents in Mina and Arafah, full-board meals, religious guidance, and 24/7 on-ground support. With modern transportation, quality services, and strategic locations, this package ensures a smooth, spiritually enriching, and stress-free Hajj journey.`,
    hotels: [
      {
        name: 'Madinah',
        dates: '18 May - 21 May (1 - 4 Zill Hijjah)',
        description: 'Dar Al Hijra Intercontinental is a luxurious 5-star hotel located just moments from Al-Masjid an-Nabawi. It offers elegant rooms, modern comforts, exceptional dining, and close proximity to major Ziyarat sites and shopping centers.'
      },
      {
        name: 'Makkah (Clocktower)',
        dates: '21 May - 23 May (4 - 6 Zill Hijjah)',
        description: 'Swissôtel Makkah Clocktower, located within the iconic Abraj Al-Bait complex, offers direct views of the Kaaba, unparalleled proximity to Masjid al-Haram, international dining options, and world-class five-star hospitality.'
      },
      {
        name: 'Makkah (Aziziyah)',
        dates: '23 May - 31 May (6 - 14 Zill Hijjah)',
        description: 'The Aziziyah Hotel provides a comfortable and affordable stay with modern rooms, essential amenities, and easy access to holy sites. It is ideal for pilgrims seeking quality accommodation during the core Hajj days.'
      },
      {
        name: 'Mina, Arafat & Muzdalifah',
        dates: '25 May - 29 May (8 - 12 Zill Hijjah)',
        description: 'Private upgraded VIP MAKTAB A tents, fully air-conditioned and located steps away from Jamarat. Includes private washrooms, buffet meals, sofa beds with bedding, 24/7 refreshments, and sleeping arrangements with boxed meals in Muzdalifah.'
      }
    ],
    roomPrices: [
      { type: 'Quad Room (4 People in one room)', price: 'USD 8,399.00' },
      { type: 'Triple Room (3 People in one room)', price: 'USD 9,499.00' },
      { type: 'Double Room (2 People in one room)', price: 'USD 10,999.00' }
    ],
    excludes: [
      'Airline Tickets (Can be arranged at additional cost)',
      'Private transportation (SUV, Cars, H1)',
      'Room upgrades with additional cost',
      'Any individually arranged services requiring private transfers',
      'Personal expenses'
    ],
    terms: [
      '25% payment required at the time of confirmation.',
      'All itineraries are tentative and subject to Saudi Government approvals.',
      'Departure and return dates may vary by 1-2 days due to flight availability and moon sighting.',
      'Hajj visa issuance is subject to Ministry of Religious Affairs and Saudi Consulate approvals.',
      'Once rooms are booked, they cannot be cancelled.',
      'Hotels in Clocktower offer double rooms only; extra beds will be provided for triple and quad occupancy.',
      'Full board buffet meals in Mina with 24-hour hot and cold drinks (subject to government approval).'
    ]
  }
},
 {
  id: 'premium-clocktower',
  name: 'PREMIUM HAJJ PACKAGE – CLOCKTOWER (2025)',
  price: 11999,
  roomType: 'Quad',
  includes: [
    '5 Star Dar Al Hijra Intercontinental (21 May - 23 May) - Madinah',
    '5 Star Swissotel Makkah Clocktower (23 May - 31 May) - 0 min walk',
    'VIP MAKTAB A - Mina & Arafah (Steps away from Jamarat)',
    'Meals in Madinah, Makkah, Mina & Arafah',
    'Train Transfer from Madinah to Makkah',
    'Visa & Qurbani Included',
    'Sleeping Quilt & Box Meal in Muzdalifah',
    'VIP Group Transportation',
    '24/7 JSBWORLD-TRAVEL Staff Assistance'
  ],
  fullDetails: {
    description: `This thoughtfully curated Premium Hajj Package is designed for pilgrims seeking superior comfort, convenience, and spiritual focus. The package includes five-star accommodations near Al-Masjid an-Nabawi and Masjid al-Haram, upgraded VIP tents in Mina and Arafat, full-board meals, guided support, and 24/7 on-ground assistance. With seamless transportation and premium services, this package ensures a smooth, spiritually enriching, and memorable Hajj experience.`,
    hotels: [
      {
        name: 'Madinah',
        dates: '21 May - 23 May (4 - 6 Zill Hijjah)',
        description: 'InterContinental Dar Al Hijra is a luxurious 5-star hotel located moments from Al-Masjid an-Nabawi. Offering elegant rooms, modern amenities, exceptional dining, and easy access to Ziyarat sites, it provides a serene and comfortable stay for pilgrims.'
      },
      {
        name: 'Makkah (Clocktower)',
        dates: '23 May - 31 May (6 - 14 Zill Hijjah)',
        description: 'Swissôtel Makkah Clocktower, situated within the iconic Abraj Al-Bait complex, offers unmatched proximity to Masjid al-Haram with Kaaba-view rooms, international dining options, dedicated prayer areas, and premium Swiss hospitality.'
      },
      {
        name: 'Mina, Arafat & Muzdalifah',
        dates: '25 May - 29 May (8 - 12 Zill Hijjah)',
        description: 'Private upgraded VIP MAKTAB A tents located steps away from the Jamarat. Fully air-conditioned tents with private washrooms, buffet meals, comfortable sofa beds with bedding, 24/7 refreshments, and sleeping arrangements with boxed meals in Muzdalifah.'
      }
    ],
    roomPrices: [
      { type: 'Quad Room (4 People in one room)', price: 'USD 11,999.00' },
      { type: 'Triple Room (3 People in one room)', price: 'USD 12,999.00' },
      { type: 'Double Room (2 People in one room)', price: 'USD 14,799.00' }
    ],
    excludes: [
      'Airline Tickets (Group arrangement available at additional cost)',
      'Room upgrades with additional cost',
      'Private transportation (SUV, Cars, H1)',
      'Individually arranged services requiring private transfers',
      'All personal expenses'
    ],
    terms: [
      '25% payment required at the time of confirmation.',
      'All itineraries are tentative and subject to Saudi Government approvals.',
      'Departure and return dates may vary by 1–2 days due to flight availability and moon sighting.',
      'Hajj visa issuance is subject to Ministry of Religious Affairs and Saudi Consulate approvals.',
      'Once rooms are booked, they cannot be cancelled.',
      'Full board buffet meals in Mina with 24-hour hot and cold drinks (subject to government approval).',
      'Clocktower hotels offer double rooms only; extra beds (smaller than twin) will be provided for triple and quad occupancy.'
    ]
  }
},
  {
  id: 'premium-clocktower-18may',
  name: 'PREMIUM HAJJ PACKAGE – CLOCKTOWER (18–31 MAY)',
  price: 12499,
  roomType: 'Quad',
  includes: [
    '5 Star Dar Al Hijra Intercontinental (18 May - 21 May) - Madinah',
    '5 Star Swissotel Makkah Clocktower (21 May - 31 May) - 0 min walk',
    'VIP MAKTAB A - Mina & Arafah (Steps away from Jamarat)',
    'Meals in Madinah, Makkah, Mina & Arafah',
    'Train Transfer from Madinah to Makkah',
    'Visa & Qurbani Included',
    'Sleeping Quilt & Box Meal in Muzdalifah',
    'VIP Group Transportation',
    '24/7 JSBWORLD-TRAVEL Staff Assistance'
  ],
  fullDetails: {
    description: `Our Premium Hajj Package is thoughtfully curated for pilgrims seeking exceptional comfort, convenience, and spiritual focus. The package includes five-star accommodations near Al-Masjid an-Nabawi and Masjid al-Haram, VIP upgraded tents in Mina and Arafat, full-board meals, guided religious assistance, and 24/7 on-ground support. With modern transportation and premium services throughout the journey, this package offers a smooth, spiritually enriching, and stress-free Hajj experience.`,
    hotels: [
      {
        name: 'Madinah',
        dates: '18 May - 21 May (1 - 4 Zill Hijjah)',
        description: 'InterContinental Dar Al Hijra is a luxurious five-star hotel located just moments from Al-Masjid an-Nabawi. It offers elegant rooms, modern comforts, diverse dining options, and easy access to Ziyarat sites, providing a serene and comfortable stay.'
      },
      {
        name: 'Makkah (Clocktower)',
        dates: '21 May - 31 May (4 - 14 Zill Hijjah)',
        description: 'Swissôtel Makkah Clocktower, located in the iconic Abraj Al-Bait complex, offers unmatched proximity to Masjid al-Haram with Kaaba-view rooms, international and local cuisine options, dedicated prayer areas, and premium Swiss hospitality.'
      },
      {
        name: 'Mina, Arafat & Muzdalifah',
        dates: '23 May - 29 May (8 - 12 Zill Hijjah)',
        description: 'Private upgraded VIP MAKTAB A tents located steps away from the Jamarat. Fully air-conditioned tents with private washrooms, buffet meals for breakfast, lunch, and dinner, comfortable sofa beds with bedding, 24/7 refreshments, and sleeping arrangements with boxed meals in Muzdalifah.'
      }
    ],
    roomPrices: [
      { type: 'Quad Room (4 People in one room)', price: 'USD 12,499.00' },
      { type: 'Triple Room (3 People in one room)', price: 'USD 13,499.00' },
      { type: 'Double Room (2 People in one room)', price: 'USD 15,499.00' }
    ],
    excludes: [
      'Airline Tickets (Group arrangement available at additional cost)',
      'Room upgrades with additional cost',
      'Private transportation (SUV, Cars, H1)',
      'Individually arranged services requiring private transfers',
      'All personal expenses'
    ],
    terms: [
      '25% payment required at the time of confirmation.',
      'All itineraries are tentative and subject to Saudi Government approvals.',
      'Departure and return dates may vary by 1–2 days due to flight availability and moon sighting.',
      'Hajj visa issuance is subject to Ministry of Religious Affairs and Saudi Consulate approvals.',
      'Once rooms are booked, they cannot be cancelled.',
      'Full board buffet meals in Mina with 24-hour hot and cold drinks (subject to government approval).',
      'Clocktower hotels offer double rooms only; extra beds (smaller than twin) will be provided for triple and quad occupancy.'
    ]
  }
},
{
  id: 'elite-luxury',
  name: 'ELITE LUXURY PACKAGE – 10 DAYS (PAKISTANI PASSPORT HOLDER)',
  price: 13899,
  roomType: 'Quad',
  includes: [
    '5 Star Dar Al Iman Intercontinental (21 May - 23 May) - Madinah',
    '5 Star Fairmont Makkah Clocktower (23 May - 31 May) - 0 min walk',
    'VIP MAKTAB A - Mina & Arafah (Steps away from Jamarat)',
    'Meals in Madinah, Makkah, Mina & Arafah',
    'Train Transfer from Madinah to Makkah',
    'Visa & Qurbani Included',
    'Sleeping Quilt & Box Meal in Muzdalifah',
    'VIP Group Transportation',
    '24/7 JSBWORLD-TRAVEL Staff Assistance'
  ],
  fullDetails: {
    description: `Embark on a spiritually fulfilling journey with our exclusive Elite Luxury Hajj Package, meticulously designed for pilgrims seeking unparalleled comfort, convenience, and serenity. This package offers premium five-star accommodations steps away from Masjid al-Haram and Al-Masjid an-Nabawi, VIP transportation, gourmet meals, guided religious services, and 24/7 on-ground support. With upgraded VIP MAKTAB A tents located near Jamarat, this package ensures that your focus remains fully on worship while every logistical detail is handled with care and precision.`,
    hotels: [
      {
        name: 'Madinah',
        dates: '21 May - 23 May (4 - 6 Zill Hijjah)',
        description: 'Dar Al Iman InterContinental is a distinguished luxury hotel ideally located steps away from Al-Masjid an-Nabawi. The hotel offers spacious rooms with breathtaking views, elegant interiors, modern amenities, exceptional dining options, and a serene ambiance for spiritual reflection.'
      },
      {
        name: 'Makkah (Clocktower)',
        dates: '23 May - 31 May (6 - 14 Zill Hijjah)',
        description: 'Fairmont Makkah Clocktower, situated within the iconic Abraj Al-Bait complex, offers direct access to Masjid al-Haram and breathtaking views of the Kaaba. The hotel features opulent rooms, world-class dining, premium services, and an unmatched luxury experience.'
      },
      {
        name: 'Mina, Arafat & Muzdalifah',
        dates: '25 May - 29 May (8 - 12 Zill Hijjah)',
        description: 'Private upgraded VIP MAKTAB A tents located steps away from the Jamarat. Fully air-conditioned tents equipped with private washrooms, buffet meals for breakfast, lunch, and dinner, comfortable sofa beds with pillows and sheets, and 24/7 refreshments. Sleeping arrangements with boxed meals are provided in Muzdalifah.'
      }
    ],
    roomPrices: [
      { type: 'Quad Room (4 People in one room)', price: 'USD 13,899.00' },
      { type: 'Triple Room (3 People in one room)', price: 'USD 14,999.00' },
      { type: 'Double Room (2 People in one room)', price: 'USD 16,999.00' }
    ],
    excludes: [
      'Airline Tickets (Group arrangement available at additional cost)',
      'Room upgrades with additional cost',
      'Private transportation (SUV, Cars, H1)',
      'Individually arranged services requiring private transfers',
      'All personal expenses'
    ],
    terms: [
      '25% payment required at the time of confirmation.',
      'All itineraries are tentative and subject to Saudi Government approvals.',
      'Departure and return dates may vary by 1–2 days due to flight availability and moon sighting.',
      'Hajj visa issuance is subject to Ministry of Religious Affairs and Saudi Consulate approvals.',
      'Once rooms are booked, they cannot be cancelled.',
      'Full board buffet meals in Mina with 24-hour hot and cold drinks (subject to government approval).',
      'Clocktower hotels offer double rooms only; extra beds (smaller than twin) will be provided for triple and quad occupancy.'
    ]
  }
},

  {
  id: 'elite-luxury-plus',
  name: 'ELITE LUXURY PLUS PACKAGE – 14 DAYS (PAKISTANI PASSPORT HOLDER)',
  price: 14299,
  roomType: 'Quad',
  includes: [
    '5 Star Dar Al Iman Intercontinental (18 May - 21 May) - Madinah',
    '5 Star Fairmont Makkah Clocktower (21 May - 31 May) - 0 min walk',
    'VIP MAKTAB A - Mina & Arafah (Steps away from Jamarat)',
    'Meals in Madinah, Makkah, Mina & Arafah',
    'Train Transfer from Madinah to Makkah',
    'Visa & Qurbani Included',
    'Sleeping Quilt & Box Meal in Muzdalifah',
    'VIP Group Transportation',
    '24/7 JSBWORLD-TRAVEL Staff Assistance'
  ],
  fullDetails: {
    description: `The Elite Luxury Plus Hajj Package is meticulously curated for pilgrims who seek an extended, serene, and luxurious Hajj experience. Spanning 14 days, this package offers premium five-star accommodations near Al-Masjid an-Nabawi and Masjid al-Haram, VIP transportation, gourmet meals, guided religious support, and continuous on-ground assistance. With exclusive access to VIP MAKTAB A tents near Jamarat, this package allows you to focus fully on worship while enjoying unmatched comfort, convenience, and peace of mind throughout your sacred journey.`,
    hotels: [
      {
        name: 'Madinah',
        dates: '18 May - 21 May (1 - 4 Zill Hijjah)',
        description: 'Dar Al Iman InterContinental is a distinguished five-star hotel located steps away from Al-Masjid an-Nabawi. Known for its elegant design, spacious rooms, exceptional hospitality, and breathtaking views of the mosque, it offers a peaceful and spiritually uplifting stay.'
      },
      {
        name: 'Makkah (Clocktower)',
        dates: '21 May - 31 May (4 - 14 Zill Hijjah)',
        description: 'Fairmont Makkah Clocktower, part of the iconic Abraj Al-Bait complex, provides direct access to Masjid al-Haram and stunning views of the Kaaba. Featuring luxurious rooms, world-class dining, premium amenities, and impeccable service, it represents the pinnacle of comfort and convenience.'
      },
      {
        name: 'Mina, Arafat & Muzdalifah',
        dates: '23 May - 29 May (8 - 12 Zill Hijjah)',
        description: 'Private upgraded VIP MAKTAB A tents located steps away from the Jamarat. Fully air-conditioned tents with private washrooms, buffet meals for breakfast, lunch, and dinner, comfortable sofa beds with pillows and sheets, and 24/7 refreshments. Sleeping arrangements with boxed meals are provided in Muzdalifah.'
      }
    ],
    roomPrices: [
      { type: 'Quad Room (4 People in one room)', price: 'USD 14,299.00' },
      { type: 'Triple Room (3 People in one room)', price: 'USD 15,399.00' },
      { type: 'Double Room (2 People in one room)', price: 'USD 17,499.00' }
    ],
    excludes: [
      'Airline Tickets (Group arrangement available at additional cost)',
      'Room upgrades with additional cost',
      'Private transportation (SUV, Cars, H1)',
      'Individually arranged services requiring private transfers',
      'All personal expenses'
    ],
    terms: [
      '25% payment required at the time of confirmation.',
      'All itineraries are tentative and subject to Saudi Government approvals.',
      'Departure and return dates may vary by 1–2 days due to flight availability and moon sighting.',
      'Hajj visa issuance is subject to Ministry of Religious Affairs and Saudi Consulate approvals.',
      'Once rooms are booked, they cannot be cancelled.',
      'Full board buffet meals in Mina with 24-hour hot and cold drinks (subject to government approval).',
      'Clocktower hotels offer double rooms only; extra beds (smaller than twin) will be provided for triple and quad occupancy.'
    ]
  }
}

];

// Form Options
const countries = ['Pakistan', 'United States', 'United Kingdom', 'Canada', 'India', 'Saudi Arabia', 'UAE', 'Other'];
const statesByCountry = {
  Pakistan: ['Sindh', 'Punjab', 'Balochistan', 'KPK', 'Islamabad'],
  'United States': ['Texas', 'California', 'New York', 'Florida', 'Illinois', 'Other'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  default: ['State 1', 'State 2', 'Other'],
};
const citiesByState = {
  Sindh: ['Karachi', 'Hyderabad', 'Sukkur', 'Other'],
  Punjab: ['Lahore', 'Faisalabad', 'Multan', 'Other'],
  Texas: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Other'],
  default: ['City 1', 'City 2', 'Other'],
};
const referralSources = ['IOK - Institute of Knowledge', 'Social Media', 'Friend/Family', 'Masjid', 'Website', 'Other'];
const teamMembers = ['Rashid Ali', 'Ahmed Khan', 'Fatima Begum', 'Other'];
const roomTypes = ['Quad', 'Triple', 'Double', 'Single'];
const gateways = ['JFK', 'LAX', 'ORD', 'DFW', 'IAH', 'MIA', 'Other'];
const genders = ['Male', 'Female'];

// Move form components OUTSIDE the main component to prevent re-creation on each render
const SelectField = ({ label, name, value, options, onChange, required = false }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all appearance-none bg-white"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
    </div>
  </div>
);

const InputField = ({ label, name, value, type = 'text', placeholder, onChange, required = false }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all"
    />
  </div>
);

const RadioGroup = ({ label, name, value, options, onChange, note }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
    {note && <p className="text-xs text-gray-500 mb-2">{note}</p>}
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={String(opt.value)} className="flex items-center cursor-pointer">
          <input
            type="radio"
            name={name}
            value={String(opt.value)}
            checked={value === opt.value || String(value) === String(opt.value)}
            onChange={(e) => onChange({ target: { name, value: opt.value === 'true' || opt.value === true ? true : opt.value === 'false' || opt.value === false ? false : opt.value } })}
            className="w-4 h-4 text-yellow-500 border-gray-300 focus:ring-yellow-400"
          />
          <span className="ml-2 text-gray-700">{opt.label}</span>
        </label>
      ))}
    </div>
  </div>
);

// Traveler Input Component - moved outside
const TravelerInput = ({ label, type = 'text', value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
    />
  </div>
);

// Package Details Modal Component
const PackageDetailsModal = ({ pkg, isOpen, onClose,openModal }) => {
  if (!isOpen || !pkg) return null;
  
  const details = pkg.fullDetails || {
    description: `Our package has been meticulously curated to combine affordability and quality offering a worry free Hajj experience.`,
    hotels: [],
    roomPrices: [
      { type: 'Quad Room (4 People in one room)', price: `USD ${pkg.price.toLocaleString()}.00` },
    ],
    excludes: [],
    terms: []
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 text-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with image */}
          <div className="relative h-48">
            <img
              src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1170&auto=format&fit=crop"
              alt="Kaaba"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-xs text-gray-300 uppercase tracking-wide">{pkg.name}</p>
              <div className="text-center mt-2">
                <span className="text-4xl font-bold">${pkg.price.toLocaleString()}</span>
                <p className="text-sm text-gray-400">{pkg.roomType}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[50vh]">
            {/* Package Includes */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-secondary-400 mb-3">Package Includes:</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                {pkg.includes.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check size={14} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Package Details */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-secondary-400 mb-3">Package Details:</h3>
              <p className="text-sm text-gray-300">{details.description}</p>
            </div>

            {/* Hotels */}
            {details.hotels && details.hotels.length > 0 && (
              <div className="mb-6">
                {details.hotels.map((hotel, i) => (
                  <div key={i} className="mb-4">
                    <h4 className="font-semibold text-secondary-400">{hotel.name}: {hotel.dates}</h4>
                    {hotel.description && <p className="text-sm text-gray-400 mt-1">{hotel.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Room Prices */}
            {details.roomPrices && details.roomPrices.length > 0 && (
              <div className="mb-6">
                {details.roomPrices.map((room, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-300">{room.type}</span>
                    <span className="font-semibold text-secondary-400">{room.price}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Excludes */}
            {details.excludes && details.excludes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-secondary-400 mb-3">Package Excludes:</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  {details.excludes.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Terms */}
            {details.terms && details.terms.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-secondary-400 mb-3">Terms & Conditions:</h3>
                <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                  {details.terms.map((term, i) => (
                    <li key={i}>{term}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <Button
              onClick={openModal}
              className="w-full bg-gradient-to-r from-secondary-300 to-secondary-500 text-white font-bold py-3 rounded-lg"
            >
              Register Now
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function HajjPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsPackage, setDetailsPackage] = useState(null);
  const packagesSectionRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    package: '',
    name: '',
    phone: '',
    email: '',
    streetAddress: '',
    addressLine2: '',
    postalCode: '',
    country: '',
    state: '',
    city: '',
    referralSource: '',
    teamMember: '',
    roomType: '',
    preferredGateway: '',
    hajjBefore: false,
    lastHajjYear: '',
    manasikCamp: 'Maktab A (VIP Camp)',
    numberOfTravelers: 1,
    travelers: [{ firstName: '', middleName: '', lastName: '', dateOfBirth: '', gender: '', email: '', passportNumber: '', passportIssueDate: '', passportExpiryDate: '' }],
    dietaryRestrictions: false,
    physicalDisabilities: false,
    travelingAlone: false,
    over65Alone: false,
    profession: '',
    firstLanguage: '',
    localMasjid: '',
    additionalNotes: '',
    documents: [],
  });

  const steps = ['Contact Information', 'Travel Details', 'Traveler Information', 'Finalize'];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToPackages = () => {
    if (packagesSectionRef.current) {
      packagesSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openModal = (pkg) => {
    setSelectedPackage(pkg);
    setFormData(prev => ({ ...prev, package: pkg.name }));
    setIsModalOpen(true);
    setCurrentStep(0);
    setSuccess(false);
    setError(null);
    setValidationErrors({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
    setCurrentStep(0);
  };

  const openDetailsModal = (pkg) => {
    setDetailsPackage(pkg);
    setDetailsModalOpen(true);
  };

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [validationErrors]);

  const handleTravelerChange = useCallback((index, field, value) => {
    setFormData(prev => {
      const newTravelers = [...prev.travelers];
      newTravelers[index] = { ...newTravelers[index], [field]: value };
      return { ...prev, travelers: newTravelers };
    });
  }, []);

  const handleNumberOfTravelersChange = useCallback((newCount) => {
    const count = Math.max(1, Math.min(10, newCount));
    setFormData(prev => {
      const currentTravelers = [...prev.travelers];
      if (count > currentTravelers.length) {
        for (let i = currentTravelers.length; i < count; i++) {
          currentTravelers.push({ firstName: '', middleName: '', lastName: '', dateOfBirth: '', gender: '', email: '', passportNumber: '', passportIssueDate: '', passportExpiryDate: '' });
        }
      } else {
        currentTravelers.splice(count);
      }
      return { ...prev, numberOfTravelers: count, travelers: currentTravelers };
    });
  }, []);

  // Validation function for each step
  const validateStep = useCallback((step) => {
    const errors = {};
    
    if (step === 0) {
      if (!formData.package) errors.package = 'Package is required';
      if (!formData.name) errors.name = 'Name is required';
      if (!formData.phone) errors.phone = 'Phone is required';
      if (!formData.email) errors.email = 'Email is required';
      if (!formData.country) errors.country = 'Country is required';
    }
    
    if (step === 1) {
      if (!formData.roomType) errors.roomType = 'Room type is required';
      if (!formData.preferredGateway) errors.preferredGateway = 'Preferred gateway is required';
    }
    
    if (step === 2) {
      formData.travelers.forEach((traveler, index) => {
        if (!traveler.firstName) errors[`traveler_${index}_firstName`] = 'First name is required';
        if (!traveler.lastName) errors[`traveler_${index}_lastName`] = 'Last name is required';
        if (!traveler.dateOfBirth) errors[`traveler_${index}_dateOfBirth`] = 'Date of birth is required';
        if (!traveler.gender) errors[`traveler_${index}_gender`] = 'Gender is required';
        if (!traveler.passportNumber) errors[`traveler_${index}_passportNumber`] = 'Passport number is required';
      });
    }
    
    return errors;
  }, [formData]);

  const nextStep = useCallback(() => {
    const errors = validateStep(currentStep);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, validateStep, steps.length]);

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/hajj-registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit registration');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const hasStepErrors = Object.keys(validationErrors).length > 0;

  return (
    <div className="min-h-screen pb-16 bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[80vh] min-h-[500px] flex flex-col overflow-hidden pt-20 md:pt-24">
        <div className="absolute inset-0">
          <img
            src={banner}
            alt="Hajj Pilgrimage"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 " />
        </div>
        
        {/* Ayat & Heading - Top Center */}
        <div className="relative z-10 flex-1 flex items-start justify-center pt-8 md:pt-12">
          <div className="text-center text-white px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <p className="text-4xl md:text-5xl font-arabic mb-3" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
                وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ
              </p>
              <p className="text-xl md:text-2xl text-gray-200 italic mb-2">
                "And complete the Hajj and Umrah for Allah."
              </p>
              <p className="text-xl text-gray-300">
                Al-Baqarah (The Cow) 2:196
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-display font-bold"
            >
              <span className="bg-clip-text text-white">Hajj</span>
              <span className="ml-3 bg-clip-text text-transparent bg-gradient-to-r from-secondary-400 to-secondary-200">Packages 2026</span>
            </motion.h1>
          </div>
        </div>

        {/* Scroll Indicator - Clickable */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-50"
          onClick={scrollToPackages}
        >
          <ChevronDown 
            size={32} 
            className="text-white/80 hover:text-white transition-colors drop-shadow-lg" 
          />
        </motion.div>
      </div>

      {/* Intro Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
       

        {/* BBQ King Partnership Section */}
        <div className="relative py-20 overflow-hidden rounded-2xl">
                {/* Background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                  >
                    <span className="inline-block px-4 py-2 bg-secondary-500/20 backdrop-blur-sm rounded-full text-secondary-300 text-sm font-semibold mb-4">
                      🤝 Exclusive Partnership
                    </span>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                      Trusted Halal Dining Partner
                    </h2>
                  </motion.div>
        
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Images */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="flex flex-col gap-4"
                    >
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-secondary-400 to-secondary-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
                        <img
                          src={bbqTonight1}
                          alt="BBQ King Halal Food"
                          className="relative rounded-xl w-full h-auto object-contain shadow-2xl transform group-hover:scale-[1.02] transition duration-300"
                        />
                      </div>
                    
        
                      <div
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center">
                          <span className="text-2xl">🍖</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">BBQ King Partnership</h3>
                      </div>
                      
                      <p className="text-lg text-gray-200 leading-relaxed mb-6">
                        JSB World-Travel provides tours, cruises, and Umrah & Hajj, supported by its partnership with <span className="text-secondary-300 font-semibold">BBQ King</span>—bringing trusted halal dining with dedicated hotel delivery for travelers in <span className="text-secondary-300 font-semibold">Madina</span> and <span className="text-secondary-300 font-semibold">DFW</span>.
                      </p>
        
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                          <div className="text-3xl mb-2">🕌</div>
                          <p className="text-white font-semibold">Madina Delivery</p>
                          <p className="text-gray-300 text-sm">Hotel doorstep service</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                          <div className="text-3xl mb-2">✈️</div>
                          <p className="text-white font-semibold">DFW Service</p>
                          <p className="text-gray-300 text-sm">Premium halal catering</p>
                        </div>
                      </div>

                      {/* Phone Contact */}
                      <a 
                        href="tel:+966558182560" 
                        className="mt-6 flex items-center justify-center gap-3 bg-gradient-to-r from-secondary-400 to-secondary-600 hover:from-secondary-500 hover:to-secondary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <Phone size={20} />
                        <span>+966 55 818 2560</span>
                      </a>
                    </div>
                    </motion.div>
        
                    {/* Content */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      // className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
                    >
                       <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-secondary-600 to-secondary-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300" />
                        <img
                          src={bbqTonight2}
                          alt="BBQ King Restaurant"
                          className="relative rounded-xl w-full h-auto object-contain shadow-2xl transform group-hover:scale-[1.02] transition duration-300"
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>


 <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Specialist Hajj & Umrah Services</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            We understand that Hajj and Umrah are more than just trips—they are sacred milestones. We provide expert guidance on visa processing, logistics, and accommodations in Makkah and Madinah, ensuring you can focus entirely on your worship.
          </p>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Seamless Support & Safety</h3>
          <p className="text-gray-700 leading-relaxed">
            From US departures to international arrivals, we handle the complex details—international travel insurance, local transport, and 24/7 support. You'll always have a direct line to a real person if you need help while abroad.
          </p>
        </div>
        {/* Popular Hajj Packages */}
        <div ref={packagesSectionRef}>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Popular Hajj Packages</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hajjPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6 flex flex-col h-[420px]">
                <h3 className="text-sm font-bold text-gray-800 mb-4 min-h-[48px]">{pkg.name}</h3>
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold text-gray-900">${pkg.price.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{pkg.roomType}</p>
                <h4 className="font-semibold text-gray-800 mb-2">Package Includes:</h4>
                <ul className="text-sm text-gray-600 space-y-1 mb-4 flex-1 overflow-hidden">
                  {pkg.includes.slice(0, 4).map((item, i) => (
                    <li key={i} className="flex items-start">
                      <Check size={14} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="line-clamp-1">{item}</span>
                    </li>
                  ))}
                  {pkg.includes.length > 4 && (
                    <li className="text-secondary-500 font-medium text-xs">
                      +{pkg.includes.length - 4} more items...
                    </li>
                  )}
                </ul>
                <div className="flex gap-2 mt-auto">
                  <Button
                    onClick={() => openModal(pkg)}
                    variant="primary"
                    className="flex-1 bg-gradient-to-r from-secondary-300 to-secondary-500 hover:from-secondary-400 hover:to-secondary-600"
                  >
                    Register Now
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 flex items-center justify-center gap-1"
                    onClick={() => openDetailsModal(pkg)}
                  >
                    <Info size={16} />
                    More
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </div>

      {/* Package Details Modal */}
      <PackageDetailsModal 
        pkg={detailsPackage} 
        isOpen={detailsModalOpen} 
        onClose={() => setDetailsModalOpen(false)} 
        openModal={openModal}
      />

      {/* Registration Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Hajj 2026 Pre-Registration</h2>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              {success ? (
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="text-green-600" size={48} />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">Registration Submitted!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for your Hajj pre-registration! Our team will review your application and contact you within 48 hours.
                  </p>
                  <p className="text-sm text-gray-500 mb-6">A confirmation email has been sent to {formData.email}</p>
                  <Button onClick={closeModal} variant="primary" className="bg-gradient-to-r from-secondary-300 to-secondary-500">
                    Close
                  </Button>
                </div>
              ) : (
                <>
                  {/* Step Tabs with Gold Gradient */}
                  <div className="flex border-b">
                    {steps.map((step, index) => (
                      <button
                        key={step}
                        disabled={index > currentStep}
                        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                          currentStep === index
                            ? 'bg-gradient-to-r from-secondary-300 to-secondary-500 text-white'
                            : index < currentStep
                              ? 'bg-secondary-100 text-secondary-700'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {step}
                      </button>
                    ))}
                  </div>

                  {/* Validation Error Banner */}
                  {hasStepErrors && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      Please fill in all required fields before proceeding.
                    </div>
                  )}

                  {/* Form Content */}
                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {/* Step 1: Contact Information */}
                    {currentStep === 0 && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <SelectField label="Package *" name="package" value={formData.package} options={hajjPackages.map(p => p.name)} onChange={handleInputChange} required />
                          <InputField label="Name *" name="name" value={formData.name} placeholder="Enter your full name" onChange={handleInputChange} required />
                          <InputField label="Phone Number *" name="phone" value={formData.phone} type="tel" placeholder="Enter phone number" onChange={handleInputChange} required />
                          <InputField label="Email *" name="email" value={formData.email} type="email" placeholder="Enter email address" onChange={handleInputChange} required />
                          <InputField label="Street Address" name="streetAddress" value={formData.streetAddress} placeholder="Enter street address" onChange={handleInputChange} />
                          <InputField label="Address Line 2" name="addressLine2" value={formData.addressLine2} placeholder="Apt, suite, etc." onChange={handleInputChange} />
                          <InputField label="Postal / Zip Code" name="postalCode" value={formData.postalCode} placeholder="Enter postal code" onChange={handleInputChange} />
                          <SelectField label="Country *" name="country" value={formData.country} options={countries} onChange={handleInputChange} required />
                          <SelectField label="State / Province / Region" name="state" value={formData.state} options={statesByCountry[formData.country] || statesByCountry.default} onChange={handleInputChange} />
                          <SelectField label="City" name="city" value={formData.city} options={citiesByState[formData.state] || citiesByState.default} onChange={handleInputChange} />
                          <SelectField label="How did you hear about us?" name="referralSource" value={formData.referralSource} options={referralSources} onChange={handleInputChange} />
                          <SelectField label="Which member of our team helped you?" name="teamMember" value={formData.teamMember} options={teamMembers} onChange={handleInputChange} />
                        </div>
                      </div>
                    )}

                    {/* Step 2: Travel Details */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Details</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <SelectField label="Room Type *" name="roomType" value={formData.roomType} options={roomTypes} onChange={handleInputChange} />
                          <SelectField label="Preferred Gateway *" name="preferredGateway" value={formData.preferredGateway} options={gateways} onChange={handleInputChange} />
                        </div>
                        <RadioGroup
                          label="Have you been for Hajj before?"
                          name="hajjBefore"
                          value={formData.hajjBefore}
                          options={[{ value: true, label: 'Yes' }, { value: false, label: 'No' }]}
                          onChange={(e) => setFormData(prev => ({ ...prev, hajjBefore: e.target.value }))}
                        />
                        {formData.hajjBefore && (
                          <InputField label="What year did you last perform Hajj?" name="lastHajjYear" value={formData.lastHajjYear} type="number" placeholder="e.g., 2019" onChange={handleInputChange} />
                        )}
                        <RadioGroup
                          label="Which Manasik camp are you interested in?"
                          name="manasikCamp"
                          value={formData.manasikCamp}
                          options={[
                            { value: 'Maktab A (VIP Camp)', label: 'Maktab A (VIP Camp)' },
                            { value: 'Maktab B (Regular)', label: 'Maktab B (Regular)' },
                          ]}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}

                    {/* Step 3: Traveler Information */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Traveler Information</h3>
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">Number of Travelers</label>
                          <div className="relative w-48">
                            <select
                              value={formData.numberOfTravelers}
                              onChange={(e) => handleNumberOfTravelersChange(parseInt(e.target.value))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all appearance-none bg-white"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                <option key={n} value={n}>{n}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                          </div>
                        </div>

                        {formData.travelers.map((traveler, index) => (
                          <div key={index} className="border-2 border-secondary-400 rounded-lg p-6">
                            <h4 className="font-semibold text-gray-800 mb-4">Traveler {index + 1}</h4>
                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                              <TravelerInput label="First name *" value={traveler.firstName} onChange={(e) => handleTravelerChange(index, 'firstName', e.target.value)} placeholder="First name" />
                              <TravelerInput label="Middle name" value={traveler.middleName} onChange={(e) => handleTravelerChange(index, 'middleName', e.target.value)} placeholder="Middle name" />
                              <TravelerInput label="Last name *" value={traveler.lastName} onChange={(e) => handleTravelerChange(index, 'lastName', e.target.value)} placeholder="Last name" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <TravelerInput label="Date of birth *" type="date" value={traveler.dateOfBirth} onChange={(e) => handleTravelerChange(index, 'dateOfBirth', e.target.value)} />
                              <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">Gender *</label>
                                <div className="relative">
                                  <select
                                    value={traveler.gender}
                                    onChange={(e) => handleTravelerChange(index, 'gender', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none appearance-none bg-white"
                                  >
                                    <option value="">Select Gender</option>
                                    {genders.map(g => <option key={g} value={g}>{g}</option>)}
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <TravelerInput label="Email" type="email" value={traveler.email} onChange={(e) => handleTravelerChange(index, 'email', e.target.value)} placeholder="Email address" />
                              <TravelerInput label="Passport Number *" value={traveler.passportNumber} onChange={(e) => handleTravelerChange(index, 'passportNumber', e.target.value)} placeholder="Passport number" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <TravelerInput label="Issue Date" type="date" value={traveler.passportIssueDate} onChange={(e) => handleTravelerChange(index, 'passportIssueDate', e.target.value)} />
                              <TravelerInput label="Expiry Date" type="date" value={traveler.passportExpiryDate} onChange={(e) => handleTravelerChange(index, 'passportExpiryDate', e.target.value)} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Step 4: Finalize */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Finalize</h3>
                        <h4 className="text-xl font-bold text-gray-900 mb-4">Help us get to know you!</h4>
                        <p className="text-gray-600 mb-6">The following questions help us assist you in selecting the right Hajj package.</p>

                        <RadioGroup
                          label="Do you have any dietary restrictions?"
                          name="dietaryRestrictions"
                          value={formData.dietaryRestrictions}
                          options={[{ value: true, label: 'Yes' }, { value: false, label: 'No' }]}
                          onChange={(e) => setFormData(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
                        />

                        <RadioGroup
                          label="Do you have any physical disabilities and/or health conditions?"
                          name="physicalDisabilities"
                          value={formData.physicalDisabilities}
                          options={[{ value: true, label: 'Yes' }, { value: false, label: 'No' }]}
                          onChange={(e) => setFormData(prev => ({ ...prev, physicalDisabilities: e.target.value }))}
                        />

                        <RadioGroup
                          label="Are you traveling alone?"
                          name="travelingAlone"
                          value={formData.travelingAlone}
                          options={[{ value: true, label: 'Yes' }, { value: false, label: 'No' }]}
                          onChange={(e) => setFormData(prev => ({ ...prev, travelingAlone: e.target.value }))}
                        />

                        <RadioGroup
                          label="Are you over the age of 65 and traveling alone?"
                          name="over65Alone"
                          value={formData.over65Alone}
                          options={[{ value: true, label: 'Yes' }, { value: false, label: 'No' }]}
                          onChange={(e) => setFormData(prev => ({ ...prev, over65Alone: e.target.value }))}
                          note="(If yes, we recommend traveling with a loved one for the best experience)"
                        />

                        <div className="grid md:grid-cols-2 gap-6">
                          <InputField label="What is your profession?" name="profession" value={formData.profession} placeholder="e.g., Software Engineer" onChange={handleInputChange} />
                          <InputField label="What is your first language?" name="firstLanguage" value={formData.firstLanguage} placeholder="e.g., Urdu" onChange={handleInputChange} />
                        </div>

                        <InputField label="What is the name of your local masjid?" name="localMasjid" value={formData.localMasjid} placeholder="Enter masjid name" onChange={handleInputChange} />

                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">Additional comments or notes?</label>
                          <textarea
                            name="additionalNotes"
                            value={formData.additionalNotes}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Any additional information..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none resize-y"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-2">Upload Documents</label>
                          <p className="text-sm text-gray-500 mb-2">(NIC, Passport, NICOP)</p>
                          <input
                            type="file"
                            id="document-upload"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            className="hidden"
                            onChange={(e) => {
                              const files = Array.from(e.target.files);
                              setFormData(prev => ({
                                ...prev,
                                documents: [...prev.documents, ...files]
                              }));
                              e.target.value = ''; // Reset to allow re-uploading same file
                            }}
                          />
                          <label
                            htmlFor="document-upload"
                            className="block border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center hover:border-secondary-400 transition-colors cursor-pointer"
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.add('border-secondary-500', 'bg-secondary-50');
                            }}
                            onDragLeave={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove('border-secondary-500', 'bg-secondary-50');
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove('border-secondary-500', 'bg-secondary-50');
                              const files = Array.from(e.dataTransfer.files);
                              setFormData(prev => ({
                                ...prev,
                                documents: [...prev.documents, ...files]
                              }));
                            }}
                          >
                            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                            <p className="text-gray-600">
                              Drop files here or <span className="text-blue-600 underline">click here</span> to upload.
                            </p>
                            <p className="text-xs text-gray-400 mt-2">Supported: PDF, JPG, PNG, DOC, DOCX</p>
                          </label>
                          
                          {/* Uploaded Files List */}
                          {formData.documents.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <p className="text-sm font-medium text-gray-700">Uploaded Files ({formData.documents.length})</p>
                              {formData.documents.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                  <div className="flex items-center gap-3">
                                    <FileText size={20} className="text-secondary-500" />
                                    <div>
                                      <p className="text-sm font-medium text-gray-800">{file.name}</p>
                                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormData(prev => ({
                                        ...prev,
                                        documents: prev.documents.filter((_, i) => i !== index)
                                      }));
                                    }}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {error && (
                          <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                            {error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div className="flex justify-end gap-4 p-6 border-t bg-gray-50">
                    {currentStep > 0 && (
                      <Button onClick={prevStep} variant="outline" className="px-6">
                        Previous
                      </Button>
                    )}
                    {currentStep < steps.length - 1 ? (
                      <Button onClick={nextStep} variant="primary" className="px-8 bg-gradient-to-r from-secondary-300 to-secondary-500 hover:from-secondary-400 hover:to-secondary-600">
                        Next
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        variant="primary"
                        className="px-8 bg-gradient-to-r from-secondary-300 to-secondary-500 hover:from-secondary-400 hover:to-secondary-600"
                        loading={loading}
                      >
                        {loading ? 'Submitting...' : 'Submit Registration'}
                      </Button>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
