import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("Student");

  const [error, setError] = useState("");

  
  
  const handleRegister = async (e) => {
  e.preventDefault();
  setError("");

  if (!username || !email || !password || !mobile || !role) {
    setError("Please fill all fields.");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

 /* if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }*/

  try {
    // Convert frontend role → backend role
    const backendRole = role === "Admin" ? "ADMIN" : "USER";

    const response = await api.post("/auth/register", {
      username: username,
      email: email,
      password: password,
      mobile: mobile,
      role: backendRole,
    });

    alert(response.data); // backend returns string

    navigate("/login");

  } catch (error) {
    console.error(error);

    const message =
      error.response?.data ||
      "Registration failed";

    setError(message);
  }
};

  return (
    <div className="register-page">

      {/* LEFT SIDE */}
      <div className="register-left">

        <div className="register-brand">
          <div className="register-logo">☁️</div>

          <div>
            <h1>UniCloud</h1>
            <p>Your College Cloud Platform</p>
          </div>
        </div>

        <div className="register-description">
          <h2>Join UniCloud</h2>

          <p>
            Create your account and manage your college
            cloud resources from one platform.
          </p>

          <div className="register-features">
            <div>☁️ Private Cloud</div>
            <div>🖥 Virtual Machines</div>
            <div>💾 Cloud Storage</div>
            <div>🚀 Application Deployment</div>
            <div>🗄 Database Services</div>
          </div>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="register-right">

        <div className="register-card">

          <div className="register-header">
            <h2>Create Account</h2>
            <p>Register for your UniCloud account</p>
          </div>

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>

            {/* FULL NAME */}
            <div className="register-field">
              <label>Username</label>

              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* EMAIL */}
            <div className="register-field">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* ROLE */}
            <div className="register-field">
              <label>Account Type</label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Student">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* PASSWORD */}
            <div className="register-field">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="register-field">
              <label>Mobile</label>

              <input
                type="text"
                placeholder="Enter mobile no."
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value)
                }
              />
            </div>

            {/* CREATE ACCOUNT */}
            <button
              type="submit"
              className="register-button"
            >
              Create Account
            </button>

          </form>

          <div className="register-login">
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;