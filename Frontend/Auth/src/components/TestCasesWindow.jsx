import { useEffect, useState } from "react";

const bottomTabs = ['Testcase', 'Test Result'];

const getResultStatus = (status) => {
  switch(status) {
    case 'accepted':
      return 'Accepted';
    case 'wrong-answer':
      return 'Wrong Answer';
    case 'compilation-error':
      return 'Compilation Error';
    case 'runtime-error':
      return 'Runtime Error';
    case 'tle':
      return 'Time Limit Exceeded';
    case 'pending':
      return 'Pending';
    default:
      return '';
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
    <div className="h-full flex-grow flex flex-col overflow-auto">
      {/* Tab Header */}
      <div className="flex sticky top-0 z-10 bg-base-200 border-b border-base-300 flex-shrink-0">
        {bottomTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-xs font-medium focus:outline-none ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary bg-base-100'
                : 'text-base-content/70 hover:text-base-content hover:bg-base-300'
            }`}
            aria-pressed={activeTab === tab}
          >
            {tab}
          </button>
        ))}
        <button
          onClick={onClose}
          className="my-2 text-base-content/60 hover:bg-base-300 hover:text-base-content ml-auto mr-2 p-1 rounded"
          aria-label="Close testcases window"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-grow p-4 bg-base-100">
        {activeTab === 'Testcase' && (
          <div className="space-y-6 text-base-content">
            {/* Test Case Tabs */}
            <div className="flex mt-2 space-x-2">
              {testCases?.map((_, index) => (
                <button 
                  key={`case${index+1}`} 
                  onClick={() => setActiveCase(index+1)} 
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    activeCase === index+1 
                      ? "border-primary text-primary bg-primary/10" 
                      : "border-base-300 text-base-content/70 bg-base-200 hover:bg-base-300"
                  }`}
                >
                  Case {index+1}
                </button>
              ))}
            </div>

            {/* Test Case Content */}
            {testCases?.map((testCase, index) => (
              <div key={`case${index+1}`} className={`flex flex-col gap-4 ${index+1 === activeCase ? "" : "hidden"}`}>
                {testCase.input && (
                  <div className="flex items-center">
                    <label className="w-20 block text-xs font-medium mb-1">Input =</label>
                    <input 
                      readOnly 
                      type="text" 
                      defaultValue={testCase.input} 
                      className="flex-1 px-2 py-1.5 text-xs rounded bg-base-200 border border-base-300" 
                    />
                  </div>
                )}
                {testCase.output && (
                  <div className="flex items-center">
                    <label className="w-20 block text-xs font-medium mb-1">Output =</label>
                    <input 
                      readOnly 
                      type="text" 
                      defaultValue={testCase.output} 
                      className="flex-1 px-2 py-1.5 text-xs rounded bg-base-200 border border-base-300" 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Test Result' && (
          testResultsLoading ? (
            <div className="h-full w-full flex flex-col items-center justify-center p-4">
              <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
              <p className="text-lg font-semibold">Running your solution...</p>
              <p className="text-sm text-base-content/70">Please wait a moment.</p>
            </div>
          ) : testResults ? (
            <div className="space-y-6 text-base-content">
              {/* Result Case Tabs */}
              <div className="flex mt-2 space-x-2">
                {testCases?.map((_, index) => (
                  <button 
                    key={`case${index+1}`} 
                    onClick={() => setActiveResultCase(index+1)} 
                    className={`text-xs text-white px-2 py-1 rounded transition-colors ${
                      testResults[index]?.status === "accepted" 
                        ? activeResultCase === index+1 ? "bg-success" : "bg-success/70 hover:bg-success/90"
                        : activeResultCase === index+1 ? "bg-error" : "bg-error/70 hover:bg-error/90"
                    }`}
                  >
                    Case {index+1}
                  </button>
                ))}
              </div>

              {/* Result Content */}
              {testCases?.map((testCase, index) => (
                testResults[index]?.status === "accepted" || testResults[index]?.status === "wrong-answer" ? (
                  <div key={`case${index+1}`} className={`flex flex-col gap-4 ${index+1 === activeResultCase ? "" : "hidden"}`}>
                    <div className="text-lg font-semibold">
                      {getResultStatus(testResults[index].status)}
                    </div>
                    {testCase.input && (
                      <div className="flex items-center">
                        <label className="w-24 block text-xs font-medium mb-1">Input =</label>
                        <input 
                          readOnly 
                          type="text" 
                          defaultValue={testCase.input} 
                          className="flex-1 px-2 py-1.5 text-xs rounded bg-base-200 border border-base-300" 
                        />
                      </div>
                    )}
                    {testCase.output && (
                      <div className="flex items-center">
                        <label className="w-24 block text-xs font-medium mb-1">Expected =</label>
                        <input 
                          readOnly 
                          type="text" 
                          defaultValue={testCase.output} 
                          className="flex-1 px-2 py-1.5 text-xs rounded bg-base-200 border border-base-300" 
                        />
                      </div>
                    )}
                    <div className="flex items-center">
                      <label className="w-24 block text-xs font-medium mb-1">Your Output =</label>
                      <input 
                        readOnly 
                        type="text" 
                        defaultValue={testResults[index].output || ""} 
                        className="flex-1 px-2 py-1.5 text-xs rounded bg-base-200 border border-base-300" 
                      />
                    </div>
                  </div>
                ) : (
                  <div key={`case${index+1}`} className={`flex flex-col gap-4 ${index+1 === activeResultCase ? "" : "hidden"}`}>
                    <div className="p-4 rounded-lg border border-error/30 bg-error/10">
                      <h3 className="text-lg font-semibold text-error mb-2">
                        {getResultStatus(testResults[index].status)}
                      </h3>
                      <pre className="p-3 mt-2 rounded-md text-xs overflow-x-auto max-h-60 bg-base-200 text-error whitespace-pre-wrap">
                        {testResults[index].errorMessage || "An error occurred"}
                      </pre>
                    </div>
                  </div>
                )
              ))}
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