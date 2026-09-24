function Dashboard() {

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

export default Dashboard;