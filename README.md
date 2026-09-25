# Shoqata Studenti Zürich

The official digital platform for Shoqata Studenti Zürich, an Albanian student association based in Zürich. The application combines multilingual public information, a structured cultural and academic program, digital media archives, and an online membership workflow in one maintainable web system.

Production site: [shoqata-studenti.ch](https://shoqata-studenti.ch)

## Product Scope

The platform addresses a practical coordination problem for a student association: information about membership, studies, events, cultural projects, and organizational resources must remain discoverable, localized, and operationally reliable across multiple audiences.

Core capabilities include:

- Multilingual delivery in Albanian, German, and English with locale-aware content and navigation.
- Public information architecture for the association, its history, statutes, structure, board, federation, and projects.
- Academic guidance covering ETH Zürich, University of Zürich, applications abroad, and study-related questions.
- Event publishing with edition-specific pages, galleries, video media, event metadata, and upcoming-activity discovery.
- A document library for the “Vargjet e lira” cultural program, including topic-based document retrieval.
- Membership checkout for student and alumni memberships through Stripe Checkout.
- Verified Stripe webhook processing that creates or renews members in PostgreSQL after successful payment.
- Membership status lookup, newsletter subscription, transactional email, contact handling, and bot protection.
- Scheduled membership lifecycle operations through Vercel Cron for expiration checks and reminders.

## Architecture

The system uses a Next.js App Router application with server-first rendering and narrowly scoped client components for interactive navigation, forms, carousels, and media controls.

```text
Browser
  |
  v
Next.js App Router
  |-- Server-rendered pages and localized content
  |-- Client components for forms, navigation, galleries, and media
  |-- Route handlers and Server Actions
			 |-- PostgreSQL via Prisma
			 |-- Stripe Checkout and signed webhooks
			 |-- Resend transactional email
			 |-- Infomaniak newsletter API
			 |-- Cloudflare Turnstile verification
			 |-- Vercel Cron jobs
```

The primary persistence boundary is PostgreSQL, accessed through Prisma. The schema separates membership records, editorial posts, cultural documents, and event-gallery media. Binary media can be served through dedicated range-aware API endpoints, while curated static assets remain in `public/`.

The application is intentionally server-oriented for sensitive workflows: payment confirmation, membership writes, email dispatch, contact processing, and scheduled maintenance run outside the browser. Stripe webhook signatures and Cloudflare Turnstile validation protect the corresponding integration boundaries.

## Technology Stack

| Area | Technology |
| --- | --- |
| Application | Next.js 16, React 19, TypeScript |
| Rendering | Next.js App Router, Server Components, Server Actions |
| Styling | Tailwind CSS 4, shadcn/ui, Base UI, Lucide |
| Interaction | Embla Carousel |
| Data layer | Prisma ORM with PostgreSQL |
| Payments | Stripe Checkout and signed webhook events |
| Email | Resend |
| Newsletter | Infomaniak Newsletter API |
| Abuse prevention | Cloudflare Turnstile and honeypot fields |
| Hosting and operations | Vercel, Vercel Cron, Vercel Speed Insights |

## Repository Layout

- `app/` - localized pages, layouts, Server Actions, and HTTP route handlers.
- `components/` - reusable navigation, media, gallery, form, and presentation components.
- `lib/` - integration clients, domain logic, localization utilities, media handling, and shared helpers.
- `messages/` - Albanian, German, and English translation dictionaries.
- `prisma/` - PostgreSQL schema and controlled seed data for documents and editorial content.
- `public/` - curated static images, videos, PDFs, and organizational assets.
- `scripts/` - data seeding, migration, and maintenance utilities.

## Local Development

### Prerequisites

- Node.js 20 or newer
- npm
- A PostgreSQL database
- Credentials for the integrations you want to run locally

### Installation

1. Install dependencies:

	```bash
	npm install
	```

2. Create `.env.local` in the repository root. Never commit this file.

3. Add the required configuration:

	```dotenv
	DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
	STRIPE_SECRET_KEY="sk_test_..."
	STRIPE_WEBHOOK_SECRET="whsec_..."
	CRON_SECRET="replace-with-a-random-secret"
	TURNSTILE_SECRET_KEY="..."
	NEXT_PUBLIC_TURNSTILE_SITE_KEY="..."
	RESEND_API_KEY="re_..."
	RESEND_FROM="Shoqata Studenti Zürich <noreply@example.com>"
	INFOMANIAK_NEWSLETTER_API_KEY="..."
	```

	`NEXT_PUBLIC_URL` is optional and defaults to the deployed site URL when it is not set. Stripe membership catalog references can be supplied with `STRIPE_STUDENT_PRICE_ID` / `STRIPE_ALUMNI_PRICE_ID` or the corresponding product ID variables. The application also contains fallback catalog references that must be verified for the target Stripe account.

4. Generate the Prisma client and synchronize the development database:

	```bash
	npm run db:sync
	```

5. Start the development server:

	```bash
	npm run dev
	```

Open [http://localhost:3000](http://localhost:3000). Payment webhooks require a publicly reachable development endpoint, for example through a secure tunneling tool configured for the local Stripe test environment.

## Operational Commands

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm start         # Serve the production build
npm run lint      # Run ESLint
npm run db:sync   # Generate Prisma and push the schema to PostgreSQL
```

Data seeding and migration utilities are available as dedicated `db:*` scripts in `package.json`. Review each script before running it against a shared or production database.

## Deployment

The application is designed for Vercel deployment. Configure the environment variables in the Vercel project and connect the production PostgreSQL database. `vercel.json` schedules daily membership expiration checks and reminder processing through the application cron endpoints. Stripe should be configured with the production webhook endpoint at `/api/webhooks/stripe` and its signing secret should remain server-side.

## Engineering Notes

- PostgreSQL plus Prisma is the current source of truth for application data.
- The checkout flow uses Stripe Checkout for one-time membership payments; the webhook is the authoritative payment-to-membership transition.
- Locale selection is persisted through the application’s locale cookie and applied at the root layout.
- Media-heavy resources are separated from page composition through dedicated API routes and reusable media components.
- Secrets and integration credentials are read from server-side environment variables and are not intended for client exposure.
