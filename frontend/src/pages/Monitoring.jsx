import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Monitoring() {

  const [cpu, setCpu] = useState(62);
  const [ram, setRam] = useState(71);
  const [storage, setStorage] = useState(36);

  const [containers, setContainers] = useState([
    {
      id: "ctr-001",
      name: "student-portal",
      image: "node:20",
      status: "Running",
      cpu: "18%",
      memory: "420 MB",
    },
    {
      id: "ctr-002",
      name: "college-website",
      image: "python:3.10",
      status: "Running",
      cpu: "12%",
      memory: "310 MB",
    },
    {
      id: "ctr-003",
      name: "student-db",
      image: "mysql:8.0",
      status: "Running",
      cpu: "24%",
      memory: "680 MB",
    },
    {
      id: "ctr-004",
      name: "library-system",
      image: "openjdk:17",
      status: "Stopped",
      cpu: "0%",
      memory: "0 MB",
    },
  ]);

  const [chartData, setChartData] = useState([
    { time: "10:00", cpu: 45, ram: 58 },
    { time: "10:05", cpu: 51, ram: 62 },
    { time: "10:10", cpu: 48, ram: 65 },
    { time: "10:15", cpu: 60, ram: 68 },
    { time: "10:20", cpu: 55, ram: 69 },
    { time: "10:25", cpu: 62, ram: 71 },
    { time: "10:30", cpu: 59, ram: 70 },
  ]);

  // Demo monitoring update
  useEffect(() => {

    const interval = setInterval(() => {

      const newCpu = Math.floor(
        Math.random() * 20 + 50
      );

      const newRam = Math.floor(
        Math.random() * 15 + 60
      );

      const newStorage = Math.floor(
        Math.random() * 10 + 30
      );

      setCpu(newCpu);
      setRam(newRam);
      setStorage(newStorage);

      const currentTime = new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

      setChartData((oldData) => {

        const newData = [
          ...oldData,
          {
            time: currentTime,
            cpu: newCpu,
            ram: newRam,
          },
        ];

        return newData.slice(-7);
      });

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  const runningContainers = containers.filter(
    (container) => container.status === "Running"
  ).length;

  const stoppedContainers = containers.filter(
    (container) => container.status === "Stopped"
  ).length;

  const toggleContainer = (id) => {

    setContainers(
      containers.map((container) => {

        if (container.id === id) {

          const newStatus =
            container.status === "Running"
              ? "Stopped"
              : "Running";

          return {
            ...container,
            status: newStatus,
            cpu: newStatus === "Running" ? "10%" : "0%",
            memory: newStatus === "Running"
              ? "250 MB"
              : "0 MB",
          };
        }

        return container;

      })
    );
  };

  return (
    <div className="app-layout">

      {/* ================= SIDEBAR ================= */}

      <Sidebar />

      {/* ================= MAIN CONTENT ================= */}

      <div className="main-content">

        <Navbar />

        <main className="page-content">

          {/* ================= HEADER ================= */}

          <div className="page-header">

            <div>
              <h1>Monitoring</h1>

              <p>
                Monitor UniCloud system resources and services
              </p>
            </div>

            <div className="monitor-status">
              <span className="online-dot"></span>
              System Online
            </div>

          </div>

          {/* ================= RESOURCE CARDS ================= */}

          <div className="stats-grid">

            {/* CPU */}

            <div className="monitor-card">

              <div className="monitor-card-top">

                <div>
                  <div className="stat-title">
                    CPU Usage
                  </div>

                  <div className="monitor-value">
                    {cpu}%
                  </div>
                </div>

                <div className="monitor-icon">
                  ⚡
                </div>

              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${cpu}%` }}
                ></div>
              </div>

              <small>
                Processor utilization
              </small>

            </div>

            {/* RAM */}

            <div className="monitor-card">

              <div className="monitor-card-top">

                <div>
                  <div className="stat-title">
                    RAM Usage
                  </div>

                  <div className="monitor-value">
                    {ram}%
                  </div>
                </div>

                <div className="monitor-icon">
                  🧠
                </div>

              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${ram}%` }}
                ></div>
              </div>

              <small>
                Memory utilization
              </small>

            </div>

            {/* STORAGE */}

            <div className="monitor-card">

              <div className="monitor-card-top">

                <div>
                  <div className="stat-title">
                    Storage Usage
                  </div>

                  <div className="monitor-value">
                    {storage}%
                  </div>
                </div>

                <div className="monitor-icon">
                  💾
                </div>

              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${storage}%` }}
                ></div>
              </div>

              <small>
                Disk utilization
              </small>

            </div>

            {/* CONTAINERS */}

            <div className="monitor-card">

              <div className="monitor-card-top">

                <div>
                  <div className="stat-title">
                    Containers
                  </div>

                  <div className="monitor-value">
                    {runningContainers}
                  </div>
                </div>

                <div className="monitor-icon">
                  🐳
                </div>

              </div>

              <small>
                {runningContainers} running /{" "}
                {stoppedContainers} stopped
              </small>

            </div>

          </div>

          {/* ================= CHART ================= */}

          <div className="card monitoring-chart">

            <div className="card-header">

              <div>
                <h2>CPU & RAM Usage</h2>

                <span>
                  Real-time resource monitoring
                </span>
              </div>

              <span className="live-label">
                ● LIVE
              </span>

            </div>

            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <LineChart data={chartData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="time" />

                  <YAxis domain={[0, 100]} />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="cpu"
                    stroke="#1677ff"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    name="CPU %"
                  />

                  <Line
                    type="monotone"
                    dataKey="ram"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    name="RAM %"
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* ================= CONTAINERS ================= */}

          <div className="card">

            <div className="card-header">

              <div>
                <h2>Docker Containers</h2>

                <span>
                  {containers.length} containers
                </span>
              </div>

            </div>

            <div className="table-container">

              <table>

                <thead>

                  <tr>
                    <th>Container</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th>CPU</th>
                    <th>Memory</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {containers.map((container) => (

                    <tr key={container.id}>

                      <td>

                        <div className="container-name">

                          <div className="container-icon">
                            🐳
                          </div>

                          <div>
                            <strong>
                              {container.name}
                            </strong>

                            <small>
                              {container.id}
                            </small>
                          </div>

                        </div>

                      </td>

                      <td>
                        {container.image}
                      </td>

                      <td>

                        <span
                          className={
                            container.status === "Running"
                              ? "status-running"
                              : "status-stopped"
                          }
                        >
                          ● {container.status}
                        </span>

                      </td>

                      <td>
                        {container.cpu}
                      </td>

                      <td>
                        {container.memory}
                      </td>

                      <td>

                        <button
                          className={
                            container.status === "Running"
                              ? "btn-warning small-btn"
                              : "btn-success small-btn"
                          }
                          onClick={() =>
                            toggleContainer(container.id)
                          }
                        >
                          {container.status === "Running"
                            ? "Stop"
                            : "Start"}
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

          {/* ================= SYSTEM HEALTH ================= */}

          <div className="card system-health">

            <div className="card-header">

              <div>
                <h2>System Health</h2>

                <span>
                  UniCloud infrastructure status
                </span>
              </div>

            </div>

            <div className="health-grid">

              <div className="health-item">

                <span className="health-dot"></span>

                <div>
                  <strong>API Server</strong>
                  <small>Operational</small>
                </div>

              </div>

              <div className="health-item">

                <span className="health-dot"></span>

                <div>
                  <strong>Docker Engine</strong>
                  <small>Operational</small>
                </div>

              </div>

              <div className="health-item">

                <span className="health-dot"></span>

                <div>
                  <strong>MySQL Database</strong>
                  <small>Operational</small>
                </div>

              </div>

              <div className="health-item">

                <span className="health-dot"></span>

                <div>
                  <strong>S3 Storage</strong>
                  <small>Operational</small>
                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Monitoring;