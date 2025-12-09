"use client";

import {
  NotificationIcon,
  ProfileIcon,
  HamburgerIcon,
} from "@/components/icons";
import GlobalSearch from "@/components/ui/GlobalSearch";

const notifCount = 7;

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <div className="flex flex-row justify-between items-center gap-2 px-4 py-4 md:pr-6 bg-white shadow-md">
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
        <div className="relative cursor-pointer">
          <NotificationIcon />
          <span className="absolute -top-1 left-3 bg-red-500 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {notifCount > 9 ? "9+" : notifCount}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
          <ProfileIcon />
        </div>
      </div>
    </div>
  );
}
