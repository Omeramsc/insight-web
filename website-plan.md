# Insight Website — Full Build Spec
> For use with Cursor + Claude. Read this entire document before writing any code.

---

## 1. Project Overview

**Product**: Insight — AI-Powered Photography Assistant for Adobe Photoshop  
**Purpose**: Promotional website (not a storefront — sales happen on Gumroad)  
**Primary goal**: Convince photographers and designers that Insight is worth buying  
**Tone**: Professional, dark, image-forward. Like a premium creative tool — not a SaaS startup  
**Languages**: English (primary), Japanese (secondary, `/ja/` route)  
**Price**: Under $30, sold via Gumroad  

---

## 2. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Astro 4.x** | Static output, built-in i18n, fast builds, zero runtime JS by default |
| Styling | **Tailwind CSS 3.x** | Responsive utilities, dark theme trivial, pairs well with Cursor |
| Before/After Slider | **img-comparison-slider** (web component) | Open source, keyboard accessible, tiny bundle |
| Animations | **CSS scroll-driven animations** + minimal vanilla JS | No library needed, performant |
| Icons | **Lucide icons** (via astro integration) | Consistent, MIT licensed |
| Fonts | **Geist** (headings) + **DM Sans** (body) | Sharp, modern, professional — distinct from Topaz/Luminar |
| Deployment | **Netlify** | Free tier, drag-and-drop or CLI, automatic HTTPS, branch previews |
| i18n | **Astro i18n routing** (`/en/`, `/ja/`) | Built-in, no extra library |

### Project structure
```
insight-website/
├── public/
│   ├── favicon.ico
│   ├── og-image.jpg          ← 1200×630 social preview (you create in PS)
│   └── assets/
│       ├── logo.svg
│       ├── before-1-raw.jpg  ← portrait/cosplayer, unedited
│       ├── after-1-edit.jpg  ← same photo after Insight edit
│       ├── before-2-raw.jpg  ← portrait #2
│       ├── after-2-edit.jpg
│       ├── before-banana-adobe.jpg   ← Adobe native generative fill result
│       └── after-banana-insight.jpg  ← Insight generative fill result
├── src/
│   ├── i18n/
│   │   ├── en.json           ← all English strings
│   │   └── ja.json           ← all Japanese strings
│   ├── layouts/
│   │   └── Base.astro        ← <html>, <head>, skip-link, lang attr
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── ProblemStatement.astro
│   │   ├── Features.astro
│   │   ├── BeforeAfter.astro
│   │   ├── DemoVideo.astro
│   │   ├── HowItWorks.astro
│   │   ├── Comparison.astro   ← Insight vs Adobe native, feature table
│   │   ├── Pricing.astro
│   │   ├── FAQ.astro
│   │   ├── Footer.astro
│   │   └── LanguageSwitcher.astro
│   └── pages/
│       ├── en/
│       │   └── index.astro
│       ├── ja/
│       │   └── index.astro
│       └── accessibility.astro  ← required for Israeli law
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── netlify.toml
```

---

## 3. Design System

### Color palette (CSS variables in tailwind.config.mjs)
```js
colors: {
  'ink':       '#0A0A0F',   // page background — near-black with blue undertone
  'surface':   '#111118',   // card/section backgrounds
  'surface-2': '#1A1A24',   // elevated surfaces, feature cards
  'border':    '#2A2A38',   // subtle borders
  'accent':    '#6C8EFF',   // primary accent — electric blue-violet (NOT purple-gradient-cliché)
  'accent-2':  '#FF6B6B',   // secondary accent — warm coral, used sparingly
  'text-primary':   '#F0F0F8',
  'text-secondary': '#9090A8',
  'text-muted':     '#505068',
}
```

### Typography
- **Display / H1**: Geist, 700, tracked slightly tight (`tracking-tight`)
- **H2–H3**: Geist, 600
- **Body**: DM Sans, 400/500, `leading-relaxed`
- **Code/technical**: Geist Mono (for things like "f/2.8 ISO 400")

Load via Google Fonts in `Base.astro`:
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Geist:wght@600;700&display=swap" rel="stylesheet">
```

### Motion principles
- Sections fade + slide up on scroll (IntersectionObserver, no library needed)
- Hero has a subtle slow-moving radial gradient that follows cursor (vanilla JS, ~15 lines)
- Before/after slider: smooth drag, CSS transition on the divider line
- No auto-playing video. No spinning loaders.

---

## 4. Section-by-Section Spec

---

### 4.1 — `<head>` / Base layout (`Base.astro`)

```html
<html lang="{lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Insight — AI Photography Assistant for Photoshop</title>
  <meta name="description" content="The most comprehensive AI integration ever built for Adobe Photoshop. Generative fill, smart critique, lighting analysis, and more.">
  <!-- Open Graph -->
  <meta property="og:title" content="Insight for Photoshop">
  <meta property="og:description" content="Your AI-powered unfair advantage in Adobe Photoshop.">
  <meta property="og:image" content="/og-image.jpg">
  <meta property="og:type" content="website">
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <!-- Canonical -->
  <link rel="canonical" href="https://your-domain.netlify.app/{lang}/">
  <!-- Accessibility: skip link target -->
</head>
<body class="bg-ink text-text-primary">
  <!-- ACCESSIBILITY: Skip to content -->
  <a href="#main-content" class="skip-link sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-accent focus:text-ink focus:px-4 focus:py-2 focus:rounded">
    Skip to main content
  </a>
  <Nav />
  <main id="main-content">
    <slot />
  </main>
  <Footer />
</body>
```

---

### 4.2 — Nav (`Nav.astro`)

- Fixed top, `backdrop-blur-sm bg-ink/80`
- Left: Logo SVG
- Right: anchor links to sections (Features, Demo, Pricing, FAQ) + LanguageSwitcher + "Get Insight →" CTA button
- On mobile: hamburger menu, full-screen overlay nav
- **Accessibility**: `<nav aria-label="Main navigation">`, all links keyboard focusable, hamburger has `aria-expanded`, `aria-controls`

```
[Logo]   Features  Demo  Pricing  FAQ   [EN | 日本語]   [Get Insight →]
```

---

### 4.3 — Hero (`Hero.astro`)

**Layout**: Full viewport height, centered content, large background image (one of the edited cosplayer photos, dark-toned)

**Content**:
```
[small label, uppercase tracking-widest text-accent]
ADOBE PHOTOSHOP PLUGIN

[H1 — 2 lines max]
Your AI co-pilot.
Inside Photoshop.

[Subtitle — 1–2 sentences, text-secondary]
Insight reads your metadata, analyzes your pixels, and generates 
photorealistic results — without leaving your workspace.

[Two CTA buttons, stacked on mobile / side by side on desktop]
[primary]  Watch Demo  ▶
[secondary, outline]  Get Insight on Gumroad  →

[Below CTAs — social proof line, text-muted, small]
Requires Photoshop 2024+  ·  Works with your own Gemini API key  ·  No subscription
```

**Visual treatment**:
- Background: full-bleed dark edited photo, `object-cover`, with a dark gradient overlay (`from-ink via-ink/60 to-transparent`) so text is legible
- Subtle animated radial gradient following cursor (JS, add/remove on hover)
- On scroll: hero content fades, photo stays (parallax-light via CSS `background-attachment: fixed` on desktop only)

---

### 4.4 — Problem Statement (`ProblemStatement.astro`)

Short section, 3 pain points in a horizontal row (stack on mobile):

```
[Icon]                    [Icon]                    [Icon]
Photoshop's AI            Every tool needs a         You fix the same
is a black box            separate app               mistakes every shoot
─────────────────         ──────────────────         ──────────────────
Native generative         Lightroom, Bridge,         No one tells you
fill ignores your         Gemini — you're            your lighting is
camera settings           context-switching          consistently flat
```

Visual: dark `surface` background, thin `border` top/bottom, icons from Lucide

---

### 4.5 — Features (`Features.astro`)

6 features, displayed in a 2-column alternating layout (image/screenshot left, text right — then flip):

**Each feature block**:
- Screenshot or illustration of the panel (you provide, or a mockup screenshot)
- Badge label (e.g. "Generative AI", "Analysis", "Learning")
- Feature name (H3)
- 2–3 sentence description — rewrite from Gumroad copy, more confident tone
- 1–2 bullet highlights

**Feature order** (ranked by impact for a buyer):
1. **Advanced Generative Fill + Magic Wand** — the "unfair advantage" centerpiece
2. **Multi-Variance Generation** — 10 variations, commit to one
3. **Dynamic Photo Compare** — compare 2–5 documents, ranked by composition/lighting/impact
4. **Expert Critique + Lighting Breakdown** — honest feedback, lighting schematic
5. **Personal Photoshop Tutor** — context-aware, sees your layers
6. **Pattern Analysis** — tracks your blind spots over time

**Layout note**: On mobile, all blocks stack vertically (image top, text bottom). On desktop, alternating left/right.

---

### 4.6 — Before / After Slider (`BeforeAfter.astro`)

Use the `img-comparison-slider` web component:

```bash
npm install img-comparison-slider
```

**Three slider pairs**, displayed in a vertical sequence with labels:

**Pair 1 — Portrait (Generative Fill)**
```
Label: "Seamless generative fill — photorealistic, grain-matched"
Before: [portrait, as-shot, raw file]
After:  [same portrait, after Insight generative fill — no visible seams]
```

**Pair 2 — Cosplayer (Edit + Critique)**
```
Label: "Full edit guided by Insight's critique and lighting breakdown"
Before: [cosplayer, as-shot]
After:  [same photo, edited with Insight recommendations applied]
```

**Pair 3 — The Banana Test (head-to-head)**
```
Label: "Adobe Generative Fill vs Insight — same prompt, same image"
Before label overlay: "Adobe Native"
After label overlay: "Insight"
Before: [banana, Adobe result — visibly worse/uncanny]
After:  [banana, Insight result — photorealistic]
Note: Add a "zoom-in" crop below this pair as a static image comparison
```

**Implementation**:
```html
<img-comparison-slider>
  <img slot="first" src="/assets/before-1-raw.jpg" alt="Portrait photo as shot from camera, unedited" />
  <img slot="second" src="/assets/after-1-edit.jpg" alt="Same portrait after Insight AI generative fill — seamlessly extended background" />
</img-comparison-slider>
```

**Accessibility requirements**:
- Both `<img>` tags must have descriptive `alt` text explaining what changed
- The slider is keyboard-operable (arrow keys) — img-comparison-slider handles this
- Add `aria-label="Before and after comparison: [description]"` to each slider wrapper

---

### 4.7 — Demo Video (`DemoVideo.astro`)

```html
<section aria-label="Product demo video">
  <h2>See it in action</h2>
  <p class="text-secondary">Watch Insight turn a complex edit into a 30-second workflow.</p>
  
  <div class="relative aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden border border-border">
    <iframe
      src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
      title="Insight for Photoshop — product demo"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      class="absolute inset-0 w-full h-full"
    ></iframe>
  </div>
</section>
```

Add a custom thumbnail overlay that the user clicks to load the iframe (performance + aesthetics — avoids YouTube's ugly default embed until clicked).

---

### 4.8 — How It Works (`HowItWorks.astro`)

3-step visual flow, horizontal on desktop, vertical on mobile:

```
[1]                      [2]                      [3]
Install in               Open in Photoshop.        Work smarter.
5 minutes.               Your panels appear        Critique, generate,
                         in your workspace.        compare, and learn.
──────────────           ──────────────            ──────────────
Download from            No separate window.       Everything happens
Gumroad, run             No context switching.     in your canvas,
the installer.           Just Insight, built in.   in new layers.
```

Visual: numbered circles with accent color, connected by a dashed line on desktop

---

### 4.9 — Comparison Table (`Comparison.astro`)

Insight vs Adobe native vs other plugins:

| Feature | Adobe Native | Other Plugins | **Insight** |
|---|---|---|---|
| Reads EXIF / camera settings | ✗ | ✗ | ✓ |
| Grain-matched generative fill | ✗ | ✗ | ✓ |
| 10-variant generation | ✗ | ✗ | ✓ |
| Multi-document compare | ✗ | ✗ | ✓ |
| Lighting schematic | ✗ | ✗ | ✓ |
| Context-aware tutor | ✗ | ✗ | ✓ |
| Pattern analysis over time | ✗ | ✗ | ✓ |
| No subscription | ✓ | Some | ✓ |
| Uses your own API key | ✗ | ✗ | ✓ |

Style: `surface-2` background, checkmarks in `accent` green (use a separate `green-500` for ✓, `text-muted` for ✗)

---

### 4.10 — Pricing (`Pricing.astro`)

Simple, single pricing card, centered:

```
[Surface-2 card, border-accent, rounded-2xl]

INSIGHT FOR PHOTOSHOP
─────────────────────
$15
One-time purchase · No subscription

✓ All 6 feature modules
✓ Lifetime updates (current version)
✓ Use your own Gemini API key
✓ Works with Photoshop 2024+
✓ Windows & Mac

[Large CTA button]
Get Insight on Gumroad →

[Below button, text-muted, small]
You'll be redirected to Gumroad for secure checkout.
Free tier Gemini API available — start for free.
```

---

### 4.11 — FAQ (`FAQ.astro`)

Accessible accordion — each item is a `<details>`/`<summary>` pair (native HTML, keyboard accessible, no JS needed):

**Questions to include**:
1. Do I need to pay for the Gemini API? — *Free tier is available via Google AI Studio. Most users will stay within the free limits.*
2. Which Photoshop versions are supported? — *Photoshop 2024 (v25.0) and later. CC subscription required (Insight is a plugin, not a replacement).*
3. Does Insight work on Mac and Windows? — *Yes, both are supported.*
4. Is my data private? — *Insight uses your own Gemini API key. Images are processed by Google's API per their privacy policy. Insight itself stores no data.*
5. Can I get a refund? — *Refer to Gumroad's refund policy. If you have a technical issue, contact [email].*
6. How is this different from Photoshop's native AI? — *Insight reads your EXIF data, matches grain, supports reference images, generates up to 10 variants, and adds critique/analysis/tutoring tools that Adobe doesn't offer.*
7. Do I need an internet connection? — *Yes, for AI features. The plugin panel itself opens offline, but generation/critique requires API access.*

---

### 4.12 — Footer (`Footer.astro`)

```
[Logo]   Insight for Photoshop

Links:                          Legal:
Features                        Accessibility Statement
Demo                            Privacy Policy (minimal)
Gumroad →                       Contact: [email]

[Language switcher: EN | 日本語]

© 2025 [Your Name]. Insight is not affiliated with Adobe Inc.
Adobe and Photoshop are trademarks of Adobe Inc.
```

---

### 4.13 — Accessibility Statement (`accessibility.astro`)

Separate page at `/accessibility` (linked from footer). Required under Israeli Standard IS 5568.

**Content template**:
```
Accessibility Statement

[Site name] is committed to making this website accessible to people with disabilities, 
in accordance with Israeli Standard IS 5568 (based on WCAG 2.1 AA).

Accessibility features on this site:
- All images include descriptive alternative text
- The site is keyboard-navigable
- Color contrast meets WCAG AA standards
- Before/after comparison sliders are operable with keyboard arrow keys
- Videos are embedded with titles; captions available on YouTube
- Skip-to-content link available at the top of all pages

Known limitations:
- [Note any known issues honestly]

Feedback:
If you encounter accessibility barriers, please contact us at: [email]
We aim to respond within 5 business days.

Last reviewed: [date]
```

---

## 5. Internationalization (i18n)

### Setup in `astro.config.mjs`
```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
    routing: {
      prefixDefaultLocale: true  // → /en/ and /ja/
    }
  }
});
```

### String file structure (`src/i18n/en.json`)
```json
{
  "nav": {
    "features": "Features",
    "demo": "Demo",
    "pricing": "Pricing",
    "faq": "FAQ",
    "cta": "Get Insight"
  },
  "hero": {
    "label": "Adobe Photoshop Plugin",
    "h1_line1": "Your AI co-pilot.",
    "h1_line2": "Inside Photoshop.",
    "subtitle": "Insight reads your metadata, analyzes your pixels, and generates photorealistic results — without leaving your workspace.",
    "cta_primary": "Watch Demo",
    "cta_secondary": "Get Insight on Gumroad",
    "requirements": "Requires Photoshop 2024+  ·  Works with your own Gemini API key  ·  No subscription"
  }
  // ... all other sections
}
```

### Usage in components
```astro
---
import en from '../i18n/en.json';
import ja from '../i18n/ja.json';
const { lang } = Astro.params;
const t = lang === 'ja' ? ja : en;
---
<h1>{t.hero.h1_line1}</h1>
```

### Language switcher
```astro
<a href="/en/" hreflang="en" lang="en">EN</a>
<a href="/ja/" hreflang="ja" lang="ja">日本語</a>
```

**Note on Japanese content**: Machine-translate English strings as a starting point, but have a native speaker review the marketing copy before launch. Technical terms (Photoshop, Generative Fill, EXIF, API) stay in English/Roman characters.

---

## 6. Accessibility Checklist (IS 5568 / WCAG 2.1 AA)

These must all be implemented during build, not added later:

- [ ] `<html lang="{locale}">` — set correctly per page
- [ ] Skip-to-content link (see Base.astro above)
- [ ] All `<img>` tags have descriptive `alt` attributes
- [ ] Before/after sliders: both images have `alt`, slider has `aria-label`
- [ ] YouTube iframe has `title` attribute
- [ ] Nav: `<nav aria-label="Main navigation">`, mobile menu has `aria-expanded`
- [ ] FAQ accordion: `<details>/<summary>` (natively accessible)
- [ ] Color contrast: test accent (#6C8EFF) on dark bg (#0A0A0F) — must pass AA (4.5:1 for normal text, 3:1 for large)
- [ ] All interactive elements reachable and operable via keyboard Tab/Enter/Space/Arrows
- [ ] Focus indicators visible (do not set `outline: none` without a replacement)
- [ ] No content conveyed by color alone
- [ ] Accessibility statement page linked in footer
- [ ] `<html>` has `dir="ltr"` (or `rtl` if Hebrew added later)

---

## 7. Performance & Security

### Performance targets
- Lighthouse score: 90+ on all categories
- Images: use `<img loading="lazy">` on everything below the fold; hero image preloaded
- Convert all photos to **WebP** format (Photoshop can export these)
- Use `width` and `height` attributes on all `<img>` to prevent layout shift

### Security
- Netlify enforces HTTPS automatically
- No user input, no forms, no backend — attack surface is near zero
- Add security headers in `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Content-Security-Policy = "default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; frame-src www.youtube.com;"
```

---

## 8. Responsive Breakpoints (Tailwind)

| Breakpoint | Width | Layout behavior |
|---|---|---|
| `sm` | 640px | Base mobile styles apply below this |
| `md` | 768px | Nav expands, 2-col grids activate |
| `lg` | 1024px | Alternating feature layout, full horizontal flow |
| `xl` | 1280px | Max content width caps at `max-w-7xl` centered |

All sections use `px-4 md:px-8 lg:px-16` horizontal padding and `py-16 md:py-24` vertical padding.

---

## 9. Build & Deploy Commands

```bash
# Initial setup
npm create astro@latest insight-website
cd insight-website
npx astro add tailwind
npm install img-comparison-slider

# Development
npm run dev          # → localhost:4321

# Production build
npm run build        # → ./dist/

# Deploy to Netlify (CLI)
npm install -g netlify-cli
netlify deploy --dir dist --prod

# Or: drag the dist/ folder to netlify.com/drop
```

### `netlify.toml` (full)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/"
  to = "/en/"
  status = 301

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## 10. Assets You Must Provide

These cannot be AI-generated and must come from you:

| Asset | Format | Notes |
|---|---|---|
| Logo | SVG preferred | Should work on dark backgrounds |
| Before photo 1 | JPG/WebP, min 1200px wide | Portrait/cosplayer, as shot |
| After photo 1 | JPG/WebP, same dimensions | Same photo, Insight-edited |
| Before photo 2 | JPG/WebP | Second portrait |
| After photo 2 | JPG/WebP | |
| Before banana | JPG/WebP | Adobe Generative Fill result |
| After banana | JPG/WebP | Insight result |
| Banana zoom crops | JPG/WebP | Static crop comparison |
| YouTube video URL | — | Your demo video link |
| OG image | JPG, 1200×630px | Social preview, create in Photoshop |
| Plugin panel screenshot | PNG | Your Insight UI inside Photoshop |
| Contact email | — | For accessibility statement |
| Gumroad URL | — | The /l/bhhwsy link or updated one |

---

## 11. What to Ask Cursor to Build (Prompt Order)

Run these prompts in Cursor in order. Each builds on the previous.

**Prompt 1 — Setup**
```
Create a new Astro 4 project with Tailwind CSS. Configure it with i18n routing for English (/en/) 
and Japanese (/ja/). Set up the tailwind.config with this color palette: [paste section 3 colors]. 
Install img-comparison-slider. Create the folder structure from the spec.
```

**Prompt 2 — Base layout + Nav**
```
Create Base.astro with the HTML skeleton, skip-to-content link, Google Fonts (Geist + DM Sans), 
and all meta tags from the spec. Create Nav.astro with the links, logo placeholder, language 
switcher, and mobile hamburger menu. All elements must be keyboard accessible.
```

**Prompt 3 — Hero**
```
Create Hero.astro using the design and copy from the spec. Full viewport height, dark overlay 
on background image, animated radial gradient following cursor, two CTA buttons. Fully responsive.
```

**Prompt 4 — Features**
```
Create Features.astro with 6 alternating image/text feature blocks using the feature list from 
the spec. Fade-in on scroll using IntersectionObserver. Each block has a badge, heading, 
description, and bullet highlights.
```

**Prompt 5 — Before/After sliders**
```
Create BeforeAfter.astro using img-comparison-slider web component. Three pairs with the labels 
from the spec. All images have descriptive alt text. Add "Adobe Native" / "Insight" overlay 
labels on the banana comparison. Include a static zoom-crop section below the banana slider.
```

**Prompt 6 — Remaining sections**
```
Create DemoVideo.astro (YouTube embed with click-to-load poster), HowItWorks.astro (3-step flow), 
Comparison.astro (feature table), Pricing.astro (single card + Gumroad CTA), FAQ.astro 
(details/summary accordion), and Footer.astro. All from spec.
```

**Prompt 7 — i18n wiring**
```
Extract all English UI strings into src/i18n/en.json. Create a matching ja.json with placeholder 
Japanese translations (I will review them). Wire all components to use the t() translation 
lookup based on Astro.params.lang.
```

**Prompt 8 — Accessibility pass**
```
Review all components against the accessibility checklist in the spec. Add any missing aria 
attributes, alt text, focus styles, and lang attributes. Ensure the FAQ accordion is keyboard 
operable. Create the /accessibility page from the template in the spec.
```

**Prompt 9 — Performance + deploy**
```
Add loading="lazy" to all below-fold images. Add width and height to all img tags. Add the 
netlify.toml with security headers and redirect from / to /en/. Confirm the build succeeds 
with npm run build.
```

---

## 12. Known Issues & Decisions to Make Later

- **Japanese copy quality**: Machine translation is a placeholder. Hire a translator or use a native-speaker reviewer before pushing Japanese as a real language option.
- **Plugin screenshots**: If the Photoshop panel UI isn't polished-looking, a mockup may serve better than a real screenshot. Cursor can generate an SVG mockup of the panel.
- **Analytics**: Not included in this spec. If you add later, you'll need a cookie notice. Netlify Analytics (if using their paid plan) is cookie-free and privacy-safe.
- **Hebrew**: Not included. If added, requires `dir="rtl"` on `<html>` and RTL-aware Tailwind config (`tailwindcss-rtl` plugin).
- **Gumroad button tracking**: Consider adding a UTM parameter to your Gumroad URL to track clicks from the website.
- **Demo video**: If you don't have one yet, the video section should be hidden or replaced with a GIF screencast temporarily.