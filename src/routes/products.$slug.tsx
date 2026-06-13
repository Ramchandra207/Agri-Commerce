import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Minus, Plus, ShoppingCart, ShieldCheck, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice, useCart, useMode } from "@/lib/store-context";
import { toast } from "sonner";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/products/$slug")({
  head: ({ params }) => pageMeta(`${params.slug.replace(/-/g, " ")} — AgriCommerce`, "Product details, specifications and pricing."),
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = Route.useParams();
  const { mode } = useMode();
  const { add } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const product = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => (await supabase.from("products").select("*").eq("slug", slug).maybeSingle()).data,
  });

  const related = useQuery({
    queryKey: ["related", product.data?.category_id],
    enabled: !!product.data?.category_id,
    queryFn: async () => (await supabase.from("products").select("*").eq("category_id", product.data!.category_id!).neq("id", product.data!.id).limit(4)).data ?? [],
  });

  if (product.isLoading) {
    return <div className="min-h-screen"><SiteHeader /><div className="container mx-auto p-16 text-center text-muted-foreground">Loading…</div></div>;
  }
  const p = product.data;
  if (!p) {
    return (
      <div className="min-h-screen"><SiteHeader />
        <div className="container mx-auto p-16 text-center">
          <h1 className="font-display text-2xl font-bold">Product not found</h1>
          <Button asChild className="mt-4"><Link to="/products">Back to products</Link></Button>
        </div>
      </div>
    );
  }
  const img = p.images?.[0] ?? "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800";
  const inStock = p.stock > 0;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-muted shadow-card">
          <img src={img} alt={p.name} className="aspect-square w-full object-cover" />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">In Stock: {inStock ? p.stock : "Out of stock"}</div>
          <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">{p.name}</h1>

          {mode === "b2c" ? (
            <div className="mt-5 text-3xl font-bold text-primary">{formatPrice(Number(p.price))}</div>
          ) : (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-sm font-semibold text-secondary">
              Wholesale pricing on request
            </div>
          )}

          <p className="mt-5 text-foreground/80">{p.description}</p>

          {p.specifications && Object.keys(p.specifications as object).length > 0 && (
            <div className="mt-6 rounded-xl border border-border bg-card p-5">
              <h3 className="font-display font-semibold">Specifications</h3>
              <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                {Object.entries(p.specifications as Record<string, string>).map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="capitalize text-muted-foreground">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {mode === "b2c" ? (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-full border border-border">
                <Button size="icon" variant="ghost" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <Button size="icon" variant="ghost" onClick={() => setQty((q) => q + 1)}><Plus className="h-4 w-4" /></Button>
              </div>
              <Button
                size="lg"
                disabled={!inStock}
                onClick={() => {
                  add({ id: p.id, name: p.name, slug: p.slug, price: Number(p.price), image: img }, qty);
                  toast.success(`Added ${qty} × ${p.name} to cart`);
                }}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
              <Button size="lg" variant="secondary" onClick={() => {
                add({ id: p.id, name: p.name, slug: p.slug, price: Number(p.price), image: img }, qty);
                navigate({ to: "/checkout" });
              }}>Buy Now</Button>
            </div>
          ) : (
            <ProductEnquiryForm productId={p.id} productName={p.name} />
          )}

          <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Certified product</div>
            <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Fast delivery</div>
          </div>
        </div>
      </section>

      {(related.data?.length ?? 0) > 0 && (
        <section className="container mx-auto px-4 py-10">
          <h2 className="font-display text-2xl font-bold">Related products</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.data!.map((rp: any) => <ProductCard key={rp.id} product={rp} />)}
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}

function ProductEnquiryForm({ productId, productName }: { productId: string; productName: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ company_name: "", contact_person: "", phone: "", email: "", quantity: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("enquiries").insert({
      type: "product",
      product_id: productId,
      products: [{ id: productId, name: productName }],
      ...form,
    });
    setSubmitting(false);
    if (error) return toast.error("Failed to submit enquiry");
    toast.success("Enquiry submitted. We'll be in touch within 24 hours.");
    setForm({ company_name: "", contact_person: "", phone: "", email: "", quantity: "", message: "" });
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
      <h3 className="font-display text-lg font-bold">Request a Quote</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>Company name</Label><Input required value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} /></div>
        <div><Label>Contact person *</Label><Input required value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} /></div>
        <div><Label>Phone *</Label><Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <div><Label>Email *</Label><Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div className="sm:col-span-2"><Label>Quantity required</Label><Input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 500 kg" /></div>
        <div className="sm:col-span-2"><Label>Message</Label><Textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
      </div>
      <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Submitting…" : "Request Quote"}</Button>
    </form>
  );
}