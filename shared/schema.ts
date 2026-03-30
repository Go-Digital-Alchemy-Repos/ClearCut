import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, serial, jsonb, integer, uuid, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const LEAD_STATUSES = ["New", "Contacted", "Scheduled", "Won", "Lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  jobAddress: text("job_address").notNull(),
  county: text("county").notNull(),
  servicesNeeded: text("services_needed").array().notNull(),
  propertyType: text("property_type").notNull(),
  approximateArea: text("approximate_area").notNull(),
  accessFlags: text("access_flags").array(),
  accessNotes: text("access_notes"),
  desiredOutcome: text("desired_outcome"),
  timeline: text("timeline").notNull(),
  budgetComfort: text("budget_comfort").notNull(),
  status: text("status").notNull().default("New"),
  source: text("source").default("Website Quote Form"),
  tags: text("tags").array(),
  assignedTo: text("assigned_to"),
  lastContactedAt: timestamp("last_contacted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  status: true,
  source: true,
  tags: true,
  assignedTo: true,
  lastContactedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const updateLeadSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  tags: z.array(z.string()).optional(),
  assignedTo: z.string().nullable().optional(),
  lastContactedAt: z.string().nullable().optional(),
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export const leadNotes = pgTable("lead_notes", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(),
  note: text("note").notNull(),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLeadNoteSchema = createInsertSchema(leadNotes).omit({
  id: true,
  createdAt: true,
});

export type InsertLeadNote = z.infer<typeof insertLeadNoteSchema>;
export type LeadNote = typeof leadNotes.$inferSelect;

export const ACTIVITY_TYPES = ["STATUS_CHANGE", "NOTE_ADDED", "ASSIGNED", "EXPORTED"] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const leadActivity = pgTable("lead_activity", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(),
  type: text("type").notNull(),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLeadActivitySchema = createInsertSchema(leadActivity).omit({
  id: true,
  createdAt: true,
});

export type InsertLeadActivity = z.infer<typeof insertLeadActivitySchema>;
export type LeadActivity = typeof leadActivity.$inferSelect;

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertConversationSchema = createInsertSchema(conversations);
export const insertMessageSchema = createInsertSchema(messages);
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;

export const POST_STATUSES = ["draft", "published"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImageUrl: text("featured_image_url"),
  category: text("category").notNull(),
  tags: text("tags").array(),
  publishedAt: timestamp("published_at"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  status: text("status").notNull().default("draft"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  canonicalUrl: text("canonical_url"),
  ogImageUrl: text("og_image_url"),
  focusKeyword: text("focus_keyword"),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  updatedAt: true,
});

export const updateBlogPostSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  excerpt: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  featuredImageUrl: z.string().nullable().optional(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(POST_STATUSES).optional(),
  publishedAt: z.string().nullable().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  canonicalUrl: z.string().nullable().optional(),
  ogImageUrl: z.string().nullable().optional(),
  focusKeyword: z.string().nullable().optional(),
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull().default("Forestry Boss"),
  phone: text("phone").notNull().default("(704) 608-5783"),
  email: text("email").notNull().default("info@forestryboss.com"),
  serviceArea: text("service_area").notNull().default("Charlotte, NC & Surrounding Areas"),
  logoUrl: text("logo_url").notNull().default("/images/logo.png"),
  primaryColor: text("primary_color").notNull().default("24 97% 46%"),
  secondaryColor: text("secondary_color").notNull().default("137 38% 21%"),
  accentColor: text("accent_color").notNull().default("215 15% 45%"),
  fontFamily: text("font_family").notNull().default("Inter"),
  ctaText: text("cta_text").notNull().default("Get a Fast Quote"),
  socialFacebook: text("social_facebook"),
  socialInstagram: text("social_instagram"),
  socialYoutube: text("social_youtube"),
  socialGoogle: text("social_google"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  mailgunApiKey: text("mailgun_api_key"),
  mailgunDomain: text("mailgun_domain"),
  chatgptApiKey: text("chatgpt_api_key"),
});

export const updateSiteSettingsSchema = z.object({
  companyName: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email().optional(),
  serviceArea: z.string().min(1).optional(),
  logoUrl: z.string().nullable().optional(),
  primaryColor: z.string().min(1).optional(),
  secondaryColor: z.string().min(1).optional(),
  fontFamily: z.string().min(1).optional(),
  ctaText: z.string().min(1).optional(),
  socialFacebook: z.string().nullable().optional(),
  socialInstagram: z.string().nullable().optional(),
  socialYoutube: z.string().nullable().optional(),
  socialGoogle: z.string().nullable().optional(),
  mailgunApiKey: z.string().nullable().optional(),
  mailgunDomain: z.string().nullable().optional(),
  chatgptApiKey: z.string().nullable().optional(),
});

export type SiteSettings = typeof siteSettings.$inferSelect;
export type UpdateSiteSettings = z.infer<typeof updateSiteSettingsSchema>;

export const CMS_PAGE_TYPES = ["page", "service", "landing"] as const;
export type CmsPageType = (typeof CMS_PAGE_TYPES)[number];

export const cmsPages = pgTable("cms_pages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  status: text("status").notNull().default("draft"),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  pageType: text("page_type").notNull().default("page"),
  templateId: uuid("template_id"),
  blocks: jsonb("blocks").notNull().default([]),
  seo: jsonb("seo").notNull().default({}),
  publishedAt: timestamp("published_at"),
});

export const insertCmsPageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  pageType: z.enum(CMS_PAGE_TYPES).optional(),
  templateId: z.string().uuid().nullable().optional(),
  blocks: z.array(z.any()).optional(),
  seo: z.record(z.any()).optional(),
  status: z.enum(POST_STATUSES).optional(),
});

export const updateCmsPageSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  pageType: z.enum(CMS_PAGE_TYPES).optional(),
  templateId: z.string().uuid().nullable().optional(),
  blocks: z.array(z.any()).optional(),
  seo: z.record(z.any()).optional(),
  status: z.enum(POST_STATUSES).optional(),
  publishedAt: z.string().nullable().optional(),
});

export type CmsPage = typeof cmsPages.$inferSelect;
export type InsertCmsPage = z.infer<typeof insertCmsPageSchema>;
export type UpdateCmsPage = z.infer<typeof updateCmsPageSchema>;

export const cmsTemplates = pgTable("cms_templates", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  name: text("name").notNull().unique(),
  description: text("description"),
  blocks: jsonb("blocks").notNull().default([]),
  seoDefaults: jsonb("seo_defaults").notNull().default({}),
  status: text("status").notNull().default("active"),
});

export const insertCmsTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  blocks: z.array(z.any()).optional(),
  seoDefaults: z.record(z.any()).optional(),
  status: z.string().optional(),
});

export const updateCmsTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  blocks: z.array(z.any()).optional(),
  seoDefaults: z.record(z.any()).optional(),
  status: z.string().optional(),
});

export type CmsTemplate = typeof cmsTemplates.$inferSelect;
export type InsertCmsTemplate = z.infer<typeof insertCmsTemplateSchema>;
export type UpdateCmsTemplate = z.infer<typeof updateCmsTemplateSchema>;

export const cmsBlockLibrary = pgTable("cms_block_library", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  icon: text("icon"),
  description: text("description"),
  defaultProps: jsonb("default_props").notNull().default({}),
  schema: jsonb("schema").notNull().default({}),
  isSystem: boolean("is_system").notNull().default(true),
});

export type CmsBlock = typeof cmsBlockLibrary.$inferSelect;

export const insertCmsBlockSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  icon: z.string().optional(),
  description: z.string().optional(),
  defaultProps: z.record(z.any()).optional(),
  schema: z.record(z.any()).optional(),
  isSystem: z.boolean().optional(),
});

export type InsertCmsBlock = z.infer<typeof insertCmsBlockSchema>;

export const cmsMedia = pgTable("cms_media", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  url: text("url").notNull(),
  alt: text("alt"),
  title: text("title"),
  width: integer("width"),
  height: integer("height"),
  mimeType: text("mime_type"),
  sizeBytes: integer("size_bytes"),
  tags: jsonb("tags").notNull().default([]),
});

export type CmsMediaItem = typeof cmsMedia.$inferSelect;

export const insertCmsMediaSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  title: z.string().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  mimeType: z.string().optional(),
  sizeBytes: z.number().int().optional(),
  tags: z.array(z.string()).optional(),
});

export type InsertCmsMedia = z.infer<typeof insertCmsMediaSchema>;

export const themePresets = pgTable("theme_presets", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  tokens: jsonb("tokens").notNull(),
  isSystem: boolean("is_system").notNull().default(true),
  isActive: boolean("is_active").notNull().default(false),
});

export type ThemePreset = typeof themePresets.$inferSelect;

export const insertThemePresetSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  tokens: z.record(z.any()),
  isSystem: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type InsertThemePreset = z.infer<typeof insertThemePresetSchema>;

export const cmsRedirects = pgTable("cms_redirects", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  fromPath: text("from_path").notNull().unique(),
  toPath: text("to_path").notNull(),
  code: integer("code").notNull().default(301),
});

export type CmsRedirect = typeof cmsRedirects.$inferSelect;

export const insertCmsRedirectSchema = z.object({
  fromPath: z.string().min(1),
  toPath: z.string().min(1),
  code: z.number().int().optional(),
});

export type InsertCmsRedirect = z.infer<typeof insertCmsRedirectSchema>;

export const cmsPageRevisions = pgTable("cms_page_revisions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  pageId: uuid("page_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: text("created_by"),
  message: text("message"),
  snapshot: jsonb("snapshot").notNull(),
});

export type CmsPageRevision = typeof cmsPageRevisions.$inferSelect;

export const insertCmsPageRevisionSchema = z.object({
  pageId: z.string().uuid(),
  createdBy: z.string().optional(),
  message: z.string().optional(),
  snapshot: z.record(z.any()),
});

export type InsertCmsPageRevision = z.infer<typeof insertCmsPageRevisionSchema>;

export const ADMIN_ROLES = ["super_admin", "admin", "editor", "sales"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name"),
  role: text("role").notNull().default("editor"),
});

export const insertAdminUserSchema = z.object({
  email: z.string().email(),
  passwordHash: z.string().min(1),
  displayName: z.string().optional(),
  role: z.enum(ADMIN_ROLES),
});

export const updateAdminUserSchema = z.object({
  email: z.string().email().optional(),
  displayName: z.string().nullable().optional(),
  role: z.enum(ADMIN_ROLES).optional(),
  passwordHash: z.string().min(1).optional(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type UpdateAdminUser = z.infer<typeof updateAdminUserSchema>;

export const crmProjects = pgTable("crm_projects", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  leadId: integer("lead_id"),
  slug: text("slug"),
  title: text("title").notNull(),
  location: text("location"),
  description: text("description"),
  beforeAfter: jsonb("before_after").default([]),
  summary: text("summary"),
  services: jsonb("services").default([]),
  featured: boolean("featured").notNull().default(false),
  publish: boolean("publish").notNull().default(false),
  coverImageUrl: text("cover_image_url"),
  coverImageAlt: text("cover_image_alt"),
  gallery: jsonb("gallery").default([]),
  tags: jsonb("tags").default([]),
});

export const insertCrmProjectSchema = createInsertSchema(crmProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateCrmProjectSchema = z.object({
  title: z.string().optional(),
  slug: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  leadId: z.number().nullable().optional(),
  beforeAfter: z.array(z.object({ url: z.string(), label: z.string().optional() })).optional(),
  summary: z.string().nullable().optional(),
  services: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  publish: z.boolean().optional(),
  coverImageUrl: z.string().nullable().optional(),
  coverImageAlt: z.string().nullable().optional(),
  gallery: z.array(z.object({ url: z.string(), alt: z.string().optional(), title: z.string().optional() })).optional(),
  tags: z.array(z.string()).optional(),
});

export type CrmProject = typeof crmProjects.$inferSelect;
export type InsertCrmProject = z.infer<typeof insertCrmProjectSchema>;
export type UpdateCrmProject = z.infer<typeof updateCrmProjectSchema>;

export const cmsTestimonials = pgTable("cms_testimonials", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  name: text("name"),
  area: text("area"),
  quote: text("quote").notNull(),
  rating: integer("rating"),
  publish: boolean("publish").notNull().default(true),
});

export const insertCmsTestimonialSchema = createInsertSchema(cmsTestimonials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateCmsTestimonialSchema = z.object({
  name: z.string().nullable().optional(),
  area: z.string().nullable().optional(),
  quote: z.string().optional(),
  rating: z.number().min(1).max(5).nullable().optional(),
  publish: z.boolean().optional(),
});

export type CmsTestimonial = typeof cmsTestimonials.$inferSelect;
export type InsertCmsTestimonial = z.infer<typeof insertCmsTestimonialSchema>;
export type UpdateCmsTestimonial = z.infer<typeof updateCmsTestimonialSchema>;

export interface BlockInstance {
  id: string;
  type: string;
  props: Record<string, any>;
  style?: Record<string, any>;
  meta?: {
    label?: string;
    hidden?: boolean;
  };
}

export const DOC_CATEGORIES = [
  "Getting Started",
  "APIs",
  "Architecture",
  "CMS",
  "CRM",
  "Database",
  "Deployment",
  "Integrations",
  "Media",
  "Performance",
  "Routing",
  "Security",
  "SEO",
  "Theming",
] as const;
export type DocCategory = (typeof DOC_CATEGORIES)[number];

export const docsEntries = pgTable("docs_entries", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  bodyMarkdown: text("body_markdown").notNull().default(""),
  tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
  related: text("related").array().notNull().default(sql`'{}'::text[]`),
  version: text("version").notNull().default("1.0"),
  author: text("author").notNull().default("system"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDocsEntrySchema = createInsertSchema(docsEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertDocsEntry = z.infer<typeof insertDocsEntrySchema>;
export type DocsEntry = typeof docsEntries.$inferSelect;

export interface PageSeo {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  robots?: string;
  og?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    locale?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  schema?: {
    enabled?: boolean;
    type?: string;
    jsonLd?: string;
  };
  sitemap?: {
    priority?: number;
    changefreq?: string;
  };
}
