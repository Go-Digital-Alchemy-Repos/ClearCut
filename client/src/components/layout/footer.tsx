import { Link } from "wouter";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/use-site-settings";

const serviceLinks = [
  { label: "Forestry Mulching", href: "/services/forestry-mulching" },
  { label: "Trail Cutting", href: "/services/trail-cutting" },
  { label: "Hillside Mulching", href: "/services/hillside-mulching" },
  { label: "Brush Hogging", href: "/services/brush-hogging" },
  { label: "Fence Line Clearing", href: "/services/fence-line-clearing" },
  { label: "Invasive Growth Removal", href: "/services/invasive-growth-removal" },
];

const companyLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Get a Quote", href: "/quote" },
];

export function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="border-t" data-testid="footer">
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)" }}>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2" data-testid="footer-logo">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.companyName} className="h-14 w-auto max-w-full object-contain" />
                ) : (
                  <span className="flex items-center gap-2">
                    <img src="/brand/clearcut-symbol.svg" alt="" className="h-10 w-10" />
                    <span className="font-bold text-lg leading-tight">{settings.companyName}</span>
                  </span>
                )}
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Professional forestry mulching and land clearing services serving the greater {settings.serviceArea}.
              </p>
              <div className="pt-2">
                <Link href="/quote">
                  <Button variant="outline" size="sm" className="gap-2" data-testid="footer-cta-quote">
                    Get a Quote <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
              {(settings.socialFacebook || settings.socialInstagram || settings.socialYoutube || settings.socialGoogle) && (
                <div className="flex items-center gap-3 pt-1">
                  {settings.socialFacebook && (
                    <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm underline-offset-4 hover:underline" data-testid="link-social-facebook">Facebook</a>
                  )}
                  {settings.socialInstagram && (
                    <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm underline-offset-4 hover:underline" data-testid="link-social-instagram">Instagram</a>
                  )}
                  {settings.socialYoutube && (
                    <a href={settings.socialYoutube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm underline-offset-4 hover:underline" data-testid="link-social-youtube">YouTube</a>
                  )}
                  {settings.socialGoogle && (
                    <a href={settings.socialGoogle} target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm underline-offset-4 hover:underline" data-testid="link-social-google">Google</a>
                  )}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Services</h3>
              <ul className="space-y-2.5">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm underline-offset-4 hover:underline"
                      data-testid={`footer-link-${link.href.split("/").pop()}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Company</h3>
              <ul className="space-y-2.5">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm underline-offset-4 hover:underline"
                      data-testid={`footer-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Contact</h3>
              <ul className="space-y-4">
                <li>
                  <a href="tel:+19513160826" className="flex items-start gap-2.5 text-sm hover:underline underline-offset-4">
                    <Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <span data-testid="text-footer-phone">{settings.phone}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${settings.email}`} className="flex items-start gap-2.5 text-sm hover:underline underline-offset-4">
                    <Mail className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <span data-testid="text-footer-email">{settings.email}</span>
                  </a>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <span data-testid="text-footer-service-area">{settings.serviceArea}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} {settings.companyName}. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Proudly serving {settings.serviceArea}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
