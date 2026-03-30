import { db } from "./db";
import { cmsBlockLibrary, themePresets } from "@shared/schema";
import { sql } from "drizzle-orm";

const SYSTEM_BLOCKS = [
  {
    key: "hero",
    name: "Hero Section",
    category: "Layout",
    icon: "Layers",
    description: "Full-width hero banner with headline, subheadline, call-to-action button, and background image.",
    isSystem: true,
    defaultProps: {
      headline: "Professional Land Clearing & Forestry Mulching",
      subheadline: "Forestry Boss delivers expert brush clearing, forestry mulching, and land management across the Charlotte, NC region.",
      primaryCtaText: "Get a Free Quote",
      primaryCtaHref: "/quote",
      imageUrl: "/images/hero-land-clearing.jpg",
      imageAlt: "Forestry Boss forestry mulching equipment clearing overgrown property",
    },
    schema: {
      fields: [
        { key: "headline", label: "Headline", type: "text" },
        { key: "subheadline", label: "Sub-headline", type: "textarea" },
        { key: "primaryCtaText", label: "Button Text", type: "text" },
        { key: "primaryCtaHref", label: "Button Link", type: "text" },
        { key: "imageUrl", label: "Image URL", type: "text" },
        { key: "imageAlt", label: "Image Alt Text", type: "text" },
      ],
    },
  },
  {
    key: "rich_text",
    name: "Rich Text",
    category: "Content",
    icon: "FileText",
    description: "Free-form rich text content block for paragraphs, headings, lists, and inline media.",
    isSystem: true,
    defaultProps: {
      content: "Enter your content here...",
    },
    schema: {
      fields: [
        { key: "content", label: "Content", type: "textarea" },
      ],
    },
  },
  {
    key: "image_banner",
    name: "Image Banner",
    category: "Media",
    icon: "Image",
    description: "Full-width image banner with optional overlay text and configurable height.",
    isSystem: true,
    defaultProps: {
      imageUrl: "/images/banner-clearing-site.jpg",
      alt: "Cleared property by Brush Boss in Charlotte NC",
      overlayText: "Transforming Overgrown Land Into Usable Space",
      height: "md",
    },
    schema: {
      fields: [
        { key: "imageUrl", label: "Image URL", type: "text" },
        { key: "alt", label: "Alt Text", type: "text" },
        { key: "overlayText", label: "Overlay Text", type: "text" },
        { key: "height", label: "Banner Height", type: "select", options: ["sm", "md", "lg"] },
      ],
    },
  },
  {
    key: "feature_grid",
    name: "Feature Grid",
    category: "Layout",
    icon: "Grid3x3",
    description: "Grid of feature cards with icons, titles, and descriptions.",
    isSystem: true,
    defaultProps: {
      heading: "Why Choose Brush Boss?",
      subheading: "We bring the right equipment, experience, and work ethic to every job across the Charlotte metro area.",
      features: [
        { title: "Heavy-Duty Equipment", description: "Commercial-grade forestry mulchers and track loaders handle the toughest terrain.", icon: "Truck" },
        { title: "One-Pass Clearing", description: "Forestry mulching grinds brush and trees into ground cover in a single pass—no hauling required.", icon: "Zap" },
        { title: "Erosion Protection", description: "Mulch stays on-site to hold soil in place and prevent runoff on Charlotte's red clay.", icon: "Shield" },
      ],
    },
    schema: {
      fields: [
        { key: "heading", label: "Heading", type: "text" },
        { key: "subheading", label: "Subheading", type: "textarea" },
        {
          key: "features",
          label: "Features",
          type: "array",
          itemFields: [
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "text" },
            { key: "icon", label: "Icon", type: "text" },
          ],
        },
      ],
    },
  },
  {
    key: "service_cards",
    name: "Service Cards",
    category: "Marketing",
    icon: "Briefcase",
    description: "Cards showcasing services with title, description, icon, and link.",
    isSystem: true,
    defaultProps: {
      heading: "Our Services",
      services: [
        { title: "Forestry Mulching", description: "Grind brush and small trees into natural ground cover in one pass.", slug: "/services/forestry-mulching", icon: "Trees" },
        { title: "Brush Hogging", description: "Heavy-duty mowing for overgrown fields and pastures.", slug: "/services/brush-hogging", icon: "Scissors" },
        { title: "Trail Cutting", description: "Create access lanes and recreational trails through wooded areas.", slug: "/services/trail-cutting", icon: "Route" },
      ],
    },
    schema: {
      fields: [
        { key: "heading", label: "Heading", type: "text" },
        {
          key: "services",
          label: "Services",
          type: "array",
          itemFields: [
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "text" },
            { key: "slug", label: "Link", type: "text" },
            { key: "icon", label: "Icon", type: "text" },
          ],
        },
      ],
    },
  },
  {
    key: "testimonial_row",
    name: "Testimonials",
    category: "Social Proof",
    icon: "MessageSquare",
    description: "Row of customer testimonials with quote text, name, and location.",
    isSystem: true,
    defaultProps: {
      heading: "What Our Customers Say",
      testimonials: [
        { text: "Brush Boss cleared 3 acres of overgrown brush in a single day. The property looks incredible and the mulch ground cover is already holding the soil in place.", name: "Mike R.", location: "Waxhaw, NC" },
        { text: "Professional crew, serious equipment, and fair pricing. They cut trails through our back 5 acres and the access lanes are perfect for our UTVs.", name: "Sarah T.", location: "Mooresville, NC" },
        { text: "We had a nightmare of kudzu and privet along our fence line. Brush Boss knocked it all out and the fence is visible again for the first time in years.", name: "James K.", location: "Indian Trail, NC" },
      ],
    },
    schema: {
      fields: [
        { key: "heading", label: "Heading", type: "text" },
        {
          key: "testimonials",
          label: "Testimonials",
          type: "array",
          itemFields: [
            { key: "text", label: "Quote", type: "text" },
            { key: "name", label: "Name", type: "text" },
            { key: "location", label: "Location", type: "text" },
          ],
        },
      ],
    },
  },
  {
    key: "cta_band",
    name: "Call to Action Band",
    category: "Marketing",
    icon: "Megaphone",
    description: "Full-width call-to-action strip with heading, description, and button.",
    isSystem: true,
    defaultProps: {
      heading: "Ready to Reclaim Your Property?",
      description: "Whether it's a half-acre lot or a 50-acre parcel, we have the equipment and experience to get it done right.",
      buttonText: "Get a Free Quote",
      buttonHref: "/quote",
      variant: "primary",
    },
    schema: {
      fields: [
        { key: "heading", label: "Heading", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "buttonText", label: "Button Text", type: "text" },
        { key: "buttonHref", label: "Button Link", type: "text" },
        { key: "variant", label: "Style Variant", type: "select", options: ["primary", "secondary", "dark"] },
      ],
    },
  },
  {
    key: "faq",
    name: "FAQ Section",
    category: "Content",
    icon: "HelpCircle",
    description: "Accordion-style frequently asked questions section.",
    isSystem: true,
    defaultProps: {
      heading: "Frequently Asked Questions",
      faqs: [
        { question: "What is forestry mulching?", answer: "Forestry mulching uses a heavy-duty attachment on a skid steer or track loader to grind standing brush, saplings, and small trees into fine mulch right where they stand. No cutting, stacking, hauling, or burning required." },
        { question: "How much does land clearing cost?", answer: "Pricing depends on vegetation density, total area, terrain, and access. Most residential projects in the Charlotte metro area fall into half-day or full-day rates. Contact us for a free estimate." },
        { question: "Do you serve my area?", answer: "We serve properties across Mecklenburg, Union, Cabarrus, Iredell, Gaston, and Lincoln County, covering the entire greater Charlotte region." },
      ],
    },
    schema: {
      fields: [
        { key: "heading", label: "Heading", type: "text" },
        {
          key: "faqs",
          label: "FAQs",
          type: "array",
          itemFields: [
            { key: "question", label: "Question", type: "text" },
            { key: "answer", label: "Answer", type: "text" },
          ],
        },
      ],
    },
  },
  {
    key: "pricing_table",
    name: "Pricing Table",
    category: "Marketing",
    icon: "DollarSign",
    description: "Comparison table of pricing tiers with features and highlights.",
    isSystem: true,
    defaultProps: {
      heading: "Simple, Transparent Pricing",
      tiers: [
        { name: "Half-Day", price: "Starting at $800", description: "Ideal for small residential lots under 1 acre with moderate brush.", features: ["Up to 4 hours on-site", "Forestry mulching or brush hogging", "Mulch ground cover included", "Free on-site estimate"], highlighted: false },
        { name: "Full-Day", price: "Starting at $1,400", description: "Best value for 1–3 acre properties with dense vegetation.", features: ["Full 8-hour day", "All equipment and operators", "Mulch ground cover included", "Free on-site estimate", "Follow-up walk-through"], highlighted: true },
        { name: "Multi-Day / Per Acre", price: "Custom Quote", description: "Large rural parcels, commercial sites, and multi-phase projects.", features: ["Per-acre pricing available", "Multiple equipment options", "Project management included", "Phased clearing plans", "Volume discounts"], highlighted: false },
      ],
    },
    schema: {
      fields: [
        { key: "heading", label: "Heading", type: "text" },
        {
          key: "tiers",
          label: "Pricing Tiers",
          type: "array",
          itemFields: [
            { key: "name", label: "Tier Name", type: "text" },
            { key: "price", label: "Price", type: "text" },
            { key: "description", label: "Description", type: "text" },
            { key: "features", label: "Features", type: "text" },
            { key: "highlighted", label: "Highlighted", type: "text" },
          ],
        },
      ],
    },
  },
  {
    key: "contact_cta",
    name: "Contact CTA",
    category: "Forms",
    icon: "Phone",
    description: "Contact call-to-action block with phone, email, and action button.",
    isSystem: true,
    defaultProps: {
      heading: "Get In Touch",
      description: "Have questions about your property or need an estimate? Reach out and we'll get back to you within 24 hours.",
      phone: "(704) 608-5783",
      email: "info@brushboss.com",
      buttonText: "Request a Quote",
      buttonHref: "/quote",
    },
    schema: {
      fields: [
        { key: "heading", label: "Heading", type: "text" },
        { key: "description", label: "Description", type: "textarea" },
        { key: "phone", label: "Phone Number", type: "text" },
        { key: "email", label: "Email Address", type: "text" },
        { key: "buttonText", label: "Button Text", type: "text" },
        { key: "buttonHref", label: "Button Link", type: "text" },
      ],
    },
  },
  {
    key: "project_gallery",
    name: "Project Gallery",
    category: "Dynamic",
    icon: "FolderOpen",
    description: "Displays published portfolio projects with before/after images from the CRM. Data is fetched automatically from published projects.",
    isSystem: true,
    defaultProps: {
      heading: "Our Recent Projects",
      subheading: "See the results of our land clearing and forestry mulching work across the Charlotte area.",
      maxItems: 6,
    },
    schema: {
      fields: [
        { key: "heading", label: "Section Heading", type: "text" },
        { key: "subheading", label: "Sub-heading", type: "textarea" },
        { key: "maxItems", label: "Max Projects to Show", type: "number" },
      ],
    },
  },
  {
    key: "before_after_gallery",
    name: "Before/After Gallery",
    category: "Media",
    icon: "Columns",
    description: "Show project transformations with before/after images using a slider compare or grid layout.",
    isSystem: true,
    defaultProps: {
      headline: "Before & After: Real Results",
      subheadline: "See how Forestry Boss transforms overgrown land into clean, usable space.",
      layout: "compare",
      items: [
        {
          id: "ba-1",
          title: "Brush Removal & Mulching",
          location: "Matthews, NC",
          beforeImageUrl: "",
          beforeAlt: "Overgrown brush and saplings before clearing",
          afterImageUrl: "",
          afterAlt: "Clean cleared area after brush removal and mulching",
        },
        {
          id: "ba-2",
          title: "Lot Clearing",
          location: "Concord, NC",
          beforeImageUrl: "",
          beforeAlt: "Dense undergrowth covering a lot before clearing",
          afterImageUrl: "",
          afterAlt: "Lot cleared and opened up after work",
        },
      ],
      ctaText: "Get a Fast Quote",
      ctaHref: "/quote",
    },
    schema: {
      fields: [
        { key: "headline", label: "Headline", type: "text" },
        { key: "subheadline", label: "Subheadline", type: "textarea" },
        { key: "layout", label: "Layout Mode", type: "select", options: ["compare", "grid"] },
        {
          key: "items",
          label: "Before/After Items",
          type: "array",
          itemFields: [
            { key: "title", label: "Title", type: "text" },
            { key: "location", label: "Location", type: "text" },
            { key: "beforeImageUrl", label: "Before Image URL", type: "image" },
            { key: "beforeAlt", label: "Before Alt Text", type: "text" },
            { key: "afterImageUrl", label: "After Image URL", type: "image" },
            { key: "afterAlt", label: "After Alt Text", type: "text" },
          ],
        },
        { key: "ctaText", label: "CTA Button Text", type: "text" },
        { key: "ctaHref", label: "CTA Button Link", type: "text" },
      ],
    },
  },
  {
    key: "featured_projects",
    name: "Featured Projects",
    category: "Dynamic",
    icon: "Star",
    description: "Displays featured portfolio projects from the CRM. Data is fetched automatically from published projects.",
    isSystem: true,
    defaultProps: {
      headline: "Featured Projects",
      subheadline: "See our latest land clearing and forestry mulching work across the Charlotte area.",
      limit: 6,
      showOnlyFeatured: true,
      ctaText: "View All Projects",
      ctaHref: "/projects",
    },
    schema: {
      fields: [
        { key: "headline", label: "Section Heading", type: "text" },
        { key: "subheadline", label: "Sub-heading", type: "textarea" },
        { key: "limit", label: "Max Projects to Show", type: "text" },
        { key: "showOnlyFeatured", label: "Featured Only", type: "select", options: ["true", "false"] },
        { key: "ctaText", label: "CTA Button Text", type: "text" },
        { key: "ctaHref", label: "CTA Button Link", type: "text" },
      ],
    },
  },
  {
    key: "testimonials_slider",
    name: "Testimonials",
    category: "Dynamic",
    icon: "MessageSquareQuote",
    description: "Displays published customer testimonials with star ratings. Data is fetched automatically from the testimonials CMS.",
    isSystem: true,
    defaultProps: {
      heading: "What Our Customers Say",
      subheading: "Real reviews from property owners across the Charlotte region.",
      maxItems: 6,
    },
    schema: {
      fields: [
        { key: "heading", label: "Section Heading", type: "text" },
        { key: "subheading", label: "Sub-heading", type: "textarea" },
        { key: "maxItems", label: "Max Testimonials to Show", type: "number" },
      ],
    },
  },
];

const THEME_PRESETS = [
  {
    key: "forestry-pro",
    name: "Forestry Pro",
    description: "Brand colors from the Forestry Boss logo: Green, Orange, and Slate.",
    isSystem: true,
    isActive: true,
    tokens: {
      colors: { 
        primary: "24 97% 46%", 
        secondary: "137 38% 21%", 
        accent: "215 15% 45%", 
        bg: "210 20% 98%", 
        surface: "0 0% 100%", 
        text: "215 25% 15%" 
      },
      font: { family: "Inter", headingsWeight: "700", bodyWeight: "400" },
      radius: { card: "0.5rem", button: "0.375rem" },
      shadow: { card: "0 1px 3px rgba(0,0,0,0.1)", button: "0 1px 2px rgba(0,0,0,0.05)" },
      components: { buttonStyle: "solid", navStyle: "transparent" },
    },
  },
  {
    key: "blue-steel",
    name: "Blue Steel",
    description: "Professional blue and dark slate palette for a corporate, trustworthy feel.",
    isSystem: true,
    isActive: false,
    tokens: {
      colors: { primary: "215 70% 45%", secondary: "220 25% 30%", accent: "200 80% 55%", bg: "220 15% 97%", surface: "220 10% 100%", text: "220 20% 12%" },
      font: { family: "Inter", headingsWeight: "700", bodyWeight: "400" },
      radius: { card: "0.5rem", button: "0.375rem" },
      shadow: { card: "0 1px 3px rgba(0,0,0,0.12)", button: "0 1px 2px rgba(0,0,0,0.06)" },
      components: { buttonStyle: "solid", navStyle: "filled" },
    },
  },
  {
    key: "forest-green",
    name: "Forest Green",
    description: "Deep green nature-inspired theme evoking forests and outdoor work.",
    isSystem: true,
    isActive: false,
    tokens: {
      colors: { primary: "145 55% 32%", secondary: "160 30% 25%", accent: "80 60% 45%", bg: "120 10% 97%", surface: "120 8% 100%", text: "150 15% 12%" },
      font: { family: "Inter", headingsWeight: "700", bodyWeight: "400" },
      radius: { card: "0.5rem", button: "0.375rem" },
      shadow: { card: "0 1px 3px rgba(0,0,0,0.1)", button: "0 1px 2px rgba(0,0,0,0.05)" },
      components: { buttonStyle: "solid", navStyle: "transparent" },
    },
  },
  {
    key: "midnight",
    name: "Midnight",
    description: "Dark mode theme with purple and blue accents for a modern, high-contrast look.",
    isSystem: true,
    isActive: false,
    tokens: {
      colors: { primary: "260 60% 55%", secondary: "230 40% 35%", accent: "280 70% 65%", bg: "240 15% 10%", surface: "240 12% 15%", text: "240 10% 90%" },
      font: { family: "Inter", headingsWeight: "700", bodyWeight: "400" },
      radius: { card: "0.75rem", button: "0.5rem" },
      shadow: { card: "0 2px 8px rgba(0,0,0,0.4)", button: "0 1px 4px rgba(0,0,0,0.3)" },
      components: { buttonStyle: "solid", navStyle: "filled" },
    },
  },
  {
    key: "terracotta",
    name: "Terracotta",
    description: "Warm red and clay tones inspired by sun-baked earth and southwestern aesthetics.",
    isSystem: true,
    isActive: false,
    tokens: {
      colors: { primary: "15 65% 48%", secondary: "25 40% 35%", accent: "35 75% 55%", bg: "30 20% 96%", surface: "30 15% 100%", text: "20 15% 14%" },
      font: { family: "Inter", headingsWeight: "700", bodyWeight: "400" },
      radius: { card: "0.5rem", button: "0.375rem" },
      shadow: { card: "0 1px 3px rgba(0,0,0,0.1)", button: "0 1px 2px rgba(0,0,0,0.05)" },
      components: { buttonStyle: "solid", navStyle: "transparent" },
    },
  },
  {
    key: "ocean-breeze",
    name: "Ocean Breeze",
    description: "Light blue coastal theme with airy, open feel and soft gradients.",
    isSystem: true,
    isActive: false,
    tokens: {
      colors: { primary: "195 70% 45%", secondary: "210 40% 35%", accent: "175 65% 50%", bg: "200 25% 97%", surface: "200 20% 100%", text: "210 20% 15%" },
      font: { family: "Inter", headingsWeight: "600", bodyWeight: "400" },
      radius: { card: "0.75rem", button: "0.5rem" },
      shadow: { card: "0 1px 4px rgba(0,0,0,0.08)", button: "0 1px 2px rgba(0,0,0,0.04)" },
      components: { buttonStyle: "rounded", navStyle: "transparent" },
    },
  },
  {
    key: "charcoal",
    name: "Charcoal",
    description: "Minimal gray and black theme for a clean, no-nonsense professional appearance.",
    isSystem: true,
    isActive: false,
    tokens: {
      colors: { primary: "0 0% 20%", secondary: "0 0% 35%", accent: "0 0% 50%", bg: "0 0% 98%", surface: "0 0% 100%", text: "0 0% 10%" },
      font: { family: "Inter", headingsWeight: "700", bodyWeight: "400" },
      radius: { card: "0.25rem", button: "0.25rem" },
      shadow: { card: "0 1px 2px rgba(0,0,0,0.08)", button: "none" },
      components: { buttonStyle: "solid", navStyle: "bordered" },
    },
  },
  {
    key: "sunset-gold",
    name: "Sunset Gold",
    description: "Warm orange and gold palette inspired by golden hour and autumn landscapes.",
    isSystem: true,
    isActive: false,
    tokens: {
      colors: { primary: "38 80% 50%", secondary: "25 60% 40%", accent: "45 90% 55%", bg: "40 25% 97%", surface: "40 18% 100%", text: "30 15% 13%" },
      font: { family: "Inter", headingsWeight: "700", bodyWeight: "400" },
      radius: { card: "0.5rem", button: "0.375rem" },
      shadow: { card: "0 1px 3px rgba(0,0,0,0.1)", button: "0 1px 2px rgba(0,0,0,0.05)" },
      components: { buttonStyle: "solid", navStyle: "transparent" },
    },
  },
  {
    key: "sage-minimal",
    name: "Sage Minimal",
    description: "Light sage green and white minimal theme with understated elegance.",
    isSystem: true,
    isActive: false,
    tokens: {
      colors: { primary: "140 25% 48%", secondary: "150 15% 40%", accent: "130 30% 55%", bg: "140 10% 98%", surface: "140 8% 100%", text: "150 10% 15%" },
      font: { family: "Inter", headingsWeight: "600", bodyWeight: "400" },
      radius: { card: "0.5rem", button: "0.375rem" },
      shadow: { card: "0 1px 2px rgba(0,0,0,0.06)", button: "none" },
      components: { buttonStyle: "outline", navStyle: "transparent" },
    },
  },
  {
    key: "rustic-barn",
    name: "Rustic Barn",
    description: "Deep red and brown rustic theme evoking weathered wood and country landscapes.",
    isSystem: true,
    isActive: false,
    tokens: {
      colors: { primary: "5 55% 38%", secondary: "20 40% 30%", accent: "30 60% 45%", bg: "25 15% 96%", surface: "25 10% 100%", text: "15 15% 12%" },
      font: { family: "Inter", headingsWeight: "700", bodyWeight: "400" },
      radius: { card: "0.375rem", button: "0.25rem" },
      shadow: { card: "0 1px 3px rgba(0,0,0,0.12)", button: "0 1px 2px rgba(0,0,0,0.06)" },
      components: { buttonStyle: "solid", navStyle: "filled" },
    },
  },
];

export async function seedCmsData() {
  console.log("[seed-cms] Starting CMS seed...");

  const blockCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(cmsBlockLibrary);

  if (blockCount[0].count > 0) {
    console.log(`[seed-cms] Blocks already exist (${blockCount[0].count} found), upserting any new blocks...`);
    await db
      .insert(cmsBlockLibrary)
      .values(SYSTEM_BLOCKS)
      .onConflictDoNothing();
  } else {
    console.log(`[seed-cms] Inserting ${SYSTEM_BLOCKS.length} system blocks into cms_block_library...`);
    await db
      .insert(cmsBlockLibrary)
      .values(SYSTEM_BLOCKS)
      .onConflictDoNothing();
    console.log("[seed-cms] System blocks inserted successfully.");
  }

  const presetCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(themePresets);

  if (presetCount[0].count > 0) {
    console.log(`[seed-cms] Theme presets already exist (${presetCount[0].count} found), skipping preset seeding.`);
  } else {
    console.log("[seed-cms] Inserting 10 theme presets...");
    await db
      .insert(themePresets)
      .values(THEME_PRESETS)
      .onConflictDoNothing();
    console.log("[seed-cms] Theme presets inserted successfully.");
  }

  console.log("[seed-cms] CMS seed complete.");
}
