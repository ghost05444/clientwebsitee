"use client";

import { WhatsAppIcon } from "./Header";
import {
  site,
  telHref,
  whatsappHref,
  GENERAL_ENQUIRY_MESSAGE,
} from "@/lib/site";

/**
 * Fixed bottom bar on mobile: the two actions a B2B buyer actually wants.
 * Both targets are full-height (56px) and thumb-reachable one-handed.
 *
 * `pb-[env(safe-area-inset-bottom)]` keeps it clear of the iOS home indicator.
 * A matching spacer is rendered so fixed positioning never covers page content.
 */
export function MobileContactBar() {
  return (
    <>
      <div className="h-14 lg:hidden" aria-hidden="true" />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(14,20,28,0.08)] lg:hidden">
        <div className="grid grid-cols-2">
          <a
            href={telHref}
            className="flex h-14 items-center justify-center gap-2 text-sm font-semibold text-ink-800 transition-colors active:bg-ink-100"
            aria-label={`Call ${site.phoneDisplay}`}
          >
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4 text-brand-600"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-7.18 0-13-5.82-13-13V3.5z" />
            </svg>
            Call now
          </a>

          <a
            href={whatsappHref(GENERAL_ENQUIRY_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 items-center justify-center gap-2 bg-[#25D366] text-sm font-semibold text-white transition-colors active:bg-[#17A34A]"
          >
            <WhatsAppIcon />
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
