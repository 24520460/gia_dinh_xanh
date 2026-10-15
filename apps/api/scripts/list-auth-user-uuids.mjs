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
} = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.',
  );
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

const users = [];
const perPage = 1000;
let page = 1;

while (true) {
  const { data, error } =
    await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

  if (error) {
    throw error;
  }

  users.push(...data.users);

  if (data.users.length < perPage) {
    break;
  }

  page += 1;
}

const uuids = users.map((user) => user.id);

console.log(JSON.stringify(uuids, null, 2));
console.error(`Found ${uuids.length} Auth users.`);
