/**
 * The seven solutions, as the navigation needs them.
 *
 * Split out from `solutions.ts` deliberately. The header is a client
 * component, so anything it imports ships to the browser on every page —
 * and the full solution content (intros, hazards, FAQs) is several times the
 * weight of the site's actual JavaScript. This module carries only what a
 * menu row needs.
 *
 * It is also the single source of truth for slugs and names: `solutions.ts`
 * keys its content off `SolutionSlug`, so a typo there is a type error rather
 * than a silently missing page.
 */

export const SOLUTION_NAV = [
  {
    slug: "confined-space-entry-rescue",
    name: "Confined Space Entry & Rescue",
    navBlurb: "Tanks, vessels, sumps and silos",
  },
  {
    slug: "rescue-from-height",
    name: "Rescue from Height",
    navBlurb: "Suspension trauma and the 15-minute clock",
  },
  {
    slug: "arc-flash-protection",
    name: "Arc Flash Protection",
    navBlurb: "Rated clothing, not just flame retardant",
  },
  {
    slug: "height-access",
    name: "Height Access",
    navBlurb: "Fixed lifelines and anchor systems",
  },
  {
    slug: "cryo-cold-protection",
    name: "Cryo & Cold Protection",
    navBlurb: "Cryogenic contact and cold stores",
  },
  {
    slug: "heat-protection",
    name: "Heat Protection",
    navBlurb: "Radiant load, splash and proximity",
  },
  {
    slug: "inherent-flame-retardant-clothing",
    name: "Inherent Flame Retardant Clothing",
    navBlurb: "Protection woven into the fibre",
  },
] as const;

export type SolutionSlug = (typeof SOLUTION_NAV)[number]["slug"];

export const solutionNameBySlug = new Map<SolutionSlug, string>(
  SOLUTION_NAV.map((s) => [s.slug, s.name]),
);
