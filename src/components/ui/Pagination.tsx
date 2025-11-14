"use client";

export const PAGE_SIZE = 10;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="text-xs sm:text-base flex flex-row justify-between pt-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="cursor-pointer px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="px-4 py-2">
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="cursor-pointer px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
