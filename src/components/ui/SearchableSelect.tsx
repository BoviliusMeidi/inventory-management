"use client";

import { useState, useRef, useEffect } from "react";

type Option = {
  id: string;
  supplier_name: string; // Bisa diganti jadi 'name' agar lebih generik
};

interface SearchableSelectProps {
  label: string;
  name: string; // Nama untuk hidden input (untuk form)
  options: Option[];
  onSelect: (value: string | null) => void;
  required?: boolean;
}

export default function SearchableSelect({
  label,
  name,
  options,
  onSelect,
  required = false,
}: SearchableSelectProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter opsi berdasarkan apa yang diketik pengguna
  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.supplier_name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  // Menutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // Jika ditutup tanpa memilih, reset ke nilai yang valid
        const validOption = options.find((o) => o.id === selectedValue);
        setQuery(validOption ? validOption.supplier_name : "");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, options, selectedValue]);

  const handleSelectOption = (option: Option) => {
    setQuery(option.supplier_name); // Tampilkan nama di input
    setSelectedValue(option.id); // Simpan ID
    onSelect(option.id); // Kirim ID ke induk
    setIsOpen(false); // Tutup menu
  };

  return (
    <div className="text-sm sm:text-base flex items-center justify-between gap-2" ref={wrapperRef}>
      <label htmlFor={name} className=" text-gray-800 w-1/3 font-semibold">
        {label}
      </label>
      <div className="relative w-2/3">
        <input
          type="text"
          id={name}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (e.target.value === "") {
              setSelectedValue(null);
              onSelect(null);
            }
          }}
          onClick={() => setIsOpen(true)}
          placeholder="Search supplier..."
          className="border rounded-md p-2 w-full"
          autoComplete="off"
        />

        <input
          type="hidden"
          name={name}
          value={selectedValue || ""}
          required={required}
        />

        {isOpen && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectOption(option)}
                >
                  {option.supplier_name}
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
