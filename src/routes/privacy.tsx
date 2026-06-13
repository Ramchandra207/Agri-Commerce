import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/privacy")({
  head: () => pageMeta("Privacy Policy — AgriCommerce", "How we handle your data."),
  component: () => <CmsPage slug="privacy" fallbackTitle="Privacy Policy" />,
});