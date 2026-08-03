"use client";

import { useSyncExternalStore } from "react";

/**
 * Reads a query-string parameter without pulling in `useSearchParams`.
 *
 * `useSearchParams` forces its whole subtree behind a Suspense boundary during
 * static export, which means the *fallback* — not the real markup — is what
 * ends up in the prerendered HTML. That breaks Netlify's build-time form
 * detection, and hurts SEO for anything inside the boundary.
 *
 * `useSyncExternalStore` reads the same value with a server snapshot of `null`,
 * so the form prerenders as real HTML and the prefill applies on hydration.
 */
function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

export function useQueryParam(key: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(key),
    () => null,
  );
}
