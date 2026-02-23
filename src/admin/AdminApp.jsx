import { useState, useEffect } from "react";
import LoginScreen from "./components/LoginScreen";
import AdminDashboard from "./components/AdminDashboard";
import "./AdminApp.css";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "easyspace2025";

function AdminApp() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setAuthed(true);
    }
  }, []);

  const handleLogin = (password) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true");
      setAuthed(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setAuthed(false);
  };

  return (
    <div className="admin-app">
      {authed ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </div>
  );
}

export default AdminApp;
