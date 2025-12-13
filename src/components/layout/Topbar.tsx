"use client";

import { useEffect, useState } from "react";
import { HamburgerIcon } from "@/components/icons";
import GlobalSearch from "@/components/ui/GlobalSearch";
import UserDropdown from "@/components/features/topbar/UserDropdown";
import NotificationDropdown from "@/components/features/topbar/NotificationDropdown";
import { User } from "@/lib/types";
import { getProfile } from "@/lib/actions/profile";
import { getLowStockNotifications } from "@/lib/actions/notifications";
import { StockAlert } from "@/lib/types";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [user, setUser] = useState<User | null>(null);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userData, notificationData] = await Promise.all([
          getProfile(),
          getLowStockNotifications(),
        ]);

        setUser(userData);
        setAlerts(notificationData);
      } catch (error) {
        console.error("Failed to fetch topbar data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-row justify-between items-center gap-2 px-4 py-4 md:pr-6 bg-white shadow-md relative z-20">
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 -ml-2"
        aria-label="Open menu"
      >
        <HamburgerIcon className="w-6 h-6" />
      </button>

      <div className="relative flex-1 md:w-1/2 max-w-2xl">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {loading ? (
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        ) : (
          <NotificationDropdown alerts={alerts} />
        )}

        {loading ? (
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse border border-gray-300" />
        ) : user ? (
          <UserDropdown user={user} />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200" />
        )}
      </div>
    </div>
  );
}
