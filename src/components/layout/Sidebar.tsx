"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_ITEMS, MENU_BOTTOM_ITEMS } from "./menuItems";

export default function Sidebar() {
  const pathname = usePathname();

  // Hrefs com `#hash` (ex: /plans#pacotes) — comparamos só o path antes do hash
  // porque usePathname() não inclui hash. Sem isso o item nunca ficava ativo.
  const hrefPath = (href: string) => href.split("#")[0];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-dark-800/50 backdrop-blur-xl border-r border-white/[0.06] sticky top-16 self-start h-[calc(100vh-4rem)]">
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const path = hrefPath(item.href);
          const isActive = path === "/dashboard"
            ? pathname === path
            : pathname === path || pathname.startsWith(path + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-primary-500/10 text-primary-400 border border-primary-500/10"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent"
                }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  isActive ? "text-primary-400" : "text-gray-500"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/[0.06] space-y-1">
        {MENU_BOTTOM_ITEMS.map((item) => {
          const path = hrefPath(item.href);
          const isActive = path === "/dashboard"
            ? pathname === path
            : pathname === path || pathname.startsWith(path + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-primary-500/10 text-primary-400 border border-primary-500/10"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent"
                }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  isActive ? "text-primary-400" : "text-gray-500"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
