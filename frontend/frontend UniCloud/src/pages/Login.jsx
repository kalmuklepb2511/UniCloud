import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Check empty fields
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    // Get registered user
    const registeredUser = JSON.parse(
      localStorage.getItem("registeredUser")
    );

    // Check if account exists
    if (!registeredUser) {
      alert("No account found. Please create an account first.");
      return;
    }

    // Check email and password
    if (
      email !== registeredUser.email ||
      password !== registeredUser.password
    ) {
      alert("Invalid email or password");
      return;
    }

    // Save logged-in user
    localStorage.setItem(
      "user",
      JSON.stringify({
        fullName: registeredUser.fullName,
        email: registeredUser.email,
        role: registeredUser.role,
      })
    );

    // Go to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="login-left">

        <div className="login-brand">

          <div className="login-logo">
            ☁️
          </div>

          <div>
            <h1>UniCloud</h1>
            <p>Your College Cloud Platform</p>
          </div>

        </div>

        <div className="login-description">

          <h2>Build. Deploy. Learn.</h2>

          <p>
            Your private cloud platform for smarter college infrastructure.
          </p>

          <div className="cloud-illustration">
            ☁️
          </div>

        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="login-right">

        <div className="login-card">

          <h2>Login to UniCloud</h2>

          <p className="login-subtitle">
            Access your cloud resources
          </p>


          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <label>
              Email / Username
            </label>

            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />


            {/* PASSWORD */}
            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />


            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-button"
            >
              Login
            </button>

          </form>


          {/* REGISTER LINK */}
          <div className="register-login">

            Don't have an account?{" "}

            <Link to="/register">
              Create Account
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;