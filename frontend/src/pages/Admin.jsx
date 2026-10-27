import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  Users,
  Server,
  Database,
  Rocket,
  Cloud,
  Cpu,
  HardDrive,
  Activity,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

function Admin() {
  const [maintenance, setMaintenance] = useState(false);

  const stats = [
    {
      title: "Total Users",
      value: "24",
      icon: <Users size={22} />,
      text: "18 active users",
    },
    {
      title: "Running VMs",
      value: "8",
      icon: <Server size={22} />,
      text: "10 total VMs",
    },
    {
      title: "Applications",
      value: "6",
      icon: <Rocket size={22} />,
      text: "5 running",
    },
    {
      title: "Databases",
      value: "4",
      icon: <Database size={22} />,
      text: "3 running",
    },
  ];

  const [nodes, setNodes] = useState([
    {
      id: "node-001",
      name: "Master Node",
      ip: "192.168.1.10",
      cpu: "42%",
      ram: "58%",
      status: "Online",
    },
    {
      id: "node-002",
      name: "Worker Node 01",
      ip: "192.168.1.11",
      cpu: "36%",
      ram: "49%",
      status: "Online",
    },
    {
      id: "node-003",
      name: "Worker Node 02",
      ip: "192.168.1.12",
      cpu: "0%",
      ram: "0%",
      status: "Offline",
    },
  ]);

  const services = [
    {
      name: "Spring Boot API Server",
      type: "Backend API",
      status: "Operational",
    },
    {
      name: "Docker Engine",
      type: "Container Runtime",
      status: "Operational",
    },
    {
      name: "MySQL Database",
      type: "Database Service",
      status: "Operational",
    },
    {
      name: "S3 Storage",
      type: "Storage Service",
      status: "Operational",
    },
    {
      name: "Monitoring Service",
      type: "System Monitoring",
      status: "Operational",
    },
  ];

  const activities = [
    {
      action: "New user registered",
      user: "student@unicloud.com",
      time: "5 minutes ago",
    },
    {
      action: "VM created",
      user: "Vachanashree",
      time: "18 minutes ago",
    },
    {
      action: "Database started",
      user: "admin",
      time: "32 minutes ago",
    },
    {
      action: "Application deployed",
      user: "faculty@unicloud.com",
      time: "1 hour ago",
    },
  ];

  const restartService = (serviceName) => {
    alert(`${serviceName} restart request sent.`);
  };

  const refreshNodes = () => {
    alert("Worker node status refreshed.");
  };

  const toggleMaintenance = () => {
    setMaintenance(!maintenance);
  };

  return (
    <div className="app-layout">

      <Sidebar />

      <div className="main-content">

        <Navbar />

        <main className="page-content">

          <div className="page-header">
            <div>
              <h1>Admin Panel</h1>
              <p>Manage and monitor the UniCloud private cloud platform.</p>
            </div>

            <div className="admin-status">
              <span className="online-dot"></span>
              Cloud Online
            </div>
          </div>

          //Statistics
          <div className="admin-stats">

            {stats.map((stat) => (
              <div className="admin-stat-card" key={stat.title}>

                <div className="admin-stat-top">
                  <div className="admin-stat-icon">
                    {stat.icon}
                  </div>
                </div>

                <h2>{stat.value}</h2>

                <strong>{stat.title}</strong>

                <p>{stat.text}</p>

              </div>
            ))}

          </div>

          <div className="admin-section">

            <div className="section-heading">
              <div>
                <h2>Cloud Control</h2>
                <p>Manage overall cloud platform status.</p>
              </div>

              <ShieldCheck size={24} />
            </div>

            <div className="cloud-control-grid">

              <div className="control-card">
                <div className="control-icon">
                  <Cloud size={23} />
                </div>

                <div>
                  <strong>Cloud Platform</strong>
                  <p>UniCloud Private Cloud</p>
                </div>

                <span className="status-badge running">
                  Online
                </span>
              </div>

              <div className="control-card">
                <div className="control-icon">
                  <Activity size={23} />
                </div>

                <div>
                  <strong>System Health</strong>
                  <p>All major services operational</p>
                </div>

                <span className="status-badge running">
                  Healthy
                </span>
              </div>

              <div className="control-card">
                <div className="control-icon">
                  <RefreshCw size={23} />
                </div>

                <div>
                  <strong>Maintenance Mode</strong>
                  <p>
                    {maintenance
                      ? "Platform maintenance enabled"
                      : "Normal operation"}
                  </p>
                </div>

                <button
                  className={
                    maintenance
                      ? "admin-btn danger"
                      : "admin-btn"
                  }
                  onClick={toggleMaintenance}
                >
                  {maintenance ? "Disable" : "Enable"}
                </button>
              </div>

            </div>
          </div>

          <div className="admin-section">

            <div className="section-heading">

              <div>
                <h2>Worker Nodes</h2>
                <p>Manage machines connected to UniCloud.</p>
              </div>

              <button
                className="refresh-btn"
                onClick={refreshNodes}
              >
                <RefreshCw size={16} />
                Refresh
              </button>

            </div>

            <div className="admin-table-container">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Node</th>
                    <th>IP Address</th>
                    <th>CPU</th>
                    <th>RAM</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {nodes.map((node) => (
                    <tr key={node.id}>

                      <td>
                        <div className="node-name">

                          <div className="node-icon">
                            <Server size={18} />
                          </div>

                          <div>
                            <strong>{node.name}</strong>
                            <small>{node.id}</small>
                          </div>

                        </div>
                      </td>

                      <td>{node.ip}</td>

                      <td>
                        <div className="resource-value">
                          <Cpu size={15} />
                          {node.cpu}
                        </div>
                      </td>

                      <td>
                        <div className="resource-value">
                          <HardDrive size={15} />
                          {node.ram}
                        </div>
                      </td>

                      <td>
                        <span
                          className={
                            node.status === "Online"
                              ? "status-badge running"
                              : "status-badge stopped"
                          }
                        >
                          {node.status}
                        </span>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          </div>

          
          <div className="admin-bottom-grid">

            <div className="admin-section">

              <div className="section-heading">

                <div>
                  <h2>Cloud Services</h2>
                  <p>Current service status.</p>
                </div>

              </div>

              <div className="services-list">

                {services.map((service) => (
                  <div
                    className="service-row"
                    key={service.name}
                  >

                    <div className="service-info">

                      <span className="service-dot"></span>

                      <div>
                        <strong>{service.name}</strong>
                        <small>{service.type}</small>
                      </div>

                    </div>

                    <div className="service-actions">

                      <span className="service-operational">
                        {service.status}
                      </span>

                      <button
                        className="restart-btn"
                        onClick={() =>
                          restartService(service.name)
                        }
                      >
                        Restart
                      </button>

                    </div>

                  </div>
                ))}

              </div>

            </div>

            <div className="admin-section">

              <div className="section-heading">

                <div>
                  <h2>Recent Activity</h2>
                  <p>Latest administrative actions.</p>
                </div>

              </div>

              <div className="activity-list">

                {activities.map((activity, index) => (
                  <div
                    className="admin-activity"
                    key={index}
                  >

                    <div className="activity-icon">
                      <Activity size={16} />
                    </div>

                    <div>
                      <strong>{activity.action}</strong>

                      <p>
                        {activity.user} • {activity.time}
                      </p>
                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>

          <div className="admin-info">

            <div className="admin-info-icon">
              <ShieldCheck size={25} />
            </div>

            <div>
              <h3>UniCloud Administrator</h3>
              <p>
                Admin Panel provides centralized control over
                users, virtual machines, applications, databases,
                worker nodes and cloud services.
              </p>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

export default Admin;

{/*import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import api from "../services/api";

function Admin() {
const [users, setUsers] = useState([]);
const [instances, setInstances] = useState([]);
const [deployments, setDeployments] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const loadAdminData = async () => {
setLoading(true);
setError("");

```
try {
  const [usersRes, instancesRes, deploymentsRes] =
    await Promise.all([
      api.get("/admin/users"),
      api.get("/admin/instances"),
      api.get("/admin/deployments"),
    ]);

  setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
  setInstances(
    Array.isArray(instancesRes.data) ? instancesRes.data : []
  );
  setDeployments(
    Array.isArray(deploymentsRes.data)
      ? deploymentsRes.data
      : []
  );
} catch (err) {
  console.error("Failed to load admin resources:", err);

  if (err.response?.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return;
  }

  setError(
    err.response?.data?.message ||
      err.response?.data?.error ||
      "Could not load admin resources. Check your backend endpoints and permissions."
  );
} finally {
  setLoading(false);
}
```

};

useEffect(() => {
const storedUser = localStorage.getItem("user");

```
let user = {};

try {
  user = storedUser ? JSON.parse(storedUser) : {};
} catch {
  user = {};
}

if (String(user.role || "").toUpperCase() !== "ADMIN") {
  window.location.href = "/dashboard";
  return;
}

loadAdminData();
```

}, []);

const isRunning = (status) =>
String(status || "").toUpperCase() === "RUNNING";

const getUrl = (item) =>
item.applicationUrl ||
item.url ||
(item.port ? `http://localhost:${item.port}` : "");

if (loading) {
return <div className="page-content">Loading admin resources...</div>;
}

return ( <div className="page-content"> <div className="page-header"> <div> <h1>Admin Control Panel</h1> <p>View users, virtual machines, and deployed applications.</p> </div>

```
    <button
      type="button"
      className="btn-secondary"
      onClick={loadAdminData}
    >
      <RefreshCw size={16} />
      Refresh
    </button>
  </div>

  {error && (
    <div className="deployment-alert deployment-alert-error">
      {error}
    </div>
  )}

  <section className="stats-grid">
    <div className="stat-card">
      <div>
        <div className="stat-title">Total Users</div>
        <div className="stat-value">{users.length}</div>
      </div>
    </div>

    <div className="stat-card">
      <div>
        <div className="stat-title">Total VMs</div>
        <div className="stat-value">{instances.length}</div>
      </div>
    </div>

    <div className="stat-card">
      <div>
        <div className="stat-title">Running VMs</div>
        <div className="stat-value">
          {instances.filter((item) => isRunning(item.status)).length}
        </div>
      </div>
    </div>

    <div className="stat-card">
      <div>
        <div className="stat-title">Deployments</div>
        <div className="stat-value">{deployments.length}</div>
      </div>
    </div>
  </section>

  <section className="card">
    <div className="card-header">
      <h2>All Users</h2>
    </div>

    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4">No users found.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username || "-"}</td>
                <td>{user.email || "-"}</td>
                <td>{user.role || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>

  <section className="card">
    <div className="card-header">
      <h2>All Virtual Machines</h2>
    </div>

    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Owner</th>
            <th>Container Name</th>
            <th>Status</th>
            <th>URL</th>
          </tr>
        </thead>

        <tbody>
          {instances.length === 0 ? (
            <tr>
              <td colSpan="4">No VMs found.</td>
            </tr>
          ) : (
            instances.map((vm) => (
              <tr key={vm.id ?? vm.containerId}>
                <td>
                  {vm.username || vm.ownerUsername || vm.userId || "-"}
                </td>
                <td>{vm.containerName || vm.name || "-"}</td>
                <td>{String(vm.status || "UNKNOWN").toUpperCase()}</td>
                <td>
                  {getUrl(vm) && isRunning(vm.status) ? (
                    <a
                      href={getUrl(vm)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open VM
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>

  <section className="card">
    <div className="card-header">
      <h2>All Deployed Applications</h2>
    </div>

    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Owner</th>
            <th>Application Name</th>
            <th>Source</th>
            <th>Runtime</th>
            <th>Status</th>
            <th>URL</th>
          </tr>
        </thead>

        <tbody>
          {deployments.length === 0 ? (
            <tr>
              <td colSpan="6">No deployments found.</td>
            </tr>
          ) : (
            deployments.map((app) => (
              <tr key={app.id}>
                <td>
                  {app.username || app.ownerUsername || app.userId || "-"}
                </td>
                <td>{app.name || "-"}</td>
                <td>{app.sourceType || "-"}</td>
                <td>{app.runtime || app.projectType || "-"}</td>
                <td>
                  {String(app.status || "UNKNOWN").toUpperCase()}
                </td>
                <td>
                  {getUrl(app) && isRunning(app.status) ? (
                    <a
                      href={getUrl(app)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open Application
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>
</div>
```

);
}

export default Admin;*/}
