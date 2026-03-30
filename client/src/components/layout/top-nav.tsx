import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, TreePine, Phone } from "lucide-react";
import { useSiteSettings } from "@/hooks/use-site-settings";

const services = [
  { label: "Forestry Mulching", href: "/services/forestry-mulching" },
  { label: "Trail Cutting", href: "/services/trail-cutting" },
  { label: "Hillside Mulching", href: "/services/hillside-mulching" },
  { label: "Brush Hogging", href: "/services/brush-hogging" },
  { label: "Fence Line Clearing", href: "/services/fence-line-clearing" },
  { label: "Invasive Growth Removal", href: "/services/invasive-growth-removal" },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Pricing", href: "/pricing" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
];

export function TopNav() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { settings } = useSiteSettings();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b" data-testid="top-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-24 py-2 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0 py-1" data-testid="link-home-logo">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.companyName} className="h-20 w-auto object-contain" />
            ) : (
              <TreePine className="h-10 w-10 text-primary" />
            )}
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <Link href={link.href}>
                    <Button
                      variant="ghost"
                      className={`gap-1 ${location.startsWith("/services") ? "bg-primary text-primary-foreground" : ""}`}
                      data-testid="link-services"
                    >
                      {link.label}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <div
                    className={`absolute top-full left-0 pt-1 transition-all duration-150 ${servicesOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                  >
                    <div className="bg-popover border rounded-md shadow-lg min-w-[220px] py-1">
                      {services.map((s) => (
                        <Link
                          key={s.href}
                          href={s.href}
                          className={`block px-4 py-2.5 text-sm hover-elevate transition-colors ${location === s.href ? "text-primary font-medium" : "text-foreground"}`}
                          data-testid={`link-service-${s.href.split("/").pop()}`}
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={link.label} href={link.href}>
                  <Button
                    variant="ghost"
                    className={location === link.href ? "bg-primary text-primary-foreground" : ""}
                    data-testid={`link-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              )
            )}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <a href="tel:+17046085783" data-testid="link-call-now">
              <Button variant="outline" className="gap-2">
                <Phone className="h-4 w-4" /> Call Now (704) 608-5783
              </Button>
            </a>
            <Link href="/quote">
              <Button data-testid="link-get-quote">{settings.ctaText}</Button>
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-background" data-testid="mobile-menu">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => !link.hasDropdown && setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${location === link.href ? "bg-primary text-primary-foreground" : "hover-elevate"}`}
                  data-testid={`mobile-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
                {link.hasDropdown && (
                  <div className="pl-4 space-y-0.5 mt-1">
                    {services.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-3 py-2 rounded-md text-sm transition-colors ${location === s.href ? "text-primary font-medium" : "text-muted-foreground hover-elevate"}`}
                        data-testid={`mobile-link-service-${s.href.split("/").pop()}`}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-2 space-y-2">
              <a href="tel:+17046085783" className="block" data-testid="mobile-link-call-now">
                <Button variant="outline" className="w-full gap-2">
                  <Phone className="h-4 w-4" /> Call Now (704) 608-5783
                </Button>
              </a>
              <Link href="/quote" onClick={() => setMobileOpen(false)}>
                <Button className="w-full" data-testid="mobile-link-get-quote">{settings.ctaText}</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
