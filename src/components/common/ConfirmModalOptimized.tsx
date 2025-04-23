import React, { useCallback, useMemo } from 'react';
import './ConfirmModal.css';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'default' | 'danger';
}

const ConfirmModalOptimized: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default'
}) => {
  const handleConfirm = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  const modalContent = useMemo(() => (
    <div className="confirm-modal-content">
      <h3>{title}</h3>
      <p>{message}</p>
      <div className="confirm-modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>
          {cancelText}
        </button>
        <button 
          className={`btn ${type === 'danger' ? 'btn-danger' : 'btn-primary'}`} 
          onClick={handleConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  ), [title, message, confirmText, cancelText, type, onClose, handleConfirm]);

  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-container">
        {modalContent}
      </div>
    </div>
  );
};

export default React.memo(ConfirmModalOptimized); 