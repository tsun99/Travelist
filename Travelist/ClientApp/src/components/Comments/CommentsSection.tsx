import { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt , FaUserCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { deleteComment, fetchComments, updateComment } from '../../api/destinationService.ts';
import { RootState } from '../../redux/stores/store.ts';
import { CommentType } from '../../types/CommentTypes.ts';
import DeleteConfirmationModal from '../Modals/ConfirmDeleteModal.tsx';
import EditCommentModal from '../Modals/EditCommentModal.tsx';

interface CommentSectionProps {
    id: number;
    refreshComments: boolean;
    resetRefresh: () => void;
}

function CommentSection({ id, refreshComments, resetRefresh }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { currentUser } = useSelector((state: RootState) => state.user);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);

  const openDeleteModal = (commentId: number) => {
    setDeletingCommentId(commentId);
    setIsDeleteModalOpen(true);
  };

  const startEditing = (comment: CommentType) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
    setIsEditing(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingCommentId === null) return;
    try {
      await deleteComment(deletingCommentId);
      const updatedComments = comments.filter(comment => comment.id !== deletingCommentId);
      setComments(updatedComments);
    } catch(err) {
      setError(err instanceof Error ? err.message : 'Could not update post');
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingCommentId(null);
    }
  };

  const handleUpdateComment = async (newContent: string) => {
    if(editingCommentId === null) return;

    try {
      await updateComment(editingCommentId, newContent);
      setComments(comments.map(comment => 
        (comment.id === editingCommentId ? { ...comment, content: newContent } : comment)
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update post');
    } finally {
      setIsEditing(false);
      setEditingCommentId(null);
      setEditingContent('');
    }
  };

  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      setError('');

      try {
        const fetchedComments = await fetchComments(id);
        setComments(fetchedComments);
        resetRefresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load comments');
      } finally {
        setIsLoading(false);
      }
    };

    if(refreshComments){
      loadComments().catch(() => {
      }) ;
    }
  }, [id, refreshComments, resetRefresh]);

  if (isLoading) return <p>Loading comments...</p>;
  if (error) return <p>Error loading comments: {error}</p>;

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <p className="text-center text-black">No comments yet.</p>
      ) : (
        <ul className="divide-gray divide-y">
          {comments.map(comment => (
            <div key={comment.id} className="mx-auto mt-8 flex w-full items-center justify-center pt-2 md:w-3/4 lg:w-3/4">
              <div className="flex w-full items-start bg-white p-4 text-black antialiased">
                {comment.imageUrl ? (
                  <img src={comment.imageUrl} alt="User" className="mr-2 mt-1 h-8 w-8 rounded-full" />
                ) : (
                  <FaUserCircle className="mr-2 mt-1 h-8 w-8" />
                )}
        
                <div className="bg-gray-comment w-full rounded-3xl px-4 pb-2.5 pt-2">
                  <div className="text-sm font-semibold leading-relaxed">
                    <Link to={`/profile/${comment.username}`}>
                      {comment.name}:
                    </Link>
                  </div>
                  <div className="text-normal leading-snug md:leading-normal">{comment.content}</div>
                  {comment.username === currentUser?.username && (
                    <div className="mt-2 flex items-center space-x-2">
                      <button className="hover:text-green-hover text-black" type='button' onClick={() => startEditing(comment)}>
                        <FaEdit />
                      </button>
                      <button className="text-red hover:text-red-hover" type='button' onClick={() => openDeleteModal(comment.id)}>
                        <FaTrashAlt />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ul>
      )}
      <EditCommentModal 
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        commentContent={editingContent}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onConfirm={handleUpdateComment} />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onConfirm={handleDeleteConfirm}
        itemName="comment"
      />
    </div>
  );
}

export default CommentSection;