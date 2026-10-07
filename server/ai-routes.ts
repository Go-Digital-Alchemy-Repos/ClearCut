import OpenAI from "openai";
import { type Express } from "express";
import { requireRole } from "./auth";
import { storage } from "./storage";

// Prefer the OPENAI_API_KEY env var; fall back to the key saved in admin Settings.
async function getOpenAI(): Promise<OpenAI | null> {
  const settings = await storage.getSiteSettings();
  const apiKey = process.env.OPENAI_API_KEY || settings?.chatgptApiKey;
  return apiKey ? new OpenAI({ apiKey }) : null;
}

export function registerAiRoutes(app: Express) {
  const cmsAccess = requireRole(["super_admin", "admin", "editor"]);

  app.post("/api/admin/cms/ai/seo-suggest", cmsAccess, async (req, res) => {
    try {
      const openai = await getOpenAI();
      if (!openai) {
        return res.status(503).json({ error: "AI is not configured. Add an OpenAI API key in Settings." });
      }
      const { title, blocks } = req.body;
      
      // Extract meaningful text from blocks
      const content = blocks.map((b: any) => {
        const props = b.props || {};
        return Object.values(props).filter(v => typeof v === 'string').join(' ');
      }).join('\n');

      const prompt = `Act as an SEO expert. Analyze this page content and provide optimized SEO metadata in JSON format.
Page Title: ${title}
Page Content: ${content.substring(0, 2000)}

Return JSON: { "title": "60 chars max", "description": "160 chars max", "ogTitle": "60 chars max", "ogDescription": "160 chars max" }`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const suggestions = JSON.parse(completion.choices[0].message.content || "{}");
      res.json(suggestions);
    } catch (error: any) {
      console.error("AI SEO Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
}
