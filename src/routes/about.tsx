import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/about")({
  head: () => pageMeta("About AgriCommerce", "India's trusted agricultural ecommerce platform."),
  component: () => <CmsPage slug="about" fallbackTitle="About Us" />,
});