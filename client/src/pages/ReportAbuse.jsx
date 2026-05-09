// ReportAbuse.jsx
// ─── Setup (run once) ───────────────────────────────────────────────────────
//   npm install leaflet react-leaflet
//
// Add ONE of these to your global CSS entry (e.g. globals.css or _app.jsx):
//   import 'leaflet/dist/leaflet.css';
//
// If using Next.js, import this component with dynamic() to skip SSR:
//   import dynamic from 'next/dynamic';
//   const ReportAbuse = dynamic(() => import('../components/ReportAbuse'), { ssr: false });
// ───────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback } from "react";
import Layout from "../components/Layout";
import EditIcon from "@mui/icons-material/Edit";
import UploadIcon from "@mui/icons-material/Upload";
import CloseIcon from "@mui/icons-material/Close";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import PushPinIcon from "@mui/icons-material/PushPin";

import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";

// ── Listens for map clicks and calls back with latlng ────────────────────────
function MapClickHandler({ repinMode, onMapClick }) {
  useMapEvents({
    click(e) {
      if (repinMode) onMapClick(e.latlng);
    },
  });
  return null;
}

// ── Reverse geocode via Nominatim (free, no API key needed) ─────────────────
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    return data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

// ── Main page component ──────────────────────────────────────────────────────
export default function ReportAbuse() {
  const [severity, setSeverity] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Map state — default pin on Lahore city centre
  const DEFAULT_POS = { lat: 31.5204, lng: 74.3587 };
  const [markerPos, setMarkerPos] = useState(DEFAULT_POS);
  const [address, setAddress] = useState("Lahore, Punjab");
  const [addressTouched, setAddressTouched] = useState(false);
  const [repinMode, setRepinMode] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const mapRef = useRef(null);

  const severityConfig = [
    { label: "Minor", bg: "bg-[#a6e2b3]" },
    { label: "Moderate", bg: "bg-[#e8d5f3]" },
    { label: "Severe", bg: "bg-[#e67c73]" },
  ];

  // Move pin and reverse-geocode whenever the user picks a spot
  const handleMapClick = useCallback(async (latlng) => {
    setMarkerPos(latlng);
    setRepinMode(false);
    setGeocoding(true);
    const addr = await reverseGeocode(latlng.lat, latlng.lng);
    setAddress(addr);
    setAddressTouched(true);
    setGeocoding(false);
  }, []);

  // GPS "Locate me" button
  function handleLocateMe() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setMarkerPos(latlng);
      mapRef.current?.flyTo([latlng.lat, latlng.lng], 15, { duration: 1 });
      setGeocoding(true);
      const addr = await reverseGeocode(latlng.lat, latlng.lng);
      setAddress(addr);
      setAddressTouched(true);
      setGeocoding(false);
    });
  }

  // File upload
  function handleFiles(e) {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        name: file.name,
        url: URL.createObjectURL(file),
        isVideo: file.type.startsWith("video/"),
      })),
    ]);
    e.target.value = "";
  }

  function handleDrop(e) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        name: file.name,
        url: URL.createObjectURL(file),
        isVideo: file.type.startsWith("video/"),
      })),
    ]);
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-purple-900 mb-2">Report Abuse</h1>
        <p className="text-gray-700 italic mb-8">
          If you witness animal cruelty or neglect, please report it so NGOs can take action.
        </p>

        <div className="bg-[#dcd3c1] p-8 rounded-lg shadow-sm border border-gray-800">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* ═══════════════ LEFT COLUMN ═══════════════ */}
            <div className="space-y-6">

              {/* Date & Time */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">
                  Date &amp; Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border-2 border-black rounded bg-[#f8f5f0] text-sm cursor-pointer"
                />
              </div>

              {/* Animal Type */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">
                  Animal Type <span className="text-red-500">*</span>
                </label>
                <select className="w-full p-2 border-2 border-black rounded bg-[#f8f5f0] text-sm appearance-none">
                  <option>Select Animal Type...</option>
                  <option>Dog</option>
                  <option>Cat</option>
                  <option>Bird</option>
                  <option>Horse</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">
                  Severity <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {severityConfig.map(({ label, bg }) => {
                    const isSelected = severity === label;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setSeverity(label)}
                        className={`
                          flex-1 py-1.5 px-3 border-2 border-black rounded text-sm font-bold
                          text-black transition-all duration-150 select-none ${bg}
                          ${isSelected
                            ? "scale-90 shadow-inner brightness-90 ring-2 ring-black ring-offset-1"
                            : "hover:opacity-80 scale-100"}
                        `}
                      >
                        {label}{isSelected && <span className="ml-1 text-xs">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ════════ Location — OpenStreetMap ════════ */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>

                {/* Map wrapper */}
                <div className="border-2 border-black rounded overflow-hidden relative">
                  <div
                    className="h-48 relative"
                    style={{ cursor: repinMode ? "crosshair" : "default" }}
                  >
                    {/* ── Leaflet map ── */}
                    <MapContainer
                      center={[markerPos.lat, markerPos.lng]}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                      zoomControl={true}
                      ref={mapRef}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <MapClickHandler repinMode={repinMode} onMapClick={handleMapClick} />
                    </MapContainer>

                    {/* Click To Repin toggle */}
                    <button
                      type="button"
                      onClick={() => setRepinMode((v) => !v)}
                      className={`
                        absolute top-2 right-2 z-[1000] px-2 py-1 border text-[10px]
                        font-bold rounded flex items-center gap-1 transition
                        ${repinMode
                          ? "bg-purple-700 text-white border-purple-900"
                          : "bg-white text-black border-gray-400 hover:bg-gray-50"}
                      `}
                    >
                      <PushPinIcon style={{ fontSize: 11 }} />
                      {repinMode ? "Click map to place…" : "Click To Repin"}
                    </button>

                    {/* Locate Me */}
                    <button
                      type="button"
                      onClick={handleLocateMe}
                      title="Use my current location"
                      className="absolute bottom-8 right-2 z-[1000] bg-white border border-gray-400 rounded p-1 shadow hover:bg-gray-50 transition"
                    >
                      <MyLocationIcon style={{ fontSize: 16, color: "#6b21a8" }} />
                    </button>

                    {/* Geocoding overlay */}
                    {geocoding && (
                      <div className="absolute inset-0 z-[999] bg-white bg-opacity-50 flex items-center justify-center pointer-events-none">
                        <span className="text-xs font-bold text-purple-800 animate-pulse bg-white px-2 py-1 rounded shadow">
                          Locating…
                        </span>
                      </div>
                    )}

                    {/* Coordinates badge */}
                    <div className="absolute bottom-2 left-2 z-[1000] bg-[#f8f5f0] px-2 py-0.5 border border-purple-800 text-[10px] text-purple-900 font-bold rounded pointer-events-none">
                      {markerPos.lat.toFixed(4)}, {markerPos.lng.toFixed(4)}
                    </div>
                  </div>
                </div>

                {/* Address field — auto-filled, still manually editable */}
                <div className="mt-2 relative">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => { setAddress(e.target.value); setAddressTouched(true); }}
                    placeholder="Or Enter Address Manually..."
                    className={`w-full p-2 pr-8 border-2 border-black rounded bg-[#f8f5f0] text-sm transition-all ${addressTouched ? "text-black not-italic" : "text-gray-400 italic"
                      }`}
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                    <EditIcon style={{ fontSize: 16 }} />
                  </span>
                </div>

                <p className="text-[10px] text-gray-500 mt-1 italic">
                  Enable "Click To Repin" to place a point on the map • or use{" "}
                  <MyLocationIcon style={{ fontSize: 10, verticalAlign: "middle" }} /> to detect your GPS location.
                </p>
              </div>
            </div>

            {/* ═══════════════ RIGHT COLUMN ═══════════════ */}
            <div className="space-y-6 flex flex-col">

              {/* Description */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-bold text-gray-800">
                    Description of the Incident <span className="text-red-500">*</span>
                  </label>
                  <EditIcon />
                </div>
                <textarea
                  placeholder="Describe the animal's condition, what you witnessed, number of animals affected..."
                  className="w-full h-48 p-3 border-2 border-black rounded bg-[#f8f5f0] text-sm resize-none"
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">
                  Attachments (Optional)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,video/mp4"
                  multiple
                  className="hidden"
                  onChange={handleFiles}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-black border-dashed rounded bg-[#f8f5f0] flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-gray-100 transition"
                  style={{ minHeight: uploadedFiles.length > 0 ? "4rem" : "10rem" }}
                >
                  <UploadIcon className="text-green-600 text-2xl mb-1" />
                  <p className="text-xs font-bold text-gray-600">Click or drag photos/videos here</p>
                  <p className="text-[10px] text-gray-400">JPG, PNG, MP4 — max 20 MB each</p>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="relative rounded overflow-hidden border-2 border-black aspect-square bg-black"
                      >
                        {file.isVideo ? (
                          <video
                            src={file.url}
                            className="w-full h-full object-cover"
                            muted playsInline
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                          />
                        ) : (
                          <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => setUploadedFiles((p) => p.filter((f) => f.id !== file.id))}
                          className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-opacity-90 transition"
                        >
                          <CloseIcon style={{ fontSize: 12 }} />
                        </button>
                        {file.isVideo && (
                          <span className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-[9px] px-1 rounded">
                            VIDEO
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-center mt-8">
          <button className="bg-primary text-white px-12 py-3 text-xl font-bold rounded hover:opacity-90 transition shadow-md">
            Submit
          </button>
        </div>
      </div>
    </Layout>
  );
}