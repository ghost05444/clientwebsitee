/** Escape sequences, built rather than written, so no literal appears here. */
const LINE_SEP = String.fromCharCode(0x2028);
const PARA_SEP = String.fromCharCode(0x2029);

/**
 * Serialises structured data for injection into a
 * `<script type="application/ld+json">` element.
 *
 * `JSON.stringify` alone is NOT safe here. It does not escape `<`, so a string
 * anywhere in the graph containing `</script>` closes the element early and
 * everything after it is parsed as HTML:
 *
 *   JSON.stringify("</script><img onerror=...>")
 *     -> "</script><img onerror=...>"     // breaks straight out of the tag
 *
 * That matters because this site's structured data is built from product
 * names, summaries and spec values scraped from a third-party catalogue —
 * content we neither control nor can assume is clean.
 *
 * Rewriting these characters as unicode escapes leaves the JSON semantically
 * identical (a parser resolves `<` back to `<`) while making it
 * impossible to terminate the element or open an HTML comment.
 *
 * U+2028 and U+2029 are the last pair: legal inside a JSON string, but
 * JavaScript line terminators, so an inline parse of the same text throws.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .split(LINE_SEP)
    .join("\\u2028")
    .split(PARA_SEP)
    .join("\\u2029");
}
