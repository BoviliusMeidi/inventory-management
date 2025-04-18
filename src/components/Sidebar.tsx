"use client";

import Image from "next/image";
import {
  Dashboard,
  Inventory,
  Reports,
  Suppliers,
  Orders,
  ManageStore,
  Settings,
  LogOut,
} from "./SVG/Sidebar";
import NavItem from "./NavItem";
import { logout } from "../app/auth/api/action";

export default function Sidebar() {
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
          <NavItem href="/dashboard" icon={<Dashboard />} label="Dashboard" />
          <NavItem href="/inventory" icon={<Inventory />} label="Inventory" />
          <NavItem href="/reports" icon={<Reports />} label="Reports" />
          <NavItem href="/suppliers" icon={<Suppliers />} label="Suppliers" />
          <NavItem href="/orders" icon={<Orders />} label="Orders" />
          <NavItem
            href="/managestore"
            icon={<ManageStore />}
            label="Manage Store"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <NavItem href="/settings" icon={<Settings />} label="Settings" />
        <form action={logout}>
          <button className="cursor-pointer flex items-center gap-4 p-2 text-lg text-gray-700 hover:text-blue-500">
            <LogOut />
            Log Out
          </button>
        </form>
      </div>
    </aside>
  );
}
