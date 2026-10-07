import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteLayout } from "@/components/layout/site-layout";
import { Section, SectionHeaderPro } from "@/components/premium";
import { STOCK_IMAGES } from "@/lib/stock-images";
import { CheckCircle2, ArrowRight, HelpCircle, Clock, Zap, Star, Layers, Phone } from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";

const tiers = [
  {
    name: "Hourly",
    icon: Clock,
    price: "$250",
    priceDetail: "minimum service call",
    subPrice: "Then $175/hr after the first hour",
    desc: "Covers travel, setup, and first hour of work.",
    bestFor: "Small brush pockets, fence lines, quick cleanups",
    features: [
      "$250 minimum covers first hour",
      "$175 per additional hour",
      "Ideal for focused, smaller tasks",
      "No commitment beyond the job",
    ],
  },
  {
    name: "Half-Day Value",
    icon: Zap,
    price: "$600",
    priceDetail: "4 hours",
    subPrice: "Effective rate: $150/hr",
    desc: "Save on the hourly rate with a half-day block.",
    bestFor: "Medium overgrowth, multiple zones, trail segments",
    popular: true,
    features: [
      "4 hours of equipment time",
      "Effective rate of $150/hr",
      "Great for medium-sized projects",
      "Covers most residential jobs",
    ],
  },
  {
    name: "Full-Day Best Value",
    icon: Star,
    price: "$1,000",
    priceDetail: "8 hours",
    subPrice: "Effective rate: $125/hr",
    desc: "The best rate for full-day projects.",
    bestFor: "Large lots, heavy brush, longer trail cuts",
    features: [
      "8 hours of equipment time",
      "Best effective rate at $125/hr",
      "Perfect for large-scale clearing",
      "Maximum value for big jobs",
    ],
  },
  {
    name: "By the Acre",
    icon: Layers,
    price: "From $900",
    priceDetail: "per acre",
    subPrice: "Price varies by vegetation density",
    desc: "For larger properties priced by area rather than time.",
    bestFor: "Open acreage cleanup and forestry mulching",
    features: [
      "Starting at $900 per acre",
      "Price depends on density and terrain",
      "Ideal for multi-acre properties",
      "Forestry mulching specialty",
    ],
  },
];

const affectsPrice = [
  { text: "Vegetation density and stem size", detail: "Thicker growth takes more time" },
  { text: "Terrain slope and ground conditions", detail: "Steep or wet ground requires specialized equipment" },
  { text: "Access width (gates, driveways)", detail: "Narrow access may limit equipment options" },
  { text: "Obstacles (fencing, rocks, debris)", detail: "Hidden obstacles slow the process" },
  { text: "Haul-off vs mulch-on-site", detail: "Hauling adds cost; mulching in place saves" },
  { text: "Utility locate requirements", detail: "Underground utilities need marking first" },
];

const faqs = [
  {
    q: "Is the $250 a minimum?",
    a: "Yes. The $250 minimum covers our travel to your site, equipment setup, and the first hour of work. Most small jobs like fence line cleanups or brush pockets fall within this minimum. If the job takes longer, additional time is billed at $175 per hour.",
  },
  {
    q: "Do you haul debris away?",
    a: "It depends on the job. With forestry mulching, vegetation is mulched on-site so there's nothing to haul. For traditional clearing jobs, we can arrange haul-off at an additional cost, or we can pile material for you to handle. We'll discuss the best approach during your estimate.",
  },
  {
    q: "Can you work in wet conditions?",
    a: "We can work in lightly wet conditions, but heavy rain or saturated ground can cause rutting and soil compaction. We'll reschedule if conditions risk damaging your property. Safety and site quality come first.",
  },
  {
    q: "Do you require utility locates?",
    a: "Yes, for any work near underground utilities we require a locate be completed before we start. You can call NC 811 (dial 811) to schedule a free locate. We can advise you on the process.",
  },
  {
    q: "How fast can I get scheduled?",
    a: "Most projects are scheduled within 1-2 weeks. During peak season (spring and fall), lead times may be slightly longer. For urgent or emergency work, we do our best to accommodate faster turnarounds.",
  },
];

export default function Pricing() {
  usePageMeta({
    title: "Pricing | Clearcut Land Management Charlotte, NC",
    description: "Simple pricing options for brush removal, forestry mulching, and land clearing in the Charlotte area. Choose hourly, half-day, full-day, or by-the-acre options. Get a fast quote.",
    canonicalUrl: "/pricing",
    jsonLd: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "PriceSpecification",
      "name": "Clearcut Land Management Pricing",
      "description": "Pricing tiers for forestry mulching and land clearing services in Charlotte, NC.",
      "priceCurrency": "USD",
      "url": `${window.location.origin}/pricing`
    }),
  });

  return (
    <SiteLayout>
      <section className="relative overflow-hidden" data-testid="pricing-hero-section">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${STOCK_IMAGES.aerialClearing})` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.35) 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider text-white/90 bg-white/10 backdrop-blur-sm mb-4">
            Transparent Rates
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight" data-testid="text-pricing-title">
            Simple, Straightforward
            <br />
            <span className="text-gold">Pricing</span>
          </h1>
          <p className="mt-4 text-gray-200 max-w-2xl mx-auto text-lg">
            Your quote confirms exact pricing for your specific property. No surprises.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: "linear-gradient(to top, hsl(var(--background)), transparent)" }} />
      </section>

      <Section data-testid="pricing-tiers-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeaderPro
            title="Our Pricing Tiers"
            subtitle="Choose the option that best fits your project size and needs."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative ${tier.popular ? "border-primary ring-1 ring-primary/20" : ""}`}
                data-testid={`card-pricing-${tier.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="no-default-active-elevate">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-9 w-9 rounded-md flex items-center justify-center" style={{ background: tier.popular ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))" : "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))" }}>
                      <tier.icon className={`h-4 w-4 ${tier.popular ? "text-primary-foreground" : "text-primary"}`} />
                    </div>
                    <h3 className="text-lg font-bold">{tier.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{tier.desc}</p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-primary">{tier.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">/{tier.priceDetail}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{tier.subPrice}</p>
                  <p className="text-xs text-muted-foreground mt-3 mb-4"><span className="font-medium">Best for:</span> {tier.bestFor}</p>
                  <ul className="space-y-2.5 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/quote">
                    <Button
                      className="w-full mt-6 gap-2"
                      variant={tier.popular ? "default" : "outline"}
                      data-testid={`button-pricing-quote-${tier.name.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      Get a Quote <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section variant="pattern" className="spotlight-glow" data-testid="pricing-factors-section">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <SectionHeaderPro
            eyebrow="Price Factors"
            title="What Affects Price"
            subtitle="Every property is different. Here are the main factors that influence your final quote."
          />
          <div className="grid sm:grid-cols-2 gap-4">
            {affectsPrice.map((item) => (
              <Card key={item.text} className="hover-elevate">
                <CardContent className="p-4 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">{item.text}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/quote">
              <Button className="gap-2" data-testid="pricing-affects-cta">
                Get Your Custom Quote <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      <Section data-testid="pricing-faq-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeaderPro
            eyebrow="FAQ"
            title="Common Questions"
          />
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} className="hover-elevate" data-testid={`card-faq-${i}`}>
                <CardContent className="p-5">
                  <h3 className="font-semibold">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${STOCK_IMAGES.forest})` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center text-white">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Ready to Get Started?</h2>
          <p className="mt-3 text-white/80 max-w-xl mx-auto text-lg">
            Tell us about your project and we'll provide a fast, accurate quote.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link href="/quote">
              <Button size="lg" className="gap-2 text-base" data-testid="pricing-final-cta">
                Get a Fast Quote <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="tel:+19513160826" data-testid="link-pricing-phone">
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
