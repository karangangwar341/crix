# CRIX Architecture Documentation: Enterprise Sports E-Commerce Platform

This document outlines the architecture, data models, security boundaries, storage integration, and operational workflows for the **CRIX Cricket & Sport Accessories Platform**.

---

## 1. High-Level System Architecture

```
                               ┌──────────────────────────────────────────────┐
                               │           Next.js 16 (App Router)            │
                               │  - Storefront Pages (SSR / Suspense / ISR)   │
                               │  - Protected Admin Panels (/admin)           │
                               │  - Customer Portal (/account, /login)        │
                               │  - Server Actions & Upload API Endpoints     │
                               └──────────────┬────────────────┬──────────────┘
                                              │                │
                                              ▼                ▼
         ┌─────────────────────────────────────────┐      ┌─────────────────────────────────────────┐
         │       Neon Serverless PostgreSQL        │      │    Neon Object Storage (AWS S3 Engine)  │
         │             (Prisma ORM)                │      │          (@aws-sdk/client-s3)           │
         ├─────────────────────────────────────────┤      ├─────────────────────────────────────────┤
         │ • Admin Users & Activity Audit Logs     │      │ • Equipment Angle Photography           │
         │ • Products, Bat Specifications, Variants│      │ • Media Library Digital Assets          │
         │ • Categories & Brand Story Content      │      │ • CMS Promotional Banners & Hero Assets │
         │ • CMS Homepage Sections & FAQs          │      │ • Customer Invoices & Attachments       │
         │ • CRM Customers, Passwords & Profiles   │      │ (Graceful dev fallback to local disk)   │
         │ • Orders, Order Items & Decrement Logic │      └─────────────────────────────────────────┘
         │ • Wholesale & B2B Enquiries Pipeline    │
         │ • Real-time Event Tracking (Analytics)  │
         └─────────────────────────────────────────┘
```

---

## 2. Authentication, Authorization & Route Security

### Dual-Role Security Model
The system uses NextAuth.js configured with a dual-role credential authentication mechanism in `src/lib/auth.ts`:

1. **Administrative Access (`role: "admin"`)**:
   - Authenticated against `prisma.adminUser` using bcrypt hash comparison or validated master administrative credentials.
   - Required for all back-office routes (`/admin/*`) and admin server actions (`src/app/actions/admin.ts`).
   - Enforced by `requireAdminSession()` in `src/lib/admin-guard.ts`.
2. **Customer Membership Access (`role: "customer"`)**:
   - Authenticated against `prisma.customer` with optional encrypted `passwordHash`.
   - Supports guest checkouts (upserted without password) and registered member accounts with full self-service dashboards (`/account`).
   - Enforced by `requireCustomerSession()` in `src/lib/admin-guard.ts`.

### Middleware Boundaries (`src/middleware.ts`)
- `/admin/*` (except `/admin/login`) strictly rejects tokens where `token.role !== "admin"` and redirects to `/admin/login?callbackUrl=...`.
- `/account/*` strictly requires authenticated sessions (`!token`) and redirects to `/login?callbackUrl=...`.
- Server actions are protected with runtime session guards to prevent unauthenticated direct POST requests.
- File upload endpoint `/api/upload` verifies active administrator session cookies before processing incoming multipart forms.

---

## 3. Data Access Layer (DAL) Architecture (`src/lib/dal/index.ts`)

To avoid direct coupling between UI components and raw Prisma queries, all data operations flow through a centralized Data Access Layer:

- **Product Queries**: `getProducts()`, `getProductsByCategory()`, `getProductBySlug()`, `getProductById()`, `getRelatedProducts()`, `getFeaturedProducts()`, `getBestsellerProducts()`, `getNewProducts()`, `searchProducts()`.
- **Category & CMS Queries**: `getCategories()`, `getCategoryById()`, `getHomepageContent()`, `getCmsSection()`, `getFaqs()`, `getSiteSettings()`.
- **Admin CRM Queries**: `getAdminProducts()`, `getAdminOrders()`, `getAdminCustomers()`, `getAdminEnquiries()`, `getAdminDashboardStats()`, `getAdminMedia()`.
- **Type Transformers**: Robust mappers parse JSON bat specifications (willow grade, sweet spot, profile, handle shape, edge thickness), format colorways, and map variant pricing.

---

## 4. End-to-End Commerce Lifecycle

### 1. Catalog Browsing & Filter State Sync
- Category listing pages (`/bats`, `/batting-gloves`, `/helmets`, etc.) query Prisma in Server Components.
- Advanced filtering (`BatsFilterGrid.tsx`) synchronizes willow grade, profile, sweet spot, pickup, handle type, and price range directly with URL search parameters (e.g. `?grade=1&style=Power`), enabling shareable and bookmarkable catalog states.

### 2. Multi-Method Checkout & Order Placement
- Shopping bag managed via Zustand client store with persistent local storage.
- Auto-populates recipient details if the customer is logged in.
- Supports multiple payment channels:
  - 256-bit SSL encrypted card authorization (Visa, Mastercard, Amex).
  - Direct BACS Bank Wire settlement for high-value bespoke bats.
  - Express Digital Wallet authorization (Apple / Google Pay).
- Server Action `placeOrder` (`src/app/actions/storefront.ts`):
  1. Upserts customer record in `prisma.customer` (increments total spent and order volume).
  2. Creates immutable `Order` record with individual `OrderItem` lines and assigned tracking ID (`CRIX-XXXXX`).
  3. Safely decrements product inventory stock in `prisma.product`.
  4. Emits real-time `purchase` event to `prisma.analyticsEvent`.
  5. Revalidates admin and customer dashboards.

### 3. Customer Self-Service Portal (`/account`)
- Real-time order tracking with status badges (Pending, Processing, Delivered, Cancelled).
- Itemized order receipts with unit costs and delivery addresses.
- Default shipping address management.
- Wishlist quick access and profile security.

---

## 5. Real-Time Telemetry & Analytics Pipeline

- **Client Tracking Beacon (`src/components/analytics/AnalyticsTracker.tsx`)**:
  - Automatically captures route transitions (`page_view`), equipment impressions (`product_view`), cart interactions, and checkouts.
  - Sends non-blocking beacons to `/api/analytics` without impacting client render latency.
- **Admin Analytics Dashboard (`/admin/analytics`)**:
  - Aggregates live database events grouped by event type, conversion funnel progression, popular equipment views, and traffic sources.

---

## 6. Neon Object Storage (AWS S3-Compatible) Integration

- **SDK Implementation (`src/lib/storage.ts`)**:
  - Leverages `@aws-sdk/client-s3` targeting Neon's S3-compatible object storage infrastructure.
  - Generates unique file paths, handles MIME-type verification, and returns permanent public asset URLs.
  - Includes transparent fallback to local disk (`public/uploads`) during offline development.

---

## 7. SEO, Discovery & Infrastructure

- **Structured Data (`src/components/seo/JsonLd.tsx`)**:
  - Implements Schema.org `Product`, `Offer`, and `Organization` JSON-LD schemas on all product detail routes.
- **Search Engine Discovery**:
  - Dynamic `sitemap.ts` indexes all categories, static brand pages, and live equipment slugs.
  - `robots.ts` protects back-office administrative portals (`/admin`) and API routes from crawler exposure.
- **Resilience & Error Handling**:
  - Branded `loading.tsx` skeleton for smooth client transitions.
  - Root `error.tsx` boundary with retry recovery.
  - `global-error.tsx` HTML crash recovery boundary.
  - Production security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) and asset optimization configured in `next.config.ts`.
