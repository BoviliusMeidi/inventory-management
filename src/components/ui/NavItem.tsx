"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
}

const activeButton = "text-blue-700 font-semi-bold";
const nonActiveButton = "text-gray-700 hover:text-blue-500";

const NavItem: React.FC<NavItemProps> = ({ href, icon, label }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`cursor-pointer flex items-center gap-4 p-2 text-lg ${
        isActive ? activeButton : nonActiveButton
      }`}
    >
      {icon}
      {label}
    </Link>
  );
};

export default NavItem;
