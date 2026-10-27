import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../services/api";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const navigate = useNavigate();

 
/*const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/auth/login", {
      username:email,
      password:password,
    });

    // ✅ FIX: use res.data (NOT data)
    const userData = res.data;

    if (!userData.token) {
      alert("Login failed");
      return;
    }

   

  //  localStorage.setItem("user", JSON.stringify(userData));
 
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify({
  token: res.data.token
}));
    if (!res || !res.data || !res.data.token) {
  alert("Invalid response from server");
  return;
}

 // ✅ STORE TOKEN HERE
//localStorage.setItem("user", JSON.stringify(res.data));

    navigate("/dashboard");

  } catch (err) {
    console.log(err);
    alert(err.response?.data || "Login failed");
  }
};*/
const handleLogin = async (e) => {
e.preventDefault();

try {
const res = await api.post("/auth/login", {
username: email,
password: password,
});


const data = res.data;

if (!data?.token) {
  alert("Login failed: token was not returned.");
  return;
}

// Store the JWT token.
localStorage.setItem("token", data.token);

// Save the user details and role returned by your backend.
localStorage.setItem(
  "user",
  JSON.stringify({
    username: data.username,
    email: data.email,
    role: String(data.role || "USER").toUpperCase(),
    token: data.token,
  })
);

// Navigate according to the user's role.
const role = String(data.role || "USER").toUpperCase();

if (role === "ADMIN") {
  navigate("/admin");
} else {
  navigate("/dashboard");
}


} catch (err) {
console.error("Login failed:", err);


alert(
  typeof err.response?.data === "string"
    ? err.response.data
    : err.response?.data?.message || "Login failed."
);


}
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