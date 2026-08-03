/**
 * Route transition. `template.tsx` remounts on every navigation (unlike
 * layout), so the `.page-enter` CSS animation replays for each page while the
 * header and footer stay put. Zero JS, and inert under reduced motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
