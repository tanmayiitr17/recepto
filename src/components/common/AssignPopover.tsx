import React, { useState, useEffect, useRef } from "react";
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

const AssignPopover: React.FC<AssignPopoverProps> = ({
  isOpen,
  onClose,
  users,
  onAssign,
  targetElement,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, targetElement]);

  if (!isOpen || !targetElement) return null;

  const rect = targetElement.getBoundingClientRect();
  const popoverStyle: React.CSSProperties = {
    position: "absolute",
    top: `${rect.bottom + window.scrollY + 5}px`,
    left: `${rect.left + window.scrollX}px`,
    zIndex: 1000,
  };

  const handleAssignClick = (userId: string) => {
    onAssign(userId);
    onClose();
  };

  return (
    <div ref={popoverRef} className="assign-popover card" style={popoverStyle}>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="assign-popover-search"
      />
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
    </div>
  );
};

export default AssignPopover;
