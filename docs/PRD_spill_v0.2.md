# PRD — Spill
**Version:** 0.2
**Status:** Design-ready — build today
**Type:** 1-day vibe coding project
**Language:** English
**Companion doc:** `design_spill.md` (visual specs — color, typography, layout, animation)
**Last updated:** June 2026

---

## 1. Concept

**Spill.** A random prompt generator with four modes: **Work**, **Me**, **Friends**, and **Love**.

Not a single-purpose icebreaker tool — a small family of prompt experiences that share one mechanic (random card, one tap, instant reveal) but feel emotionally distinct depending on which mode you're in. The name plays on "spill the tea" — confession, release, saying the thing out loud — which works across all four modes: spilling something safe at work, spilling something to yourself, spilling something with friends, spilling something tender with a partner.

No accounts, no backend complexity beyond a single AI batch call, no saved history. Built and shipped in one session.

---

## 2. Modes & Content

| Mode | Register | What it's for |
|---|---|---|
| **Work** | Safe, light, zero emotional risk | Solves "I can't think of anything when it's my turn" — quick, easy, nobody feels exposed |
| **Me** | Introspective, shadow-work adjacent | Journaling-style prompts — patterns you repeat, what you avoid, where you actually are right now |
| **Friends** | Playful, loose, truth-or-dare adjacent | Confessions, stories, hypotheticals, a little mischief — for close friends |
| **Love** | Intimate, warm, vulnerable-with-trust | Connection-building prompts for a partner — memory, appreciation, shared future |

**Sub-themes — shown to the user as a small eyebrow label on each card** (e.g. "FUN FACT"), not as filters or selectable buttons. The user can't pick a sub-theme directly; it's revealed per-prompt, adding texture without adding navigation. Every mode's AI prompt template draws from its own sub-themes when generating the batch, rotating across them so no single session feels repetitive. ✅ Locked — 4 sub-themes per mode, all four modes parallel in structure:

- **Work** — core idea: solve the "I can't think of anything when it's my turn" problem.
  - **Fun fact** — the anchor sub-theme; prompts that surface an easy, ready-to-say fun fact
  - **Firsts** — first job, first phone, first pet — easy, story-friendly
  - **Small obsessions** — something you like disproportionately (a show, a snack, a stationery item)
  - **Useless skills** — something you can do that serves no purpose but makes a good story

- **Me**
  - **Shadow** — patterns you repeat, what you avoid looking at
  - **Roots** — childhood, family, what shaped you
  - **Present** — how you're really doing right now
  - **Future / intention** — where you're headed, what you want to let go of

- **Friends**
  - **Truth** — confessions, "I never told anyone but..."
  - **Dare** — conversational micro-dares, not physical
  - **Stories** — "tell me about the time you..."
  - **Hypotheticals** — playful random scenarios, humor-forward

- **Love**
  - **Memory lane** — early memories together, defining moments
  - **Future** — shared dreams, where you're headed together
  - **Appreciation** — what you admire in the other, what you take for granted
  - **Curiosities** — things you still don't know about each other, even after time together

---

## 3. User Flow

```
Splash screen (single screen, sequential animation — see design_spill.md §4):
  cup falls → pool/cards reveal → "Spill" wordmark → subtitle → "Start playing" CTA appears
   ↓ waits for interaction — tap CTA, press any key, or click anywhere
Single screen — main app
  → mode selector at top: Work / Me / Friends / Love (pill selector, animated active state)
  → prompt card, centered, random text per current mode
  → "Next" button below card
  → switching mode crossfades background instantly, loads a new random prompt from that mode's pool
```

Two screens total: the splash (self-contained animated sequence ending in a CTA) and the main app. No separate menu screen — once past the splash, the mode selector inside the main screen is the only navigation the product needs.

---

## 4. Content Logic

- On load (after splash): one call to the Anthropic API via a Vercel serverless function generates a batch of prompts split across all 4 modes (suggested: ~15–20 per mode, rotating sub-themes internally per the generation prompt). Each generated prompt is tagged with its sub-theme (e.g. `{ mode: "work", subtheme: "Fun fact", text: "..." }`) so the eyebrow label can render correctly.
- "Next" picks a new random prompt from the current mode's pool, avoiding immediate repeats (track last shown ID).
- If the batch fetch fails: fallback to a small hardcoded list bundled in the app (suggested: 6–8 prompts per mode) so the product never fully breaks.
- No favorites, no history, no accounts — pure session-based randomness.

---

## 5. Stack

| Layer | Decision |
|---|---|
| Framework | Vite + React + TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| AI generation | Anthropic API via single Vercel serverless function, called once on load |
| Hosting | Vercel |
| Icons | None required — color + type driven, not icon driven |

---

## 6. Out of Scope (this build)

- Drawing mode (not part of this product at all — not even as a teaser)
- User accounts / auth
- Saved favorites
- Session history view
- Sharing / export
- Sound effects
- Dark mode toggle (modes already function as the product's "modes")
- Letter-shaped spill pool / droplet letter reveal in splash (future polish)

---

## 7. Pending Items

- [ ] Write the Claude API prompt template — one per mode, encoding the sub-themes and register described in §2
- [ ] Curate fallback hardcoded prompt lists (6–8 per mode)
- [ ] Design/export the cup + pool SVG for the splash screen
- [ ] Design the Spill logo/wordmark and confirm its placement on the splash screen
- [ ] Finalize splash screen subtitle copy in English
- [ ] Build Stitch prompt from this doc + design_spill.md
