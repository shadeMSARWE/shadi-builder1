/**
 * WEBSITE_ENGINE_PRO - JSON Schema
 */
export interface WebsiteStructure {
  business_type: string;
  target_audience: string;
  pages: Array<{ id: string; name: string; path: string }>;
  sections: Array<{
    id: string;
    page_id: string;
    type: string;
    content: Record<string, unknown>;
    order: number;
  }>;
  color_palette: { primary: string; secondary: string; accent: string };
  typography: { heading: string; body: string };
  layout_style: string;
  images_needed: Array<{ section_id: string; prompt: string }>;
}

export function validateWebsiteStructure(data: unknown): WebsiteStructure {
  const d = data as Record<string, unknown>;
  return {
    business_type: (d.business_type as string) || "business",
    target_audience: (d.target_audience as string) || "general",
    pages: Array.isArray(d.pages) ? d.pages as WebsiteStructure["pages"] : [
      { id: "home", name: "Home", path: "index.html" },
      { id: "about", name: "About", path: "about.html" },
      { id: "services", name: "Services", path: "services.html" },
      { id: "contact", name: "Contact", path: "contact.html" },
    ],
    sections: (() => {
      let s = Array.isArray(d.sections) ? d.sections as WebsiteStructure["sections"] : [];
      if (s.length === 0) {
        const bt = (d.business_type as string) || "Business";
        const pages: WebsiteStructure["pages"] = Array.isArray(d.pages) ? d.pages as WebsiteStructure["pages"] : [
          { id: "home", name: "Home", path: "index.html" },
          { id: "about", name: "About", path: "about.html" },
          { id: "services", name: "Services", path: "services.html" },
          { id: "contact", name: "Contact", path: "contact.html" },
        ];
        s = [
          { id: "nav", page_id: "home", type: "navbar", content: { title: bt, links: pages.map(p => ({ label: p.name, href: p.path })), ctaText: "Contact" }, order: 0 },
          { id: "hero", page_id: "home", type: "hero", content: { title: `Welcome to ${bt}`, subtitle: "Professional solutions", ctaText: "Get Started" }, order: 1 },
          { id: "feat", page_id: "home", type: "features", content: { title: "Our Services", items: [{ title: "Service 1", description: "Description" }, { title: "Service 2", description: "Description" }, { title: "Service 3", description: "Description" }] }, order: 2 },
          { id: "contact-sec", page_id: "home", type: "contact", content: { title: "Contact Us", phone: "", email: "", whatsapp: "" }, order: 3 },
          { id: "foot", page_id: "home", type: "footer", content: { title: `© ${new Date().getFullYear()} ${bt}` }, order: 4 },
        ];
      }
      return s;
    })(),
    color_palette: (d.color_palette as WebsiteStructure["color_palette"]) || {
      primary: "#6366f1",
      secondary: "#0f172a",
      accent: "#f3c969",
    },
    typography: (d.typography as WebsiteStructure["typography"]) || {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
    layout_style: (d.layout_style as string) || "modern",
    images_needed: Array.isArray(d.images_needed) ? d.images_needed as WebsiteStructure["images_needed"] : [],
  };
}
