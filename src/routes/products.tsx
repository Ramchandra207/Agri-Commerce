import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";

type ProductsSearch = { category?: string; q?: string };

export const Route = createFileRoute("/products")({
  validateSearch: (s: Record<string, unknown>): ProductsSearch => ({
    category: typeof s.category === "string" ? s.category : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  head: () => pageMeta("Products — AgriCommerce", "Browse seeds, fertilizers, tools and organic farm products."),
  component: ProductsPage,
});

const PAGE_SIZE = 12;

function ProductsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState(search.q ?? "");

  const categories = useQuery({
    queryKey: ["categories-all"],
    queryFn: async () => (await supabase.from("categories").select("*").eq("status", true).order("display_order")).data ?? [],
  });

  const products = useQuery({
    queryKey: ["products", search.category, search.q, page],
    queryFn: async () => {
      let q = supabase.from("products").select("*, categories(slug)", { count: "exact" });
      if (search.category) {
        const cat = (categories.data ?? []).find((c) => c.slug === search.category);
        if (cat) q = q.eq("category_id", cat.id);
      }
      if (search.q) q = q.ilike("name", `%${search.q}%`);
      q = q.range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1).order("created_at", { ascending: false });
      const { data, count } = await q;
      return { items: data ?? [], count: count ?? 0 };
    },
  });

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ search: (prev: ProductsSearch) => ({ ...prev, q: query || undefined }) });
    setPage(0);
  };

  const totalPages = Math.max(1, Math.ceil((products.data?.count ?? 0) / PAGE_SIZE));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="border-b border-border bg-muted/40">
        <div className="container mx-auto px-4 py-10">
          <h1 className="font-display text-3xl font-bold md:text-4xl">All Products</h1>
          <p className="mt-2 text-muted-foreground">Premium agricultural inputs for every season.</p>
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-6">
          <form onSubmit={submitSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="pl-9" />
          </form>
          <div>
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">Categories</h3>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => { navigate({ search: (p: ProductsSearch) => ({ ...p, category: undefined }) }); setPage(0); }}
                className={cn("rounded-md px-3 py-2 text-left text-sm hover:bg-muted", !search.category && "bg-primary/10 font-semibold text-primary")}
              >All Categories</button>
              {(categories.data ?? []).map((c) => (
                <button
                  key={c.id}
                  onClick={() => { navigate({ search: (p: ProductsSearch) => ({ ...p, category: c.slug }) }); setPage(0); }}
                  className={cn("rounded-md px-3 py-2 text-left text-sm hover:bg-muted", search.category === c.slug && "bg-primary/10 font-semibold text-primary")}
                >{c.name}</button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          {products.isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : (products.data?.items.length ?? 0) === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-16 text-center">
              <p className="text-muted-foreground">No products found.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products.data!.items.map((p: any) => <ProductCard key={p.id} product={p} />)}
              </div>
              {totalPages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                  <span className="grid place-items-center px-4 text-sm text-muted-foreground">Page {page + 1} of {totalPages}</span>
                  <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}