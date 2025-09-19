import { useEffect, useState } from "react";
import { XMarkIcon } from "../Icons/SolveProblemPageIcons";

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
}


const TestCasesWindow = ({testCases, onClose, testResultsLoading, testResults}) => {
    const [activeTab, setActiveTab] = useState(testResultsLoading?'Test Result':'Testcase');
    const [activeCase, setActiveCase] = useState(1);
    const [activeResultCase, setActiveResultCase] = useState(1);

    useEffect(() => {
      if(testResultsLoading)
        setActiveTab('Test Result');
    }, [testResultsLoading]);

    return (
        <div className="h-full flex-grow flex flex-col overflow-auto">
            <div className="flex sticky top-0 z-10 bg-gray-100 dark:bg-slate-900 border-b border-gray-300 dark:border-slate-700 flex-shrink-0">
              {bottomTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-4 text-xs font-medium focus:outline-none ${
                    activeTab === tab
                      ? 'text-orange-500 border-b-2 border-orange-500 bg-white dark:bg-slate-800'
                      : 'text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-800/60'
                  }`}
                  aria-pressed={activeTab === tab}
                >
                  {tab}
                </button>
              ))}
              <button
                onClick={onClose}
                className={` my-2 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 ml-auto mr-2`}
                aria-label="Close testcases window"
                >
                <XMarkIcon className="w-4 h-4" />
                </button>
            </div>
            <div className="flex-grow p-4 bg-white dark:bg-slate-800">
              {activeTab === 'Testcase' && (
                <div className="space-y-6 text-gray-800 dark:text-slate-100">
                  <div className="flex mt-2 space-x-2">
                    { testCases.map((_, index) => 
                        <button key={`case${index+1}`} onClick={() => {setActiveCase(index+1)}} className={`text-xs px-2 py-1 rounded bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 border ${activeCase===index+1?"border-orange-500 text-orange-500":"border-gray-400"} dark:hover:bg-slate-600`}>{`Case ${index+1}`}</button>
                    )}
                  </div>
                  { testCases.map((testCase, index) => 
                    <div key={`case${index+1}`} className={`flex flex-col gap-4 ${index+1==activeCase?"":"hidden"}`}>
                        {testCase.input && (
                            <div className="flex items-center">
                                <label htmlFor="nums-input" className="w-15 block text-xs font-medium mb-1">Input =</label>
                                <input readOnly type="text" id="nums-input" defaultValue={`${testCase.input}`} className="w-[70%] px-2 py-1.5 text-xs rounded bg-gray-50 dark:bg-slate-700" />
                            </div>
                        )}
                        {testCase.target && (
                            <div className="flex items-center">
                                <label htmlFor="target-input" className="w-15 block text-xs font-medium mb-1">Target =</label>
                                <input readOnly type="text" id="target-input" defaultValue={`${testCase.target}`} className="w-[70%] px-2 py-1.5 text-xs rounded bg-gray-50 dark:bg-slate-700" />
                            </div>
                        )}
                        {testCase.output && (
                            <div className="flex items-center">
                                <label htmlFor="nums-input" className="w-15 block text-xs font-medium mb-1">Output =</label>
                                <input readOnly type="text" id="nums-output" defaultValue={`${testCase.output}`} className="w-[70%] px-2 py-1.5 text-xs rounded bg-gray-50 dark:bg-slate-700" />
                            </div>
                        )}
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'Test Result' && (
                testResultsLoading ? 
                <div className={`h-full w-full flex flex-col items-center justify-center p-4 transition-all ease-out`} >
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4" />
                    <p className="text-lg font-semibold">Running your solution...</p>
                    <p className="text-sm">Please wait a moment.</p>
                </div> : 
                testResults ? (
                  <div className="space-y-6 text-gray-800 dark:text-slate-100">
                    <div className="flex mt-2 space-x-2">
                      { testCases.map((_, index) => 
                          <button key={`case${index+1}`} onClick={() => {setActiveResultCase(index+1)}} className={`text-xs text-white px-2 py-1 rounded ${testResults[index].status==="accepted"?activeResultCase==index+1?"bg-green-600":"bg-green-400 hover:bg-green-500":activeResultCase===index+1?"bg-red-600":"bg-red-400 hover:bg-red-500"}`}>{`Case ${index+1}`}</button>
                      )}
                    </div>
                  { testCases.map((testCase, index) => 
                    testResults[index].status==="accepted" || testResults[index].status==="wrong-answer" ?
                    <div key={`case${index+1}`} className={`flex flex-col gap-4 ${index+1==activeResultCase?"":"hidden"}`}>
                        <div className={`text-lg font-semibold`}>{getResultStatus(testResults[index].status)}</div>
                        {testCase.input && (
                          <div className="flex items-center">
                              <label htmlFor="nums-input" className="w-15 block text-xs font-medium mb-1">Input =</label>
                              <input readOnly type="text" id="nums-input" defaultValue={`${testCase.input}`} className="w-[70%] px-2 py-1.5 text-xs rounded bg-gray-50 dark:bg-slate-700" />
                          </div>
                        )}
                        {testCase.target && (
                          <div className="flex items-center">
                              <label htmlFor="target-input" className="w-15 block text-xs font-medium mb-1">Target =</label>
                              <input readOnly type="text" id="target-input" defaultValue={`${testCase.target}`} className="w-[70%] px-2 py-1.5 text-xs rounded bg-gray-50 dark:bg-slate-700" />
                          </div>
                        )}
                        {testCase.output && (
                          <div className="flex items-center">
                              <label htmlFor="nums-input" className="w-15 block text-xs font-medium mb-1">Expected Output =</label>
                              <input readOnly type="text" id="nums-output" defaultValue={`${testCase.output}`} className="w-[70%] px-2 py-1.5 text-xs rounded bg-gray-50 dark:bg-slate-700" />
                          </div>
                        )}
                        <div className="flex items-center">
                            <label htmlFor="nums-input" className="w-15 block text-xs font-medium mb-1">Your Output =</label>
                            <input readOnly type="text" id="nums-output" defaultValue={`${testResults[index].output}`} className="w-[70%] px-2 py-1.5 text-xs rounded bg-gray-50 dark:bg-slate-700" />
                        </div>
                    </div> :
                    <div key={`case${index+1}`} className={`flex flex-col gap-4 ${index+1==activeResultCase?"":"hidden"}`}>
                      <div 
                        className={`p-4 rounded-lg shadow-sm relative group
                                    bg-red-50 border-red-20 dark:bg-red-900/30 dark:border-red-700/50 border 
                                    transition-all duration-500 ease-out`}
                        role="alert"
                      >
                        <h3 className={`text-lg font-semibold}`}>
                          {getResultStatus(testResults[index].status)}
                        </h3>
                        <pre 
                          className={`p-3 mt-2 rounded-md text-xs sm:text-sm overflow-x-auto max-h-60
                                      bg-gray-100 text-red-700 dark:bg-slate-900 dark:text-red-300 
                                      whitespace-pre-wrap`}
                        >
                          {testResults[index].errorMessage}
                        </pre>
                        {/* <button
                          onClick={handleCopyError}
                          className={`absolute top-3 right-3 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity
                                    bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200`}
                          aria-label={copiedError ? "Error Copied" : "Copy error"}
                        >
                          {copiedError ? <CheckIcon className="w-4 h-4 text-green-500" /> : <DuplicateCopyIcon className="w-4 h-4" />}
                        </button> */}
                      </div>
                    </div>
                  )}
                  </div>
                ) : (
                  <div className="text-gray-600 dark:text-slate-400 text-center py-5">
                    Run code to see test results.
                  </div>
                )
              )}
            </div>
          
        </div>
    )
}

export default TestCasesWindow;