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

export const PAYMENT_METHODS = [
  { label: "Cash", value: "Cash" },
  { label: "Transfer", value: "Transfer" },
  { label: "QRIS", value: "QRIS" },
];

export const PAYMENT_STATUSES = [
  { label: "Paid", value: "Paid" },
  { label: "Debt", value: "Debt" },
];

export const ORDER_STATUSES = [
  { label: "Pending", value: "Pending" },
  { label: "Shipped", value: "Shipped" },
  { label: "Completed", value: "Completed" },
];

export const PRODUCT_CATEGORIES = [
  { label: "Electronics", value: "electronics" },
  { label: "Clothing", value: "clothing" },
  { label: "Home & Furniture", value: "home" },
  { label: "Beauty & Health", value: "beauty" },
  { label: "Sports & Outdoors", value: "sports" },
];