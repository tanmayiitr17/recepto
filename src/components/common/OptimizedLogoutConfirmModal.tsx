import React, { useCallback, useMemo } from "react";
import "./LogoutConfirmModal.css";

interface OptimizedLogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const OptimizedLogoutConfirmModal: React.FC<OptimizedLogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const handleConfirm = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const renderModalContent = useMemo(() => (
    <div className="modal-content logout-confirm-modal" onClick={handleModalClick}>
      <h4>Confirm Logout</h4>
      <p>Are you sure you want to log out?</p>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={handleConfirm}>
          Logout
        </button>
      </div>
    </div>
  ), [handleModalClick, onClose, handleConfirm]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      {renderModalContent}
    </div>
  );
};

export default React.memo(OptimizedLogoutConfirmModal); 