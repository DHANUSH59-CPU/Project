import { useState } from 'react';

function CollapsibleSection({ 
  title, 
  icon: IconComponent, 
  badgeText, 
  children, 
  initiallyOpen = false, 
  titleColorClass = "text-base-content" 
}) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-base-300">
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between py-3 px-1 text-left hover:bg-base-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
        aria-expanded={isOpen}
        aria-controls={`collapsible-content-${title.replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center">
          {IconComponent && (
            <IconComponent
              className={`w-4 h-4 mr-2 ${
                titleColorClass === "text-yellow-500"
                   ? titleColorClass
                   : "text-base-content/60"
              }`}
            />
          )}

          <span className={`text-sm font-medium ${titleColorClass}`}>
            {title}
          </span>

          {badgeText && (
            <span className="ml-2 text-xs text-base-content/60">
              ({badgeText})
            </span>
          )}
        </div>

        <svg 
          className={`w-5 h-5 text-base-content/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          id={`collapsible-content-${title.replace(/\s+/g, '-')}`}
          className="px-1 py-3 text-sm text-base-content/80"
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default CollapsibleSection;