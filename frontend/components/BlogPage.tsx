import React, { useState, useMemo } from 'react';
import { BlogPost, ReactionType, Comment } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import {
  ThumbsUp,
  Heart,
  ThumbsDown,
  MessageSquare,
  Pencil,
  Trash2,
  Send,
  Sparkles,
  MessageCircle,
  Share2,
} from 'lucide-react';

export interface BlogPageProps {
  posts: BlogPost[];
  onAddPost: (content: string) => Promise<void>;
  onUpdatePost: (postId: string, content: string) => Promise<void>;
  onDeletePost: (postId: string) => Promise<void>;
  onPostReaction: (postId: string, reactionType: ReactionType) => void;
  onAddComment: (postId: string, content: string) => Promise<void>;
  onUpdateComment: (postId: string, commentId: string, content: string) => Promise<void>;
  onDeleteComment: (postId: string, commentId: string) => Promise<void>;
  currentUserId: string;
  currentUserRole: 'SEEKER' | 'EMPLOYER' | 'ADMIN';
  currentUserName: string;
  currentUserPhoto: string;
}

interface PostCardProps {
  post: BlogPost;
  currentUserId: string;
  currentUserRole: 'SEEKER' | 'EMPLOYER' | 'ADMIN';
  currentUserPhoto: string;
  onEdit: () => void;
  onDelete: () => void;
  onReaction: (postId: string, reactionType: ReactionType) => void;
  onAddComment: (postId: string, content: string) => Promise<void>;
  onUpdateComment: (postId: string, commentId: string, content: string) => Promise<void>;
  onDeleteCommentClick: (comment: Comment) => void;
  isNew?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUserId,
  currentUserRole,
  currentUserPhoto,
  onEdit,
  onDelete,
  onReaction,
  onAddComment,
  onUpdateComment,
  onDeleteCommentClick,
  isNew,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');

  const reactionCounts = useMemo(
    () => ({
      like: post.reactions.filter((r) => r.type === 'like').length,
      love: post.reactions.filter((r) => r.type === 'love').length,
      dislike: post.reactions.filter((r) => r.type === 'dislike').length,
    }),
    [post.reactions]
  );

  const currentUserReaction = useMemo(
    () => post.reactions.find((r) => r.userId === currentUserId)?.type,
    [post.reactions, currentUserId]
  );

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmittingComment(true);
    await onAddComment(post.id, commentText);
    setCommentText('');
    setIsSubmittingComment(false);
  };

  const handleUpdateCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComment || !editedCommentContent.trim()) return;
    await onUpdateComment(post.id, editingComment.id, editedCommentContent);
    setEditingComment(null);
    setEditedCommentContent('');
  };

  const getRoleBadgeVariant = (role: string) => {
    if (role === 'ADMIN') return 'danger';
    if (role === 'EMPLOYER') return 'indigo';
    return 'violet';
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-7 shadow-sm hover:shadow-card-hover transition-all duration-300 space-y-5">
      {/* Post Header: Author info & Actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={post.authorPhotoUrl || 'https://via.placeholder.com/80'}
            alt={post.authorName}
            className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://via.placeholder.com/80?text=' + post.authorName?.charAt(0);
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral text-base tracking-tight">
                {post.authorName}
              </span>
              <Badge variant={getRoleBadgeVariant(post.authorRole)} size="sm">
                {post.authorRole}
              </Badge>
              {isNew && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-[#0284C7] animate-pulse">
                  NEW
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-secondary mt-0.5">
              {new Date(post.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {/* Admin Controls */}
        {currentUserRole === 'ADMIN' && (
          <div className="flex items-center gap-1">
            <button
              onClick={onEdit}
              className="p-2 text-slate-400 hover:text-[#6C5CE7] hover:bg-violet-50 rounded-xl transition-colors"
              title="Edit Post"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Delete Post"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Post Body Content */}
      <p className="text-sm sm:text-base text-neutral leading-relaxed whitespace-pre-wrap">
        {post.content}
      </p>

      {/* Reactions & Comment Counter Bar */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        {/* Reactions Pill Group */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-50 border border-slate-200/60">
          <button
            onClick={() => onReaction(post.id, 'like')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentUserReaction === 'like'
                ? 'bg-blue-100 text-blue-700 font-bold shadow-xs'
                : 'text-neutral-secondary hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${currentUserReaction === 'like' ? 'fill-blue-600' : ''}`} />
            <span>{reactionCounts.like}</span>
          </button>

          <button
            onClick={() => onReaction(post.id, 'love')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentUserReaction === 'love'
                ? 'bg-rose-100 text-rose-700 font-bold shadow-xs'
                : 'text-neutral-secondary hover:text-rose-600 hover:bg-rose-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${currentUserReaction === 'love' ? 'fill-rose-600' : ''}`} />
            <span>{reactionCounts.love}</span>
          </button>

          <button
            onClick={() => onReaction(post.id, 'dislike')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentUserReaction === 'dislike'
                ? 'bg-slate-200 text-slate-800 font-bold'
                : 'text-neutral-secondary hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <ThumbsDown className={`w-4 h-4 ${currentUserReaction === 'dislike' ? 'fill-slate-700' : ''}`} />
            <span>{reactionCounts.dislike}</span>
          </button>
        </div>

        {/* Toggle Comments Trigger */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-secondary hover:text-[#6C5CE7] transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>
            {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
          </span>
        </button>
      </div>

      {/* Comments Thread Section */}
      {showComments && (
        <div className="pt-4 border-t border-slate-100 space-y-4">
          {/* List of comments */}
          {post.comments.length > 0 && (
            <div className="space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <img
                    src={comment.authorPhotoUrl || 'https://via.placeholder.com/60'}
                    alt={comment.authorName}
                    className="w-8 h-8 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="flex-grow p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs">
                    {editingComment?.id === comment.id ? (
                      <form onSubmit={handleUpdateCommentSubmit} className="space-y-2">
                        <textarea
                          value={editedCommentContent}
                          onChange={(e) => setEditedCommentContent(e.target.value)}
                          className="w-full p-2 text-xs border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7] bg-white"
                          rows={2}
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingComment(null)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" size="sm" variant="primary">
                            Save
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral">
                              {comment.authorName}
                            </span>
                            <span className="text-[10px] text-neutral-secondary">
                              · {new Date(comment.timestamp).toLocaleDateString()}
                            </span>
                          </div>

                          {currentUserRole === 'ADMIN' && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingComment(comment);
                                  setEditedCommentContent(comment.content);
                                }}
                                className="p-1 text-slate-400 hover:text-[#6C5CE7] rounded"
                                title="Edit Comment"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteCommentClick(comment)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded"
                                title="Delete Comment"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-neutral-secondary leading-relaxed whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Input Form */}
          <form onSubmit={handleCommentSubmit} className="flex items-start gap-3 pt-2">
            <img
              src={currentUserPhoto || 'https://via.placeholder.com/60'}
              alt="Your avatar"
              className="w-8 h-8 rounded-xl object-cover border border-slate-200 flex-shrink-0"
            />
            <div className="flex-grow flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a constructive comment..."
                disabled={isSubmittingComment}
                className="w-full px-4 py-2 text-xs rounded-xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7] transition-all"
              />
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={isSubmittingComment || !commentText.trim()}
                isLoading={isSubmittingComment}
                className="px-3"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const BlogPage: React.FC<BlogPageProps> = ({
  posts,
  onAddPost,
  onUpdatePost,
  onDeletePost,
  onPostReaction,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  currentUserId,
  currentUserRole,
  currentUserName,
  currentUserPhoto,
}) => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const [deletingCommentInfo, setDeletingCommentInfo] = useState<{
    postId: string;
    comment: Comment;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsPosting(true);
    try {
      await onAddPost(content);
      setContent('');
    } catch (error) {
      console.error('Failed to post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingPost || !editedContent.trim()) return;
    await onUpdatePost(editingPost.id, editedContent);
    setEditingPost(null);
    setEditedContent('');
  };

  const handleDelete = async () => {
    if (!deletingPost) return;
    await onDeletePost(deletingPost.id);
    setDeletingPost(null);
  };

  const handleDeleteCommentConfirm = async () => {
    if (!deletingCommentInfo) return;
    await onDeleteComment(deletingCommentInfo.postId, deletingCommentInfo.comment.id);
    setDeletingCommentInfo(null);
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <Badge variant="violet">Executive Community</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral">
            Community Insights & Reviews
          </h1>
          <p className="text-sm text-neutral-secondary max-w-lg mx-auto">
            Discuss interview experiences, salary benchmarks, company cultures, and engineering leadership.
          </p>
        </div>

        {/* Create New Post Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-border/80 shadow-sm">
          <form onSubmit={handleSubmit} className="flex items-start gap-4">
            <img
              src={currentUserPhoto || 'https://via.placeholder.com/80'}
              alt={currentUserName}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://via.placeholder.com/80?text=' + currentUserName.charAt(0);
              }}
            />
            <div className="flex-grow space-y-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your interview experience, team review, or hiring advice..."
                className="w-full p-3.5 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7] transition-all text-sm text-neutral placeholder:text-slate-400 bg-slate-50/50"
                rows={3}
                disabled={isPosting}
                aria-label="New post content"
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-neutral-secondary">
                  Posting as <span className="font-bold text-neutral">{currentUserName}</span> ({currentUserRole})
                </span>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isPosting || !content.trim()}
                  isLoading={isPosting}
                  className="px-6 shadow-sm"
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Publish Post
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Feed Stream */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-bold text-neutral tracking-tight flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#6C5CE7]" />
              Recent Conversations ({posts.length})
            </h2>
          </div>

          {posts.length > 0 ? (
            posts.map((post, index) => {
              const isNew =
                index === 0 &&
                new Date().getTime() - new Date(post.timestamp).getTime() < 5 * 60 * 1000;

              return (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserRole={currentUserRole}
                  currentUserId={currentUserId}
                  currentUserPhoto={currentUserPhoto}
                  onEdit={() => {
                    setEditingPost(post);
                    setEditedContent(post.content);
                  }}
                  onDelete={() => setDeletingPost(post)}
                  onReaction={onPostReaction}
                  onAddComment={onAddComment}
                  onUpdateComment={onUpdateComment}
                  onDeleteCommentClick={(comment) =>
                    setDeletingCommentInfo({ postId: post.id, comment })
                  }
                  isNew={isNew}
                />
              );
            })
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-border">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-neutral mb-1">No Posts Yet</h3>
              <p className="text-sm text-neutral-secondary">
                Be the first to share an opportunity, review, or discussion point with the community!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Post Modal */}
      {editingPost && (
        <Modal
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
          title="Edit Discussion Post"
        >
          <div className="space-y-4">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-4 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7] text-sm text-neutral"
              rows={4}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setEditingPost(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleUpdate}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Post Modal */}
      {deletingPost && (
        <Modal
          isOpen={!!deletingPost}
          onClose={() => setDeletingPost(null)}
          title="Delete Post"
        >
          <div className="space-y-4">
            <p className="text-sm text-neutral-secondary">
              Are you sure you want to permanently delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="md"
                onClick={() => setDeletingPost(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleDelete}
              >
                Delete Post
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Comment Modal */}
      {deletingCommentInfo && (
        <Modal
          isOpen={!!deletingCommentInfo}
          onClose={() => setDeletingCommentInfo(null)}
          title="Delete Comment"
        >
          <div className="space-y-4">
            <p className="text-sm text-neutral-secondary">
              Are you sure you want to delete this comment?
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="md"
                onClick={() => setDeletingCommentInfo(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleDeleteCommentConfirm}
              >
                Delete Comment
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
};

export default BlogPage;
