import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Leaf, Truck, ShieldCheck, Sprout } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useMode } from "@/lib/store-context";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => pageMeta(
    "AgriCommerce — Seeds, Fertilizers & Farm Inputs",
    "Shop premium agri inputs at retail prices or request bulk wholesale quotes.",
  ),
  component: Home,
});

function Home() {
  const { mode } = useMode();
  const banner = useQuery({
    queryKey: ["banner"],
    queryFn: async () => (await supabase.from("banners").select("*").eq("status", true).order("display_order").limit(1).maybeSingle()).data,
  });
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await supabase.from("categories").select("*").eq("status", true).order("display_order")).data ?? [],
  });
  const featured = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => (await supabase.from("products").select("*").eq("featured", true).limit(8)).data ?? [],
  });
  const testimonials = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => (await supabase.from("testimonials").select("*").order("display_order")).data ?? [],
  });

  const b = banner.data;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${b?.image_url ?? "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600"})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-secondary/30" />
        <div className="container relative mx-auto px-4 py-24 md:py-36">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur">
            <Sprout className="h-3.5 w-3.5" /> Trusted by 50,000+ farmers
          </span>
          <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight text-white md:text-6xl">
            {b?.title ?? "Grow More. Earn More."}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">
            {b?.subtitle ?? "Premium seeds, fertilizers and tools delivered to your farm."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-primary hover:bg-primary-glow">
              <Link to="/products">Shop Products <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white bg-white/10 text-white hover:bg-white hover:text-secondary">
              <Link to="/enquiry">Request Bulk Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="container mx-auto grid gap-6 px-4 py-16 md:grid-cols-4">
        {[
          { icon: ShieldCheck, t: "Certified Quality", d: "Government-certified seeds & inputs." },
          { icon: Truck, t: "Pan-India Delivery", d: "Direct-to-farm in 3–7 days." },
          { icon: Leaf, t: "Organic Range", d: "Eco-friendly, residue-free." },
          { icon: Sprout, t: "Expert Support", d: "Agronomists on call for guidance." },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-accent text-accent-foreground">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Shop by Category</h2>
            <p className="mt-2 text-muted-foreground">Find the right inputs for every season.</p>
          </div>
          <Link to="/products" className="hidden text-sm font-semibold text-primary hover:underline md:block">View all →</Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(categories.data ?? []).map((c) => (
            <Link
              key={c.id}
              to="/products"
              search={{ category: c.slug } as any}
              className="group relative overflow-hidden rounded-2xl shadow-card"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                <img src={c.image_url ?? ""} alt={c.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-xl font-bold text-white">{c.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Featured Products</h2>
        <p className="mt-2 text-muted-foreground">Our best-selling agricultural essentials.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(featured.data ?? []).map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-glow p-10 text-primary-foreground shadow-elegant md:p-16">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                {mode === "b2b" ? "Need bulk pricing?" : "Going wholesale?"}
              </h2>
              <p className="mt-3 max-w-md text-primary-foreground/90">
                {mode === "b2b"
                  ? "Submit a bulk enquiry and our team will get back with your custom quote within 24 hours."
                  : "Switch to wholesale mode to request bulk pricing for your business."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Button asChild size="lg" variant="secondary">
                <Link to="/enquiry">Submit Enquiry</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Link to="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-display text-3xl font-bold md:text-4xl">What farmers say</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {(testimonials.data ?? []).map((t) => (
            <div key={t.id} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <p className="text-foreground/85 italic">"{t.message}"</p>
              <div className="mt-5 flex items-center gap-3">
                {t.image_url && <img src={t.image_url} alt={t.name} className="h-10 w-10 rounded-full object-cover" />}
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.designation}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
