import { useState, useEffect } from 'react';
import { Globe, Plus } from 'lucide-react';
import axiosClient from '../../config/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { deepCopy } from "../../utils/heplerFunctions";

const createInitialCheckedState = (bookmarks, problemId) => {
  if (!bookmarks) return {};

  let checkedState = {};
  for (const sprint of bookmarks) {
    if (sprint.problems?.includes(problemId))
      checkedState[sprint.sprintName] = true;
  }
  return checkedState;
};

const BookmarkModal = ({
  problem,
  bookmarks,
  setBookmarks,
  isProblemBookmarked,
  setIsProblemBookmarked,
  isOpen,
  onClose,
}) => {
  const [saveOptions, setSaveOptions] = useState(() => bookmarks ? deepCopy(bookmarks) : [] );
  const [checkedState, setCheckedState] = useState(() =>
    createInitialCheckedState(bookmarks, problem._id)
  );
  const [isCreatingSprint, setIsCreatingSprint] = useState(false);
  const [newSprintName, setNewSprintName] = useState('');

  useEffect(() => {
    let isBookmarked = false;
    for (const key in checkedState) {
      if (checkedState[key]) {
        isBookmarked = true;
        break;
      }
    }
    if (isProblemBookmarked !== isBookmarked)
      setIsProblemBookmarked(isBookmarked);
  }, [checkedState]);

  const handleOnClose = () => {
    setSaveOptions(bookmarks ? deepCopy(bookmarks) : []);
    setCheckedState(createInitialCheckedState(bookmarks, problem._id));
    onClose();
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleOnClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCheckboxChange = (optionId) => {
    const isAdding = !checkedState[optionId];

    const sprint = saveOptions.find((sp) => sp.sprintName === optionId);

    if (sprint) {
      if (isAdding) {
        sprint.problems = sprint.problems || [];
        const probExists = sprint.problems.find(
          (prob) => prob == problem._id
        );
        if (!probExists) sprint.problems.push(problem._id);
      } else {
        if (sprint.problems) {
          sprint.problems = sprint.problems.filter(
            (prob) => prob !== problem._id
          );
        }
      }
    }

    setSaveOptions(saveOptions);
    setCheckedState((prevState) => ({
      ...prevState,
      [optionId]: isAdding,
    }));
  };

  const handleCreateSprint = () => {
    if (newSprintName.trim() === '') return;
    const newSprint = {
      sprintName: newSprintName.trim(),
      problems: [problem._id],
    };
    setSaveOptions((prev) => [...prev, newSprint]);
    setCheckedState((prev) => ({
      ...prev,
      [newSprint.sprintName]: true,
    }));
    setNewSprintName('');
    setIsCreatingSprint(false);
  };

  const handleSave = async () => {
    try {
      await axiosClient.put(`/problems/${problem._id}/update-bookmarks`, {
        bookmarks: saveOptions,
      });
      setBookmarks(saveOptions);
      toast.success('Bookmarks Updated');
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleOnClose}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-sm m-4 transform transition-all flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Save to
                </h2>
                <button
                  onClick={handleOnClose}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors text-sm font-medium"
                  aria-label="Close"
                >
                  Close
                </button>
              </div>

              <div className="space-y-4">
                {saveOptions.map((option) => (
                  <label
                    key={option.sprintName}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={option.sprintName}
                        checked={!!checkedState[option.sprintName]}
                        onChange={() => handleCheckboxChange(option.sprintName)}
                        className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-slate-700 text-slate-800 dark:text-orange-500 focus:ring-slate-600 dark:focus:ring-orange-600 dark:focus:ring-offset-slate-800 cursor-pointer"
                      />
                      <span className="ml-3 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        {option.sprintName}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                {!isCreatingSprint ? (
                  <button
                    onClick={() => setIsCreatingSprint(true)}
                    className="flex items-center text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 font-medium transition-colors w-full text-left"
                  >
                    <Plus />
                    <span className="ml-2">Create new sprint</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newSprintName}
                      onChange={(e) => setNewSprintName(e.target.value)}
                      placeholder="New sprint name"
                      className="block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900 dark:text-white"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateSprint()}
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setIsCreatingSprint(false);
                          setNewSprintName('');
                        }}
                        className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-600 hover:bg-gray-200 dark:hover:bg-slate-500 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateSprint}
                        className="px-4 py-1.5 rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-500 transition-colors disabled:opacity-50"
                        disabled={!newSprintName.trim()}
                      >
                        Create
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-900 px-6 py-4 rounded-b-lg flex justify-end mt-auto">
              <button
                onClick={handleSave}
                className="bg-orange-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-orange-800 focus:ring-orange-500 transition-all duration-200"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookmarkModal;
