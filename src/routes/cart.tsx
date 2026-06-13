import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { formatPrice, useCart } from "@/lib/store-context";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/cart")({
  head: () => pageMeta("Your Cart — AgriCommerce", "Review and checkout your selected products."),
  component: CartPage,
});

function CartPage() {
  const { items, update, remove, total } = useCart();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Your Cart</h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-16 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Your cart is empty.</p>
            <Button asChild className="mt-6"><Link to="/products">Browse products</Link></Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {items.map((it) => (
                <div key={it.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-card">
                  <img src={it.image} alt={it.name} className="h-24 w-24 rounded-xl object-cover" />
                  <div className="flex flex-1 flex-col">
                    <Link to="/products/$slug" params={{ slug: it.slug }} className="font-display font-semibold hover:text-primary">{it.name}</Link>
                    <div className="text-sm text-muted-foreground">{formatPrice(it.price)} each</div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-border">
                        <Button size="icon" variant="ghost" onClick={() => update(it.id, it.qty - 1)}><Minus className="h-4 w-4" /></Button>
                        <span className="w-10 text-center font-semibold">{it.qty}</span>
                        <Button size="icon" variant="ghost" onClick={() => update(it.id, it.qty + 1)}><Plus className="h-4 w-4" /></Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{formatPrice(it.price * it.qty)}</span>
                        <Button size="icon" variant="ghost" onClick={() => remove(it.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-display text-lg font-bold">Order Summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className="text-muted-foreground">Calculated at checkout</span></div>
              </div>
              <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-bold">
                <span>Total</span><span className="text-primary">{formatPrice(total)}</span>
              </div>
              <Button asChild size="lg" className="mt-6 w-full"><Link to="/checkout">Proceed to Checkout</Link></Button>
            </aside>
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}