import { useState } from 'react';
import { useNavigate } from 'react-router';

import { postComment } from '../../api/destinationService.ts';
import NoUserModal from '../Modals/NoUserModal.tsx';

interface CommentInputProps {
    id: number;
    triggerRefresh: () => void;
}

function CommentInput({ id, triggerRefresh }: CommentInputProps) {
  const [comment, setComment] = useState<string>('');
  const [isModalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (comment.trim().length > 0) {
      if(localStorage.getItem('token')) {
      
        try {
          await postComment(id, comment.trim());
          triggerRefresh();
        } catch (err) {
          console.log('Failed to post comment:', err);
        }
      }
      else {
        setModalOpen(true);
      }
      
      setComment('');
    }
  };

  const handleCloseModal = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setModalOpen(false);
  };
  const handleLoginNavigate = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="w-full py-4">
      <textarea
        className="border-gray focus:border-green focus:ring-green h-28 w-full rounded-lg border p-4 focus:outline-none focus:ring-1"
        placeholder="Write your comment here..."
        maxLength={300}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        className="bg-green hover:bg-green-hover mt-4 w-full rounded px-4 py-2 font-bold text-white"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={handleSubmit}
        type="submit"
      >
        Post Comment
      </button>
      <NoUserModal isOpen={isModalOpen}
        onClose={handleCloseModal}
        onLogin={handleLoginNavigate} 
        displayMessage='You need to be logged in to post comments.' />

    </div>
  );
}

export default CommentInput;