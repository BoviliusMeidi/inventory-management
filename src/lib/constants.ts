import {
  DashboardIcon,
  InventoryIcon,
  ReportsIcon,
  SuppliersIcon,
  OrdersIcon,
  ManageStoreIcon,
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
    href: "/inventory",
    label: "Inventory",
    icon: InventoryIcon,
  },
  {
    href: "/reports",
    label: "Reports",
    icon: ReportsIcon,
  },
  {
    href: "/suppliers",
    label: "Suppliers",
    icon: SuppliersIcon,
  },
  {
    href: "/orders",
    label: "Orders",
    icon: OrdersIcon,
  },
  {
    href: "/managestore",
    label: "Manage Store",
    icon: ManageStoreIcon,
  },
];

export const FOOTER_NAV_LINKS: NavLink[] = [
  {
    href: "/settings",
    label: "Settings",
    icon: SettingsIcon,
  },
];
