import { useState } from 'react';
import ChatInterface from './ChatInterface'; 
import ShareModal from './ShareModal';
import {
  TagIcon,
  CompanyIcon,
  HintIcon,
  ListBulletIcon as SimilarQuestionsListIcon,
  XMarkIcon
} from '../Icons/SolveProblemPageIcons'; 
import SubmissionResultView from './SubmissionResultView';
import PastSubmissions from './PastSubmissions';
import EditorialSection from './EditorialSection';
import { motion } from "framer-motion";
import CollapsibleSection from './CollapsibleSection';
import BookmarkModal from './BookmarkModal';
import parse from "html-react-parser";
import { Heart, Star, Share2, Bot, NotepadText, BookOpenCheck, Lightbulb, FileCheck, Bookmark, BookmarkCheck,  Tag, Lock, List, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router';

const tabsConfig = [
  { name: 'Description', icon: NotepadText },
  { name: 'Editorial', icon: BookOpenCheck },
  { name: 'Solutions', icon: Lightbulb },
  { name: 'Submissions', icon: FileCheck }, 
  { name: 'Ask AI', icon: Bot },
];

const getProblemPoints = (difficulty) => {
  switch (difficulty) {
    case "Basic": return 1;
    case "Easy": return 2;
    case "Medium": return 4;
    case "Hard": return 8;
    default: return 0;
  }
};

const getDifficultyClass = (difficulty) => {
  switch (difficulty) {
    case 'Basic':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300';
    case 'Easy':
      return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700/30 dark:text-yellow-300';
    case 'Hard':
      return 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300';
  }
};


const commonIconButtonClass = "p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100";

const LeftPanel = ({ problem, submissionResult, showSubmissionResult, setShowSubmissionResult, code, isProblemLiked, handleLikeButton, isProblemFavourite, handleFavouriteButton, bookmarks, setBookmarks, isProblemBookmarked, setIsProblemBookmarked }) => {
  const [activeTab, setActiveTab] = useState('Description');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [qaBlocks, setQaBlocks] = useState([]);

  const onClose = () => {
    setShowSubmissionResult(false);
  }

  const handleTabChange = (tabName) => {
    if(showSubmissionResult)
      setShowSubmissionResult(false);
    setActiveTab(tabName);
  }

  return (
    <div className={`h-full flex flex-col bg-white dark:bg-slate-800`}>
 
      {/* Tabs */}
      <div className="h-[42.4px] flex border-b border-gray-300 dark:border-slate-700 px-1.5 sm:px-3 bg-white dark:bg-slate-800 flex-shrink-0">
        {tabsConfig.map(tab => (
          <button
            key={tab.name}
            onClick={() => handleTabChange(tab.name) }
            className={`flex items-center space-x-1 sm:space-x-1.5 py-2.5 px-2 sm:px-4 text-sm focus:outline-none ${
              activeTab === tab.name 
                ? 'text-orange-500 border-b-2 border-orange-500 font-medium' 
                : 'text-gray-600 dark:text-slate-300 hover:text-gray-800 dark:hover:text-slate-100'
            }`}
            aria-pressed={activeTab === tab.name}
          >
            <tab.icon size={20}/>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      <div className="relative flex-grow overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto scroll-smooth">
            {/* --- THIS IS THE CORRECTED LINE --- */}
            <div className="flex min-h-full flex-col px-5 pt-5 space-y-5 text-gray-800 dark:text-slate-100 bg-white dark:bg-slate-800">
                {activeTab === 'Description' && (
                  <>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-end'>
                        <h1 className="text-2xl font-medium text-gray-800 dark:text-slate-50 mr-3">{problem.title}</h1>
                        <span onClick={() => { setIsBookmarkModalOpen(true) }} className='pb-[2.4px] cursor-pointer'>
                          {isProblemBookmarked?<BookmarkCheck color='#4CAF50' size={22}/>:<Bookmark size={22}/>}
                        </span>
                      </div>
                      <span className='font-light font-sans tracking-widest'>{`Points: +${getProblemPoints(problem.difficulty)}`}</span>
                    </div>
                    <div className="flex items-center pb-2 space-x-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getDifficultyClass(problem.difficulty)}`}>{`${problem.difficulty}`}</span>
                      <a href="#info"><button className="flex items-center text-xs px-2.5 py-1 rounded-full bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-300 hover:opacity-80"><TagIcon /> Topics</button></a>
                      <a href="#info"><button className="flex items-center text-xs px-2.5 py-1 rounded-full bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-300 hover:opacity-80"><CompanyIcon /> Companies</button></a>
                      <a href="#info"><button className="flex items-center text-xs px-2.5 py-1 rounded-full bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-300 hover:opacity-80"><HintIcon /> Hint</button></a>
                    </div>

                    <div className="problem-statement">
                      {parse(problem.description)}
                    </div>

                    <div className='mb-12'>        
                        {problem.examples?.map((testCases, index)=>{
                          return (
                            <div className="mt-4" key={`case${index+1}`}>
                              <p className='pl-2 mb-1.5'><strong>{`Example ${index+1}:`}</strong></p>
                              <div className="overflow-x-auto p-3 rounded-md text-sm bg-gray-50 text-gray-600 dark:bg-slate-900 dark:text-slate-400">
                                <code className="language-text">{`Input: ${testCases.input}`}</code>
                                <br />
                                <code className="language-text">{`Output: ${testCases.output}`}</code>
                                <br />
                                <code className="language-text">{`Explanation: ${testCases.explanation}`}</code>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                    <div className='mb-12 pl-2 '>
                        <p className='mb-1.5'><strong>Constraints:</strong></p>
                        <ul className='list-disc list-inside'>        
                        {problem.constraints?.map((constraint, index)=>  
                                <li key={`constraint${index+1}`}><code className="language-text">{constraint}</code></li>
                        )}
                        </ul>
                    </div>
                    <section id='info'>
                      <div className="mt-5 mb-6 space-y-0">
                        <CollapsibleSection title="Topics" icon={Tag}>
                          <div className="flex flex-wrap gap-2 p-2">
                            {problem.tags.map(topic => (
                              <span key={topic} className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-200">{topic}</span>
                            ))}
                          </div>
                        </CollapsibleSection>
                        <CollapsibleSection title="Companies" icon={Lock} titleColorClass="text-yellow-500 dark:text-yellow-400">
                          <div className="p-4 text-center">
                            <p>Unlock with Premium to see company tags.</p>
                            <NavLink 
                              to="/premium-plans"
                              className="mt-3 inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            >
                              <Sparkles className="h-5 w-5" /> 
                              Upgrade to Premium
                            </NavLink>
                            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                              <p>For now, here are some examples:</p>
                              <ul className="list-disc list-inside mt-1 inline-block text-left">
                                <li>Google</li>
                                <li>Facebook</li>
                                <li>Amazon</li>
                              </ul>
                            </div>
                          </div>
                        </CollapsibleSection>
                        {problem.hints?.map((hint, index) => 
                          <CollapsibleSection key={`Hint${index}`} title={`Hint ${index+1}`} icon={Lightbulb}>
                            <p className="p-2">{hint}</p>
                          </CollapsibleSection>
                        )}
                        <CollapsibleSection title="Similar Questions" icon={List}> 
                            <ul className="space-y-1 p-2">
                            {[{ title: 'Merge Intervals', id: '6887725d4cb34d9f69ce78f9' }, { title: 'Valid Parentheses', id: '688761cd43663e1a8cf61b51' }, { title: 'Maximum Subarray', id: '6887709a4cb34d9f69ce7895' }, { title: 'Word Search', id: '6887917f74233e0069f465ce' }].map(q => (
                              <li key={q.id}><NavLink to={`/problems/${q.id}`} className="hover:underline text-orange-500 hover:text-orange-400">{q.title}</NavLink></li>
                            ))}
                          </ul>
                        </CollapsibleSection>
                      </div>
                    </section>
                  </>
                )}
                {activeTab === 'Editorial' && <EditorialSection problem={problem}/>}
                {activeTab === 'Solutions' && <p className="text-gray-600 dark:text-slate-400 text-center py-10">Community solutions and discussions will be available here.</p>}
                {activeTab === 'Submissions' && <PastSubmissions problem={problem} />}
                {activeTab === 'Ask AI' && <ChatInterface problem={problem} userSolution={code} qaBlocks={qaBlocks} setQaBlocks={setQaBlocks} />}
            </div>
        </div>

        { showSubmissionResult && ( 
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-800 overflow-y-auto"
          >
          { submissionResult ? (
            <SubmissionResultView 
                submissionResult={submissionResult}
                onClose={onClose}
              />
            ) : (
            <div className={`h-full w-full flex flex-col items-center justify-center p-4 transition-all ease-out`}>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-offset-slate-800 absolute top-6 right-6`}
                aria-label="Close submission result"
              >
                <XMarkIcon className="w-7 h-7" />
              </button>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4" />
                <p className="text-lg font-semibold">Submitting your solution...</p>
                <p className="text-sm">Please wait a moment.</p>
            </div>
              )}
          </motion.div>
        )}
      </div>
      
      <div className="h-10 flex items-center space-x-3 px-3 border-t border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-slate-300 flex-shrink-0">
        <button onClick={handleLikeButton} className={`flex items-center space-x-1 p-1.5 rounded ${commonIconButtonClass}`} aria-label="Like problem">
          <Heart fill={isProblemLiked ? 'red' : 'none'} color={isProblemLiked ? 'red' : undefined} size={16} /> <span className="text-xs">{problem.likes || 0}</span>
        </button>
        <button onClick={handleFavouriteButton} className={`p-1.5 rounded ${commonIconButtonClass}`} aria-label="Add to favorites">
          <Star fill={isProblemFavourite ? 'orange' : 'none'} color={isProblemFavourite ? 'orange' : undefined} size={16} />
        </button>
        <div className="flex-grow"></div> 
        <button onClick={() => setIsShareModalOpen(true)} className={`p-1.5 rounded ${commonIconButtonClass}`} aria-label="Share problem">
          <Share2 size={16} />
        </button>
        <div className="text-xs flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>{3} Online
        </div>
      </div>
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        problem={problem}
      />
      <BookmarkModal 
        isOpen={isBookmarkModalOpen} 
        onClose={() => {setIsBookmarkModalOpen(false)}} 
        problem={problem} bookmarks={bookmarks} 
        setBookmarks={setBookmarks} 
        isProblemBookmarked={isProblemBookmarked} 
        setIsProblemBookmarked={setIsProblemBookmarked}
      />
    </div>
  );
};

export default LeftPanel;