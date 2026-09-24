import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Deployment() {
  const [applications, setApplications] = useState([
    {
      id: "app-001",
      name: "Student Portal",
      runtime: "Node.js",
      port: "8001",
      status: "Running",
      url: "http://localhost:8001",
    },
    {
      id: "app-002",
      name: "College Website",
      runtime: "Python",
      port: "8002",
      status: "Running",
      url: "http://localhost:8002",
    },
    {
      id: "app-003",
      name: "Library System",
      runtime: "Java",
      port: "8003",
      status: "Stopped",
      url: "-",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [appName, setAppName] = useState("");
  const [runtime, setRuntime] = useState("Node.js");
  const [port, setPort] = useState("");
  const [file, setFile] = useState(null);

  // Create application
  const deployApplication = () => {
    if (!appName || !port || !file) {
      alert("Please enter application name, port and upload ZIP file.");
      return;
    }

    const newApplication = {
      id: `app-${String(applications.length + 1).padStart(3, "0")}`,
      name: appName,
      runtime: runtime,
      port: port,
      status: "Running",
      url: `http://localhost:${port}`,
    };

    setApplications([...applications, newApplication]);

    setAppName("");
    setPort("");
    setRuntime("Node.js");
    setFile(null);
    setShowForm(false);

    alert("Application deployed successfully!");
  };

  // Start / Stop
  const toggleApplication = (id) => {
    setApplications(
      applications.map((app) => {
        if (app.id === id) {
          const newStatus =
            app.status === "Running" ? "Stopped" : "Running";

          return {
            ...app,
            status: newStatus,
            url:
              newStatus === "Running"
                ? `http://localhost:${app.port}`
                : "-",
          };
        }

        return app;
      })
    );
  };

  // Delete
  const deleteApplication = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) return;

    setApplications(
      applications.filter((app) => app.id !== id)
    );
  };

  const runningCount = applications.filter(
    (app) => app.status === "Running"
  ).length;

  const stoppedCount = applications.filter(
    (app) => app.status === "Stopped"
  ).length;

  return (
    <div className="app-layout">

      {/* ================= SIDEBAR ================= */}

      <Sidebar />

      {/* ================= MAIN CONTENT ================= */}

      <div className="main-content">

        {/* Navbar */}
        <Navbar />

        <main className="page-content">

          {/* ================= HEADER ================= */}

          <div className="page-header">

            <div>
              <h1>PaaS Deployment</h1>

              <p>
                Deploy and manage your college applications
              </p>
            </div>

            <button
              className="btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              + Deploy Application
            </button>

          </div>

          {/* ================= CREATE FORM ================= */}

          {showForm && (
            <div className="card deployment-form">

              <div className="card-header">
                <h2>Deploy Application</h2>

                <button
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  ✕
                </button>
              </div>

              <div className="form-grid">

                {/* Application Name */}
                <div className="form-group">
                  <label>Application Name</label>

                  <input
                    type="text"
                    placeholder="e.g. Student Portal"
                    value={appName}
                    onChange={(e) =>
                      setAppName(e.target.value)
                    }
                  />
                </div>

                {/* Runtime */}
                <div className="form-group">
                  <label>Runtime</label>

                  <select
                    value={runtime}
                    onChange={(e) =>
                      setRuntime(e.target.value)
                    }
                  >
                    <option value="Node.js">
                      Node.js
                    </option>

                    <option value="Python">
                      Python
                    </option>

                    <option value="Java">
                      Java
                    </option>
                  </select>
                </div>

                {/* Port */}
                <div className="form-group">
                  <label>Port</label>

                  <input
                    type="number"
                    placeholder="e.g. 8004"
                    value={port}
                    onChange={(e) =>
                      setPort(e.target.value)
                    }
                  />
                </div>

                {/* ZIP */}
                <div className="form-group">
                  <label>Application ZIP</label>

                  <input
                    type="file"
                    accept=".zip"
                    onChange={(e) =>
                      setFile(e.target.files[0])
                    }
                  />
                </div>

              </div>

              {file && (
                <p className="selected-file">
                  Selected file: <strong>{file.name}</strong>
                </p>
              )}

              <button
                className="btn-primary"
                onClick={deployApplication}
              >
                🚀 Deploy Application
              </button>

            </div>
          )}

          {/* ================= STATISTICS ================= */}

          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon">
                🚀
              </div>

              <div>
                <div className="stat-title">
                  Total Applications
                </div>

                <div className="stat-value">
                  {applications.length}
                </div>

                <div className="stat-subtitle">
                  Deployed applications
                </div>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                🟢
              </div>

              <div>
                <div className="stat-title">
                  Running
                </div>

                <div className="stat-value">
                  {runningCount}
                </div>

                <div className="stat-subtitle">
                  Active applications
                </div>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                🔴
              </div>

              <div>
                <div className="stat-title">
                  Stopped
                </div>

                <div className="stat-value">
                  {stoppedCount}
                </div>

                <div className="stat-subtitle">
                  Inactive applications
                </div>
              </div>

            </div>

          </div>

          {/* ================= APPLICATION TABLE ================= */}

          <div className="card">

            <div className="card-header">

              <div>
                <h2>Applications</h2>

                <span>
                  {applications.length} applications
                </span>
              </div>

            </div>

            <div className="table-container">

              <table>

                <thead>

                  <tr>
                    <th>Application</th>
                    <th>Runtime</th>
                    <th>Port</th>
                    <th>Status</th>
                    <th>URL</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {applications.length === 0 ? (

                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          textAlign: "center",
                          padding: "30px",
                        }}
                      >
                        No applications deployed.
                      </td>
                    </tr>

                  ) : (

                    applications.map((app) => (

                      <tr key={app.id}>

                        {/* Application */}
                        <td>

                          <div className="app-name">

                            <div className="app-icon">
                              🚀
                            </div>

                            <div>
                              <strong>
                                {app.name}
                              </strong>

                              <small>
                                {app.id}
                              </small>
                            </div>

                          </div>

                        </td>

                        {/* Runtime */}
                        <td>
                          {app.runtime}
                        </td>

                        {/* Port */}
                        <td>
                          {app.port}
                        </td>

                        {/* Status */}
                        <td>

                          <span
                            className={
                              app.status === "Running"
                                ? "status-running"
                                : "status-stopped"
                            }
                          >
                            ● {app.status}
                          </span>

                        </td>

                        {/* URL */}
                        <td>

                          {app.status === "Running" ? (

                            <a
                              href={app.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {app.url} ↗
                            </a>

                          ) : (
                            "-"
                          )}

                        </td>

                        {/* Actions */}
                        <td>

                          <button
                            className={
                              app.status === "Running"
                                ? "btn-warning small-btn"
                                : "btn-success small-btn"
                            }
                            onClick={() =>
                              toggleApplication(app.id)
                            }
                          >
                            {app.status === "Running"
                              ? "Stop"
                              : "Start"}
                          </button>

                          <button
                            className="btn-danger small-btn"
                            onClick={() =>
                              deleteApplication(app.id)
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* ================= INFORMATION ================= */}

          <div className="card paas-info">

            <h2>How PaaS Works in UniCloud</h2>

            <div className="info-grid">

              <div>
                <strong>1. Upload</strong>
                <p>
                  Upload your application as a ZIP file.
                </p>
              </div>

              <div>
                <strong>2. Select Runtime</strong>
                <p>
                  Choose Node.js, Python or Java.
                </p>
              </div>

              <div>
                <strong>3. Deploy</strong>
                <p>
                  UniCloud creates a container for your
                  application.
                </p>
              </div>

              <div>
                <strong>4. Access</strong>
                <p>
                  Your application gets a local URL and
                  port.
                </p>
              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Deployment;