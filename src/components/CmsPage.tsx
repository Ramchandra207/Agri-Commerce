import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export function CmsPage({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["cms", slug],
    queryFn: async () => (await supabase.from("cms_pages").select("*").eq("slug", slug).maybeSingle()).data,
  });
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-display text-4xl font-bold">{data?.title ?? fallbackTitle}</h1>
        {isLoading ? (
          <p className="mt-6 text-muted-foreground">Loading…</p>
        ) : (
          <div className="prose prose-lg mt-8 whitespace-pre-wrap text-foreground/85">
            {data?.content ?? "Content coming soon."}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}