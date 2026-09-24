import { useState } from "react";
import { Plus, Play, Square, Trash2, Server } from "lucide-react";

function EC2() {

  const [showForm, setShowForm] = useState(false);

  const [vms, setVms] = useState([
    {
      id: "vm-001",
      name: "Ubuntu VM",
      image: "ubuntu:22.04",
      status: "Running",
      created: "23 Sep 2026, 10:15 AM"
    },
    {
      id: "vm-002",
      name: "Web Server",
      image: "nginx:latest",
      status: "Running",
      created: "23 Sep 2026, 11:30 AM"
    },
    {
      id: "vm-003",
      name: "Python VM",
      image: "python:3.10",
      status: "Stopped",
      created: "23 Sep 2026, 01:45 PM"
    }
  ]);

  const [newVM, setNewVM] = useState({
    name: "",
    image: "ubuntu:22.04"
  });

  // Create VM - temporary frontend version
  const createVM = (e) => {

    e.preventDefault();

    if (!newVM.name) {
      alert("Please enter VM name");
      return;
    }

    const vm = {
      id: `vm-${String(vms.length + 1).padStart(3, "0")}`,
      name: newVM.name,
      image: newVM.image,
      status: "Running",
      created: new Date().toLocaleString()
    };

    setVms([...vms, vm]);

    setNewVM({
      name: "",
      image: "ubuntu:22.04"
    });

    setShowForm(false);
  };

  // Start / Stop VM
  const toggleVM = (id) => {

    setVms(
      vms.map((vm) =>
        vm.id === id
          ? {
              ...vm,
              status:
                vm.status === "Running"
                  ? "Stopped"
                  : "Running"
            }
          : vm
      )
    );
  };

  // Delete VM
  const deleteVM = (id) => {

    if (window.confirm("Are you sure you want to delete this VM?")) {

      setVms(vms.filter((vm) => vm.id !== id));

    }
  };

  return (

    <div>

      {/* Page Header */}

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


      {/* VM Statistics */}

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
                  (vm) => vm.status === "Running"
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
                vms.filter(
                  (vm) => vm.status === "Stopped"
                ).length
              }
            </h2>

          </div>

        </div>

      </div>


      {/* Create VM Form */}

      {showForm && (

        <div className="create-vm-card card">

          <div className="form-header">

            <h2>Create New VM</h2>

            <button
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>

          </div>


          <form onSubmit={createVM}>

            <div className="form-grid">

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

            </div>


            <button
              type="submit"
              className="btn-primary"
            >
              Create VM
            </button>

          </form>

        </div>

      )}


      {/* VM Table */}

      <div className="table-container">

        <table>

          <thead>

            <tr>

              <th>VM ID</th>

              <th>Name</th>

              <th>Docker Image</th>

              <th>Status</th>

              <th>Created At</th>

              <th>Actions</th>

            </tr>

          </thead>


          <tbody>

            {vms.map((vm) => (

              <tr key={vm.id}>

                <td>
                  <strong>{vm.id}</strong>
                </td>

                <td>
                  {vm.name}
                </td>

                <td>
                  <code>{vm.image}</code>
                </td>

                <td>

                  <span
                    className={
                      vm.status === "Running"
                        ? "status status-running"
                        : "status status-stopped"
                    }
                  >
                    {vm.status}
                  </span>

                </td>

                <td>
                  {vm.created}
                </td>

                <td>

                  <div className="action-buttons">

                    <button
                      className={
                        vm.status === "Running"
                          ? "btn-stop"
                          : "btn-start"
                      }
                      onClick={() =>
                        toggleVM(vm.id)
                      }
                    >

                      {vm.status === "Running" ? (
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

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default EC2;