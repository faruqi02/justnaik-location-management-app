import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations, addLocation, deleteLocation, updateLocation } from "../store/locationsSlice";

import JSZip from "jszip";

function Upload() {
  const dispatch = useDispatch();
  const { items: locations } = useSelector((state) => state.locations);
  const [file, setFile] = useState(null);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  // ✅ Delete location
  const handleDelete = (id) => {
    dispatch(deleteLocation(id));
  };

  // ✅ Handle file upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setPopup({ type: "error", message: "Please select a file" });
      setTimeout(() => setPopup(null), 3000);
      return;
    }

    try {
      const zip = await JSZip.loadAsync(file);
      const files = Object.keys(zip.files);
      const txtFiles = files.filter((f) => f.endsWith(".txt"));

      if (txtFiles.length !== 1 || files.length !== 1) {
        setPopup({ type: "error", message: "ZIP must contain exactly 1 TXT file" });
        setTimeout(() => setPopup(null), 3000);
        return;
      }

      // Read txt file content
      const content = await zip.file(txtFiles[0]).async("string");
      const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);

      // Parse locations
      const newLocations = [];
      for (let i = 1; i < lines.length; i++) { // skip header row
        const [name, lat, lng] = lines[i].split(",");
        if (name && lat && lng) {
          newLocations.push({ name: name.trim(), lat: parseFloat(lat), lng: parseFloat(lng) });
        }
      }

      // Send each to backend + Redux
      for (let loc of newLocations) {
        await dispatch(addLocation(loc));
      }

      setPopup({ type: "success", message: "Locations imported successfully!" });
      setTimeout(() => setPopup(null), 3000);
    } catch (err) {
      console.error(err);
      setPopup({ type: "error", message: "Invalid file format" });
      setTimeout(() => setPopup(null), 3000);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Upload Page</h2>

      {/* ✅ Popup */}
      {popup && (
        <div className={`alert ${popup.type === "success" ? "alert-success" : "alert-danger"}`}>
          {popup.message}
        </div>
      )}

      {/* ✅ Table of locations */}
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc) => (
            <tr key={loc.id}>
              {loc.isEditing ? (
                <>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={loc.name}
                      onChange={(e) => (loc.editName = e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      defaultValue={loc.lat}
                      onChange={(e) => (loc.editLat = e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      defaultValue={loc.lng}
                      onChange={(e) => (loc.editLng = e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() =>
                        dispatch(
                          updateLocation({
                            id: loc.id,
                            name: loc.editName || loc.name,
                            lat: parseFloat(loc.editLat) || loc.lat,
                            lng: parseFloat(loc.editLng) || loc.lng,
                          })
                        )
                      }
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => {
                        loc.isEditing = false; // cancel
                        dispatch(fetchLocations()); // reload table
                      }}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{loc.name}</td>
                  <td>{loc.lat}</td>
                  <td>{loc.lng}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => {
                        loc.isEditing = true;
                        dispatch(fetchLocations()); // force re-render
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(loc.id)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>

      </table>

      {/* ✅ Upload form */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Choose ZIP File (must contain 1 TXT)</label>
          <input
            type="file"
            className="form-control"
            accept=".zip"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Upload
        </button>
      </form>
    </div>
  );
}

export default Upload;
