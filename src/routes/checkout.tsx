import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice, useCart } from "@/lib/store-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { pageMeta } from "@/lib/seo";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => pageMeta("Checkout — AgriCommerce", "Complete your order."),
  component: Checkout,
});

function Checkout() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [form, setForm] = useState({
    customer_name: "", email: "", phone: "",
    address: "", city: "", state: "", pincode: "", notes: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return toast.error("Cart is empty");
    setSubmitting(true);
    const { data, error } = await supabase.from("orders").insert({
      ...form,
      items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      total,
    }).select("id").maybeSingle();
    setSubmitting(false);
    if (error || !data) return toast.error("Failed to place order");
    setOrderId(data.id);
    clear();
  };

  if (orderId) {
    return (
      <div className="min-h-screen"><SiteHeader />
        <section className="container mx-auto px-4 py-20 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
          <h1 className="mt-4 font-display text-3xl font-bold">Order placed!</h1>
          <p className="mt-2 text-muted-foreground">Reference: <span className="font-mono">{orderId.slice(0, 8)}</span></p>
          <p className="mt-1 text-muted-foreground">We'll email you a confirmation shortly.</p>
          <Button className="mt-8" onClick={() => navigate({ to: "/" })}>Back to home</Button>
        </section>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto grid gap-10 px-4 py-12 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="space-y-6">
          <h1 className="font-display text-3xl font-bold">Checkout</h1>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-lg font-bold">Shipping details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><Label>Full name *</Label><Input required value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} /></div>
              <div><Label>Email *</Label><Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Phone *</Label><Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="sm:col-span-2"><Label>Address *</Label><Textarea required rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              <div><Label>City *</Label><Input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
              <div><Label>State *</Label><Input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
              <div><Label>Pincode *</Label><Input required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} /></div>
              <div className="sm:col-span-2"><Label>Order notes</Label><Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            </div>
          </div>
          <Button type="submit" size="lg" disabled={submitting || items.length === 0} className="w-full">
            {submitting ? "Placing order…" : `Place Order — ${formatPrice(total)}`}
          </Button>
        </form>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-lg font-bold">Order Summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((it) => (
              <li key={it.id} className="flex justify-between">
                <span className="text-muted-foreground">{it.name} × {it.qty}</span>
                <span className="font-semibold">{formatPrice(it.price * it.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-bold">
            <span>Total</span><span className="text-primary">{formatPrice(total)}</span>
          </div>
        </aside>
      </section>
      <SiteFooter />
    </div>
  );
}