import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations, addLocation } from "../store/locationsSlice";
import {
  MapContainer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
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

// Add location control
function AddLocationControl({ onAdd }) {
  const map = useMap();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", lat: "", lng: "" });

  useEffect(() => {
    const controlDiv = L.DomUtil.create("div", "leaflet-bar");
    const button = L.DomUtil.create("a", "", controlDiv);
    button.innerHTML = open ? "−" : "+";
    button.title = open ? "Hide Add Form" : "Show Add Form";
    button.href = "#";

    const formDiv = L.DomUtil.create("div", "", controlDiv);
    formDiv.style.display = open ? "block" : "none";
    formDiv.style.background = "white";
    formDiv.style.padding = "8px";
    formDiv.style.width = "180px";
    formDiv.style.borderRadius = "4px";

    if (open) {
      const formEl = document.createElement("form");
      formEl.innerHTML = `
        <input type="text" name="name" placeholder="Name" class="form-control form-control-sm mb-2" />
        <input type="text" name="lat" placeholder="Latitude" class="form-control form-control-sm mb-2" />
        <input type="text" name="lng" placeholder="Longitude" class="form-control form-control-sm mb-2" />
        <button type="submit" class="btn btn-sm btn-primary w-100">Add</button>
      `;
      formDiv.appendChild(formEl);

      formEl.addEventListener("input", (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      });

      formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!form.name || !form.lat || !form.lng) return;
        onAdd(form);
        setForm({ name: "", lat: "", lng: "" });
        formEl.reset();
        setOpen(false);
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
  }, [map, open, form, onAdd]);

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

// Layer switcher control (Street/Satellite)
function LayerSwitcherControl() {
  const map = useMap();
  useEffect(() => {
    const street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    );

    // default or last selected
    const lastLayer = localStorage.getItem("mapLayer") || "Street";
    if (lastLayer === "Street") street.addTo(map);
    else satellite.addTo(map);

    const layersControl = L.control.layers(
      { Street: street, Satellite: satellite },
      {},
      { position: "topright" }
    ).addTo(map);

    map.on("baselayerchange", (e) => {
      localStorage.setItem("mapLayer", e.name);
    });

    return () => layersControl.remove();
  }, [map]);

  return null;
}

function MapPage() {
  const dispatch = useDispatch();
  const { items: locations } = useSelector((state) => state.locations);
  const [flyTo, setFlyTo] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    dispatch(fetchLocations());

    // always get current location (for display only)
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

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[3.139, 101.6869]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(map) => {
          if (locations.length > 0) {
            const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
          } else if (currentLocation) {
            map.setView([currentLocation.lat, currentLocation.lng], 12);
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
        <LocationListControl locations={locations} onLocate={setFlyTo} />
        <AddLocationControl onAdd={(form) => dispatch(addLocation(form))} />
        <LocateMeControl onLocate={setFlyTo} />
      </MapContainer>
    </div>
  );
}

export default MapPage;
