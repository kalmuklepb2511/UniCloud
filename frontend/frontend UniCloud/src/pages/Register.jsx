import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Temporary frontend registration
    localStorage.setItem(
      "registeredUser",
      JSON.stringify({
        fullName,
        email,
        password,
        role,
      })
    );

    alert(`Account created successfully as ${role}!`);

    navigate("/login");
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
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
                <option value="Student">Student</option>
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
              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
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