import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const directory = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(directory, '../.env') });
dotenv.config();

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  TEST_USER_COUNT = '10',
  TEST_USER_PREFIX = 'gdx-test-',
  TEST_USER_PASSWORD,
  ALLOW_TEST_USER_SEED,
} = process.env;

if (ALLOW_TEST_USER_SEED !== 'true') {
  throw new Error('Set ALLOW_TEST_USER_SEED=true before running this script.');
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !TEST_USER_PASSWORD) {
  throw new Error(
    'SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and TEST_USER_PASSWORD are required.',
  );
}

const count = Number(TEST_USER_COUNT);

if (!Number.isInteger(count) || count < 1) {
  throw new Error('TEST_USER_COUNT must be a positive integer.');
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const { data, error: listError } =
  await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

if (listError) {
  throw listError;
}

const existingEmails = new Set(
  data.users.map((user) => user.email).filter(Boolean),
);

for (let index = 1; index <= count; index += 1) {
  const number = String(index).padStart(3, '0');
  const email = `${TEST_USER_PREFIX}${number}@example.test`;

  if (existingEmails.has(email)) {
    console.log(`Already exists: ${email}`);
    continue;
  }

  const { data: created, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      password: TEST_USER_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: `Gia Đình Xanh Test User ${number}`,
        role: 'customer',
        test_user: true,
      },
    });

  if (createError) {
    console.error(`Failed to create ${email}:`, createError.message);
    continue;
  }

  console.log(`Created: ${created.user.email}`);
}

console.log(`Finished processing ${count} test users.`);;
