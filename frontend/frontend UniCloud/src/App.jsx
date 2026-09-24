import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* EC2 */}
        <Route
          path="/ec2"
          element={
            <Layout>
              <EC2 />
            </Layout>
          }
        />

        {/*S3 storage */}
        <Route
          path="/storage"
          element={
            <Layout>
              <Storage />
            </Layout>
          }
        />

        {/*PAAS Deployment*/}
        <Route
          path="/deployment"
          element={
            <layout>
              <Deployment />
            </layout>
          }
        />
        {/*Database*/}
        <Route
          path="/database"
          element={
            <Layout>
              <Database />
            </Layout>
          }
        />
        {/*IAM & Users */}
        <Route path="/users" element={<Users />} />
        {/*Monitoring*/}
        <Route path="/monitoring" element={<Monitoring />} />
        {/*Billing*/}
        <Route path="/billing" element={<Billing />} />

        {/*Admin panel */}
        <Route path="/admin" element={<Admin />} />
        {/*Register */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
