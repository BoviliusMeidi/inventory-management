"use client";

import { useState, useRef, useEffect } from "react";

type Option = {
  id: string;
  main_text: string;
  secondary_text?: string;
};

interface SearchableSelectProps {
  label: string;
  name: string;
  options: Option[];
  onSelect: (value: string | null) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export default function SearchableSelect({
  label,
  name,
  options,
  onSelect,
  required = false,
  disabled = false,
  placeholder = "Search...",
}: SearchableSelectProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          (option.main_text + (option.secondary_text || ""))
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        const validOption = options.find((o) => o.id === selectedValue);
        setQuery(validOption ? validOption.main_text : "");
      }
    }
    if (isOpen && !disabled) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, options, selectedValue, disabled]);

  const handleSelectOption = (option: Option) => {
    setQuery(option.main_text);
    setSelectedValue(option.id);
    onSelect(option.id);
    setIsOpen(false);
  };

  return (
    <div
      className="text-sm sm:text-base flex items-center justify-between gap-2"
      ref={wrapperRef}
    >
      <label htmlFor={name} className=" text-gray-800 w-1/3 font-semibold">
        {label}
      </label>
      <div className="relative w-2/3">
        <input
          type="text"
          id={name}
          value={query}
          onChange={(e) => {
            if (disabled) return;
            setQuery(e.target.value);
            setIsOpen(true);
            if (e.target.value === "") {
              setSelectedValue(null);
              onSelect(null);
            }
          }}
          onClick={() => {
            if (disabled) return;
            setIsOpen(true);
          }}
          className={`border rounded-md p-2 w-full ${
            disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""
          }`}
          autoComplete="off"
          placeholder={placeholder}
        />
        <input
          type="hidden"
          name={name}
          value={selectedValue || ""}
          required={required}
        />
        {isOpen && !disabled && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectOption(option)}
                >
                  <div className="font-medium">{option.main_text}</div>
                  {option.secondary_text && (
                    <div className="text-sm text-gray-500">
                      {option.secondary_text}
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No supplier found.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
