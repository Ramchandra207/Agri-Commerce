import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/contact")({
  head: () => pageMeta("Contact AgriCommerce", "Get in touch with our team."),
  component: () => <CmsPage slug="contact" fallbackTitle="Contact Us" />,
});