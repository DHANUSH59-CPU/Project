import React from 'react';
import ProblemItem from './ProblemItem'; // you can keep .jsx or omit extension

const ProblemList = ({ problems, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 dark:border-orange-400 mx-auto"></div>
        <p className="mt-4 text-slate-600 dark:text-gray-400">Loading problems...</p>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-[#ffffff] dark:bg-[#232b3b] rounded-lg shadow-lg dark:shadow-xl border border-[#e2e8f0] dark:border-[#334155]">
        <svg
          className="mx-auto h-12 w-12 text-slate-400 dark:text-gray-500"
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
        <h3 className="mt-2 text-xl font-semibold text-slate-800 dark:text-[#e2e8f0]">
          No Problems Found
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-[#94a3b8]">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] dark:bg-[#232b3b] shadow-lg dark:shadow-xl rounded-lg overflow-x-auto border border-[#e2e8f0] dark:border-[#334155]">
      <table className="min-w-full divide-y divide-[#e2e8f0] dark:divide-[#334155]">
        <thead className="bg-[#f8fafc] dark:bg-[#1a2332]/50">
          <tr>
            <th
              scope="col"
              className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-[#94a3b8] uppercase tracking-wider w-1/12"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-[#94a3b8] uppercase tracking-wider w-[5%]"
            >
              No.
            </th>
            <th
              scope="col"
              className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-[#94a3b8] uppercase tracking-wider w-2/5"
            >
              Title
            </th>
            <th
              scope="col"
              className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-[#94a3b8] uppercase tracking-wider"
            >
              Difficulty
            </th>
            <th
              scope="col"
              className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-[#94a3b8] uppercase tracking-wider w-2/5"
            >
              Topics
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#334155] bg-[#ffffff] dark:bg-[#232b3b]">
          {problems.map((problem) => (
            <ProblemItem key={problem._id} problem={problem} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemList;

