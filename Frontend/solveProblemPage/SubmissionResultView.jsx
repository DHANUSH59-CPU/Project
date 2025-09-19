import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, CheckIcon, ClockIcon, CpuChipIcon, ClipboardCheckIcon, CopyIcon as DuplicateCopyIcon } from '../Icons/SolveProblemPageIcons'; // Renamed CopyIcon to avoid conflict
import AnalyseComplexityButton from '../buttons/AnalyseComplexitiesButton';
import { getMappedStatus }from '../../utils/heplerFunctions';
import { Hourglass, Database, Star } from 'lucide-react';
import axiosClient from '../../config/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const suggestedProblems = [
  { title: 'Merge Intervals', id: '6887725d4cb34d9f69ce78f9', difficulty: "Medium"}, 
  { title: 'Valid Parentheses', id: '688761cd43663e1a8cf61b51', difficulty: "Easy"},
  { title: 'Maximum Subarray', id: '6887709a4cb34d9f69ce7895', difficulty: "Medium"},
  { title: 'Word Search', id: '6887917f74233e0069f465ce', difficulty: "Hard"}
];



const SubmissionResultView = ({ submissionResult, onClose }) => {
  const [animatedPassedCases, setAnimatedPassedCases] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showStatusIcon, setShowStatusIcon] = useState(false);
  const requestRef = useRef(undefined);
  const [childrenVisible, setChildrenVisible] = useState(false);

  const [notesText, setNotesText] = useState('');
  const [saveButtonText, setSaveButtonText] = useState('Save Notes');
  const [copiedError, setCopiedError] = useState(false);
  const [showingComplexities, setShowingComplexities] = useState(false);
  const [complexities, setComplexities] = useState(null);
  const navigate = useNavigate();

  const { status, passedTestCases: passedCases, totalTestCases: totalCases, runtime, memory, _id: submissionId, errorMessage, earnedPoints, closingPoints } = submissionResult;
  const isSuccess = status === 'accepted';
  const isErrorWithDetails = (status === 'runtime-error' || status === 'compilation-error' || status === 'tle') && errorMessage;

  const circleRadius = 60; 
  const circleStrokeWidth = 10;
  const normalizedRadius = circleRadius - circleStrokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return `bg-green-100 text-green-700 dark:bg-green-700/40 dark:text-green-300`;
      case 'Medium':
        return `bg-yellow-100 text-yellow-700 dark:bg-yellow-700/40 dark:text-yellow-300`;
      case 'Hard':
        return `bg-red-100 text-red-700 dark:bg-red-700/40 dark:text-red-300`;
      default:
        return `bg-gray-100 text-gray-700 dark:bg-slate-600 dark:text-slate-300`;
    }
  };

  useEffect(() => {
    setAnimatedPassedCases(0); 
    setAnimationComplete(false);
    setShowStatusIcon(false);
    setChildrenVisible(false);
    setCopiedError(false);
    
    const notesKey = `submission_notes_${submissionId}`;
    const savedNotes = localStorage.getItem(notesKey);
    setNotesText(savedNotes || '');
    setSaveButtonText('Save Notes');

    let startTimestamp  = null;
    const progressAnimationDuration = 1500; 
    let statusIconTimerId;

    const animateProgress = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / progressAnimationDuration, 1);
      
      setAnimatedPassedCases(Math.floor(progress * (passedCases||0)));

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animateProgress);
      } else {
        setAnimatedPassedCases((passedCases||0)); 
        setAnimationComplete(true);
        statusIconTimerId = window.setTimeout(() => {
          setShowStatusIcon(true);
        }, 100); 
      }
    };
    requestRef.current = requestAnimationFrame(animateProgress);

    const childrenAnimationTimer = setTimeout(() => {
      setChildrenVisible(true);
    }, 50);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      clearTimeout(childrenAnimationTimer);
      clearTimeout(statusIconTimerId);
    };
  }, [submissionId, passedCases]);


  const handleNotesChange = (event) => {
    setNotesText(event.target.value);
  };

  const handleSaveNotes = async () => {
    setSaveButtonText('Saving...');
    try {
      await axiosClient.post(`/submissions/${submissionResult._id}/add-notes`, { submissionNotes: notesText });
      setSaveButtonText('Saved!');
      toast.success("Notes Saved Successfully")
      setTimeout(() => {
        setSaveButtonText('Save Notes');
      }, 1500);
    } catch (error) {
      console.log(error);
      toast.error("Some error occured, Please try again")
      setSaveButtonText('Save Notes');
    }
  };

  const handleCopyError = () => {
    if (errorMessage) {
      navigator.clipboard.writeText(errorMessage).then(() => {
        setCopiedError(true);
        setTimeout(() => setCopiedError(false), 2000);
      }).catch(err => console.error("Failed to copy error: ", err));
    }
  };

  const handleFindComplexitiesButton = async () => {
    if(complexities) return;
    
    setShowingComplexities(true);
    try {

      const {data: complexities} = await axiosClient.post("/ai/complexities", {userCode: submissionResult.submittedCode});
      setComplexities(complexities);
    } catch (error) {
      console.log(error);
    } 
  }

  const strokeDashoffset = circumference - (animatedPassedCases / totalCases) * circumference;

  const statusColorClass = isSuccess ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';
  const circleStrokeClass = isSuccess ? 'stroke-green-500 dark:stroke-green-400' : 'stroke-red-500 dark:stroke-red-400';
  const detailIconColorClass = isSuccess ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500';

  const detailCardBaseClass = `flex justify-center items-center w-50 h-20 rounded-lg shadow-sm transition-all duration-300 ease-out bg-gray-100 dark:bg-slate-700/60`;
  const childHiddenClass = 'opacity-0 translate-y-3';
  const childVisibleClass = 'opacity-100 translate-y-0';

  const statusIconBaseClass = `w-20 h-20 sm:w-24 sm:h-24 ${statusColorClass} transition-all duration-300 ease-out`;
  const statusIconHiddenClass = 'opacity-0 scale-75';
  const statusIconVisibleClass = 'opacity-100 scale-100';


  return (
    <div 
      className={`w-full flex flex-col flex-grow p-6`}
      role="alertdialog"
      aria-labelledby="submission-result-title"
      aria-describedby="submission-result-description"
    >
      {/* Top: Title and Close Button */}
      <div className="flex justify-between items-center mb-3 flex-shrink-0">
        <h2 
          id="submission-result-title" 
          className={`text-3xl font-bold ${statusColorClass} 
                     transition-all duration-500 ease-out ${childrenVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}
          style={{ transitionDelay: childrenVisible ? '100ms' : '0ms' }}
        >
          {getMappedStatus(status)}
        </h2>
        <button
          onClick={onClose}
          className={`p-1.5 rounded-full 
                    text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 
                      dark:focus:ring-offset-slate-800
                      transition-opacity duration-300 ${childrenVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: childrenVisible ? '100ms' : '0ms' }}
          aria-label="Close submission result"
        >
          <XMarkIcon className="w-7 h-7" />
        </button>
      </div>

      {/* Middle: Circular Progress */}
      <div 
        className={`flex-grow flex flex-col items-center justify-center py-6 
                   transition-all duration-500 ease-out ${childrenVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        style={{ transitionDelay: childrenVisible ? '250ms' : '0ms' }}
      >
        <div className="relative w-30 h-30 sm:w-40 sm:h-40"> {/* Progress Circle Container */}
          <svg className="w-full h-full" viewBox={`0 0 ${2 * circleRadius} ${2 * circleRadius}`}>
            <circle
              className='stroke-gray-200 dark:stroke-slate-700'
              strokeWidth={circleStrokeWidth}
              fill="transparent"
              r={normalizedRadius}
              cx={circleRadius}
              cy={circleRadius}
            />
            <circle
              className={`${circleStrokeClass} transition-all duration-300 ease-linear`}
              strokeWidth={circleStrokeWidth}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset, transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              strokeLinecap="round"
              fill="transparent"
              r={normalizedRadius}
              cx={circleRadius}
              cy={circleRadius}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {showStatusIcon ? (
                isSuccess ? (
                <CheckIcon className={`${statusIconBaseClass} ${showStatusIcon ? statusIconVisibleClass : statusIconHiddenClass}`} strokeWidth={1.5} />
                ) : (
                <XMarkIcon className={`${statusIconBaseClass} ${showStatusIcon ? statusIconVisibleClass : statusIconHiddenClass}`} strokeWidth={1.5} />
                )
            ) : (
              <div className="text-center transition-opacity duration-300 opacity-100">
                <span className={`block text-3xl sm:text-4xl font-semibold text-gray-700 dark:text-slate-200`}>
                  {animatedPassedCases}
                </span>
                <span className={`block text-sm text-gray-500 dark:text-slate-400`}>
                  / {totalCases}
                </span>
              </div>
            )}
          </div>
        </div>
        {isSuccess && <span onClick={handleFindComplexitiesButton} className='absolute right-0 top-0'><AnalyseComplexityButton /></span>}
      </div>

      {showingComplexities && (
        complexities ? (
        <div className="flex flex-wrap justify-around gap-4 text-sm mb-6">
          <div 
            className={`flex justify-center items-center w-80 h-20 rounded-lg shadow-sm transition-all duration-300 ease-out bg-gray-100 dark:bg-slate-700/60`}
            style={{ transitionDelay: childrenVisible ? '400ms' : '0ms' }}
          >
            <Hourglass className={`w-7 h-7 mr-4 flex-shrink-0 ${detailIconColorClass}`} />
            <div className='flex flex-col gap-1'>
              <span className="block text-sm text-gray-500 dark:text-slate-400">Time Complexity</span>
              <strong className="font-medium text-gray-800 dark:text-slate-100">{complexities.time_complexity}</strong>
            </div>
          </div>
          <div 
            className={`flex justify-center items-center w-80 h-20 rounded-lg shadow-sm transition-all duration-300 ease-out bg-gray-100 dark:bg-slate-700/60`}
            style={{ transitionDelay: childrenVisible ? '500ms' : '0ms' }}
          >
            <Database className={`w-7 h-7 mr-4 flex-shrink-0 ${detailIconColorClass}`} />
            <div className='flex flex-col gap-1'>
              <span className="block text-xs  text-gray-500 dark:text-slate-400">Space Complexity</span>
              <strong className="font-medium text-gray-800 dark:text-slate-100">{complexities.space_complexity}</strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap justify-around gap-4 text-sm mb-6">
          {/* Time Complexity Card */}
          <div 
            className={`flex justify-center items-center w-80 h-20 rounded-lg shadow-sm bg-gray-100 dark:bg-slate-700/60 relative overflow-hidden animate-pulse`}
            style={{ transitionDelay: childrenVisible ? '400ms' : '0ms' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60 blur-sm" />
            <Hourglass className={`w-7 h-7 mr-4 flex-shrink-0 z-10 ${detailIconColorClass}`} />
            <div className="flex flex-col gap-1 z-10">
              <span className="block text-sm text-gray-500 dark:text-slate-400">Time Complexity</span>
              <strong className="font-medium text-gray-800 dark:text-slate-100"></strong>
            </div>
          </div>

          {/* Space Complexity Card */}
          <div 
            className={`flex justify-center items-center w-80 h-20 rounded-lg shadow-sm bg-gray-100 dark:bg-slate-700/60 relative overflow-hidden animate-pulse`}
            style={{ transitionDelay: childrenVisible ? '500ms' : '0ms' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60 blur-sm" />
            <Database className={`w-7 h-7 mr-4 flex-shrink-0 z-10 ${detailIconColorClass}`} />
            <div className="flex flex-col gap-1 z-10">
              <span className="block text-xs text-gray-500 dark:text-slate-400">Space Complexity</span>
              <strong className="font-medium text-gray-800 dark:text-slate-100"></strong>
            </div>
          </div>
        </div>
      )
      )}
        
      {/* Error Details Section - NEW */}
      {isErrorWithDetails && (
        <div 
          className={`mb-6 p-4 rounded-lg shadow-sm relative group
                     bg-red-50 border-red-20 dark:bg-red-900/30 dark:border-red-700/50 border 
                     transition-all duration-500 ease-out ${childrenVisible ? childVisibleClass : childHiddenClass}`}
          style={{ transitionDelay: childrenVisible ? '350ms' : '0ms' }}
          role="alert"
        >
          <h3 className={`text-lg font-semibold mb-2 ${statusColorClass}`}>
            {status === 'Runtime Error' ? 'Runtime Error Details' : 'Compilation Error Output'}
          </h3>
          <pre 
            className={`p-3 rounded-md text-xs sm:text-sm overflow-x-auto max-h-60
                       bg-gray-100 text-red-700 dark:bg-slate-900 dark:text-red-300 
                       whitespace-pre-wrap`}
          >
            {errorMessage}
          </pre>
          <button
            onClick={handleCopyError}
            className={`absolute top-3 right-3 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity
                      bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200`}
            aria-label={copiedError ? "Error Copied" : "Copy error"}
          >
            {copiedError ? <CheckIcon className="w-4 h-4 text-green-500" /> : <DuplicateCopyIcon className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Bottom: Details, Notes & Solve Next */}
      <div id="submission-result-description" className={`mt-auto pt-6 border-t flex-shrink-0 border-gray-200 dark:border-slate-700`}>
        {/* Details Grid */}
        <div className="flex flex-wrap justify-around gap-4 text-sm mb-6">
          <div 
            className={`${detailCardBaseClass} ${childrenVisible ? childVisibleClass : childHiddenClass}`}
            style={{ transitionDelay: childrenVisible ? '400ms' : '0ms' }}
          >
            <ClockIcon className={`w-7 h-7 mr-4 flex-shrink-0 ${detailIconColorClass}`} />
            <div className='flex flex-col gap-1'>
              <span className="block text-sm text-gray-500 dark:text-slate-400">Runtime</span>
              <strong className="font-medium text-gray-800 dark:text-slate-100">{runtime?`${runtime} ms` : "N/A"}</strong>
            </div>
          </div>
          <div 
            className={`${detailCardBaseClass} ${childrenVisible ? childVisibleClass : childHiddenClass}`}
            style={{ transitionDelay: childrenVisible ? '500ms' : '0ms' }}
          >
            <CpuChipIcon className={`w-7 h-7 mr-4 flex-shrink-0 ${detailIconColorClass}`} />
            <div className='flex flex-col gap-1'>
              <span className="block text-xs  text-gray-500 dark:text-slate-400">Memory</span>
              <strong className="font-medium text-gray-800 dark:text-slate-100">{memory? `${memory} KB` : "N/A"}</strong>
            </div>
          </div>
          <div 
            className={`${detailCardBaseClass} ${childrenVisible ? childVisibleClass : childHiddenClass}`}
            style={{ transitionDelay: childrenVisible ? '600ms' : '0ms' }}
          >
            <ClipboardCheckIcon className={`w-7 h-7 mr-4 flex-shrink-0 ${detailIconColorClass}`} />
            <div className='flex flex-col gap-1'>
              <span className="block text-xs text-gray-500 dark:text-slate-400">Cases Passed</span>
              <strong className="font-medium text-gray-800 dark:text-slate-100">{passedCases || 0} / {totalCases}</strong>
            </div>
          </div>
          <div 
            className={`${detailCardBaseClass} ${childrenVisible ? childVisibleClass : childHiddenClass}`}
            style={{ transitionDelay: childrenVisible ? '600ms' : '0ms' }}
          >
            <Star className={`w-7 h-7 mr-4 flex-shrink-0 text-yellow-400`} />
            <div className='flex flex-col gap-1'>
              <span className="block text-xs text-gray-500 dark:text-slate-400">Points Earned</span>
              <strong className="font-medium text-gray-800 dark:text-slate-100">{earnedPoints || 0}</strong>
            </div>
          </div>
          <div 
            className={`${detailCardBaseClass} ${childrenVisible ? childVisibleClass : childHiddenClass}`}
            style={{ transitionDelay: childrenVisible ? '600ms' : '0ms' }}
          >
            <Star className={`w-7 h-7 mr-4 flex-shrink-0 text-yellow-400`} />
            <div className='flex flex-col gap-1'>
              <span className="block text-xs text-gray-500 dark:text-slate-400">Closing Points</span>
              <strong className="font-medium text-gray-800 dark:text-slate-100">{closingPoints || 0}</strong>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div 
          className={`mb-8 transition-all duration-500 ease-out ${childrenVisible ? childVisibleClass : childHiddenClass}`}
          style={{ transitionDelay: childrenVisible ? '700ms' : '0ms' }}
        >
          <h3 className={`text-lg font-semibold mb-3 text-gray-700 dark:text-slate-200`}>
            My Notes for this Submission
          </h3>
          <textarea
            value={notesText}
            onChange={handleNotesChange}
            placeholder="Add your personal notes or observations about this submission..."
            className={`w-full p-3 border rounded-md text-sm resize-none shadow-sm
                      bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500
                      dark:bg-slate-900/70 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:ring-1 dark:focus:ring-orange-500 dark:focus:border-orange-500`}
            rows={4}
            aria-label="Submission notes"
          />
          <div className="mt-3 text-right">
            <button
              onClick={handleSaveNotes}
              disabled={saveButtonText === "Saving..." || saveButtonText === "Saved!"}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                          bg-orange-500 text-white hover:bg-orange-600 disabled:bg-orange-300
                          dark:bg-orange-600 dark:text-white dark:hover:bg-orange-700 dark:disabled:bg-orange-400 
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 
                        focus:ring-offset-white dark:focus:ring-offset-slate-800 ${(saveButtonText === "Saving..." || saveButtonText === "Saved!") && "cursor-not-allowed"}`}
            >
              {saveButtonText}
            </button>
          </div>
        </div>

        {/* Solve Next Section */}
        <div
          className={`transition-all duration-500 ease-out ${childrenVisible ? childVisibleClass : childHiddenClass}`}
          style={{ transitionDelay: childrenVisible ? '800ms' : '0ms' }}
        >
          <h3 className={`text-lg font-semibold mb-3 text-gray-700 dark:text-slate-200`}>
            Recommended Next Problems
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestedProblems.map((problem) => (
              <button
                key={problem.id}
                onClick={() => navigate(`/problems/${problem.id}`)}
                className={`p-3 rounded-lg text-left w-full
                            transition-all duration-150 ease-in-out bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:shadow-md
                            dark:bg-slate-700/50 dark:hover:bg-slate-700 dark:border-slate-600 dark:hover:shadow-lg dark:hover:shadow-slate-900/50
                            focus:outline-none focus:ring-2 focus:ring-orange-500 
                           focus:ring-offset-white' dark:focus:ring-offset-slate-800`}
                aria-label={`Solve problem: ${problem.title}`}
              >
                <p className={`text-sm font-medium mb-1 text-gray-800 dark:text-slate-100`}>
                  {problem.title}
                </p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getDifficultyClass(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SubmissionResultView;