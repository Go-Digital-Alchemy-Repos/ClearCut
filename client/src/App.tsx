import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteSettingsProvider } from "@/hooks/use-site-settings";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { PreviewGate } from "@/components/preview-gate";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Services from "@/pages/services";
import ServiceDetail from "@/pages/service-detail";
import Pricing from "@/pages/pricing";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Quote from "@/pages/quote";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminLeads from "@/pages/admin/leads";
import LeadDetail from "@/pages/admin/lead-detail";
import CmsPageView from "@/pages/cms-page";
import AdminCmsHome from "@/pages/admin/cms-home";
import AdminCmsPages from "@/pages/admin/cms-pages";
import AdminCmsPageBuilder from "@/pages/admin/cms-page-builder";
import AdminBlogList from "@/pages/admin/blog-list";
import AdminBlogEditor from "@/pages/admin/blog-editor";
import AdminBranding from "@/pages/admin/branding";
import AdminDocs from "@/pages/admin/docs";
import AdminSettings from "@/pages/admin/settings";
import AdminCmsTemplates from "@/pages/admin/cms-templates";
import AdminCmsBlocks from "@/pages/admin/cms-blocks";
import AdminCmsMedia from "@/pages/admin/cms-media";
import AdminCmsThemes from "@/pages/admin/cms-themes";
import AdminCmsRedirects from "@/pages/admin/cms-redirects";
import AdminCrmProjects from "@/pages/admin/crm-projects";
import AdminCmsTestimonials from "@/pages/admin/cms-testimonials";
import CityLanding from "@/pages/city-landing";
import Projects from "@/pages/projects";
import ProjectDetail from "@/pages/project-detail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/services" component={Services} />
      <Route path="/services/:slug" component={ServiceDetail} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/quote" component={Quote} />
      <Route path="/areas/:city" component={CityLanding} />
      <Route path="/projects" component={Projects} />
      <Route path="/projects/:slug" component={ProjectDetail} />
      <Route path="/p/:slug" component={CmsPageView} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/leads" component={AdminLeads} />
      <Route path="/admin/leads/:id" component={LeadDetail} />
      <Route path="/admin/crm/projects" component={AdminCrmProjects} />
      <Route path="/admin/cms" component={AdminCmsHome} />
      <Route path="/admin/cms/pages" component={AdminCmsPages} />
      <Route path="/admin/cms/pages/new" component={AdminCmsPageBuilder} />
      <Route path="/admin/cms/pages/:id" component={AdminCmsPageBuilder} />
      <Route path="/admin/cms/blog" component={AdminBlogList} />
      <Route path="/admin/cms/blog/:id" component={AdminBlogEditor} />
      <Route path="/admin/cms/templates" component={AdminCmsTemplates} />
      <Route path="/admin/cms/blocks" component={AdminCmsBlocks} />
      <Route path="/admin/cms/media" component={AdminCmsMedia} />
      <Route path="/admin/cms/themes" component={AdminCmsThemes} />
      <Route path="/admin/cms/redirects" component={AdminCmsRedirects} />
      <Route path="/admin/cms/testimonials" component={AdminCmsTestimonials} />
      <Route path="/admin/branding" component={AdminBranding} />
      <Route path="/admin/docs" component={AdminDocs} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ScrollToTop() {
  useScrollToTop();
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SiteSettingsProvider>
          <ScrollToTop />
          <Toaster />
          <PreviewGate>
            <Router />
          </PreviewGate>
        </SiteSettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
