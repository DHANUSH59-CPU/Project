import React from 'react';
import ProblemsPageCard from './ProblemsPageCard';

const ProblemGrid = ({ problems, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f97316] dark:border-[#fb923c] mx-auto"></div>
        <p className="mt-4 text-[#475569] dark:text-[#9ca3af]">Loading problems...</p>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-[#ffffff] dark:bg-[#232b3b] rounded-lg shadow-lg dark:shadow-xl border border-[#e2e8f0] dark:border-[#334155]">
        <svg
          className="mx-auto h-12 w-12 text-[#94a3b8] dark:text-[#6b7280]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="mt-2 text-xl font-semibold text-[#0f172a] dark:text-[#e2e8f0]">
          No Problems Found
        </h3>
        <p className="mt-1 text-sm text-[#64748b] dark:text-[#94a3b8]">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {problems.map((problem) => (
        <ProblemsPageCard
          key={problem._id}
          problem={problem}
        />
      ))}
    </div>
  );
};

export default ProblemGrid;
