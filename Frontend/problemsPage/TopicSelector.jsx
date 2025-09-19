import React, { useState } from 'react';
import { Icon } from '../../components';

const TopicSelector = ({ topics, selectedTopic, onTopicChange, label, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={className || ''}>
      {label && (
        <label className="block text-sm font-medium text-[#475569] dark:text-[#94a3b8] mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
          style={{ maxHeight: isExpanded ? '500px' : '48px' }}
        >
          <div className="flex flex-wrap gap-2 pt-1 pb-2 pr-9">
            {topics.map((topic) => (
              <button
                key={topic.value}
                onClick={() => onTopicChange(topic.value)}
                className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none ${
                  selectedTopic === topic.value
                    ? 'bg-orange-600 text-white'
                    : 'bg-[#ffffff] dark:bg-[#232b3b] border border-[#e2e8f0] dark:border-[#334155] text-[#1e293b] dark:text-[#e2e8f0] hover:bg-slate-50 dark:hover:bg-[#334155]'
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center bg-[#ffffff]/50 dark:bg-[#232b3b]/50 border border-[#e2e8f0] dark:border-[#334155] text-[#1e293b] dark:text-[#e2e8f0] hover:bg-slate-50 hover:dark:bg-gray-800 transition-all duration-300"
            aria-label={isExpanded ? 'Collapse topics' : 'Expand topics'}
            aria-expanded={isExpanded}
          >
            <Icon
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              isOutline={true}
              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              svgProps={{ 'aria-hidden': 'true' }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
export default TopicSelector;


