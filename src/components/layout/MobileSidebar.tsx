"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { logout } from "@/lib/actions/auth";
import NavItem from "@/components/ui/NavItem";
import { CloseIcon, LogOutIcon } from "@/components/icons";
import { MAIN_NAV_LINKS, FOOTER_NAV_LINKS } from "@/lib/constants";

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function MobileSidebar({
  isOpen,
  setIsOpen,
}: MobileSidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 bg-white shadow-md
                  transition-transform duration-300
                  ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-full flex flex-col overflow-y-auto p-6">
          <div className="flex flex-col flex-grow">
            <div className="flex items-center justify-between pb-4">
              <Image
                src="/logo-BM.svg"
                width={120}
                height={120}
                alt="Logo-BM"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-2"
                aria-label="Close menu"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-4 mt-4">
              {MAIN_NAV_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <NavItem
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    icon={<Icon className="w-6 h-6" />}
                  />
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col gap-4 pt-6">
            {FOOTER_NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <NavItem
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  icon={<Icon className="w-6 h-6" />}
                />
              );
            })}
            <form action={logout}>
              <button className="cursor-pointer flex items-center gap-4 p-2 text-lg w-full text-gray-700 hover:text-blue-500">
                <LogOutIcon className="w-6 h-6" />
                Log Out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
