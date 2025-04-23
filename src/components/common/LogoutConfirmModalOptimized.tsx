import React, { useCallback, useMemo } from 'react';
import './LogoutConfirmModal.css';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmModalOptimized: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const handleConfirm = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  const modalContent = useMemo(() => (
    <div className="logout-modal-content">
      <h3>Confirm Logout</h3>
      <p>Are you sure you want to logout?</p>
      <div className="logout-modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleConfirm}>
          Logout
        </button>
      </div>
    </div>
  ), [onClose, handleConfirm]);

  if (!isOpen) return null;

  return (
    <div className="logout-modal-overlay">
      <div className="logout-modal-container">
        {modalContent}
      </div>
    </div>
  );
};

export default React.memo(LogoutConfirmModalOptimized); 