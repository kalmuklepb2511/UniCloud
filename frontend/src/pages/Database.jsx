import { useState } from "react";

function Database() {
  const [databases, setDatabases] = useState([
    {
      id: "db-001",
      name: "student-db",
      engine: "MySQL",
      version: "8.0",
      status: "Running",
      host: "localhost",
      port: "3306",
      username: "admin",
      storage: "5 GB",
    },
    {
      id: "db-002",
      name: "library-db",
      engine: "MySQL",
      version: "8.0",
      status: "Stopped",
      host: "localhost",
      port: "3307",
      username: "admin",
      storage: "10 GB",
    },
  ]);

  const [dbName, setDbName] = useState("");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [version, setVersion] = useState("8.0");
  const [storage, setStorage] = useState("5");

  const createDatabase = () => {
    if (!dbName || !username || !password) {
      alert("Please fill all required fields");
      return;
    }

    const newDatabase = {
      id: `db-${String(databases.length + 1).padStart(3, "0")}`,
      name: dbName,
      engine: "MySQL",
      version: version,
      status: "Running",
      host: "localhost",
      port: String(3306 + databases.length),
      username: username,
      storage: `${storage} GB`,
    };

    setDatabases([...databases, newDatabase]);

    setDbName("");
    setPassword("");

    alert("Database created successfully!");
  };

  const toggleDatabase = (id) => {
    setDatabases(
      databases.map((db) =>
        db.id === id
          ? {
              ...db,
              status: db.status === "Running" ? "Stopped" : "Running",
            }
          : db
      )
    );
  };

  const deleteDatabase = (id) => {
    if (window.confirm("Are you sure you want to delete this database?")) {
      setDatabases(databases.filter((db) => db.id !== id));
    }
  };

  const runningCount = databases.filter(
    (db) => db.status === "Running"
  ).length;

  const stoppedCount = databases.filter(
    (db) => db.status === "Stopped"
  ).length;

  return (
    <div className="database-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>RDS Database</h1>
          <p>Manage MySQL databases in UniCloud</p>
        </div>

        <button
          className="btn-primary"
          onClick={() =>
            document
              .getElementById("create-db-form")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          + Create Database
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-title">Total Databases</div>
          <div className="stat-value">{databases.length}</div>
          <div className="stat-subtitle">MySQL databases</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Running</div>
          <div className="stat-value">{runningCount}</div>
          <div className="stat-subtitle">Active databases</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Stopped</div>
          <div className="stat-value">{stoppedCount}</div>
          <div className="stat-subtitle">Inactive databases</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Storage</div>
          <div className="stat-value">
            {databases.reduce(
              (total, db) => total + parseInt(db.storage),
              0
            )} GB
          </div>
          <div className="stat-subtitle">Allocated storage</div>
        </div>

      </div>

      {/* Create Database */}
      <div className="card create-db-card" id="create-db-form">

        <div className="card-header">
          <h2>Create Database</h2>
          <span>MySQL Database Service</span>
        </div>

        <div className="form-grid">

          <div className="form-group">
            <label>Database Name</label>
            <input
              type="text"
              placeholder="e.g. student-db"
              value={dbName}
              onChange={(e) => setDbName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter database password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>MySQL Version</label>
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            >
              <option value="8.0">MySQL 8.0</option>
              <option value="8.4">MySQL 8.4</option>
            </select>
          </div>

          <div className="form-group">
            <label>Storage</label>
            <select
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
            >
              <option value="5">5 GB</option>
              <option value="10">10 GB</option>
              <option value="20">20 GB</option>
              <option value="50">50 GB</option>
            </select>
          </div>

        </div>

        <button className="btn-primary" onClick={createDatabase}>
          Create Database
        </button>

      </div>

      {/* Database List */}
      <div className="card">

        <div className="card-header">
          <h2>My Databases</h2>
          <span>{databases.length} databases</span>
        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Database</th>
                <th>Engine</th>
                <th>Status</th>
                <th>Host</th>
                <th>Port</th>
                <th>Storage</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {databases.map((db) => (
                <tr key={db.id}>

                  <td>
                    <strong>{db.name}</strong>
                    <small>{db.id}</small>
                  </td>

                  <td>
                    {db.engine} {db.version}
                  </td>

                  <td>
                    <span
                      className={
                        db.status === "Running"
                          ? "status-running"
                          : "status-stopped"
                      }
                    >
                      ● {db.status}
                    </span>
                  </td>

                  <td>{db.host}</td>

                  <td>{db.port}</td>

                  <td>{db.storage}</td>

                  <td>

                    <button
                      className={
                        db.status === "Running"
                          ? "btn-danger small-btn"
                          : "btn-success small-btn"
                      }
                      onClick={() => toggleDatabase(db.id)}
                    >
                      {db.status === "Running" ? "Stop" : "Start"}
                    </button>

                    <button
                      className="btn-danger small-btn"
                      onClick={() => deleteDatabase(db.id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Connection Information */}
      <div className="card connection-card">

        <div className="card-header">
          <h2>Database Connection</h2>
          <span>Example connection details</span>
        </div>

        <div className="connection-box">
          <p>
            <strong>Host:</strong> localhost
          </p>

          <p>
            <strong>Port:</strong> 3306
          </p>

          <p>
            <strong>Engine:</strong> MySQL
          </p>

          <p>
            <strong>Example JDBC URL:</strong>
          </p>

          <code>
            jdbc:mysql://localhost:3306/student-db
          </code>
        </div>

      </div>

    </div>
  );
}

export default Database;