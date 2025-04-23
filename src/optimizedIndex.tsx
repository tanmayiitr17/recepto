import React from "react";
import ReactDOM from "react-dom/client";
import OptimizedApp from "./OptimizedApp";
import "./styles/global.css";
import { OptimizedAppProvider } from "./context/OptimizedAppContext";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = ReactDOM.createRoot(rootElement);

const renderApp = () => {
  root.render(
    <React.StrictMode>
      <OptimizedAppProvider>
        <OptimizedApp />
      </OptimizedAppProvider>
    </React.StrictMode>
  );
};

const handleError = (error: Error) => {
  console.error("Error rendering app:", error);
  root.render(
    <div style={{ 
      padding: "20px", 
      color: "red", 
      textAlign: "center" 
    }}>
      <h1>Something went wrong</h1>
      <p>Please refresh the page or try again later.</p>
      <pre>{error.message}</pre>
    </div>
  );
};

try {
  renderApp();
} catch (error) {
  handleError(error instanceof Error ? error : new Error("Unknown error occurred"));
} 