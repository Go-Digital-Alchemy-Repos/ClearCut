import type { Express } from "express";
import express from "express";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import multer from "multer";
import { storage } from "./storage";
import { requireAdmin, requireRole } from "./auth";
import {
  insertCmsPageSchema, updateCmsPageSchema,
  insertCmsTemplateSchema, updateCmsTemplateSchema,
  insertCmsBlockSchema,
  insertCmsMediaSchema,
  insertCmsRedirectSchema,
} from "@shared/schema";

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), "server", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const name = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
      cb(null, name);
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed. Accepted: jpeg, png, webp`));
    }
  },
});

const uploadRateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkUploadRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = uploadRateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    uploadRateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

const previewTokens = new Map<string, { pageId: string; expiresAt: number }>();

function cleanExpiredTokens() {
  const now = Date.now();
  for (const [token, data] of previewTokens) {
    if (data.expiresAt < now) previewTokens.delete(token);
  }
}

setInterval(cleanExpiredTokens, 60_000);

export function registerCmsRoutes(app: Express) {
  const cmsAccess = requireRole(["super_admin", "admin", "editor"]);
  const themeAccess = requireRole(["super_admin", "admin"]);

  app.get("/api/admin/cms/pages", cmsAccess, async (req, res) => {
    try {
      const filters = {
        status: req.query.status as string | undefined,
        pageType: req.query.pageType as string | undefined,
        search: req.query.search as string | undefined,
      };
      const pages = await storage.getCmsPages(filters);
      return res.json(pages);
    } catch (err) {
      console.error("Failed to fetch CMS pages:", err);
      return res.status(500).json({ error: "Failed to fetch pages" });
    }
  });

  app.post("/api/admin/cms/pages", cmsAccess, async (req, res) => {
    try {
      const parsed = insertCmsPageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const existing = await storage.getCmsPageBySlug(parsed.data.slug);
      if (existing) {
        return res.status(409).json({ error: "A page with this slug already exists" });
      }
      const page = await storage.createCmsPage(parsed.data);
      return res.status(201).json(page);
    } catch (err) {
      console.error("Failed to create CMS page:", err);
      return res.status(500).json({ error: "Failed to create page" });
    }
  });

  app.get("/api/admin/cms/pages/:id", cmsAccess, async (req, res) => {
    try {
      const page = await storage.getCmsPage(req.params.id);
      if (!page) return res.status(404).json({ error: "Page not found" });
      return res.json(page);
    } catch (err) {
      console.error("Failed to fetch CMS page:", err);
      return res.status(500).json({ error: "Failed to fetch page" });
    }
  });

  app.patch("/api/admin/cms/pages/:id", cmsAccess, async (req, res) => {
    try {
      const parsed = updateCmsPageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      if (parsed.data.slug) {
        const existing = await storage.getCmsPageBySlug(parsed.data.slug);
        if (existing && existing.id !== req.params.id) {
          return res.status(409).json({ error: "A page with this slug already exists" });
        }
      }

      const currentPage = await storage.getCmsPage(req.params.id);
      if (!currentPage) return res.status(404).json({ error: "Page not found" });

      const isPublishing = parsed.data.status === "published" && currentPage.status !== "published";
      if (isPublishing) {
        const snapshot = {
          title: currentPage.title,
          slug: currentPage.slug,
          description: currentPage.description,
          status: currentPage.status,
          pageType: currentPage.pageType,
          templateId: currentPage.templateId,
          blocks: currentPage.blocks,
          seo: currentPage.seo,
        };
        await storage.createPageRevision({
          pageId: currentPage.id,
          createdBy: "admin",
          message: "Auto-saved before publish",
          snapshot,
        });
        await storage.prunePageRevisions(currentPage.id, 50);
      }

      const updated = await storage.updateCmsPage(req.params.id, parsed.data);
      return res.json(updated);
    } catch (err) {
      console.error("Failed to update CMS page:", err);
      return res.status(500).json({ error: "Failed to update page" });
    }
  });

  app.delete("/api/admin/cms/pages/:id", cmsAccess, async (req, res) => {
    try {
      const deleted = await storage.deleteCmsPage(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Page not found" });
      return res.json({ ok: true });
    } catch (err) {
      console.error("Failed to delete CMS page:", err);
      return res.status(500).json({ error: "Failed to delete page" });
    }
  });

  app.get("/api/admin/cms/templates", cmsAccess, async (_req, res) => {
    try {
      const templates = await storage.getCmsTemplates();
      return res.json(templates);
    } catch (err) {
      console.error("Failed to fetch templates:", err);
      return res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.post("/api/admin/cms/templates", cmsAccess, async (req, res) => {
    try {
      const parsed = insertCmsTemplateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const template = await storage.createCmsTemplate(parsed.data);
      return res.status(201).json(template);
    } catch (err) {
      console.error("Failed to create template:", err);
      return res.status(500).json({ error: "Failed to create template" });
    }
  });

  app.get("/api/admin/cms/templates/:id", cmsAccess, async (req, res) => {
    try {
      const template = await storage.getCmsTemplate(req.params.id);
      if (!template) return res.status(404).json({ error: "Template not found" });
      return res.json(template);
    } catch (err) {
      console.error("Failed to fetch template:", err);
      return res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  app.patch("/api/admin/cms/templates/:id", cmsAccess, async (req, res) => {
    try {
      const parsed = updateCmsTemplateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const updated = await storage.updateCmsTemplate(req.params.id, parsed.data);
      if (!updated) return res.status(404).json({ error: "Template not found" });
      return res.json(updated);
    } catch (err) {
      console.error("Failed to update template:", err);
      return res.status(500).json({ error: "Failed to update template" });
    }
  });

  app.delete("/api/admin/cms/templates/:id", cmsAccess, async (req, res) => {
    try {
      const deleted = await storage.deleteCmsTemplate(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Template not found" });
      return res.json({ ok: true });
    } catch (err) {
      console.error("Failed to delete template:", err);
      return res.status(500).json({ error: "Failed to delete template" });
    }
  });

  app.get("/api/admin/cms/blocks", cmsAccess, async (_req, res) => {
    try {
      const blocks = await storage.getCmsBlocks();
      return res.json(blocks);
    } catch (err) {
      console.error("Failed to fetch blocks:", err);
      return res.status(500).json({ error: "Failed to fetch blocks" });
    }
  });

  app.post("/api/admin/cms/blocks", cmsAccess, async (req, res) => {
    try {
      const parsed = insertCmsBlockSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const block = await storage.createCmsBlock({ ...parsed.data, isSystem: false });
      return res.status(201).json(block);
    } catch (err) {
      console.error("Failed to create block:", err);
      return res.status(500).json({ error: "Failed to create block" });
    }
  });

  app.use("/uploads", (req, res, next) => {
    if (req.method !== "GET") return res.status(405).end();
    next();
  }, express.static(UPLOADS_DIR, { maxAge: "7d" }));

  app.get("/api/admin/cms/media", cmsAccess, async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : undefined,
      };
      const result = await storage.getCmsMedia(filters);
      return res.json(result);
    } catch (err) {
      console.error("Failed to fetch media:", err);
      return res.status(500).json({ error: "Failed to fetch media" });
    }
  });

  app.post("/api/admin/cms/media/upload", cmsAccess, (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    if (!checkUploadRateLimit(ip)) {
      return res.status(429).json({ error: "Too many uploads. Try again in a minute." });
    }
    next();
  }, upload.single("file"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ error: "No file uploaded" });

      const url = `/uploads/${file.filename}`;
      let width: number | undefined;
      let height: number | undefined;

      try {
        const sizeOf = (await import("image-size")).default;
        const dims = sizeOf(file.path);
        width = dims.width;
        height = dims.height;
      } catch {}

      const media = await storage.createCmsMedia({
        url,
        alt: (req.body.alt as string) || undefined,
        title: (req.body.title as string) || file.originalname.replace(/\.[^.]+$/, ""),
        width,
        height,
        mimeType: file.mimetype,
        sizeBytes: file.size,
      });

      return res.status(201).json(media);
    } catch (err) {
      console.error("Failed to upload media:", err);
      return res.status(500).json({ error: "Failed to upload media" });
    }
  });

  app.post("/api/admin/cms/media", cmsAccess, async (req, res) => {
    try {
      const parsed = insertCmsMediaSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const media = await storage.createCmsMedia(parsed.data);
      return res.status(201).json(media);
    } catch (err) {
      console.error("Failed to create media:", err);
      return res.status(500).json({ error: "Failed to create media" });
    }
  });

  app.patch("/api/admin/cms/media/:id", cmsAccess, async (req, res) => {
    try {
      const { alt, title, tags } = req.body;
      const updated = await storage.updateCmsMedia(req.params.id, { alt, title, tags });
      if (!updated) return res.status(404).json({ error: "Media not found" });
      return res.json(updated);
    } catch (err) {
      console.error("Failed to update media:", err);
      return res.status(500).json({ error: "Failed to update media" });
    }
  });

  app.delete("/api/admin/cms/media/:id", cmsAccess, async (req, res) => {
    try {
      const item = await storage.getCmsMediaById(req.params.id);
      const deleted = await storage.deleteCmsMedia(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Media not found" });
      if (item && item.url.startsWith("/uploads/")) {
        const filePath = path.join(UPLOADS_DIR, path.basename(item.url));
        fs.unlink(filePath, () => {});
      }
      return res.json({ ok: true });
    } catch (err) {
      console.error("Failed to delete media:", err);
      return res.status(500).json({ error: "Failed to delete media" });
    }
  });

  app.get("/api/admin/cms/themes", themeAccess, async (_req, res) => {
    try {
      const presets = await storage.getThemePresets();
      return res.json(presets);
    } catch (err) {
      console.error("Failed to fetch themes:", err);
      return res.status(500).json({ error: "Failed to fetch themes" });
    }
  });

  app.post("/api/admin/cms/themes/:id/activate", themeAccess, async (req, res) => {
    try {
      const preset = await storage.activateThemePreset(req.params.id);
      return res.json(preset);
    } catch (err) {
      console.error("Failed to activate theme:", err);
      return res.status(500).json({ error: "Failed to activate theme" });
    }
  });

  app.get("/api/admin/cms/redirects", cmsAccess, async (_req, res) => {
    try {
      const redirects = await storage.getCmsRedirects();
      return res.json(redirects);
    } catch (err) {
      console.error("Failed to fetch redirects:", err);
      return res.status(500).json({ error: "Failed to fetch redirects" });
    }
  });

  app.post("/api/admin/cms/redirects", cmsAccess, async (req, res) => {
    try {
      const parsed = insertCmsRedirectSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
      }
      const redirect = await storage.createCmsRedirect(parsed.data);
      return res.status(201).json(redirect);
    } catch (err) {
      console.error("Failed to create redirect:", err);
      return res.status(500).json({ error: "Failed to create redirect" });
    }
  });

  app.delete("/api/admin/cms/redirects/:id", cmsAccess, async (req, res) => {
    try {
      const deleted = await storage.deleteCmsRedirect(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Redirect not found" });
      return res.json({ ok: true });
    } catch (err) {
      console.error("Failed to delete redirect:", err);
      return res.status(500).json({ error: "Failed to delete redirect" });
    }
  });

  app.get("/api/admin/cms/pages/:id/revisions", cmsAccess, async (req, res) => {
    try {
      const page = await storage.getCmsPage(req.params.id);
      if (!page) return res.status(404).json({ error: "Page not found" });
      const revisions = await storage.getPageRevisions(req.params.id);
      return res.json(revisions);
    } catch (err) {
      console.error("Failed to fetch revisions:", err);
      return res.status(500).json({ error: "Failed to fetch revisions" });
    }
  });

  app.post("/api/admin/cms/pages/:id/revisions", cmsAccess, async (req, res) => {
    try {
      const page = await storage.getCmsPage(req.params.id);
      if (!page) return res.status(404).json({ error: "Page not found" });

      const snapshot = {
        title: page.title,
        slug: page.slug,
        description: page.description,
        status: page.status,
        pageType: page.pageType,
        templateId: page.templateId,
        blocks: page.blocks,
        seo: page.seo,
      };

      const revision = await storage.createPageRevision({
        pageId: page.id,
        createdBy: (req.body.createdBy as string) || "admin",
        message: (req.body.message as string) || undefined,
        snapshot,
      });

      await storage.prunePageRevisions(page.id, 50);

      return res.status(201).json(revision);
    } catch (err) {
      console.error("Failed to create revision:", err);
      return res.status(500).json({ error: "Failed to create revision" });
    }
  });

  app.post("/api/admin/cms/pages/:id/revisions/:revId/restore", cmsAccess, async (req, res) => {
    try {
      const page = await storage.getCmsPage(req.params.id);
      if (!page) return res.status(404).json({ error: "Page not found" });

      const revision = await storage.getPageRevision(req.params.revId);
      if (!revision || revision.pageId !== req.params.id) {
        return res.status(404).json({ error: "Revision not found" });
      }

      const snap = revision.snapshot as Record<string, any>;
      const updated = await storage.updateCmsPage(req.params.id, {
        title: snap.title,
        slug: snap.slug,
        description: snap.description,
        status: snap.status,
        pageType: snap.pageType,
        templateId: snap.templateId || null,
        blocks: snap.blocks,
        seo: snap.seo,
      });

      return res.json(updated);
    } catch (err) {
      console.error("Failed to restore revision:", err);
      return res.status(500).json({ error: "Failed to restore revision" });
    }
  });

  app.post("/api/admin/cms/pages/:id/preview-token", cmsAccess, async (req, res) => {
    try {
      const page = await storage.getCmsPage(req.params.id);
      if (!page) return res.status(404).json({ error: "Page not found" });
      cleanExpiredTokens();
      const token = crypto.randomBytes(32).toString("hex");
      previewTokens.set(token, {
        pageId: page.id,
        expiresAt: Date.now() + 15 * 60 * 1000,
      });
      return res.json({ token, slug: page.slug, expiresIn: 900 });
    } catch (err) {
      console.error("Failed to create preview token:", err);
      return res.status(500).json({ error: "Failed to create preview token" });
    }
  });

  app.get("/api/public/pages/:slug", async (req, res) => {
    try {
      const page = await storage.getCmsPageBySlug(req.params.slug);
      if (!page) return res.status(404).json({ error: "Page not found" });

      const previewToken = req.query.previewToken as string | undefined;
      if (page.status !== "published") {
        if (!previewToken) return res.status(404).json({ error: "Page not found" });
        const tokenData = previewTokens.get(previewToken);
        if (!tokenData || tokenData.pageId !== page.id || tokenData.expiresAt < Date.now()) {
          return res.status(404).json({ error: "Page not found" });
        }
        return res.json({ ...page, _preview: true });
      }
      return res.json(page);
    } catch (err) {
      console.error("Failed to fetch public page:", err);
      return res.status(500).json({ error: "Failed to fetch page" });
    }
  });

  app.get("/api/public/theme", async (_req, res) => {
    try {
      const preset = await storage.getActiveThemePreset();
      if (!preset) return res.json(null);
      return res.json(preset);
    } catch (err) {
      console.error("Failed to fetch theme:", err);
      return res.status(500).json({ error: "Failed to fetch theme" });
    }
  });
}
