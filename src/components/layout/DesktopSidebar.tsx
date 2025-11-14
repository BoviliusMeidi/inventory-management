"use client";

import Image from "next/image";
import NavItem from "@/components/ui/NavItem";
import { logout } from "@/lib/actions/auth";
import { LogOutIcon } from "@/components/icons";
import { MAIN_NAV_LINKS, FOOTER_NAV_LINKS } from "@/lib/constants";

export default function DesktopSidebar() {
  return (
    <aside className="py-6 px-6 h-screen bg-white shadow-md fixed flex flex-col justify-between">
      <div>
        <Image
          src="/logo-BM.svg"
          width={150}
          height={150}
          alt="Logo-BM"
          className="pb-4"
        />
        <div className="flex flex-col gap-4">
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
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-4">
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
          <button className="cursor-pointer flex items-center gap-4 p-2 text-lg text-gray-700 hover:text-blue-500">
            <LogOutIcon className="w-6 h-6" />
            Log Out
          </button>
        </form>
      </div>
    </aside>
  );
}
