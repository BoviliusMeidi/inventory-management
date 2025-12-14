"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { NotificationIcon } from "@/components/icons";
import { StockAlert } from "@/lib/types";

export default function NotificationDropdown({
  alerts,
}: {
  alerts: StockAlert[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifCount = alerts.length;

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
        className="relative cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
      >
        <NotificationIcon />
        {notifCount > 0 && (
          <span className="absolute -top-1 left-3 bg-red-500 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border-2 border-white">
            {notifCount > 9 ? "9+" : notifCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-semibold text-gray-900 text-sm">
              Notifications
            </h3>
            {notifCount > 0 && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                {notifCount} Low Stock
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No notifications yet.
                <br />
                Your stock is healthy!
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {alerts.map((item) => (
                  <li
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <Link
                      href={`/product/${item.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-start gap-3 p-3"
                    >
                      <div className="w-10 h-10 rounded-md bg-gray-100 flex-shrink-0 overflow-hidden relative border border-gray-200">
                        {item.product_image ? (
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            IMG
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-red-500 font-medium mt-0.5">
                          Only {item.amount_stock} left in stock
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {notifCount > 0 && (
            <div className="p-2 border-t border-gray-100 bg-gray-50/50">
              <Link
                href="/inventory"
                onClick={() => setIsOpen(false)}
                className="block text-center text-xs text-blue-600 hover:underline py-1"
              >
                View All Inventory
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
