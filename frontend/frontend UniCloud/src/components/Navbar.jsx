import { Bell, UserCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear login information if stored later
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Go to Login page
    navigate("/login");
  };

  return (
    <header className="navbar">

      <div className="navbar-left">
        <h3>University Cloud Platform</h3>
      </div>

      <div className="navbar-right">

        {/* Notification */}
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        {/* User */}
        <div className="user-profile">

          <UserCircle size={34} />

          <div className="user-info">
            <strong>Vachanashree</strong>
            <span>Student</span>
          </div>

        </div>

        {/* Logout */}
        <button
          className="logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

      </div>

    </header>
  );
}

export default Navbar;