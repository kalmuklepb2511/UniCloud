{/*import { useState } from "react";
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

      // ================= SIDEBAR =================

      <Sidebar />

      // ================= MAIN CONTENT =================

      <div className="main-content">

        // Navbar
        <Navbar />

        <main className="page-content">

          // ================= HEADER =================

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

          // ================= CREATE FORM =================

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

                // Application Name
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

                // Runtime
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

                // Port
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

                // ZIP
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

          // ================= STATISTICS =================

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

          //================= APPLICATION TABLE =================

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

                        // Application
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

                        // Runtime
                        <td>
                          {app.runtime}
                        </td>

                        //Port
                        <td>
                          {app.port}
                        </td>

                        // Status
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

                        // URL
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

                        //Actions
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

        //  ================= INFORMATION =================

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

export default Deployment;*/}

import { useCallback, useEffect, useState } from "react";
import {
Plus,
Rocket,
Play,
Square,
Trash2,
RefreshCw,
ExternalLink,
Server
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

import { isAdminUser } from "../utils/auth";
const INITIAL_FORM = {
name: "",
sourceType: "github",
repositoryUrl: "",
targetType: "NEW",
instanceId: ""
};

function getErrorMessage(error) {
const data = error.response?.data;

if (typeof data === "string") {
return data;
}

if (data?.error) {
return data.error;
}

if (data?.message) {
return data.message;
}

return error.message || "An unexpected error occurred.";
}

function isRunning(status) {
return String(status || "").toUpperCase() === "RUNNING";
}

function formatDate(value) {
if (!value) {
return "-";
}

const date = new Date(value);

return Number.isNaN(date.getTime())
? String(value)
: date.toLocaleString();
}

function Deployment() {
  const isAdmin = isAdminUser();
const [form, setForm] = useState(INITIAL_FORM);
const [showDeploymentForm, setShowDeploymentForm] = useState(false);
const [file, setFile] = useState(null);

const [instances, setInstances] = useState([]);
const [applications, setApplications] = useState([]);
const [loading, setLoading] = useState(true);

const [loadingInstances, setLoadingInstances] = useState(true);
const [loadingApplications, setLoadingApplications] = useState(true);
const [deploying, setDeploying] = useState(false);
const [busyId, setBusyId] = useState(null);

const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const handleUnauthorized = useCallback((err) => {
if (err.response?.status !== 401) {
return false;
}


localStorage.removeItem("user");
window.location.href = "/login";

return true;


}, []);

const updateForm = (field, value) => {
setForm((previous) => ({
...previous,
[field]: value
}));
};

const loadInstances = useCallback(async () => {
try {
setLoadingInstances(true);


  const response = await api.get("/instances/my");

  const data = Array.isArray(response.data)
    ? response.data
    : [];

  setInstances(data);

  setForm((previous) => {
    const stillExists = data.some(
      (instance) =>
        String(instance.id) === String(previous.instanceId)
    );

    return {
      ...previous,
      instanceId: stillExists
        ? previous.instanceId
        : ""
    };
  });
} catch (err) {
  if (handleUnauthorized(err)) {
    return;
  }

  setError(
    `Could not load instances: ${getErrorMessage(err)}`
  );
} finally {
  setLoadingInstances(false);
}


}, [handleUnauthorized]);

const loadApplications = useCallback(async () => {
setLoadingApplications(true);

try {
const token = localStorage.getItem("token");


const endpoint = isAdmin
  ? "/deployments/admin/all"
  : "/deployments/my";

const response = await api.get(endpoint, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

console.log("Deployments API response:", response.data);

const data = Array.isArray(response.data)
  ? response.data
  : [];

setApplications(data);
setError("");


} catch (err) {
console.error(
"Failed to load deployments:",
err.response?.status,
err.response?.data || err.message
);


if (handleUnauthorized(err)) {
  return;
}

setApplications([]);
setError(
  `Could not load deployments: ${getErrorMessage(err)}`
);


} finally {
setLoadingApplications(false);
}
}, [isAdmin, handleUnauthorized]);

useEffect(() => {
loadInstances();
loadApplications();
}, [loadInstances, loadApplications]);

const deployApplication = async (event) => {
event.preventDefault();


setError("");
setSuccess("");

if (!form.name.trim()) {
  setError("Enter an application name.");
  return;
}

if (
  form.sourceType === "github"
  && !form.repositoryUrl.trim()
) {
  setError("Enter a GitHub repository URL.");
  return;
}

{/*if (form.sourceType === "zip" && !file) {
  setError("Choose a ZIP file.");
  return;
}*/}
if (
  (form.sourceType === "zip" || form.sourceType === "jar") &&
  !file
) {
  setError(
    form.sourceType === "jar"
      ? "Choose a JAR file."
      : "Choose a ZIP file."
  );
  return;
}

if (file) {
  const expectedExtension =
    form.sourceType === "jar" ? ".jar" : ".zip";

  if (
    form.sourceType !== "github" &&
    !file.name.toLowerCase().endsWith(expectedExtension)
  ) {
    setError(`Please select a valid ${expectedExtension} file.`);
    return;
  }
}

if (
  form.targetType === "EXISTING"
  && !form.instanceId
) {
  setError("Select an existing instance.");
  return;
}

if (
  form.targetType === "EXISTING"
  && !instances.some(
    (instance) =>
      String(instance.id) === String(form.instanceId)
  )
) {
  setError(
    "The selected instance could not be found. Refresh the list."
  );
  return;
}

try {
  setDeploying(true);

  let response;

  if (form.sourceType === "github") {
    response = await api.post("/deployments/github", {
      name: form.name.trim(),
      repositoryUrl: form.repositoryUrl.trim(),
      targetType: form.targetType,
      instanceId:
        form.targetType === "EXISTING"
          ? Number(form.instanceId)
          : null
    });
  } else {
  const formData = new FormData();

  formData.append("name", form.name.trim());
  formData.append("file", file);
  formData.append("sourceType", form.sourceType);
  formData.append("targetType", form.targetType);

  if (form.targetType === "EXISTING") {
    formData.append("instanceId", form.instanceId);
  }

  response = await api.post(
    form.sourceType === "jar"
      ? "/deployments/jar"
      : "/deployments/upload",
    formData
  );
} {/*else {
    const formData = new FormData();

    formData.append("name", form.name.trim());
    formData.append("file", file);
    formData.append("targetType", form.targetType);

    if (form.targetType === "EXISTING") {
      formData.append("instanceId", form.instanceId);
    }

    response = await api.post(
      "/deployments/upload",
      formData
    );
  }*/}

  setSuccess(
    response.data?.message
      || "Deployment created successfully."
  );

  setForm(INITIAL_FORM);
  setFile(null);

  const fileInput = document.getElementById("deployment-zip");

  if (fileInput) {
    fileInput.value = "";
  }

  await Promise.all([
    loadInstances(),
    loadApplications()
  ]);
} catch (err) {
  if (!handleUnauthorized(err)) {
    setError(getErrorMessage(err));
  }
} finally {
  setDeploying(false);
}
};

const performApplicationAction = async (id, action) => {
setError("");
setSuccess("");


if (action === "delete") {
  const confirmed = window.confirm(
    "Delete this deployment and its managed container?"
  );

  if (!confirmed) {
    return;
  }
}

try {
  setBusyId(id);

  if (action === "delete") {
    await api.delete(`/deployments/${id}`);
  } else {
    await api.post(`/deployments/${id}/${action}`);
  }

  setSuccess(
    action === "delete"
      ? "Deployment deleted successfully."
      : `Deployment ${action} request completed.`
  );

  await loadApplications();
/*} catch (err) {
  if (!handleUnauthorized(err)) {
    setError(getErrorMessage(err));
  }
} finally {
  setBusyId(null);
}*/} catch (err) {
console.error(
`Deployment ${action} failed:`,
err.response?.status,
err.response?.data || err.message
);

if (!handleUnauthorized(err)) {
setError(getErrorMessage(err));
}
} finally {
setBusyId(null);
}
};

const runningCount = applications.filter(
(app) => isRunning(app.status)
).length;

const stoppedCount = applications.filter(
(app) =>
String(app.status || "").toUpperCase() === "STOPPED"
).length;

const failedCount = applications.filter(
(app) =>
String(app.status || "").toUpperCase() === "FAILED"
).length;

return ( <div className="app-layout">


  <div className="main-content">

    <main className="page-content">
      <div className="page-header">
        <div>
          <h1>Deploy Applications</h1>
          <p>
            Build and manage your applications on UniCloud.
          </p>
        </div>
        <button
type="button"
className="btn-primary"
onClick={() => {
setError("");
setSuccess("");
setShowDeploymentForm(true);
}}

>
  <Plus size={17} />
  New Deployment
</button>

        
      </div>

      {error && (
        <div
          className="deployment-alert deployment-alert-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="deployment-alert deployment-alert-success"
          role="status"
        >
          {success}
        </div>
      )}
{showDeploymentForm && (

  <section
    id="deployment-form"
    className="card deployment-form"
  >
        <div className="card-header">
  <div>
    <h2>
      <Rocket size={20} />
      Create Deployment
    </h2>
<p>
  Choose a source and a deployment target.
</p>
  </div>

<button
type="button"
className="btn-secondary"
onClick={() => {
setShowDeploymentForm(false);
setError("");
setSuccess("");
}}
aria-label="Close create deployment form"

>
✕ Close


  </button>
</div>


        <form onSubmit={deployApplication}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="application-name">
                Application Name
              </label>

              <input
                id="application-name"
                type="text"
                maxLength={100}
                value={form.name}
                placeholder="e.g. Student Portal"
                onChange={(event) =>
                  updateForm("name", event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="source-type">
                Application Source
              </label>

              <select
                id="source-type"
                value={form.sourceType}
                onChange={(event) => {
                  updateForm(
                    "sourceType",
                    event.target.value
                  );

                  setFile(null);
                  setError("");
                }}
              >
                <option value="github">
                  GitHub Repository
                </option>

                <option value="zip">
                  ZIP Upload
                </option>
                 <option value="jar">
                  Java JAR Upload
                </option>
                
              </select>
            </div>

            {form.sourceType === "github" ? (
              <div className="form-group full-width">
                <label htmlFor="repository-url">
                  GitHub Repository URL
                </label>

                <input
                  id="repository-url"
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={form.repositoryUrl}
                  onChange={(event) =>
                    updateForm(
                      "repositoryUrl",
                      event.target.value
                    )
                  }
                  required
                />

                <small>
                  Use a public GitHub repository.
                  Private repository credentials are not supported here.
                </small>
             {/* </div>
            ) : (
             <div className="form-group full-width">
                <label htmlFor="deployment-zip">
                  Project ZIP File
                </label>*/}
                </div> ) : ( <div className="form-group full-width"> <label htmlFor="deployment-file"> {form.sourceType === "jar" ? "Java JAR File" : "Project ZIP File"} </label>
                <input
                  id="deployment-zip"
                  type="file"
                 // accept=".zip,application/zip"
                accept={ form.sourceType === "jar" ? ".jar,application/java-archive" : ".zip,application/zip" }
                  onChange={(event) =>
                    setFile(
                      event.target.files?.[0] || null
                    )
                  }
                  required
                />

                {file && (
                  <small>
                    {file.name} (
                    {(file.size / (1024 * 1024)).toFixed(2)}
                    {" "}MB)
                  </small>
                )}
              </div>
            )}
          </div>

          <div className="deployment-target-section">
            <h3>Deployment Target</h3>

            <label className="target-option">
              <input
                type="radio"
                name="targetType"
                value="NEW"
                checked={form.targetType === "NEW"}
                onChange={() => {
                  updateForm("targetType", "NEW");
                  updateForm("instanceId", "");
                }}
              />

              <span>
                <strong>Create a new environment</strong>

                <small>
                  Create a standalone application container
                  for this deployment.
                </small>
              </span>
            </label>

            <label className="target-option">
              <input
                type="radio"
                name="targetType"
                value="EXISTING"
                checked={form.targetType === "EXISTING"}
                onChange={() =>
                  updateForm("targetType", "EXISTING")
                }
              />

              <span>
                <strong>Associate with an existing instance</strong>

                <small>
                  Select one of your running instances.
                  The application still runs in its own container.
                </small>
              </span>
            </label>

            {form.targetType === "EXISTING" && (
              <div className="form-group existing-instance-select">
                <label htmlFor="instance-select">
                  Select Instance
                </label>

                <div className="select-with-refresh">
                  <select
                    id="instance-select"
                    value={form.instanceId}
                    onChange={(event) =>
                      updateForm(
                        "instanceId",
                        event.target.value
                      )
                    }
                    disabled={loadingInstances}
                    required
                  >
                    <option value="">
                      {loadingInstances
                        ? "Loading instances..."
                        : "Choose an instance"}
                    </option>

                    {instances.map((instance) => (
                      <option
                        key={instance.id}
                        value={instance.id}
                        disabled={!isRunning(instance.status)}
                      >
                        {instance.name}
                        {" — "}
                        {instance.status}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={loadInstances}
                    disabled={loadingInstances}
                    aria-label="Refresh instances"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>

                {!loadingInstances
                  && instances.length === 0 && (
                    <small>
                      No instances found. Create one on the
                      Instances page or use a new environment.
                    </small>
                  )}
              </div>
            )}
          </div>

          <div className="deployment-submit-row">
            <button
              type="submit"
              className="btn-primary"
              disabled={
                deploying
                || loadingInstances
                || (
                  form.targetType === "EXISTING"
                  && !form.instanceId
                )
              }
            >
              <Rocket size={17} />

              {deploying
                ? "Building and Deploying..."
                : "Deploy Application"}
            </button>
          </div>
        </form>
      </section>
)}
      {isAdmin && (

  <section className="stats-grid">
    <div className="stat-card">
      <div className="stat-icon">
        <Server size={23} />
      </div>


  <div>
    <div className="stat-title">
      Total Applications
    </div>
    <div className="stat-value">
      {applications.length}
    </div>
  </div>
</div>

<div className="stat-card">
  <div className="stat-icon">
    <Play size={23} />
  </div>

  <div>
    <div className="stat-title">Running</div>
    <div className="stat-value">
      {runningCount}
    </div>
  </div>
</div>

<div className="stat-card">
  <div className="stat-icon">
    <Square size={23} />
  </div>

  <div>
    <div className="stat-title">Stopped</div>
    <div className="stat-value">
      {stoppedCount}
    </div>
  </div>
</div>

<div className="stat-card">
  <div className="stat-icon">
    <RefreshCw size={23} />
  </div>

  <div>
    <div className="stat-title">Failed</div>
    <div className="stat-value">
      {failedCount}
    </div>
  </div>
</div>


  </section>
)}
      <section className="card">
  <div className="card-header">
    <div>
      <h2>{isAdmin ? "All Deployments" : "My Deployments"}</h2>

  <p>
    {isAdmin
      ? "View and manage all deployed applications."
      : "View your deployed application "}
  </p>
</div>

<button
  type="button"
  className="btn-secondary"
  onClick={loadApplications}
  disabled={loadingApplications}
>
  <RefreshCw size={15} />
  Refresh
</button>


  </div>

  <div className="table-container">
    <table>
      <thead>
        {isAdmin ? (
          <tr>
            <th>Application</th>
            <th>Source</th>
            <th>Runtime</th>
            <th>Instance</th>
            <th>Status</th>
            <th>Created</th>
            <th>Application URL</th>
            <th>Actions</th>
          </tr>
        ) : (
          <tr>
            <th>Application Name</th>
            <th>Status</th>
            <th>Application URL</th>
          </tr>
        )}
      </thead>


  <tbody>
    {loadingApplications ? (
      <tr>
        <td colSpan={isAdmin ? 8 : 3}>
          Loading deployments...
        </td>
      </tr>
    ) : applications.length === 0 ? (
      <tr>
        <td colSpan={isAdmin ? 8 : 3}>
          No deployments found.
        </td>
      </tr>
    ) : (
      applications.map((app) => {
        const status = String(
          app.status || "UNKNOWN"
        ).toUpperCase();

        const url = app.applicationUrl || app.url || "";
        const running = status === "RUNNING";
        const busy = busyId === app.id;

        const instance = instances.find(
          (item) =>
            String(item.id) === String(app.instanceId)
        );

        return (
          <tr key={app.id}>
            {/* Application name — both roles */}
            <td>
              <strong>{app.name || "-"}</strong>

              {isAdmin && (
                <small className="deployment-id">
                  ID: {app.id}
                </small>
              )}
            </td>

            {/* Admin-only information */}
            {isAdmin && (
              <>
                <td>{app.sourceType || "-"}</td>

                <td>
                  {app.runtime || app.projectType || "-"}
                </td>

                <td>
                  {app.instanceName ||
                    instance?.name ||
                    (app.instanceId
                      ? `Instance ${app.instanceId}`
                      : "Standalone")}
                </td>
              </>
            )}

            {/* Status — both roles */}
            <td>
              <span
                className={
                  "deployment-status status-" +
                  status.toLowerCase()
                }
              >
                {status}
              </span>
            </td>

            {/* Admin-only creation date */}
            {isAdmin && (
              <td>{formatDate(app.createdAt)}</td>
            )}

            {/* Application URL — both roles */}
            <td>
              {url && running ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Application
                  <ExternalLink size={13} />
                </a>
              ) : (
                "-"
              )}
            </td>

            {/* Admin-only actions */}
            {isAdmin && (
              <td>
                <div className="action-buttons">
                  {running ? (
                    <button
                      type="button"
                      className="btn-stop"
                      disabled={busy}
                      onClick={() =>
                        performApplicationAction(
                          app.id,
                          "stop"
                        )
                      }
                    >
                      <Square size={13} />
                      Stop
                    </button>
                  ) : status === "STOPPED" ||
                    status === "FAILED" ? (
                    <button
                      type="button"
                      className="btn-start"
                      disabled={busy}
                      onClick={() =>
                        performApplicationAction(
                          app.id,
                          "start"
                        )
                      }
                    >
                      <Play size={13} />
                      Start
                    </button>
                  ) : null}

                  <button
                    type="button"
                    className="delete-button"
                    disabled={busy}
                    onClick={() =>
                      performApplicationAction(
                        app.id,
                        "delete"
                      )
                    }
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </td>
            )}
          </tr>
        );
      })
    )}
  </tbody>
</table>
  </div>
</section>
    </main>
  </div>
</div>


);
}

export default Deployment;
 