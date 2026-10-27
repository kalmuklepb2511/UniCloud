{/*import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import EC2 from "./pages/EC2";
import Storage from "./pages/Storage";
import Deployment from "./pages/Deployment";
import Database from "./pages/Database";
import Users from "./pages/Users";
import Monitoring from "./pages/Monitoring";
import Billing from "./pages/Billing";
import Admin from "./pages/Admin";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
       //login
        <Route path="/login" element={<Login />} />

        // Dashboard
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        // Default
        <Route path="/" element={<Navigate to="/login" />} />

        //EC2
        <Route
          path="/ec2"
          element={
            <Layout>
              <EC2 />
            </Layout>
          }
        />

               //s3 storage
        <Route
          path="/storage"
          element={
            <Layout>
              <Storage />
            </Layout>
          }
        />

        //PAAS Deployment
        <Route
          path="/deployment"
          element={
            <layout>
              <Deployment />
            </layout>
          }
        />
        //Database
        <Route
          path="/database"
          element={
            <Layout>
              <Database />
            </Layout>
          }
        />
        //IAM & Users
        <Route path="/users" element={<Users />} />
        //monitoring
        <Route path="/monitoring" element={<Monitoring />} />
        //Billing
        <Route path="/billing" element={<Billing />} />

//admin panel
        <Route path="/admin" element={<Admin />} />
        //Register
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;*/}


import {
BrowserRouter,
Routes,
Route,
Navigate,
Outlet,
} from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import EC2 from "./pages/EC2";
import Storage from "./pages/Storage";
import Deployment from "./pages/Deployment";
import Database from "./pages/Database";
import Users from "./pages/Users";
import Monitoring from "./pages/Monitoring";
import Billing from "./pages/Billing";
import Admin from "./pages/Admin";
import Register from "./pages/Register";

function getCurrentUser() {
try {
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");


if (!token || !user) return null;

return {
  ...user,
  role: String(user.role || "")
    .replace(/^ROLE_/, "")
    .toUpperCase(),
};


} catch {
return null;
}
}

function RequireAuth({ allowedRoles }) {
const user = getCurrentUser();

if (!user) {
return <Navigate to="/login" replace />;
}

if (allowedRoles && !allowedRoles.includes(user.role)) {
return (
<Navigate
to={user.role === "ADMIN" ? "/admin" : "/dashboard"}
replace
/>
);
}

return <Outlet />;
}

function UserLayout({ children }) {
return <Layout>{children}</Layout>;
}

function App() {
return ( <BrowserRouter> <Routes>
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />


    <Route element={<RequireAuth allowedRoles={["USER", "ADMIN"]} />}>
      <Route
        path="/dashboard"
        element={
          <UserLayout>
            <Dashboard />
          </UserLayout>
        }
      />

      <Route
        path="/ec2"
        element={
          <UserLayout>
            <EC2 />
          </UserLayout>
        }
      />

      <Route
        path="/storage"
        element={
          <UserLayout>
            <Storage />
          </UserLayout>
        }
      />

      <Route
        path="/deployment"
        element={
          <UserLayout>
            <Deployment />
          </UserLayout>
        }
      />

      <Route
        path="/database"
        element={
          <UserLayout>
            <Database />
          </UserLayout>
        }
      />

      <Route
        path="/billing"
        element={
          <UserLayout>
            <Billing />
          </UserLayout>
        }
      />
    </Route>

    <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
      <Route path="/admin" element={<Admin />} />

      <Route
        path="/users"
        element={
          <UserLayout>
            <Users />
          </UserLayout>
        }
      />

      <Route
        path="/monitoring"
        element={
          <UserLayout>
            <Monitoring />
          </UserLayout>
        }
      />
    </Route>

    <Route path="/" element={<HomeRedirect />} />
    <Route path="*" element={<HomeRedirect />} />
  </Routes>
</BrowserRouter>


);
}

function HomeRedirect() {
const user = getCurrentUser();

if (!user) {
return <Navigate to="/login" replace />;
}

return (
<Navigate
to={user.role === "ADMIN" ? "/admin" : "/dashboard"}
replace
/>
);
}

export default App;


