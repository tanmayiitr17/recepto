import React, { useState, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import LogoutConfirmModal from '../common/LogoutConfirmModal';
import './Sidebar.css';

interface OptimizedSidebarProps {
  active: boolean;
}

const OptimizedSidebar: React.FC<OptimizedSidebarProps> = ({ active }) => {
  const location = useLocation();
  const { logout } = useAppContext();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const isActive = useCallback((path: string) => {
    return location.pathname === path || (path === '/leads' && location.pathname === '/');
  }, [location.pathname]);

  const handleLogoutClick = useCallback(() => {
    setIsLogoutModalOpen(true);
  }, []);

  const confirmLogout = useCallback(() => {
    logout();
  }, [logout]);

  const handleCloseModal = useCallback(() => {
    setIsLogoutModalOpen(false);
  }, []);

  const sidebarClassName = useMemo(() => 
    `sidebar ${active ? 'active' : ''}`,
    [active]
  );

  const renderLogo = useMemo(() => (
    <div className="sidebar-logo">
      <img src="/logo.svg" alt="Recepto" />
      <h1>Recepto</h1>
    </div>
  ), []);

  const renderMainNav = useMemo(() => (
    <nav className="sidebar-nav">
      <Link to="/leads" className={`sidebar-nav-item ${isActive('/leads') ? 'active' : ''}`}>
        <div className="sidebar-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span>Leads</span>
      </Link>
      
      <Link to="/analytics" className={`sidebar-nav-item ${isActive('/analytics') ? 'active' : ''}`}>
        <div className="sidebar-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span>Analytics</span>
      </Link>
    </nav>
  ), [isActive]);

  const renderMoreNav = useMemo(() => (
    <nav className="sidebar-nav">
      <div className="sidebar-nav-item logout-button" onClick={handleLogoutClick}>
        <div className="sidebar-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span>Logout</span>
      </div>
    </nav>
  ), [handleLogoutClick]);

  return (
    <>
      <div className={sidebarClassName}>
        {renderLogo}
        
        <div className="sidebar-category">MAIN</div>
        {renderMainNav}
        
        <div className="sidebar-category">MORE</div>
        {renderMoreNav}
      </div>
      
      <LogoutConfirmModal 
        isOpen={isLogoutModalOpen}
        onClose={handleCloseModal}
        onConfirm={confirmLogout}
      />
    </>
  );
};

export default React.memo(OptimizedSidebar); 