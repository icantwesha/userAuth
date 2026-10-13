# Supabase authentication setup

This app uses Supabase Auth for email/password registration and login, Google OAuth, and the authenticated dashboard. Vite reads local environment variables and bundles the browser app.

## 1. Configure local environment

1. Copy `.env.example` to `.env`.
2. In Supabase, open **Project Settings → API** and copy the Project URL and the **publishable key** (or legacy `anon` key) into `.env`:

   ```dotenv
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
   ```

3. Do not add a `service_role` or secret key here. Vite variables prefixed with `VITE_` are included in browser code; the publishable/anon key is designed for that and must be paired with Row Level Security for database access.
4. Install dependencies and run the development server:

   ```sh
   npm install
   npm run dev
   ```

   Open the local URL printed by Vite; the root URL redirects to `auth.html`. You can also visit `/auth.html` directly. Do not open the HTML files directly using `file://`.

For deployment, set the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` variables in the hosting provider's build environment, then run `npm run build`. Keep `.env` private; it is excluded by `.gitignore`.

## 2. Configure Supabase Auth

In **Authentication → URL Configuration**, set **Site URL** to the deployed site origin (or the local Vite origin while testing). Add the matching `/home.html` URL to **Redirect URLs**, for example:

```text
http://localhost:5173/home.html
https://your-domain.example/home.html
```

Email/password registration is enabled through Supabase Auth. If email confirmation is enabled, new users must confirm their email before signing in.

### Optional: Google sign-in

1. In **Authentication → Providers → Google**, enable Google and enter the OAuth client ID and secret from your Google Cloud OAuth application.
2. Add the Supabase callback URL shown on that provider page to the authorized redirect URIs in Google Cloud.
3. Keep the OAuth client secret in Supabase's provider settings; never place it in `.env` or frontend code.

## 3. Connect the profiles table

Authentication itself is stored in Supabase's managed `auth.users` table; do not create or edit that table yourself. If you have already created `public.profiles` with `id`, `full_name`, and `created_at`, run the SQL below to enable secure access and automatically create/backfill profiles.

In **SQL Editor → New query**, open [`database/profiles.sql`](./database/profiles.sql), paste its contents, and run it. It enables Row Level Security, grants authenticated users read/update access only to their own row, creates a profile for future Auth users using their `full_name` metadata, and backfills existing Auth users.

The dashboard reads `full_name` from `public.profiles` and falls back to Auth metadata/email if the profile name is empty. The trigger function runs with its owner's database permissions to create the initial row despite Row Level Security. Do not store passwords in `public.profiles`; Supabase Auth manages credentials.

### Environment variable names

The browser client reads only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env`. Use your project's URL and **publishable/anon key** for these values. Never rename a service-role/secret key to a `VITE_` variable: Vite bundles `VITE_` values into public browser code. A server-side service key, if your project needs one for trusted backend work, must remain server-only.

## Files

- `auth.html` — registration, email/password login, and Google OAuth UI.
- `home.html` — requires a valid Supabase session and supports logout.
- `supabase-config.js` — initializes the Supabase browser client from Vite environment variables.
- `database/profiles.sql` — RLS policies, profile creation trigger, and existing-user backfill.
