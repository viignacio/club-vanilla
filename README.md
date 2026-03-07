# Club Vanilla

Website for Club Vanilla — a Philippines entertainment club based in Japan. Built with Next.js, Sanity CMS, and full bilingual support (English / Japanese).

## Tech Stack

- **Next.js 15** (App Router) — SSR/ISR with language-based routing
- **TypeScript** — strict types throughout
- **Tailwind CSS v4** — utility-first styling with custom brand tokens
- **Sanity CMS** — headless CMS with embedded Studio at `/studio`
- **Framer Motion** — animations on hero and key sections
- **@portabletext/react** — rich text rendering from Sanity

## Project Structure

```
app/
  [lang]/           # Language-scoped routes (en | ja)
    page.tsx        # Dynamic page renderer via Sanity slug
    layout.tsx
  studio/
    [[...tool]]/    # Embedded Sanity Studio
  api/
    revalidate/     # ISR webhook handler
  globals.css       # Tailwind v4 @theme tokens

components/
  blocks/           # CMS-driven content blocks
    HeroBanner.tsx
    BasicContent.tsx
    ImagePairWithContent.tsx
    ImageWithText.tsx
    MenuSection.tsx
    FaqSection.tsx
    ContactForm.tsx
    BlockRenderer.tsx
  layout/
    Navbar.tsx
    Footer.tsx
    LanguageSwitcher.tsx

lib/
  i18n/             # Language config and dictionary loader
  types/            # TypeScript types for blocks, pages, i18n

sanity/
  schemas/          # Sanity document and object schemas
    documents/      # page, navbar, footer, dictionary
    objects/        # heroBanner, basicContent, menuSection, etc.
  lib/              # Sanity client, GROQ queries, image builder
```

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
SANITY_REVALIDATE_SECRET=
```

- `NEXT_PUBLIC_SANITY_PROJECT_ID` — found in your Sanity project settings
- `SANITY_API_TOKEN` — create a token with Editor permissions at sanity.io/manage
- `SANITY_REVALIDATE_SECRET` — any random string; used to validate ISR webhook requests

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.
Open [http://localhost:3000/studio](http://localhost:3000/studio) to access the CMS.

## CMS — Sanity Studio

The Sanity Studio is embedded in the app at `/studio`. Content editors can manage all pages, navigation, and the translation dictionary from there without a separate deployment.

### Key document types

| Document | Description |
|---|---|
| `page` | Any page on the site, built from content blocks |
| `navbar` | Global navigation links and logo |
| `footer` | Footer columns, social links, legal text |
| `dictionary` | Global UI strings (button labels, form copy, etc.) |

### Content blocks

Pages are composed from an ordered list of blocks. Available block types:

| Block | Description |
|---|---|
| `heroBanner` | Full-screen video or image hero with animated text |
| `basicContent` | Heading + rich text + optional image (left/right/center) + optional Google Maps embed |
| `imagePairWithContent` | Two side-by-side image cards with overlaid text and pricing |
| `imageWithText` | Single image with text, flexible layout |
| `menuSection` | Tabbed menu categories with item grid/list |
| `faqSection` | Accordion FAQ |
| `contactFormBlock` | Bilingual inquiry/application form |

## Internationalization (i18n)

The site supports **English (`en`)** and **Japanese (`ja`)**. Language is determined by the URL prefix: `/en/...` and `/ja/...`. The middleware redirects bare paths to the default locale (`en`).

All translatable Sanity fields use the `localizedString` or `localizedRichText` object types, which store `{ en: "...", ja: "..." }`. The `getLocalized(field, lang)` helper picks the right value at render time.

Static UI strings (button labels, placeholders, etc.) come from the `dictionary` Sanity document, fetched once per language via `getDictionary(lang)`.

## ISR & Revalidation

Pages use Incremental Static Regeneration. Publishing content in Sanity triggers a webhook to `/api/revalidate`, which revalidates the relevant page tag. Set up the webhook in your Sanity project settings pointing to:

```
https://your-domain.com/api/revalidate?secret=YOUR_SANITY_REVALIDATE_SECRET
```

## Deployment

Deploy to [Vercel](https://vercel.com). Add all environment variables in the Vercel project settings. No additional configuration is required — the embedded Studio and API routes work out of the box.
