import React from 'react';
import SearchBar from '../shared/SearchBar';
import Dropdown from '../shared/Dropdown';
import TopicSelector from './TopicSelector';
import { RefreshCcw, List, LayoutGrid } from 'lucide-react';

const ViewToggleButton = ({
  mode,
  currentMode,
  label,
  icon,
  onViewModeChange
}) => (
  <button
    onClick={() => onViewModeChange(mode)}
    className={`p-1.5 rounded-md ${
      currentMode === mode
        ? 'bg-[#f97316] text-[#ffffff]'
        : 'bg-transparent text-[#64748b] dark:text-[#94a3b8] hover:bg-[#e2e8f0] dark:hover:bg-[#334155]'
    }`}
    aria-label={`Switch to ${label} view`}
  >
    {icon}
  </button>
);


const ProblemFilters = ({
  viewMode,
  setViewMode,
  noProblems,
  topics,
  difficulties,
  statuses,
  searchTerm,
  selectedTopic,
  selectedDifficulty,
  selectedStatus,
  onSearchChange,
  onTopicChange,
  onDifficultyChange,
  onStatusChange,
  onResetFilters,
}) => {
  return (
    <div className="p-6 bg-[#ffffff] dark:bg-[#232b3b] rounded-lg shadow-lg dark:shadow-xl border border-[#e2e8f0] dark:border-[#334155]">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-lg font-semibold text-[#1e293b] dark:text-[#e2e8f0]">
          Filter & Sort{' '}
          <span className="text-sm font-normal text-[#475569] dark:text-[#94a3b8]">
            {`(${noProblems})`}
          </span>
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold bg-[#ffffff] dark:bg-[#1a2332] border border-[#e2e8f0] dark:border-[#334155] text-[#1e293b] dark:text-[#e2e8f0] hover:bg-slate-50 dark:hover:bg-[#334155] focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all duration-200"
            aria-label="Reset all filters"
          >
            <RefreshCcw size={16} />
          </button>
          <div className="flex items-center p-1 gap-1.5 bg-slate-100 dark:bg-[#1a2332] rounded-lg border border-[#e2e8f0] dark:border-[#334155]">
            <ViewToggleButton
              mode="list"
              currentMode={viewMode}
              label="List"
              icon={<List size={20} />}
              onViewModeChange={setViewMode}
            />
            <ViewToggleButton
              mode="grid"
              currentMode={viewMode}
              label="Grid"
              icon={<LayoutGrid size={20} />}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            className="md:col-span-2"
            placeholder="Search by title..."
          />
          <Dropdown
            label="Difficulty"
            options={difficulties}
            selectedValue={selectedDifficulty}
            onSelect={(value) => onDifficultyChange(value)}
            className="w-full"
          />
          <Dropdown
            label="Status"
            options={statuses}
            selectedValue={selectedStatus}
            onSelect={(value) => onStatusChange(value)}
            className="w-full"
          />
          <TopicSelector
            label="Topic"
            topics={topics}
            selectedTopic={selectedTopic}
            onTopicChange={onTopicChange}
            className="md:col-span-4"
          />
        </div>
      </div>
    </div>
  );
};

export default ProblemFilters;
