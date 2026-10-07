import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useState, useRef, useCallback, useEffect } from "react";
import { Loader2, MapPin, ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteLayout } from "@/components/layout/site-layout";
import { usePageMeta } from "@/hooks/use-page-meta";
import type { CrmProject } from "@shared/schema";

function CompareSlider({ beforeUrl, beforeAlt, afterUrl, afterAlt }: {
  beforeUrl: string; beforeAlt: string; afterUrl: string; afterAlt: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) { e.preventDefault(); handleMove(e.clientX); }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging.current && e.touches[0]) handleMove(e.touches[0].clientX);
    };
    const onEnd = () => { isDragging.current = false; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [handleMove]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-md select-none cursor-col-resize"
      onMouseDown={(e) => { isDragging.current = true; handleMove(e.clientX); }}
      onTouchStart={(e) => { isDragging.current = true; if (e.touches[0]) handleMove(e.touches[0].clientX); }}
      data-testid="before-after-slider"
    >
      <img src={afterUrl} alt={afterAlt} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img src={beforeUrl} alt={beforeAlt} className="absolute inset-0 w-full h-full object-cover" style={{ minWidth: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100%" }} draggable={false} />
      </div>
      <div className="absolute top-0 bottom-0 z-10" style={{ left: `${position}%`, transform: "translateX(-50%)" }}>
        <div className="w-0.5 h-full bg-white shadow-md" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 3L2 8L5 13M11 3L14 8L11 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-black/60 text-white text-xs rounded-md">Before</div>
      <div className="absolute top-2 right-2 z-10 px-2 py-0.5 bg-black/60 text-white text-xs rounded-md">After</div>
    </div>
  );
}

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:slug");
  const slug = params?.slug || "";

  const { data: project, isLoading } = useQuery<CrmProject>({
    queryKey: ["/api/public/projects", slug],
    queryFn: async () => {
      const res = await fetch(`/api/public/projects/${slug}`, { credentials: "include" });
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
    enabled: !!slug,
  });

  usePageMeta({
    title: project ? `${project.title}${project.location ? ` - ${project.location}` : ""} | Clearcut Land Management` : "Project Details | Clearcut Land Management",
    description: project?.summary || "View project details from Clearcut Land Management land clearing portfolio.",
  });

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </SiteLayout>
    );
  }

  if (!project) {
    return (
      <SiteLayout>
        <div className="py-20 px-6 text-center">
          <h1 className="text-2xl font-bold mb-3">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">This project may have been removed or isn't published yet.</p>
          <Link href="/projects">
            <Button data-testid="link-back-projects">Back to Projects</Button>
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const services = Array.isArray(project.services) ? (project.services as string[]) : [];
  const beforeAfter = Array.isArray(project.beforeAfter) ? (project.beforeAfter as { url: string; label?: string }[]) : [];
  const gallery = Array.isArray(project.gallery) ? (project.gallery as { url: string; alt?: string; title?: string }[]) : [];
  const tags = Array.isArray(project.tags) ? (project.tags as string[]) : [];
  const coverImg = project.coverImageUrl || (beforeAfter.length > 0 ? beforeAfter[0].url : null);

  return (
    <SiteLayout>
      <section className="relative py-16 sm:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-project-title">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            {project.location && (
              <span className="text-sm text-muted-foreground flex items-center gap-1" data-testid="text-project-location">
                <MapPin className="h-3.5 w-3.5" />{project.location}
              </span>
            )}
            {services.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {services.map((s, i) => (
                  <Badge key={i} variant="outline" className="text-xs no-default-hover-elevate no-default-active-elevate">{s}</Badge>
                ))}
              </div>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((t, i) => (
                  <Badge key={i} variant="secondary" className="text-xs no-default-hover-elevate no-default-active-elevate">{t}</Badge>
                ))}
              </div>
            )}
          </div>

          {coverImg && (
            <div className="aspect-video rounded-md overflow-hidden mb-8 shadow-sm">
              <img
                src={coverImg}
                alt={project.coverImageAlt || project.title}
                className="w-full h-full object-cover"
                data-testid="img-project-cover"
              />
            </div>
          )}

          {(project.summary || project.description) && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-3">About This Project</h2>
              {project.summary && <p className="text-muted-foreground leading-relaxed mb-4" data-testid="text-project-summary">{project.summary}</p>}
              {project.description && (
                <div className="prose prose-sm max-w-none text-muted-foreground" data-testid="text-project-description">
                  {project.description.split("\n").map((p, i) => p.trim() ? <p key={i}>{p}</p> : null)}
                </div>
              )}
            </div>
          )}

          {beforeAfter.length >= 2 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Before & After</h2>
              <CompareSlider
                beforeUrl={beforeAfter[0].url}
                beforeAlt={beforeAfter[0].label || "Before"}
                afterUrl={beforeAfter[1].url}
                afterAlt={beforeAfter[1].label || "After"}
              />
              {beforeAfter.length > 2 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {beforeAfter.slice(2).map((img, i) => (
                    <div key={i} className="aspect-square rounded-md overflow-hidden">
                      <img src={img.url} alt={img.label || ""} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {beforeAfter.length === 1 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Project Image</h2>
              <div className="aspect-video rounded-md overflow-hidden">
                <img src={beforeAfter[0].url} alt={beforeAfter[0].label || project.title} className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {gallery.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Gallery</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gallery.map((img, i) => (
                  <div key={i} className="aspect-square rounded-md overflow-hidden">
                    <img src={img.url} alt={img.alt || img.title || ""} className="w-full h-full object-cover" loading="lazy" />
                    {img.title && <p className="text-xs text-muted-foreground mt-1 text-center">{img.title}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Similar Results?</h2>
          <p className="mb-6 opacity-90">Get a fast, free quote for your land clearing or forestry mulching project.</p>
          <Link href="/quote">
            <Button variant="secondary" data-testid="link-project-detail-cta">Get a Free Quote</Button>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}