import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center gap-2 mt-10">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex items-center gap-2 rounded-xl px-3 py-2 hover:cursor-pointer hover:bg-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 text-gray-600 dark:text-gray-300 hover:dark:text-white"
      >
        <ChevronLeft size={18} />
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`px-3 py-2  rounded-md transition-colors hover:cursor-pointer ${
            currentPage === i + 1
              ? "bg-green-500 text-white"
              : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center gap-2 hover:cursor-pointer hover:bg-blue-500 py-2 px-3 rounded-xl hover:text-white disabled:cursor-not-allowed disabled:opacity-50 text-gray-600 dark:text-gray-300 hover:dark:text-white"
      >
        Next
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
