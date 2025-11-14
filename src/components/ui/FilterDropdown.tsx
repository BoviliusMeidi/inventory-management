"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/Button";

export interface DropdownOption {
  label: string;
  value: string | null;
}

interface FilterDropdownProps {
  icon: ReactNode;
  label: string;
  options: DropdownOption[];
  onSelectFilter: (value: string | null) => void;
}

export default function FilterDropdown({
  icon,
  label,
  options,
  onSelectFilter,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (value: string | null) => {
    onSelectFilter(value);
    setIsOpen(false);
  };

  return (
    <div className="relative text-sm sm:text-base" ref={dropdownRef}>
      <Button onClick={() => setIsOpen(!isOpen)} variant="secondary" className="flex items-center gap-4">{icon}{label}</Button>
      {isOpen && (
        <div className="absolute top-8 -left-11 mt-3 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <ul className="flex flex-col p-2">
            {options.map((option) => (
              <li
                key={option.label}
                className="py-1 px-2 text-center hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
