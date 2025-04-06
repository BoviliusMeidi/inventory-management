import Image from "next/image";
import { Search, Notification } from "./SVG/Topbar";

export default function Topbar() {
  return (
    <div className="flex flex-row justify-between items-center px-6 py-8 bg-white shadow-md">
      <div className="relative w-1/2">
        <input
          type="text"
          placeholder="Search product, supplier, order"
          className="w-full p-2 pl-10 border border-gray-400 outline-none rounded-md focus:ring-1 focus:ring-gray-600 focus:outline-none0"
        />
        <Search />
      </div>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer">
          <Notification />
          <span className="absolute -top-1 left-3 bg-red-500 text-white text-xs rounded-full px-1">
            9
          </span>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
          <Image
            src="/profile.svg"
            width={40}
            height={40}
            alt="Profile"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
