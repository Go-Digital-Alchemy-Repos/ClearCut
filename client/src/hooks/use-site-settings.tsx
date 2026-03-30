import { createContext, useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SiteSettings } from "@shared/schema";

const DEFAULT_SETTINGS: Omit<SiteSettings, "id" | "updatedAt"> = {
  companyName: "Brush Boss",
  phone: "(704) 608-5783",
  email: "info@brushboss.com",
  serviceArea: "Charlotte, NC & Surrounding Areas",
  logoUrl: null,
  primaryColor: "28 65% 42%",
  secondaryColor: "85 35% 38%",
  fontFamily: "Inter",
  ctaText: "Get a Fast Quote",
  socialFacebook: null,
  socialInstagram: null,
  socialYoutube: null,
  socialGoogle: null,
};

interface SiteSettingsContext {
  settings: Omit<SiteSettings, "id" | "updatedAt">;
  isLoading: boolean;
}

const SettingsContext = createContext<SiteSettingsContext>({
  settings: DEFAULT_SETTINGS,
  isLoading: true,
});

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/public/settings"],
    staleTime: 60000,
    retry: 1,
  });

  const settings = data
    ? {
        companyName: data.companyName,
        phone: data.phone,
        email: data.email,
        serviceArea: data.serviceArea,
        logoUrl: data.logoUrl,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        fontFamily: data.fontFamily,
        ctaText: data.ctaText,
        socialFacebook: data.socialFacebook,
        socialInstagram: data.socialInstagram,
        socialYoutube: data.socialYoutube,
        socialGoogle: data.socialGoogle,
      }
    : DEFAULT_SETTINGS;

  useEffect(() => {
    if (!data) return;
    const root = document.documentElement;
    root.style.setProperty("--primary", data.primaryColor);
    root.style.setProperty("--secondary-brand", data.secondaryColor);
    if (data.fontFamily && data.fontFamily !== "Inter") {
      root.style.fontFamily = `${data.fontFamily}, sans-serif`;
    } else {
      root.style.fontFamily = "";
    }
  }, [data]);

  return (
    <SettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SettingsContext);
}
