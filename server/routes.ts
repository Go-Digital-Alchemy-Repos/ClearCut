import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, updateLeadSchema, insertBlogPostSchema, updateBlogPostSchema, updateSiteSettingsSchema, LEAD_STATUSES, ADMIN_ROLES, insertCrmProjectSchema, updateCrmProjectSchema, insertCmsTestimonialSchema, updateCmsTestimonialSchema, insertDocsEntrySchema, DOC_CATEGORIES } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import passport from "passport";
import { requireAdmin, requireRole } from "./auth";
import { registerCmsRoutes } from "./cms-routes";
import { getDocsEntries } from "./docs-data";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 5;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

import crypto from "crypto";

interface CacheEntry {
  data: any;
  etag: string;
  expiresAt: number;
}

const responseCache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 1000;

function getCached(key: string): CacheEntry | null {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    responseCache.delete(key);
    return null;
  }
  return entry;
}

function setCache(key: string, data: any, ttl: number = CACHE_TTL): string {
  const json = JSON.stringify(data);
  const etag = `"${crypto.createHash("md5").update(json).digest("hex")}"`;
  responseCache.set(key, { data, etag, expiresAt: Date.now() + ttl });
  return etag;
}

function invalidateCache(prefix: string) {
  for (const key of responseCache.keys()) {
    if (key.startsWith(prefix)) {
      responseCache.delete(key);
    }
  }
}

import { setupAuth } from "./auth";
import { registerAiRoutes } from "./ai-routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);
  registerAiRoutes(app);
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/admin/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: info?.message || "Invalid credentials" });
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        return res.json({ user: { id: user.id, username: user.username, role: user.role } });
      });
    })(req, res, next);
  });

  app.post("/api/admin/logout", (req, res) => {
    req.logout(() => {
      res.json({ ok: true });
    });
  });

  app.get("/api/admin/me", (req, res) => {
    if (req.isAuthenticated()) {
      return res.json({ user: { id: req.user!.id, username: req.user!.username, role: req.user!.role } });
    }
    return res.status(401).json({ error: "Not authenticated" });
  });

  app.post("/api/public/leads", async (req, res) => {
    try {
      const ip = req.ip || req.socket.remoteAddress || "unknown";
      if (rateLimit(ip)) {
        return res.status(429).json({ error: "Too many requests. Please try again in a minute." });
      }

      if (req.body.company && req.body.company.trim() !== "") {
        return res.status(200).json({ leadId: 0 });
      }

      const { company, ...leadData } = req.body;

      const parsed = insertLeadSchema.safeParse(leadData);
      if (!parsed.success) {
        return res.status(400).json({
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        });
      }

      const lead = await storage.createLead(parsed.data);
      return res.status(201).json({ leadId: lead.id });
    } catch (err) {
      console.error("Failed to create lead:", err);
      return res.status(500).json({ error: "Failed to submit quote request" });
    }
  });

  const crmAccess = requireRole(["super_admin", "admin", "sales"]);
  const cmsAccess = requireRole(["super_admin", "admin", "editor"]);
  const brandingAccess = requireRole(["super_admin", "admin"]);
  const superOnly = requireRole(["super_admin"]);

  app.get("/api/admin/leads", crmAccess, async (req, res) => {
    try {
      const filters = {
        status: req.query.status as string | undefined,
        county: req.query.county as string | undefined,
        service: req.query.service as string | undefined,
        search: req.query.search as string | undefined,
        dateFrom: req.query.dateFrom as string | undefined,
        dateTo: req.query.dateTo as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 20,
      };
      const result = await storage.getLeads(filters);
      return res.json(result);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      return res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.get("/api/admin/leads/export.csv", crmAccess, async (_req, res) => {
    try {
      const allLeads = await storage.getAllLeads();

      const headers = [
        "ID", "Full Name", "Phone", "Email", "Address", "County",
        "Services", "Property Type", "Area", "Access Notes",
        "Desired Outcome", "Timeline", "Budget", "Status",
        "Source", "Tags", "Assigned To", "Last Contacted", "Created At"
      ];

      const escapeCSV = (val: any) => {
        if (val === null || val === undefined) return "";
        const str = String(val);
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const rows = allLeads.map((l) => [
        l.id, l.fullName, l.phone, l.email, l.jobAddress, l.county,
        (l.servicesNeeded || []).join("; "), l.propertyType, l.approximateArea,
        l.accessNotes || "", l.desiredOutcome || "", l.timeline, l.budgetComfort,
        l.status, l.source || "", (l.tags || []).join("; "), l.assignedTo || "",
        l.lastContactedAt ? new Date(l.lastContactedAt).toISOString() : "",
        l.createdAt ? new Date(l.createdAt).toISOString() : "",
      ].map(escapeCSV).join(","));

      const csv = [headers.join(","), ...rows].join("\n");

      await storage.createLeadActivity({
        leadId: 0,
        type: "EXPORTED",
        payload: { count: allLeads.length, exportedAt: new Date().toISOString() },
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="leads-${new Date().toISOString().split("T")[0]}.csv"`);
      return res.send(csv);
    } catch (err) {
      console.error("Failed to export leads:", err);
      return res.status(500).json({ error: "Failed to export leads" });
    }
  });

  app.get("/api/admin/leads/stats", crmAccess, async (_req, res) => {
    try {
      const stats = await storage.getLeadStats();
      return res.json(stats);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      return res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/leads/:id", crmAccess, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid lead ID" });

      const lead = await storage.getLead(id);
      if (!lead) return res.status(404).json({ error: "Lead not found" });

      return res.json(lead);
    } catch (err) {
      console.error("Failed to fetch lead:", err);
      return res.status(500).json({ error: "Failed to fetch lead" });
    }
  });

  app.patch("/api/admin/leads/:id", crmAccess, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid lead ID" });

      const parsed = updateLeadSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }

      const existingLead = await storage.getLead(id);
      if (!existingLead) return res.status(404).json({ error: "Lead not found" });

      const updateData: any = {};
      if (parsed.data.status !== undefined) updateData.status = parsed.data.status;
      if (parsed.data.tags !== undefined) updateData.tags = parsed.data.tags;
      if (parsed.data.assignedTo !== undefined) updateData.assignedTo = parsed.data.assignedTo;
      if (parsed.data.lastContactedAt !== undefined) {
        updateData.lastContactedAt = parsed.data.lastContactedAt ? new Date(parsed.data.lastContactedAt) : null;
      }

      const updated = await storage.updateLead(id, updateData);

      if (parsed.data.status && parsed.data.status !== existingLead.status) {
        await storage.createLeadActivity({
          leadId: id,
          type: "STATUS_CHANGE",
          payload: { from: existingLead.status, to: parsed.data.status },
        });
      }

      if (parsed.data.assignedTo !== undefined && parsed.data.assignedTo !== existingLead.assignedTo) {
        await storage.createLeadActivity({
          leadId: id,
          type: "ASSIGNED",
          payload: { from: existingLead.assignedTo, to: parsed.data.assignedTo },
        });
      }

      return res.json(updated);
    } catch (err) {
      console.error("Failed to update lead:", err);
      return res.status(500).json({ error: "Failed to update lead" });
    }
  });

  app.post("/api/admin/leads/:id/notes", crmAccess, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      if (isNaN(leadId)) return res.status(400).json({ error: "Invalid lead ID" });

      const noteSchema = z.object({ note: z.string().min(1) });
      const parsed = noteSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Note text is required" });
      }

      const lead = await storage.getLead(leadId);
      if (!lead) return res.status(404).json({ error: "Lead not found" });

      const createdBy = req.user?.username || "admin";

      const note = await storage.createLeadNote({
        leadId,
        note: parsed.data.note,
        createdBy,
      });

      await storage.createLeadActivity({
        leadId,
        type: "NOTE_ADDED",
        payload: { noteId: note.id, preview: parsed.data.note.substring(0, 100) },
      });

      return res.status(201).json(note);
    } catch (err) {
      console.error("Failed to create note:", err);
      return res.status(500).json({ error: "Failed to create note" });
    }
  });

  app.get("/api/admin/leads/:id/notes", crmAccess, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      if (isNaN(leadId)) return res.status(400).json({ error: "Invalid lead ID" });
      const notes = await storage.getLeadNotes(leadId);
      return res.json(notes);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      return res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  app.get("/api/admin/leads/:id/activity", crmAccess, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      if (isNaN(leadId)) return res.status(400).json({ error: "Invalid lead ID" });
      const activity = await storage.getLeadActivity(leadId);
      return res.json(activity);
    } catch (err) {
      console.error("Failed to fetch activity:", err);
      return res.status(500).json({ error: "Failed to fetch activity" });
    }
  });

  // ---- Public Settings Route ----
  app.get("/api/public/settings", async (req, res) => {
    try {
      const cacheKey = "public:settings";
      const cached = getCached(cacheKey);
      if (cached) {
        if (req.headers["if-none-match"] === cached.etag) {
          return res.status(304).end();
        }
        res.set("ETag", cached.etag);
        res.set("Cache-Control", "public, max-age=60");
        return res.json(cached.data);
      }
      // Never expose integration secrets on the public endpoint
      const { mailgunApiKey, mailgunDomain, chatgptApiKey, ...settings } = await storage.getSiteSettings();
      const etag = setCache(cacheKey, settings, 2 * 60 * 1000);
      res.set("ETag", etag);
      res.set("Cache-Control", "public, max-age=60");
      return res.json(settings);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      return res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // ---- Public Blog Routes ----
  app.get("/api/public/blog", async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string | undefined,
        search: req.query.search as string | undefined,
      };
      const cacheKey = `public:blog:${filters.category || ""}:${filters.search || ""}`;
      const cached = getCached(cacheKey);
      if (cached) {
        if (req.headers["if-none-match"] === cached.etag) {
          return res.status(304).end();
        }
        res.set("ETag", cached.etag);
        res.set("Cache-Control", "public, max-age=30");
        return res.json(cached.data);
      }
      const posts = await storage.getPublishedBlogPosts(filters);
      const etag = setCache(cacheKey, posts);
      res.set("ETag", etag);
      res.set("Cache-Control", "public, max-age=30");
      return res.json(posts);
    } catch (err) {
      console.error("Failed to fetch blog posts:", err);
      return res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/public/blog/:slug", async (req, res) => {
    try {
      const cacheKey = `public:blogpost:${req.params.slug}`;
      const cached = getCached(cacheKey);
      if (cached) {
        if (req.headers["if-none-match"] === cached.etag) {
          return res.status(304).end();
        }
        res.set("ETag", cached.etag);
        res.set("Cache-Control", "public, max-age=30");
        return res.json(cached.data);
      }
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || post.status !== "published") {
        return res.status(404).json({ error: "Post not found" });
      }
      const etag = setCache(cacheKey, post);
      res.set("ETag", etag);
      res.set("Cache-Control", "public, max-age=30");
      return res.json(post);
    } catch (err) {
      console.error("Failed to fetch blog post:", err);
      return res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.get("/api/public/blog/:slug/related", async (req, res) => {
    try {
      const cacheKey = `public:related:${req.params.slug}`;
      const cached = getCached(cacheKey);
      if (cached) {
        if (req.headers["if-none-match"] === cached.etag) {
          return res.status(304).end();
        }
        res.set("ETag", cached.etag);
        res.set("Cache-Control", "public, max-age=60");
        return res.json(cached.data);
      }
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || post.status !== "published") {
        return res.status(404).json({ error: "Post not found" });
      }
      const related = await storage.getRelatedPosts(post.id, post.category);
      const etag = setCache(cacheKey, related, 2 * 60 * 1000);
      res.set("ETag", etag);
      res.set("Cache-Control", "public, max-age=60");
      return res.json(related);
    } catch (err) {
      console.error("Failed to fetch related posts:", err);
      return res.status(500).json({ error: "Failed to fetch related posts" });
    }
  });

  // ---- Admin Blog Routes ----
  app.get("/api/admin/blog", cmsAccess, async (req, res) => {
    try {
      const filters = {
        status: req.query.status as string | undefined,
        category: req.query.category as string | undefined,
        search: req.query.search as string | undefined,
      };
      const posts = await storage.getBlogPosts(filters);
      return res.json(posts);
    } catch (err) {
      console.error("Failed to fetch blog posts:", err);
      return res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/admin/blog", cmsAccess, async (req, res) => {
    try {
      const parsed = insertBlogPostSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const existing = await storage.getBlogPostBySlug(parsed.data.slug);
      if (existing) {
        return res.status(409).json({ error: "A post with this slug already exists" });
      }
      const post = await storage.createBlogPost(parsed.data);
      invalidateCache("public:blog");
      return res.status(201).json(post);
    } catch (err) {
      console.error("Failed to create blog post:", err);
      return res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.get("/api/admin/blog/:id", cmsAccess, async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });
      return res.json(post);
    } catch (err) {
      console.error("Failed to fetch blog post:", err);
      return res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.patch("/api/admin/blog/:id", cmsAccess, async (req, res) => {
    try {
      const parsed = updateBlogPostSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const updateData: any = { ...parsed.data };
      if (parsed.data.publishedAt !== undefined) {
        updateData.publishedAt = parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null;
      }
      if (parsed.data.status === "published" && !updateData.publishedAt) {
        const existing = await storage.getBlogPost(req.params.id);
        if (existing && !existing.publishedAt) {
          updateData.publishedAt = new Date();
        }
      }
      if (parsed.data.slug) {
        const existing = await storage.getBlogPostBySlug(parsed.data.slug);
        if (existing && existing.id !== req.params.id) {
          return res.status(409).json({ error: "A post with this slug already exists" });
        }
      }
      const updated = await storage.updateBlogPost(req.params.id, updateData);
      if (!updated) return res.status(404).json({ error: "Post not found" });
      invalidateCache("public:blog");
      invalidateCache("public:related");
      return res.json(updated);
    } catch (err) {
      console.error("Failed to update blog post:", err);
      return res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/:id", cmsAccess, async (req, res) => {
    try {
      const deleted = await storage.deleteBlogPost(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Post not found" });
      invalidateCache("public:blog");
      invalidateCache("public:related");
      return res.json({ ok: true });
    } catch (err) {
      console.error("Failed to delete blog post:", err);
      return res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // ---- Admin Settings Routes ----
  app.get("/api/admin/settings", brandingAccess, async (_req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      return res.json(settings);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      return res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/admin/settings", brandingAccess, async (req, res) => {
    try {
      const parsed = updateSiteSettingsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const updated = await storage.updateSiteSettings(parsed.data);
      invalidateCache("public:settings");
      return res.json(updated);
    } catch (err) {
      console.error("Failed to update settings:", err);
      return res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // ---- Admin CRM Projects Routes ----
  app.get("/api/admin/projects", crmAccess, async (_req, res) => {
    try {
      const projects = await storage.getCrmProjects();
      return res.json(projects);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      return res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/admin/projects/:id", crmAccess, async (req, res) => {
    try {
      const project = await storage.getCrmProject(req.params.id);
      if (!project) return res.status(404).json({ error: "Project not found" });
      return res.json(project);
    } catch (err) {
      console.error("Failed to fetch project:", err);
      return res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/admin/projects", crmAccess, async (req, res) => {
    try {
      const parsed = insertCrmProjectSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const project = await storage.createCrmProject(parsed.data);
      invalidateCache("public:projects");
      return res.status(201).json(project);
    } catch (err) {
      console.error("Failed to create project:", err);
      return res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.post("/api/admin/projects/from-lead/:leadId", crmAccess, async (req, res) => {
    try {
      const leadId = parseInt(req.params.leadId);
      if (isNaN(leadId)) return res.status(400).json({ error: "Invalid lead ID" });
      const lead = await storage.getLead(leadId);
      if (!lead) return res.status(404).json({ error: "Lead not found" });
      const existing = await storage.getProjectByLeadId(leadId);
      if (existing) return res.status(409).json({ error: "Project already exists for this lead", projectId: existing.id });
      const title = req.body.title || `${lead.fullName} - ${(lead.servicesNeeded || []).join(", ")}`;
      const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const slug = req.body.slug || `${baseSlug}-${Date.now().toString(36)}`;
      const project = await storage.createCrmProject({
        leadId,
        title,
        slug,
        location: lead.jobAddress || lead.county || "",
        services: lead.servicesNeeded || [],
        summary: lead.desiredOutcome || "",
        featured: req.body.featured || false,
        publish: false,
      });
      return res.status(201).json(project);
    } catch (err) {
      console.error("Failed to create project from lead:", err);
      return res.status(500).json({ error: "Failed to create project from lead" });
    }
  });

  app.patch("/api/admin/projects/:id", crmAccess, async (req, res) => {
    try {
      const parsed = updateCrmProjectSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const updated = await storage.updateCrmProject(req.params.id, parsed.data);
      if (!updated) return res.status(404).json({ error: "Project not found" });
      invalidateCache("public:projects");
      return res.json(updated);
    } catch (err) {
      console.error("Failed to update project:", err);
      return res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/admin/projects/:id", crmAccess, async (req, res) => {
    try {
      const deleted = await storage.deleteCrmProject(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Project not found" });
      invalidateCache("public:projects");
      return res.json({ ok: true });
    } catch (err) {
      console.error("Failed to delete project:", err);
      return res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // ---- Admin Testimonials Routes ----
  app.get("/api/admin/testimonials", cmsAccess, async (_req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      return res.json(testimonials);
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
      return res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  app.get("/api/admin/testimonials/:id", cmsAccess, async (req, res) => {
    try {
      const testimonial = await storage.getTestimonial(req.params.id);
      if (!testimonial) return res.status(404).json({ error: "Testimonial not found" });
      return res.json(testimonial);
    } catch (err) {
      console.error("Failed to fetch testimonial:", err);
      return res.status(500).json({ error: "Failed to fetch testimonial" });
    }
  });

  app.post("/api/admin/testimonials", cmsAccess, async (req, res) => {
    try {
      const parsed = insertCmsTestimonialSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const testimonial = await storage.createTestimonial(parsed.data);
      invalidateCache("public:testimonials");
      return res.status(201).json(testimonial);
    } catch (err) {
      console.error("Failed to create testimonial:", err);
      return res.status(500).json({ error: "Failed to create testimonial" });
    }
  });

  app.patch("/api/admin/testimonials/:id", cmsAccess, async (req, res) => {
    try {
      const parsed = updateCmsTestimonialSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const updated = await storage.updateTestimonial(req.params.id, parsed.data);
      if (!updated) return res.status(404).json({ error: "Testimonial not found" });
      invalidateCache("public:testimonials");
      return res.json(updated);
    } catch (err) {
      console.error("Failed to update testimonial:", err);
      return res.status(500).json({ error: "Failed to update testimonial" });
    }
  });

  app.delete("/api/admin/testimonials/:id", cmsAccess, async (req, res) => {
    try {
      const deleted = await storage.deleteTestimonial(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Testimonial not found" });
      invalidateCache("public:testimonials");
      return res.json({ ok: true });
    } catch (err) {
      console.error("Failed to delete testimonial:", err);
      return res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });

  // ---- Public Projects & Testimonials ----
  app.get("/api/public/projects", async (req, res) => {
    try {
      const cacheKey = "public:projects";
      const cached = getCached(cacheKey);
      if (cached) {
        if (req.headers["if-none-match"] === cached.etag) return res.status(304).end();
        res.set("ETag", cached.etag);
        res.set("Cache-Control", "public, max-age=60");
        return res.json(cached.data);
      }
      const projects = await storage.getPublishedProjects();
      const etag = setCache(cacheKey, projects, 2 * 60 * 1000);
      res.set("ETag", etag);
      res.set("Cache-Control", "public, max-age=60");
      return res.json(projects);
    } catch (err) {
      console.error("Failed to fetch public projects:", err);
      return res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/public/projects/:slug", async (req, res) => {
    try {
      const project = await storage.getProjectBySlug(req.params.slug);
      if (!project || !project.publish) return res.status(404).json({ error: "Project not found" });
      return res.json(project);
    } catch (err) {
      console.error("Failed to fetch project by slug:", err);
      return res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.get("/api/public/testimonials", async (req, res) => {
    try {
      const cacheKey = "public:testimonials";
      const cached = getCached(cacheKey);
      if (cached) {
        if (req.headers["if-none-match"] === cached.etag) return res.status(304).end();
        res.set("ETag", cached.etag);
        res.set("Cache-Control", "public, max-age=60");
        return res.json(cached.data);
      }
      const testimonials = await storage.getPublishedTestimonials();
      const etag = setCache(cacheKey, testimonials, 2 * 60 * 1000);
      res.set("ETag", etag);
      res.set("Cache-Control", "public, max-age=60");
      return res.json(testimonials);
    } catch (err) {
      console.error("Failed to fetch public testimonials:", err);
      return res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  // ---- Admin User Management Routes (SuperAdmin only) ----
  app.get("/api/admin/users", superOnly, async (_req, res) => {
    try {
      const users = await storage.getAdminUsers();
      const sanitized = users.map(({ passwordHash, ...rest }) => rest);
      return res.json(sanitized);
    } catch (err) {
      console.error("Failed to fetch admin users:", err);
      return res.status(500).json({ error: "Failed to fetch admin users" });
    }
  });

  app.post("/api/admin/users", superOnly, async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
        displayName: z.string().optional(),
        role: z.enum(ADMIN_ROLES),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const existing = await storage.getAdminUserByEmail(parsed.data.email);
      if (existing) {
        return res.status(409).json({ error: "A user with this email already exists" });
      }
      const hash = await bcrypt.hash(parsed.data.password, 10);
      const user = await storage.createAdminUser({
        email: parsed.data.email,
        passwordHash: hash,
        displayName: parsed.data.displayName,
        role: parsed.data.role,
      });
      const { passwordHash, ...sanitized } = user;
      return res.status(201).json(sanitized);
    } catch (err) {
      console.error("Failed to create admin user:", err);
      return res.status(500).json({ error: "Failed to create admin user" });
    }
  });

  app.patch("/api/admin/users/:id", superOnly, async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email().optional(),
        password: z.string().min(6).optional(),
        displayName: z.string().nullable().optional(),
        role: z.enum(ADMIN_ROLES).optional(),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const updateData: any = {};
      if (parsed.data.email) updateData.email = parsed.data.email;
      if (parsed.data.displayName !== undefined) updateData.displayName = parsed.data.displayName;
      if (parsed.data.role) updateData.role = parsed.data.role;
      if (parsed.data.password) {
        updateData.passwordHash = await bcrypt.hash(parsed.data.password, 10);
      }
      const updated = await storage.updateAdminUser(req.params.id, updateData);
      if (!updated) return res.status(404).json({ error: "User not found" });
      const { passwordHash, ...sanitized } = updated;
      return res.json(sanitized);
    } catch (err) {
      console.error("Failed to update admin user:", err);
      return res.status(500).json({ error: "Failed to update admin user" });
    }
  });

  app.delete("/api/admin/users/:id", superOnly, async (req, res) => {
    try {
      if (req.params.id === req.user?.id) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }
      const deleted = await storage.deleteAdminUser(req.params.id);
      if (!deleted) return res.status(404).json({ error: "User not found" });
      return res.json({ ok: true });
    } catch (err) {
      console.error("Failed to delete admin user:", err);
      return res.status(500).json({ error: "Failed to delete admin user" });
    }
  });

  registerCmsRoutes(app);

  // ---- Sitemap.xml ----
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const baseUrl = (process.env.PUBLIC_SITE_URL || `https://${_req.headers.host}`).replace(/\/$/, "");
      const pages = await storage.getCmsPages({ status: "published" });
      const posts = await storage.getPublishedBlogPosts({});
      const redirects = await storage.getCmsRedirects();
      const redirectMap = new Map<string, string>();
      for (const r of redirects) {
        redirectMap.set(r.fromPath, r.toPath);
      }

      function resolveCanonical(path: string): string {
        let current = path;
        const visited = new Set<string>();
        while (redirectMap.has(current) && !visited.has(current)) {
          visited.add(current);
          current = redirectMap.get(current)!;
        }
        return current;
      }

      const staticRoutes = [
        { loc: "/", priority: "1.0", changefreq: "weekly" },
        { loc: "/services", priority: "0.8", changefreq: "monthly" },
        { loc: "/services/forestry-mulching", priority: "0.8", changefreq: "monthly" },
        { loc: "/services/trail-cutting", priority: "0.7", changefreq: "monthly" },
        { loc: "/services/hillside-mulching", priority: "0.7", changefreq: "monthly" },
        { loc: "/services/brush-hogging", priority: "0.7", changefreq: "monthly" },
        { loc: "/services/fence-line-clearing", priority: "0.7", changefreq: "monthly" },
        { loc: "/services/invasive-growth-removal", priority: "0.7", changefreq: "monthly" },
        { loc: "/pricing", priority: "0.7", changefreq: "monthly" },
        { loc: "/quote", priority: "0.8", changefreq: "monthly" },
        { loc: "/blog", priority: "0.7", changefreq: "daily" },
        { loc: "/areas/charlotte", priority: "0.7", changefreq: "monthly" },
        { loc: "/areas/huntersville", priority: "0.6", changefreq: "monthly" },
        { loc: "/areas/concord", priority: "0.6", changefreq: "monthly" },
        { loc: "/areas/matthews", priority: "0.6", changefreq: "monthly" },
        { loc: "/areas/mint-hill", priority: "0.6", changefreq: "monthly" },
        { loc: "/areas/fort-mill", priority: "0.6", changefreq: "monthly" },
        { loc: "/areas/belmont", priority: "0.6", changefreq: "monthly" },
        { loc: "/areas/waxhaw", priority: "0.6", changefreq: "monthly" },
        { loc: "/areas/indian-trail", priority: "0.6", changefreq: "monthly" },
        { loc: "/areas/monroe", priority: "0.6", changefreq: "monthly" },
        { loc: "/areas/lake-norman", priority: "0.7", changefreq: "monthly" },
        { loc: "/areas/mooresville", priority: "0.6", changefreq: "monthly" },
      ];

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      for (const route of staticRoutes) {
        const canonical = resolveCanonical(route.loc);
        xml += `  <url>\n    <loc>${baseUrl}${canonical}</loc>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
      }

      for (const page of pages) {
        const pagePath = `/${page.slug}`;
        const canonical = resolveCanonical(pagePath);
        const seo = (page.seo || {}) as any;
        const priority = seo?.sitemap?.priority || "0.6";
        const changefreq = seo?.sitemap?.changefreq || "monthly";
        const lastmod = page.updatedAt ? new Date(page.updatedAt).toISOString().split("T")[0] : undefined;
        xml += `  <url>\n    <loc>${baseUrl}${canonical}</loc>\n`;
        if (lastmod) xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
      }

      for (const post of posts) {
        const postPath = `/blog/${post.slug}`;
        const canonical = resolveCanonical(postPath);
        const lastmod = (post.updatedAt || post.publishedAt) ? new Date((post.updatedAt || post.publishedAt)!).toISOString().split("T")[0] : undefined;
        xml += `  <url>\n    <loc>${baseUrl}${canonical}</loc>\n`;
        if (lastmod) xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
      }

      xml += "</urlset>";
      res.set("Content-Type", "application/xml");
      res.send(xml);
    } catch (err) {
      console.error("Failed to generate sitemap:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // ---- Robots.txt ----
  app.get("/robots.txt", (_req, res) => {
    const baseUrl = (process.env.PUBLIC_SITE_URL || `https://${_req.headers.host}`).replace(/\/$/, "");
    const content = [
      "User-agent: *",
      "Allow: /",
      "",
      "Disallow: /admin/",
      "Disallow: /api/",
      "",
      `Sitemap: ${baseUrl}/sitemap.xml`,
    ].join("\n");
    res.set("Content-Type", "text/plain");
    res.send(content);
  });

  let redirectCache: Map<string, { to: string; code: number }> | null = null;
  async function loadRedirects() {
    try {
      const redirects = await storage.getCmsRedirects();
      const map = new Map<string, { to: string; code: number }>();
      for (const r of redirects) {
        map.set(r.fromPath, { to: r.toPath, code: r.code });
      }
      redirectCache = map;
    } catch {}
  }
  loadRedirects();
  setInterval(loadRedirects, 60000);

  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    if (redirectCache) {
      const match = redirectCache.get(req.path);
      if (match) {
        return res.redirect(match.code, match.to);
      }
    }
    next();
  });

  app.get("/api/admin/docs", requireAdmin, async (_req, res) => {
    const { category, search } = _req.query as { category?: string; search?: string };
    const entries = await storage.getDocsEntries({ category, search });
    const cats = [...DOC_CATEGORIES];
    res.json({ categories: cats, entries });
  });

  app.get("/api/admin/docs/validate/all", requireAdmin, async (_req, res) => {
    const entries = await storage.getDocsEntries();
    const requiredSections = ["Overview", "Architecture", "APIs", "Frontend Integration", "Security Considerations", "Related Docs"];
    const issues: { id: string; title: string; problems: string[] }[] = [];
    const titles = new Map<string, string>();
    for (const entry of entries) {
      const problems: string[] = [];
      if (!entry.category) problems.push("Missing category");
      if (!DOC_CATEGORIES.includes(entry.category as any)) problems.push(`Invalid category: ${entry.category}`);
      if (!entry.bodyMarkdown || entry.bodyMarkdown.trim().length === 0) problems.push("Empty body");
      for (const section of requiredSections) {
        if (!entry.bodyMarkdown.includes(`## ${section}`)) problems.push(`Missing section: ${section}`);
      }
      if (entry.related.length === 0) problems.push("No related docs linked");
      const dupId = titles.get(entry.title);
      if (dupId) problems.push(`Duplicate title (also in ${dupId})`);
      titles.set(entry.title, entry.id);
      if (problems.length > 0) issues.push({ id: entry.id, title: entry.title, problems });
    }
    res.json({ total: entries.length, issueCount: issues.length, issues });
  });

  app.get("/api/admin/docs/:id", requireAdmin, async (req, res) => {
    const entry = await storage.getDocsEntry(req.params.id);
    if (!entry) return res.status(404).json({ error: "Doc not found" });
    res.json(entry);
  });

  app.post("/api/admin/docs", requireAdmin, async (req, res) => {
    try {
      const data = insertDocsEntrySchema.parse(req.body);
      const existing = await storage.getDocsEntryBySlug(data.slug);
      if (existing) return res.status(409).json({ error: "Slug already exists" });
      const entry = await storage.createDocsEntry(data);
      res.status(201).json(entry);
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Invalid data" });
    }
  });

  app.patch("/api/admin/docs/:id", requireAdmin, async (req, res) => {
    try {
      const data = insertDocsEntrySchema.partial().parse(req.body);
      if (data.slug) {
        const existing = await storage.getDocsEntryBySlug(data.slug);
        if (existing && existing.id !== req.params.id) return res.status(409).json({ error: "Slug already exists" });
      }
      const updated = await storage.updateDocsEntry(req.params.id, data);
      if (!updated) return res.status(404).json({ error: "Doc not found" });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Invalid data" });
    }
  });

  app.delete("/api/admin/docs/:id", requireAdmin, async (req, res) => {
    const ok = await storage.deleteDocsEntry(req.params.id);
    if (!ok) return res.status(404).json({ error: "Doc not found" });
    res.json({ ok: true });
  });

  return httpServer;
}
