import { useEffect } from "react";

interface PageMeta {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  jsonLd?: string;
  robots?: string;
  twitterCard?: "summary" | "summary_large_image";
}

const SITE_NAME = "Clearcut Land Management";
const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";

function setMetaTag(property: string, content: string, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${property}"]`);
  if (content) {
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, property);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  } else if (el) {
    el.remove();
  }
}

function setLinkTag(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (href) {
    if (!el) {
      el = document.createElement("link");
      el.rel = rel;
      document.head.appendChild(el);
    }
    el.href = href;
  } else if (el) {
    el.remove();
  }
}

export function usePageMeta({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogTitle,
  ogDescription,
  ogType,
  jsonLd,
  robots,
  twitterCard,
}: PageMeta) {
  useEffect(() => {
    const fullCanonical = canonicalUrl
      ? canonicalUrl.startsWith("http")
        ? canonicalUrl
        : `${BASE_URL}${canonicalUrl}`
      : `${BASE_URL}${window.location.pathname}`;

    document.title = title;

    setMetaTag("description", description);
    // Pre-launch: force noindex on every page. Restore `robots || "index, follow"` at launch.
    setMetaTag("robots", "noindex, nofollow");

    setLinkTag("canonical", fullCanonical);

    setMetaTag("og:title", ogTitle || title, true);
    setMetaTag("og:description", ogDescription || description, true);
    setMetaTag("og:image", ogImage || "", true);
    setMetaTag("og:type", ogType || "website", true);
    setMetaTag("og:url", fullCanonical, true);
    setMetaTag("og:site_name", SITE_NAME, true);
    setMetaTag("og:locale", "en_US", true);

    setMetaTag("twitter:card", twitterCard || "summary_large_image");
    setMetaTag("twitter:title", ogTitle || title);
    setMetaTag("twitter:description", ogDescription || description);
    setMetaTag("twitter:image", ogImage || "");

    let scriptEl = document.querySelector('script[data-seo-jsonld]') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.type = "application/ld+json";
        scriptEl.setAttribute("data-seo-jsonld", "true");
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = jsonLd;
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      const ldScript = document.querySelector('script[data-seo-jsonld]');
      if (ldScript) ldScript.remove();
    };
  }, [title, description, canonicalUrl, ogImage, ogTitle, ogDescription, ogType, jsonLd, robots, twitterCard]);
}
