"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { SearchIcon } from "@/components/icons";
import { globalSearch, SearchResult } from "@/lib/actions/search";
import { getTypeLabel } from "@/lib/utils/formatters";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setQuery(searchParam);
    }
  }, [searchParams]);

  const handleSearch = useDebouncedCallback(async (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
      params.set("page", "1");
    } else {
      params.delete("search");
      params.delete("page");
    }
    router.replace(`${pathname}?${params.toString()}`);

    if (!term || term.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    try {
      const data = await globalSearch(term);
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    handleSearch(val);

    if (val.length === 0) {
      setIsOpen(false);
      setResults([]);
      setIsLoading(false);
    } else if (val.length >= 2) {
      setIsLoading(true);
    }
  };

  const handleSelect = (result: SearchResult) => {
    router.push(result.url);
    setIsOpen(false);
    setQuery("");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search product, supplier, invoice..."
          className="w-full text-sm sm:text-base p-2 pl-10 border border-gray-400 outline-none rounded-md focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all"
          value={query}
          onChange={onInputChange}
          onFocus={() => {
            if (query.length >= 2) setIsOpen(true);
          }}
        />
        <div className="absolute left-3 top-0 h-full flex items-center pointer-events-none">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          ) : (
            <SearchIcon className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] max-h-80 overflow-y-auto">
          {isLoading && results.length === 0 && (
            <div className="p-4 text-center text-gray-500 text-sm">
              Searching...
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <ul className="py-2">
              {results.map((result, index) => (
                <li
                  key={`${result.type}-${result.id}-${index}`}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 border-gray-100 transition-colors"
                  onClick={() => handleSelect(result)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 text-sm">
                      {result.title}
                    </span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-0.5">
                      {getTypeLabel(result.type)} •{" "}
                      <span className="normal-case font-normal">
                        {result.subtitle}
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!isLoading && results.length === 0 && (
            <div className="p-4 text-center text-gray-500 text-sm">
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}