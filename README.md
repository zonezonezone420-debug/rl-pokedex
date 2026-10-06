# RL Pokedex — Real Life Pokedex

Snap a photo of anything real. Get a Pokémon-style Pokédex entry for it:
species name, type, stats, weight, height, and a flavor description.
Builds your personal collection, with a trainer leaderboard.

Rebuilt from downloaded frontend files. The original backend was not included,
so the API, database, and auth were re-implemented here:

- **Auth:** the original used Google sign-in (next-auth). This build uses a
  simple trainer-name login stored on your device — no accounts, no keys.
- **Database:** the original pointed at someone else's Astra DB instance
  (credentials were in the downloaded files and were deliberately NOT reused).
  This build stores everything in `data/db.json` on the server.
- **Photo analysis:** the original called a private AI endpoint. This build
  calls OpenAI vision when `OPENAI_API_KEY` is set, and otherwise runs in
  **demo mode** — the full capture → entry → collection loop works, with
  clearly-labeled placeholder entries.
- **Voice narration:** stubbed. The endpoint exists and fails gracefully.

## Run it

```sh
npm install
npm run dev      # http://localhost:3000
```

## Real AI analysis

1. Get an API key from OpenAI (platform.openai.com).
2. Copy `.env.example` to `.env.local` and paste the key as `OPENAI_API_KEY`.
3. Restart. Captures now get real vision-generated entries.

## Put it on your phone

The easiest free path is Vercel:

1. Push this folder to a GitHub repo.
2. Import it at vercel.com — it auto-detects Next.js.
3. Add `OPENAI_API_KEY` under Environment Variables if you want real analysis.
4. Open the deployed URL on your phone and "Add to Home Screen" — the
   manifest makes it behave like an app, camera included.

Note: `data/db.json` resets on redeploys (ephemeral filesystem). For a
permanent collection, swap `lib/db.js` for a hosted database later.
