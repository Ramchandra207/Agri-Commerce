import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/returns")({
  head: () => pageMeta("Return Policy — AgriCommerce", "Returns and refunds."),
  component: () => <CmsPage slug="returns" fallbackTitle="Return Policy" />,
});