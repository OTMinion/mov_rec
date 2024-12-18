import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  baseUrl?: string; // Added baseUrl prop
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  baseUrl = "", // Default to empty string
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i < totalPages && i > 1) {
        range.push(i);
      }
    }

    range.push(totalPages);

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <nav className="flex items-center justify-between mt-8">
      <div className="flex flex-1 justify-between sm:hidden">
        {prevPage >= 1 && (
          <Link
            href={`${baseUrl}${baseUrl.includes("?") ? "&" : "?"}page=${prevPage}`}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Previous
          </Link>
        )}
        {nextPage <= totalPages && (
          <Link
            href={`${baseUrl}${baseUrl.includes("?") ? "&" : "?"}page=${nextPage}`}
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Next
          </Link>
        )}
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {prevPage >= 1 && (
              <Link
                href={`${baseUrl}${baseUrl.includes("?") ? "&" : "?"}page=${prevPage}`}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
            )}
            {getPageNumbers().map((pageNumber, index) =>
              pageNumber === "..." ? (
                <span
                  key={`dots-${index}`}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                >
                  ...
                </span>
              ) : (
                <Link
                  key={pageNumber}
                  href={`${baseUrl}${baseUrl.includes("?") ? "&" : "?"}page=${pageNumber}`}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    pageNumber === currentPage
                      ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                  }`}
                >
                  {pageNumber}
                </Link>
              )
            )}
            {nextPage <= totalPages && (
              <Link
                href={`${baseUrl}${baseUrl.includes("?") ? "&" : "?"}page=${nextPage}`}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <ChevronRight className="h-5 w-5" />
              </Link>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Pagination;
