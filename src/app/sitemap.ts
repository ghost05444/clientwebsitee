import type { MetadataRoute } from "next";
import { products, getMainCategories } from "@/lib/catalog";
import { site } from "@/lib/site";

/**
 * Full sitemap: static pages, all 14 categories, every subcategory and all
 * product detail pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const categories = getMainCategories();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.flatMap((cat) => [
    {
      url: `${site.url}/products/${cat.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...cat.children.map((child) => ({
      url: `${site.url}/products/${cat.slug}/${child.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ]);

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${site.url}/product/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}

export const dynamic = "force-static";
