import React, { useState, useCallback, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useAppContext, User } from "../../context/AppContext";
import "./AnalyticsPage.css";

const mockChartData = [
  { name: "Jan", value: Math.floor(Math.random() * 200) + 100 },
  { name: "Feb", value: Math.floor(Math.random() * 200) + 150 },
  { name: "Mar", value: Math.floor(Math.random() * 200) + 200 },
  { name: "Apr", value: Math.floor(Math.random() * 200) + 250 },
  { name: "May", value: Math.floor(Math.random() * 200) + 300 },
];

const ITEMS_PER_PAGE = 5;

const OptimizedAnalyticsPage: React.FC = () => {
  const { leads, users, currentUser, updateUserRole } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);

  const receptoNetLeads = useMemo(() => 
    leads.filter((l) => l.type === "ReceptoNet"),
    [leads]
  );

  const orgNetworkLeads = useMemo(() => 
    leads.filter((l) => l.type === "OrgNetwork"),
    [leads]
  );

  const calculateStats = useCallback((leadList: typeof leads) => ({
    total: leadList.length,
    unlocked: leadList.filter((l) => l.isUnlocked).length,
    liked: leadList.filter((l) => l.likeStatus === "liked").length,
    assigned: leadList.filter((l) => !!l.assignedTo).length,
    yetToUnlock: leadList.filter(
      (l) => !l.isUnlocked && l.type === "ReceptoNet"
    ).length,
    contacted: leadList.filter((l) => l.isUnlocked && l.type === "OrgNetwork")
      .length,
    yetToContact: leadList.filter(
      (l) => !l.isUnlocked && l.type === "OrgNetwork"
    ).length,
  }), []);

  const receptoNetStats = useMemo(() => 
    calculateStats(receptoNetLeads),
    [calculateStats, receptoNetLeads]
  );

  const orgNetworkStats = useMemo(() => 
    calculateStats(orgNetworkLeads),
    [calculateStats, orgNetworkLeads]
  );

  const activeUsers = useMemo(() => 
    users.filter((u) => u.role !== "Removed"),
    [users]
  );

  const totalPages = useMemo(() => 
    Math.ceil(activeUsers.length / ITEMS_PER_PAGE),
    [activeUsers.length]
  );

  const paginatedTeamData = useMemo(() => 
    activeUsers.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    ),
    [activeUsers, currentPage]
  );

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const handleRoleChange = useCallback((userId: string, event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value as User['role'];
    if (newRole && window.confirm(`Change ${users.find(u=>u.id===userId)?.name}'s role to ${newRole}?`)){
      updateUserRole(userId, newRole);
    }
  }, [users, updateUserRole]);

  const renderReceptoNetStats = useMemo(() => (
    <div className="stat-card card chart-card">
      <div className="stat-card-header">
        <div className="stat-card-title">
          <img src="/logo.svg" alt="ReceptoNet" className="stat-icon" />
          ReceptoNet Leads
        </div>
        <div className="stat-card-total">
          {receptoNetStats.total} <span className="total-label">Total</span>
        </div>
      </div>
      <div className="stat-progress">
        <span>
          Unlocked <strong>{receptoNetStats.unlocked} users</strong>
        </span>
        <span>
          Yet to Unlock <strong>{receptoNetStats.yetToUnlock} users</strong>
        </span>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart
            data={mockChartData}
            margin={{ top: 5, right: 0, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRecepto" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3366FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3366FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--dark-gray)" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--dark-gray)" }}
              dx={-10}
              domain={[0, "dataMax + 50"]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "4px",
                fontSize: "12px",
                padding: "4px 8px",
              }}
              itemStyle={{ color: "var(--text-color)" }}
              labelStyle={{ display: "none" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3366FF"
              fillOpacity={1}
              fill="url(#colorRecepto)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  ), [receptoNetStats]);

  const renderLikedLeads = useMemo(() => (
    <div className="stat-card card small-card">
      <div className="stat-card-icon liked-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2H7C6.20435 2 5.44129 2.31607 4.87868 2.87868C4.31607 3.44129 4 4.20435 4 5V14C4 14.473 4.10342 14.9402 4.3003 15.3713C4.49718 15.8024 4.78309 16.1874 5.13539 16.4999L10.2929 21.1249C10.4749 21.2897 10.7027 21.3886 10.9411 21.3983C11.1796 21.4081 11.4124 21.3279 11.5938 21.1749L17.5938 16.1749C17.8728 15.9427 18.0593 15.6239 18.1261 15.2749C18.1929 14.9259 18.1364 14.5659 17.9649 14.2529L14.9649 9.25291C14.8836 9.11783 14.775 9.00469 14.6475 8.92178C14.5199 8.83887 14.3772 8.78857 14.2299 8.77491"
            stroke="#3366FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="stat-card-value">
        {receptoNetStats.liked > 999
          ? (receptoNetStats.liked / 1000).toFixed(1) + "K"
          : receptoNetStats.liked}
      </div>
      <div className="stat-card-label">Liked Leads</div>
    </div>
  ), [receptoNetStats.liked]);

  const renderAssignedLeads = useMemo(() => (
    <div className="stat-card card small-card">
      <div className="stat-card-icon assigned-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H7C5.93913 15 4.92172 15.4214 4.17157 16.1716C3.42143 16.9217 3 17.9391 3 19V21"
            stroke="#00E096"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 11C12.2091 11 14 9.20914 14 7C14 4.79086 12.2091 3 10 3C7.79086 3 6 4.79086 6 7C6 9.20914 7.79086 11 10 11Z"
            stroke="#00E096"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z"
            stroke="#00E096"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 14C21 15.1046 20.1046 16 19 16C17.8954 16 17 15.1046 17 14C17 12.8954 17.8954 12 19 12C20.1046 12 21 12.8954 21 14Z"
            stroke="#00E096"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="stat-card-value">
        {receptoNetStats.assigned > 999
          ? (receptoNetStats.assigned / 1000).toFixed(1) + "K"
          : receptoNetStats.assigned}
      </div>
      <div className="stat-card-label">Assigned Leads</div>
    </div>
  ), [receptoNetStats.assigned]);

  const renderOrgNetworkStats = useMemo(() => (
    <div className="stat-card card chart-card">
      <div className="stat-card-header">
        <div className="stat-card-title">
          <img src="/facebook-icon.png" alt="Org Network" className="stat-icon" />
          Org Network Leads
        </div>
        <div className="stat-card-total">
          {orgNetworkStats.total} <span className="total-label">Total</span>
        </div>
      </div>
      <div className="stat-progress">
        <span>
          Contacted <strong>{orgNetworkStats.contacted} users</strong>
        </span>
        <span>
          Yet to Contact <strong>{orgNetworkStats.yetToContact} users</strong>
        </span>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart
            data={mockChartData}
            margin={{ top: 5, right: 0, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOrg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00E096" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00E096" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--dark-gray)" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--dark-gray)" }}
              dx={-10}
              domain={[0, "dataMax + 50"]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "4px",
                fontSize: "12px",
                padding: "4px 8px",
              }}
              itemStyle={{ color: "var(--text-color)" }}
              labelStyle={{ display: "none" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00E096"
              fillOpacity={1}
              fill="url(#colorOrg)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  ), [orgNetworkStats]);

  const renderTeamTable = useMemo(() => (
    <div className="team-table-container card">
      <h3>Team Members</h3>
      <table className="team-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTeamData.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="user-info">
                  <img src={user.avatar} alt={user.name} className="user-avatar" />
                  <span>{user.name}</span>
                </div>
              </td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e)}
                  className="role-select">
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                  <option value="Removed">Removed</option>
                </select>
              </td>
              <td>
                <button className="btn btn-secondary">View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          className="btn btn-secondary"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}>
          Previous
        </button>
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-secondary"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  ), [paginatedTeamData, currentPage, totalPages, handlePreviousPage, handleNextPage, handleRoleChange]);

  return (
    <div className="analytics-page">
      <div className="stats-grid">
        {renderReceptoNetStats}
        {renderLikedLeads}
        {renderAssignedLeads}
        {renderOrgNetworkStats}
      </div>
      {renderTeamTable}
    </div>
  );
};

export default React.memo(OptimizedAnalyticsPage); 