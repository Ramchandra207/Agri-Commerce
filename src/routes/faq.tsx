import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/faq")({
  head: () => pageMeta("FAQ — AgriCommerce", "Common questions about ordering."),
  component: () => <CmsPage slug="faq" fallbackTitle="Frequently Asked Questions" />,
});