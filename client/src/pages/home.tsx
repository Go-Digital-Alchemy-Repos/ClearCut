import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteLayout } from "@/components/layout/site-layout";
import { Section, SectionHeaderPro, ImageFloat, TrustRow } from "@/components/premium";
import { STOCK_IMAGES } from "@/lib/stock-images";
import { SERVICES } from "@/lib/services-data";
import { usePageMeta } from "@/hooks/use-page-meta";
import {
  TreePine, Axe, Mountain,
  Shield, Clock, Star, ArrowRight, Phone, CheckCircle2,
  MapPin, Leaf, Zap, Eye, HardHat, Fence, Bug, Quote
} from "lucide-react";

const SERVICE_ICONS: Record<string, typeof Mountain> = {
  "forestry-mulching": TreePine,
  "trail-cutting": Leaf,
  "hillside-mulching": Mountain,
  "brush-hogging": Axe,
  "fence-line-clearing": Fence,
  "invasive-growth-removal": Bug,
};

const stats = [
  { value: "500+", label: "Acres Cleared", icon: TreePine },
  { value: "10+", label: "Years Experience", icon: Clock },
  { value: "100%", label: "Insured & Licensed", icon: Shield },
  { value: "4.9", label: "Average Rating", icon: Star },
];

const whatWeClear = [
  { icon: TreePine, title: "Dense brush & undergrowth", desc: "Thick vegetation mulched in a single pass" },
  { icon: Axe, title: "Overgrown fields & pastures", desc: "Heavy-duty rotary mowing for open land" },
  { icon: Mountain, title: "Steep slopes & hillsides", desc: "Specialized equipment for tough terrain" },
  { icon: Fence, title: "Fence lines & property edges", desc: "Clean boundary clearing and prep" },
  { icon: Leaf, title: "Trails & access lanes", desc: "Custom-width paths through dense brush" },
  { icon: Bug, title: "Invasive vines & growth", desc: "Cut-and-treat for lasting results" },
];

const processSteps = [
  { step: "1", title: "Tell Us About Your Land", desc: "Fill out our quick quote form with your property details, photos, and what you need cleared." },
  { step: "2", title: "We Plan the Approach", desc: "We review your property, confirm access, and build a clear plan with the right equipment for the job." },
  { step: "3", title: "We Clear It Clean", desc: "Our crew arrives, clears the land, and leaves your property clean and ready for whatever comes next." },
];

const whyForestryBoss = [
  { icon: TreePine, text: "Forestry mulching specialists — it's what we do best" },
  { icon: MapPin, text: "Locally owned and operated in the Charlotte metro" },
  { icon: HardHat, text: "Commercial-grade mulchers, brush hogs, and skid steers" },
  { icon: Eye, text: "Clear communication and photo updates on every job" },
  { icon: Shield, text: "Fully insured with respect for property lines and utilities" },
];

const testimonials = [
  {
    text: "They mulched about three acres of heavy brush behind our house in less than two days. You'd never know it was overgrown. Clean, professional, and easy to work with.",
    name: "Mark T.",
    location: "Huntersville",
  },
  {
    text: "We called Forestry Boss to clear fence lines on our horse property. They did exactly what they said they'd do, showed up on time, and the price was fair. Already booked them for a second project.",
    name: "Laura S.",
    location: "Waxhaw",
  },
  {
    text: "Our lot was full of invasive kudzu and privet. These guys cleared every bit of it and left a nice mulch layer behind. Huge difference. Highly recommend.",
    name: "James R.",
    location: "Matthews",
  },
];

const serviceTowns = [
  { name: "Charlotte", slug: "charlotte" },
  { name: "Huntersville", slug: "huntersville" },
  { name: "Concord", slug: "concord" },
  { name: "Matthews", slug: "matthews" },
  { name: "Mint Hill", slug: "mint-hill" },
  { name: "Fort Mill", slug: "fort-mill" },
  { name: "Belmont", slug: "belmont" },
  { name: "Waxhaw", slug: "waxhaw" },
  { name: "Indian Trail", slug: "indian-trail" },
  { name: "Monroe", slug: "monroe" },
  { name: "Lake Norman", slug: "lake-norman" },
  { name: "Mooresville", slug: "mooresville" },
];

export default function Home() {
  usePageMeta({
    title: "Forestry Boss | Forestry Mulching & Land Clearing in Charlotte, NC",
    description: "Forestry Boss provides forestry mulching, trail cutting, hillside clearing, brush hogging, fence line clearing, and invasive growth removal across the Charlotte, NC region. Fast quotes. Professional equipment.",
    canonicalUrl: "/",
    ogType: "website",
    jsonLd: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Forestry Boss",
      "description": "Professional forestry mulching and land clearing services in Charlotte, NC and surrounding areas.",
      "url": window.location.origin,
      "telephone": "(704) 608-5783",
      "email": "info@forestryboss.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Charlotte",
        "addressRegion": "NC",
        "addressCountry": "US"
      },
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 35.2271, "longitude": -80.8431 },
        "geoRadius": "80467"
      },
      "priceRange": "$$",
      "openingHours": "Mo-Fr 07:00-18:00",
      "sameAs": []
    }),
  });

  return (
    <SiteLayout>
      <section className="relative overflow-hidden" data-testid="hero-section">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${STOCK_IMAGES.hero})` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.35) 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36 lg:py-44">
          <div className="max-w-2xl space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white" style={{ background: "linear-gradient(135deg, hsl(28 65% 42% / 0.6), hsl(85 35% 38% / 0.5))" }}>
              <MapPin className="h-4 w-4" />
              <span>Serving Charlotte, NC & 50-Mile Radius</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight" data-testid="hero-heading">
              Clear Your Land.
              <br />
              <span className="text-primary">Keep Your Soil.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed max-w-xl" data-testid="hero-subtext">
              We grind brush, saplings, and overgrowth into mulch in a single pass — no hauling, no burn piles, no mess.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/quote">
                <Button size="lg" className="gap-2 text-base" data-testid="hero-cta-quote">
                  Get a Free Quote
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="tel:+17046085783">
                <Button size="lg" variant="outline" className="gap-2 text-base bg-white/10 backdrop-blur-sm text-white border-white/25" data-testid="hero-cta-call">
                  <Phone className="h-4 w-4" />
                  (704) 608-5783
                </Button>
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 text-white/70 text-sm" data-testid="hero-trust-badges">
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Local</span>
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Insured</span>
              <span className="flex items-center gap-1.5"><HardHat className="h-3.5 w-3.5" /> Pro Equipment</span>
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" /> Fast Quotes</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: "linear-gradient(to top, hsl(var(--background)), transparent)" }} />
      </section>

      <section className="relative -mt-8 z-10 pb-4" data-testid="stats-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-visible">
            <CardContent className="p-0">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
                {stats.map((stat) => (
                  <div key={stat.label} className="p-6 text-center">
                    <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                    <div className="text-2xl sm:text-3xl font-bold text-primary" data-testid={`stat-value-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="section-separator max-w-5xl mx-auto" />

      <TrustRow
        items={[
          { icon: Shield, text: "Fully Insured" },
          { icon: Zap, text: "Same-Week Scheduling" },
          { icon: Star, text: "5-Star Rated" },
          { icon: MapPin, text: "Charlotte, NC" },
        ]}
        className="max-w-3xl mx-auto py-6"
      />

      <Section variant="default" data-testid="what-we-clear-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeaderPro
            eyebrow="What We Do"
            title="What We Clear"
            subtitle="From tangled undergrowth to wide-open fields, we have the equipment and know-how to handle it all."
          />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {whatWeClear.map((item) => (
              <Card key={item.title} className="hover-elevate group" data-testid={`card-clear-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardContent className="p-6 flex flex-col gap-3">
                  <div className="h-12 w-12 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))" }}>
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section variant="tinted" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeaderPro
            eyebrow="Our Expertise"
            title="Our Services"
            subtitle="Whether it's a half-acre residential lot or 50 acres of rural land, we bring the right equipment and get it done."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((service) => {
              const IconComp = SERVICE_ICONS[service.slug] || TreePine;
              return (
                <Link key={service.slug} href={`/services/${service.slug}`}>
                  <Card className="h-full hover-elevate cursor-pointer" data-testid={`card-service-${service.slug}`}>
                    <div className="aspect-[16/9] overflow-hidden relative">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md bg-primary/90 flex items-center justify-center">
                            <IconComp className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <h3 className="font-bold text-white text-base">{service.title}</h3>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">{service.shortDesc}</p>
                      <span className="text-sm text-primary font-medium flex items-center gap-1">
                        Learn more <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link href="/services">
              <Button variant="outline" className="gap-2" data-testid="link-all-services">
                View All Services <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      <Section variant="pattern" className="spotlight-glow" data-testid="process-section">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <SectionHeaderPro
            eyebrow="Simple Process"
            title="How It Works"
            subtitle="Three simple steps from overgrown to cleared and clean."
          />
          <div className="grid sm:grid-cols-3 gap-8 mt-4 relative">
            <div className="hidden sm:block absolute top-6 left-[20%] right-[20%] h-px border-t-2 border-dashed border-primary/20" />
            {processSteps.map((item, i) => (
              <div key={item.step} className={`relative text-center space-y-4 animate-fade-up animate-fade-up-delay-${i + 1}`}>
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-lg font-bold relative z-10 ring-4 ring-background" data-testid={`process-step-${item.step}`}>
                  {item.step}
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section data-testid="why-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeaderPro
                eyebrow="Why Choose Us"
                title="Why Forestry Boss"
                align="left"
                subtitle="We're not a general contractor who happens to own a mulcher. Forestry mulching and land clearing is all we do — and we've spent years building the equipment lineup, crew, and processes to do it better than anyone in the Charlotte area."
                className="mb-8"
              />
              <div className="space-y-4">
                {whyForestryBoss.map((b) => (
                  <div key={b.text} className="flex gap-4 items-start">
                    <div className="h-10 w-10 shrink-0 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))" }}>
                      <b.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex items-center min-h-[2.5rem]">
                      <p className="font-medium text-sm sm:text-base" data-testid={`why-bullet-${b.text.slice(0, 20).toLowerCase().replace(/\s+/g, "-")}`}>{b.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/quote">
                  <Button className="gap-2" data-testid="why-cta-quote">
                    Get a Free Quote <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <ImageFloat
                src={STOCK_IMAGES.heavyEquipment}
                alt="Heavy equipment clearing land"
                data-testid="img-heavy-equipment"
              />
              <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground rounded-md p-4 hidden lg:flex items-center gap-3">
                <Shield className="h-8 w-8" />
                <div>
                  <div className="font-bold text-lg">100%</div>
                  <div className="text-xs text-primary-foreground/80">Insured & Licensed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section variant="gradient" data-testid="service-area-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeaderPro
            eyebrow="Coverage Area"
            title="Service Area"
            subtitle="We proudly serve properties within about an hour of the Charlotte metro."
          />
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto" data-testid="text-service-area">
            {serviceTowns.map((town) => (
              <Link key={town.slug} href={`/areas/${town.slug}`} data-testid={`link-area-${town.slug}`}>
                <Badge variant="outline" className="px-4 py-2 text-sm cursor-pointer">
                  <MapPin className="h-3 w-3 mr-1.5" />
                  {town.name}
                </Badge>
              </Link>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6 max-w-xl mx-auto">
            Don't see your town? If you're within about an hour of Charlotte, we can likely serve you.
            <Link href="/quote" className="text-primary font-medium ml-1">Contact us to check.</Link>
          </p>
        </div>
      </Section>

      <Section data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeaderPro
            eyebrow="Real Reviews"
            title="What Our Customers Say"
            subtitle="Real feedback from property owners across the Charlotte region."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <Card key={i} className="h-full" data-testid={`card-testimonial-${i}`}>
                <CardContent className="p-6 flex flex-col gap-4 relative">
                  <Quote className="h-8 w-8 text-primary/15 absolute top-4 right-4" />
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">"{t.text}"</p>
                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{t.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <section className="relative overflow-hidden" data-testid="cta-section">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${STOCK_IMAGES.forest})` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.45) 100%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center text-white">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Ready to reclaim your land?</h2>
          <p className="mt-4 text-white/80 max-w-xl mx-auto text-lg">
            Get a free, no-obligation quote today. Tell us about your property and we'll handle the rest.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            <Link href="/quote">
              <Button size="lg" className="gap-2 text-base" data-testid="cta-get-quote">
                <CheckCircle2 className="h-4 w-4" />
                Get a Free Quote
              </Button>
            </Link>
            <a href="tel:+17046085783">
              <Button size="lg" variant="outline" className="gap-2 text-base bg-white/10 backdrop-blur-sm text-white border-white/25" data-testid="cta-call">
                <Phone className="h-4 w-4" />
                Call (704) 608-5783
              </Button>
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
