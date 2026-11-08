import { site } from "../../content/site";

const links = [
  { href: "/support", label: "Support" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function SiteFooter() {
  return (
    <footer className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-ink-60">
      <p>&copy; {new Date().getFullYear()} {site.company}</p>
      <nav aria-label="Footer" className="flex gap-6">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="py-2">{link.label}</a>
        ))}
      </nav>
    </footer>
  );
}
