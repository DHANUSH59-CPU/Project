import React, { useEffect, useRef, useState } from 'react';
import { 
    XMarkIcon, 
    CheckCircleIcon, 
    XCircleIcon as ErrorXCircleIcon, 
    ClockIcon, 
    CpuChipIcon, 
    ClipboardCheckIcon,
    CodeBracketIcon,
    CopyIcon as DuplicateCopyIcon,
} from '../Icons/SolveProblemPageIcons';
import { Star } from 'lucide-react';
import axiosClient from '../../config/axios';
import toast from 'react-hot-toast';

const SubmissionDetailsModal = ({ isOpen, onClose, submission }) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedError, setCopiedError] = useState(false);
  const [notesText, setNotesText] = useState(submission.notes);
  const [updateButtonText, setUpdateButtonText] = useState('Update Notes');

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();
      setCopiedCode(false);
      setCopiedError(false);
    } else {
      document.body.style.overflow = 'auto';
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!submission) return null;

  const { 
    status, 
    problemTitle, 
    language, 
    timestamp, 
    runtime, 
    memory, 
    passedCases, 
    totalCases, 
    code, 
    errorMessage,
    earnedPoints,
    closingPoints 
  } = submission;

  const getStatusVisuals = () => {
    switch (status) {
      case 'Accepted':
        return { icon: <CheckCircleIcon className="w-6 h-6 mr-2 text-green-500 dark:text-green-400" />, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20', borderColor: 'border-green-200 dark:border-green-500' };
      case 'Wrong Answer':
      case 'Runtime Error':
      case 'Compilation Error':
        return { icon: <ErrorXCircleIcon className="w-6 h-6 mr-2 text-red-500 dark:text-red-400" />, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/20', borderColor: 'border-red-200 dark:border-red-500' };
      case 'Time Limit Exceeded':
        return { icon: <ClockIcon className="w-6 h-6 mr-2 text-yellow-500 dark:text-yellow-400" />, color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', borderColor: 'border-yellow-200 dark:border-yellow-500' };
      default:
        return { icon: <ClockIcon className="w-6 h-6 mr-2 text-gray-500 dark:text-slate-400" />, color: 'text-gray-600 dark:text-slate-400', bgColor: 'bg-gray-50 dark:bg-slate-900/20', borderColor: 'border-gray-200 dark:border-slate-500' };
    }
  };
  const visuals = getStatusVisuals();

  const handleCopy = (textToCopy, type) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      if (type === 'code') setCopiedCode(true);
      if (type === 'error') setCopiedError(true);
      setTimeout(() => {
        if (type === 'code') setCopiedCode(false);
        if (type === 'error') setCopiedError(false);
      }, 2000);
    }).catch(err => console.error("Failed to copy:", err)); 
  };

    const handleNotesChange = (event) => {
    setNotesText(event.target.value);
  };

  const handleUpdateNotes = async () => {
    setUpdateButtonText('Updating...');
    try {
      await axiosClient.post(`/submissions/${submission.id}/add-notes`, { submissionNotes: notesText });
      setUpdateButtonText('Updated!');
      toast.success("Notes Updated Successfully")
      setTimeout(() => {
        setUpdateButtonText('Update Notes');
      }, 1500);
    } catch (error) {
      console.log(error);
      toast.error("Some error occured, Please try again")
      setUpdateButtonText('Update Notes');
    }
  };
  
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out
                 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                 bg-black/40 dark:bg-black/60`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="submission-details-title"
    >
      <div
        ref={modalRef}
        className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out
                   bg-white dark:bg-slate-800
                   ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center">
            {visuals.icon}
            <h2 id="submission-details-title" className={`text-xl font-semibold ${visuals.color}`}>
              {status}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close submission details"
            className="p-1.5 rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-700 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow p-6 overflow-y-auto space-y-6">
          <p className="text-gray-600 dark:text-slate-300 text-sm">
            Submission for: <strong className="font-semibold text-gray-800 dark:text-slate-100">{problemTitle}</strong>
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-md flex items-center space-x-3 bg-gray-100 dark:bg-slate-700/60">
              <ClockIcon className={`w-6 h-6 flex-shrink-0 ${visuals.color}`} />
              <div>
                <span className="text-xs text-gray-500 dark:text-slate-400">
                   Timestamp
                 </span>
                <p className="font-semibold text-gray-800 dark:text-slate-100">{timestamp}</p>
              </div>
            </div>

            <div className="p-3 rounded-md flex items-center space-x-3 bg-gray-100 dark:bg-slate-700/60">
              <CodeBracketIcon className={`w-6 h-6 flex-shrink-0 ${visuals.color}`} />
              <div>
                <span className="text-xs text-gray-500 dark:text-slate-400">
                   Language
                 </span>
                <p className="font-semibold text-gray-800 dark:text-slate-100">{language}</p>
              </div>
            </div>

            <div className="p-3 rounded-md flex items-center space-x-3 bg-gray-100 dark:bg-slate-700/60">
              <ClipboardCheckIcon className={`w-6 h-6 flex-shrink-0 ${visuals.color}`} />
              <div>
                <span className="text-xs text-gray-500 dark:text-slate-400">
                   Test Cases
                 </span>
                <p className="font-semibold text-gray-800 dark:text-slate-100">
                   {passedCases !== undefined && totalCases !== undefined ? `${passedCases} / ${totalCases}` : 'N/A'}
                 </p>
               </div>
            </div>

            <div className="p-3 rounded-md flex items-center space-x-3 bg-gray-100 dark:bg-slate-700/60">
               <ClockIcon className={`w-6 h-6 flex-shrink-0 ${visuals.color} opacity-70`} />
              <div>
                <span className="text-xs text-gray-500 dark:text-slate-400">
                   Runtime
               </span>
               <p className="font-semibold text-gray-800 dark:text-slate-100">{runtime}</p>
              </div>
            </div>

            <div className="p-3 rounded-md flex items-center space-x-3 bg-gray-100 dark:bg-slate-700/60">
              <CpuChipIcon className={`w-6 h-6 flex-shrink-0 ${visuals.color}`} />
              <div>
                <span className="text-xs text-gray-500 dark:text-slate-400">
                   Memory
               </span>
               <p className="font-semibold text-gray-800 dark:text-slate-100">{memory}</p>
              </div>
            </div>

            <div className="p-3 rounded-md flex items-center space-x-3 bg-gray-100 dark:bg-slate-700/60">
              <Star className={`w-6 h-6 flex-shrink-0 text-yellow-400`} />
              <div>
                <span className="text-xs text-gray-500 dark:text-slate-400">
                  Points Earned
               </span>
               <p className="font-semibold text-gray-800 dark:text-slate-100">{earnedPoints}</p>
              </div>
            </div>

            <div className="p-3 rounded-md flex items-center space-x-3 bg-gray-100 dark:bg-slate-700/60">
              <Star className={`w-6 h-6 flex-shrink-0 text-yellow-400`} />
              <div>
                <span className="text-xs text-gray-500 dark:text-slate-400">
                  Closing Points
               </span>
               <p className="font-semibold text-gray-800 dark:text-slate-100">{closingPoints}</p>
              </div>
            </div>
          </div>

          {/* Submitted Code */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-slate-200">
              Submitted Code
            </h3>
            <div className="relative group p-4 border rounded-md bg-gray-50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-700 max-h-80 overflow-y-auto">
              <pre className="text-xs sm:text-sm whitespace-pre-wrap text-gray-700 dark:text-slate-200">
                <code>{code}</code>
              </pre>
              <button
                onClick={() => handleCopy(code, 'code')}
                aria-label={copiedCode ? "Code Copied" : "Copy code"}
                className="absolute top-2 right-2 p-1.5 rounded bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 transition-opacity group-hover:opacity-100"
              >
                {copiedCode ? <CheckCircleIcon className="w-4 h-4 text-green-500" /> : <DuplicateCopyIcon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${visuals.color}`}>
                {status === 'Compilation Error' ? 'Compiler Output' : 'Error Details'}
              </h3>
              <div className={`relative group p-4 border rounded-md ${visuals.bgColor} ${visuals.borderColor} max-h-60 overflow-y-auto`}>
                <pre className="text-xs sm:text-sm whitespace-pre-wrap text-red-700 dark:text-red-300">
                   {errorMessage}
                </pre>
                 <button
                    onClick={() => handleCopy(errorMessage, 'error')}
                    aria-label={copiedError ? "Error Copied" : "Copy error message"}
                    className="absolute top-2 right-2 p-1.5 rounded bg-red-100 dark:bg-red-800/50 hover:bg-red-200 dark:hover:bg-red-700 text-red-700 dark:text-red-200 transition-opacity group-hover:opacity-100"
                 >
                   {copiedError ? <CheckCircleIcon className="w-4 h-4 text-green-500" /> : <DuplicateCopyIcon className="w-4 h-4" />}
                 </button>
              </div>
            </div>
          )}

          {/* Notes Section */}
        <div 
          className={``}
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
              onClick={handleUpdateNotes}
              disabled={updateButtonText === "Updating..." || updateButtonText === "Updated!"}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                          bg-orange-500 text-white hover:bg-orange-600 disabled:bg-orange-300
                          dark:bg-orange-600 dark:text-white dark:hover:bg-orange-700 dark:disabled:bg-orange-400 
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 
                        focus:ring-offset-white dark:focus:ring-offset-slate-800 ${(updateButtonText === "Updating..." || updateButtonText === "Updated!") && "cursor-not-allowed"}`}
            >
              {updateButtonText}
            </button>
          </div>
        </div>

        </div>
      </div>
    </div>
  )
};

export default SubmissionDetailsModal;
