# SHY Games backend setup

Anonymous aggregate analytics + private admin dashboard. No personal data is collected.

## One-time setup (about 10 minutes)

1. **Create the project** at [supabase.com](https://supabase.com) → New project.
   - Region: **Singapore** (closest to Malaysia).
   - Copy the database password somewhere safe (you won't need it daily).

2. **Run the migrations.** In the dashboard: SQL Editor → New query → paste each file
   in `supabase/migrations/` **in filename order** (the `pov_game_aggregate_results`
   file first, then `shy_analytics_all_games`) → Run. The second migration replaces
   the first one's `record_game_completion` with `submit_game_run`.

3. **Auth settings** (Authentication → Sign In / Providers):
   - Email: ON, **"Confirm email" OFF** (so the account is usable immediately).
   - **"Allow new users to sign up": OFF.** Only admin accounts you create exist.
   - Anonymous sign-ins: not needed.

4. **Create your admin login.** Authentication → Users → Add user → Create new user.
   Enter your email + a long password, check "Auto Confirm User". Copy the UID shown.

5. **Allow-list the account.** SQL Editor:
   ```sql
   insert into shy_private.shy_admins (user_id, note)
   values ('PASTE-USER-ID-HERE', 'Ansar');
   ```

6. **Env keys.** Project Settings → Data API → copy the URL and the **anon public**
   key into `.env.local` (never commit it):
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   ```
   Do the same in Vercel → Project → Settings → Environment Variables for production.

7. **MFA.** Open `/admin`, sign in, scan the QR code with an authenticator app,
   enter the 6-digit code. From then on, password + code required.

## What the data looks like

Everything is a counter in `shy_private.*` (unreachable from the browser).
Players can only call three validated write functions; the dashboard reads through
`admin_game_stats()`, which requires an allow-listed user with an aal2 (MFA) session.

Each finished run counts that player's **first** choice per question. "Try again"
choices are counted as retries, not answers. Exits record the question a player was
on when they left for the hub.

## Deploy

`vercel.json` already sets the SPA rewrite + security headers, so `vercel deploy`
works out of the box. Add the two env vars in the Vercel dashboard first.
