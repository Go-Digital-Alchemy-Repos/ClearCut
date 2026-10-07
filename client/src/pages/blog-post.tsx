import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SiteLayout } from "@/components/layout/site-layout";
import { STOCK_IMAGES } from "@/lib/stock-images";
import { ArrowLeft, Calendar, ArrowRight } from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";
import DOMPurify from "dompurify";
import type { BlogPost } from "@shared/schema";

const categoryImages: Record<string, string> = {
  "Forestry Mulching": STOCK_IMAGES.forestryMulching,
  "Land Clearing": STOCK_IMAGES.clearedLand,
  "Brush Removal": STOCK_IMAGES.heavyEquipment,
  "Lot Clearing": STOCK_IMAGES.clearedLand,
  "Storm Cleanup": STOCK_IMAGES.forest,
  "Stump Grinding": STOCK_IMAGES.heavyEquipment,
  "Driveway/Trail Cutting": STOCK_IMAGES.trailCutting,
  "Pricing": STOCK_IMAGES.clearedLand,
};

function renderMarkdown(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2 text-foreground">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-8 mb-3 text-foreground">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4 text-foreground">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline hover:no-underline">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-muted-foreground">$1</li>');

  html = html.replace(/((?:<li[^>]*>.*<\/li>\s*)+)/g, (match) => `<ul class="my-3 space-y-1">${match}</ul>`);

  const blocks = html.split(/\n\n+/);
  html = blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<h") || trimmed.startsWith("<ul") || trimmed.startsWith("<li")) return trimmed;
      return `<p class="mb-4 text-muted-foreground leading-relaxed">${trimmed}</p>`;
    })
    .join("\n");

  return html;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/public/blog", slug],
    queryFn: () => fetch(`/api/public/blog/${slug}`).then(r => {
      if (!r.ok) throw new Error("Post not found");
      return r.json();
    }),
    enabled: !!slug,
  });

  const { data: related = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/public/blog", slug, "related"],
    queryFn: () => fetch(`/api/public/blog/${slug}/related`).then(r => r.json()),
    enabled: !!slug && !!post,
  });

  const pageTitle = post?.metaTitle || (post ? `${post.title} | Clearcut Land Management Blog` : "Blog | Clearcut Land Management Charlotte, NC");
  const pageDescription = post?.metaDescription || post?.excerpt || "Expert tips and guides about land clearing in Charlotte, NC.";
  const pageCanonical = post?.canonicalUrl || `/blog/${slug}`;
  const pageOgImage = post?.ogImageUrl || post?.featuredImageUrl || undefined;

  usePageMeta({
    title: pageTitle,
    description: pageDescription,
    canonicalUrl: pageCanonical,
    ogType: post ? "article" : "website",
    ogImage: pageOgImage,
    jsonLd: post ? JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.metaTitle || post.title,
      "description": post.metaDescription || post.excerpt,
      "datePublished": post.publishedAt,
      "dateModified": post.updatedAt || post.publishedAt,
      "author": { "@type": "Organization", "name": "Clearcut Land Management" },
      "publisher": {
        "@type": "Organization",
        "name": "Clearcut Land Management",
        "url": window.location.origin
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${window.location.origin}/blog/${slug}`
      },
      ...(pageOgImage ? { "image": pageOgImage } : {})
    }) : undefined,
  });

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="h-6 bg-muted/30 animate-pulse rounded w-1/4 mb-6" />
          <div className="h-10 bg-muted/30 animate-pulse rounded w-3/4 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-muted/30 animate-pulse rounded" />
            ))}
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!post || error) {
    return (
      <SiteLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold" data-testid="text-post-not-found">Post Not Found</h1>
          <p className="mt-3 text-muted-foreground">This blog post doesn't exist or hasn't been published yet.</p>
          <Link href="/blog">
            <Button variant="outline" className="mt-6 gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Button>
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <article className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
          </Link>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge variant="secondary">{post.category}</Badge>
            {post.publishedAt && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight" data-testid="text-post-title">
            {post.title}
          </h1>

          {post.featuredImageUrl && (
            <div className="mt-6 rounded-md overflow-hidden">
              <img src={post.featuredImageUrl} alt={post.title} className="w-full h-auto object-cover" />
            </div>
          )}

          <div className="mt-8 max-w-none" data-testid="text-post-content">
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderMarkdown(post.content)) }} />
          </div>

          <div className="mt-12 pt-8 border-t">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-lg">Ready to Clear Your Property?</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-4">
                  Get a free, no-obligation quote from Clearcut Land Management. We serve Charlotte, NC and surrounding areas within a 50-mile radius.
                </p>
                <Link href="/quote">
                  <Button data-testid="blog-cta-quote">Get a Free Quote</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {related.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="font-semibold text-lg mb-4">Related Articles</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((rp) => (
                  <Link key={rp.id} href={`/blog/${rp.slug}`}>
                    <Card className="overflow-hidden hover-elevate cursor-pointer h-full" data-testid={`card-related-${rp.slug}`}>
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={rp.featuredImageUrl || categoryImages[rp.category] || STOCK_IMAGES.clearedLand}
                          alt={rp.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-3">
                        <Badge variant="secondary" className="mb-2">{rp.category}</Badge>
                        <h4 className="font-medium text-sm leading-snug">{rp.title}</h4>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </SiteLayout>
  );
}
