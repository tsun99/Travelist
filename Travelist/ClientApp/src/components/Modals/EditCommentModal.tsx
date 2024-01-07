import { useState, useEffect } from 'react';

interface EditCommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    commentContent: string;
    onConfirm: (newContent: string) => void;
  }

function EditCommentModal({ isOpen, onClose, commentContent, onConfirm }: EditCommentModalProps) {
  const [editedContent, setEditedContent] = useState<string>(commentContent);

  useEffect(() => {
    setEditedContent(commentContent);
  }, [commentContent]);
  
  const handleConfirm = () => {
    onConfirm(editedContent);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-1/2 rounded-lg bg-white p-4 lg:w-1/3">
        <h3 className='text-lg font-semibold'>Editing comment:</h3>
        <textarea 
          className="border-gray-hover h-40 w-full rounded border p-2" 
          value={editedContent} 
          onChange={(e) => setEditedContent(e.target.value)}
        />
        <div className="mt-4 flex justify-between space-x-2">
          <button onClick={onClose} type='button' className="bg-gray hover:bg-gray-hover w-1/2 rounded px-4 py-2 text-black">Cancel</button>
          <button onClick={handleConfirm} type='button' className="bg-green hover:bg-green-hover w-1/2 rounded px-4 py-2 text-white">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default EditCommentModal;