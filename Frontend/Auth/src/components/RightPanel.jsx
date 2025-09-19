import { useState, useCallback, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import axiosClient from '../utils/axios';
import TestCasesWindow from './TestCasesWindow';
import SettingsPopover from './SettingsPopover';

// Available languages (matching your backend)
const availableLanguages = ['C++', 'Java', 'JavaScript'];

// Get initial code for a selected language (matching your backend structure)
const getStarterCode = (starterCodes, selectedLanguage) => {
  if (!starterCodes) return '';

  // Map frontend language to backend language format
  const languageMap = {
    'cpp': 'C++',
    'c++': 'C++', 
    'java': 'Java',
    'javascript': 'JavaScript'
  };

  const backendLanguage = languageMap[selectedLanguage.toLowerCase()] || selectedLanguage;
  
  const starterCode = starterCodes.find(code => 
    code.language === backendLanguage
  );
  return starterCode?.initialCode || '';
};

// Language mapping for Monaco Editor
const getMonacoLanguage = (lang) => {
  switch (lang.toLowerCase()) {
    case "cpp":
    case "c++":
      return "cpp";
    case "javascript":
      return "javascript";
    case "java":
      return "java";
    default:
      return "cpp"; // Default to C++ since that's your primary language
  }
};

// To store code for different languages
let codes = {};

const RightPanel = ({ 
  problem, 
  code, 
  setCode, 
  submissionResult, 
  setSubmissionResult, 
  showSubmissionResult, 
  setShowSubmissionResult 
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const { isAuthenticated } = useSelector(state => state.authSlice);
  const navigate = useNavigate();
  const [showTestCasesWindow, setShowTestCasesWindow] = useState(false);
  const [testResultsLoading, setTestResultsLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [isEditorSettingOpen, setIsEditorSettingOpen] = useState(false);
  const [editorFontSize, setEditorFontSize] = useState(14);
  const [editorTabSize, setEditorTabSize] = useState(2);
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [minimap, setMinimap] = useState(false);

  // Set initial language and code when problem loads
  useEffect(() => {
    if (problem && problem.startCode && problem.startCode.length > 0) {
      // Find the first available language, preferring C++
      const availableBackendLanguages = problem.startCode.map(sc => sc.language);
      
      let defaultLang = "cpp";
      if (availableBackendLanguages.includes("C++")) {
        defaultLang = "cpp";
      } else if (availableBackendLanguages.includes("JavaScript")) {
        defaultLang = "javascript";
      } else if (availableBackendLanguages.includes("Java")) {
        defaultLang = "java";
      }
      
      setSelectedLanguage(defaultLang);
      setCode(getStarterCode(problem.startCode, defaultLang));
    }
  }, [problem, setCode]);

  const handleLanguageChange = (event) => {
    codes[selectedLanguage] = code;
    const language = event.target.value;
    
    // Map display language to internal language
    const languageMap = {
      'C++': 'cpp',
      'Java': 'java', 
      'JavaScript': 'javascript'
    };
    
    setSelectedLanguage(languageMap[language] || language.toLowerCase());
  };

  useEffect(() => {
    codes = {};
  }, [problem._id]);

  useEffect(() => {
    if (codes[selectedLanguage]) {
      setCode(codes[selectedLanguage]);
    } else {
      setCode(getStarterCode(problem.startCode, selectedLanguage));
    }
  }, [selectedLanguage, problem.startCode, setCode]);

  const handleCodeChange = useCallback((value) => {
    setCode(value || '');
  }, [setCode]);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmissionResult(null);
    setShowSubmissionResult(true);
    
    try {
      // Map frontend language to backend language format
      const backendLanguageMap = {
        'cpp': 'c++',
        'javascript': 'javascript', 
        'java': 'java'
      };
      
      const response = await axiosClient.post(`/submission/submit/${problem._id}`, {
        code: code,
        language: backendLanguageMap[selectedLanguage] || selectedLanguage
      });
      setSubmissionResult(response.data);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionResult({
        error: true,
        message: error.response?.data?.message || 'Submission failed'
      });
    }
  };

  const handleRun = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setTestResultsLoading(true);
    if (!showTestCasesWindow) {
      setShowTestCasesWindow(true);
    }
    setTestResults(null);
    
    try {
      // Map frontend language to backend language format
      const backendLanguageMap = {
        'cpp': 'c++',
        'javascript': 'javascript',
        'java': 'java'
      };
      
      const response = await axiosClient.post(`/submission/run/${problem._id}`, {
        code: code,
        language: backendLanguageMap[selectedLanguage] || selectedLanguage
      });
      setTestResults(response.data);
    } catch (error) {
      console.error('Run error:', error);
      setTestResults([]);
    } finally {
      setTestResultsLoading(false);
    }
  };

  const onClose = () => {
    setShowTestCasesWindow(false);
  };

  const handleRefreshCodeButton = () => {
    setCode(getStarterCode(problem.startCode, selectedLanguage));
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Top Header - Fixed Height */}
      <div className="h-[42.4px] flex items-center justify-between px-3 bg-base-200 border-b border-base-300 text-xs text-base-content flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="pr-2 flex items-center space-x-2 text-base-content">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span>Code</span>
          </div>
          <div className="relative">
            <select
              onChange={handleLanguageChange}
              value={
                selectedLanguage === 'cpp' ? 'C++' : 
                selectedLanguage === 'javascript' ? 'JavaScript' :
                selectedLanguage === 'java' ? 'Java' : 'C++'
              }
              className="py-1 pl-2 pr-8 rounded text-xs focus:outline-none bg-transparent hover:text-base-content text-base-content/70 cursor-pointer border border-base-300"
              aria-label="Select programming language"
            >
              {availableLanguages.map(lang => (
                <option key={lang} value={lang} className="bg-base-100 text-base-content">
                  {lang}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-base-content/60">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {testResultsLoading ? (
            <button className="px-3 py-1 text-xs bg-success/60 text-white rounded cursor-not-allowed" disabled>
              Running
            </button>
          ) : (
            <button onClick={handleRun} className="px-3 py-1 text-xs bg-success text-white rounded hover:bg-success/90 transition-colors">
              Run
            </button>
          )}
          
          {showSubmissionResult && !submissionResult ? (
            <button className="px-3 py-1 text-xs bg-primary/60 text-white rounded cursor-not-allowed" disabled>
              Submitting
            </button>
          ) : (
            <button onClick={handleSubmit} className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90 transition-colors">
              Submit
            </button>
          )}
          
          <div className="relative">
            <button 
              onClick={() => setIsEditorSettingOpen(!isEditorSettingOpen)} 
              className="p-1 rounded hover:bg-base-300 text-base-content/70 hover:text-base-content ml-2" 
              aria-label="Editor settings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            {isEditorSettingOpen && (
              <SettingsPopover 
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
          
          <button 
            onClick={handleRefreshCodeButton} 
            className="p-1 rounded hover:bg-base-300 text-base-content/70 hover:text-base-content" 
            aria-label="Reset to default code"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
        
      {/* Code Editor */}
      <div className="flex flex-col flex-1 relative overflow-hidden">
        <div className="h-full">
          <Editor
            height="100%"
            language={getMonacoLanguage(selectedLanguage)}
            value={code}
            onChange={handleCodeChange}
            theme={editorTheme}
            options={{
              fontSize: editorFontSize,
              minimap: { enabled: minimap },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: editorTabSize,
              insertSpaces: true,
              wordWrap: 'on',
              lineNumbers: 'on',
              glyphMargin: false,
              folding: true,
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 3,
              renderLineHighlight: 'line',
              selectOnLineNumbers: true,
              roundedSelection: false,
              readOnly: false,
              cursorStyle: 'line',
              mouseWheelZoom: true,
            }}
          />
        </div>
        
        {/* Test Cases Window */}
        {showTestCasesWindow && (
          <div className="h-[50%] w-full bottom-0 absolute bg-base-100 border-t border-base-300">
            <TestCasesWindow 
              testCases={problem.visibleTestCases}
              onClose={onClose}
              testResults={testResults}
              testResultsLoading={testResultsLoading}
            />
          </div>
        )}
      </div>

      {/* Authentication Notice */}
      {!isAuthenticated && (
        <div className="h-10 p-2.5 bg-base-200 text-sm text-center border-t border-base-300 text-base-content flex-shrink-0">
          You need to{' '}
          <span onClick={() => navigate("/login")} className="text-primary font-semibold hover:underline cursor-pointer mx-1">
            Login
          </span>
          /{' '}
          <span onClick={() => navigate("/signup")} className="text-primary font-semibold hover:underline cursor-pointer ml-1">
            Signup
          </span>
          {' '}to run or submit
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className="h-10 flex items-center justify-end px-10 text-xs bg-base-200 border-t border-base-300 text-base-content/70 flex-shrink-0">
        <div className="flex gap-4 text-sm">
          <button 
            onClick={() => setShowTestCasesWindow(!showTestCasesWindow)} 
            className="cursor-pointer underline hover:text-success"
          >
            Test Cases
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;