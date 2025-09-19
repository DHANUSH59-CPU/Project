const ChatInterface = ({ problem, userSolution, qaBlocks, setQaBlocks }) => {
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-base-content mb-2">
          AI Assistant Coming Soon
        </h3>
        <p className="text-base-content/70 max-w-md">
          Get personalized hints, explanations, and code reviews from our AI assistant. 
          This feature will help you understand problems better and improve your coding skills.
        </p>
      </div>
      
      <div className="bg-base-200 rounded-lg p-4 max-w-sm">
        <p className="text-sm text-base-content/60">
          <strong>Features coming:</strong>
        </p>
        <ul className="text-sm text-base-content/60 mt-2 text-left">
          <li>• Hint generation</li>
          <li>• Code explanation</li>
          <li>• Solution optimization</li>
          <li>• Error debugging help</li>
        </ul>
      </div>
    </div>
  );
};

export default ChatInterface;