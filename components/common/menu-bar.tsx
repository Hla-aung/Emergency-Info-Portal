"use client";

import { Home, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePathname, Link } from "@/i18n/navigation";

export default function MenuBar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="fixed z-[1500] bottom-10 left-2.5 md:bottom-6 md:left-1/2 md:-translate-x-1/2 w-auto">
      <div className="flex h-auto md:h-16 w-full items-center justify-center bg-background rounded-full md:px-6 shadow-lg">
        <nav className="flex md:flex-row flex-col items-center gap-6 md:space-x-6 py-4 md:py-0">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "inline-flex flex-col items-center justify-center px-3 md:px-4 md:py-2 text-sm transition-colors ",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="mt-1 hidden md:block">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
