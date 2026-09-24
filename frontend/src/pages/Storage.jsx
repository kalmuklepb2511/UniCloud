import { useState } from "react";
import {
  Upload,
  Folder,
  File,
  Download,
  Trash2,
  Plus
} from "lucide-react";

function Storage() {
  const [bucket, setBucket] = useState("college-storage");

  const [files, setFiles] = useState([
    {
      id: 1,
      name: "project-report.pdf",
      size: "2.4 MB",
      type: "PDF",
      uploaded: "23 Sep 2026"
    },
    {
      id: 2,
      name: "database-backup.sql",
      size: "850 KB",
      type: "SQL",
      uploaded: "23 Sep 2026"
    },
    {
      id: 3,
      name: "college-logo.png",
      size: "320 KB",
      type: "Image",
      uploaded: "22 Sep 2026"
    }
  ]);

  const [showBucketForm, setShowBucketForm] = useState(false);
  const [newBucket, setNewBucket] = useState("");

  const handleUpload = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    const newFile = {
      id: Date.now(),
      name: selectedFile.name,
      size:
        selectedFile.size > 1024 * 1024
          ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
          : `${(selectedFile.size / 1024).toFixed(1)} KB`,
      type: selectedFile.name.split(".").pop().toUpperCase(),
      uploaded: new Date().toLocaleDateString()
    };

    setFiles([...files, newFile]);

    event.target.value = "";
  };

  const deleteFile = (id) => {
    if (window.confirm("Delete this file?")) {
      setFiles(files.filter((file) => file.id !== id));
    }
  };

  const downloadFile = (name) => {
    alert(`Download requested for ${name}`);
  };

  const createBucket = (e) => {
    e.preventDefault();

    if (!newBucket.trim()) {
      alert("Enter bucket name");
      return;
    }

    setBucket(newBucket);
    setNewBucket("");
    setShowBucketForm(false);
  };

  return (
    <div>

      {/* Header */}

      <div className="page-header">

        <div>
          <h1>S3 Storage</h1>
          <p>Manage your cloud files and storage buckets</p>
        </div>

        <button
          className="btn-primary"
          onClick={() => setShowBucketForm(true)}
        >
          <Plus size={17} />
          Create Bucket
        </button>

      </div>


      {/* Storage Summary */}

      <div className="storage-summary">

        <div className="card storage-card">

          <div className="storage-icon">
            💾
          </div>

          <div>
            <p>Total Storage</p>
            <h2>10 GB</h2>
          </div>

        </div>


        <div className="card storage-card">

          <div className="storage-icon">
            📁
          </div>

          <div>
            <p>Files</p>
            <h2>{files.length}</h2>
          </div>

        </div>


        <div className="card storage-card">

          <div className="storage-icon">
            ☁️
          </div>

          <div>
            <p>Used Storage</p>
            <h2>3.57 MB</h2>
          </div>

        </div>

      </div>


      {/* Bucket */}

      <div className="bucket-card card">

        <div className="bucket-header">

          <div className="bucket-title">

            <Folder size={22} />

            <div>
              <h3>{bucket}</h3>
              <p>Current storage bucket</p>
            </div>

          </div>

          <label className="upload-button">

            <Upload size={16} />

            Upload File

            <input
              type="file"
              hidden
              onChange={handleUpload}
            />

          </label>

        </div>

      </div>


      {/* Create Bucket */}

      {showBucketForm && (

        <div className="card bucket-form">

          <div className="form-header">

            <h2>Create Storage Bucket</h2>

            <button
              onClick={() => setShowBucketForm(false)}
            >
              ✕
            </button>

          </div>

          <form onSubmit={createBucket}>

            <label>Bucket Name</label>

            <input
              type="text"
              placeholder="Example: student-files"
              value={newBucket}
              onChange={(e) =>
                setNewBucket(e.target.value)
              }
            />

            <button
              type="submit"
              className="btn-primary"
            >
              Create Bucket
            </button>

          </form>

        </div>

      )}


      {/* Files */}

      <div className="table-container">

        <table>

          <thead>

            <tr>
              <th>File</th>
              <th>Type</th>
              <th>Size</th>
              <th>Uploaded</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {files.map((file) => (

              <tr key={file.id}>

                <td>

                  <div className="file-name">

                    <File size={18} />

                    <strong>
                      {file.name}
                    </strong>

                  </div>

                </td>

                <td>{file.type}</td>

                <td>{file.size}</td>

                <td>{file.uploaded}</td>

                <td>

                  <div className="action-buttons">

                    <button
                      className="download-button"
                      onClick={() =>
                        downloadFile(file.name)
                      }
                    >

                      <Download size={14} />

                      Download

                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteFile(file.id)
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

export default Storage;