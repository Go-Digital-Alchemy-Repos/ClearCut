import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Loader2, MapPin, ArrowRight, FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteLayout } from "@/components/layout/site-layout";
import { usePageMeta } from "@/hooks/use-page-meta";
import type { CrmProject } from "@shared/schema";

export default function Projects() {
  usePageMeta({
    title: "Our Projects | Clearcut Land Management - Charlotte, NC Land Clearing Portfolio",
    description: "Explore before-and-after land clearing, brush removal, and forestry mulching projects across the Charlotte, NC region.",
  });

  const { data: projects, isLoading } = useQuery<CrmProject[]>({
    queryKey: ["/api/public/projects"],
  });

  return (
    <SiteLayout>
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3" data-testid="text-projects-heading">
              Project Portfolio
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our completed land clearing, forestry mulching, and brush removal projects across the Charlotte, NC region.
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && (!projects || projects.length === 0) && (
            <div className="text-center py-16">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-6">We're currently building our project gallery. Check back soon!</p>
              <Link href="/quote">
                <Button data-testid="link-empty-quote">Get a Free Quote</Button>
              </Link>
            </div>
          )}

          {!isLoading && projects && projects.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const images = Array.isArray(project.beforeAfter) ? (project.beforeAfter as { url: string; label?: string }[]) : [];
                const coverImg = project.coverImageUrl || (images.length > 0 ? images[0].url : null);
                const services = Array.isArray(project.services) ? (project.services as string[]) : [];
                const projectSlug = project.slug || project.id;

                return (
                  <Link key={project.id} href={`/projects/${projectSlug}`}>
                    <Card className="hover-elevate cursor-pointer h-full overflow-visible" data-testid={`card-project-${project.id}`}>
                      {coverImg && (
                        <div className="aspect-video overflow-hidden rounded-t-md">
                          <img
                            src={coverImg}
                            alt={project.coverImageAlt || project.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <CardContent className="p-5 space-y-2">
                        <h3 className="font-semibold text-lg">{project.title}</h3>
                        {project.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" />{project.location}
                          </p>
                        )}
                        {project.summary && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{project.summary}</p>
                        )}
                        {services.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {services.slice(0, 3).map((s, i) => (
                              <Badge key={i} variant="outline" className="text-xs no-default-hover-elevate no-default-active-elevate">{s}</Badge>
                            ))}
                            {services.length > 3 && (
                              <Badge variant="outline" className="text-xs no-default-hover-elevate no-default-active-elevate">+{services.length - 3}</Badge>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-primary text-sm font-medium pt-2">
                          View Project <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Similar Results?</h2>
          <p className="mb-6 opacity-90">Get a fast, free quote for your land clearing project in the Charlotte area.</p>
          <Link href="/quote">
            <Button variant="secondary" data-testid="link-projects-cta">Get a Free Quote</Button>
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}