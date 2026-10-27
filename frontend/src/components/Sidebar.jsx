/*import { NavLink } from "react-router-dom";
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
 // const user = JSON.parse(localStorage.getItem("user"));

  // Get role
 // const role = user?.role || "User";

  const user = JSON.parse(localStorage.getItem("user"));

const role = user?.role;
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
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};



  return (
    <aside className="sidebar">

      // LOGO 
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Cloud size={25} />
        </div>

        <div className="sidebar-logo-text">
          <h2>UniCloud</h2>
          <span>College Cloud</span>
        </div>
      </div>

      //MENU 
      <nav className="sidebar-menu">

        <p className="menu-SStitle">CLOUD SERVICES</p>

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

      // USER ROLE 
      <div className="sidebar-bottom">

        <div className="sidebar-role">

          <div className="role-icon">
            {role === "Admin" ? "🛡️" : "👨‍🎓"}
          </div>

          <div className="role-info">
            <strong>{role}</strong>

            <span>
              {role === "ADMIN" && (
  <NavLink to="/admin">
    Admin Panel
  </NavLink>
)}
            // {role === "Admin"
             //   ? "Administrator"
             //   : "Student User"}
            </span>
          </div>

        </div>


       // LOGOUT BUTTON 
  

      </div>

    </aside>
  );
}

export default Sidebar;*/

import { NavLink, useNavigate } from "react-router-dom";

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
LogOut,
} from "lucide-react";

function Sidebar() {
const navigate = useNavigate();
const storedUser = localStorage.getItem("user");

let user = {};

try {
user = storedUser ? JSON.parse(storedUser) : {};
} catch {
user = {};
}

const role = String(user?.role || "USER").toUpperCase();
const isAdmin = role === "ADMIN";

const userMenuItems = [
{
name: "Dashboard",
path: "/dashboard",
icon: <LayoutDashboard size={19} />,
},
{
name: "EC2 Instances",
path: "/ec2",
icon: <Server size={19} />,
},
{
name: "S3 Storage",
path: "/storage",
icon: <HardDrive size={19} />,
},
{
name: "Deploy Application",
path: "/deployment",
icon: <Rocket size={19} />,
},
{
name: "RDS Database",
path: "/database",
icon: <Database size={19} />,
},
{
name: "Billing",
path: "/billing",
icon: <CreditCard size={19} />,
},
];

const adminMenuItems = [
{
name: "Admin Dashboard",
path: "/admin",
icon: <ShieldCheck size={19} />,
},
{
name: "Manage Users",
path: "/users",
icon: <Users size={19} />,
},
{
name: "Manage Instances",
path: "/ec2",
icon: <Server size={19} />,
},
{
name: "Manage Deployments",
path: "/deployment",
icon: <Rocket size={19} />,
},
{
name: "Resource Monitoring",
path: "/monitoring",
icon: <Activity size={19} />,
},
{
name: "Database",
path: "/database",
icon: <Database size={19} />,
},
{
name: "Storage",
path: "/storage",
icon: <HardDrive size={19} />,
},
{
name: "Billing",
path: "/billing",
icon: <CreditCard size={19} />,
},
];

const menuItems = isAdmin ? adminMenuItems : userMenuItems;

const handleLogout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");


navigate("/login", { replace: true });


};

return ( <aside className="sidebar"> <div className="sidebar-logo"> <div className="sidebar-logo-icon"> <Cloud size={25} /> </div>


    <div className="sidebar-logo-text">
      <h2>UniCloud</h2>
      <span>College Cloud</span>
    </div>
  </div>

  <nav className="sidebar-menu">
    <p className="menu-title">
      {isAdmin ? "ADMINISTRATION" : "CLOUD SERVICES"}
    </p>

    {menuItems.map((item) => (
      <NavLink
        key={item.path + item.name}
        to={item.path}
        end={
          item.path === "/dashboard" ||
          item.path === "/admin"
        }
        className={({ isActive }) =>
          isActive ? "sidebar-link active" : "sidebar-link"
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

  <div className="sidebar-bottom">
    <div className="sidebar-role">
      <div className="role-icon">
        {isAdmin ? "🛡️" : "👨‍🎓"}
      </div>
    <div className="role-info">
  <strong>{isAdmin ? "ADMIN" : "USER"}</strong>
  <span>
    {isAdmin ? "Administrator" : "Student"}
  </span>
</div>
</div>

  </div>
</aside>
);
}
export default Sidebar;
