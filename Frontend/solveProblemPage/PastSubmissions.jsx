import { useEffect, useState } from "react";
import axiosClient from "../../config/axios";
import SubmissionDetailsModal from "./SubmissionDetailsModal"
import { 
    CheckCircleIcon, 
    XCircleIcon, 
    ClockIcon,
} from "../Icons/SolveProblemPageIcons";
import { getProcessedLanguage, getProcessedStatus, getTimeStamp } from "../../utils/heplerFunctions";

const getStatusVisuals = (status) => {
    switch (status) {
      case 'Accepted':
        return { icon: <CheckCircleIcon className="w-5 h-5 text-green-500 dark:text-green-400" />, color: 'text-green-600 dark:text-green-400' };
      case 'Wrong Answer':
      case 'Runtime Error':
      case 'Compilation Error':
        return { icon: <XCircleIcon className="w-5 h-5 text-red-500 dark:text-red-400" />, color: 'text-red-600 dark:text-red-400' };
      case 'Time Limit Exceeded':
        return { icon: <ClockIcon className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />, color: 'text-yellow-600 dark:text-yellow-400' };
      case 'Pending':
      default:
        return { icon: <ClockIcon className="w-5 h-5 text-gray-500 dark:text-slate-400" />, color: 'text-gray-600 dark:text-slate-400' };
    }
}

function PastSubmissions({ problem }) {
    const [submissions, setSubmissions] = useState(null);
    const [submissionToView, setSubmissionToView] = useState(null);
    const [isSubmissionDetailsModalOpen, setIsSubmissionDetailsModalOpen] = useState(false);

    useEffect(() => {

        const getPastSubmissions = async () => {
            try {
                const { data: submissions } = await axiosClient.get(`/submissions/${problem._id}`);
                const modifiedSubmissions = submissions.map((sub) => {
                      const processedStatus = getProcessedStatus(sub.status);

                      const listedSubmission = {
                          id: sub._id,
                          status: processedStatus === 'Pending' ? 'Runtime Error' : processedStatus,
                          problemTitle: problem.title,
                          language: getProcessedLanguage(sub.language),
                          runtime: sub.runtime ? sub.runtime + " ms" : "N/A",
                          memory: sub.memory ? sub.memory + " KB" : "N/A",
                          timestamp: getTimeStamp(sub.createdAt),
                          code: sub.submittedCode || "Code not available for this submission.",
                          passedCases: sub.passedTestCases,
                          totalCases: sub.totalTestCases,
                          errorMessage: sub.errorMessage,
                          notes: sub.notes || '',
                          earnedPoints: sub.earnedPoints || 0,
                          closingPoints: sub.closingPoints || 0
                      };

                      return listedSubmission;
                });

                setSubmissions(modifiedSubmissions);
            } catch (error) {
              console.log(error);
              setSubmissions([]); // Set to empty array on error
            }
        };
        getPastSubmissions();
    }, [problem._id]);

    const openSubmissionDetailsModal = (submission) => {
        setSubmissionToView(submission);
        setIsSubmissionDetailsModalOpen(true);
    };

    const closeSubmissionDetailsModal = () => {
        setIsSubmissionDetailsModalOpen(false);
        setSubmissionToView(null);
    };

    if (submissions === null) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
                <p className="text-gray-600 dark:text-slate-400">
                    Loading submissions...
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4 pb-5">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
                    My Submissions
                </h2>
                {submissions?.length > 0 ? (
                    <ul className="space-y-3">
                        {submissions.slice().reverse().map((sub) => {
                            const { icon, color: statusColor } = getStatusVisuals(sub.status);
                            return (
                                <li key={sub.id} className="p-4 rounded-lg shadow-md border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 transition-all">
                                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                      <div className="flex-1 mb-3 sm:mb-0">
                                         <div className="flex items-center mb-1.5">
                                             <span className="mr-2">{icon}</span>
                                             <span className={`font-semibold text-md ${statusColor}`}>{sub.status}</span>
                                         </div>
                                         <p className="text-xs text-gray-500 dark:text-slate-400">
                                             Language: <span className="font-medium text-gray-700 dark:text-slate-200">{sub.language}</span>
                                         </p>
                                      </div>
                                      <div className="flex-1 text-sm mb-3 sm:mb-0 sm:px-4 text-gray-600 dark:text-slate-400">
                                         <p>Runtime: <span className="font-medium text-gray-800 dark:text-slate-100">{sub.runtime}</span></p>
                                         <p>Memory: <span className="font-medium text-gray-800 dark:text-slate-100">{sub.memory}</span></p>
                                      </div>
                                      <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
                                          <p className="text-xs mb-2 text-gray-500 dark:text-slate-400">
                                             {sub.timestamp}
                                          </p>
                                            <button
                                              onClick={() => openSubmissionDetailsModal(sub)}
                                              className="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-slate-800">
                                              View Details
                                            </button>
                                      </div>
                                   </div>
                                </li>
                            )
                        })}
                    </ul>
                ) : (
                    <p className="text-gray-600 dark:text-slate-400 text-center py-10">
                      You have no submissions for this problem yet.
                    </p>
                )}

            </div>
            {submissionToView && (
                <SubmissionDetailsModal
                    isOpen={isSubmissionDetailsModalOpen}
                    onClose={closeSubmissionDetailsModal}
                    submission={submissionToView}
                />
            )}

        </>
    )
}

export default PastSubmissions;
