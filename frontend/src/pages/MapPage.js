import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations, addLocation } from "../store/locationsSlice";
import { MapContainer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Fly to a given location
function FlyToLocation({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15);
    }
  }, [lat, lng, map]);
  return null;
}

// Location list control
function LocationListControl({ locations, onLocate }) {
  const map = useMap();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const controlDiv = L.DomUtil.create("div", "leaflet-bar");
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

      table.querySelectorAll(".locate-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const lat = parseFloat(e.target.dataset.lat);
          const lng = parseFloat(e.target.dataset.lng);
          onLocate({ lat, lng });
        });
      });
    }

    button.onclick = (e) => {
      e.preventDefault();
      setOpen(!open);
    };

    const customControl = L.control({ position: "topleft" });
    customControl.onAdd = () => controlDiv;
    customControl.addTo(map);

    return () => customControl.remove();
  }, [map, open, locations, onLocate]);

  return null;
}

// Locate me control
function LocateMeControl({ onLocate }) {
  const map = useMap();
  useEffect(() => {
    const controlDiv = L.DomUtil.create("div", "leaflet-bar");
    const button = L.DomUtil.create("a", "", controlDiv);
    button.innerHTML = "📍";
    button.title = "Locate Me";
    button.href = "#";

    button.onclick = (e) => {
      e.preventDefault();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            onLocate({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => alert("Unable to get your location")
        );
      } else {
        alert("Geolocation not supported");
      }
    };

    const customControl = L.control({ position: "topleft" });
    customControl.onAdd = () => controlDiv;
    customControl.addTo(map);

    return () => customControl.remove();
  }, [onLocate]);

  return null;
}

// Layer switcher control
function LayerSwitcherControl() {
  const map = useMap();
  useEffect(() => {
    const street = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    );
    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    );

    street.addTo(map);
    L.control.layers(
      { Street: street, Satellite: satellite },
      {},
      { position: "topright" }
    ).addTo(map);
  }, [map]);
  return null;
}

// ... (imports and setup remain the same)

function AddLocationForm({ onAdd, onFlyTo }) {
  const [form, setForm] = useState({ name: "", lat: "", lng: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.lat || !form.lng) return;

    const newLocation = {
      id: Date.now(), // temporary id for local display
      name: form.name,
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
    };

    onAdd(newLocation);    // dispatch to Redux
    onFlyTo(newLocation);  // fly to the new location

    setForm({ name: "", lat: "", lng: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "10px",
        padding: "10px",
        background: "#f5f5f5",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        placeholder="Location Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="form-control"
      />
      <input
        type="number"
        step="any"
        placeholder="Latitude"
        value={form.lat}
        onChange={(e) => setForm({ ...form, lat: e.target.value })}
        className="form-control"
      />
      <input
        type="number"
        step="any"
        placeholder="Longitude"
        value={form.lng}
        onChange={(e) => setForm({ ...form, lng: e.target.value })}
        className="form-control"
      />
      <button type="submit" className="btn btn-primary">
        Add
      </button>
    </form>
  );
}

function MapPage() {
  const dispatch = useDispatch();
  const { items: locations } = useSelector((state) => state.locations);
  const [flyTo, setFlyTo] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    dispatch(fetchLocations());

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => setCurrentLocation(null)
      );
    }
  }, [dispatch]);

  const handleAddLocation = (loc) => {
    dispatch(addLocation(loc)); // save to DB or Redux store
  };

  const handleFlyTo = (loc) => {
    setFlyTo({ lat: loc.lat, lng: loc.lng });
  };

  return (
    <div style={{ height: "calc(100vh - 60px)", width: "100%" }}>
      {/* Always visible form */}
      <AddLocationForm onAdd={handleAddLocation} onFlyTo={handleFlyTo} />
        <MapContainer
          center={[3.139, 101.6869]}
          zoom={12}
          style={{ height: "calc(100% - 70px)", width: "100%" }}
          whenCreated={(map) => {
            if (locations.length > 0) {
              const bounds = L.latLngBounds(
                locations.map((loc) => [loc.lat, loc.lng])
              );
              map.fitBounds(bounds, { padding: [50, 50] });
            }
          }}
        >
          <LayerSwitcherControl />

          {locations.map((loc) => (
            <Marker key={loc.id} position={[loc.lat, loc.lng]}>
              <Popup>{loc.name}</Popup>
            </Marker>
          ))}

          {currentLocation && (
            <Marker position={[currentLocation.lat, currentLocation.lng]}>
              <Popup>📍Your Location</Popup>
            </Marker>
          )}

          {flyTo && <FlyToLocation lat={flyTo.lat} lng={flyTo.lng} />}
          <LocationListControl locations={locations} onLocate={handleFlyTo} />
          <LocateMeControl onLocate={handleFlyTo} />
        </MapContainer>
    </div>
  );
}

export default MapPage;

