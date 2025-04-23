import React, { useState, useCallback, useMemo } from "react";
import { User } from "../../context/AppContext";
import "./AssignModal.css";

interface OptimizedAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onAssign: (userId: string) => void;
  leadId: number;
}

const OptimizedAssignModal: React.FC<OptimizedAssignModalProps> = ({
  isOpen,
  onClose,
  users,
  onAssign,
  leadId,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleAssignClick = useCallback(() => {
    if (selectedUserId) {
      onAssign(selectedUserId);
      onClose();
    } else {
      alert("Please select a user to assign.");
    }
  }, [selectedUserId, onAssign, onClose]);

  const handleUserSelect = useCallback((userId: string) => {
    setSelectedUserId(userId);
  }, []);

  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const assignableUsers = useMemo(() => 
    users.filter((user) => user.role !== "Removed"),
    [users]
  );

  const renderUserList = useMemo(() => (
    <div className="user-list">
      {assignableUsers.length > 0 ? (
        assignableUsers.map((user) => (
          <div
            key={user.id}
            className={`user-list-item ${selectedUserId === user.id ? "selected" : ""}`}
            onClick={() => handleUserSelect(user.id)}
          >
            <img src={user.avatar} alt={user.name} className="user-avatar" />
            <span className="user-name">{user.name}</span>
            <span className="user-role">({user.role})</span>
          </div>
        ))
      ) : (
        <p>No assignable users found.</p>
      )}
    </div>
  ), [assignableUsers, selectedUserId, handleUserSelect]);

  const renderModalContent = useMemo(() => (
    <div className="modal-content assign-modal" onClick={handleModalClick}>
      <h4>Assign Lead #{leadId}</h4>
      {renderUserList}
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={handleAssignClick}
          disabled={!selectedUserId}
        >
          Assign
        </button>
      </div>
    </div>
  ), [leadId, renderUserList, onClose, handleAssignClick, selectedUserId, handleModalClick]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      {renderModalContent}
    </div>
  );
};

export default React.memo(OptimizedAssignModal); 