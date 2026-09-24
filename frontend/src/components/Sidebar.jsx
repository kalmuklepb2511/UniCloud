import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Server,
  HardDrive,
  Rocket,
  Database,
  Users,
  Activity,
  CreditCard,
  ShieldCheck,
  Cloud,
} from "lucide-react";

function Sidebar() {
  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  // Get role
  const role = user?.role || "Student";

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={19} />,
    },
    {
      name: "EC2 (VMs)",
      path: "/ec2",
      icon: <Server size={19} />,
    },
    {
      name: "S3 Storage",
      path: "/storage",
      icon: <HardDrive size={19} />,
    },
    {
      name: "PaaS Deployment",
      path: "/deployment",
      icon: <Rocket size={19} />,
    },
    {
      name: "RDS Database",
      path: "/database",
      icon: <Database size={19} />,
    },
    {
      name: "IAM & Users",
      path: "/users",
      icon: <Users size={19} />,
    },
    {
      name: "Monitoring",
      path: "/monitoring",
      icon: <Activity size={19} />,
    },
    {
      name: "Billing",
      path: "/billing",
      icon: <CreditCard size={19} />,
    },
  ];

  // Admin Panel ONLY for Admin
  if (role === "Admin") {
    menuItems.push({
      name: "Admin Panel",
      path: "/admin",
      icon: <ShieldCheck size={19} />,
    });
  }

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Cloud size={25} />
        </div>

        <div className="sidebar-logo-text">
          <h2>UniCloud</h2>
          <span>College Cloud</span>
        </div>
      </div>

      {/* MENU */}
      <nav className="sidebar-menu">

        <p className="menu-title">CLOUD SERVICES</p>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >
            <span className="sidebar-link-icon">
              {item.icon}
            </span>

            <span className="sidebar-link-text">
              {item.name}
            </span>
          </NavLink>
        ))}

      </nav>

      {/* USER ROLE */}
      <div className="sidebar-bottom">

        <div className="sidebar-role">

          <div className="role-icon">
            {role === "Admin" ? "🛡️" : "👨‍🎓"}
          </div>

          <div className="role-info">
            <strong>{role}</strong>

            <span>
              {role === "Admin"
                ? "Administrator"
                : "Student User"}
            </span>
          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;