import React, { useEffect, useRef } from 'react';
import { XMarkIcon } from '../Icons/SolveProblemPageIcons'; 
import { NavLink } from 'react-router';
import Icon from '../shared/Icon';

const ProblemSidebar = ({ problems, currentProblemId, isOpen, onClose }) => {
  const sidebarRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Solved':
        return (
          <Icon
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            pathProps={{ fillRule: "evenodd", clipRule: "evenodd" }}
            className="w-5 h-5 text-green-600 dark:text-green-500"
            viewBox="0 0 20 20"
            isOutline={false}
            svgProps={{ "aria-label": "Solved" }}
          />
        );
      case 'Attempted':
        return (
          <Icon
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
            pathProps={{ fillRule: "evenodd", clipRule: "evenodd" }}
            className="w-5 h-5 text-yellow-600 dark:text-yellow-500"
            viewBox="0 0 20 20"
            isOutline={false}
            svgProps={{ "aria-label": "Attempted" }}
          />
        );
      case 'Todo':
      default:
        return (
          <Icon
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-4-8a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z"
            pathProps={{ fillRule: "evenodd", clipRule: "evenodd" }}
            className="w-5 h-5 text-slate-400 dark:text-gray-500"
            viewBox="0 0 20 20"
            isOutline={false}
            svgProps={{ "aria-label": "To Do" }}
          />
        );
    }
  };

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return `bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300`;
      case 'Medium':
        return `bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300`;
      case 'Hard':
        return `bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300`;
      default:
        return `bg-gray-100 text-gray-700 dark:bg-slate-700/30 dark:text-slate-300`;
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={sidebarRef}
        id="problem-sidebar"
        role="dialog"
        aria-modal="true"
        aria-labelledby="problem-sidebar-title"
        className={`fixed top-0 left-0 z-40 h-screen w-full md:w-90 
                   bg-white dark:bg-slate-800 
                   shadow-xl transform transition-transform duration-300 ease-in-out
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-slate-700">
            <h2 id="problem-sidebar-title" className="text-lg font-semibold text-gray-800 dark:text-slate-100">
              Problem List
            </h2>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-1 rounded-md text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Close problem list"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-2">
            <ul className="space-y-1">
              {problems.map((problem) => (
                <li key={problem._id}>
                  <NavLink
                    to={`/problems/${problem._id}`} 
                    className="flex items-center p-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-150 group"
                  >
                    <div className="mr-3 flex-shrink-0">{getStatusIcon(problem.status)}</div>
                    <div className="flex-grow">
                        <span className={`text-sm font-medium group-hover:text-orange-500 ${ problem._id === currentProblemId ? "text-orange-500" : "text-gray-800 dark:text-slate-100" }`}>
                         {problem.title}
                        </span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getDifficultyClass(problem.difficulty)}`}>
                        {problem.difficulty}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProblemSidebar;