import { storage } from "./storage";

export interface DocsEntry {
  category: string;
  title: string;
  bodyMarkdown: string;
  updatedAt: string;
  tags: string[];
}

export function getDocsEntries(): DocsEntry[] {
  const now = "2026-02-06";

  return [
    {
      category: "CMS",
      title: "Page Builder Overview",
      bodyMarkdown: `The CMS Page Builder is a three-panel drag-and-drop editor for building custom pages.

**Panels:**
- **Left**: Block library sidebar with search and categorized blocks
- **Center**: Sortable canvas with device preview (Desktop/Tablet/Mobile)
- **Right**: Inspector with Block properties, SEO, and Content Checklist tabs

**Block Types (12 system blocks):**
| Block | Key | Description |
|-------|-----|-------------|
| Hero | \`hero\` | Full-width hero with headline, subheadline, background image, CTA |
| Rich Text | \`rich_text\` | Free-form text content block |
| Image Banner | \`image_banner\` | Full-width image with optional overlay text |
| Feature Grid | \`feature_grid\` | 3-column feature cards with heading/description |
| Service Cards | \`service_cards\` | Linked service cards grid |
| Testimonials | \`testimonial_row\` | 3-column testimonial cards |
| CTA Band | \`cta_band\` | Full-width call-to-action with button |
| FAQ | \`faq\` | Collapsible question/answer list |
| Pricing Table | \`pricing_table\` | Tiered pricing cards |
| Contact CTA | \`contact_cta\` | Contact info with CTA button |
| Project Gallery | \`project_gallery\` | Dynamic: published CRM projects with before/after images |
| Testimonials Slider | \`testimonials_slider\` | Dynamic: published testimonials with star ratings |

**Block Instance Format:**
\`\`\`json
{
  "id": "uuid",
  "type": "hero",
  "props": { "headline": "...", "subheadline": "..." },
  "style": {},
  "meta": { "label": "My Hero", "hidden": false }
}
\`\`\`

**API Endpoints:**
- \`GET /api/admin/cms/pages\` - List pages (filters: status, pageType, search)
- \`POST /api/admin/cms/pages\` - Create page
- \`GET /api/admin/cms/pages/:id\` - Get page by ID
- \`PATCH /api/admin/cms/pages/:id\` - Update page
- \`DELETE /api/admin/cms/pages/:id\` - Delete page
- \`GET /api/public/pages/:slug\` - Get published page by slug`,
      updatedAt: now,
      tags: ["pages", "blocks", "builder", "drag-and-drop"],
    },
    {
      category: "CMS",
      title: "Builder UX Enhancements",
      bodyMarkdown: `The page builder includes several UX enhancements for better content editing.

**Device Preview Switcher:**
The toolbar includes Desktop (1280px), Tablet (768px), and Mobile (375px) width presets. The canvas viewport adjusts width accordingly to preview responsive layouts.

**Inline Editing:**
Common block fields can be edited directly in the canvas without opening the inspector:
- \`hero\`: headline, subheadline
- \`cta_band\`: heading, buttonText
- \`rich_text\`: content

Inline edits update the block state and persist when you click Save.

**Save Status Indicator:**
Shows real-time status in the toolbar:
- "Unsaved changes" (amber) when edits differ from last save
- "Saved" (green check) when current state matches last save
- "Saving..." during save operations

**Block Validation:**
Click the shield icon to run validation checks:
- Required fields present (based on block schema)
- Image blocks must have \`imageUrl\` and \`imageAlt\`
- Link fields must be valid paths (\`/\`), URLs (\`http\`), or \`mailto:\`/\`tel:\` protocols
- Warnings are non-blocking and shown in the Checklist panel

**Content Checklist Panel (right side):**
The "Check" tab shows SEO and accessibility status:
- Page title presence and length
- SEO title length (30-60 chars recommended)
- Meta description length (50-160 chars recommended)
- OG image presence for social sharing
- H1/headline presence
- Internal CTA to /quote
- Alt text coverage on image blocks
- Link format validation`,
      updatedAt: now,
      tags: ["builder", "inline-editing", "validation", "checklist", "UX"],
    },
    {
      category: "CMS",
      title: "Preview Tokens (Draft Preview)",
      bodyMarkdown: `Draft pages can be previewed using secure, time-limited preview tokens.

**How it works:**
1. Admin clicks the "Preview" button (eye icon) in the page builder toolbar
2. Backend generates a random 32-byte hex token stored in memory
3. Token is associated with the page ID and expires in 15 minutes
4. Browser opens \`/p/:slug?previewToken=TOKEN\` in a new tab
5. Public renderer fetches the page with the token parameter
6. If token is valid and not expired, draft content is returned
7. A yellow "Draft Preview" banner is shown at the top of the page

**API Endpoint:**
\`\`\`
POST /api/admin/cms/pages/:id/preview-token
Auth: Required (admin)
Response: { token: string, slug: string, expiresIn: 900 }
\`\`\`

**Modified Public Endpoint:**
\`\`\`
GET /api/public/pages/:slug?previewToken=TOKEN
- If page is published: returns page (no token needed)
- If page is draft + valid token: returns page with _preview: true
- If page is draft + no/invalid token: returns 404
\`\`\`

**Token Expiration:**
- Tokens expire after 15 minutes
- Expired tokens are cleaned up every 60 seconds
- Each preview request generates a new token
- Tokens are stored in server memory (cleared on restart)`,
      updatedAt: now,
      tags: ["preview", "draft", "tokens", "API"],
    },
    {
      category: "CMS",
      title: "Templates & Block Library",
      bodyMarkdown: `**Templates:**
Reusable page templates storing pre-configured block arrays.

- \`GET /api/admin/cms/templates\` - List templates
- \`POST /api/admin/cms/templates\` - Create template (name, description, blocks)
- \`PATCH /api/admin/cms/templates/:id\` - Update template
- \`DELETE /api/admin/cms/templates/:id\` - Delete template

**Block Library:**
System and custom block definitions with schemas.

- \`GET /api/admin/cms/blocks\` - List all block definitions
- \`POST /api/admin/cms/blocks\` - Create custom block

Each block definition includes:
- \`key\` (unique identifier), \`name\`, \`category\`, \`icon\`
- \`schema\` (JSON): field definitions with types (text, textarea, select, array)
- \`defaultProps\` (JSON): default values for new instances
- \`isSystem\`: true for built-in blocks (cannot be deleted)`,
      updatedAt: now,
      tags: ["templates", "blocks", "library"],
    },
    {
      category: "CMS",
      title: "Media Library & Themes",
      bodyMarkdown: `**Media Library:**
Stores external image URLs with metadata for reuse across CMS pages.

- \`GET /api/admin/cms/media\` - List media (search filter)
- \`POST /api/admin/cms/media\` - Add media item (url, alt, title, mimeType, sizeBytes)
- \`DELETE /api/admin/cms/media/:id\` - Remove media item

**Theme Presets:**
10 pre-built theme presets with color tokens, font, radius, shadow settings.

- \`GET /api/admin/cms/themes\` - List all theme presets
- \`POST /api/admin/cms/themes/:id/activate\` - Activate a preset
- \`GET /api/public/theme\` - Get active theme (public)

Active by default: "Earth Pro" (warm browns, sage greens).`,
      updatedAt: now,
      tags: ["media", "images", "themes", "presets"],
    },
    {
      category: "Security",
      title: "Preview Token Security Model",
      bodyMarkdown: `Preview tokens provide secure, time-limited access to unpublished CMS pages.

**Security Properties:**
- Tokens are 32-byte cryptographically random hex strings (64 chars)
- Stored server-side in memory (Map<token, {pageId, expiresAt}>)
- Each token is scoped to a specific page ID
- Tokens expire after exactly 15 minutes (900 seconds)
- Expired tokens cannot be reused
- Tokens are cleaned up every 60 seconds automatically

**Access Control:**
- Only authenticated admins can generate preview tokens
- Preview tokens do NOT grant access to admin APIs
- Tokens only allow reading the specific draft page they were created for
- Published pages are always accessible without tokens

**Threat Mitigations:**
- Token theft: Limited 15-minute window reduces exposure
- Replay attacks: Tokens are single-page scoped
- Server restart: All tokens are invalidated (memory-only)
- Token enumeration: 256-bit randomness makes guessing infeasible`,
      updatedAt: now,
      tags: ["security", "preview", "tokens", "authentication"],
    },
    {
      category: "Security",
      title: "Authentication & Authorization",
      bodyMarkdown: `**Authentication Method:**
Session-based authentication with Passport.js LocalStrategy.

**Admin Access:**
- Single admin user: username \`admin\`
- Password set via \`ADMIN_PASSWORD\` environment variable
- Session stored in MemoryStore with 24-hour cookie expiry
- All \`/api/admin/*\` routes (except login) protected by \`requireAdmin\` middleware

**API Endpoints:**
- \`POST /api/admin/login\` - Login with { username, password }
- \`POST /api/admin/logout\` - Logout, destroy session
- \`GET /api/admin/me\` - Check current auth status

**Rate Limiting:**
- Public lead submission: 5 requests/minute/IP
- Honeypot field for spam protection on quote form`,
      updatedAt: now,
      tags: ["auth", "passport", "session", "admin"],
    },
    {
      category: "CRM",
      title: "Lead Management",
      bodyMarkdown: `**Lead Pipeline:**
Leads flow through statuses: New -> Contacted -> Scheduled -> Won/Lost.

**API Endpoints:**
- \`GET /api/admin/leads\` - List with filters (status, county, service, search, date range, pagination)
- \`GET /api/admin/leads/stats\` - Dashboard stats (total, newThisWeek, pipeline counts)
- \`GET /api/admin/leads/export.csv\` - CSV export
- \`GET /api/admin/leads/:id\` - Single lead
- \`PATCH /api/admin/leads/:id\` - Update (status, tags, assignedTo, lastContactedAt)
- \`POST /api/admin/leads/:id/notes\` - Add note
- \`GET /api/admin/leads/:id/notes\` - List notes
- \`GET /api/admin/leads/:id/activity\` - Activity log

**Lead Sources:**
Leads are captured via the multi-step quote form at /quote (4 steps: contact info, property details, services needed, budget/timeline).`,
      updatedAt: now,
      tags: ["leads", "CRM", "pipeline", "quotes"],
    },
    {
      category: "SEO",
      title: "SEO Implementation",
      bodyMarkdown: `**Per-Page SEO:**
Each page uses the \`usePageMeta\` hook to set unique title and meta description.

**CMS Page SEO:**
The page builder includes an SEO tab with:
- SEO Title (appears in browser tab and search results)
- Meta Description (search result snippet)
- OG Title, OG Description, OG Image (social sharing)

**Best Practices Applied:**
- Unique, descriptive title tags per page
- H1 tags include service name + "Charlotte, NC"
- Regional references (Charlotte area counties and towns)
- 8 SEO-optimized blog articles with local focus
- Problem/solution messaging style

**Content Checklist:**
The builder's Checklist tab validates:
- Title length (10+ chars recommended)
- SEO title length (30-60 chars)
- Meta description length (50-160 chars)
- OG image presence
- H1/headline presence
- CTA to /quote
- Image alt text coverage`,
      updatedAt: now,
      tags: ["SEO", "meta", "OG", "checklist"],
    },
    {
      category: "Theming",
      title: "Branding & Color System",
      bodyMarkdown: `**Branding Settings:**
Managed via site_settings table (single row) and the /admin/branding page.

**Configurable Values:**
- Company name, phone, email, service area
- Logo URL
- Primary color (HSL format: "28 65% 42%")
- Secondary color (HSL format: "85 35% 38%")
- Font family (default: Inter)
- CTA button text
- Social media links (Facebook, Instagram, YouTube, Google)

**CSS Variable Injection:**
SiteSettingsProvider context loads settings and injects \`--primary\` CSS variable into \`:root\` for Tailwind compatibility.

**Applied Locations:**
- TopNav: logo, company name, CTA text
- Footer: contact info, social links, company name
- StickyQuoteButton: CTA text
- CSS variables: primary color throughout site`,
      updatedAt: now,
      tags: ["branding", "colors", "CSS", "settings"],
    },
    {
      category: "Routing",
      title: "URL Redirects",
      bodyMarkdown: `**Redirect Management:**
Admin-managed URL redirects with 301 (permanent) and 302 (temporary) support.

**API Endpoints:**
- \`GET /api/admin/cms/redirects\` - List all redirects
- \`POST /api/admin/cms/redirects\` - Create redirect (fromPath, toPath, code)
- \`DELETE /api/admin/cms/redirects/:id\` - Delete redirect

**Implementation:**
- Redirect middleware runs before API routes
- Redirects are cached in memory for performance
- Cache refreshes every 60 seconds
- Supports both absolute and relative paths`,
      updatedAt: now,
      tags: ["redirects", "routing", "301", "302"],
    },
    {
      category: "Routing",
      title: "Frontend Routes",
      bodyMarkdown: `**Public Pages:**
| Path | Description |
|------|-------------|
| \`/\` | Home page with hero, services, pricing |
| \`/services\` | Services overview |
| \`/services/:slug\` | Service detail (6 services) |
| \`/pricing\` | Pricing tiers |
| \`/blog\` | Blog listing |
| \`/blog/:slug\` | Blog post view |
| \`/quote\` | Multi-step quote form |
| \`/p/:slug\` | CMS custom pages |

**Admin Pages:**
| Path | Description |
|------|-------------|
| \`/admin\` | Dashboard with pipeline stats |
| \`/admin/leads\` | CRM leads list |
| \`/admin/leads/:id\` | Lead detail |
| \`/admin/cms\` | CMS home |
| \`/admin/cms/pages\` | CMS pages list |
| \`/admin/cms/pages/new\` | Page builder (new) |
| \`/admin/cms/pages/:id\` | Page builder (edit) |
| \`/admin/cms/templates\` | Templates |
| \`/admin/cms/blocks\` | Block library |
| \`/admin/cms/media\` | Media library |
| \`/admin/cms/themes\` | Theme presets |
| \`/admin/cms/redirects\` | URL redirects |
| \`/admin/branding\` | Branding settings |
| \`/admin/docs\` | Documentation |`,
      updatedAt: now,
      tags: ["routes", "pages", "navigation"],
    },
    {
      category: "Media",
      title: "Media Upload API",
      bodyMarkdown: `The Media Upload system supports local file uploads with metadata storage in the \`cms_media\` database table. The architecture is designed for future migration to S3/R2 without code rewrites — only the storage adapter needs to change.

**Upload Endpoint:**
\`\`\`
POST /api/admin/cms/media/upload
Content-Type: multipart/form-data
Auth: Required (admin)

Form Fields:
  file     (required) - Image file (jpeg, png, webp)
  alt      (optional) - Alt text
  title    (optional) - Display title (defaults to filename)

Response 201:
{
  "id": "uuid",
  "url": "/uploads/1706000000-abc123.jpg",
  "width": 1920,
  "height": 1080,
  "mimeType": "image/jpeg",
  "sizeBytes": 245000,
  "alt": "Forestry mulching site",
  "title": "job-site-photo",
  "tags": [],
  "createdAt": "2026-02-06T..."
}
\`\`\`

**List Media (paginated):**
\`\`\`
GET /api/admin/cms/media?search=forest&page=1&pageSize=24
Auth: Required (admin)

Response 200:
{
  "items": [ CmsMediaItem[] ],
  "total": 42
}
\`\`\`

**Update Media Metadata:**
\`\`\`
PATCH /api/admin/cms/media/:id
Auth: Required (admin)
Body: { "alt": "Updated alt", "title": "New title", "tags": ["landscape"] }

Response 200: CmsMediaItem
\`\`\`

**Delete Media:**
\`\`\`
DELETE /api/admin/cms/media/:id
Auth: Required (admin)
Response 200: { "ok": true }
\`\`\`
Deleting a media item also removes the file from disk if it is a local upload.

**Add External URL (legacy):**
\`\`\`
POST /api/admin/cms/media
Body: { "url": "https://example.com/img.jpg", "alt": "...", "title": "..." }
\`\`\`

**Storage Strategy:**
- **Current:** Local file storage in \`server/uploads/\` served via \`/uploads/\` static route
- **Future:** Swap multer disk storage for S3/R2 adapter; change URL prefix from \`/uploads/\` to bucket URL
- The \`cms_media.url\` field stores the path — all code references this URL, making the swap transparent

**Database Fields (cms_media):**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| url | text | File URL (local path or external) |
| alt | text | Alt text for accessibility |
| title | text | Display title |
| width | int | Image width in px |
| height | int | Image height in px |
| mimeType | text | MIME type (image/jpeg, etc.) |
| sizeBytes | int | File size in bytes |
| tags | jsonb | Array of string tags |
| createdAt | timestamp | Creation date |
| updatedAt | timestamp | Last update date |`,
      updatedAt: now,
      tags: ["media", "upload", "API", "storage"],
    },
    {
      category: "Media",
      title: "Media Library UI",
      bodyMarkdown: `The Media Library admin page at \`/admin/cms/media\` provides a visual interface for managing uploaded images.

**Features:**
- **Upload Button:** Opens a modal with drag-and-drop upload area
- **Drag & Drop:** Drop zone accepts multiple files; validates type and size client-side before upload
- **Grid Gallery:** Responsive grid (2-4 columns) showing image thumbnails with title and file info
- **Search:** Filters media by title and alt text
- **Pagination:** Page through results (24 items per page) with prev/next controls
- **Detail Panel:** Click any image to open a side panel with:
  - Image preview
  - Dimensions, type, and file size
  - Editable Title, Alt Text, and Tags fields
  - Save, Copy URL, and Delete buttons
- **Copy URL:** One-click copy of the full image URL to clipboard (also available on hover in grid)

**Navigation:**
Admin sidebar → CMS → Media, or directly at \`/admin/cms/media\`

**Upload Flow:**
1. Click "Upload" button in toolbar
2. Drop files or click to browse
3. Preview file list with names and sizes
4. Click "Upload N files" to start
5. Progress indicators show per-file status
6. Gallery refreshes automatically after upload`,
      updatedAt: now,
      tags: ["media", "UI", "gallery", "upload", "drag-drop"],
    },
    {
      category: "Media",
      title: "Block Media Picker Integration",
      bodyMarkdown: `Image fields in the CMS page builder block inspector include a "Choose from Media Library" button that opens a picker dialog.

**How It Works:**
1. The \`BlockPropertyEditor\` detects image fields by key name (\`imageUrl\`, \`backgroundImage\`, \`src\`, etc.) or schema type \`"image"\`
2. Image fields render with:
   - A standard URL text input
   - An image preview thumbnail (if URL is set)
   - A "Choose from Media Library" button
3. Clicking the button opens the \`MediaPickerDialog\` modal
4. The modal shows a searchable grid of uploaded media items
5. Selecting an image sets the field value to the image URL
6. If the selected media has alt text, it auto-suggests the alt text for the corresponding \`imageAlt\` field (if present and empty)

**Detected Image Field Keys:**
- \`imageUrl\` / \`image_url\`
- \`backgroundImage\`
- \`featuredImageUrl\`
- \`ogImage\`
- \`src\`

**Schema-Based Detection:**
Blocks using the schema system can set \`type: "image"\` on a field definition:
\`\`\`json
{
  "fields": [
    { "key": "imageUrl", "label": "Image", "type": "image" },
    { "key": "imageAlt", "label": "Alt Text", "type": "text" }
  ]
}
\`\`\`

**Alt Text Auto-Suggest:**
When selecting a media item, the picker attempts to auto-fill the corresponding alt text field:
- \`imageUrl\` → looks for \`imageAlt\`
- \`backgroundImage\` → looks for \`backgroundImageAlt\`
- Only auto-fills if the alt field is currently empty`,
      updatedAt: now,
      tags: ["media", "picker", "blocks", "inspector", "integration"],
    },
    {
      category: "Security",
      title: "File Upload Security Constraints",
      bodyMarkdown: `The media upload system enforces several security constraints to prevent abuse and ensure safe file handling.

**Allowed File Types:**
| MIME Type | Extension | Notes |
|-----------|-----------|-------|
| image/jpeg | .jpg, .jpeg | Most common photo format |
| image/png | .png | Supports transparency |
| image/webp | .webp | Modern, smaller file sizes |

All other file types are rejected with a 400 error.

**Maximum File Size:**
- 10 MB per file
- Enforced both server-side (multer config) and client-side (pre-validation)
- Files exceeding the limit return a 413 error

**Rate Limiting:**
- 10 uploads per minute per IP address
- Exceeding the limit returns 429 Too Many Requests
- Rate limit resets after 60 seconds

**Authentication:**
- All media endpoints require admin authentication (\`requireAdmin\` middleware)
- Unauthenticated requests receive 401
- Session-based auth via Passport.js

**File Naming:**
- Uploaded files are renamed to \`{timestamp}-{random-hex}{ext}\`
- Original filenames are stored as the media \`title\`
- This prevents path traversal and filename collision attacks

**Static File Serving:**
- \`/uploads/\` route only accepts GET requests (other methods return 405)
- Files served with 7-day cache headers
- No directory listing is exposed

**Deletion:**
- Deleting a media record also removes the physical file from disk
- File deletion is fire-and-forget (non-blocking)
- Only local uploads (URLs starting with \`/uploads/\`) trigger file deletion`,
      updatedAt: now,
      tags: ["security", "upload", "validation", "rate-limiting"],
    },
    {
      category: "CMS",
      title: "Page Revisions & Rollback",
      bodyMarkdown: `Page versioning lets admins create, view, and restore revision snapshots of CMS pages.

**Database Table:** \`cms_page_revisions\`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | Revision identifier |
| pageId | UUID FK | References cms_pages.id |
| createdAt | timestamp | When the revision was saved |
| createdBy | text | Who created the revision (default: "admin") |
| message | text | Optional note (e.g. "Updated hero + SEO") |
| snapshot | JSONB | Full page snapshot (title, slug, blocks, seo, status, templateId, pageType, description) |

**API Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| GET | \`/api/admin/cms/pages/:id/revisions\` | List all revisions for a page (newest first) |
| POST | \`/api/admin/cms/pages/:id/revisions\` | Create a revision snapshot of current page state |
| POST | \`/api/admin/cms/pages/:id/revisions/:revId/restore\` | Restore page content from a revision |

**Create Revision Request:**
\`\`\`json
{
  "message": "Updated hero section",
  "createdBy": "admin"
}
\`\`\`
Both fields are optional. The snapshot is built automatically from the current page state.

**Restore Behavior:**
- Replaces page title, slug, description, blocks, SEO, templateId, and status with the revision snapshot
- The page \`updatedAt\` is refreshed to the current time
- Published state is restored as-is from the snapshot (if the snapshot had status "draft", the page becomes draft again)
- No new revision is auto-created on restore — admin can manually save one before restoring

**Auto-Revision on Publish:**
When a page status changes from draft to published via the PATCH endpoint, a revision is automatically saved with the message "Auto-saved before publish".

**Retention Policy:**
- Maximum 50 revisions per page
- After creating a new revision, the system prunes (deletes) the oldest revisions beyond the limit
- Pruning happens in the POST /revisions endpoint and in the auto-save on publish flow

**UI Integration:**
The page builder's right panel includes a "Revisions" tab (history icon) that shows:
- Revision count badge
- "Save Revision" button with optional message input
- Chronological list of revisions with date, message, status, block count, and slug
- Restore button on each revision with a confirmation dialog
- Restore replaces all page fields in the editor immediately`,
      updatedAt: now,
      tags: ["cms", "revisions", "versioning", "rollback", "history"],
    },
    {
      category: "Security",
      title: "Revision Data Sensitivity",
      bodyMarkdown: `This document describes the data stored in CMS page revision snapshots and security considerations.

**What Is Stored:**
Each revision snapshot is a JSONB object containing:
- \`title\` — Page title (string)
- \`slug\` — URL slug (string)
- \`description\` — Page description (string, nullable)
- \`status\` — Draft or published state (string)
- \`pageType\` — Page type classification (string)
- \`templateId\` — Template UUID reference (string, nullable)
- \`blocks\` — Array of block instances with all property values
- \`seo\` — SEO metadata object (title, metaDescription, og tags)

**Data Sensitivity:**
- Block content may include user-generated text, image URLs, link targets, and inline styles
- SEO data may contain marketing copy and social media metadata
- No authentication credentials, passwords, or API keys are stored in snapshots
- Image URLs in blocks reference media library assets or external URLs — no binary data is stored

**Access Control:**
- All revision endpoints require admin authentication (requireAdmin middleware)
- Revisions are scoped to a page via pageId — cross-page access is prevented
- The restore endpoint validates that the revision belongs to the target page before applying

**Retention:**
- Revisions are automatically pruned to keep the last 50 per page
- Deleted revisions are permanently removed (no soft delete)
- When a page is deleted, all its revisions are cascade-deleted via the pageId relationship

**No PII Stored:**
Revision snapshots contain only CMS content data. They do not store:
- User session tokens or cookies
- Admin passwords or credentials
- Visitor analytics or tracking data
- Customer/lead personal information`,
      updatedAt: now,
      tags: ["security", "revisions", "data-privacy", "access-control"],
    },
    {
      category: "SEO",
      title: "Sitemap & Robots",
      bodyMarkdown: `The application generates a dynamic \`sitemap.xml\` and static \`robots.txt\` at their standard URL paths.

**Sitemap (\`GET /sitemap.xml\`):**
- Automatically includes all static routes (homepage, services, pricing, quote, blog listing)
- Includes all published CMS pages with \`lastmod\` from \`updatedAt\`
- Includes all published blog posts with \`lastmod\` from \`updatedAt\` or \`publishedAt\`
- Respects URL redirects: if a page slug has a redirect entry, the sitemap uses the final destination URL as the \`<loc>\`
- Redirect chains are resolved (A→B→C becomes C)
- CMS pages can customize \`priority\` and \`changefreq\` via the \`seo.sitemap\` field

**Static Route Priorities:**
| Route | Priority | Changefreq |
|-------|----------|------------|
| / | 1.0 | weekly |
| /services | 0.8 | monthly |
| /services/* | 0.7-0.8 | monthly |
| /pricing | 0.7 | monthly |
| /quote | 0.8 | monthly |
| /blog | 0.7 | daily |
| CMS pages | 0.6 (default) | monthly |
| Blog posts | 0.6 | weekly |

**Robots.txt (\`GET /robots.txt\`):**
\`\`\`
User-agent: *
Allow: /

Disallow: /admin/
Disallow: /api/

Sitemap: https://yourdomain.com/sitemap.xml
\`\`\`

**Base URL:**
The sitemap and robots.txt use the \`PUBLIC_SITE_URL\` environment variable for absolute URLs. Falls back to the request \`Host\` header if not set.

**Excluded from Sitemap:**
- Draft CMS pages
- Draft blog posts
- Admin routes (/admin/*)
- API routes (/api/*)`,
      updatedAt: now,
      tags: ["seo", "sitemap", "robots", "crawling", "indexing"],
    },
    {
      category: "SEO",
      title: "SEO Metadata Injection Rules",
      bodyMarkdown: `The frontend \`usePageMeta\` hook injects SEO metadata into the document head for each page.

**Injected Tags:**
- \`<title>\` — Page title
- \`<meta name="description">\` — Meta description
- \`<link rel="canonical">\` — Canonical URL (if provided)
- \`<meta property="og:title">\` — Open Graph title (falls back to page title)
- \`<meta property="og:description">\` — OG description (falls back to meta description)
- \`<meta property="og:image">\` — OG image URL
- \`<meta property="og:type">\` — Always "website"
- \`<script type="application/ld+json">\` — JSON-LD structured data (if configured)

**OG Image Fallback Chain:**
1. Explicit \`ogImage\` field from page SEO settings
2. Hero block's \`imageUrl\` property (if page has a hero block)
3. Site default (from site settings, if configured)
4. Empty (no OG image tag injected)

**Canonical URL Rules:**
- If \`canonicalUrl\` is explicitly set in page SEO, that value is used
- If not set, canonical is auto-generated from the page slug
- If the page slug has a redirect entry, the canonical should point to the final destination URL
- Canonical URLs prevent duplicate content penalties from search engines

**Page Builder SEO Tab:**
The SEO tab in \`/admin/cms/pages/:id\` provides:
- SEO Title with character counter (ideal: 30-60 chars)
- Meta Description with character counter (ideal: 50-160 chars)
- Canonical URL field (auto-generates if empty)
- OG Title, Description, and Image fields
- JSON-LD structured data preset picker
- "Validate SEO" button that checks all fields for completeness

**SEO Validation Checks:**
| Field | Pass | Warn | Fail |
|-------|------|------|------|
| SEO Title | 30-60 chars | Set but outside range | Missing |
| Meta Description | 50-160 chars | Set but outside range | Missing |
| Canonical URL | Valid URL or path | Not set (auto-generates) | — |
| OG Image | Explicitly set | Falls back to hero image | Missing entirely |
| OG Title | Explicitly set | Falls back to SEO/page title | Missing all |
| OG Description | Explicitly set | Falls back to meta desc | Missing all |
| Robots | Published page | Draft page | — |
| JSON-LD | Valid preset active | No preset selected | Invalid JSON |`,
      updatedAt: now,
      tags: ["seo", "metadata", "og-tags", "canonical", "validation"],
    },
    {
      category: "SEO",
      title: "JSON-LD Presets",
      bodyMarkdown: `The page builder SEO tab includes a JSON-LD structured data preset picker for common schema.org types.

**Available Presets:**

**1. LocalBusiness**
Ideal for the homepage or location-specific landing pages.
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Brush Boss",
  "description": "...",
  "url": "/",
  "telephone": "",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Charlotte",
    "addressRegion": "NC"
  },
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": { "latitude": 35.2271, "longitude": -80.8431 },
    "geoRadius": "80467"
  }
}
\`\`\`

**2. Service**
For individual service pages (forestry mulching, trail cutting, etc.).
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Forestry Mulching",
  "description": "...",
  "provider": { "@type": "LocalBusiness", "name": "Brush Boss" },
  "areaServed": { "@type": "City", "name": "Charlotte, NC" }
}
\`\`\`

**3. FAQPage**
Auto-populates from FAQ blocks on the page. Each question/answer pair becomes a schema.org Question entity.

**4. Article**
For blog-style content pages.
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "description": "...",
  "author": { "@type": "Organization", "name": "Brush Boss" }
}
\`\`\`

**Workflow:**
1. Select a preset from the dropdown
2. The JSON is auto-generated using current page data (title, description, slug)
3. Edit the generated JSON as needed
4. Use "Validate" to check JSON syntax
5. Use "Regenerate" to recreate from current page data
6. Save the page — JSON-LD is stored in \`seo.schema\`

**Frontend Injection:**
When a page with JSON-LD is rendered, the \`usePageMeta\` hook injects a \`<script type="application/ld+json">\` tag into the document head. The tag is cleaned up when navigating away from the page.`,
      updatedAt: now,
      tags: ["seo", "json-ld", "structured-data", "schema-org", "presets"],
    },
    {
      category: "Integrations",
      title: "PUBLIC_SITE_URL and Deployment Requirements",
      bodyMarkdown: `The \`PUBLIC_SITE_URL\` environment variable defines the canonical base URL for the deployed site.

**Purpose:**
- Used by \`/sitemap.xml\` to generate absolute \`<loc>\` URLs
- Used by \`/robots.txt\` to generate the \`Sitemap:\` directive
- Should match the production domain where the site is publicly accessible

**Format:**
\`\`\`
PUBLIC_SITE_URL=https://forestryboss.com
\`\`\`
- Must include the protocol (\`https://\`)
- Must NOT include a trailing slash
- Should be the bare domain without path

**Fallback Behavior:**
If \`PUBLIC_SITE_URL\` is not set, the application falls back to using the \`Host\` header from the incoming request prefixed with \`https://\`. This works for development but is unreliable for production (may use internal hostnames or load balancer addresses).

**Setting the Variable:**
1. Go to the Secrets panel in the Replit project
2. Add \`PUBLIC_SITE_URL\` with your production domain
3. The sitemap and robots.txt will immediately use the new value

**When to Set:**
- Before deploying to production
- When setting up a custom domain
- When submitting the sitemap to Google Search Console

**Impact on SEO:**
- Google requires absolute URLs in sitemaps
- Incorrect base URL will cause indexing issues
- The robots.txt Sitemap directive must point to the correct domain`,
      updatedAt: now,
      tags: ["deployment", "environment", "domain", "configuration"],
    },

    {
      category: "CRM",
      title: "Projects (Portfolio Gallery)",
      bodyMarkdown: `Projects convert completed CRM leads into public portfolio entries with before/after images.

**Admin Routes (super_admin, admin, sales):**
| Method | Path | Description |
|--------|------|-------------|
| GET | \`/api/admin/projects\` | List all projects |
| GET | \`/api/admin/projects/:id\` | Get single project |
| POST | \`/api/admin/projects\` | Create project |
| POST | \`/api/admin/projects/from-lead/:leadId\` | Create from lead |
| PATCH | \`/api/admin/projects/:id\` | Update project |
| DELETE | \`/api/admin/projects/:id\` | Delete project |

**Public Route:** \`GET /api/public/projects\` (cached, ETag support)

**Schema:**
\`\`\`json
{
  "id": "uuid",
  "leadId": 123,
  "title": "Smith Lot Clearing",
  "location": "Huntersville, NC",
  "beforeAfter": [{ "url": "/uploads/before.jpg", "label": "Before" }],
  "summary": "Cleared 2 acres of overgrowth...",
  "services": ["Forestry Mulching", "Trail Cutting"],
  "publish": true
}
\`\`\`

**Create from Lead:** \`POST /api/admin/projects/from-lead/:leadId\` auto-populates title, location, services, and summary from the lead's data.

**CMS Integration:** Add a \`project_gallery\` block to any CMS page to display published projects. The block fetches data from \`/api/public/projects\` at render time.`,
      updatedAt: now,
      tags: ["crm", "projects", "portfolio", "gallery", "lead-conversion"],
    },

    {
      category: "CRM",
      title: "Testimonials",
      bodyMarkdown: `Testimonials manage customer reviews for display on the public site via CMS blocks.

**Admin Routes (super_admin, admin, editor):**
| Method | Path | Description |
|--------|------|-------------|
| GET | \`/api/admin/testimonials\` | List all testimonials |
| GET | \`/api/admin/testimonials/:id\` | Get single testimonial |
| POST | \`/api/admin/testimonials\` | Create testimonial |
| PATCH | \`/api/admin/testimonials/:id\` | Update testimonial |
| DELETE | \`/api/admin/testimonials/:id\` | Delete testimonial |

**Public Route:** \`GET /api/public/testimonials\` (cached, ETag support)

**Schema:**
\`\`\`json
{
  "id": "uuid",
  "name": "John Smith",
  "area": "Huntersville, NC",
  "quote": "They did an amazing job clearing our lot...",
  "rating": 5,
  "publish": true
}
\`\`\`

**Star Rating:** 1-5 integer, nullable (null = no rating shown).

**CMS Integration:** Add a \`testimonials_slider\` block to any CMS page to display published testimonials with star ratings. The block fetches data from \`/api/public/testimonials\` at render time.`,
      updatedAt: now,
      tags: ["crm", "testimonials", "reviews", "cms-block"],
    },
    {
      category: "Architecture",
      title: "Docs Governance System",
      bodyMarkdown: `# Docs Governance System

## Overview
The Docs Governance System ensures all internal documentation follows a consistent structure, is searchable, categorized, and version-aware. It replaces the previous in-memory docs system with a database-backed solution that supports CRUD operations, quality validation, and programmatic documentation creation.

## Architecture
Documentation entries are stored in the \`docs_entries\` PostgreSQL table. The system consists of:
- **Database layer**: Drizzle ORM schema and storage methods for CRUD
- **API layer**: RESTful admin endpoints for managing entries
- **Seeder**: Migrates legacy in-memory docs into the database at startup
- **DocsLogger**: Server-side utility for programmatic doc creation
- **Validator**: API endpoint and UI tool for checking doc quality
- **Admin UI**: Full editor with markdown preview, metadata fields, and quality checker

## Database
**Table: docs_entries**
| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | Entry identifier |
| category | text | One of 14 standard categories |
| title | text | Document title |
| slug | text (unique) | URL-friendly identifier |
| body_markdown | text | Full markdown content |
| tags | text[] | Searchable tags array |
| related | text[] | Slugs of related doc entries |
| version | text | Version string (default "1.0") |
| author | text | Author name (default "system") |
| created_at | timestamp | Creation time |
| updated_at | timestamp | Last update time |

## APIs
\`\`\`
GET /api/admin/docs
  Query: ?category=CMS&search=builder
  Response: { categories: string[], entries: DocsEntry[] }

GET /api/admin/docs/:id
  Response: DocsEntry

POST /api/admin/docs
  Body: InsertDocsEntry
  Response 201: DocsEntry

PATCH /api/admin/docs/:id
  Body: Partial<InsertDocsEntry>
  Response: DocsEntry

DELETE /api/admin/docs/:id
  Response: { ok: true }

GET /api/admin/docs/validate/all
  Response: { total, issueCount, issues: [{ id, title, problems }] }
\`\`\`

## Frontend Integration
The Admin Docs page at \`/admin/docs\` provides:
- Category sidebar with counts and expand/collapse
- Full-text search across titles, tags, and body content
- Markdown editor with live preview for creating/editing entries
- Metadata fields: category, tags, related docs, version, author
- Quality validation report showing missing sections and issues

## Security Considerations
- All docs endpoints require admin authentication via \`requireAdmin\` middleware
- Slug uniqueness is enforced at both API and database levels
- Input validation uses Zod schemas from \`drizzle-zod\`

## Operational Notes
- Existing in-memory docs are migrated to DB on first startup via the seed function
- The seed is idempotent — entries are matched by slug to avoid duplicates
- The DocsLogger utility (\`server/utils/docsLogger.ts\`) allows future features to auto-document themselves

## Related Docs
- How Documentation Works in This App`,
      updatedAt: now,
      tags: ["architecture", "docs", "governance", "system"],
    },
    {
      category: "Getting Started",
      title: "How Documentation Works in This App",
      bodyMarkdown: `# How Documentation Works in This App

## Overview
This application includes a built-in documentation library accessible from the Admin panel at \`/admin/docs\`. Documentation is stored in the database and organized by categories, making it searchable, editable, and maintainable as the application grows.

## Architecture
The docs system has three layers:
1. **Database storage**: All documentation lives in the \`docs_entries\` table with full CRUD support
2. **Admin UI**: A dedicated docs management page with editor, preview, and validation tools
3. **Seed system**: Initial documentation is seeded from \`server/docs-data.ts\` on first startup

## Database
Documentation uses the \`docs_entries\` table. See the "Docs Governance System" doc for full schema details.

## APIs
All docs endpoints are under \`/api/admin/docs\` and require admin authentication. See the "Docs Governance System" doc for endpoint details.

## Frontend Integration
Navigate to \`/admin/docs\` in the admin panel to:
- Browse docs by category in the left sidebar
- Search across all docs using the search bar
- Create new docs with the "Create Doc" button
- Edit existing docs by selecting them and clicking "Edit"
- Run the quality validator to check for missing sections

## Security Considerations
Only authenticated admin users can access, create, edit, or delete documentation entries.

## Operational Notes

### Category System
14 standard categories organize all documentation:
Getting Started, APIs, Architecture, CMS, CRM, Database, Deployment, Integrations, Media, Performance, Routing, Security, SEO, Theming

"Getting Started" always appears first in the sidebar.

### Doc Template Standard
Every doc entry should follow this markdown template with these sections:
- **Overview**: What the feature does and why it exists
- **Architecture**: How it works internally
- **Database**: Tables and fields involved
- **APIs**: Endpoint documentation
- **Frontend Integration**: UI components and connections
- **Security Considerations**: Auth, validation, rate limits
- **Operational Notes**: Migration notes, edge cases
- **Related Docs**: Links to related entries

### DocsLogger Helper
The \`server/utils/docsLogger.ts\` utility allows code to programmatically create documentation:
\`\`\`typescript
import { logFeatureDocumentation } from "./utils/docsLogger";

await logFeatureDocumentation({
  category: "CMS",
  title: "My New Feature",
  summary: "What it does",
  endpoints: ["GET /api/admin/feature"],
  tables: ["feature_table"],
  frontendFiles: ["client/src/pages/feature.tsx"]
});
\`\`\`

### Validation Tool
The "Validate Docs" button in the admin UI checks all entries for:
- Missing category or invalid category name
- Missing required sections (Overview, Architecture, etc.)
- Empty body content
- Duplicate titles
- No related docs linked

## Related Docs
- Docs Governance System`,
      updatedAt: now,
      tags: ["getting-started", "docs", "documentation", "tutorial"],
    },
  ];
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const CATEGORY_MAP: Record<string, string> = {
  "CMS": "CMS",
  "Security": "Security",
  "CRM": "CRM",
  "SEO": "SEO",
  "Theming": "Theming",
  "Routing": "Routing",
  "Media": "Media",
  "Architecture": "Architecture",
  "Getting Started": "Getting Started",
};

export async function seedDocsEntries() {
  console.log("[seed-docs] Starting docs seed...");
  const existing = await storage.getDocsEntries();
  const existingSlugs = new Set(existing.map(e => e.slug));
  const entries = getDocsEntries();
  let inserted = 0;

  for (const entry of entries) {
    const slug = slugify(entry.title);
    if (existingSlugs.has(slug)) continue;
    const category = CATEGORY_MAP[entry.category] || entry.category;
    await storage.createDocsEntry({
      category,
      title: entry.title,
      slug,
      bodyMarkdown: entry.bodyMarkdown,
      tags: entry.tags,
      related: [],
      version: "1.0",
      author: "Brush Boss Engineering",
    });
    inserted++;
    existingSlugs.add(slug);
  }

  console.log(`[seed-docs] Inserted ${inserted} new docs entries (${existing.length} already existed).`);
  console.log("[seed-docs] Docs seed complete.");
}
