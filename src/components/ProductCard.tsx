import { Link } from "./Link";
import { ProductImage } from "./ProductImage";
import type { Product } from "@/lib/catalog";

/**
 * Grid card. The whole card is one link — no hover-only affordances, so it
 * behaves identically on touch. Fixed image ratio + clamped text keeps every
 * row aligned regardless of name length.
 */
export function ProductCard({
  product,
  priority = false,
  sizes,
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="spot group flex flex-col overflow-hidden rounded-xl border border-ink-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-600/5 focus-visible:-translate-y-1 focus-visible:shadow-xl"
    >
      <div className="relative overflow-hidden bg-white p-3 sm:p-4">
        <ProductImage
          image={product.images[0]}
          priority={priority}
          sizes={sizes}
          fallbackLabel={product.name}
          className="transition-transform duration-300 group-hover:scale-[1.04]"
        />

        {product.standards.length > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-ink-900/85 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
            {product.standards[0]}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col border-t border-ink-100 p-3 sm:p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink-900 transition-colors group-hover:text-brand-600">
          {product.name}
        </h3>

        {product.summary && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-500">
            {product.summary}
          </p>
        )}

        <span className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-600">
          View details
          <svg
            viewBox="0 0 20 20"
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
