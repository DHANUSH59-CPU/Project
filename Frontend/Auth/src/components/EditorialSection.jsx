const EditorialSection = ({ problem }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-base-200 rounded-full flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-base-content/40" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-base-content mb-2">
          Editorial Coming Soon
        </h3>
        <p className="text-base-content/70 max-w-md">
          We're working on detailed explanations and solutions for this problem. 
          Check back later for step-by-step tutorials and optimal approaches.
        </p>
      </div>
      
      <div className="bg-base-200 rounded-lg p-4 max-w-sm">
        <p className="text-sm text-base-content/60">
          <strong>Problem:</strong> {problem?.title || "Loading..."}
        </p>
        <p className="text-sm text-base-content/60 mt-1">
          <strong>Difficulty:</strong> {problem?.difficulty || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default EditorialSection;