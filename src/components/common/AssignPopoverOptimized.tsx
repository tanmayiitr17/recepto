import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { User } from "../../context/AppContext";
import "./AssignPopover.css";

interface AssignPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onAssign: (userId: string) => void;
  leadId: number;
  targetElement: HTMLButtonElement | null;
}

const AssignPopoverOptimized: React.FC<AssignPopoverProps> = ({
  isOpen,
  onClose,
  users,
  onAssign,
  targetElement,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  const filteredUsers = useMemo(() => 
    users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [users, searchTerm]
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (!isOpen) return;

    if (targetElement && targetElement.contains(event.target as Node)) {
      return;
    }

    if (
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  }, [isOpen, onClose, targetElement]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleAssignClick = useCallback((userId: string) => {
    onAssign(userId);
    onClose();
  }, [onAssign, onClose]);

  const popoverStyle = useMemo(() => {
    if (!targetElement) return {};

    const rect = targetElement.getBoundingClientRect();
    return {
      position: "absolute",
      top: `${rect.bottom + window.scrollY + 5}px`,
      left: `${rect.left + window.scrollX}px`,
      zIndex: 1000,
    } as React.CSSProperties;
  }, [targetElement]);

  const userList = useMemo(() => (
    <ul className="assign-popover-list">
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <li
            key={user.id}
            onClick={() => handleAssignClick(user.id)}
            className="assign-popover-item">
            <img
              src={user.avatar}
              alt={user.name}
              className="assign-popover-avatar"
            />
            <span>{user.name}</span>
          </li>
        ))
      ) : (
        <li className="assign-popover-empty">No users found</li>
      )}
    </ul>
  ), [filteredUsers, handleAssignClick]);

  if (!isOpen || !targetElement) return null;

  return (
    <div ref={popoverRef} className="assign-popover card" style={popoverStyle}>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="assign-popover-search"
      />
      {userList}
    </div>
  );
};

export default React.memo(AssignPopoverOptimized); 