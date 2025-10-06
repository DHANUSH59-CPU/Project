import { useEffect, useState } from "react";

const bottomTabs = ['Testcase', 'Test Result'];

const getResultStatus = (status) => {
  // Handle both backend status formats
  const normalizedStatus = status?.toLowerCase();
  
  switch(normalizedStatus) {
    case 'accepted':
    case 'accepted (ac)':
      return 'Accepted';
    case 'wrong answer':
    case 'wrong-answer':
    case 'wrong answer (wa)':
      return 'Wrong Answer';
    case 'compilation error':
    case 'compilation-error':
    case 'compilation error (ce)':
      return 'Compilation Error';
    case 'runtime error':
    case 'runtime-error':
    case 'runtime error (nzec)':
    case 'runtime error (sigsegv)':
      return 'Runtime Error';
    case 'time limit exceeded':
    case 'tle':
    case 'time limit exceeded (tle)':
      return 'Time Limit Exceeded';
    case 'pending':
    case 'in queue':
    case 'processing':
      return 'Pending';
    default:
      return status || 'Unknown';
  }
};

const TestCasesWindow = ({ testCases, onClose, testResultsLoading, testResults }) => {
  const [activeTab, setActiveTab] = useState(testResultsLoading ? 'Test Result' : 'Testcase');
  const [activeCase, setActiveCase] = useState(1);
  const [activeResultCase, setActiveResultCase] = useState(1);

  useEffect(() => {
    if (testResultsLoading) {
      setActiveTab('Test Result');
    }
  }, [testResultsLoading]);

  return (
    <div className="h-full flex-grow flex flex-col overflow-auto bg-base-100 rounded-t-lg shadow-lg">
      {/* Tab Header */}
      <div className="flex sticky top-0 z-10 bg-gradient-to-r from-base-200 to-base-200/90 border-b border-base-300/60 backdrop-blur-sm flex-shrink-0 rounded-t-lg">
        <div className="flex items-center space-x-1 p-2">
          {bottomTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative py-2.5 px-4 text-sm font-medium focus:outline-none rounded-lg transition-all duration-200 ${
                activeTab === tab
                  ? 'text-primary bg-base-100 shadow-sm border border-primary/20'
                  : 'text-base-content/70 hover:text-base-content hover:bg-base-300/50'
              }`}
              aria-pressed={activeTab === tab}
            >
              <div className="flex items-center space-x-2">
                {tab === 'Testcase' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )}
                <span>{tab}</span>
              </div>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"></div>
              )}
            </button>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="ml-auto mr-3 my-2 p-2 text-base-content/60 hover:bg-base-300/70 hover:text-base-content rounded-lg transition-all duration-200 group"
          aria-label="Close testcases window"
        >
          <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-grow p-3 sm:p-4 lg:p-6 bg-base-100">
        {activeTab === 'Testcase' && (
          <div className="space-y-6 text-base-content animate-in fade-in duration-300">
            {/* Test Case Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {testCases?.map((_, index) => (
                <button 
                  key={`case${index+1}`} 
                  onClick={() => setActiveCase(index+1)} 
                  className={`group relative px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                    activeCase === index+1 
                      ? "border-primary text-primary bg-primary/10 shadow-sm" 
                      : "border-base-300/60 text-base-content/70 bg-base-200/50 hover:bg-base-300/70 hover:border-base-400"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      activeCase === index+1 ? 'bg-primary' : 'bg-base-content/30'
                    }`}></div>
                    <span>Test Case {index+1}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Test Case Content */}
            {testCases?.map((testCase, index) => (
              <div key={`case${index+1}`} className={`space-y-6 transition-all duration-300 ${index+1 === activeCase ? "animate-in fade-in slide-in-from-right-4" : "hidden"}`}>
                {testCase.input && (
                  <div className="bg-base-200/50 rounded-lg p-4 border border-base-300/60">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-base-content mb-3">
                      <svg className="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                      <span>Input</span>
                    </label>
                    <div className="bg-base-100 rounded-md border border-base-300/60 p-3">
                      <code className="text-sm font-mono text-base-content break-all">{testCase.input}</code>
                    </div>
                  </div>
                )}
                {testCase.output && (
                  <div className="bg-base-200/50 rounded-lg p-4 border border-base-300/60">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-base-content mb-3">
                      <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l3 3 7-7" />
                      </svg>
                      <span>Expected Output</span>
                    </label>
                    <div className="bg-base-100 rounded-md border border-base-300/60 p-3">
                      <code className="text-sm font-mono text-base-content break-all">{testCase.output}</code>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Test Result' && (
          testResultsLoading ? (
            <div className="h-full w-full flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
              <div className="relative">
                <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                <div className="absolute inset-0 loading loading-spinner loading-lg text-primary/30 animate-ping"></div>
              </div>
              <p className="text-lg font-semibold animate-pulse">Running your solution...</p>
              <p className="text-sm text-base-content/70">Please wait a moment.</p>
              <div className="mt-4 flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          ) : testResults ? (
            <div className="space-y-6 text-base-content">
              {/* Result Case Tabs */}
              <div className="flex flex-wrap gap-3 mb-6">
                {testCases?.map((_, index) => {
                  const result = testResults[index];
                  const isPassed = result?.passed || result?.status?.toLowerCase().includes('accepted');
                  const isActive = activeResultCase === index+1;
                  
                  return (
                    <button 
                      key={`case${index+1}`} 
                      onClick={() => setActiveResultCase(index+1)} 
                      className={`group relative px-4 py-3 text-sm font-medium rounded-lg border transition-all duration-200 shadow-sm ${
                        isPassed
                          ? isActive 
                            ? "bg-success text-white border-success shadow-success/25" 
                            : "bg-success/10 text-success border-success/30 hover:bg-success/20"
                          : isActive 
                            ? "bg-error text-white border-error shadow-error/25" 
                            : "bg-error/10 text-error border-error/30 hover:bg-error/20"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          isPassed ? 'bg-current' : 'bg-current'
                        }`}></div>
                        <span>Test {index+1}</span>
                        {isPassed ? (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Result Content */}
              {testCases?.map((testCase, index) => {
                const result = testResults[index];
                const isPassed = result?.passed || result?.status?.toLowerCase().includes('accepted');
                const isWrongAnswer = result?.status?.toLowerCase().includes('wrong');
                
                return (testResults[index] && (isPassed || isWrongAnswer)) ? (
                  <div key={`case${index+1}`} className={`space-y-6 transition-all duration-300 ${index+1 === activeResultCase ? "animate-in fade-in slide-in-from-left-4" : "hidden"}`}>
                    {/* Status Header */}
                    <div className={`flex items-center space-x-3 p-4 rounded-lg border ${
                      isPassed 
                        ? 'bg-success/10 border-success/30 text-success' 
                        : 'bg-error/10 border-error/30 text-error'
                    }`}>
                      <div className={`p-2 rounded-full ${
                        isPassed ? 'bg-success/20' : 'bg-error/20'
                      }`}>
                        {isPassed ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{getResultStatus(result.status)}</h3>
                        <p className="text-sm opacity-80">Test Case {index + 1}</p>
                      </div>
                    </div>

                    {/* Input Section */}
                    {testCase.input && (
                      <div className="bg-base-200/50 rounded-lg p-4 border border-base-300/60">
                        <label className="flex items-center space-x-2 text-sm font-semibold text-base-content mb-3">
                          <svg className="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                          <span>Input</span>
                        </label>
                        <div className="bg-base-100 rounded-md border border-base-300/60 p-3">
                          <code className="text-sm font-mono text-base-content break-all">{testCase.input}</code>
                        </div>
                      </div>
                    )}

                    {/* Expected Output Section */}
                    {testCase.output && (
                      <div className="bg-base-200/50 rounded-lg p-4 border border-base-300/60">
                        <label className="flex items-center space-x-2 text-sm font-semibold text-base-content mb-3">
                          <svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Expected Output</span>
                        </label>
                        <div className="bg-base-100 rounded-md border border-base-300/60 p-3">
                          <code className="text-sm font-mono text-base-content break-all">{testCase.output}</code>
                        </div>
                      </div>
                    )}

                    {/* Your Output Section */}
                    <div className="bg-base-200/50 rounded-lg p-4 border border-base-300/60">
                      <label className={`flex items-center space-x-2 text-sm font-semibold mb-3 ${
                        isPassed ? 'text-success' : 'text-error'
                      }`}>
                        {isPassed ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        )}
                        <span>Your Output</span>
                      </label>
                      <div className={`bg-base-100 rounded-md border p-3 ${
                        isPassed ? 'border-success/30' : 'border-error/30'
                      }`}>
                        <code className={`text-sm font-mono break-all ${
                          isPassed ? 'text-success' : 'text-error'
                        }`}>
                          {result.output || "No output"}
                        </code>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={`case${index+1}`} className={`space-y-6 transition-all duration-300 ${index+1 === activeResultCase ? "animate-in fade-in slide-in-from-left-4" : "hidden"}`}>
                    {/* Error Status Header */}
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-error/30 bg-error/10 text-error">
                      <div className="p-2 rounded-full bg-error/20">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{getResultStatus(testResults[index]?.status)}</h3>
                        <p className="text-sm opacity-80">Test Case {index + 1} Failed</p>
                      </div>
                    </div>

                    {/* Input Section (if available) */}
                    {testCase.input && (
                      <div className="bg-base-200/50 rounded-lg p-4 border border-base-300/60">
                        <label className="flex items-center space-x-2 text-sm font-semibold text-base-content mb-3">
                          <svg className="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                          <span>Input</span>
                        </label>
                        <div className="bg-base-100 rounded-md border border-base-300/60 p-3">
                          <code className="text-sm font-mono text-base-content break-all">{testCase.input}</code>
                        </div>
                      </div>
                    )}

                    {/* Error Details */}
                    <div className="bg-error/5 rounded-lg p-4 border border-error/20">
                      <label className="flex items-center space-x-2 text-sm font-semibold text-error mb-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Error Details</span>
                      </label>
                      <div className="bg-base-100 rounded-md border border-error/30 p-4 max-h-60 overflow-auto">
                        <pre className="text-sm font-mono text-error whitespace-pre-wrap break-words">
                          {testResults[index]?.error || testResults[index]?.output || "An unexpected error occurred during execution"}
                        </pre>
                      </div>
                    </div>

                    {/* Help Section */}
                    <div className="bg-info/5 rounded-lg p-4 border border-info/20">
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-info mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h4 className="font-medium text-info mb-1">Debugging Tips</h4>
                          <ul className="text-sm text-base-content/70 space-y-1">
                            <li>• Check your algorithm logic and edge cases</li>
                            <li>• Verify variable declarations and scope</li>
                            <li>• Look for syntax errors or typos</li>
                            <li>• Test with the provided input manually</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-base-content/70">Run code to see test results.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TestCasesWindow;