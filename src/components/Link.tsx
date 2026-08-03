import NextLink from "next/link";
import type { ComponentProps } from "react";

/**
 * `next/link` with prefetching off by default.
 *
 * Next 16's client segment cache writes prefetch payloads for dynamic routes to
 * paths like `__next.products/$d$category.txt`, but the browser requests them
 * dot-joined (`__next.products.$d$category.txt`). Under `output: "export"`
 * nothing reconciles the two, so every prefetch is a guaranteed 404 — console
 * noise and wasted requests for a payload that can never arrive.
 *
 * Navigation itself is unaffected: pages are prerendered HTML on a CDN.
 *
 * If the site later moves to Netlify's Next.js runtime (drop `output: export`),
 * delete this file and switch the imports back to `next/link` to get
 * prefetching working properly.
 */
export function Link(props: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={false} {...props} />;
}

export default Link;
