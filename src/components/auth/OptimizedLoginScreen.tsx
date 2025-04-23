import React, { useState, useCallback, useMemo } from "react";
import { useAppContext } from "../../context/AppContext";
import "./LoginScreen.css";

const OptimizedLoginScreen: React.FC = () => {
  const { login } = useAppContext();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }, []);

  const handleLogin = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username) {
      setError("Please enter a username.");
      return;
    }
    const success = login(username);
    if (!success) {
      setError('Invalid username. Try "Priya Patel".');
    }
  }, [username, login]);

  const renderLogo = useMemo(() => (
    <img src="/logo.svg" alt="Recepto" className="login-logo" />
  ), []);

  const renderForm = useMemo(() => (
    <form onSubmit={handleLogin}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          className="form-control"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Enter your username"
          autoFocus
        />
      </div>
      {error && <p className="login-error">{error}</p>}
      <button type="submit" className="btn btn-primary login-button">
        Sign In
      </button>
    </form>
  ), [username, error, handleLogin, handleUsernameChange]);

  return (
    <div className="login-overlay">
      <div className="login-box card">
        {renderLogo}
        <h2>Welcome to Recepto</h2>
        <p className="login-subtitle">Please sign in to continue</p>
        {renderForm}
        <p className="login-hint text-sm text-gray">
          Hint: Try usernames like "Anand Kumar", "Olivia Rhye"
        </p>
      </div>
    </div>
  );
};

export default React.memo(OptimizedLoginScreen); 