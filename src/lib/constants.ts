import {
  DashboardIcon,
  InventoryIcon,
  ReportsIcon,
  SuppliersIcon,
  OrdersIcon,
  SettingsIcon,
} from "@/components/icons";
import React from "react";

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export interface NavLink {
  href: string;
  label: string;
  icon: IconComponent;
}

export const MAIN_NAV_LINKS: NavLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
  },
  {
    href: "/sales",
    label: "Sales",
    icon: OrdersIcon,
  },
  {
    href: "/inventory",
    label: "Inventory",
    icon: InventoryIcon,
  },
  {
    href: "/orders",
    label: "Orders",
    icon: OrdersIcon,
  },
  {
    href: "/customers",
    label: "Customers",
    icon: SuppliersIcon,
  },
  {
    href: "/suppliers",
    label: "Suppliers",
    icon: SuppliersIcon,
  },
  {
    href: "/reports",
    label: "Reports",
    icon: ReportsIcon,
  },
];

export const FOOTER_NAV_LINKS: NavLink[] = [
  {
    href: "/settings",
    label: "Settings",
    icon: SettingsIcon,
  },
];
