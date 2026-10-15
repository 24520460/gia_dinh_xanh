import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const directory = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(directory, '../.env') });
dotenv.config();

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.',
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const fixedUuid = (number) =>
  `00000000-0000-4000-8000-${String(number).padStart(12, '0')}`;

async function getAuthUsers() {
  const users = [];
  const perPage = 1000;
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw error;
    }

    users.push(...data.users);

    if (data.users.length < perPage) {
      return users;
    }

    page += 1;
  }
}

async function upsert(table, rows, onConflict) {
  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict });

  if (error) {
    throw new Error(`${table}: ${error.message}`);
  }
}

async function select(table, columns, options = {}) {
  let query = supabase.from(table).select(columns);

  if (options.order) {
    query = query.order(options.order.column, {
      ascending: options.order.ascending ?? true,
    });
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`${table}: ${error.message}`);
  }

  return data;
}

function userName(user, number) {
  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    `Gia Đình Xanh Test User ${number}`
  ).slice(0, 100);
}

function phoneFor(user) {
  return user.phone?.slice(0, 20) ||
    `+1999${user.id.replaceAll('-', '').slice(0, 15)}`;
}

const authUsers = await getAuthUsers();

if (authUsers.length < 12) {
  throw new Error(
    `At least 12 Auth users are required; found ${authUsers.length}. Run seed-auth-users.mjs first.`,
  );
}

const adminAuthUsers = authUsers.slice(0, 2);
const providerAuthUsers = authUsers.slice(2, 12);
const customerAuthUsers = authUsers.slice(12);

const publicUsers = authUsers.map((user, index) => ({
  user_id: user.id,
  full_name: userName(user, index + 1),
  phone_number: phoneFor(user),
  role: index < 2 ? 'admin' : index < 12 ? 'provider' : 'customer',
  is_active: index !== authUsers.length - 1,
}));

await upsert('users', publicUsers, 'user_id');

const wards = await select('wards', 'ward_id', {
  order: { column: 'ward_id' },
  limit: 20,
});

if (wards.length < 10) {
  throw new Error('At least 10 existing wards are required for test data.');
}

const customerProfiles = customerAuthUsers.map((user, index) => ({
  customer_id: fixedUuid(100 + index),
  user_id: user.id,
  default_address: `Test customer address ${index + 1}`,
  ward_id: wards[index % wards.length].ward_id,
  latitude: 21.0285 + index / 1000,
  longitude: 105.8542 + index / 1000,
}));

const verificationStatuses = ['pending', 'verified', 'rejected'];
const providerProfiles = providerAuthUsers.map((user, index) => ({
  provider_id: fixedUuid(200 + index),
  user_id: user.id,
  info: `Test provider profile ${index + 1}`,
  id_card_number: `TEST-ID-${String(index + 1).padStart(11, '0')}`,
  verification_status: verificationStatuses[index % verificationStatuses.length],
  average_rating: [0, 4.5, 2.75][index % 3],
  total_reviews: index % 3 === 0 ? 0 : index + 2,
  latitude: 21.0285 + index / 1000,
  longitude: 105.8542 + index / 1000,
  is_available_online: index % 2 === 0,
}));

await upsert('customer_profiles', customerProfiles, 'user_id');
await upsert('provider_profiles', providerProfiles, 'user_id');

const categories = [
  {
    category_id: fixedUuid(300),
    parent_id: null,
    category_name: 'Home Services',
    slug: 'test-home-services',
    description: 'Test parent service category',
    status: true,
  },
  {
    category_id: fixedUuid(301),
    parent_id: fixedUuid(300),
    category_name: 'Cleaning',
    slug: 'test-cleaning',
    description: 'Test cleaning services',
    status: true,
  },
  {
    category_id: fixedUuid(302),
    parent_id: fixedUuid(300),
    category_name: 'Repairs',
    slug: 'test-repairs',
    description: 'Test repair services',
    status: true,
  },
  {
    category_id: fixedUuid(303),
    parent_id: fixedUuid(300),
    category_name: 'Archived Services',
    slug: 'test-archived-services',
    description: 'Inactive test category',
    status: false,
  },
];

await upsert('service_categories', [categories[0]] , 'category_id');
await upsert('service_categories', categories.slice(1), 'category_id');

const services = [
  {
    service_id: fixedUuid(400),
    category_id: fixedUuid(301),
    title: 'Test home cleaning',
    description: 'Fixed-price test cleaning service',
    price: 250000,
    pricing_type: 'fixed',
    estimated_duration: 120,
    is_active: true,
  },
  {
    service_id: fixedUuid(401),
    category_id: fixedUuid(301),
    title: 'Test hourly cleaning',
    description: 'Hourly test cleaning service',
    price: 100000,
    pricing_type: 'hourly',
    estimated_duration: 60,
    is_active: true,
  },
  {
    service_id: fixedUuid(402),
    category_id: fixedUuid(302),
    title: 'Test appliance repair',
    description: 'Fixed-price test repair service',
    price: 350000,
    pricing_type: 'fixed',
    estimated_duration: 90,
    is_active: true,
  },
  {
    service_id: fixedUuid(403),
    category_id: fixedUuid(303),
    title: 'Archived test service',
    description: 'Inactive test service',
    price: 50000,
    pricing_type: 'fixed',
    estimated_duration: 30,
    is_active: false,
  },
];

await upsert('services', services, 'service_id');

const providerServices = providerProfiles.flatMap((provider, index) => [
  {
    id_pro_ser: fixedUuid(500 + index * 2),
    provider_id: provider.provider_id,
    service_id: services[index % 3].service_id,
  },
  {
    id_pro_ser: fixedUuid(501 + index * 2),
    provider_id: provider.provider_id,
    service_id: services[(index + 1) % 3].service_id,
  },
]);

await upsert('provider_services', providerServices, 'id_pro_ser');

const providerAreas = providerProfiles.map((provider, index) => ({
  area_id: fixedUuid(600 + index),
  provider_id: provider.provider_id,
  ward_id: wards[index].ward_id,
}));

await upsert('provider_areas', providerAreas, 'area_id');

const schedules = providerProfiles.flatMap((provider, providerIndex) =>
  [0, 1, 2, 3, 4, 5, 6].map((day, dayIndex) => ({
    id: fixedUuid(700 + providerIndex * 10 + dayIndex),
    provider_id: provider.provider_id,
    day_of_week: day,
    start_time: day < 5 ? '08:00' : '09:00',
    end_time: day < 5 ? '17:00' : '13:00',
  })),
);

await upsert('availability_schedules', schedules, 'id');

const exceptions = providerProfiles.slice(0, 3).map((provider, index) => ({
  id: fixedUuid(800 + index),
  provider_id: provider.provider_id,
  exception_date: `2026-12-${String(10 + index).padStart(2, '0')}`,
  start_time: '10:00',
  end_time: '12:00',
  reason: ['Holiday', 'Training', 'Personal leave'][index],
}));

await upsert('availability_exceptions', exceptions, 'id');

const bookingStatuses = [
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'pending',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
];
const paymentStatuses = [
  'unpaid',
  'paid',
  'paid',
  'paid',
  'refunded',
  'unpaid',
  'paid',
  'paid',
  'paid',
  'refunded',
];

const bookings = bookingStatuses.map((status, index) => ({
  booking_id: fixedUuid(900 + index),
  customer_id: customerProfiles[index % customerProfiles.length].customer_id,
  provider_id: providerProfiles[index % providerProfiles.length].provider_id,
  service_id: services[index % 3].service_id,
  scheduled_time: `2026-11-${String(1 + index).padStart(2, '0')}T09:00:00+07:00`,
  address: `Test booking address ${index + 1}`,
  ward_id: wards[index % wards.length].ward_id,
  latitude: 21.0285 + index / 1000,
  longitude: 105.8542 + index / 1000,
  total_incidental: index % 2 === 0 ? 0 : 50000,
  total_amount: 250000 + index * 25000,
  status,
  payment_status: paymentStatuses[index],
  notes: `Test booking covering ${status} status`,
}));

await upsert('bookings', bookings, 'booking_id');

const history = bookings.map((booking, index) => ({
  history_id: fixedUuid(1000 + index),
  booking_id: booking.booking_id,
  previous_status: index === 0 ? null : 'pending',
  new_status: booking.status,
  changed_by: authUsers[index % authUsers.length].id,
  reason: `Test status transition to ${booking.status}`,
}));

await upsert('booking_status_history', history, 'history_id');

const reviews = [
  {
    review_id: fixedUuid(1100),
    booking_id: bookings[3].booking_id,
    customer_id: bookings[3].customer_id,
    provider_id: bookings[3].provider_id,
    rating: 5,
    comment: 'Excellent test service',
  },
  {
    review_id: fixedUuid(1101),
    booking_id: bookings[8].booking_id,
    customer_id: bookings[8].customer_id,
    provider_id: bookings[8].provider_id,
    rating: 3,
    comment: 'Average test service',
  },
];

await upsert('reviews', reviews, 'review_id');

const favorites = customerProfiles.slice(0, 5).map((customer, index) => ({
  favorite_id: fixedUuid(1200 + index),
  customer_id: customer.customer_id,
  service_id: services[index % 3].service_id,
}));

await upsert('favorites', favorites, 'favorite_id');

const ticketStatuses = ['open', 'in_progress', 'resolved', 'closed'];
const priorities = ['low', 'medium', 'high', 'urgent'];
const tickets = ticketStatuses.flatMap((status, statusIndex) =>
  priorities.map((priority, priorityIndex) => ({
    ticket_id: fixedUuid(1300 + statusIndex * 10 + priorityIndex),
    user_id: authUsers[(statusIndex + priorityIndex) % authUsers.length].id,
    booking_id: bookings[(statusIndex + priorityIndex) % bookings.length].booking_id,
    subject: `Test ${priority} support ticket`,
    status,
    priority,
  })),
);

await upsert('support_tickets', tickets, 'ticket_id');

console.log('Test data seeded successfully.');
console.log({
  authUsers: authUsers.length,
  admins: adminAuthUsers.length,
  providers: providerAuthUsers.length,
  customers: customerAuthUsers.length,
  publicUsers: publicUsers.length,
  customerProfiles: customerProfiles.length,
  providerProfiles: providerProfiles.length,
  serviceCategories: categories.length,
  services: services.length,
  providerServices: providerServices.length,
  providerAreas: providerAreas.length,
  availabilitySchedules: schedules.length,
  availabilityExceptions: exceptions.length,
  bookings: bookings.length,
  bookingStatusHistory: history.length,
  reviews: reviews.length,
  favorites: favorites.length,
  supportTickets: tickets.length,
});
