/*function Dashboard() {

  return (
    <div>

      <div className="page-header">

        <div>
          <h1>Welcome, Vachanashree 👋</h1>
          <p>Here's what's happening with your cloud today.</p>
        </div>

      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <span>🖥️</span>
          <div>
            <p>Running VMs</p>
            <h2>3</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>💾</span>
          <div>
            <p>Storage Used</p>
            <h2>2.4 GB</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>🗄️</span>
          <div>
            <p>Databases</p>
            <h2>1</h2>
          </div>
        </div>

        <div className="stat-card">
          <span>💰</span>
          <div>
            <p>Total Cost</p>
            <h2>₹12.50</h2>
          </div>
        </div>

      </div>

      <div className="dashboard-grid">

        <div className="card">
          <h3>CPU Usage</h3>

          <div className="circle-progress">
            62%
          </div>

          <p className="center-text">Current CPU Usage</p>
        </div>

        <div className="card">
          <h3>RAM Usage</h3>

          <div className="circle-progress">
            71%
          </div>

          <p className="center-text">Current RAM Usage</p>
        </div>

        <div className="card activity-card">
          <h3>Recent Activity</h3>

          <div className="activity">
            🖥️ VM created
            <small>2 hours ago</small>
          </div>

          <div className="activity">
            📁 File uploaded
            <small>3 hours ago</small>
          </div>

          <div className="activity">
            🚀 Application deployed
            <small>5 hours ago</small>
          </div>

          <div className="activity">
            🗄️ Database created
            <small>6 hours ago</small>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;*/

import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
const [user, setUser] = useState(null);
const [instanceCount, setInstanceCount] = useState(null);
const [deploymentCount, setDeploymentCount] = useState(null);

useEffect(() => {
try {
setUser(JSON.parse(localStorage.getItem("user")));
} catch {
setUser(null);
}


let active = true;

async function loadStatistics() {
  try {
    const [instancesResponse, deploymentsResponse] =
      await Promise.all([
        api.get("/instances/my"),
        api.get("/deployments/my"),
      ]);

    if (!active) return;

    setInstanceCount(
      Array.isArray(instancesResponse.data)
        ? instancesResponse.data.length
        : 0
    );

    setDeploymentCount(
      Array.isArray(deploymentsResponse.data)
        ? deploymentsResponse.data.length
        : 0
    );
  } catch (error) {
    console.error("Unable to load dashboard statistics", error);
  }
}

loadStatistics();

return () => {
  active = false;
};


}, []);

return ( <div> <div className="page-header"> <div> <h1>
Welcome, {user?.username || "Student"} 👋 </h1>


      <p>
        Manage your virtual instances and deployed applications.
      </p>
    </div>
  </div>

  <div className="stats-grid">
    <div className="stat-card">
      <span>🖥️</span>
      <div>
        <p>My Instances</p>
        <h2>{instanceCount ?? "—"}</h2>
      </div>
    </div>

    <div className="stat-card">
      <span>🚀</span>
      <div>
        <p>My Deployments</p>
        <h2>{deploymentCount ?? "—"}</h2>
      </div>
    </div>

    <div className="stat-card">
      <span>💾</span>
      <div>
        <p>Storage Used</p>
        <h2>Not available</h2>
      </div>
    </div>

    <div className="stat-card">
      <span>💰</span>
      <div>
        <p>Cloud Cost</p>
        <h2>Not available</h2>
      </div>
    </div>
  </div>

  <div className="dashboard-grid">
    <div className="card">
      <h3>My Cloud Resources</h3>
      <p>
        Create and manage your own instances, deploy applications,
        and access your cloud resources.
      </p>
    </div>

    <div className="card activity-card">
      <h3>Quick Actions</h3>
      <p>Use the sidebar to open My Instances or Deploy Application.</p>
    </div>
  </div>
</div>


);
}

export default Dashboard;
