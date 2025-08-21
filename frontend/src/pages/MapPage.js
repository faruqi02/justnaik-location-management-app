import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations, addLocation } from "../store/locationsSlice";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ✅ Fly to map location
function FlyToLocation({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15);
    }
  }, [lat, lng, map]);
  return null;
}

// ✅ Custom Control inside map
function LocationListControl({ locations, onLocate }) {
  const map = useMap();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const controlDiv = L.DomUtil.create("div", "leaflet-bar");

    // Header toggle
    const button = L.DomUtil.create("a", "", controlDiv);
    button.innerHTML = open ? "▲" : "▼";
    button.title = open ? "Hide Locations" : "Show Locations";
    button.href = "#";

    const listDiv = L.DomUtil.create("div", "", controlDiv);
    listDiv.style.display = open ? "block" : "none";
    listDiv.style.maxHeight = "200px";
    listDiv.style.overflowY = "auto";
    listDiv.style.background = "white";
    listDiv.style.padding = "5px";

    if (open) {
      const table = document.createElement("table");
      table.style.fontSize = "0.8rem";
      table.className = "table table-sm";
      table.innerHTML = `
        <thead><tr><th>Name</th><th>Go</th></tr></thead>
        <tbody>
          ${locations
            .map(
              (loc) => `
            <tr>
              <td>${loc.name}</td>
              <td><button class="btn btn-sm btn-primary locate-btn" data-lat="${loc.lat}" data-lng="${loc.lng}">Go</button></td>
            </tr>`
            )
            .join("")}
        </tbody>
      `;
      listDiv.appendChild(table);

      // Attach click events
      table.querySelectorAll(".locate-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const lat = parseFloat(e.target.dataset.lat);
          const lng = parseFloat(e.target.dataset.lng);
          onLocate({ lat, lng });
        });
      });
    }

    // Toggle collapse
    button.onclick = (e) => {
      e.preventDefault();
      setOpen(!open);
    };

    const customControl = L.control({ position: "topleft" });
    customControl.onAdd = () => controlDiv;
    customControl.addTo(map);

    return () => {
      customControl.remove();
    };
  }, [map, open, locations, onLocate]);

  return null;
}

function MapPage() {
  const dispatch = useDispatch();
  const { items: locations } = useSelector((state) => state.locations);
  const [flyTo, setFlyTo] = useState(null);

  // form state
  const [form, setForm] = useState({ name: "", lat: "", lng: "" });

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.lat || !form.lng) return;
    dispatch(addLocation(form));
    setForm({ name: "", lat: "", lng: "" });
  };

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      {/* ✅ Add Location Form Overlay */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "white",
          padding: "10px",
          borderRadius: "6px",
          zIndex: 1000,
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="form-control mb-2"
          />
          <input
            type="text"
            name="lat"
            placeholder="Latitude"
            value={form.lat}
            onChange={handleChange}
            className="form-control mb-2"
          />
          <input
            type="text"
            name="lng"
            placeholder="Longitude"
            value={form.lng}
            onChange={handleChange}
            className="form-control mb-2"
          />
          <button type="submit" className="btn btn-primary w-100">
            Add
          </button>
        </form>
      </div>

      {/* ✅ Map */}
      <MapContainer
        center={[3.139, 101.6869]} // KL
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {locations.map((loc) => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]}>
            <Popup>{loc.name}</Popup>
          </Marker>
        ))}

        {flyTo && <FlyToLocation lat={flyTo.lat} lng={flyTo.lng} />}

        {/* ✅ Collapsible list inside map */}
        <LocationListControl locations={locations} onLocate={setFlyTo} />
      </MapContainer>
    </div>
  );
}

export default MapPage;
