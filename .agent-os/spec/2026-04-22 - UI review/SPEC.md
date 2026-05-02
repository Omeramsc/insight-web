# Insight Website — Design Review Fix Spec

## Overview

This spec documents all fixes derived from the designer's code review. It covers 9 distinct issues across typography, spacing, layout clarity, contrast, and visual design. Each issue maps to a specific component and includes exact implementation instructions.

---

## Multi-Agent Development Instructions

This spec is designed to be run with **parallel agents** where possible. Here's the recommended execution plan:

### Phase 1 — Global (must run first, blocks everything else)
**Agent 0 — Typography System**
- Updates `tailwind.config.mjs` font-size scale
- Updates `src/layouts/Base.astro` global CSS variables
- This must complete before any other agent starts, since all components inherit these tokens

### Phase 2 — Component fixes (run in parallel after Phase 1)
Each agent works on a single file. They don't touch each other's files.

| Agent | File | Issue(s) |
|-------|------|----------|
| Agent 1 | `src/components/Hero.astro` | Hero logo/visual, glow strategy |
| Agent 2 | `src/components/ProblemStatement.astro` | Missing section title |
| Agent 3 | `src/components/Features.astro` | Bullet font size, badge/tag hierarchy fix |
| Agent 4 | `src/components/BeforeAfter.astro` | Spacing, caption placement, category buttons |
| Agent 5 | `src/components/Pricing.astro` | Gray text contrast |
| Agent 6 | `src/components/FAQ.astro` | Focus border/outline on open state |
| Agent 7 | `src/components/HowItWorks.astro` | Typography scale fix |

### Phase 3 — QA pass (after all agents complete)
A final agent does a visual pass: checks all `text-sm` classes have been replaced where needed, verifies spacing tokens are consistent, and checks that the glow is either removed or extended site-wide per the decision made in Issue 9.

---

## Issue Index

1. [Hero — Logo / Visual](#1-hero--logo--visual)
2. [ProblemStatement — Missing Section Title](#2-problemstatement--missing-section-title)
3. [Features — Bullet Font Size](#3-features--bullet-font-size)
4. [Features — Badge/Tag Hierarchy](#4-features--badgetag-hierarchy)
5. [BeforeAfter — Spacing](#5-beforeafter--spacing)
6. [BeforeAfter — Category Filter Buttons](#6-beforeafter--category-filter-buttons)
7. [BeforeAfter — Caption Placement Ambiguity](#7-beforeafter--caption-placement-ambiguity)
8. [Pricing — Gray Text Contrast](#8-pricing--gray-text-contrast)
9. [FAQ — Focus Border on Open State](#9-faq--focus-border-on-open-state)
10. [HowItWorks — Typography Scale](#10-howitworks--typography-scale)
11. [Global — Typography Scale System](#11-global--typography-scale-system)
12. [Hero Glow — Site-wide Strategy](#12-hero-glow--site-wide-strategy)

---

## 1. Hero — Logo / Visual

**File:** `src/components/Hero.astro`  
**Problem:** The INSIGHT logo SVG sits on top of the hero background and reads harshly — it's a rectangular badge with a border that clashes with the photographic background. The designer asked: replace with a photo or create something visually impressive without a logo.

**Decision:** Replace the inline logo in the **hero section only** with a cinematic gradient wordmark — a large, stylized text treatment that uses a gradient fill and a subtle glow. The nav/footer logo SVG stays as-is. This avoids the asset-dependency of a photo while creating something visually impressive and brand-consistent.

**Implementation:**

In `Hero.astro`, remove the `<img src="/assets/logo.svg">` reference (if present in the hero body) and replace the `<p class="mb-4 text-xs ...">` label pill with a styled hero wordmark:

```astro
<!-- Replace the label pill with a cinematic wordmark treatment -->
<div class="mb-6 flex justify-center" aria-hidden="true">
  <span
    class="hero-wordmark font-display text-[11px] font-black uppercase tracking-[0.45em] text-transparent"
    style="background: linear-gradient(135deg, #6C8EFF 0%, #a78bfa 50%, #6C8EFF 100%); -webkit-background-clip: text; background-clip: text; filter: drop-shadow(0 0 18px rgba(108,142,255,0.55));"
  >
    Insight
  </span>
</div>

<!-- Then the existing h1 follows -->
<h1 id="hero-heading" ...>
```

If the hero already has no logo image in the body (only in `<Nav>`), skip this and focus on ensuring the hero's visual hierarchy reads cleanly without needing to show the logo at all. In that case, elevate the existing `<p class="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-accent">` label by making it slightly larger and more prominent:

```astro
<!-- Upgrade the existing label pill -->
<p class="mb-6 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.28em] text-accent backdrop-blur">
  {t.hero.label}
</p>
```

The key principle: **the hero must have a strong typographic entrance, not a logo badge.**

---

## 2. ProblemStatement — Missing Section Title

**File:** `src/components/ProblemStatement.astro`  
**Problem:** The 3-card problem grid (Image 1) has no section heading. The cards feel contextually orphaned — a visitor doesn't know if this is a list of Insight's features or a list of problems being addressed.

**Current code:**
```astro
<h2 id="problem-heading" class="sr-only">Why Insight exists</h2>
```

The heading is hidden (screen-reader only). It needs to be visible.

**Fix:** Make the heading visible and add a supporting subtitle.

```astro
<div class="mx-auto max-w-2xl text-center mb-12" data-reveal>
  <h2
    id="problem-heading"
    class="font-display text-3xl font-semibold tracking-tight text-text-primary md:text-4xl"
  >
    Sound familiar?
  </h2>
  <p class="mt-4 text-lg text-text-secondary">
    These are the walls every Photoshop photographer hits. Insight was built to break through all three.
  </p>
</div>
```

Remove the `class="sr-only"` from the existing `<h2>` and apply the classes above instead. The copy ("Sound familiar?") is a placeholder — the owner can adjust it — but the structure is required.

---

## 3. Features — Bullet Font Size

**File:** `src/components/Features.astro`  
**Problem:** Bullet point text uses `text-sm` (14px with default Tailwind scale). The designer says: do not go below 14px, and for smaller-looking fonts prefer 16px.

**Current code:**
```astro
<ul class="mt-4 space-y-2 text-sm text-text-secondary">
```

**Fix:** Upgrade to `text-base` (16px):

```astro
<ul class="mt-4 space-y-2 text-base text-text-secondary">
```

Also increase the dot indicator to match:
```astro
<span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
```
(Slightly larger dot, `mt-1.5` to re-align with 16px line height.)

---

## 4. Features — Badge/Tag Hierarchy

**File:** `src/components/Features.astro`  
**Problem (Image 3):** Each feature article currently renders:
1. Badge pill (e.g. "IDEATION") — looks like a category tag
2. Feature title (e.g. "Multi-Variance Generation") — the real heading
3. Description text
4. Bullets

The designer says this reads as "subtitle → title → subtitle → info" — the badge and description both feel like subtitles, making the structure confusing. The badge doesn't serve as a useful label because it's not explained.

**Fix:** Two options — choose one:

**Option A (Recommended):** Move the badge above as a super-label and visually de-emphasize it so it clearly reads as a category tag, not a competing title. Increase space between badge and title.

```astro
<div class="space-y-2">
  <!-- Badge is clearly a tag, not a title -->
  <span class="inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
    {item.badge}
  </span>
  <!-- Title gets full visual weight -->
  <h3 class="font-display text-2xl font-semibold text-text-primary leading-snug">{item.title}</h3>
</div>
<p class="text-base leading-relaxed text-text-secondary">{item.description}</p>
```

**Option B:** Remove the badge entirely and rely on the title alone. Simplifies the hierarchy to: title → description → bullets.

The badge styling change (from `bg-ink border-border` to `bg-accent/10 border-accent/30`) makes it read as a category chip, not a second title. This resolves the dual-title confusion.

---

## 5. BeforeAfter — Spacing

**File:** `src/components/BeforeAfter.astro`  
**Problem (Image 4):** The designer flagged "not enough spacings!!" The comparison pairs are stacked with `gap-16` but the overall section feels dense. The caption label sits too close to the slider.

**Fix:**

1. Increase the gap between pairs from `gap-16` to `gap-24 md:gap-32`
2. Add more breathing room above and below the section heading
3. Increase `figcaption` margin so the label has space from the slider

```astro
<!-- Section outer padding -->
<section class="bg-surface py-20 md:py-32" ...>

<!-- Pairs gap -->
<div class="mt-16 flex flex-col gap-24 md:gap-32">

<!-- Figcaption spacing -->
<figure data-reveal class="space-y-6">
  <figcaption class="text-center text-base font-medium text-text-secondary px-4">
```

The `figcaption` font also upgrades from `text-sm` to `text-base` per the global typography rule (Issue 11).

---

## 6. BeforeAfter — Category Filter Buttons

**File:** `src/components/BeforeAfter.astro`  
**Problem:** The designer suggested adding "clickable buttons for before-after of different fields (real-estate photos, portraits, landscape)."

**This is a new feature addition.** It requires:
1. Adding category metadata to each before/after pair
2. Rendering filter buttons above the pairs
3. JavaScript to show/hide pairs based on selected category

**Implementation:**

Add a `data-category` attribute to each `<figure>`:
```astro
<figure data-reveal data-category="portrait" class="space-y-6">
```

Add filter buttons above the pairs grid:
```astro
<div class="mt-10 flex justify-center gap-3 flex-wrap" role="group" aria-label="Filter by photo type">
  {['All', 'Portrait', 'Landscape', 'Real Estate'].map((cat) => (
    <button
      type="button"
      data-filter={cat.toLowerCase()}
      class:list={[
        'rounded-full border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface',
        cat === 'All'
          ? 'border-accent bg-accent text-ink'
          : 'border-border bg-surface-2 text-text-secondary hover:border-accent hover:text-text-primary'
      ]}
    >
      {cat}
    </button>
  ))}
</div>
```

Add a `<script>` block:
```javascript
const buttons = document.querySelectorAll('[data-filter]');
const figures = document.querySelectorAll('[data-category]');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    
    // Update button styles
    buttons.forEach(b => {
      b.classList.toggle('bg-accent', b === btn);
      b.classList.toggle('text-ink', b === btn);
      b.classList.toggle('border-accent', b === btn);
      b.classList.toggle('bg-surface-2', b !== btn);
      b.classList.toggle('text-text-secondary', b !== btn);
    });
    
    // Show/hide figures
    figures.forEach(fig => {
      const matches = filter === 'all' || fig.dataset.category === filter;
      fig.style.display = matches ? '' : 'none';
    });
  });
});
```

**Note for agent:** The current pairs don't have category data yet. Assign categories based on content:
- `pair1` (cosplay background fill) → `portrait`
- `pair2` (cosplay background swap) → `portrait`
- `pair3` (banana Adobe vs Insight) → leave as `all` or add a `product` category

The owner will need to add real-estate and landscape images separately.

---

## 7. BeforeAfter — Caption Placement Ambiguity

**File:** `src/components/BeforeAfter.astro`  
**Problem (Images 4, 5, 8):** The `figcaption` describing a pair currently renders **above** the slider. On mobile (Image 8), this is especially confusing — it's unclear whether the caption describes the image above it or the image below it.

**Fix:** Move the `figcaption` to render **below** the slider, and increase its visual separation:

```astro
<figure data-reveal data-category="portrait" class="space-y-0">
  <!-- Slider first -->
  <div class="relative" ...>
    <img-comparison-slider class="rounded-xl">...</img-comparison-slider>
    <!-- BEFORE/AFTER overlay badges stay here -->
  </div>
  
  <!-- Caption below, clearly attributed to the image above -->
  <figcaption class="mt-4 text-center text-base font-medium text-text-secondary px-4">
    {t.beforeAfter.pair1Label}
  </figcaption>
</figure>
```

This resolves the "is that the title of the whole section or just the first image?" confusion (Image 8) and the "is the text for the top or bottom image?" issue (Images 4, 5).

---

## 8. Pricing — Gray Text Contrast

**File:** `src/components/Pricing.astro`  
**Problem (Image 6):** The note text ("You'll be redirected to Gumroad for secure checkout. Free tier Gemini API available — start for free.") has insufficient contrast. It uses `text-text-muted` or similar gray that doesn't meet readability standards.

**Fix:** Find the note text and upgrade its color:

```astro
<!-- Before -->
<p class="mt-2 text-xs text-center text-text-muted">
  {t.pricing.note1}
</p>
<p class="text-xs text-center text-text-muted">
  {t.pricing.note2}
</p>

<!-- After -->
<p class="mt-3 text-sm text-center text-text-secondary leading-relaxed">
  {t.pricing.note1}<br />
  {t.pricing.note2}
</p>
```

Changes:
- `text-xs` → `text-sm` (12px → 14px; borderline acceptable given dark bg, but `text-sm` is safer)
- `text-text-muted` → `text-text-secondary` (higher contrast color token)
- Combine into one `<p>` for breathing room with a `<br />` separator

Also verify `tailwind.config.mjs` that `text-text-secondary` maps to at least `#A0A0B0` or equivalent — it must achieve 4.5:1 contrast ratio against the card's dark background (`bg-surface-2` / `#1A1A28` approx).

---

## 9. FAQ — Focus Border on Open State

**File:** `src/components/FAQ.astro`  
**Problem (Image 7):** When clicking an FAQ `<details>` item, it shows a visible blue focus ring/border that's described as "annoying." The `open:border-accent/40` class applies a visible border change on open state that combined with the browser's default focus outline creates a double-border effect.

**Fix:** 

1. Keep the open-state border for visual feedback, but remove it from conflicting with focus styles.
2. Add `focus-within:outline-none` to suppress the browser's default focus behavior on `<details>` while preserving keyboard accessibility via the `<summary>` element's own focus ring.

```astro
<details
  data-reveal
  class="group rounded-xl border border-border bg-surface-2 px-4 py-3 open:border-accent/40 open:shadow-lg open:shadow-accent/5 focus-within:outline-none"
>
  <summary class="cursor-pointer list-none font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface [&::-webkit-details-marker]:hidden">
```

Key changes:
- `focus:outline-none` → `focus-visible:outline-none` on `<summary>` (keeps keyboard ring, removes mouse ring)
- `focus:ring-2` → `focus-visible:ring-2` (same reason)
- Add `focus-within:outline-none` on `<details>` to suppress the outer container's browser default focus ring

---

## 10. HowItWorks — Typography Scale

**File:** `src/components/HowItWorks.astro`  
**Problem (Image 8 context, designer's note):** The step titles use `text-lg font-semibold` while the step body uses `text-sm`. The designer says: *"In the 'how it works' section, we can have the title of the stage to be at the same size as the subtitles because the weights and sizes are different."* The step body text also violates the 16px minimum.

**Fix:**

```astro
<!-- Step title: was text-lg font-semibold, now text-xl font-semibold -->
<h3 class="font-display text-xl font-semibold text-text-primary">{step.title}</h3>

<!-- Step body: was text-sm, now text-base -->
<p class="mt-3 text-base leading-relaxed text-text-secondary">{step.body}</p>
```

The section heading stays at `text-3xl md:text-4xl`. The step titles move to `text-xl` (20px), which matches the "subtitle" level in the scale defined in Issue 11. The step body moves to `text-base` (16px).

---

## 11. Global — Typography Scale System

**File:** `tailwind.config.mjs` + `src/layouts/Base.astro`  
**Problem:** The designer specified: *"with the font I'm using, it is favorable if the smallest text will be 16px. I would use 16→20→28/32."*

**Current state:** Tailwind's default scale is used throughout, with `text-sm` (14px) appearing in bullets, figcaptions, FAQ answers, footer text, and step body text.

**Fix — enforce the scale globally:**

In `tailwind.config.mjs`, add a fontSize extension that maps semantic names:

```js
theme: {
  extend: {
    fontSize: {
      // Minimum body text: 16px
      'body-sm': ['1rem', { lineHeight: '1.6' }],      // 16px — smallest allowed
      'body':    ['1.125rem', { lineHeight: '1.6' }],  // 18px — comfortable body
      'subtitle':['1.25rem', { lineHeight: '1.4' }],   // 20px — subtitles
      'heading': ['1.75rem', { lineHeight: '1.2' }],   // 28px — section headings
      'display': ['2rem', { lineHeight: '1.1' }],      // 32px — display headings
    }
  }
}
```

**Component-by-component text size audit:**

| Location | Current | Fix |
|---|---|---|
| Feature bullets | `text-sm` (14px) | `text-base` (16px) |
| Feature description | `text-base` (16px) | ✓ keep |
| BeforeAfter figcaption | `text-sm` | `text-base` |
| BeforeAfter zoom caption | `text-sm` | `text-base` |
| FAQ answer | `text-sm` | `text-base` |
| HowItWorks step body | `text-sm` | `text-base` |
| Pricing note | `text-xs` | `text-sm` (14px, acceptable for fine print) |
| Footer body | `text-sm` | `text-sm` (footer fine print exception — acceptable) |
| ProblemStatement card body | `text-sm` | `text-base` |

The rule: **`text-sm` (14px) is only permitted for fine-print (legal copy, footer attribution, requirement pills)**. Everything else is `text-base` (16px) minimum.

---

## 12. Hero Glow — Site-wide Strategy

**File:** `src/components/Hero.astro` + `src/layouts/Base.astro`  
**Problem:** The hero has a mouse-tracked radial glow. The designer says: *"The glow on hero is not necessary. If you like it (I do), think of having it over the whole website."*

**Decision guidance (owner must choose):**

**Option A — Remove glow entirely**
- Delete the `.hero-glow` div and its `<script>` block from `Hero.astro`
- Cleanest, fastest

**Option B — Keep on hero only**
- No change needed; current implementation is fine
- Remove the `is:inline` script's glow default opacity slightly (from `0.40` to `0.30`) to make it less harsh

**Option C — Extend glow site-wide (recommended if you like it)**
- Move the glow element and script to `Base.astro`
- Make it follow the cursor across the entire `<body>`
- Use a more subtle `rgba(108,142,255,0.15)` opacity (vs hero's `0.35`) so it doesn't overpower content sections
- The glow becomes a persistent ambient effect rather than a spotlight

Implementation for Option C in `Base.astro`:
```html
<!-- Add inside <body>, before </body> -->
<div
  id="site-glow"
  class="pointer-events-none fixed inset-0 z-0 opacity-0 mix-blend-screen transition-opacity duration-500"
  aria-hidden="true"
></div>

<script is:inline>
  document.addEventListener('DOMContentLoaded', function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var glow = document.getElementById('site-glow');
    if (!glow) return;
    glow.style.opacity = '1';
    glow.style.background = 'radial-gradient(700px circle at 50% 50%, rgba(108,142,255,0.12), transparent 60%)';
    document.addEventListener('pointermove', function (e) {
      var x = (e.clientX / window.innerWidth) * 100;
      var y = (e.clientY / window.innerHeight) * 100;
      glow.style.background =
        'radial-gradient(700px circle at ' + x + '% ' + y + '%, rgba(108,142,255,0.14), transparent 60%)';
    });
  });
</script>
```

Then remove the hero-specific glow div and script from `Hero.astro`.

**Recommendation:** Option C. A subtle, persistent ambient glow at low opacity elevates the dark-mode aesthetic without overwhelming any section. The key is keeping it at `≤0.15` opacity outside the hero — the hero can have a slightly stronger version (`0.25`) if desired.

---

## Summary Table

| # | Issue | File | Priority | Agent |
|---|-------|------|----------|-------|
| 1 | Hero logo/visual | Hero.astro | High | Agent 1 |
| 2 | Missing section title | ProblemStatement.astro | High | Agent 2 |
| 3 | Bullet font size | Features.astro | High | Agent 3 |
| 4 | Badge tag hierarchy | Features.astro | Medium | Agent 3 |
| 5 | Not enough spacing | BeforeAfter.astro | High | Agent 4 |
| 6 | Category filter buttons | BeforeAfter.astro | Medium | Agent 4 |
| 7 | Caption placement | BeforeAfter.astro | High | Agent 4 |
| 8 | Gray text contrast | Pricing.astro | High | Agent 5 |
| 9 | FAQ focus border | FAQ.astro | Low | Agent 6 |
| 10 | HowItWorks typography | HowItWorks.astro | Medium | Agent 7 |
| 11 | Global typography scale | tailwind.config + Base | High | Agent 0 |
| 12 | Hero glow strategy | Hero.astro + Base.astro | Low | Agent 1 |

**High priority items** = visible readability/contrast problems that hurt conversion.  
**Medium priority items** = hierarchy/UX confusion that reduces clarity.  
**Low priority items** = polish and interaction details.
