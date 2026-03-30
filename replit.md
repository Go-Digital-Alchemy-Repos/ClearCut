# Forestry Boss - Forestry Mulching & Land Clearing

## Overview
Forestry Boss is a full-stack web application for a professional forestry mulching and land clearing business. It targets the Charlotte, North Carolina area and features a comprehensive administrative portal. The application aims to streamline lead management, content creation, and site branding, all while focusing on SEO-driven content and a problem/solution messaging style focused on forestry mulching benefits. Key capabilities include CRM lead management, a blog CMS, site-wide branding customization, and a comprehensive CMS with advanced page-building features. The project's ambition is to provide a robust online presence to support business growth and efficient operations.

## User Preferences
- Brand color: Earth tones / warm brown (configurable)
- Target area: Charlotte, NC & surrounding counties (50mi radius)
- Modern, beautiful, engaging design
- SEO-driven content with local keywords
- Multi-step quote form for lead capture
- Admin CRM for managing leads
- Full blog CMS with markdown editor
- Site-wide branding customization
- Content style: Problem/solution approach (forestry mulching focus)

## System Architecture
The application is built with a React + Vite frontend, a Node/Express backend, and a PostgreSQL database.

**UI/UX Decisions:**
- **Frontend Framework**: React with Vite for fast development and TypeScript for type safety.
- **Styling**: Tailwind CSS for utility-first styling and Shadcn UI for pre-built, accessible components.
- **Branding System**: Site-wide branding is configurable via `site_settings` table, allowing dynamic updates to company name, contact info, logo, primary/secondary colors (HSL format for Tailwind compatibility), and font family. These settings are applied across the site and in the admin branding page with a live preview.
- **Color Scheme**: Earth tones are used throughout, featuring warm browns and sage greens. Light and dark modes are implemented with complementary palettes. Extended design tokens include `--surface`, `--surface-2`, `--container-max`, `--grad-primary`, and radius scale (`--radius-sm/md/lg`).
- **Premium Components**: Reusable layout components in `client/src/components/premium.tsx` (Section, SectionHeaderPro, ImageFloat, TrustRow) compose Shadcn primitives non-destructively for consistent visual hierarchy across marketing pages.
- **SEO Approach**: Each page utilizes unique titles and meta descriptions, incorporates regional keywords (Charlotte, NC), and features problem/solution messaging. A dynamic sitemap, robots.txt, JSON-LD structured data, and canonical URL support are included.

**Technical Implementations:**
- **Authentication & Authorization**: Passport.js with LocalStrategy handles admin login. Role-Based Access Control (RBAC) is implemented with four roles (super_admin, admin, editor, sales), enforced by server-side middleware and frontend helpers.
- **Database**: PostgreSQL managed by Drizzle ORM.
- **API Endpoints**: Categorized into public, authentication, admin, and user management. Admin routes are protected by role-based middleware.
- **Caching**: Public endpoints leverage in-memory caching with ETag headers and Cache-Control for performance and bandwidth optimization. Cache invalidation is triggered by relevant admin mutations.
- **Content Management**: A full CMS supports blog posts with markdown editing, and includes features for media management, page revisions, and URL redirects.
- **CRM**: Manages leads with detailed tracking, notes, activity timelines, and an export function. Projects allow converting completed leads into portfolio galleries with before/after images. Testimonials manage customer reviews with star ratings for CMS blocks.
- **Dynamic CMS Blocks**: `project_gallery` and `testimonials_slider` blocks fetch published data from the API at render time, enabling drag-and-drop placement on any CMS page.
- **Services**: Six core services are defined, each with dedicated SEO-optimized pages.
- **City Landing Pages**: 12 city-specific landing pages at `/areas/:city-slug` for local SEO. Each page has unique content per city, covers all 6 services with city-specific blurbs, includes FAQs, project examples, and full JSON-LD structured data. Pages are linked from home page service area badges only (not in main nav). Cities: Charlotte, Huntersville, Concord, Matthews, Mint Hill, Fort Mill, Belmont, Waxhaw, Indian Trail, Monroe, Lake Norman, Mooresville. Data defined in `client/src/lib/service-areas.ts`.
- **Pricing Model**: Four tiers: Hourly, Half-Day, Full-Day, and By the Acre.

**System Design Choices:**
- **Modular Structure**: The project is organized into `client/`, `server/`, and `shared/` directories for clear separation of concerns.
- **Data Schemas**: Detailed Drizzle schemas for `users`, `admin_users`, `leads`, `blog_posts`, `site_settings`, `crm_projects`, `cms_testimonials`, and `docs_entries`.
- **Docs Governance**: Database-backed documentation system with 14 standardized categories, CRUD API, markdown editor with preview, quality validator, and `docsLogger` utility for programmatic doc creation. Docs are seeded from `server/docs-data.ts` on startup and stored in `docs_entries` table.
- **Admin Layout**: A role-aware sidebar navigation and authentication guards enhance the admin experience.

## External Dependencies
- **PostgreSQL**: Primary database for all application data.
- **Neon**: Provides a serverless PostgreSQL database service.
- **Drizzle ORM**: Object-Relational Mapper for interacting with PostgreSQL.
- **Passport.js**: Authentication middleware for Node.js.
- **bcrypt**: Library for hashing passwords.
- **TanStack Query**: For data fetching, caching, and synchronization in the frontend.
- **Wouter**: A small, fast, and modern router for React.
- **Tailwind CSS**: Utility-first CSS framework.
- **Shadcn UI**: Reusable UI components.