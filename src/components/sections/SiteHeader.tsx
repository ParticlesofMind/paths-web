import { site } from "../../content/site";

// Every section of the home page, in page order, so the whole page is one click away.
const links = [
  { href: "/#how", label: "How it works" },
  { href: "/#archetypes", label: "Archetypes" },
  { href: "/#methods", label: "Methods" },
  { href: "/#progress", label: "Progress" },
  { href: "/#plans", label: "Plans" },
];

export default function SiteHeader() {
  return (
    // Phones: the name and "Get the app" on the first row, the section links on a second
    // row that scrolls sideways if it must. From md up, all on one row.
    <header className="sticky top-0 z-50 border-b border-mist bg-paper">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 px-4 pt-3 md:flex-nowrap md:py-3">
        <a href="/" className="text-2xl font-bold">{site.name}</a>
        <a href="/#download" className="ml-auto rounded-2xl bg-ink px-4 py-2 text-paper md:order-last md:ml-0">Get the app</a>
        <nav
          aria-label="Main"
          className="-mx-4 flex w-full min-w-0 overflow-x-auto px-2 whitespace-nowrap md:mx-0 md:ml-auto md:w-auto md:px-0"
        >
          {links.map((link) => (
            <a key={link.href} href={link.href} className="px-2 py-2.5 text-sm md:px-3 md:text-base">{link.label}</a>
          ))}
        </nav>
      </div>
    </header>
  );
}
