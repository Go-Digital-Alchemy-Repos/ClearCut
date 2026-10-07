import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  DndContext, DragOverlay, closestCenter,
  KeyboardSensor, PointerSensor, useSensor, useSensors,
  DragStartEvent, DragEndEvent, DragOverEvent
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable, arrayMove
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/admin-layout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  GripVertical, Plus, Trash2, Copy, Save, Eye, ArrowLeft,
  Settings, Search, ChevronDown, Type, Image, Layout, Loader2,
  Monitor, Tablet, Smartphone, ShieldCheck, AlertTriangle,
  CheckCircle2, ClipboardCheck, ExternalLink, Link2, ImageIcon, Hash,
  History, RotateCcw, Sparkles
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { BlockInstance, CmsPage, CmsBlock, CmsMediaItem } from "@shared/schema";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const INLINE_EDITABLE: Record<string, string[]> = {
  hero: ["headline", "subheadline"],
  cta_band: ["heading", "buttonText"],
  rich_text: ["content"],
};

interface SortableBlockProps {
  block: BlockInstance;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onInlineEdit: (key: string, value: string) => void;
}

function SortableBlock({ block, isSelected, onSelect, onDelete, onDuplicate, onInlineEdit }: SortableBlockProps) {
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const inlineFields = INLINE_EDITABLE[block.type] || [];
  const propsPreview = inlineFields.length === 0
    ? Object.entries(block.props || {})
        .filter(([, v]) => typeof v === "string")
        .slice(0, 2)
        .map(([k, v]) => `${k}: ${String(v).slice(0, 40)}${String(v).length > 40 ? "..." : ""}`)
        .join(" | ")
    : "";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-md border transition-colors cursor-pointer ${
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border bg-card hover-elevate"
      }`}
      onClick={onSelect}
      data-testid={`canvas-block-${block.id}`}
    >
      <div className="flex items-start gap-2 p-3">
        <button
          className="mt-0.5 cursor-grab text-muted-foreground hover:text-foreground shrink-0"
          {...attributes}
          {...listeners}
          data-testid={`drag-handle-${block.id}`}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm" data-testid={`text-block-label-${block.id}`}>
              {block.meta?.label || block.type}
            </span>
            <Badge variant="secondary" className="text-xs">
              {block.type}
            </Badge>
          </div>
          {inlineFields.length > 0 ? (
            <div className="mt-2 space-y-1.5" onClick={(e) => e.stopPropagation()}>
              {inlineFields.map((fieldKey) => {
                const val = typeof block.props[fieldKey] === "string" ? block.props[fieldKey] : "";
                const isLong = fieldKey === "content" || (val && val.length > 60);
                return isLong ? (
                  <textarea
                    key={fieldKey}
                    value={val}
                    onChange={(e) => onInlineEdit(fieldKey, e.target.value)}
                    placeholder={fieldKey}
                    rows={2}
                    className="w-full text-sm bg-transparent border border-dashed border-muted-foreground/30 rounded px-2 py-1 focus:outline-none focus:border-primary resize-none"
                    data-testid={`inline-edit-${block.id}-${fieldKey}`}
                  />
                ) : (
                  <input
                    key={fieldKey}
                    type="text"
                    value={val}
                    onChange={(e) => onInlineEdit(fieldKey, e.target.value)}
                    placeholder={fieldKey}
                    className="w-full text-sm bg-transparent border-b border-dashed border-muted-foreground/30 px-1 py-0.5 focus:outline-none focus:border-primary"
                    data-testid={`inline-edit-${block.id}-${fieldKey}`}
                  />
                );
              })}
            </div>
          ) : propsPreview ? (
            <p className="text-xs text-muted-foreground mt-1 truncate">{propsPreview}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-0.5 shrink-0 invisible group-hover:visible">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
            data-testid={`button-duplicate-block-${block.id}`}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            data-testid={`button-delete-block-${block.id}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function BlockOverlay({ block }: { block: BlockInstance }) {
  return (
    <div className="rounded-md border border-primary bg-card shadow-lg p-3 w-64">
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">{block.meta?.label || block.type}</span>
        <Badge variant="secondary" className="text-xs">{block.type}</Badge>
      </div>
    </div>
  );
}

function LibraryBlockOverlay({ name, type }: { name: string; type: string }) {
  return (
    <div className="rounded-md border border-primary bg-card shadow-lg p-3 w-56">
      <div className="flex items-center gap-2">
        <Plus className="h-4 w-4 text-primary" />
        <span className="font-medium text-sm">{name}</span>
        <Badge variant="secondary" className="text-xs">{type}</Badge>
      </div>
    </div>
  );
}

export default function CmsPageBuilder() {
  const [, matchNew] = useRoute("/admin/cms/pages/new");
  const [, matchEdit] = useRoute("/admin/cms/pages/:id");
  const pageId = matchEdit?.id;
  const isNew = !!matchNew;
  const editId = !isNew && pageId ? pageId : null;

  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("draft");
  const [blocks, setBlocks] = useState<BlockInstance[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);

  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [jsonLdPreset, setJsonLdPreset] = useState("none");
  const [jsonLdCustom, setJsonLdCustom] = useState("");
  const [seoValidation, setSeoValidation] = useState<{field: string; status: "pass"|"warn"|"fail"; detail: string}[]>([]);

  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeDragSource, setActiveDragSource] = useState<"canvas" | "library" | null>(null);
  const [activeLibraryBlock, setActiveLibraryBlock] = useState<CmsBlock | null>(null);

  const [devicePreview, setDevicePreview] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState<string>("");
  const [showChecklist, setShowChecklist] = useState(false);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [restoreConfirmId, setRestoreConfirmId] = useState<string | null>(null);
  const [revisionMessage, setRevisionMessage] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const { data: libraryBlocks = [], isLoading: blocksLoading } = useQuery<CmsBlock[]>({
    queryKey: ["/api/admin/cms/blocks"],
  });

  const { data: existingPage, isLoading: pageLoading } = useQuery<CmsPage>({
    queryKey: ["/api/admin/cms/pages", editId],
    enabled: !!editId,
  });

  interface PageRevision {
    id: string;
    pageId: string;
    createdAt: string;
    createdBy: string | null;
    message: string | null;
    snapshot: Record<string, any>;
  }

  const { data: revisions = [], isLoading: revisionsLoading } = useQuery<PageRevision[]>({
    queryKey: ["/api/admin/cms/pages", editId, "revisions"],
    enabled: !!editId,
  });

  const createRevisionMutation = useMutation({
    mutationFn: async (msg?: string) => {
      const res = await apiRequest("POST", `/api/admin/cms/pages/${editId}/revisions`, {
        message: msg || undefined,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/pages", editId, "revisions"] });
      toast({ title: "Revision saved" });
      setRevisionMessage("");
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message || "Failed to save revision", variant: "destructive" });
    },
  });

  const restoreRevisionMutation = useMutation({
    mutationFn: async (revId: string) => {
      const res = await apiRequest("POST", `/api/admin/cms/pages/${editId}/revisions/${revId}/restore`);
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/pages", editId] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/pages", editId, "revisions"] });
      setTitle(data.title);
      setSlug(data.slug);
      setSlugManual(true);
      setDescription(data.description || "");
      setStatus(data.status);
      setBlocks(Array.isArray(data.blocks) ? data.blocks as BlockInstance[] : []);
      const seo = (data.seo || {}) as Record<string, any>;
      setSeoTitle(seo.title || "");
      setMetaDescription(seo.metaDescription || seo.description || "");
      setOgTitle(seo.ogTitle || seo.og?.title || "");
      setOgDescription(seo.ogDescription || seo.og?.description || "");
      setOgImage(seo.ogImage || seo.og?.image || "");
      setCanonicalUrl(seo.canonicalUrl || "");
      setJsonLdPreset(seo.schema?.type || "none");
      setJsonLdCustom(seo.schema?.jsonLd || "");
      setRestoreConfirmId(null);
      const restoredSnapshot = JSON.stringify({
        title: data.title,
        slug: data.slug,
        description: data.description || "",
        status: data.status,
        blocks: Array.isArray(data.blocks) ? data.blocks : [],
        seoTitle: seo.title || "",
        metaDescription: seo.metaDescription || seo.description || "",
        ogTitle: seo.ogTitle || seo.og?.title || "",
        ogDescription: seo.ogDescription || seo.og?.description || "",
        ogImage: seo.ogImage || seo.og?.image || "",
      });
      setLastSavedSnapshot(restoredSnapshot);
      toast({ title: "Page restored to revision" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message || "Failed to restore revision", variant: "destructive" });
    },
  });

  useEffect(() => {
    if (existingPage && editId) {
      setTitle(existingPage.title);
      setSlug(existingPage.slug);
      setSlugManual(true);
      setDescription(existingPage.description || "");
      setStatus(existingPage.status);
      setBlocks(Array.isArray(existingPage.blocks) ? existingPage.blocks as BlockInstance[] : []);
      const seo = (existingPage.seo || {}) as Record<string, any>;
      setSeoTitle(seo.title || "");
      setMetaDescription(seo.metaDescription || seo.description || "");
      setOgTitle(seo.ogTitle || seo.og?.title || "");
      setOgDescription(seo.ogDescription || seo.og?.description || "");
      setOgImage(seo.ogImage || seo.og?.image || "");
      setCanonicalUrl(seo.canonicalUrl || "");
      setJsonLdPreset(seo.schema?.type || "none");
      setJsonLdCustom(seo.schema?.jsonLd || "");
    }
  }, [existingPage, editId]);

  useEffect(() => {
    if (!slugManual && title) {
      setSlug(slugify(title));
    }
  }, [title, slugManual]);

  const currentSnapshot = useMemo(
    () => JSON.stringify({ title, slug, description, status, blocks, seoTitle, metaDescription, ogTitle, ogDescription, ogImage, canonicalUrl, jsonLdPreset, jsonLdCustom }),
    [title, slug, description, status, blocks, seoTitle, metaDescription, ogTitle, ogDescription, ogImage, canonicalUrl, jsonLdPreset, jsonLdCustom]
  );

  const hasUnsavedChanges = lastSavedSnapshot !== "" && currentSnapshot !== lastSavedSnapshot;
  const isNewWithContent = isNew && lastSavedSnapshot === "" && (title.trim() !== "" || blocks.length > 0);
  const shouldWarnOnLeave = hasUnsavedChanges || isNewWithContent;
  const isSaved = lastSavedSnapshot !== "" && currentSnapshot === lastSavedSnapshot;

  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const pendingNavigationRef = useRef<string | null>(null);

  const shouldWarnRef = useRef(shouldWarnOnLeave);
  shouldWarnRef.current = shouldWarnOnLeave;

  useEffect(() => {
    if (!shouldWarnOnLeave) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [shouldWarnOnLeave]);

  useEffect(() => {
    const handlePopState = () => {
      if (shouldWarnRef.current) {
        const confirmed = window.confirm("You have unsaved changes. Leave without saving?");
        if (!confirmed) {
          window.history.pushState(null, "", window.location.href);
        }
      }
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const safeNavigate = useCallback((path: string) => {
    if (shouldWarnOnLeave) {
      pendingNavigationRef.current = path;
      setShowLeaveDialog(true);
    } else {
      navigate(path);
    }
  }, [shouldWarnOnLeave, navigate]);

  const confirmLeave = useCallback(() => {
    setShowLeaveDialog(false);
    if (pendingNavigationRef.current) {
      navigate(pendingNavigationRef.current);
      pendingNavigationRef.current = null;
    }
  }, [navigate]);

  const cancelLeave = useCallback(() => {
    setShowLeaveDialog(false);
    pendingNavigationRef.current = null;
  }, []);

  useEffect(() => {
    if (existingPage && editId && lastSavedSnapshot === "") {
      setTimeout(() => {
        setLastSavedSnapshot(JSON.stringify({
          title: existingPage.title,
          slug: existingPage.slug,
          description: existingPage.description || "",
          status: existingPage.status,
          blocks: Array.isArray(existingPage.blocks) ? existingPage.blocks : [],
          seoTitle: ((existingPage.seo as any)?.title || ""),
          metaDescription: ((existingPage.seo as any)?.metaDescription || ""),
          ogTitle: ((existingPage.seo as any)?.ogTitle || ""),
          ogDescription: ((existingPage.seo as any)?.ogDescription || ""),
          ogImage: ((existingPage.seo as any)?.ogImage || ""),
        }));
      }, 100);
    }
  }, [existingPage, editId, lastSavedSnapshot]);

  function validateBlocks(): string[] {
    const warnings: string[] = [];
    const hasHeadline = blocks.some((b) =>
      (b.type === "hero" && b.props.headline) || (b.type === "rich_text" && b.props.content)
    );
    if (!hasHeadline) warnings.push("Missing H1/headline: add a hero or rich_text block with content");

    const hasCtaToQuote = blocks.some((b) => {
      const props = b.props || {};
      return Object.values(props).some((v) => typeof v === "string" && v.includes("/quote"));
    });
    if (!hasCtaToQuote) warnings.push("No CTA linking to /quote found on this page");

    let missingAltCount = 0;
    let invalidLinks: string[] = [];

    for (const block of blocks) {
      const props = block.props || {};

      if (["hero", "image_banner"].includes(block.type)) {
        if (!props.imageUrl) warnings.push(`Block "${block.meta?.label || block.type}": missing image URL`);
        if (props.imageUrl && !props.imageAlt && !props.alt) {
          missingAltCount++;
        }
      }

      for (const [key, val] of Object.entries(props)) {
        if (typeof val === "string" && (key.toLowerCase().includes("href") || key.toLowerCase().includes("url"))) {
          if (val && !val.startsWith("/") && !val.startsWith("http") && !val.startsWith("mailto:") && !val.startsWith("tel:") && !val.startsWith("#")) {
            invalidLinks.push(`Block "${block.meta?.label || block.type}": invalid link "${val}" in ${key}`);
          }
        }
      }

      const blockDef = libraryBlocks.find((lb) => lb.key === block.type);
      if (blockDef?.schema) {
        const schema = blockDef.schema as { fields?: Array<{ key: string; label: string; required?: boolean }> };
        for (const field of schema.fields || []) {
          if (field.required && !props[field.key]) {
            warnings.push(`Block "${block.meta?.label || block.type}": required field "${field.label}" is empty`);
          }
        }
      }
    }

    if (missingAltCount > 0) warnings.push(`${missingAltCount} image(s) missing alt text`);
    invalidLinks.forEach((l) => warnings.push(l));

    if (seoTitle && (seoTitle.length < 30 || seoTitle.length > 60)) {
      warnings.push(`SEO title length: ${seoTitle.length} chars (recommended: 30-60)`);
    }
    if (!seoTitle && !title) warnings.push("Page has no title or SEO title");

    if (metaDescription && (metaDescription.length < 50 || metaDescription.length > 160)) {
      warnings.push(`Meta description length: ${metaDescription.length} chars (recommended: 50-160)`);
    }
    if (!metaDescription) warnings.push("Missing meta description");
    if (!ogImage) warnings.push("Missing OG image for social sharing");

    return warnings;
  }

  async function handlePreview() {
    if (!editId) {
      toast({ title: "Save the page first", description: "Preview requires a saved page", variant: "destructive" });
      return;
    }
    try {
      const res = await apiRequest("POST", `/api/admin/cms/pages/${editId}/preview-token`);
      const data = await res.json();
      const url = `/p/${data.slug}?previewToken=${data.token}`;
      window.open(url, "_blank");
    } catch (err: any) {
      toast({ title: "Preview failed", description: err.message, variant: "destructive" });
    }
  }

  const selectedBlock = useMemo(
    () => blocks.find((b) => b.id === selectedBlockId) || null,
    [blocks, selectedBlockId]
  );

  const selectedBlockDef = useMemo(() => {
    if (!selectedBlock) return null;
    return libraryBlocks.find((lb) => lb.key === selectedBlock.type) || null;
  }, [selectedBlock, libraryBlocks]);

  const groupedBlocks = useMemo(() => {
    const filtered = searchQuery
      ? libraryBlocks.filter(
          (b) =>
            b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.key.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : libraryBlocks;
    const groups: Record<string, CmsBlock[]> = {};
    for (const block of filtered) {
      const cat = block.category || "Other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(block);
    }
    return groups;
  }, [libraryBlocks, searchQuery]);

  const JSON_LD_PRESETS: Record<string, { label: string; generate: () => string }> = {
    LocalBusiness: {
      label: "Local Business",
      generate: () => JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": title || "Clearcut Land Management",
        "description": metaDescription || description,
        "url": canonicalUrl || `/${slug}`,
        "telephone": "",
        "address": { "@type": "PostalAddress", "addressLocality": "Charlotte", "addressRegion": "NC" },
        "areaServed": { "@type": "GeoCircle", "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 35.2271, "longitude": -80.8431 }, "geoRadius": "80467" },
      }, null, 2),
    },
    Service: {
      label: "Service",
      generate: () => JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": title,
        "description": metaDescription || description,
        "provider": { "@type": "LocalBusiness", "name": "Clearcut Land Management" },
        "areaServed": { "@type": "City", "name": "Charlotte, NC" },
        "url": canonicalUrl || `/${slug}`,
      }, null, 2),
    },
    FAQPage: {
      label: "FAQ Page",
      generate: () => {
        const faqBlocks = blocks.filter(b => b.type === "faq");
        const items = faqBlocks.flatMap(b => {
          const qas = b.props.items || b.props.questions || [];
          return qas.map((qa: any) => ({
            "@type": "Question",
            "name": qa.question || qa.q || "",
            "acceptedAnswer": { "@type": "Answer", "text": qa.answer || qa.a || "" },
          }));
        });
        return JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": items.length > 0 ? items : [{ "@type": "Question", "name": "", "acceptedAnswer": { "@type": "Answer", "text": "" } }],
        }, null, 2);
      },
    },
    Article: {
      label: "Article",
      generate: () => JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": seoTitle || title,
        "description": metaDescription || description,
        "image": ogImage || "",
        "author": { "@type": "Organization", "name": "Clearcut Land Management" },
        "publisher": { "@type": "Organization", "name": "Clearcut Land Management" },
        "url": canonicalUrl || `/${slug}`,
      }, null, 2),
    },
  };

  function runSeoValidation() {
    const results: {field: string; status: "pass"|"warn"|"fail"; detail: string}[] = [];
    results.push({
      field: "SEO Title",
      status: seoTitle ? (seoTitle.length >= 30 && seoTitle.length <= 60 ? "pass" : "warn") : "fail",
      detail: seoTitle ? `${seoTitle.length} chars (ideal: 30-60)` : "Missing",
    });
    results.push({
      field: "Meta Description",
      status: metaDescription ? (metaDescription.length >= 50 && metaDescription.length <= 160 ? "pass" : "warn") : "fail",
      detail: metaDescription ? `${metaDescription.length} chars (ideal: 50-160)` : "Missing",
    });
    results.push({
      field: "Canonical URL",
      status: canonicalUrl ? (canonicalUrl.startsWith("http") || canonicalUrl.startsWith("/") ? "pass" : "warn") : "warn",
      detail: canonicalUrl ? canonicalUrl : "Not set (will auto-generate)",
    });
    results.push({
      field: "OG Image",
      status: ogImage ? "pass" : (blocks.some(b => b.type === "hero" && b.props.imageUrl) ? "warn" : "fail"),
      detail: ogImage ? "Set" : (blocks.some(b => b.type === "hero" && b.props.imageUrl) ? "Will fallback to hero image" : "Missing for social sharing"),
    });
    results.push({
      field: "OG Title",
      status: ogTitle ? "pass" : (seoTitle || title ? "warn" : "fail"),
      detail: ogTitle ? `Set (${ogTitle.length} chars)` : "Will fallback to SEO title or page title",
    });
    results.push({
      field: "OG Description",
      status: ogDescription ? "pass" : (metaDescription ? "warn" : "fail"),
      detail: ogDescription ? `Set (${ogDescription.length} chars)` : (metaDescription ? "Will fallback to meta description" : "Missing"),
    });
    const hasNoIndex = status === "draft";
    results.push({
      field: "Robots/Indexability",
      status: hasNoIndex ? "warn" : "pass",
      detail: hasNoIndex ? "Page is draft — not indexable" : "Page is published and indexable",
    });
    if (jsonLdPreset !== "none") {
      let jsonValid = true;
      if (jsonLdCustom) {
        try { JSON.parse(jsonLdCustom); } catch { jsonValid = false; }
      }
      results.push({
        field: "JSON-LD Schema",
        status: jsonValid ? "pass" : "fail",
        detail: jsonValid ? `${jsonLdPreset} preset active` : "Invalid JSON in custom schema",
      });
    } else {
      results.push({
        field: "JSON-LD Schema",
        status: "warn",
        detail: "No structured data preset selected",
      });
    }
    setSeoValidation(results);
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title,
        slug,
        description: description || undefined,
        status,
        pageType: "page" as const,
        blocks,
        seo: {
          title: seoTitle, metaDescription, ogTitle, ogDescription, ogImage,
          canonicalUrl: canonicalUrl || undefined,
          schema: jsonLdPreset !== "none" ? { enabled: true, type: jsonLdPreset, jsonLd: jsonLdCustom || undefined } : undefined,
        },
      };
      if (editId) {
        const res = await apiRequest("PATCH", `/api/admin/cms/pages/${editId}`, payload);
        return res.json();
      }
      const res = await apiRequest("POST", "/api/admin/cms/pages", payload);
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/pages"] });
      setLastSavedSnapshot(currentSnapshot);
      toast({ title: editId ? "Page saved" : "Page created" });
      if (!editId && data?.id) {
        navigate(`/admin/cms/pages/${data.id}`);
      }
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to save page",
        variant: "destructive",
      });
    },
  });

  function handleDragStart(event: DragStartEvent) {
    const id = String(event.active.id);
    if (id.startsWith("library-")) {
      const blockKey = id.replace("library-", "");
      const libBlock = libraryBlocks.find((b) => b.key === blockKey);
      setActiveDragSource("library");
      setActiveDragId(id);
      setActiveLibraryBlock(libBlock || null);
    } else {
      setActiveDragSource("canvas");
      setActiveDragId(id);
      setActiveLibraryBlock(null);
    }
  }

  function handleDragOver(_event: DragOverEvent) {}

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (activeDragSource === "library" && activeLibraryBlock) {
      const newBlock: BlockInstance = {
        id: crypto.randomUUID(),
        type: activeLibraryBlock.key,
        props: { ...(activeLibraryBlock.defaultProps as Record<string, any> || {}) },
        meta: { label: activeLibraryBlock.name },
      };

      if (over) {
        const overIndex = blocks.findIndex((b) => b.id === String(over.id));
        if (overIndex >= 0) {
          const updated = [...blocks];
          updated.splice(overIndex, 0, newBlock);
          setBlocks(updated);
        } else {
          setBlocks((prev) => [...prev, newBlock]);
        }
      } else {
        setBlocks((prev) => [...prev, newBlock]);
      }
      setSelectedBlockId(newBlock.id);
    } else if (activeDragSource === "canvas" && over) {
      const oldIndex = blocks.findIndex((b) => b.id === String(active.id));
      const newIndex = blocks.findIndex((b) => b.id === String(over.id));
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setBlocks((prev) => arrayMove(prev, oldIndex, newIndex));
      }
    }

    setActiveDragId(null);
    setActiveDragSource(null);
    setActiveLibraryBlock(null);
  }

  function addBlockFromLibrary(libBlock: CmsBlock) {
    const newBlock: BlockInstance = {
      id: crypto.randomUUID(),
      type: libBlock.key,
      props: { ...(libBlock.defaultProps as Record<string, any> || {}) },
      meta: { label: libBlock.name },
    };
    setBlocks((prev) => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  }

  function deleteBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  }

  function duplicateBlock(id: string) {
    const block = blocks.find((b) => b.id === id);
    if (!block) return;
    const newBlock: BlockInstance = {
      ...block,
      id: crypto.randomUUID(),
      meta: { ...block.meta, label: `${block.meta?.label || block.type} (copy)` },
    };
    const idx = blocks.findIndex((b) => b.id === id);
    const updated = [...blocks];
    updated.splice(idx + 1, 0, newBlock);
    setBlocks(updated);
    setSelectedBlockId(newBlock.id);
  }

  function updateBlockProp(blockId: string, key: string, value: any) {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId ? { ...b, props: { ...b.props, [key]: value } } : b
      )
    );
  }

  const activeDragBlock = activeDragSource === "canvas"
    ? blocks.find((b) => b.id === activeDragId) || null
    : null;

  if (!isNew && pageLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" data-testid="loader-page-builder" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        <div className="sticky top-0 z-10 border-b bg-card px-4 py-2.5 flex items-center gap-3 flex-wrap">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => safeNavigate("/admin/cms/pages")}
            data-testid="button-back-to-pages"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1 min-w-[200px] flex items-center gap-3 flex-wrap">
            <Input
              placeholder="Page title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="max-w-xs"
              data-testid="input-page-title"
            />
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span>/</span>
              <Input
                placeholder="slug"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
                className="w-40"
                data-testid="input-page-slug"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 border rounded-md p-0.5" data-testid="device-switcher">
            {([
              { key: "desktop" as const, icon: Monitor, label: "Desktop" },
              { key: "tablet" as const, icon: Tablet, label: "Tablet" },
              { key: "mobile" as const, icon: Smartphone, label: "Mobile" },
            ]).map(({ key, icon: Icon, label }) => (
              <Button
                key={key}
                variant={devicePreview === key ? "default" : "ghost"}
                size="icon"
                onClick={() => setDevicePreview(key)}
                title={label}
                data-testid={`button-device-${key}`}
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-2" data-testid="text-save-status">
              {saveMutation.isPending ? (
                <span className="text-muted-foreground">Saving...</span>
              ) : hasUnsavedChanges || isNewWithContent ? (
                <span className="text-amber-600 dark:text-amber-400 font-medium flex flex-wrap items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Unsaved changes
                </span>
              ) : isSaved ? (
                <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Saved
                </span>
              ) : null}
            </span>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[120px]" data-testid="select-page-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const w = validateBlocks();
                setValidationWarnings(w);
                setShowChecklist(true);
                setShowRightPanel(true);
                if (w.length === 0) toast({ title: "All checks passed" });
                else toast({ title: `${w.length} warning(s) found`, variant: "destructive" });
              }}
              title="Validate Page"
              data-testid="button-validate-page"
            >
              <ShieldCheck className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handlePreview}
              title="Preview page"
              data-testid="button-preview-page"
            >
              <Eye className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLeftPanel(!showLeftPanel)}
              className="lg:hidden"
              data-testid="button-toggle-left-panel"
            >
              <Layout className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowRightPanel(!showRightPanel)}
              className="lg:hidden"
              data-testid="button-toggle-right-panel"
            >
              <Settings className="h-4 w-4" />
            </Button>

            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !title || !slug}
              className="gap-2"
              data-testid="button-save-page"
            >
              <Save className="h-4 w-4" />
              {saveMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-1 overflow-hidden">
            <aside
              className={`w-60 border-r bg-card flex flex-col shrink-0 overflow-hidden ${
                showLeftPanel ? "block" : "hidden lg:block"
              }`}
              data-testid="panel-block-library"
            >
              <div className="p-3 border-b">
                <h2 className="text-sm font-semibold mb-2">Blocks</h2>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search blocks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 text-sm"
                    data-testid="input-search-blocks"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-3">
                {blocksLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : Object.keys(groupedBlocks).length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No blocks found</p>
                ) : (
                  Object.entries(groupedBlocks).map(([category, catBlocks]) => (
                    <div key={category}>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-1">
                        {category}
                      </p>
                      <div className="space-y-1">
                        {catBlocks.map((lb) => (
                          <LibraryBlockItem
                            key={lb.key}
                            block={lb}
                            onAdd={() => addBlockFromLibrary(lb)}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </aside>

            <div
              className="flex-1 overflow-y-auto bg-muted/30 p-4 flex justify-center"
              data-testid="canvas-area"
            >
              <div
                className="w-full transition-all duration-300"
                style={{
                  maxWidth: devicePreview === "mobile" ? "375px" : devicePreview === "tablet" ? "768px" : "100%",
                }}
                data-testid={`canvas-viewport-${devicePreview}`}
              >
                {blocks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Layout className="h-12 w-12 text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground text-sm mb-1">No blocks added yet</p>
                    <p className="text-xs text-muted-foreground">
                      Drag blocks from the left panel or click the + button to add blocks
                    </p>
                  </div>
                ) : (
                  <SortableContext
                    items={blocks.map((b) => b.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2 max-w-2xl mx-auto">
                      {blocks.map((block) => (
                        <SortableBlock
                          key={block.id}
                          block={block}
                          isSelected={selectedBlockId === block.id}
                          onSelect={() => setSelectedBlockId(block.id)}
                          onDelete={() => deleteBlock(block.id)}
                          onDuplicate={() => duplicateBlock(block.id)}
                          onInlineEdit={(key, value) => updateBlockProp(block.id, key, value)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                )}
              </div>
            </div>

            <aside
              className={`w-[300px] border-l bg-card flex flex-col shrink-0 overflow-hidden ${
                showRightPanel ? "block" : "hidden lg:block"
              }`}
              data-testid="panel-inspector"
            >
              <Tabs defaultValue={showChecklist ? "checklist" : "block"} className="flex flex-col h-full">
                <div className="border-b px-3 pt-2">
                  <TabsList className="w-full">
                    <TabsTrigger value="block" className="flex-1" data-testid="tab-block">
                      Block
                    </TabsTrigger>
                    <TabsTrigger value="seo" className="flex-1" data-testid="tab-seo">
                      SEO
                    </TabsTrigger>
                    <TabsTrigger value="checklist" className="flex-1" data-testid="tab-checklist">
                      Check
                    </TabsTrigger>
                    {editId && (
                      <TabsTrigger value="revisions" className="flex-1" data-testid="tab-revisions">
                        <History className="h-3.5 w-3.5" />
                      </TabsTrigger>
                    )}
                  </TabsList>
                </div>

                <TabsContent value="block" className="flex-1 overflow-y-auto p-3 mt-0 space-y-4">
                  {!selectedBlock ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                      <Settings className="h-8 w-8 text-muted-foreground/40 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Select a block on the canvas to edit its properties
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <h3 className="text-sm font-semibold">
                            {selectedBlock.meta?.label || selectedBlock.type}
                          </h3>
                          <Badge variant="secondary" className="text-xs">{selectedBlock.type}</Badge>
                        </div>
                      </div>
                      <BlockPropertyEditor
                        block={selectedBlock}
                        blockDef={selectedBlockDef}
                        onPropChange={(key, value) => updateBlockProp(selectedBlock.id, key, value)}
                      />
                    </>
                  )}
                </TabsContent>

                <TabsContent value="seo" className="flex-1 overflow-y-auto p-3 mt-0 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">SEO Settings</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            const res = await apiRequest("POST", "/api/admin/cms/ai/seo-suggest", {
                              title,
                              blocks,
                            });
                            const data = await res.json();
                            setSeoTitle(data.title);
                            setMetaDescription(data.description);
                            setOgTitle(data.ogTitle || data.title);
                            setOgDescription(data.ogDescription || data.description);
                            toast({ title: "SEO suggestions applied" });
                          } catch (err: any) {
                            toast({ title: "AI Assistant failed", description: err.message, variant: "destructive" });
                          }
                        }}
                        data-testid="button-ai-seo"
                      >
                        <Sparkles className="h-3.5 w-3.5 mr-1" />
                        AI Assistant
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={runSeoValidation}
                        data-testid="button-validate-seo"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                        Validate SEO
                      </Button>
                    </div>
                  </div>

                  {seoValidation.length > 0 && (
                    <Card className="p-3 space-y-1.5">
                      {seoValidation.map((v, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs" data-testid={`seo-validation-${v.field.toLowerCase().replace(/\s+/g, "-")}`}>
                          {v.status === "pass" && <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />}
                          {v.status === "warn" && <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                          {v.status === "fail" && <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />}
                          <span className="font-medium">{v.field}:</span>
                          <span className="text-muted-foreground">{v.detail}</span>
                        </div>
                      ))}
                    </Card>
                  )}

                  <div>
                    <Label htmlFor="seo-title" className="text-xs">SEO Title</Label>
                    <Input
                      id="seo-title"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder="Page title for search engines"
                      data-testid="input-seo-title"
                    />
                    {seoTitle && <span className="text-xs text-muted-foreground">{seoTitle.length}/60 chars</span>}
                  </div>
                  <div>
                    <Label htmlFor="seo-meta-desc" className="text-xs">Meta Description</Label>
                    <Textarea
                      id="seo-meta-desc"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Brief description for search results"
                      rows={3}
                      data-testid="textarea-seo-meta-description"
                    />
                    {metaDescription && <span className="text-xs text-muted-foreground">{metaDescription.length}/160 chars</span>}
                  </div>
                  <div>
                    <Label htmlFor="seo-canonical" className="text-xs">Canonical URL</Label>
                    <Input
                      id="seo-canonical"
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      placeholder="https://... (auto-generated if empty)"
                      data-testid="input-seo-canonical"
                    />
                    <span className="text-xs text-muted-foreground">Leave empty to auto-generate from slug</span>
                  </div>
                  <div>
                    <Label htmlFor="seo-og-title" className="text-xs">OG Title</Label>
                    <Input
                      id="seo-og-title"
                      value={ogTitle}
                      onChange={(e) => setOgTitle(e.target.value)}
                      placeholder="Open Graph title"
                      data-testid="input-seo-og-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo-og-desc" className="text-xs">OG Description</Label>
                    <Textarea
                      id="seo-og-desc"
                      value={ogDescription}
                      onChange={(e) => setOgDescription(e.target.value)}
                      placeholder="Open Graph description"
                      rows={3}
                      data-testid="textarea-seo-og-description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seo-og-image" className="text-xs">OG Image URL</Label>
                    <Input
                      id="seo-og-image"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      placeholder="https://... (falls back to hero image)"
                      data-testid="input-seo-og-image"
                    />
                    {!ogImage && blocks.some(b => b.type === "hero" && b.props.imageUrl) && (
                      <span className="text-xs text-muted-foreground">Will use hero image as fallback</span>
                    )}
                  </div>

                  <div className="pt-2 border-t">
                    <Label className="text-xs font-semibold">JSON-LD Structured Data</Label>
                    <Select value={jsonLdPreset} onValueChange={(val) => {
                      setJsonLdPreset(val);
                      if (val !== "none" && JSON_LD_PRESETS[val]) {
                        setJsonLdCustom(JSON_LD_PRESETS[val].generate());
                      } else {
                        setJsonLdCustom("");
                      }
                    }}>
                      <SelectTrigger className="mt-1" data-testid="select-jsonld-preset">
                        <SelectValue placeholder="Select preset..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {Object.entries(JSON_LD_PRESETS).map(([key, preset]) => (
                          <SelectItem key={key} value={key}>{preset.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {jsonLdPreset !== "none" && (
                      <div className="mt-2">
                        <Label htmlFor="jsonld-custom" className="text-xs">Schema JSON</Label>
                        <Textarea
                          id="jsonld-custom"
                          value={jsonLdCustom}
                          onChange={(e) => setJsonLdCustom(e.target.value)}
                          rows={8}
                          className="font-mono text-xs"
                          data-testid="textarea-jsonld-custom"
                        />
                        <div className="flex items-center gap-2 mt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (JSON_LD_PRESETS[jsonLdPreset]) {
                                setJsonLdCustom(JSON_LD_PRESETS[jsonLdPreset].generate());
                                toast({ title: "JSON-LD regenerated from preset" });
                              }
                            }}
                            data-testid="button-regenerate-jsonld"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Regenerate
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              try {
                                JSON.parse(jsonLdCustom);
                                toast({ title: "JSON-LD is valid" });
                              } catch {
                                toast({ title: "Invalid JSON", variant: "destructive" });
                              }
                            }}
                            data-testid="button-validate-jsonld"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Validate
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="checklist" className="flex-1 overflow-y-auto p-3 mt-0 space-y-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold flex items-center gap-1.5">
                      <ClipboardCheck className="h-4 w-4" />
                      Content Checklist
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setValidationWarnings(validateBlocks())}
                      data-testid="button-run-checklist"
                    >
                      Refresh
                    </Button>
                  </div>

                  <ChecklistItem
                    label="Page title"
                    status={title ? (title.length >= 10 ? "pass" : "warn") : "fail"}
                    detail={title ? `${title.length} chars` : "Missing"}
                  />
                  <ChecklistItem
                    label="SEO title (30-60 chars)"
                    status={seoTitle ? (seoTitle.length >= 30 && seoTitle.length <= 60 ? "pass" : "warn") : "warn"}
                    detail={seoTitle ? `${seoTitle.length} chars` : "Not set"}
                  />
                  <ChecklistItem
                    label="Meta description (50-160)"
                    status={metaDescription ? (metaDescription.length >= 50 && metaDescription.length <= 160 ? "pass" : "warn") : "fail"}
                    detail={metaDescription ? `${metaDescription.length} chars` : "Missing"}
                  />
                  <ChecklistItem
                    label="OG Image"
                    status={ogImage ? "pass" : "warn"}
                    detail={ogImage ? "Set" : "Missing for social sharing"}
                  />
                  <ChecklistItem
                    label="H1/Headline present"
                    status={blocks.some((b) => (b.type === "hero" && b.props.headline) || (b.type === "rich_text" && b.props.content)) ? "pass" : "fail"}
                    detail={blocks.some((b) => b.type === "hero" && b.props.headline) ? "Hero headline found" : blocks.some((b) => b.type === "rich_text" && b.props.content) ? "Rich text found" : "No headline block"}
                  />
                  <ChecklistItem
                    label="CTA to /quote"
                    status={blocks.some((b) => Object.values(b.props || {}).some((v) => typeof v === "string" && v.includes("/quote"))) ? "pass" : "warn"}
                    detail="Internal link to quote form"
                  />
                  <ChecklistItem
                    label="Alt text coverage"
                    status={(() => {
                      const imgBlocks = blocks.filter((b) => ["hero", "image_banner"].includes(b.type) && b.props.imageUrl);
                      if (imgBlocks.length === 0) return "pass";
                      const missing = imgBlocks.filter((b) => !b.props.imageAlt && !b.props.alt).length;
                      return missing === 0 ? "pass" : "fail";
                    })()}
                    detail={(() => {
                      const imgBlocks = blocks.filter((b) => ["hero", "image_banner"].includes(b.type) && b.props.imageUrl);
                      const missing = imgBlocks.filter((b) => !b.props.imageAlt && !b.props.alt).length;
                      return missing > 0 ? `${missing} image(s) missing alt` : "All images have alt text";
                    })()}
                  />
                  <ChecklistItem
                    label="Link validation"
                    status={(() => {
                      for (const block of blocks) {
                        for (const [key, val] of Object.entries(block.props || {})) {
                          if (typeof val === "string" && (key.toLowerCase().includes("href") || key.toLowerCase().includes("url"))) {
                            if (val && !val.startsWith("/") && !val.startsWith("http") && !val.startsWith("mailto:") && !val.startsWith("tel:") && !val.startsWith("#")) return "fail";
                          }
                        }
                      }
                      return "pass";
                    })()}
                    detail="All links use valid format"
                  />

                  {validationWarnings.length > 0 && (
                    <div className="mt-4 pt-3 border-t">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Validation Warnings ({validationWarnings.length})
                      </h4>
                      <div className="space-y-1.5">
                        {validationWarnings.map((w, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{w}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                {editId && (
                  <TabsContent value="revisions" className="flex-1 overflow-y-auto p-3 mt-0 space-y-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-sm font-semibold flex items-center gap-1.5">
                        <History className="h-4 w-4" />
                        Revisions
                      </h3>
                      <Badge variant="secondary" className="text-xs">{revisions.length}</Badge>
                    </div>

                    <div className="space-y-2">
                      <Input
                        placeholder="Revision note (optional)"
                        value={revisionMessage}
                        onChange={(e) => setRevisionMessage(e.target.value)}
                        className="text-xs"
                        data-testid="input-revision-message"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1.5"
                        onClick={() => createRevisionMutation.mutate(revisionMessage)}
                        disabled={createRevisionMutation.isPending}
                        data-testid="button-save-revision"
                      >
                        <Save className="h-3.5 w-3.5" />
                        {createRevisionMutation.isPending ? "Saving..." : "Save Revision"}
                      </Button>
                    </div>

                    <div className="border-t pt-3 space-y-2">
                      {revisionsLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                      ) : revisions.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          No revisions yet. Save a revision to create a snapshot of the current page state.
                        </p>
                      ) : (
                        revisions.map((rev) => {
                          const snap = rev.snapshot as Record<string, any>;
                          const blockCount = Array.isArray(snap.blocks) ? snap.blocks.length : 0;
                          const date = new Date(rev.createdAt);
                          return (
                            <Card key={rev.id} className="overflow-visible" data-testid={`card-revision-${rev.id}`}>
                              <CardContent className="p-3 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium truncate" data-testid={`text-revision-message-${rev.id}`}>
                                      {rev.message || "Manual save"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                  </div>
                                  <Badge variant="secondary" className="text-xs shrink-0">
                                    {snap.status || "draft"}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span>{blockCount} block{blockCount !== 1 ? "s" : ""}</span>
                                  <span className="truncate" title={snap.slug}>/{snap.slug}</span>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full gap-1.5"
                                  onClick={() => setRestoreConfirmId(rev.id)}
                                  data-testid={`button-restore-revision-${rev.id}`}
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                  Restore
                                </Button>
                              </CardContent>
                            </Card>
                          );
                        })
                      )}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </aside>
          </div>

          <Dialog open={!!restoreConfirmId} onOpenChange={(open) => { if (!open) setRestoreConfirmId(null); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Restore revision?</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                This will replace the current page content with the selected revision snapshot.
                The current state will not be saved automatically — save a revision first if you want to preserve it.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRestoreConfirmId(null)} data-testid="button-cancel-restore">
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (restoreConfirmId) restoreRevisionMutation.mutate(restoreConfirmId);
                  }}
                  disabled={restoreRevisionMutation.isPending}
                  data-testid="button-confirm-restore"
                >
                  {restoreRevisionMutation.isPending ? "Restoring..." : "Restore"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DragOverlay>
            {activeDragId && activeDragSource === "canvas" && activeDragBlock ? (
              <BlockOverlay block={activeDragBlock} />
            ) : null}
            {activeDragId && activeDragSource === "library" && activeLibraryBlock ? (
              <LibraryBlockOverlay name={activeLibraryBlock.name} type={activeLibraryBlock.key} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes on this page. If you leave now, your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelLeave} data-testid="button-cancel-leave">
              Keep Editing
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmLeave} data-testid="button-confirm-leave">
              Leave Without Saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

function LibraryBlockItem({ block, onAdd }: { block: CmsBlock; onAdd: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: `library-${block.key}`,
    data: { type: "library", block },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const iconMap: Record<string, any> = {
    Layers: Layout,
    FileText: Type,
    Image: Image,
    Grid3x3: Layout,
    Briefcase: Layout,
    MessageSquare: Type,
    Megaphone: Type,
    HelpCircle: Type,
    FormInput: Type,
    MapPin: Layout,
    BarChart3: Layout,
  };
  const IconComp = iconMap[block.icon || ""] || Type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-grab hover-elevate"
      data-testid={`library-block-${block.key}`}
    >
      <IconComp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <span className="flex-1 truncate text-sm">{block.name}</span>
      <button
        className="text-muted-foreground hover:text-foreground shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onAdd();
        }}
        data-testid={`button-add-block-${block.key}`}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

interface BlockPropertyEditorProps {
  block: BlockInstance;
  blockDef: CmsBlock | null;
  onPropChange: (key: string, value: any) => void;
}

function isImageField(key: string): boolean {
  const lk = key.toLowerCase();
  return lk === "imageurl" || lk === "image_url" || lk === "backgroundimage" || lk === "featuredimageurl" || lk === "ogimage" || lk === "src";
}

function ImageFieldWithPicker({ fieldKey, label, value, onPropChange, onAltSuggest }: {
  fieldKey: string;
  label: string;
  value: string;
  onPropChange: (key: string, value: any) => void;
  onAltSuggest?: (alt: string) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="space-y-1.5">
        <Input
          value={value}
          onChange={(e) => onPropChange(fieldKey, e.target.value)}
          placeholder="https://... or /uploads/..."
          data-testid={`input-prop-${fieldKey}`}
        />
        {value && (
          <div className="h-16 w-full rounded-md bg-muted overflow-hidden">
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1.5"
          onClick={() => setPickerOpen(true)}
          data-testid={`button-media-picker-${fieldKey}`}
        >
          <ImageIcon className="h-3.5 w-3.5" /> Choose from Media Library
        </Button>
      </div>
      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(item) => {
          onPropChange(fieldKey, item.url);
          if (item.alt && onAltSuggest) onAltSuggest(item.alt);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (item: CmsMediaItem) => void;
}

function MediaPickerDialog({ open, onOpenChange, onSelect }: MediaPickerDialogProps) {
  const [search, setSearch] = useState("");
  const { data } = useQuery<{ items: CmsMediaItem[]; total: number }>({
    queryKey: ["/api/admin/cms/media", { search, pageSize: 50 }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("pageSize", "50");
      const res = await fetch(`/api/admin/cms/media?${params}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: open,
  });

  const items = data?.items || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select from Media Library</DialogTitle>
        </DialogHeader>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-media-picker-search"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">
              {search ? "No results." : "No media uploaded yet."}
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer rounded-md border border-border overflow-hidden hover-elevate"
                  onClick={() => onSelect(item)}
                  data-testid={`media-picker-item-${item.id}`}
                >
                  <div className="aspect-square bg-muted overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.alt || item.title || ""}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-1.5">
                    <p className="text-xs truncate">{item.title || "Untitled"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BlockPropertyEditor({ block, blockDef, onPropChange }: BlockPropertyEditorProps) {
  const schema = blockDef?.schema as { fields?: Array<{
    key: string;
    label: string;
    type: string;
    options?: string[];
    itemFields?: Array<{ key: string; label: string; type: string }>;
  }> } | null;

  const fields = schema?.fields || [];

  if (fields.length === 0) {
    return (
      <div className="space-y-3">
        {Object.entries(block.props).map(([key, value]) => {
          if (isImageField(key)) {
            return (
              <ImageFieldWithPicker
                key={key}
                fieldKey={key}
                label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                value={typeof value === "string" ? value : ""}
                onPropChange={onPropChange}
                onAltSuggest={(alt) => {
                  const candidates = [
                    key.replace(/[Uu]rl$/, "Alt"),
                    "imageAlt",
                    key + "Alt",
                  ];
                  const targetKey = candidates.find((k) => k !== key && k in block.props);
                  if (targetKey && !block.props[targetKey]) onPropChange(targetKey, alt);
                }}
              />
            );
          }
          return (
            <div key={key}>
              <Label className="text-xs capitalize">{key}</Label>
              {typeof value === "string" && value.length > 80 ? (
                <Textarea
                  value={value}
                  onChange={(e) => onPropChange(key, e.target.value)}
                  rows={3}
                  data-testid={`input-prop-${key}`}
                />
              ) : typeof value === "string" ? (
                <Input
                  value={value}
                  onChange={(e) => onPropChange(key, e.target.value)}
                  data-testid={`input-prop-${key}`}
                />
              ) : (
                <Input
                  value={JSON.stringify(value)}
                  readOnly
                  className="text-muted-foreground"
                  data-testid={`input-prop-${key}`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {fields.map((field) => {
        const value = block.props[field.key];

        if (isImageField(field.key) || field.type === "image") {
          return (
            <ImageFieldWithPicker
              key={field.key}
              fieldKey={field.key}
              label={field.label}
              value={typeof value === "string" ? value : ""}
              onPropChange={onPropChange}
              onAltSuggest={(alt) => {
                const altKey = field.key.replace(/[Uu]rl$/, "Alt");
                const altField = fields.find((f) => f.key === altKey || f.key === "imageAlt");
                if (altField && !block.props[altField.key]) {
                  onPropChange(altField.key, alt);
                }
              }}
            />
          );
        }

        if (field.type === "text") {
          return (
            <div key={field.key}>
              <Label className="text-xs">{field.label}</Label>
              <Input
                value={typeof value === "string" ? value : ""}
                onChange={(e) => onPropChange(field.key, e.target.value)}
                data-testid={`input-prop-${field.key}`}
              />
            </div>
          );
        }

        if (field.type === "textarea") {
          return (
            <div key={field.key}>
              <Label className="text-xs">{field.label}</Label>
              <Textarea
                value={typeof value === "string" ? value : ""}
                onChange={(e) => onPropChange(field.key, e.target.value)}
                rows={3}
                data-testid={`textarea-prop-${field.key}`}
              />
            </div>
          );
        }

        if (field.type === "select" && field.options) {
          return (
            <div key={field.key}>
              <Label className="text-xs">{field.label}</Label>
              <Select
                value={typeof value === "string" ? value : ""}
                onValueChange={(v) => onPropChange(field.key, v)}
              >
                <SelectTrigger data-testid={`select-prop-${field.key}`}>
                  <SelectValue placeholder={`Select ${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }

        if (field.type === "array") {
          const items = Array.isArray(value) ? value : [];
          return (
            <div key={field.key}>
              <Label className="text-xs">{field.label}</Label>
              <div className="space-y-2 mt-1">
                {items.map((item: any, idx: number) => (
                  <Card key={idx} className="p-2">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs text-muted-foreground">Item {idx + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const updated = items.filter((_: any, i: number) => i !== idx);
                          onPropChange(field.key, updated);
                        }}
                        data-testid={`button-remove-array-item-${field.key}-${idx}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    {field.itemFields ? (
                      <div className="space-y-1.5">
                        {field.itemFields.map((subField) => {
                          if (subField.type === "image" || isImageField(subField.key)) {
                            return (
                              <ImageFieldWithPicker
                                key={subField.key}
                                fieldKey={`array-${field.key}-${idx}-${subField.key}`}
                                label={subField.label}
                                value={typeof item[subField.key] === "string" ? item[subField.key] : ""}
                                onPropChange={(_k, val) => {
                                  const updated = [...items];
                                  updated[idx] = { ...updated[idx], [subField.key]: val };
                                  onPropChange(field.key, updated);
                                }}
                              />
                            );
                          }
                          return (
                            <div key={subField.key}>
                              <Label className="text-xs text-muted-foreground">{subField.label}</Label>
                              <Input
                                value={typeof item[subField.key] === "string" ? item[subField.key] : ""}
                                onChange={(e) => {
                                  const updated = [...items];
                                  updated[idx] = { ...updated[idx], [subField.key]: e.target.value };
                                  onPropChange(field.key, updated);
                                }}
                                className="text-sm"
                                data-testid={`input-array-${field.key}-${idx}-${subField.key}`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <Input
                        value={typeof item === "string" ? item : JSON.stringify(item)}
                        onChange={(e) => {
                          const updated = [...items];
                          updated[idx] = e.target.value;
                          onPropChange(field.key, updated);
                        }}
                        data-testid={`input-array-${field.key}-${idx}`}
                      />
                    )}
                  </Card>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1"
                  onClick={() => {
                    const newItem = field.itemFields
                      ? Object.fromEntries(field.itemFields.map((f) => [f.key, ""]))
                      : "";
                    onPropChange(field.key, [...items, newItem]);
                  }}
                  data-testid={`button-add-array-item-${field.key}`}
                >
                  <Plus className="h-3 w-3" /> Add Item
                </Button>
              </div>
            </div>
          );
        }

        return (
          <div key={field.key}>
            <Label className="text-xs">{field.label}</Label>
            <Input
              value={typeof value === "string" ? value : JSON.stringify(value || "")}
              onChange={(e) => onPropChange(field.key, e.target.value)}
              data-testid={`input-prop-${field.key}`}
            />
          </div>
        );
      })}
    </div>
  );
}

function ChecklistItem({ label, status, detail }: { label: string; status: "pass" | "warn" | "fail"; detail: string }) {
  return (
    <div className="flex items-start gap-2 py-1.5" data-testid={`checklist-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      {status === "pass" ? (
        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
      ) : status === "warn" ? (
        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}
