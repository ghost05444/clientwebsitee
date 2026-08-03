"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "./Link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { SearchDialog } from "./SearchDialog";
import { getMainCategories, type Category } from "@/lib/catalog";
// Nav-only projection of the solutions — importing `@/lib/solutions` here
// would pull every intro, hazard list and FAQ into the client bundle.
import { SOLUTION_NAV } from "@/data/solution-nav";
import {
  site,
  telHref,
  whatsappHref,
  GENERAL_ENQUIRY_MESSAGE,
} from "@/lib/site";

const mainCategories = getMainCategories();

/**
 * `menu` names the dropdown a row owns, if any.
 *
 * `xlOnly` keeps About out of the bar at `lg`, where seven rows plus the
 * search field and two buttons overflow. It is still reachable at `lg` from
 * the drawer and the footer, and returns to the bar at `xl`.
 */
const NAV: {
  label: string;
  href: string;
  menu?: "products" | "solutions";
  xlOnly?: boolean;
}[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products", menu: "products" },
  { label: "Solutions", href: "/solutions", menu: "solutions" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about", xlOnly: true },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  /** Which dropdown is open, if any — only ever one at a time. */
  const [openMenu, setOpenMenu] = useState<"products" | "solutions" | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Elevation + reading-progress bar. One rAF-throttled scroll listener:
  // the boolean only re-renders when it flips, the progress bar is driven
  // directly through style so scrolling never touches React.
  const [scrolled, setScrolled] = useState(false);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 6);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current?.style.setProperty(
        "transform",
        `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`,
      );
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Any navigation closes every overlay. Adjusting during render (rather than
  // in an effect) avoids a frame where the new page shows with the old menu
  // still open.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setDrawerOpen(false);
    setOpenMenu(null);
  }

  // Lock body scroll behind the mobile drawer.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setOpenMenu(null);
      }
      // Cmd/Ctrl-K opens search, the convention users expect.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMenuNow = (menu: "products" | "solutions") => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  };
  // Small grace period so the pointer can cross the gap into the panel.
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Utility bar — desktop only, keeps contact details one click away. */}
      <div className="hidden bg-ink-900 text-ink-300 lg:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <p>{site.tagline} · Anjar, Kachchh</p>
          <div className="flex items-center gap-5">
            <a
              href={`mailto:${site.email}`}
              className="transition-colors hover:text-white"
            >
              {site.email}
            </a>
            <span aria-hidden="true" className="text-ink-700">
              |
            </span>
            <a href={telHref} className="transition-colors hover:text-white">
              {site.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 border-b border-ink-200 bg-white/95 backdrop-blur-sm transition-shadow duration-300 supports-[backdrop-filter]:bg-white/85 ${
          scrolled ? "shadow-lg shadow-ink-950/[0.06]" : ""
        }`}
      >
        {/* Reading progress — scaleX driven directly from the scroll listener. */}
        <div
          ref={progressRef}
          className="absolute inset-x-0 -bottom-px z-10 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-600 via-brand-500 to-hivis-400"
          aria-hidden="true"
        />

        <div className="container-page">
          <div className="flex h-16 items-center justify-between gap-3 lg:h-20">
            <Link
              href="/"
              className="flex min-h-11 shrink-0 items-center"
              aria-label={`${site.name} — home`}
            >
              <Logo />
            </Link>

            {/* ---------------- Desktop nav ---------------- */}
            <nav
              className="hidden items-center gap-1 lg:flex"
              aria-label="Main navigation"
            >
              {NAV.map((item) =>
                item.menu ? (
                  <div
                    key={item.href}
                    onMouseEnter={() => openMenuNow(item.menu!)}
                    onMouseLeave={scheduleClose}
                  >
                    <Link
                      href={item.href}
                      aria-expanded={openMenu === item.menu}
                      aria-haspopup="true"
                      // Opening on focus is what makes the panel reachable by
                      // keyboard — there is no hover event to rely on.
                      onFocus={() => openMenuNow(item.menu!)}
                      className={`flex h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors xl:px-3.5 ${
                        isActive(item.href)
                          ? "text-brand-600"
                          : "text-ink-700 hover:bg-ink-100 hover:text-ink-900"
                      }`}
                    >
                      {item.label}
                      <svg
                        viewBox="0 0 20 20"
                        className={`h-4 w-4 transition-transform duration-200 ${
                          openMenu === item.menu ? "rotate-180" : ""
                        }`}
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    // Focusing a plain row must dismiss an open panel, or
                    // tabbing past Products leaves the mega menu covering the
                    // row that now has focus.
                    onFocus={scheduleClose}
                    className={`h-11 items-center rounded-lg px-3 text-sm font-semibold transition-colors xl:px-3.5 ${
                      item.xlOnly ? "hidden xl:flex" : "flex"
                    } ${
                      isActive(item.href)
                        ? "text-brand-600"
                        : "text-ink-700 hover:bg-ink-100 hover:text-ink-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>

            {/* ---------------- Actions ---------------- */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="tap flex items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 lg:w-auto lg:gap-2 lg:border lg:border-ink-200 lg:px-3 lg:text-sm"
                aria-label="Search products"
              >
                <svg
                  viewBox="0 0 20 20"
                  className="h-5 w-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.45 4.39l3.58 3.58a1 1 0 01-1.42 1.42l-3.58-3.58A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden lg:inline">Search</span>
                <kbd className="ml-1 hidden rounded border border-ink-200 bg-ink-50 px-1.5 py-0.5 font-sans text-[10px] font-medium text-ink-500 xl:inline">
                  ⌘K
                </kbd>
              </button>

              <a
                href={telHref}
                className="tap flex items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 lg:hidden"
                aria-label={`Call ${site.phoneDisplay}`}
              >
                <svg
                  viewBox="0 0 20 20"
                  className="h-5 w-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-7.18 0-13-5.82-13-13V3.5z" />
                </svg>
              </a>

              <a
                href={whatsappHref(GENERAL_ENQUIRY_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                /* At exactly `lg` the full nav appears while the viewport is
                   still only 1024px wide, and label + nav + search together
                   overflow the container. Drop back to an icon-only button
                   through that band and restore the label at `xl`. */
                className="btn-whatsapp hidden shrink-0 px-3 sm:inline-flex lg:px-3 xl:px-4"
              >
                <WhatsAppIcon />
                <span className="hidden md:inline lg:hidden xl:inline">WhatsApp</span>
                <span className="md:hidden">Chat</span>
              </a>

              <Link href="/contact" className="btn-primary hidden xl:inline-flex">
                Get a Quote
              </Link>

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="tap flex items-center justify-center rounded-lg text-ink-700 transition-colors hover:bg-ink-100 lg:hidden"
                aria-label="Open menu"
                aria-expanded={drawerOpen}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- Desktop products mega menu ---------------- */}
        {openMenu === "products" && (
          <div
            onMouseEnter={() => openMenuNow("products")}
            onMouseLeave={scheduleClose}
            className="absolute inset-x-0 top-full hidden border-b border-ink-200 bg-white shadow-xl lg:block"
          >
            <div className="container-page py-7">
              <div className="grid grid-cols-4 gap-x-8 gap-y-6 xl:grid-cols-5">
                {mainCategories.map((cat) => (
                  <MegaColumn key={cat.slug} category={cat} />
                ))}

                <div className="rounded-xl bg-ink-900 p-5 text-white">
                  <p className="font-display text-base font-bold">
                    Can&apos;t find what you need?
                  </p>
                  <p className="mt-1.5 text-sm text-ink-300">
                    Tell us your requirement and we&apos;ll source it.
                  </p>
                  <Link
                    href="/contact"
                    className="btn mt-4 w-full bg-brand-600 text-white hover:bg-brand-700"
                  >
                    Request a quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- Desktop solutions menu ---------------- */}
        {openMenu === "solutions" && (
          <div
            onMouseEnter={() => openMenuNow("solutions")}
            onMouseLeave={scheduleClose}
            className="absolute inset-x-0 top-full hidden border-b border-ink-200 bg-white shadow-xl lg:block"
          >
            <div className="container-page py-7">
              <div className="grid gap-x-8 gap-y-1 lg:grid-cols-4">
                <div className="lg:col-span-3">
                  <p className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-ink-400">
                    By hazard
                  </p>

                  <ul className="mt-3 grid gap-x-6 gap-y-0.5 sm:grid-cols-2">
                    {SOLUTION_NAV.map((solution) => (
                      <li key={solution.slug}>
                        <Link
                          href={`/solutions/${solution.slug}`}
                          className="group block rounded-lg px-3 py-2.5 transition-colors hover:bg-ink-50"
                        >
                          <span className="block font-display text-sm font-bold text-ink-900 transition-colors group-hover:text-brand-600">
                            {solution.name}
                          </span>
                          <span className="mt-0.5 block text-[13px] leading-snug text-ink-500">
                            {solution.navBlurb}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-ink-900 p-5 text-white">
                  <p className="font-display text-base font-bold">
                    Not sure which applies?
                  </p>
                  <p className="mt-1.5 text-sm text-ink-300">
                    Describe the site and we&apos;ll work through it with you.
                  </p>
                  <Link
                    href="/solutions"
                    className="btn mt-4 w-full bg-brand-600 text-white hover:bg-brand-700"
                  >
                    All solutions
                  </Link>
                  <Link
                    href="/services"
                    className="btn mt-2 w-full border border-ink-700 text-white hover:bg-ink-800"
                  >
                    Our services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ---------------- Mobile drawer ---------------- */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

/* ------------------------------------------------------------------ */

function MegaColumn({ category }: { category: Category }) {
  return (
    <div>
      <Link
        href={`/products/${category.slug}`}
        className="group flex items-baseline gap-1.5"
      >
        <span className="font-display text-sm font-bold text-ink-900 transition-colors group-hover:text-brand-600">
          {category.name}
        </span>
        <span className="text-[11px] font-medium text-ink-400">
          {category.count}
        </span>
      </Link>

      <ul className="mt-2 space-y-1">
        {category.children.slice(0, 5).map((child) => (
          <li key={child.slug}>
            <Link
              href={`/products/${category.slug}/${child.slug}`}
              className="block py-0.5 text-[13px] leading-snug text-ink-600 transition-colors hover:text-brand-600"
            >
              {child.name}
            </Link>
          </li>
        ))}
        {category.children.length > 5 && (
          <li>
            <Link
              href={`/products/${category.slug}`}
              className="block py-0.5 text-[13px] font-medium text-brand-600 hover:underline"
            >
              +{category.children.length - 5} more
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  return (
    /* Viewport-sized clipping frame. The panel below is parked off-screen with
       translate-x-full when closed; without this wrapper that translated box
       widens the document and creates a phantom horizontal scroll. Clipping
       here (rather than overflow-x on html/body) keeps `position: sticky`
       working elsewhere on the page. */
    <div
      className={`fixed inset-0 z-50 overflow-hidden lg:hidden ${
        open ? "" : "pointer-events-none"
      }`}
    >
      <div
        className={`absolute inset-0 bg-ink-950/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        // Keeps the parked drawer out of the tab order and the accessibility
        // tree — without this, screen readers announce a second copy of the
        // whole nav that sighted users cannot see.
        inert={!open}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-ink-200 px-4">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="tap -mr-2 flex items-center justify-center rounded-lg text-ink-600 hover:bg-ink-100"
            aria-label="Close menu"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain px-2 py-3">
          <Link
            href="/"
            className="flex min-h-12 items-center rounded-lg px-3 font-semibold text-ink-900 hover:bg-ink-100"
          >
            Home
          </Link>

          {/* Solutions accordion — mirrors the category groups below. */}
          <div className="mt-2 border-b border-ink-100">
            <div className="flex items-stretch">
              <Link
                href="/solutions"
                className="flex min-h-12 flex-1 items-center rounded-lg px-3 font-semibold text-ink-900 hover:bg-ink-100"
              >
                Solutions
              </Link>

              <button
                type="button"
                onClick={() => setSolutionsOpen((open) => !open)}
                className="tap flex shrink-0 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100"
                aria-label={`${solutionsOpen ? "Collapse" : "Expand"} Solutions`}
                aria-expanded={solutionsOpen}
              >
                <svg
                  viewBox="0 0 20 20"
                  className={`h-5 w-5 transition-transform duration-200 ${
                    solutionsOpen ? "rotate-180" : ""
                  }`}
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {solutionsOpen && (
              <ul className="pb-2 pl-3">
                {SOLUTION_NAV.map((solution) => (
                  <li key={solution.slug}>
                    <Link
                      href={`/solutions/${solution.slug}`}
                      className="flex min-h-11 items-center rounded-lg px-3 text-sm leading-snug text-ink-600 hover:bg-ink-100"
                    >
                      {solution.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            href="/services"
            className="flex min-h-12 items-center rounded-lg px-3 font-semibold text-ink-900 hover:bg-ink-100"
          >
            Services
          </Link>

          <Link
            href="/blog"
            className="flex min-h-12 items-center rounded-lg px-3 font-semibold text-ink-900 hover:bg-ink-100"
          >
            Safety Notes
          </Link>

          <p className="px-3 pb-1 pt-4 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-ink-400">
            Product Categories
          </p>

          <ul>
            {mainCategories.map((cat) => {
              const isOpen = expanded === cat.slug;
              const hasChildren = cat.children.length > 0;

              return (
                <li key={cat.slug} className="border-b border-ink-100 last:border-0">
                  <div className="flex items-stretch">
                    <Link
                      href={`/products/${cat.slug}`}
                      className="flex min-h-12 flex-1 items-center gap-2 rounded-lg px-3 text-[15px] font-medium text-ink-800 hover:bg-ink-100"
                    >
                      {cat.name}
                      <span className="text-xs font-normal text-ink-400">
                        {cat.count}
                      </span>
                    </Link>

                    {hasChildren && (
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : cat.slug)}
                        className="tap flex shrink-0 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100"
                        aria-label={`${isOpen ? "Collapse" : "Expand"} ${cat.name}`}
                        aria-expanded={isOpen}
                      >
                        <svg
                          viewBox="0 0 20 20"
                          className={`h-5 w-5 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  {hasChildren && isOpen && (
                    <ul className="pb-2 pl-3">
                      {cat.children.map((child) => (
                        <li key={child.slug}>
                          <Link
                            href={`/products/${cat.slug}/${child.slug}`}
                            className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-ink-600 hover:bg-ink-100"
                          >
                            {child.name}
                            <span className="text-xs text-ink-400">
                              {child.count}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-4 space-y-1 border-t border-ink-200 pt-3">
            <Link
              href="/products"
              className="flex min-h-12 items-center rounded-lg px-3 font-semibold text-ink-900 hover:bg-ink-100"
            >
              All Products
            </Link>
            <Link
              href="/standards"
              className="flex min-h-12 items-center rounded-lg px-3 font-semibold text-ink-900 hover:bg-ink-100"
            >
              Standards &amp; Compliance
            </Link>
            <Link
              href="/about"
              className="flex min-h-12 items-center rounded-lg px-3 font-semibold text-ink-900 hover:bg-ink-100"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="flex min-h-12 items-center rounded-lg px-3 font-semibold text-ink-900 hover:bg-ink-100"
            >
              Contact
            </Link>
          </div>
        </nav>

        {/* Sticky contact actions — reachable one-handed at the bottom. */}
        <div className="shrink-0 space-y-2 border-t border-ink-200 bg-ink-50 p-3">
          <a
            href={whatsappHref(GENERAL_ENQUIRY_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full"
          >
            <WhatsAppIcon />
            WhatsApp us
          </a>
          <a href={telHref} className="btn-secondary w-full">
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-7.18 0-13-5.82-13-13V3.5z" />
            </svg>
            {site.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}

export function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.896 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
    </svg>
  );
}
