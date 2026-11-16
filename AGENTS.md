# Local verification

- Run `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` before sharing changes.
- Database tests apply all SQL migrations in filename order to an isolated in-process PGlite database with Supabase auth/role stubs. They do not contact live Supabase.
- `npm run dev` serves the app at localhost:5173. Booth registration and gameplay use an in-memory fictional-data preview in Vite development mode; refreshing clears preview records. The player home page contains no results/admin controls. The `/admin` route still uses the configured Supabase admin authentication.
- Production booth registration/results require the individual-booth migration. Do not apply migrations or submit test data to live Supabase without explicit approval.
- Preserve stable game/question/option IDs when editing content: analytics validation and answer keys depend on them.
