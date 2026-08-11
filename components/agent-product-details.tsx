"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { ProductDetailsToolInvocation } from "@/lib/agent";

interface AgentProductDetailsProps {
  invocation: ProductDetailsToolInvocation;
}

export function AgentProductDetails({ invocation }: AgentProductDetailsProps) {
  if (
    invocation.state === "input-streaming" ||
    invocation.state === "input-available"
  ) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        Looking up product details…
      </div>
    );
  }

  if (invocation.state !== "output-available") return null;

  const output = invocation.output;

  if (!output) return null;

  if ("error" in output && output.error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {output.error}
      </div>
    );
  }

  if (!("product" in output) || !output.product) return null;

  const { product } = output;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Link
        href={`/products/${product.slug}`}
        className="block transition-colors hover:bg-secondary/50"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-secondary">
          {product.images?.[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 320px"
              className="object-cover"
            />
          )}
        </div>
        <div className="space-y-2 p-4">
          <h3 className="text-sm font-semibold leading-tight">
            {product.name}
          </h3>
          <p className="text-sm font-medium">
            {formatPrice(product.price, product.currency)}
          </p>
          <p className="line-clamp-3 text-xs text-muted-foreground">
            {product.description}
          </p>
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
