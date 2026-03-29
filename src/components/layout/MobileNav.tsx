"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, MessageCircle, User } from "lucide-react";

const navItems = [
  { href: "/", label: "Hjem", icon: Home },
  { href: "/annonser", label: "Søk", icon: Search },
  { href: "/annonser/ny", label: "Legg ut", icon: PlusCircle },
  { href: "/meldinger", label: "Meldinger", icon: MessageCircle },
  { href: "/profil", label: "Profil", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 min-w-0 ${
                isActive ? "text-green-600" : "text-gray-500"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
