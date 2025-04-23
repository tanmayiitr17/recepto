import React, { useMemo, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import OptimizedSidebar from "./components/layout/OptimizedSidebar";
import OptimizedHeader from "./components/layout/OptimizedHeader";
import OptimizedLeadsPage from "./components/leads/OptimizedLeadsPage";
import OptimizedAnalyticsPage from "./components/analytics/OptimizedAnalyticsPage";
import { useOptimizedAppContext } from "./context/OptimizedAppContext";
import OptimizedLoginScreen from "./components/auth/OptimizedLoginScreen";

const OptimizedApp: React.FC = () => {
  const { currentUser } = useOptimizedAppContext();

  const renderRoutes = useMemo(() => (
    <Routes>
      <Route path="/" element={<Navigate to="/leads" replace />} />
      <Route path="/leads" element={<OptimizedLeadsPage />} />
      <Route path="/analytics" element={<OptimizedAnalyticsPage />} />
      <Route path="*" element={<Navigate to="/leads" replace />} />
    </Routes>
  ), []);

  const renderMainContent = useMemo(() => (
    <div className="main-content">
      <OptimizedHeader />
      {renderRoutes}
    </div>
  ), [renderRoutes]);

  const renderAppContent = useMemo(() => (
    <div className="app-container">
      <OptimizedSidebar active={true} />
      {renderMainContent}
    </div>
  ), [renderMainContent]);

  if (!currentUser) {
    return <OptimizedLoginScreen />;
  }

  return (
    <Router>
      {renderAppContent}
    </Router>
  );
};

export default React.memo(OptimizedApp); 