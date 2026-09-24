import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Users() {
  const [users, setUsers] = useState([
    {
      id: "usr-001",
      name: "Vachanashree",
      email: "vachanashree@unicloud.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: "usr-002",
      name: "Student User",
      email: "student@unicloud.com",
      role: "User",
      status: "Active",
    },
    {
      id: "usr-003",
      name: "Faculty User",
      email: "faculty@unicloud.com",
      role: "User",
      status: "Inactive",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [password, setPassword] = useState("");

  // Create User
  const createUser = () => {
    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    const newUser = {
      id: `usr-${String(users.length + 1).padStart(3, "0")}`,
      name: name,
      email: email,
      role: role,
      status: "Active",
    };

    setUsers([...users, newUser]);

    setName("");
    setEmail("");
    setPassword("");
    setRole("User");
    setShowForm(false);

    alert("User created successfully!");
  };

  // Activate / Deactivate
  const toggleUser = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : user
      )
    );
  };

  // Delete
  const deleteUser = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    setUsers(users.filter((user) => user.id !== id));
  };

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.status === "Inactive"
  ).length;

  const adminUsers = users.filter(
    (user) => user.role === "Admin"
  ).length;

  return (
    <div className="app-layout">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">

        {/* Navbar */}
        <Navbar />

        <main className="page-content">

          {/* Header */}
          <div className="page-header">

            <div>
              <h1>IAM & Users</h1>

              <p>
                Manage UniCloud users and access permissions
              </p>
            </div>

            <button
              className="btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              + Create User
            </button>

          </div>

          {/* Create User Form */}
          {showForm && (
            <div className="card user-form">

              <div className="card-header">

                <div>
                  <h2>Create New User</h2>
                  <span>
                    Add a user to your UniCloud platform
                  </span>
                </div>

                <button
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  ✕
                </button>

              </div>

              <div className="form-grid">

                <div className="form-group">
                  <label>Full Name</label>

                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>

                  <input
                    type="email"
                    placeholder="user@unicloud.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>

                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>

                  <select
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value)
                    }
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

              </div>

              <button
                className="btn-primary"
                onClick={createUser}
              >
                Create User
              </button>

            </div>
          )}

          {/* Statistics */}
          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon">
                👥
              </div>

              <div>
                <div className="stat-title">
                  Total Users
                </div>

                <div className="stat-value">
                  {users.length}
                </div>

                <div className="stat-subtitle">
                  Registered users
                </div>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                🟢
              </div>

              <div>
                <div className="stat-title">
                  Active Users
                </div>

                <div className="stat-value">
                  {activeUsers}
                </div>

                <div className="stat-subtitle">
                  Currently active
                </div>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                🔴
              </div>

              <div>
                <div className="stat-title">
                  Inactive Users
                </div>

                <div className="stat-value">
                  {inactiveUsers}
                </div>

                <div className="stat-subtitle">
                  Disabled accounts
                </div>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                🛡️
              </div>

              <div>
                <div className="stat-title">
                  Administrators
                </div>

                <div className="stat-value">
                  {adminUsers}
                </div>

                <div className="stat-subtitle">
                  Admin accounts
                </div>
              </div>

            </div>

          </div>

          {/* Users Table */}
          <div className="card">

            <div className="card-header">

              <div>
                <h2>Users</h2>

                <span>
                  {users.length} registered users
                </span>
              </div>

            </div>

            <div className="table-container">

              <table>

                <thead>

                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {users.map((user) => (

                    <tr key={user.id}>

                      {/* User */}
                      <td>

                        <div className="user-row">

                          <div className="user-avatar">
                            {user.name.charAt(0)}
                          </div>

                          <div>
                            <strong>
                              {user.name}
                            </strong>

                            <small>
                              {user.id}
                            </small>
                          </div>

                        </div>

                      </td>

                      {/* Email */}
                      <td>
                        {user.email}
                      </td>

                      {/* Role */}
                      <td>

                        <span
                          className={
                            user.role === "Admin"
                              ? "role-admin"
                              : "role-user"
                          }
                        >
                          {user.role === "Admin"
                            ? "🛡 Admin"
                            : "👤 User"}
                        </span>

                      </td>

                      {/* Status */}
                      <td>

                        <span
                          className={
                            user.status === "Active"
                              ? "status-running"
                              : "status-stopped"
                          }
                        >
                          ● {user.status}
                        </span>

                      </td>

                      {/* Actions */}
                      <td>

                        <button
                          className={
                            user.status === "Active"
                              ? "btn-warning small-btn"
                              : "btn-success small-btn"
                          }
                          onClick={() =>
                            toggleUser(user.id)
                          }
                        >
                          {user.status === "Active"
                            ? "Disable"
                            : "Enable"}
                        </button>

                        <button
                          className="btn-danger small-btn"
                          onClick={() =>
                            deleteUser(user.id)
                          }
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

          {/* IAM Information */}
          <div className="card iam-info">

            <h2>UniCloud Access Control</h2>

            <div className="info-grid">

              <div>
                <strong>👤 Users</strong>

                <p>
                  Manage students, faculty and
                  administrators.
                </p>
              </div>

              <div>
                <strong>🛡 Roles</strong>

                <p>
                  Assign Admin or User permissions
                  to accounts.
                </p>
              </div>

              <div>
                <strong>🔐 Authentication</strong>

                <p>
                  Secure login will be connected to
                  Spring Boot and JWT.
                </p>
              </div>

              <div>
                <strong>🔒 Authorization</strong>

                <p>
                  Control access to UniCloud services
                  based on user roles.
                </p>
              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Users;