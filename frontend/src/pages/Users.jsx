import { useEffect, useState } from "react";
import api from "../services/api"; 
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Users() {
 
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [password, setPassword] = useState("");

  // Create User

  const createUser = async () => {
if (!name.trim() || !email.trim() || !password) {
alert("Please fill all required fields.");
return;
}

try {
await api.post("/admin/users", {
username: name.trim(),
email: email.trim(),
password,
role: role.toUpperCase(),
});


await loadUsers();

setName("");
setEmail("");
setPassword("");
setRole("User");
setShowForm(false);

alert("User created successfully!");

} catch (err) {
console.error("Create user failed:", err.response?.data || err.message);


alert(
  err.response?.data?.error ||
  "Could not create user. Please check the backend."
);


}
};


  // Activate / Deactivate

  const toggleUser = async (id) => {
  const user = users.find((item) => item.id === id);

  if (!user) return;

  const newStatus = user.status === "Active" ? "INACTIVE" : "ACTIVE";

  try {
    await api.patch(`/admin/users/${id}/status`, {
      status: newStatus,
    });

    await loadUsers();
  } catch (err) {
    console.error("Update status failed:", err.response?.data || err.message);
    alert("Could not update user status.");
  }
};
const loadUsers = async () => {
try {
setLoading(true);
setError("");


const response = await api.get("/admin/users");

const mappedUsers = response.data.map((user) => ({
  id: user.id,
  name: user.username,
  email: user.email,
  role: user.role?.toUpperCase() === "ADMIN" ? "Admin" : "User",
  status: user.status?.toUpperCase() === "INACTIVE"
    ? "Inactive"
    : "Active",
}));

setUsers(mappedUsers);


} catch (err) {
console.error("Failed to load users:", err.response?.data || err.message);
setError(
err.response?.status === 403
? "You do not have permission to view users."
: "Could not load users. Check your login and backend connection."
);
} finally {
setLoading(false);
}
};

useEffect(() => {
loadUsers();
}, []);

{loading && <p>Loading users...</p>}

{error && <p role="alert">{error}</p>}


  // Delete
const deleteUser = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmed) return;

  try {
    await api.delete(`/admin/users/${id}`);
    await loadUsers();
    alert("User deleted successfully.");
  } catch (err) {
    console.error("Delete user failed:", err.response?.data || err.message);
    alert("Could not delete user.");
  }
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

      {/* Main Content */}
      <div className="main-content">

       
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