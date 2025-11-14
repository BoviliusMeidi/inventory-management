"use client";

import {
  SearchIcon,
  NotificationIcon,
  ProfileIcon,
  HamburgerIcon,
} from "@/components/icons";

const notifCount = 7;

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <div className="flex flex-row justify-between items-center gap-2 pl-4 pr-4 py-4 md:pl-6 md:pr-6 md:py-8 bg-white shadow-md">
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 -ml-2"
        aria-label="Open menu"
      >
        <HamburgerIcon className="w-6 h-6" />
      </button>
      <div className="relative flex-1 md:w-1/2">
        <input
          type="text"
          placeholder="Search product, supplier, order"
          className="w-full p-2 pl-10 border border-gray-400 outline-none rounded-md focus:ring-1 focus:ring-gray-600 focus:outline-none"
        />
        <div className="absolute left-3 top-0 h-full flex items-center">
          <SearchIcon className="w-5 h-5 text-gray-400" />
        </div>
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
