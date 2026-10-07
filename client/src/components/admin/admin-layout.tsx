import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import {
  LayoutDashboard, Users, FileText, Palette, BookOpen,
  LogOut, Loader2, ExternalLink, Menu, X, Shield, ShieldAlert,
  FolderOpen, MessageSquareQuote, ChevronDown, Layout, LayoutGrid,
  ImageIcon, ArrowRightLeft, Search, Settings
} from "lucide-react";
import { useState } from "react";
import AdminLogin from "@/pages/admin/login";
import type { AdminRole } from "@shared/schema";

interface NavItem {
  title: string;
  href: string;
  icon: any;
  allowedRoles: AdminRole[];
}

interface NavGroup {
  title: string;
  icon: any;
  allowedRoles: AdminRole[];
  basePath: string;
  children: NavItem[];
}

type NavEntry = NavItem | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return "children" in entry;
}

const cmsChildren: NavItem[] = [
  { title: "Pages", href: "/admin/cms/pages", icon: FileText, allowedRoles: ["super_admin", "admin", "editor"] },
  { title: "Blog Posts", href: "/admin/cms/blog", icon: BookOpen, allowedRoles: ["super_admin", "admin", "editor"] },
  { title: "Templates", href: "/admin/cms/templates", icon: Layout, allowedRoles: ["super_admin", "admin", "editor"] },
  { title: "Block Library", href: "/admin/cms/blocks", icon: LayoutGrid, allowedRoles: ["super_admin", "admin", "editor"] },
  { title: "Media Library", href: "/admin/cms/media", icon: ImageIcon, allowedRoles: ["super_admin", "admin", "editor"] },
  { title: "Themes", href: "/admin/cms/themes", icon: Palette, allowedRoles: ["super_admin", "admin", "editor"] },
  { title: "Redirects", href: "/admin/cms/redirects", icon: ArrowRightLeft, allowedRoles: ["super_admin", "admin", "editor"] },
  { title: "Testimonials", href: "/admin/cms/testimonials", icon: MessageSquareQuote, allowedRoles: ["super_admin", "admin", "editor"] },
];

const navEntries: NavEntry[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard, allowedRoles: ["super_admin", "admin", "editor", "sales"] },
  { title: "Leads", href: "/admin/leads", icon: Users, allowedRoles: ["super_admin", "admin", "sales"] },
  { title: "Projects", href: "/admin/crm/projects", icon: FolderOpen, allowedRoles: ["super_admin", "admin", "sales"] },
  {
    title: "CMS",
    icon: FileText,
    allowedRoles: ["super_admin", "admin", "editor"],
    basePath: "/admin/cms",
    children: cmsChildren,
  },
  { title: "Branding", href: "/admin/branding", icon: Palette, allowedRoles: ["super_admin", "admin"] },
  { title: "Docs", href: "/admin/docs", icon: BookOpen, allowedRoles: ["super_admin", "admin", "editor", "sales"] },
  { title: "Settings", href: "/admin/settings", icon: Settings, allowedRoles: ["super_admin", "admin"] },
];

const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
  sales: "Sales",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, logout, isLoggingOut, hasRole } = useAdminAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isCmsSection = location.startsWith("/admin/cms");
  const [cmsOpen, setCmsOpen] = useState(isCmsSection);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const visibleEntries = navEntries.filter((entry) => hasRole(entry.allowedRoles));

  const allAllowedPaths: string[] = [];
  visibleEntries.forEach((entry) => {
    if (isGroup(entry)) {
      entry.children.filter(c => hasRole(c.allowedRoles)).forEach(c => allAllowedPaths.push(c.href));
      allAllowedPaths.push(entry.basePath);
    } else {
      allAllowedPaths.push(entry.href);
    }
  });

  const isBlockedRoute = !allAllowedPaths.some(
    (path) => location === path || (path !== "/admin" && location.startsWith(path))
  ) && location !== "/admin";

  const renderNavItem = (item: NavItem, indent = false) => {
    const isActive = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
    return (
      <Link key={item.href} href={item.href} data-testid={`nav-admin-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
        <button
          onClick={() => setMobileOpen(false)}
          className={`
            w-full flex items-center gap-2.5 py-2 rounded-md text-sm transition-colors
            ${indent ? "pl-9 pr-3" : "px-3"}
            ${isActive
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }
          `}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {item.title}
        </button>
      </Link>
    );
  };

  const renderNavGroup = (group: NavGroup) => {
    const isAnyCmsActive = location.startsWith(group.basePath);
    const visibleChildren = group.children.filter(c => hasRole(c.allowedRoles));
    const expanded = cmsOpen || isAnyCmsActive;

    return (
      <div key={group.title}>
        <button
          onClick={() => setCmsOpen(!expanded)}
          className={`
            w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors
            ${isAnyCmsActive
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }
          `}
          data-testid={`nav-admin-${group.title.toLowerCase()}`}
        >
          <group.icon className="h-4 w-4 shrink-0" />
          {group.title}
          <ChevronDown className={`h-3.5 w-3.5 ml-auto shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </button>
        {expanded && (
          <div className="mt-0.5 space-y-0.5">
            {visibleChildren.map((child) => renderNavItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-56 border-r bg-card flex flex-col transition-transform duration-200
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
        data-testid="admin-sidebar"
      >
        <div className="flex items-center gap-2 px-4 h-14 border-b shrink-0">
          <img src="/brand/clearcut-symbol.svg" alt="" className="h-7 w-7" />
          <span className="font-display font-bold text-lg leading-none tracking-wide uppercase text-primary">Clearcut</span>
          <button
            className="lg:hidden ml-auto p-1"
            onClick={() => setMobileOpen(false)}
            data-testid="button-close-sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {visibleEntries.map((entry) =>
            isGroup(entry) ? renderNavGroup(entry) : renderNavItem(entry)
          )}
        </nav>

        <div className="border-t p-3 space-y-2">
          <div className="px-3 py-1 text-xs text-muted-foreground flex items-center gap-1.5" data-testid="text-admin-role">
            <Shield className="h-3 w-3 shrink-0" />
            {user?.role ? ROLE_LABELS[user.role] : "Unknown"}
          </div>
          <Link href="/">
            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
              data-testid="link-view-site"
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
              View Site
            </button>
          </Link>
          <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50 transition-colors"
            data-testid="button-admin-logout"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            ) : (
              <LogOut className="h-4 w-4 shrink-0" />
            )}
            Log Out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 h-14 border-b bg-card flex items-center px-4 gap-3">
          <button
            className="lg:hidden p-1.5 rounded-md hover:bg-muted/50"
            onClick={() => setMobileOpen(true)}
            data-testid="button-open-sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm text-muted-foreground lg:hidden font-medium">Admin</span>
          <div className="ml-auto text-sm text-muted-foreground" data-testid="text-admin-user">
            {user?.username}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {isBlockedRoute ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center" data-testid="access-denied">
              <ShieldAlert className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-lg font-semibold mb-2">Insufficient Permissions</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Your current role ({user?.role ? ROLE_LABELS[user.role] : "unknown"}) does not have access to this section. Contact a Super Admin if you need elevated permissions.
              </p>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
