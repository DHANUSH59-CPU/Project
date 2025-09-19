import React from 'react';
import { Icon } from '../../components';
import { useNavigate } from 'react-router';

const ProblemsPageCard = ({ problem }) => {
  const navigate = useNavigate();

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Medium':
        return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'Hard':
        return 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Solved':
        return (
          <Icon
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            pathProps={{ fillRule: 'evenodd', clipRule: 'evenodd' }}
            className="w-5 h-5 text-green-500"
            viewBox="0 0 20 20"
            isOutline={false}
            svgProps={{ 'aria-label': 'Solved' }}
          />
        );
      case 'Attempted':
        return (
          <Icon
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
            pathProps={{ fillRule: 'evenodd', clipRule: 'evenodd' }}
            className="w-5 h-5 text-yellow-500"
            viewBox="0 0 20 20"
            isOutline={false}
            svgProps={{ 'aria-label': 'Attempted' }}
          />
        );
      case 'Todo':
      default:
        return (
          <Icon
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-4-8a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z"
            pathProps={{ fillRule: 'evenodd', clipRule: 'evenodd' }}
            className="w-5 h-5 text-slate-400 dark:text-gray-500"
            viewBox="0 0 20 20"
            isOutline={false}
            svgProps={{ 'aria-label': 'To Do' }}
          />
        );
    }
  };

  return (
    <div onClick={() => navigate(problem._id)} className="bg-white dark:bg-[#232b3b] rounded-lg shadow-lg dark:shadow-xl border border-[#e2e8f0] dark:border-[#334155] p-5 flex flex-col h-full transition-[transform,box-shadow] duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="flex items-start justify-between mb-3">
        <span className="font-semibold text-slate-600 dark:text-slate-400 text-sm">{`#${problem.problemNo}`}</span>
        <div className="flex items-center space-x-2">
          <div title={problem.status || 'To Do'}>
            {getStatusIcon(problem.status)}
          </div>
        </div>
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-slate-800 dark:text-[#e2e8f0] hover:text-orange-600 dark:hover:text-[#f97316] cursor-pointer mb-3">
          {problem.title}
        </h3>
      </div>
      <div className="flex-shrink-0">
        <div className="flex flex-wrap gap-2 mb-4">
          {problem.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-gray-700/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
            >
              {tag}
            </span>
          ))}
          {problem.tags.length > 2 && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-500">
              +{problem.tags.length - 2}
            </span>
          )}
        </div>
        <div
          className={`text-sm font-semibold px-3 py-1 rounded-full text-center border ${getDifficultyClass(
            problem.difficulty
          )}`}
        >
          {problem.difficulty}
        </div>
      </div>
    </div>
  );
};

export default ProblemsPageCard;
