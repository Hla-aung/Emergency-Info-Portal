"use client";

import type React from "react";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Home,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  X,
  BarChart3,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  LoginLink,
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { useLocale } from "next-intl";

type MenuItem = {
  icon: React.ReactNode;
  label: string;
  href: string;
};

const FloatingNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useKindeBrowserClient();
  const locale = useLocale();

  const menuItems: MenuItem[] = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Home",
      href: "/",
    },

    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Dashboard",
      href: "/dashboard",
    },

    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      href: "/settings",
    },
  ];

  return (
    <div className="fixed bottom-10 left-5 z-[1500]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-12 left-0 flex flex-col gap-y-2"
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Link href={item.href} onClick={() => setIsOpen(false)}>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="group relative rounded-full shadow-lg"
                  >
                    {item.icon}
                  </Button>
                </Link>
              </motion.div>
            ))}
            <motion.div
              key={"logout"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: menuItems.length * 0.05 }}
            >
              {isAuthenticated ? (
                <LogoutLink postLogoutRedirectURL={`/${locale}`}>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="group relative rounded-full shadow-lg"
                  >
                    <LogOut className="size-5" />
                  </Button>
                </LogoutLink>
              ) : (
                <LoginLink postLoginRedirectURL={`/${locale}`}>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="group relative rounded-full shadow-lg"
                  >
                    <LogIn className="size-5" />
                  </Button>
                </LoginLink>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "rounded-full shadow-lg transition-all",
          isOpen
            ? "bg-destructive hover:bg-destructive/90"
            : "bg-primary hover:bg-primary/90"
        )}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>
    </div>
  );
};

export default FloatingNav;
