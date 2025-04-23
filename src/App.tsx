import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SidebarOptimized from "./components/layout/SidebarOptimized";
import HeaderOptimized from "./components/layout/HeaderOptimized";
import LeadsPageOptimized from "./components/leads/LeadsPageOptimized";
import AnalyticsPage from "./components/analytics/AnalyticsPage";
import { useAppContext } from "./context/AppContext";
import LoginScreen from "./components/auth/LoginScreen";

const App: React.FC = () => {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <Router>
      <div className="app-container">
        <SidebarOptimized active={true} />
        <div className="main-content">
          <HeaderOptimized />
          <Routes>
            <Route path="/" element={<Navigate to="/leads" replace />} />
            <Route path="/leads" element={<LeadsPageOptimized />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<Navigate to="/leads" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
