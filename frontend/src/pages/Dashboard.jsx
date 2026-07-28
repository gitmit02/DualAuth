import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        setData(res.data);
      } catch (err) {
        setError("Could not load dashboard data. Please try again.");
      }
    };
    fetchDashboard();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="dashboard-page">
      {/* Background Ambient Glows */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <div className="dashboard-card">
        {/* Header Section */}
        <header className="dashboard-header">
          <div className="badge-row">
            <span className="badge">
              <span className="badge-dot"></span> Active Session
            </span>
          </div>
          <h1>Account Dashboard</h1>
          <p className="dashboard-subtitle">Manage your personal profile and account details</p>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Main Dashboard Content */}
        {data ? (
          <div className="dashboard-content">
            {/* Profile Hero Block */}
            <div className="profile-hero">
              <div className="avatar-wrapper">
                <div className="avatar">{getInitials(data.user?.name)}</div>
                <span className="online-indicator" title="Online"></span>
              </div>
              <div className="profile-info">
                <h2>{data.user?.name || "Welcome Back"}</h2>
                <p className="welcome-msg">{data.message || "Session validated successfully"}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="detail-meta">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{data.user?.name || "N/A"}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="detail-meta">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{data.user?.email || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          !error && (
            <div className="loading-skeleton">
              <div className="skeleton-hero">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-text-group">
                  <div className="skeleton-line title"></div>
                  <div className="skeleton-line sub"></div>
                </div>
              </div>
              <div className="skeleton-line full"></div>
              <div className="skeleton-line full"></div>
            </div>
          )
        )}

        {/* Footer Actions */}
        <div className="card-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out of account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;