# Turning on cross-device sync (Supabase)

This makes your garden sync automatically across every device you sign in on:
edit at home, open your phone out and about, and it's already there. Until you do
this, the app runs perfectly well local-only (each device keeps its own garden,
moved between them with the backup file).

It's a one-time setup, ~10 minutes. You need the Supabase account you already have.

---

## 1. Create the database table

In your Supabase project: **SQL Editor → New query**, paste this, and click **Run**.

```sql
create table if not exists public.gardens (
  user_id    uuid primary key references auth.users on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.gardens enable row level security;

create policy "read own garden"   on public.gardens
  for select using (auth.uid() = user_id);
create policy "insert own garden" on public.gardens
  for insert with check (auth.uid() = user_id);
create policy "update own garden" on public.gardens
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

This stores one garden per signed-in user, and the security policies make sure
each account can only ever read or write its **own** row.

## 2. Make sign-in painless (recommended)

By default Supabase emails a confirmation link when you create an account, which
is fiddly for a personal app. To skip it:

**Authentication → Providers → Email →** turn **off** "Confirm email" → Save.

(If you leave it on, that's fine too — after "Create account" you'll get an email
with a link you must click once before signing in.)

While you're in Auth, set **Authentication → URL Configuration → Site URL** to your
published address, e.g. `https://msclarknzs.github.io/HomeGarden/`.

## 3. Connect the app to your project

In Supabase: **Project Settings → API**. Copy two values:

- **Project URL**
- **Project API keys → `anon` `public`** (the long one labelled "anon public")

Open **`src/supabaseConfig.js`** (edit it right in GitHub if you like) and paste them
in, replacing the placeholders:

```js
export const SUPABASE_URL = "https://abcd1234.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGci...your anon public key...";
```

Commit. Your GitHub Action rebuilds and republishes automatically. These two
values are *public by design* — the security policies from step 1 are what protect
the data — so it's fine that they're in the repo.

## 4. Use it

On each device: open the site → **gear (top-right) → Sync across devices**.

- On the first device: **Create account** with an email + password.
- On every other device: **Sign in** with that same email + password.

That's it. After that, changes you make sync up automatically (you'll see a
"Syncing… / Synced" note under the title), and other devices pick them up when you
open or switch back to the app. There's also a **Sync now** button if you want to
force it.

---

## Good to know

- **Last edit wins.** If you edit the *same* garden on two devices while one is
  offline, whichever saves last is the version that's kept — it doesn't merge. In
  normal use (one device at a time) this never bites. The backup file is still
  there as an extra safety net.
- **Photos add weight.** Uploaded satellite/bed images travel with the data, so a
  very image-heavy garden syncs a little slower. The app already shrinks images on
  upload, which keeps this comfortable for a home plot.
- **Staying signed in.** Each device stays logged in, so you only sign in once per
  device.
- **Free tier.** A personal/family garden is well within Supabase's free limits.
