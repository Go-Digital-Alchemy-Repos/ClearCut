import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import AdminLayout from "@/components/admin/admin-layout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye, FileText, Search, ChevronDown, ChevronUp, CircleCheck, CircleAlert } from "lucide-react";
import DOMPurify from "dompurify";
import type { BlogPost } from "@shared/schema";

const CATEGORIES = [
  "Forestry Mulching", "Land Clearing", "Brush Removal", "Lot Clearing",
  "Storm Cleanup", "Stump Grinding", "Driveway/Trail Cutting", "Pricing",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, (match) => `<ul class="my-3 space-y-1">${match}</ul>`)
    .replace(/\n\n/g, '</p><p class="mb-4 text-muted-foreground leading-relaxed">')
    .replace(/^(?!<[hul])/m, '<p class="mb-4 text-muted-foreground leading-relaxed">')
    + '</p>';
}

function SeoScoreIndicator({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {ok ? (
        <CircleCheck className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
      ) : (
        <CircleAlert className="h-4 w-4 text-amber-500 shrink-0" />
      )}
      <span className={ok ? "text-muted-foreground" : "text-foreground"}>{label}</span>
    </div>
  );
}

export default function AdminBlogEditor() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const isNew = id === "new";

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [status, setStatus] = useState("draft");
  const [slugManual, setSlugManual] = useState(false);

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["/api/admin/blog", id],
    queryFn: () => fetch(`/api/admin/blog/${id}`, { credentials: "include" }).then(r => r.json()),
    enabled: !isNew,
  });

  useEffect(() => {
    if (post && !isNew) {
      setTitle(post.title);
      setSlug(post.slug);
      setExcerpt(post.excerpt);
      setContent(post.content);
      setCategory(post.category);
      setTags((post.tags || []).join(", "));
      setFeaturedImageUrl(post.featuredImageUrl || "");
      setStatus(post.status);
      setSlugManual(true);
      setMetaTitle(post.metaTitle || "");
      setMetaDescription(post.metaDescription || "");
      setCanonicalUrl(post.canonicalUrl || "");
      setOgImageUrl(post.ogImageUrl || "");
      setFocusKeyword(post.focusKeyword || "");
    }
  }, [post, isNew]);

  useEffect(() => {
    if (!slugManual && title) {
      setSlug(slugify(title));
    }
  }, [title, slugManual]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        title,
        slug,
        excerpt,
        content,
        category,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        featuredImageUrl: featuredImageUrl || null,
        status,
        publishedAt: status === "published" ? (post?.publishedAt || new Date().toISOString()) : null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        canonicalUrl: canonicalUrl || null,
        ogImageUrl: ogImageUrl || null,
        focusKeyword: focusKeyword || null,
      };
      if (isNew) {
        return apiRequest("POST", "/api/admin/blog", body);
      }
      return apiRequest("PATCH", `/api/admin/blog/${id}`, body);
    },
    onSuccess: async (res) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({ title: isNew ? "Post created" : "Post saved" });
      if (isNew) {
        const data = await res.json();
        navigate(`/admin/cms/blog/${data.id}`);
      }
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message || "Failed to save post", variant: "destructive" });
    },
  });

  const effectiveMetaTitle = metaTitle || (title ? `${title} | Clearcut Land Management Blog` : "");
  const effectiveMetaDesc = metaDescription || excerpt;
  const metaTitleLen = effectiveMetaTitle.length;
  const metaDescLen = effectiveMetaDesc.length;

  const seoChecks = {
    titleLength: metaTitleLen >= 30 && metaTitleLen <= 60,
    descLength: metaDescLen >= 120 && metaDescLen <= 160,
    hasKeyword: !!focusKeyword,
    keywordInTitle: !!focusKeyword && effectiveMetaTitle.toLowerCase().includes(focusKeyword.toLowerCase()),
    keywordInDesc: !!focusKeyword && effectiveMetaDesc.toLowerCase().includes(focusKeyword.toLowerCase()),
    hasSlug: !!slug,
  };
  const seoScore = Object.values(seoChecks).filter(Boolean).length;
  const seoTotal = Object.keys(seoChecks).length;

  if (!isNew && isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="h-8 bg-muted/30 animate-pulse rounded w-1/3 mb-6" />
          <div className="h-96 bg-muted/30 animate-pulse rounded" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/cms/blog")} data-testid="button-back-to-list">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold" data-testid="text-editor-title">
              {isNew ? "New Post" : "Edit Post"}
            </h1>
            <Badge variant={status === "published" ? "default" : "secondary"}>{status}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[130px]" data-testid="select-post-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !title || !slug || !excerpt || !content || !category}
              className="gap-2"
              data-testid="button-save-post"
            >
              <Save className="h-4 w-4" />
              {saveMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              data-testid="input-post-title"
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
              placeholder="post-url-slug"
              data-testid="input-post-slug"
            />
            <p className="text-xs text-muted-foreground mt-1">URL: /blog/{slug || "..."}</p>
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-testid="select-post-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="charlotte, land clearing, tips"
                data-testid="input-post-tags"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description for blog listing..."
              rows={2}
              data-testid="textarea-post-excerpt"
            />
          </div>

          <div>
            <Label htmlFor="featuredImage">Featured Image URL</Label>
            <Input
              id="featuredImage"
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              placeholder="https://..."
              data-testid="input-post-image"
            />
          </div>

          <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer flex flex-row items-center justify-between gap-4 py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base font-semibold">SEO Settings</CardTitle>
                    <Badge variant={seoScore >= 5 ? "default" : seoScore >= 3 ? "secondary" : "destructive"} data-testid="badge-seo-score">
                      {seoScore}/{seoTotal}
                    </Badge>
                  </div>
                  {seoOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4 pt-0 px-4 pb-4">
                  <div>
                    <Label htmlFor="focusKeyword">Focus Keyword</Label>
                    <Input
                      id="focusKeyword"
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                      placeholder="e.g. forestry mulching charlotte"
                      data-testid="input-focus-keyword"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Primary keyword to optimize this post for</p>
                  </div>

                  <div>
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder={title ? `${title} | Clearcut Land Management Blog` : "Custom page title for search engines"}
                      data-testid="input-meta-title"
                    />
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {metaTitle ? "Custom title" : "Falls back to post title"}
                      </p>
                      <span className={`text-xs font-mono ${metaTitleLen >= 30 && metaTitleLen <= 60 ? "text-green-600 dark:text-green-400" : metaTitleLen > 60 ? "text-red-500" : "text-amber-500"}`}>
                        {metaTitleLen}/60
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder={excerpt || "Custom description for search engine results..."}
                      rows={3}
                      data-testid="textarea-meta-description"
                    />
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {metaDescription ? "Custom description" : "Falls back to excerpt"}
                      </p>
                      <span className={`text-xs font-mono ${metaDescLen >= 120 && metaDescLen <= 160 ? "text-green-600 dark:text-green-400" : metaDescLen > 160 ? "text-red-500" : "text-amber-500"}`}>
                        {metaDescLen}/160
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="canonicalUrl">Canonical URL</Label>
                    <Input
                      id="canonicalUrl"
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      placeholder={`/blog/${slug || "..."}`}
                      data-testid="input-canonical-url"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Leave empty to use default URL. Set if cross-posting content.</p>
                  </div>

                  <div>
                    <Label htmlFor="ogImageUrl">Open Graph Image URL</Label>
                    <Input
                      id="ogImageUrl"
                      value={ogImageUrl}
                      onChange={(e) => setOgImageUrl(e.target.value)}
                      placeholder={featuredImageUrl || "https://... (defaults to featured image)"}
                      data-testid="input-og-image"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Image shown when shared on social media. Falls back to featured image.</p>
                  </div>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Search Preview</p>
                      <div className="space-y-1" data-testid="div-search-preview">
                        <p className="text-sm text-blue-600 dark:text-blue-400 truncate font-medium">
                          {effectiveMetaTitle || "Post Title | Clearcut Land Management Blog"}
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-500 truncate">
                          clearcutlandmanagement.com/blog/{slug || "..."}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {effectiveMetaDesc || "Enter an excerpt or meta description to see a preview..."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-2" data-testid="div-seo-checklist">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">SEO Checklist</p>
                    <SeoScoreIndicator label={`Meta title length (${metaTitleLen} chars, aim for 30-60)`} ok={seoChecks.titleLength} />
                    <SeoScoreIndicator label={`Meta description length (${metaDescLen} chars, aim for 120-160)`} ok={seoChecks.descLength} />
                    <SeoScoreIndicator label="Focus keyword set" ok={seoChecks.hasKeyword} />
                    <SeoScoreIndicator label="Focus keyword in meta title" ok={seoChecks.keywordInTitle} />
                    <SeoScoreIndicator label="Focus keyword in meta description" ok={seoChecks.keywordInDesc} />
                    <SeoScoreIndicator label="URL slug set" ok={seoChecks.hasSlug} />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <div>
            <Tabs defaultValue="write">
              <div className="flex items-center justify-between gap-2 mb-2">
                <Label>Content (Markdown)</Label>
                <TabsList>
                  <TabsTrigger value="write" className="gap-1">
                    <FileText className="h-3 w-3" /> Write
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="gap-1">
                    <Eye className="h-3 w-3" /> Preview
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="write">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post in markdown..."
                  rows={20}
                  className="font-mono text-sm"
                  data-testid="textarea-post-content"
                />
              </TabsContent>
              <TabsContent value="preview">
                <Card>
                  <CardContent className="p-6 prose prose-slate dark:prose-invert max-w-none" data-testid="div-post-preview">
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderMarkdown(content || "*No content yet*")) }} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
