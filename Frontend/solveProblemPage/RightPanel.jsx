import { useState, useCallback, useEffect, useRef } from 'react';
import { CodeEditor } from "../"
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import axiosClient from '../../config/axios';
import { CodeIcon, ChevronDownIcon } from "../Icons/SolveProblemPageIcons";
import { motion, AnimatePresence } from 'framer-motion';
import TestCasesWindow from './TestCasesWindow';
import { RefreshCcw, Bolt, Maximize } from 'lucide-react';
import SettingsPopover from "./SettingsPopover";


// available languages
const availableLanguages = ['C++', 'Python', 'Java', 'Javascript'];

// to get initial code for a selected language
const getStarterCode = (starterCodes, selectedLanguage) => {
  if(!starterCodes)
    return '';

  const starterCode = starterCodes.find(code => code.language.toLowerCase()===selectedLanguage);
  return starterCode?.code;
}

const commonIconButtonClass = "p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100";

// to store code for different languages
let codes = {}


const RightPanel = ({problem, problems, setProblems, showSubmissionResult, setShowSubmissionResult, submissionResult, setSubmissionResult, code, setCode, darkTheme, isTimerRunning, setIsTimerRunning }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const { isAuthenticated } = useSelector(state => state.authSlice);
  const navigate = useNavigate();
  const [showTestCasesWindow, setShowTestCasesWindow] = useState(false);
  const [testResultsLoading, setTestResultsLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [isEditorSettingOpen, setIsEditorSettingOpen] = useState(false);
  const [editorFontSize, setEditorFontSize] = useState(14);
  const [editorTabSize, setEditorTabSize] = useState(2);
  const [editorTheme, setEditorTheme] = useState(() => darkTheme?"vs-dark":"vs");
  const [minimap, setMinimap] = useState(false);

  // --- Start of Resizing Logic ---
  const [isDragging, setIsDragging] = useState(false);
  const [editorHeight, setEditorHeight] = useState(null); // Use null for initial flexible height
  const resizableContainerRef = useRef(null); // Ref for the container of resizable panels

  // const handleMouseDown = useCallback((e) => {
  //   e.preventDefault();
  //   setIsDragging(true);
  // }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !resizableContainerRef.current) return;

    const containerRect = resizableContainerRef.current.getBoundingClientRect();
    let newHeight = e.clientY - containerRect.top;

    // Add constraints to prevent panels from becoming too small
    const minEditorHeight = 100; // Minimum height for the editor panel
    const minBottomPanelHeight = 25; // Minimum height for the bottom panel
    const maxHeight = containerRect.height - minBottomPanelHeight;

    if (newHeight < minEditorHeight) newHeight = minEditorHeight;
    if (newHeight > maxHeight) newHeight = maxHeight;

    setEditorHeight(newHeight);
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);
  // --- End of Resizing Logic ---

  useEffect(() => {
    if(darkTheme)
      setEditorTheme("vs-dark");
    else
      setEditorTheme("vs");
  }, [darkTheme]);
  
  const handleLanguageChange = (event) => {
    codes[selectedLanguage] = code;
    const language = event.target.value;
    if(language === 'C++')
      setSelectedLanguage('cpp');
    else
      setSelectedLanguage(language.toLowerCase());
  };

  useEffect(() => {
    codes = {};
  }, [problem._id]);

  useEffect(() => {
    if(codes[selectedLanguage])
      setCode(codes[selectedLanguage]);
    else
      setCode("\n" + getStarterCode(problem.starterCode, selectedLanguage));
  }, [selectedLanguage]);

  const handleCodeChange = useCallback((value) => {
    setCode(value || '');
  }, []);

  const handleSubmit = () => {
    if(isTimerRunning)
      setIsTimerRunning(false);
    setSubmissionResult(null);
    setShowSubmissionResult(true);
    const getSubmissionResults = async () => {
      try {

        const {data: submissionResult} = await axiosClient.post(`/problems/${problem._id}/submit`, {
          submittedCode: code,
          language: selectedLanguage
        });
        setSubmissionResult(submissionResult);
        const currentProblem = problems.find((p) => p._id===problem._id);
        if(submissionResult.status==="accepted") {
          if(currentProblem.status!=="Accepted") {
            currentProblem.status = "Solved";
            setProblems([...problems]);
          }
        } else {
          if(currentProblem.status==="To Do"){
            currentProblem.status = "Attempted";
            setProblems([...problems]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    getSubmissionResults();
  }

  const handleRun = () => {
    setTestResultsLoading(true);
    if(!showTestCasesWindow)
      setShowTestCasesWindow(true);
    setTestResults(null);
    const getTestResults = async () => {
      try {

        const {data: testResults} = await axiosClient.post(`/problems/${problem._id}/run`, {
          userSolution: code,
          language: selectedLanguage
        });
        setTestResults(testResults);
        setTestResultsLoading(false);
      } catch (error) {
        console.log(error);
        setTestResultsLoading(false);
      }
    }
    getTestResults();
  }

  const onClose = () => {
    setShowTestCasesWindow(false);
  }

  const handleRefreshCodeButton = () => {
    setCode("\n" + getStarterCode(problem.starterCode, selectedLanguage));
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Top Header - Fixed Height */}
      <div className="h-[42.4px] flex items-center justify-between px-3 bg-gray-100 dark:bg-slate-900 border-b border-gray-300 dark:border-slate-700 text-xs text-gray-600 dark:text-slate-300 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="pr-2 flex items-center space-x-2 text-gray-800 dark:text-slate-100">
            <CodeIcon />
            <span>Code</span>
          </div>
          <div className="relative">
            <select
              onChange={handleLanguageChange}
              className={`py-1 pl-2 pr-3 rounded text-xs focus:outline-1
                         bg-transparent hover:text-gray-800 dark:hover:text-slate-100
                         text-gray-600 dark:text-slate-300 cursor-pointer`}
              aria-label="Select programming language"
            >
              {availableLanguages.map(lang => (
                <option key={lang} value={lang} className="bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100">
                  {lang}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600 dark:text-slate-300">
              <ChevronDownIcon />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {testResultsLoading ?
            <button onClick={handleRun} className="px-3 py-1 text-xs bg-green-400 text-white rounded opacity-80 transition-colors cursor-not-allowed" disabled={true}>Running</button> : 
            <button onClick={handleRun} className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:opacity-90 transition-colors cursor-pointer">Run</button>
          }
          {showSubmissionResult&&!submissionResult ? (
            <button onClick={handleSubmit} className="px-3 py-1 text-xs bg-orange-400 text-white rounded opacity-80 transition-colors cursor-not-allowed" disabled={true}>Submitting</button>
          ) : (
          <button onClick={handleSubmit} className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:opacity-90 transition-colors cursor-pointer" >Submit</button>
          )}
          <div className='relative'>
            <button onClick={() => setIsEditorSettingOpen(!isEditorSettingOpen)} className={`${commonIconButtonClass} ml-2`} aria-label="Editor settings">
              <Bolt size={16} />
            </button>
            {isEditorSettingOpen && (
              <SettingsPopover 
                isOpen={true} 
                fontSize={editorFontSize} 
                setFontSize={setEditorFontSize} 
                tabSize={editorTabSize} 
                setTabSize={setEditorTabSize} 
                editorTheme={editorTheme} 
                setEditorTheme={setEditorTheme}
                minimap={minimap}
                setMinimap={setMinimap}
              />
            )}
          </div>
          <button onClick={handleRefreshCodeButton} className={commonIconButtonClass} aria-label="Reset to default code"><RefreshCcw size={16} /></button>
          {/* <button className={commonIconButtonClass} aria-label="Toggle fullscreen editor"><Maximize size={16} /></button> */}
        </div>
      </div>
        
      {/* Top Panel: Code Editor + Status Bar */}
      <div className="flex flex-col flex-1 relative overflow-hidden">
        <div className="h-full">
          <CodeEditor
              language={selectedLanguage}
              value={code}
              onChange={handleCodeChange}
              editorTheme={editorTheme}
              fontSize={editorFontSize}
              tabSize={editorTabSize}
              minimap={minimap}
          />
        </div>
        <AnimatePresence>
          { showTestCasesWindow && ( 
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.5 }}
              className="h-[50%] w-full text-gray-600 bottom-0 absolute dark:text-slate-300 bg-white dark:bg-slate-800"
            >
              <TestCasesWindow 
                testCases={problem.visibleTestCases}
                onClose={onClose}
                testResults={testResults}
                testResultsLoading={testResultsLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {!isAuthenticated && (
          <div className="h-10 p-2.5 bg-gray-100 dark:bg-slate-700 text-sm text-center border-y border-gray-300 dark:border-slate-700 text-gray-800 dark:text-slate-100 flex-shrink-0">
            You need to <span onClick={()=>{navigate("/login")}} className="text-orange-500 font-semibold hover:underline cursor-pointer">Login</span> / <span onClick={()=>{navigate("/login")}} className="text-orange-500 font-semibold hover:underline cursor-pointer">Signup</span> to run or submit
          </div>
      )}
      <div className="h-10 flex items-center justify-end px-10 text-xs bg-gray-100 dark:bg-slate-900 border-t border-gray-300 dark:border-slate-700 text-gray-600 dark:text-slate-300 flex-shrink-0">
        {/* <span>Ln 6, Col 3 Saved</span> */}
        <div className='flex gap-4 text-sm'>
          <button onClick={() => setShowTestCasesWindow(!showTestCasesWindow)} className='cursor-pointer underline hover:text-green-500'>Test Cases</button>
          {/* <button className='cursor-pointer underline hover:text-green-500'>Custom Inputs</button> */}
        </div>
      </div>

    </div>
   
  );
};

export default RightPanel;

