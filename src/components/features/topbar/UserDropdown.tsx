"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProfileIcon } from "@/components/icons";
import { User } from "@/lib/types";
import { logout } from "@/lib/actions/auth";

export default function UserDropdown({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all flex items-center justify-center bg-gray-100"
      >
        {user.profile_picture ? (
          <Image
            src={user.profile_picture}
            alt={user.name}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="font-bold text-gray-500 text-sm">
            {user.name?.charAt(0).toUpperCase() || <ProfileIcon />}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-white flex-shrink-0 relative">
                {user.profile_picture ? (
                  <Image
                    src={user.profile_picture}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-bold text-xl">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {user.name}
                </p>
                <p
                  className="text-xs text-gray-500 truncate"
                  title={user.email}
                >
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2 flex flex-col gap-1">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Account Settings
            </Link>
            <button
              onClick={() => logout()}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
