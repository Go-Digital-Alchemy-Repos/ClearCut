import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteLayout } from "@/components/layout/site-layout";
import { Section, SectionHeaderPro } from "@/components/premium";
import { SERVICES } from "@/lib/services-data";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { STOCK_IMAGES } from "@/lib/stock-images";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function Services() {
  usePageMeta({
    title: "Forestry Mulching & Land Clearing Services | Clearcut Land Management Charlotte, NC",
    description: "Clearcut Land Management offers forestry mulching, trail cutting, hillside mulching, brush hogging, fence line clearing, and invasive growth removal across the Charlotte, NC area.",
    canonicalUrl: "/services",
    jsonLd: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Land Clearing Services",
      "description": "Professional land clearing and forestry mulching services offered by Clearcut Land Management in the Charlotte, NC area.",
      "numberOfItems": 6,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Forestry Mulching", "url": `${window.location.origin}/services/forestry-mulching` },
        { "@type": "ListItem", "position": 2, "name": "Trail Cutting", "url": `${window.location.origin}/services/trail-cutting` },
        { "@type": "ListItem", "position": 3, "name": "Hillside Mulching", "url": `${window.location.origin}/services/hillside-mulching` },
        { "@type": "ListItem", "position": 4, "name": "Brush Hogging", "url": `${window.location.origin}/services/brush-hogging` },
        { "@type": "ListItem", "position": 5, "name": "Fence Line Clearing", "url": `${window.location.origin}/services/fence-line-clearing` },
        { "@type": "ListItem", "position": 6, "name": "Invasive Growth Removal", "url": `${window.location.origin}/services/invasive-growth-removal` }
      ]
    }),
  });

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${STOCK_IMAGES.forest})` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.35) 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-white/90 bg-white/10 backdrop-blur-sm mb-4">
            6 Core Services
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight" data-testid="text-services-title">
            Land Clearing Services
            <br />
            <span className="text-gold">in Charlotte, NC</span>
          </h1>
          <p className="mt-4 text-gray-200 max-w-2xl mx-auto text-lg">
            From overgrown lots to steep hillsides, we bring the right equipment to every job across Mecklenburg, Union, and Cabarrus Counties.
          </p>
          <Link href="/quote">
            <Button size="lg" className="mt-8 gap-2 text-base" data-testid="services-hero-cta">
              Get a Fast Quote <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: "linear-gradient(to top, hsl(var(--background)), transparent)" }} />
      </section>

      <Section data-testid="services-list-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {SERVICES.map((service, i) => (
            <Card key={service.slug} className="overflow-hidden" data-testid={`card-service-${service.slug}`}>
              <CardContent className={`p-0 grid md:grid-cols-2 gap-0 ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}>
                <div className="aspect-video md:aspect-auto overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, transparent 50%)" }} />
                </div>
                <div className={`p-6 sm:p-8 flex flex-col justify-center space-y-4 ${i % 2 === 1 ? "md:[direction:ltr]" : ""}`}>
                  <Badge variant="outline" className="self-start no-default-active-elevate text-xs">Service {i + 1} of 6</Badge>
                  <h2 className="text-2xl font-bold">{service.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{service.shortDesc}</p>
                  <ul className="space-y-2.5">
                    {service.bestFor.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2">
                    <Link href={`/services/${service.slug}`}>
                      <Button variant="outline" className="gap-2" data-testid={`link-service-detail-${service.slug}`}>
                        Learn More <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${STOCK_IMAGES.clearedLand})` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center text-white">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Not Sure Which Service You Need?</h2>
          <p className="mt-3 text-white/80 max-w-xl mx-auto text-lg">
            Tell us about your property and we'll recommend the right approach.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link href="/quote">
              <Button size="lg" className="gap-2 text-base" data-testid="services-cta-quote">
                Get a Free Quote <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="tel:+19513160826" data-testid="link-services-phone">
              <Button size="lg" variant="outline" className="gap-2 text-base bg-white/10 backdrop-blur-sm text-white border-white/25">
                <Phone className="h-4 w-4" />
                (951) 316-0826
              </Button>
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
