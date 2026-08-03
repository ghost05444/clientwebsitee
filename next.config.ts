import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  /*
   * Pure static export. Every route is prerendered (see generateStaticParams on
   * the product and category routes), so there is no server component at
   * runtime — the `out/` directory can be dropped on any static host and
   * Netlify can parse the enquiry form out of the HTML at deploy time.
   */
  output: "export",

  /* Product imagery is pre-converted to WebP at two widths by
     `npm run images`, and served through a plain <img> with srcset, so the
     Next image optimizer has nothing to do. */
  images: { unoptimized: true },

  /* Emit /contact/index.html rather than /contact.html, so static hosts serve
     clean URLs without per-path redirect rules. */
  trailingSlash: true,
};

export default nextConfig;
