interface modalProps {
    isOpen: boolean;
    onClose: (e: React.MouseEvent<HTMLElement>) => void;
    onLogin: (e: React.MouseEvent<HTMLElement>) => void;
    displayMessage: string;
}

export default function NoUserModal({ isOpen, onClose, onLogin, displayMessage }: modalProps) {
  if (!isOpen) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <p className="mb-4 text-lg">{displayMessage}</p>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            type="button"
            className="bg-gray hover:bg-gray-hover rounded px-4 py-2 font-bold text-black"
          >
            Cancel
          </button>
          <button
            onClick={onLogin}
            type="button"
            className="bg-green hover:bg-green-hover rounded px-4 py-2 font-bold text-white"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};