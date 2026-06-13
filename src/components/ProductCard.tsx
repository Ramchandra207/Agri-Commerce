import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { formatPrice, useCart, useMode } from "@/lib/store-context";
import { toast } from "sonner";

export type ProductCardProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[] | null;
  stock: number;
};

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const { mode } = useMode();
  const { add } = useCart();
  const img = product.images?.[0] ?? "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant">
      <Link to="/products/$slug" params={{ slug: product.slug }} className="block overflow-hidden">
        <div className="aspect-square w-full overflow-hidden bg-muted">
          <img src={img} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link to="/products/$slug" params={{ slug: product.slug }}>
          <h3 className="line-clamp-2 font-display text-base font-semibold text-foreground hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-between">
          {mode === "b2c" ? (
            <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
          ) : (
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary">Wholesale</span>
          )}
        </div>
        {mode === "b2c" ? (
          <Button
            variant="default"
            size="sm"
            className="w-full"
            onClick={() => {
              add({ id: product.id, name: product.name, slug: product.slug, price: product.price, image: img });
              toast.success("Added to cart");
            }}
          >
            Add to Cart
          </Button>
        ) : (
          <Button asChild size="sm" variant="secondary" className="w-full">
            <Link to="/products/$slug" params={{ slug: product.slug }}>Request Quote</Link>
          </Button>
        )}
      </div>
    </div>
  );
}