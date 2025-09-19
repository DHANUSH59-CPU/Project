import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '../Icons/SolveProblemPageIcons';

function CollapsibleSection({ 
  title, 
  icon: IconComponent, 
  badgeText, 
  children, 
  initiallyOpen = false, 
  titleColorClass = "text-gray-700 dark:text-slate-200" 
}) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-200 dark:border-slate-700">
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between py-3 px-1 text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm"
        aria-expanded={isOpen}
        aria-controls={`collapsible-content-${title.replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center">
          {IconComponent && (
            <IconComponent
              className={`w-4 h-4 mr-2 ${
                titleColorClass === "text-yellow-500 dark:text-yellow-400"
                   ? titleColorClass
                   : "text-gray-500 dark:text-slate-400"
              }`}
            />
          )}

          <span className={`text-sm font-medium ${titleColorClass}`}>
            {title}
          </span>

          {badgeText && (
            <span className="ml-2 text-xs text-gray-500 dark:text-slate-400">
              ({badgeText})
            </span>
          )}

        </div>

        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-500 dark:text-slate-400" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-500 dark:text-slate-400" />
        )}

      </button>

      {isOpen && (
        <div
          id={`collapsible-content-${title.replace(/\s+/g, '-')}`}
          className="px-1 py-3 text-sm text-gray-600 dark:text-slate-300"
        >
          {children}
        </div>
      )}

    </div>
  );
}

export default CollapsibleSection;
