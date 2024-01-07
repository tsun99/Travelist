interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
  }

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, itemName }: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold">Are you sure you want to delete this {itemName}?</h3>
        <div className="mt-4 flex justify-end space-x-4">
          <button type="button" className="bg-gray hover:bg-gray-hover rounded px-4 py-2 text-black" onClick={onClose}>Cancel</button>
          <button type="button" className="bg-red hover:bg-red-hover rounded px-4 py-2 text-white" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
export default DeleteConfirmationModal;