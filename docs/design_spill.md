# design_spill.md — Spill
**Version:** 0.1
**Status:** Locked — ready for Stitch / Claude Code
**Companion doc:** `PRD_spill_v0.2.md` (product, content, scope)
**Last updated:** June 2026

---

## 1. Design Concept

Bold, saturated, playful — flat oversized color blocks, no gradients, heavy sans-serif type, high contrast (reference: Linktree's marketing site). Each mode has its own full-viewport flat color identity; switching modes is the core personality mechanic of the product. Cards rotate through cross-paired color combinations for variety, with a hard contrast rule for legibility.

---

## 2. Color Tokens — One Identity Per Mode ✅ Locked

| Token | Hex | Usage |
|---|---|---|
| `--color-work` | `#2665D6` (blue) | Work mode background |
| `--color-me` | `#5B072D` (burgundy) | Me mode background |
| `--color-friends` | `#D2E823` (lime) | Friends mode background |
| `--color-love` | `#E8BFE9` (pink) | Love mode background |
| `--color-card-bg` | `#131414` (near-black) | Floating card surface / primary button fill, all modes; also the splash screen background |
| `--color-white` | `#FFFFFF` | Text on dark surfaces, card backgrounds where contrast needs flipping |

**Rules:**
- Full-viewport flat color per mode — no gradients, no texture, no overlap between mode colors.
- Switching modes crossfades the entire background.
- `#131414` and `#FFFFFF` are the only neutrals, used purely for card/button contrast combinations against whichever mode color is active — never as mode colors themselves.

### Card color pairing system ✅ Locked

Cards don't always use the same neutral surface — they rotate through cross-paired combinations from the full 6-color palette (Work blue, Me burgundy, Friends lime, Love pink, plus black/white), background and text always pulled from different colors for contrast. This adds variety within a mode without breaking the "max 2 colors on screen" rule — the *background* stays the active mode color; only the *card* itself rotates combinations.

Confirmed pairings (background → text):
- Burgundy → Lime
- Burgundy → Yellow-green (lime, bold)
- Lime → Blue
- Lime → Burgundy
- Lilac (Love) → Blue
- Lilac (Love) → Black
- Blue → Lime
- Blue → Lilac
- White → Black
- Black → White

Implementation: maintain an array of valid `{bg, text}` pairs; pick one at random (or rotate) each time a new card/prompt renders, independent of which mode is active. **Critical rule — legibility above all:** never render a card whose background color matches the currently active mode/page background (e.g. never show a blue card on the blue Work page, never a lime card on a Friends page). If a randomly picked pairing matches the active mode color, discard it and re-roll until it doesn't. This isn't a style preference — it's a hard constraint, since a same-color card on a same-color background breaks contrast and makes the prompt unreadable.

---

## 3. Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Prompt text | Space Grotesk (or Inter fallback) | 700 | 32–44px, centered |
| Sub-theme eyebrow label | Space Grotesk | 700 | 11–12px, uppercase, tracked, muted color on card |
| Mode label | Space Grotesk | 700 | 14px, uppercase, tracked |
| UI / buttons | Space Grotesk | 500–700 | 16–18px |
| Footer / micro | Space Grotesk | 400 | 12px |

No serif, no handwritten accents — Spill's identity comes from bold type + saturated color blocks, not script details.

---

## 4. Splash Screen — single screen, sequential animation ✅ Locked

One screen, one continuous animated sequence — not two separate screens. The cup-spill animation and the "Start playing" CTA live together; the button simply appears once the animation settles.

**Sequence (SVG + Framer Motion, phases run one after another on the same screen):**

1. **Fall** — cup enters from above, `y: -100 → 0` with a slight rotation (`-15° → 5°`) to suggest tipping on impact. Ease-in for weight.
2. **Spill** — the pool/cards reveal expands from the point of contact (`scale` from origin, or `clipPath` expansion). No real physics needed — a good ease sells it. This is also where the stacked, fanned card illustration appears (3–4 overlapping cards, slightly rotated, in mode colors — burgundy, blue, lime, pink — the front-most card showing a sample eyebrow label like "ALL" and a sample prompt question, plus a small circular help/info icon top right).
3. **Reveal** — "Spill" wordmark/logo fades + scales up (`opacity 0→1, scale 0.9→1`) right as the pool/cards finish settling.
4. **Subtitle** — short tagline fades in below the wordmark (final English copy pending — reference shown was Spanish placeholder: "Break the ice with friends, your team, or dates using beautiful, interactive cards.")
5. **CTA appears** — once the above settles, the "Start playing" button fades/scales in (pill-shaped, lime fill, black bold uppercase text, small icon), with a micro line below it: "Press any key or click to skip."

**Background:** dark (`#131414` near-black) for this entire sequence — distinct from the mode colors used once inside the app.

**Behavior:**
- The sequence plays automatically start to finish; it does **not** auto-advance into the app on its own — it waits at the final state (button visible) for user interaction.
- Pressing any key, clicking anywhere, or tapping the CTA button advances directly into the main app screen (§5).
- Out of scope for today: letter-shaped pool, droplet-by-droplet letter reveal (noted as future polish).

---

## 5. Main App Layout

```
┌─────────────────────────────────────┐
│                                       │
│   [Work] [Me] [Friends] [Love]   ← pill selector, top, centered
│                                       │
│        ┌─────────────────┐          │
│        │  FUN FACT       │  ← eyebrow label (sub-theme), small, uppercase
│        │  PROMPT TEXT    │  ← card, ~70% width, centered
│        │                 │          │
│        └─────────────────┘          │
│                                       │
│      [ Siguiente pregunta ↻ ]   ← primary button below card
│                                       │
│   spill · built in a day              │  ← footer, micro
└─────────────────────────────────────┘
```

- Full-viewport flat background color, centered flex layout.
- Card: border-radius 24px, padding 48px, subtle drop shadow (`0 8px 32px rgba(0,0,0,0.15)`).
- Button: pill-shaped, fill animates bottom-to-top on hover (reuse the proven hover pattern from the portfolio's notebook layout).
- Responsive: same single-column layout scales down; card width 90% on mobile, prompt font drops to 24–28px.

### Mode selector — glass effect ✅ Locked

The mode selector is a single pill-shaped container with a frosted-glass look, sitting on top of the active mode background color — not a flat/opaque element.

- **Container:** full pill shape (`border-radius: 999px`), background is a lighter, semi-translucent version of the active mode color (e.g. `rgba(white, 0.15–0.2)` blended over the mode color, or `backdrop-filter: blur(12px)` with a translucent white overlay), giving a frosted/glassy appearance rather than a solid block.
- **Active item:** solid filled pill inside the container — solid black (`#131414`) background, bold white uppercase text, fully opaque (this is the one element that reads as "solid" against the glassy container).
- **Inactive items:** no background, just bold uppercase text in a lighter/semi-transparent tone (white at reduced opacity, e.g. `rgba(255,255,255,0.7)`) so they recede against the glass container but stay legible.
- **Transition:** the active pill slides between items using Framer Motion `layoutId` (same spring as defined in §6 Interaction & Motion), with the glass container staying static and only the inner solid pill moving.
- Reference: provided screenshot — rounded glass container on a blue background, with one item shown as a solid black pill and the rest as translucent bold-uppercase labels.

---

## 6. Interaction & Motion

| Element | Behavior | Values |
|---|---|---|
| Mode switch | Background crossfades | `transition: background-color 0.4s ease` |
| New prompt | Card content fades + slides up | `opacity 0→1, y: 12→0, duration 0.25s` |
| Mode pill active state | Sliding filled pill behind label | CSS transition or Framer Motion `layoutId` |
| Button hover | Fill bottom-to-top | `height 0%→100%, 0.3s ease` |
| Card entrance on load | Slight scale + fade | `scale 0.96→1, opacity 0→1, duration 0.3s` |

---

## 7. Pending Items

- [ ] Design/export the cup + pool SVG for the splash screen
- [ ] Design the Spill logo/wordmark and confirm its placement on the splash screen
- [ ] Finalize splash screen subtitle copy in English
- [ ] Confirm frosted-glass implementation approach (backdrop-filter support / fallback)
