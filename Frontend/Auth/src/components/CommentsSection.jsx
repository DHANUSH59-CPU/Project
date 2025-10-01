import { useState, useEffect } from "react";
import { Heart, Reply, Edit, Trash2, Send } from "lucide-react";
import axiosClient from "../utils/axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const CommentsSection = ({ problemId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { user } = useSelector((state) => state.authSlice);

  // Fetch comments
  const fetchComments = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        `/social/problems/${problemId}/comments`,
        {
          params: { page: pageNum, limit: 10 },
        }
      );

      if (reset) {
        setComments(response.data.comments);
      } else {
        setComments((prev) => [...prev, ...response.data.comments]);
      }

      setHasMore(response.data.pagination.hasNext);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (problemId) {
      fetchComments(1, true);
    }
  }, [problemId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axiosClient.post(
        `/social/problems/${problemId}/comments`,
        {
          content: newComment.trim(),
          parentCommentId: replyingTo,
        }
      );

      setComments((prev) => [response.data.comment, ...prev]);
      setNewComment("");
      setReplyingTo(null);
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await axiosClient.post(
        `/social/comments/${commentId}/like`
      );

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: response.data.isLiked
                  ? [...comment.likes, user._id]
                  : comment.likes.filter((id) => id !== user._id),
              }
            : comment
        )
      );
    } catch (error) {
      console.error("Error liking comment:", error);
      toast.error("Failed to like comment");
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      await axiosClient.put(`/social/comments/${commentId}`, {
        content: editContent.trim(),
      });

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, content: editContent.trim(), isEdited: true }
            : comment
        )
      );

      setEditingComment(null);
      setEditContent("");
      toast.success("Comment updated successfully!");
    } catch (error) {
      console.error("Error editing comment:", error);
      toast.error("Failed to edit comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await axiosClient.delete(`/social/comments/${commentId}`);

      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const startEdit = (comment) => {
    setEditingComment(comment._id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditContent("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const CommentItem = ({ comment, isReply = false }) => {
    const isLiked = comment.likes.includes(user._id);
    const isOwner = comment.user._id === user._id;

    return (
      <div className={`${isReply ? "ml-8 mt-2" : "mb-4"}`}>
        <div className="bg-base-100 rounded-lg p-4 border border-base-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold">
                {comment.user.firstName.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-base-content">
                  {comment.user.firstName} {comment.user.lastName}
                </div>
                <div className="text-sm text-base-content/70">
                  {formatDate(comment.createdAt)}
                  {comment.isEdited && (
                    <span className="ml-2 text-xs text-base-content/50">
                      (edited)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {isOwner && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => startEdit(comment)}
                  className="text-base-content/70 hover:text-primary transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-base-content/70 hover:text-error transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {editingComment === comment._id ? (
            <div className="mt-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 border border-base-300 rounded-lg resize-none"
                rows="3"
                placeholder="Edit your comment..."
              />
              <div className="flex items-center justify-end space-x-2 mt-2">
                <button onClick={cancelEdit} className="btn btn-ghost btn-sm">
                  Cancel
                </button>
                <button
                  onClick={() => handleEditComment(comment._id)}
                  className="btn btn-primary btn-sm"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-base-content whitespace-pre-wrap">
                {comment.content}
              </p>

              <div className="flex items-center space-x-4 mt-3">
                <button
                  onClick={() => handleLikeComment(comment._id)}
                  className={`flex items-center space-x-1 text-sm transition-colors ${
                    isLiked
                      ? "text-red-500"
                      : "text-base-content/70 hover:text-red-500"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span>{comment.likes.length}</span>
                </button>

                {!isReply && (
                  <button
                    onClick={() => setReplyingTo(comment._id)}
                    className="flex items-center space-x-1 text-sm text-base-content/70 hover:text-primary transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-base-100 rounded-lg border border-base-300">
      <div className="p-4 border-b border-base-300">
        <h3 className="text-lg font-semibold text-base-content">Comments</h3>
      </div>

      {/* Add Comment Form */}
      <div className="p-4 border-b border-base-300">
        <form onSubmit={handleSubmitComment}>
          <div className="flex space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold">
              {user.firstName.charAt(0)}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={
                  replyingTo ? "Write a reply..." : "Write a comment..."
                }
                className="w-full p-3 border border-base-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
                maxLength="1000"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-base-content/70">
                  {newComment.length}/1000 characters
                </span>
                <div className="flex items-center space-x-2">
                  {replyingTo && (
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="btn btn-ghost btn-sm"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="btn btn-primary btn-sm flex items-center space-x-1"
                  >
                    <Send className="w-4 h-4" />
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-base-content/70">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div>
            {comments.map((comment) => (
              <div key={comment._id}>
                <CommentItem comment={comment} />
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-8">
                    {comment.replies.map((reply) => (
                      <CommentItem key={reply._id} comment={reply} isReply />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {hasMore && (
              <div className="text-center mt-4">
                <button
                  onClick={() => {
                    setPage((prev) => prev + 1);
                    fetchComments(page + 1);
                  }}
                  disabled={loading}
                  className="btn btn-ghost btn-sm"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
