import { useState } from 'react';

const BookmarkModal = ({ 
  isOpen, 
  onClose, 
  problem, 
  bookmarks = [], 
  setBookmarks, 
  isProblemBookmarked, 
  setIsProblemBookmarked 
}) => {
  const [newBookmarkName, setNewBookmarkName] = useState('');
  const [selectedBookmark, setSelectedBookmark] = useState('');

  if (!isOpen) return null;

  const handleCreateBookmark = () => {
    if (!newBookmarkName.trim()) return;

    const newBookmark = {
      id: Date.now().toString(),
      name: newBookmarkName.trim(),
      problems: [problem._id]
    };

    setBookmarks([...bookmarks, newBookmark]);
    setIsProblemBookmarked(true);
    setNewBookmarkName('');
    onClose();
  };

  const handleAddToExistingBookmark = () => {
    if (!selectedBookmark) return;

    const updatedBookmarks = bookmarks.map(bookmark => {
      if (bookmark.id === selectedBookmark) {
        return {
          ...bookmark,
          problems: [...bookmark.problems, problem._id]
        };
      }
      return bookmark;
    });

    setBookmarks(updatedBookmarks);
    setIsProblemBookmarked(true);
    setSelectedBookmark('');
    onClose();
  };

  const handleRemoveFromBookmarks = () => {
    const updatedBookmarks = bookmarks.map(bookmark => ({
      ...bookmark,
      problems: bookmark.problems.filter(id => id !== problem._id)
    })).filter(bookmark => bookmark.problems.length > 0);

    setBookmarks(updatedBookmarks);
    setIsProblemBookmarked(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-base-content">
            {isProblemBookmarked ? 'Manage Bookmarks' : 'Add to Bookmarks'}
          </h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Problem Info */}
        <div className="mb-6 p-3 bg-base-200 rounded-lg">
          <h4 className="font-medium text-base-content">{problem?.title}</h4>
          <p className="text-sm text-base-content/60 mt-1">
            Difficulty: <span className="capitalize">{problem?.difficulty}</span>
          </p>
        </div>

        {isProblemBookmarked ? (
          /* Remove from bookmarks */
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-success font-medium">Problem is bookmarked</span>
            </div>
            <button
              onClick={handleRemoveFromBookmarks}
              className="btn btn-error btn-outline w-full"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove from Bookmarks
            </button>
          </div>
        ) : (
          /* Add to bookmarks */
          <div className="space-y-6">
            {/* Create New Bookmark */}
            <div>
              <label className="block text-sm font-medium text-base-content mb-2">
                Create New Bookmark List
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBookmarkName}
                  onChange={(e) => setNewBookmarkName(e.target.value)}
                  placeholder="Enter bookmark list name..."
                  className="input input-bordered flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateBookmark()}
                />
                <button
                  onClick={handleCreateBookmark}
                  disabled={!newBookmarkName.trim()}
                  className="btn btn-primary"
                >
                  Create
                </button>
              </div>
            </div>

            {/* Add to Existing Bookmark */}
            {bookmarks.length > 0 && (
              <div>
                <div className="divider text-base-content/60">OR</div>
                <label className="block text-sm font-medium text-base-content mb-2">
                  Add to Existing Bookmark List
                </label>
                <div className="space-y-2">
                  {bookmarks.map((bookmark) => (
                    <label key={bookmark.id} className="flex items-center gap-3 p-3 border border-base-300 rounded-lg hover:bg-base-200 cursor-pointer">
                      <input
                        type="radio"
                        name="bookmark"
                        value={bookmark.id}
                        checked={selectedBookmark === bookmark.id}
                        onChange={(e) => setSelectedBookmark(e.target.value)}
                        className="radio radio-primary"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-base-content">{bookmark.name}</div>
                        <div className="text-sm text-base-content/60">
                          {bookmark.problems.length} problem{bookmark.problems.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </label>
                  ))}
                  <button
                    onClick={handleAddToExistingBookmark}
                    disabled={!selectedBookmark}
                    className="btn btn-primary w-full mt-3"
                  >
                    Add to Selected List
                  </button>
                </div>
              </div>
            )}

            {bookmarks.length === 0 && (
              <div className="text-center py-4">
                <svg className="w-12 h-12 mx-auto mb-2 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <p className="text-base-content/60 text-sm">No bookmark lists yet. Create your first one above!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkModal;