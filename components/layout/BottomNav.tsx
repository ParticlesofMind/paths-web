"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/auth/actions";

const NAV = [
  { href: "/calendar", label: "Calendar", icon: "▦" },
  { href: "/patterns", label: "Patterns", icon: "◈" },
  { href: "/progress", label: "Progress", icon: "▲" },
  { href: "/groups", label: "Groups", icon: "◎" },
  { href: "/profile", label: "Profile", icon: "◉" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[#1e1e1e] bg-[#0d0d0d] flex">
      {NAV.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
              active ? "text-[#4f7eff]" : "text-neutral-500"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
