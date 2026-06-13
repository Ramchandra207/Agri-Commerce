import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/shipping")({
  head: () => pageMeta("Shipping Policy — AgriCommerce", "Delivery timelines and coverage."),
  component: () => <CmsPage slug="shipping" fallbackTitle="Shipping Policy" />,
});