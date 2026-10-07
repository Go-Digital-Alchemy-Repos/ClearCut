import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteLayout } from "@/components/layout/site-layout";
import { Section, SectionHeaderPro } from "@/components/premium";
import { getServiceAreaBySlug, SERVICE_AREAS } from "@/lib/service-areas";
import { SERVICES } from "@/lib/services-data";
import { SERVICE_IMAGES } from "@/lib/stock-images";
import { STOCK_IMAGES } from "@/lib/stock-images";
import {
  ArrowRight, ArrowLeft, MapPin, Phone, CheckCircle2,
  HelpCircle, TreePine, ChevronRight, Shield
} from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function CityLanding() {
  const { city } = useParams<{ city: string }>();
  const area = getServiceAreaBySlug(city || "");

  usePageMeta({
    title: area?.metaTitle || "Service Area | Clearcut Land Management",
    description: area?.metaDescription || "Professional land clearing services in the Charlotte, NC area.",
    canonicalUrl: `/areas/${city}`,
    ogType: "website",
    jsonLd: area ? JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          "name": "Clearcut Land Management",
          "telephone": "(951) 316-0826",
          "url": window.location.origin,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Charlotte",
            "addressRegion": "NC",
            "addressCountry": "US"
          },
          "areaServed": {
            "@type": area.name === "Lake Norman" ? "Place" : "City",
            "name": area.name,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": area.name,
              "addressRegion": area.state,
              "addressCountry": "US"
            }
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": `Land Clearing Services in ${area.name}`,
            "itemListElement": SERVICES.map((s, i) => ({
              "@type": "Offer",
              "position": i + 1,
              "itemOffered": {
                "@type": "Service",
                "name": s.title,
                "description": s.shortDesc,
              }
            }))
          }
        },
        {
          "@type": "FAQPage",
          "mainEntity": area.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": { "@type": "Answer", "text": faq.a }
          }))
        }
      ]
    }) : undefined,
  });

  if (!area) {
    return (
      <SiteLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold" data-testid="text-area-not-found">Service Area Not Found</h1>
          <p className="mt-3 text-muted-foreground">The service area you're looking for doesn't exist.</p>
          <Link href="/">
            <Button variant="outline" className="mt-6 gap-2" data-testid="button-back-home">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${STOCK_IMAGES.aerialClearing})` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4) 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-white/90 bg-white/10 backdrop-blur-sm mb-4">
              <MapPin className="h-3 w-3" /> {area.county}, {area.state}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight" data-testid="text-city-hero-title">
              {area.heroHeadline}
            </h1>
            <p className="mt-4 text-gray-200 max-w-2xl text-lg leading-relaxed">
              {area.heroSubtext}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/quote">
                <Button size="lg" className="gap-2" data-testid="button-hero-quote">
                  <Phone className="h-4 w-4" /> Get a Free Estimate
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="gap-2 bg-white/5 backdrop-blur-sm text-white border-white/20" data-testid="button-hero-services">
                  View All Services <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: "linear-gradient(to top, hsl(var(--background)), transparent)" }} />
      </section>

      <Section data-testid="city-intro-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeaderPro
            eyebrow={`Serving ${area.name}`}
            title={area.introTitle}
          />
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            {area.introParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section variant="tinted" data-testid="city-services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeaderPro
            eyebrow="Our Services"
            title={`What We Offer in ${area.name}`}
            subtitle={`Every land clearing service we provide, tailored to the specific terrain and vegetation challenges of ${area.name} and ${area.county}.`}
          />
          <div className="grid md:grid-cols-2 gap-6">
            {SERVICES.map((service) => {
              const highlight = area.serviceHighlights.find(h => h.slug === service.slug);
              return (
                <Card key={service.slug} className="hover-elevate" data-testid={`card-service-${service.slug}`}>
                  <div className="aspect-video overflow-hidden relative rounded-t-md">
                    <img
                      src={SERVICE_IMAGES[service.slug] || STOCK_IMAGES.clearedLand}
                      alt={`${service.title} in ${area.name}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="no-default-active-elevate text-xs bg-black/40 text-white border-white/20 backdrop-blur-sm">
                        {service.title}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-3">
                    <h3 className="font-semibold text-lg">{service.title} in {area.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {highlight?.localBlurb || service.shortDesc}
                    </p>
                    <ul className="space-y-1.5">
                      {service.features.slice(0, 3).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-green-600 dark:text-green-400" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <Link href={`/services/${service.slug}`} data-testid={`link-service-detail-${service.slug}`}>
                      <span className="text-sm font-medium flex flex-wrap items-center gap-1 mt-2 cursor-pointer">
                        Learn more <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </Section>

      <Section data-testid="city-projects-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeaderPro
            eyebrow="Local Experience"
            title={`Recent Projects in ${area.name}`}
            subtitle={area.localContext}
          />
          <div className="grid sm:grid-cols-1 gap-4">
            {area.projectExamples.map((project, i) => (
              <Card key={i} className="hover-elevate" data-testid={`card-project-example-${i}`}>
                <CardContent className="p-5 flex flex-wrap items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-accent shrink-0">
                    <TreePine className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="font-medium flex-1 min-w-0">{project}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {area.faqs.length > 0 && (
        <Section variant="tinted" data-testid="city-faq-section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeaderPro
              eyebrow="FAQ"
              title={`Common Questions About Land Clearing in ${area.name}`}
            />
            <div className="space-y-4">
              {area.faqs.map((faq, i) => (
                <Card key={i} data-testid={`card-faq-${i}`}>
                  <CardContent className="p-5 space-y-2">
                    <h3 className="font-semibold flex items-start gap-2">
                      <HelpCircle className="h-5 w-5 mt-0.5 shrink-0 text-muted-foreground" />
                      {faq.q}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-7">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section data-testid="city-cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card>
            <CardContent className="p-8 sm:p-12 space-y-6">
              <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-accent">
                <Shield className="h-3 w-3" /> Free Estimates
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Ready to Clear Your {area.name} Property?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Get a free, no-obligation estimate for your {area.name} land clearing project. We'll assess your property, discuss your goals, and provide transparent pricing.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/quote">
                  <Button size="lg" className="gap-2" data-testid="button-cta-quote">
                    <Phone className="h-4 w-4" /> Request a Free Estimate
                  </Button>
                </Link>
                <a href="tel:+19513160826">
                  <Button size="lg" variant="outline" className="gap-2" data-testid="button-cta-call">
                    <Phone className="h-4 w-4" /> (951) 316-0826
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section variant="gradient" data-testid="city-other-areas-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeaderPro
            eyebrow="We Also Serve"
            title="Other Areas We Cover"
            subtitle="Clearcut Land Management provides land clearing throughout the Charlotte metro and surrounding counties."
          />
          <div className="flex flex-wrap justify-center gap-2">
            {SERVICE_AREAS.filter(a => a.slug !== area.slug).map((otherArea) => (
              <Link key={otherArea.slug} href={`/areas/${otherArea.slug}`} data-testid={`link-area-${otherArea.slug}`}>
                <Badge variant="outline" className="px-4 py-2 text-sm cursor-pointer">
                  <MapPin className="h-3 w-3 mr-1.5" />
                  {otherArea.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
