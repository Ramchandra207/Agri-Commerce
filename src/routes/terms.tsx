import { createFileRoute } from "@tanstack/react-router";
import { CmsPage } from "@/components/CmsPage";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/terms")({
  head: () => pageMeta("Terms & Conditions — AgriCommerce", "Terms of using AgriCommerce."),
  component: () => <CmsPage slug="terms" fallbackTitle="Terms & Conditions" />,
});