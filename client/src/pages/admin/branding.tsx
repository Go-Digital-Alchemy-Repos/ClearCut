import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, Loader2, Save, TreePine, Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/admin-layout";
import type { SiteSettings } from "@shared/schema";

function hslToHex(hslStr: string): string {
  const parts = hslStr.trim().split(/\s+/);
  if (parts.length < 3) return "#b07430";
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string): string {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return "28 65% 42%";
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export default function AdminBranding() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/admin/settings"],
    queryFn: () => fetch("/api/admin/settings", { credentials: "include" }).then(r => r.json()),
  });

  const [form, setForm] = useState({
    companyName: "Forestry Boss",
    phone: "(704) 608-5783",
    email: "info@forestryboss.com",
    serviceArea: "Charlotte, NC & Surrounding Areas",
    logoUrl: "/images/logo.png",
    primaryColor: "#e76003",
    secondaryColor: "#21492c",
    fontFamily: "Inter",
    ctaText: "Get a Fast Quote",
    socialFacebook: "",
    socialInstagram: "",
    socialYoutube: "",
    socialGoogle: "",
  });

  useEffect(() => {
    if (settings) {
      setForm({
        companyName: settings.companyName,
        phone: settings.phone,
        email: settings.email,
        serviceArea: settings.serviceArea,
        logoUrl: settings.logoUrl || "",
        primaryColor: hslToHex(settings.primaryColor),
        secondaryColor: hslToHex(settings.secondaryColor),
        fontFamily: settings.fontFamily,
        ctaText: settings.ctaText,
        socialFacebook: settings.socialFacebook || "",
        socialInstagram: settings.socialInstagram || "",
        socialYoutube: settings.socialYoutube || "",
        socialGoogle: settings.socialGoogle || "",
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        companyName: form.companyName,
        phone: form.phone,
        email: form.email,
        serviceArea: form.serviceArea,
        logoUrl: form.logoUrl || null,
        primaryColor: hexToHsl(form.primaryColor),
        secondaryColor: hexToHsl(form.secondaryColor),
        fontFamily: form.fontFamily,
        ctaText: form.ctaText,
        socialFacebook: form.socialFacebook || null,
        socialInstagram: form.socialInstagram || null,
        socialYoutube: form.socialYoutube || null,
        socialGoogle: form.socialGoogle || null,
      };
      return apiRequest("PUT", "/api/admin/settings", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public/settings"] });
      toast({ title: "Settings saved", description: "Branding settings updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    },
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <Palette className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold" data-testid="text-admin-branding-title">Branding Settings</h1>
          </div>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} data-testid="button-save-branding">
            {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span className="ml-2">Save Changes</span>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Company Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input id="companyName" value={form.companyName} onChange={e => update("companyName", e.target.value)} data-testid="input-company-name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={form.phone} onChange={e => update("phone", e.target.value)} data-testid="input-phone" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={form.email} onChange={e => update("email", e.target.value)} data-testid="input-email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceArea">Service Area</Label>
                    <Input id="serviceArea" value={form.serviceArea} onChange={e => update("serviceArea", e.target.value)} data-testid="input-service-area" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL (optional)</Label>
                  <Input id="logoUrl" value={form.logoUrl} onChange={e => update("logoUrl", e.target.value)} placeholder="https://example.com/logo.png" data-testid="input-logo-url" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Brand Colors & Typography</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center gap-3">
                      <input type="color" id="primaryColor" value={form.primaryColor} onChange={e => update("primaryColor", e.target.value)} className="h-9 w-12 rounded-md border cursor-pointer" data-testid="input-primary-color" />
                      <Input value={form.primaryColor} onChange={e => update("primaryColor", e.target.value)} className="max-w-[140px]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center gap-3">
                      <input type="color" id="secondaryColor" value={form.secondaryColor} onChange={e => update("secondaryColor", e.target.value)} className="h-9 w-12 rounded-md border cursor-pointer" data-testid="input-secondary-color" />
                      <Input value={form.secondaryColor} onChange={e => update("secondaryColor", e.target.value)} className="max-w-[140px]" />
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <Input id="fontFamily" value={form.fontFamily} onChange={e => update("fontFamily", e.target.value)} data-testid="input-font-family" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ctaText">CTA Button Text</Label>
                    <Input id="ctaText" value={form.ctaText} onChange={e => update("ctaText", e.target.value)} data-testid="input-cta-text" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Social Links</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="socialFacebook">Facebook URL</Label>
                    <Input id="socialFacebook" value={form.socialFacebook} onChange={e => update("socialFacebook", e.target.value)} placeholder="https://facebook.com/brushboss" data-testid="input-social-facebook" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="socialInstagram">Instagram URL</Label>
                    <Input id="socialInstagram" value={form.socialInstagram} onChange={e => update("socialInstagram", e.target.value)} placeholder="https://instagram.com/brushboss" data-testid="input-social-instagram" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="socialYoutube">YouTube URL</Label>
                    <Input id="socialYoutube" value={form.socialYoutube} onChange={e => update("socialYoutube", e.target.value)} placeholder="https://youtube.com/@brushboss" data-testid="input-social-youtube" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="socialGoogle">Google Business URL</Label>
                    <Input id="socialGoogle" value={form.socialGoogle} onChange={e => update("socialGoogle", e.target.value)} placeholder="https://g.page/brushboss" data-testid="input-social-google" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Live Preview</h3>
                <div className="border rounded-md overflow-hidden">
                  <div className="p-3 border-b flex items-center gap-2" style={{ backgroundColor: `hsl(${hexToHsl(form.primaryColor)})` }}>
                    {form.logoUrl ? (
                      <img src={form.logoUrl} alt="Logo" className="h-6 w-6 object-contain" />
                    ) : (
                      <TreePine className="h-5 w-5 text-white" />
                    )}
                    <span className="font-bold text-sm text-white" style={{ fontFamily: form.fontFamily }}>
                      {form.companyName}
                    </span>
                  </div>
                  <div className="p-4 space-y-3 bg-background">
                    <p className="text-xs text-muted-foreground" style={{ fontFamily: form.fontFamily }}>
                      Professional forestry mulching serving {form.serviceArea}
                    </p>
                    <Button size="sm" style={{ backgroundColor: `hsl(${hexToHsl(form.primaryColor)})`, color: "white" }} data-testid="preview-cta-button">
                      {form.ctaText}
                    </Button>
                    <div className="space-y-1.5 pt-2 border-t">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3 shrink-0" style={{ color: `hsl(${hexToHsl(form.primaryColor)})` }} />
                        <span>{form.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3 shrink-0" style={{ color: `hsl(${hexToHsl(form.primaryColor)})` }} />
                        <span>{form.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" style={{ color: `hsl(${hexToHsl(form.primaryColor)})` }} />
                        <span>{form.serviceArea}</span>
                      </div>
                    </div>
                    {(form.socialFacebook || form.socialInstagram || form.socialYoutube || form.socialGoogle) && (
                      <div className="flex items-center gap-2 pt-2 border-t">
                        {form.socialFacebook && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
                        {form.socialInstagram && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
                        {form.socialYoutube && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
                        {form.socialGoogle && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />}
                      </div>
                    )}
                  </div>
                  <div className="p-2 border-t text-center">
                    <span className="text-[10px] text-muted-foreground" style={{ fontFamily: form.fontFamily }}>
                      &copy; {new Date().getFullYear()} {form.companyName}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Color Swatches</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: form.primaryColor }} />
                    <div>
                      <p className="text-xs font-medium">Primary</p>
                      <p className="text-xs text-muted-foreground">{form.primaryColor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md border" style={{ backgroundColor: form.secondaryColor }} />
                    <div>
                      <p className="text-xs font-medium">Secondary</p>
                      <p className="text-xs text-muted-foreground">{form.secondaryColor}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
