# Project Masterplan: Verein Website

## Tech Stack
- Framework: Next.js 15 (App Router)
- Database: Prisma ORM with MySQL (Infomaniak)
- Styling: Tailwind CSS + shadcn/ui
- Emails: Resend + React Email
- Payments: Stripe Subscriptions

## Features
- Public: Home, History (Video/Images), Membership Info.
- Member Status Check: Email-based check (no login).
- Automation: 
    - Confirmation email after Stripe payment.
    - Reminder emails for expiring memberships.
- Admin (Protected Route): 
    - Simple dashboard to create news posts.
    - View/Search member list.
    - Newsletter tool (triggering Resend Broadcasts).

## Database Schema (Prisma)
- Member: id, email, status, stripeId, joinedAt, expiresAt.
- Post: id, title, content, mediaUrl, type (image/video), date.

## Design Rules
- Palette: Red (#E11D48), White (#FFFFFF), Black (#000000).
- Style: Professional, clean, high contrast, serif-titles for a "traditional yet modern club" look.