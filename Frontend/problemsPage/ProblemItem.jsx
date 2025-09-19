import React from "react";
import { Icon } from "..";
import { useNavigate } from "react-router";

const ProblemItem = ({ problem }) => {
  const navigate = useNavigate();

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-[#16a34a] dark:text-[#4ade80]"; // green-600 / green-400
      case "Medium":
        return "text-[#ca8a04] dark:text-[#facc15]"; // yellow-600 / yellow-400
      case "Hard":
        return "text-[#dc2626] dark:text-[#f87171]"; // red-600 / red-400
      default:
        return "text-[#94a3b8] dark:text-[#94a3b8]"; // gray-400
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Solved":
        return (
          <Icon
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            pathProps={{ fillRule: "evenodd", clipRule: "evenodd" }}
            className="w-5 h-5 text-[#16a34a] dark:text-[#22c55e]" // green-600 / green-500
            viewBox="0 0 20 20"
            isOutline={false}
            svgProps={{ "aria-label": "Solved" }}
          />
        );
      case "Attempted":
        return (
          <Icon
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
            pathProps={{ fillRule: "evenodd", clipRule: "evenodd" }}
            className="w-5 h-5 text-[#ca8a04] dark:text-[#eab308]" // yellow-600 / yellow-500
            viewBox="0 0 20 20"
            isOutline={false}
            svgProps={{ "aria-label": "Attempted" }}
          />
        );
      case "Todo":
      default:
        return (
          <Icon
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-4-8a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z"
            pathProps={{ fillRule: "evenodd", clipRule: "evenodd" }}
            className="w-5 h-5 text-[#94a3b8] dark:text-[#6b7280]" // slate-400 / gray-500
            viewBox="0 0 20 20"
            isOutline={false}
            svgProps={{ "aria-label": "To Do" }}
          />
        );
    }
  };

  return (
    <tr className="bg-[#ffffff] dark:bg-[#232b3b] hover:bg-[#f8fafc] dark:hover:bg-[#1a2332]/50 border-b border-[#e2e8f0] dark:border-[#334155] last:border-b-0">
      <td
        className="px-5 py-4 whitespace-nowrap text-sm text-[#475569] dark:text-[#d1d5db] w-1/12"
        title={problem.status || "To Do"}
      >
        {getStatusIcon(problem.status)}
      </td>
      <td className="px-5 py-4 text-base font-medium text-[#475569] dark:text-[#94a3b8]">
        {problem.problemNo}.
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <div
          className="
            text-base font-medium text-[#0f172a] dark:text-[#e2e8f0]
            hover:text-[#f97316] dark:hover:text-[#f97316] cursor-pointer
            truncate max-w-[300px]
          "
          onClick={() => navigate(problem._id)}
        >
          {problem.title}
        </div>
      </td>
      <td
        className={`px-5 py-4 whitespace-nowrap text-sm font-semibold ${getDifficultyClass(
          problem.difficulty
        )}`}
      >
        {problem.difficulty}
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-sm text-[#475569] dark:text-[#d1d5db]">
        <div className="flex flex-wrap gap-2">
          {problem.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#f1f5f9] dark:bg-[#374151]/50 text-[#334155] dark:text-[#cbd5e1] border border-[#e2e8f0] dark:border-[#475569]"
            >
              {tag}
            </span>
          ))}
          {problem.tags.length > 2 && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#e2e8f0] dark:bg-[#475569] text-[#475569] dark:text-[#94a3b8] border border-[#cbd5e1] dark:border-[#6b7280]">
              +{problem.tags.length - 2} more
            </span>
          )}
        </div>
      </td>
      {/* <td className="px-5 py-4 whitespace-nowrap text-left text-sm font-medium w-1/6">
        <button
          type="button"
          className="font-semibold py-1 px-3 rounded-md border transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50
                     text-[#f97316] hover:text-[#ea580c] border-[#f97316] hover:border-[#ea580c] hover:bg-[#fff7ed] dark:text-[#f97316] dark:hover:text-[#fb923c] dark:border-[#f97316] dark:hover:border-[#fb923c] dark:hover:bg-[#f97316]/10
                     focus:ring-[#f97316] dark:focus:ring-[#fb923c]"
          aria-label={`View problem: ${problem.title}`}
          onClick={() => navigate(`/problems/${problem.id}`)}
        >
          View Problem
        </button>
      </td> */}
    </tr>
  );
};

export default ProblemItem;
