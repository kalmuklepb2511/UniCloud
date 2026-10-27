/*import { useEffect, useState } from "react";
import {
  Plus,
  Play,
  Square,
  Trash2,
  Server
} from "lucide-react";

import api from "../services/api";
function EC2() {
  const [showForm, setShowForm] = useState(false);
  const [vms, setVms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newVM, setNewVM] = useState({
    name: "",
    image: "nginx:latest",
    instanceType: "t2.micro",
    port: 8081
  });
  // GET JWT TOKEN
  const getToken = () => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      return null;
    }

    try {
      const user = JSON.parse(stored);
      return user?.token || null;
    } catch (error) {
      console.error("Invalid user in localStorage:", error);
      return null;
    }
  };
  // AUTH HEADERS
  const getAuthConfig = () => {
    const token = getToken();

    if (!token) {
      return null;
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };
const getErrorMessage = (error) => {
  const data = error.response?.data;

  if (typeof data === "string") {
    return data;
  }

  if (data?.message) {
    return data.message;
  }

  if (data?.error) {
    return data.error;
  }

  return error.message || "An unexpected error occurred.";
};
  // LOAD MY VMS
  // GET /instances/my

  const loadVMs = async () => {
    const config = getAuthConfig();

   if (!config) {
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(
        "/instances/my",
        config
      );

      console.log("VM API response:", response.data);

      
       // Make sure we always have an array.
      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setVms(data);

    } catch (error) {
      console.error(
        "Failed to load VMs:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      if (error.response?.status === 403) {
        alert(
          "You are authenticated but do not have permission to access VMs."
        );
      }

    } finally {
      setLoading(false);
    }
  };
  // LOAD VMS WHEN PAGE OPENS
  useEffect(() => {
    loadVMs();
  }, []);
  // CREATE VM
  // POST /instances/create
  const createVM = async (e) => {
    e.preventDefault();

    if (!newVM.name.trim()) {
      alert("Please enter VM name.");
      return;
    }

    const config = getAuthConfig();

    if (!config) {
      window.location.href = "/login";
      return;
    }

    try {
      setCreating(true);

      const requestBody = {
        name: newVM.name.trim(),
        image: newVM.image,
        instanceType: newVM.instanceType,
        port: Number(newVM.port)
      };

      console.log("Creating VM:", requestBody);

      const response = await api.post(
        "/instances/create",
        requestBody,
        config
      );

      console.log("Created VM:", response.data);

      alert("VM created successfully!");

      // Reset form
      setNewVM({
        name: "",
        image: "nginx:latest",
        instanceType: "t2.micro",
        port: 8081
      });

      setShowForm(false);

      // Reload VM list
      await loadVMs();

    } catch (error) {
      console.error(
        "VM creation failed:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      if (error.response?.status === 403) {
        alert("You don't have permission to create a VM.");
        return;
      }

    // alert(
       // error.response?.data?.message ||
       // error.response?.data ||
        //"VM creation failed."
      //);
      alert(getErrorMessage(error));

    } finally {
      setCreating(false);
    }
  };
  // START VM
  // POST /instances/start/{id}
  const startVM = async (id) => {
    const config = getAuthConfig();

    if (!config) {
      window.location.href = "/login";
      return;
    }

    try {
      await api.post(
        `/instances/start/${id}`,
        {},
        config
      );

      await loadVMs();

    } catch (error) {
      console.error(
        "Start VM error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to start VM."
      );
    }
  };
  // STOP VM
  // POST /instances/stop/{id}
  const stopVM = async (id) => {
    const config = getAuthConfig();

    if (!config) {
      window.location.href = "/login";
      return;
    }

    try {
      await api.post(
        `/instances/stop/${id}`,
        {},
        config
      );

      await loadVMs();

    } catch (error) {
      console.error(
        "Stop VM error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to stop VM."
      );
    }
  };
  // DELETE VM
  // DELETE /instances/delete/{id}
  const deleteVM = async (id) => {
    if (!window.confirm("Are you sure you want to delete this VM?")) {
      return;
    }

    const config = getAuthConfig();

    if (!config) {
      window.location.href = "/login";
      return;
    }

    try {
      await api.delete(
        `/instances/delete/${id}`,
        config
      );

      await loadVMs();

    } catch (error) {
      console.error(
        "Delete VM error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete VM."
      );
    }
  };
  // NORMALIZE STATUS
  const isRunning = (status) => {
    return String(status || "").toUpperCase() === "RUNNING";
  };
  // FORMAT DATE
  const formatDate = (createdAt) => {
    if (!createdAt) {
      return "-";
    }

    try {
      return new Date(createdAt).toLocaleString();
    } catch {
      return createdAt;
    }
  };
  // RENDER
  return (
    <div>

        //  PAGE HEADER
      <div className="page-header">

        <div>
          <h1>EC2 – Virtual Machines</h1>

          <p>
            Manage your Docker-based virtual machines
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          <Plus size={17} />
          Create VM
        </button>

      </div>


//          VM STATISTICS
      <div className="vm-stats">

        <div className="card vm-stat">

          <Server size={25} />

          <div>
            <p>Total VMs</p>
            <h2>{vms.length}</h2>
          </div>

        </div>

        <div className="card vm-stat">

          <Play size={25} />

          <div>
            <p>Running</p>

            <h2>
              {
                vms.filter(
                  (vm) => isRunning(vm.status)
                ).length
              }
            </h2>

          </div>

        </div>


        <div className="card vm-stat">

          <Square size={25} />

          <div>
            <p>Stopped</p>

            <h2>
              {
              //  vms.filter(
              //    (vm) => !isRunning(vm.status)
              //  ).length
               vms.filter(
  (vm) => String(vm.status || "").toUpperCase() === "STOPPED"
).length 
              }

            </h2>

          </div>

        </div>

      </div>


          //CREATE VM FORM
      {showForm && (

        <div className="create-vm-card card">

          <div className="form-header">

            <h2>Create New VM</h2>

            <button
              type="button"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>

          </div>


          <form onSubmit={createVM}>

            <div className="form-grid">


              //VM NAME

              <div>

                <label>VM Name</label>

                <input
                  type="text"
                  placeholder="Example: Ubuntu Server"
                  value={newVM.name}
                  onChange={(e) =>
                    setNewVM({
                      ...newVM,
                      name: e.target.value
                    })
                  }
                />

              </div>
              // DOCKER IMAGE

              <div>

                <label>Docker Image</label>

                <select
                  value={newVM.image}
                  onChange={(e) =>
                    setNewVM({
                      ...newVM,
                      image: e.target.value
                    })
                  }
                >

                  <option value="ubuntu:22.04">
                    Ubuntu 22.04
                  </option>

                  <option value="ubuntu:latest">
                    Ubuntu Latest
                  </option>

                  <option value="nginx:latest">
                    Nginx Latest
                  </option>

                  <option value="python:3.10">
                    Python 3.10
                  </option>

                </select>

              </div>


              //INSTANCE TYPE 

              <div>

                <label>Instance Type</label>

                <select
                  value={newVM.instanceType}
                  onChange={(e) =>
                    setNewVM({
                      ...newVM,
                      instanceType: e.target.value
                    })
                  }
                >

                  <option value="t2.micro">
                    t2.micro
                  </option>

                  <option value="t2.medium">
                    t2.medium
                  </option>

                </select>

              </div>


              //HOST PORT 

              <div>

                <label>Host Port</label>

                <input
                  type="number"
                  min="1024"
                  max="65535"
                  value={newVM.port}
                  onChange={(e) =>
                    setNewVM({
                      ...newVM,
                      port: Number(e.target.value)
                    })
                  }
                />

                <small>
                  Do not use 8080 because Spring Boot is
                  running on port 8080.
                </small>

              </div>


            </div>


            <button
              type="submit"
              className="btn-primary"
              disabled={creating}
            >
              {creating ? "Creating..." : "Create VM"}
            </button>

          </form>

        </div>

      )}
       //   VM TABLE
      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>VM ID</th>
              <th>Name</th>
              <th>Docker Image</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Type</th>
              <th>Port</th>
              <th>URL</th>
              <th>Actions</th>

            </tr>

          </thead>
          <tbody>

            {loading ? (

              <tr>

                <td colSpan="9">
                  Loading VMs...
                </td>

              </tr>

            ) : vms.length === 0 ? (

              <tr>

                <td colSpan="9">
                  No VMs found.
                </td>

              </tr>

            ) : (

              vms.map((vm, index) => {

                const running = isRunning(vm.status);

                const rowKey =
                  vm.id ??
                  vm.containerId ??
                  `vm-${index}`;

                return (

                  <tr key={rowKey}>

                    //VM ID

                    <td>
                      <strong>
                        {vm.id ?? "-"}
                      </strong>
                    </td>
                    // NAME

                    <td>
                      {vm.name || "-"}
                    </td>

                    // DOCKER IMAGE

                    <td>
                      <code>
                        {vm.image || "-"}
                      </code>
                    </td>


                    //STATUS

                    <td>

                      <span
                        className={
                          running
                            ? "status status-running"
                            : "status status-stopped"
                        }
                      >
                        {String(vm.status || "STOPPED").toUpperCase()}
                      </span>

                    </td>


                    //CREATED

                    <td>
                      {formatDate(vm.createdAt)}
                    </td>


                    //INSTANCE TYPE

                    <td>
                      {vm.instanceType || "-"}
                    </td>


                    //PORT

                    <td>
                      {vm.port || "-"}
                    </td>


                    //URL

                    <td>

                      {vm.port ? (

                        <a
                          href={`http://localhost:${vm.port}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          http://localhost:{vm.port}
                        </a>

                      ) : (
                        "-"
                      )}

                    </td>


                    //ACTIONS

                    <td>

                      <div className="action-buttons">

                        <button
                          className={
                            running
                              ? "btn-stop"
                              : "btn-start"
                          }
                          onClick={() =>
                            running
                              ? stopVM(vm.id)
                              : startVM(vm.id)
                          }
                        >

                          {running ? (

                            <>
                              <Square size={14} />
                              Stop
                            </>

                          ) : (

                            <>
                              <Play size={14} />
                              Start
                            </>

                          )}

                        </button>


                        <button
                          className="delete-button"
                          onClick={() =>
                            deleteVM(vm.id)
                          }
                        >

                          <Trash2 size={14} />

                          Delete

                        </button>

                      </div>

                    </td>

                  </tr>

                );

              })

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default EC2;*/

import { useEffect, useState } from "react";
import {
Plus,
Play,
Square,
Trash2,
Server,
RefreshCw,
} from "lucide-react";

import api from "../services/api";
import { isAdminUser } from "../utils/auth";
function EC2() {
const isAdmin = isAdminUser();
const [showForm, setShowForm] = useState(false);
const [vms, setVms] = useState([]);
const [loading, setLoading] = useState(false);
const [creating, setCreating] = useState(false);
const [newVM, setNewVM] = useState({
name: "",
image: "nginx:latest",
instanceType: "t2.micro",
port: 8081,
});

const user = (() => {
try {
return JSON.parse(localStorage.getItem("user") || "null");
} catch {
return null;
}
})();

const role = String(user?.role || "")
.replace(/^ROLE_/, "")
.toUpperCase();

//const isAdmin = role === "ADMIN";

const getToken = () => {
return (
localStorage.getItem("token") ||
user?.token ||
null
);
};

const getAuthConfig = () => {
const token = getToken();


if (!token) {
  return null;
}

return {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};


};

const getErrorMessage = (error) => {
const data = error.response?.data;


if (typeof data === "string") return data;
if (data?.message) return data.message;
if (data?.error) return data.error;

return error.message || "An unexpected error occurred.";


};

const isRunning = (status) =>
String(status || "").toUpperCase() === "RUNNING";

/*const getVMUrl = (vm) => {
if (vm.applicationUrl || vm.url) {
return vm.applicationUrl || vm.url;
}


if (vm.port) {
  return `http://localhost:${vm.port}`;
}

return null;


};*/const getVMUrl = (vm) => {
  // Prefer the application URL returned by the backend.
  if (vm.applicationUrl || vm.url) {
    return vm.applicationUrl || vm.url;
  }

  // Use the actual Docker host port returned by the backend.
  if (vm.hostPort) {
    return `http://localhost:${vm.hostPort}`;
  }

  // Fallback for existing instance records.
  if (vm.port) {
    return `http://localhost:${vm.port}`;
  }

  return null;
};

// USER: load only their own instances.
// ADMIN: load every instance.
const loadVMs = async () => {
const config = getAuthConfig();


if (!config) {
  window.location.href = "/login";
  return;
}

try {
  setLoading(true);

  const endpoint = isAdmin
    ? "/instances/all"
    : "/instances/my";

  const response = await api.get(endpoint, config);
console.log("Instance data:", response.data);
  setVms(
    Array.isArray(response.data)
      ? response.data
      : []
  );
} catch (error) {
  console.error("Failed to load instances:", error);

  if (error.response?.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return;
  }

  alert(getErrorMessage(error));
} finally {
  setLoading(false);
}


};

useEffect(() => {
loadVMs();
}, []);

// Both roles can create instances.
const createVM = async (e) => {
e.preventDefault();


if (!newVM.name.trim()) {
  alert("Please enter an instance name.");
  return;
}

const config = getAuthConfig();

if (!config) {
  window.location.href = "/login";
  return;
}

try {
  setCreating(true);

  await api.post(
    "/instances/create",
    {
      name: newVM.name.trim(),
      image: newVM.image,
      instanceType: newVM.instanceType,
      port: Number(newVM.port),
    },
    config
  );

  alert("Instance created successfully!");

  setNewVM({
    name: "",
    image: "nginx:latest",
    instanceType: "t2.micro",
    port: 8081,
  });

  setShowForm(false);

  await loadVMs();
} catch (error) {
  console.error("Instance creation failed:", error);
  alert(getErrorMessage(error));
} finally {
  setCreating(false);
}


};

// ADMIN ONLY
const startVM = async (id) => {
if (!isAdmin) return;


const config = getAuthConfig();
if (!config) return;

try {
  await api.post(`/instances/start/${id}`, {}, config);
  await loadVMs();
} catch (error) {
  alert(getErrorMessage(error));
}


};

// ADMIN ONLY
const stopVM = async (id) => {
if (!isAdmin) return;

const config = getAuthConfig();
if (!config) return;

try {
  await api.post(`/instances/stop/${id}`, {}, config);
  await loadVMs();
} catch (error) {
  alert(getErrorMessage(error));
}


};

// ADMIN ONLY
const deleteVM = async (id) => {
if (!isAdmin) return;


if (!window.confirm("Delete this instance permanently?")) {
  return;
}

const config = getAuthConfig();
if (!config) return;

try {
  await api.delete(`/instances/delete/${id}`, config);
  await loadVMs();
} catch (error) {
  alert(getErrorMessage(error));
}


};

const formatDate = (date) => {
if (!date) return "-";

const parsed = new Date(date);

return Number.isNaN(parsed.getTime())
  ? "-"
  : parsed.toLocaleString();

};

return ( <div> <div className="page-header"> <div> <h1>
{isAdmin ? "Instance Management" : "EC2 Instances"} </h1>


      <p>
        {isAdmin
          ? "View and manage all cloud instances."
          : "View your instances and access your applications."}
      </p>
    </div>
    {/*  isAdmin && (*/}


    <button
      type="button"
      className="btn-primary"
      onClick={() => setShowForm((previous) => !previous)}
    >
      <Plus size={17} />
      Create Instance
    </button>
{/*)}*/}

  </div>

  {/* Only ADMIN sees instance statistics. */}
  {isAdmin && (
    <div className="vm-stats">
      <div className="card vm-stat">
        <Server size={25} />
        <div>
          <p>Total Instances</p>
          <h2>{vms.length}</h2>
        </div>
      </div>

      <div className="card vm-stat">
        <Play size={25} />
        <div>
          <p>Running</p>
          <h2>
            {vms.filter((vm) => isRunning(vm.status)).length}
          </h2>
        </div>
      </div>

      <div className="card vm-stat">
        <Square size={25} />
        <div>
          <p>Stopped</p>
          <h2>
            {
              vms.filter(
                (vm) =>
                  String(vm.status || "").toUpperCase() === "STOPPED"
              ).length
            }
          </h2>
        </div>
      </div>
    </div>
  )}

 {/* {isAdmin && showForm (*/}
 {showForm && (
    <div className="create-vm-card card">
      <div className="form-header">
        <h2>Create New Instance</h2>

        <button
          type="button"
          onClick={() => setShowForm(false)}
        >
          ✕
        </button>
      </div>

      <form onSubmit={createVM}>
        <div className="form-grid">
          <div>
            <label>Instance Name</label>
            <input
              value={newVM.name}
              onChange={(e) =>
                setNewVM({
                  ...newVM,
                  name: e.target.value,
                })
              }
              placeholder="Example: Student Web Server"
              required
            />
          </div>

          <div>
            <label>Docker Image</label>
            <select
              value={newVM.image}
              onChange={(e) =>
                setNewVM({
                  ...newVM,
                  image: e.target.value,
                })
              }
            >
              <option value="nginx:latest">Nginx Latest</option>
              <option value="ubuntu:22.04">Ubuntu 22.04</option>
              <option value="ubuntu:latest">Ubuntu Latest</option>
              <option value="python:3.10">Python 3.10</option>
            </select>
          </div>

          <div>
            <label>Instance Type</label>
            <select
              value={newVM.instanceType}
              onChange={(e) =>
                setNewVM({
                  ...newVM,
                  instanceType: e.target.value,
                })
              }
            >
              <option value="t2.micro">t2.micro</option>
              <option value="t2.medium">t2.medium</option>
            </select>
          </div>

          <div>
            <label>Port</label>
            <input
              type="number"
              min="8081"
              max="1000"
              value={newVM.port}
              onChange={(e) =>
                setNewVM({
                  ...newVM,
                  port: Number(e.target.value),
                })
              }
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={creating}
        >
          {creating ? "Creating..." : "Create Instance"}
        </button>
      </form>
    </div>
  )}

  <div className="table-container">
    <table>
      <thead>
        {isAdmin ? (
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Docker Image</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Type</th>
            <th>Port</th>
            <th>URL</th>
            <th>Actions</th>
          </tr>
        ) : (
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>URL</th>
          </tr>
        )}
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan={isAdmin ? 9 : 3}>
              Loading instances...
            </td>
          </tr>
        ) : vms.length === 0 ? (
          <tr>
            <td colSpan={isAdmin ? 9 : 3}>
              No instances found.
            </td>
          </tr>
        ) : (
          vms.map((vm, index) => {
            const running = isRunning(vm.status);
            const url = getVMUrl(vm);

            return (
              <tr key={vm.id ?? vm.containerId ?? index}>
                {isAdmin && (
                  <>
                    <td>{vm.id ?? "-"}</td>
                    <td>{vm.name || vm.containerName || "-"}</td>
                    <td>
                      <code>{vm.image || "-"}</code>
                    </td>
                  </>
                )}

                {!isAdmin && (
                  <td>{vm.name || vm.containerName || "-"}</td>
                )}

                <td>
                  <span
                    className={
                      running
                        ? "status status-running"
                        : "status status-stopped"
                    }
                  >
                    {String(vm.status || "UNKNOWN").toUpperCase()}
                  </span>
                </td>

                {isAdmin && (
                  <>
                    <td>{formatDate(vm.createdAt)}</td>
                    <td>{vm.instanceType || "-"}</td>
                    <td>{vm.port ?? "-"}</td>
                  </>
                )}

                <td>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Application ↗
                    </a>
                  ) : (
                    "-"
                  )}
                </td>

                {isAdmin && (
                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className={running ? "btn-stop" : "btn-start"}
                        onClick={() =>
                          running
                            ? stopVM(vm.id)
                            : startVM(vm.id)
                        }
                      >
                        {running ? (
                          <>
                            <Square size={14} />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play size={14} />
                            Start
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => deleteVM(vm.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>

                      <button
                        type="button"
                        onClick={loadVMs}
                        title="Refresh"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
</div>


);
}

export default EC2;
