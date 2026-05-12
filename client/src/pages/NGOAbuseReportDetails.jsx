import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import NGOSidebar from "../components/NGOSidebar";
import { fetchReportById, acceptCase, dismissCase } from "../services/abuseService";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function NGOAbuseReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [modal, setModal] = useState({
    show: false,
    type: "",       // "success" | "error"
    message: "",
    redirect: false, // whether to navigate after closing
  });

  const showModal = (type, message, redirect = false) =>
    setModal({ show: true, type, message, redirect });

  const closeModal = () => {
    const shouldRedirect = modal.redirect;
    setModal({ show: false, type: "", message: "", redirect: false });
    if (shouldRedirect) navigate("/ngo-abuse-reports");
  };

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchReportById(id);
        setReport(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, [id]);

  const handleAccept = async () => {
    try {
      await acceptCase(id);
      showModal("success", "Case has been accepted successfully!", true);
    } catch (err) {
      showModal("error", `Failed to accept case: ${err.message}`);
    }
  };

  const handleDismiss = async () => {
    try {
      await dismissCase(id);
      showModal("success", "Case has been dismissed successfully.", true);
    } catch (err) {
      showModal("error", `Failed to dismiss case: ${err.message}`);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f1ea] font-bold text-2xl">
      Loading report details...
    </div>
  );
  if (error) return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f1ea] text-red-600 font-bold text-2xl">
      Error: {error}
    </div>
  );
  if (!report) return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f1ea] font-bold text-2xl">
      Report not found.
    </div>
  );

  const position = [parseFloat(report.latitude) || 31.5204, parseFloat(report.longitude) || 74.3587];

  return (
    <div className="flex min-h-screen bg-[#f4f1ea]">
      <NGOSidebar />

      <div className="flex-1 p-8 pl-10 pr-12">
        {/* Back button */}
        <div className="flex gap-6 mb-8">
          <button
            onClick={() => navigate("/ngo-abuse-reports")}
            className="bg-[#c6287c] text-white px-10 py-2 rounded-xl font-bold text-xl"
          >
            Back to List
          </button>
        </div>

        <h1 className="text-3xl font-bold text-[#5e174f] mb-6">
          Case#{report.tracking_id}
        </h1>

        {/* Details Card */}
        <div className="border-[3px] border-black bg-[#e8e0d0] rounded-md p-10 flex flex-col min-h-[700px]">
          <div className="flex gap-12 flex-1">

            {/* Left Column */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[#d32f2f] font-bold text-2xl mb-8 flex items-center gap-3">
                  <span className="text-3xl">⚠️</span>
                  {report.severity === "severe" ? "Need Urgent Attention!" : `${report.severity} severity`}
                </p>
                <p className="font-bold text-xl mb-3">
                  Animal: <span className="text-[#c6287c]">{report.pet_type}</span>
                </p>
                <p className="font-bold text-xl mb-8">
                  Reported on:{" "}
                  <span className="text-[#c6287c]">
                    {new Date(report.abuse_datetime).toLocaleDateString(undefined, {
                      month: "long", day: "numeric", year: "numeric",
                    })}
                  </span>
                </p>
              </div>

              <div className="mt-auto">
                <p className="font-bold text-xl mb-3">Location</p>
                <div className="border-[3px] border-black rounded-md h-64 bg-[#d9e5f2] relative overflow-hidden flex mb-8" style={{ isolation: "isolate" }}>
                  <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <Marker position={position} />
                  </MapContainer>
                  <div className="absolute bottom-3 left-3 border-[3px] border-black bg-white px-3 py-1 text-sm font-bold text-[#c6287c] z-[1000]">
                    {report.address}
                  </div>
                </div>
                <div className="flex mt-4">
                  <button
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${report.address}`, "_blank")}
                    className="bg-[#c6287c] text-white px-8 py-3 text-xl rounded-lg font-bold"
                  >
                    Open on Maps?
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col justify-between ml-6">
              <div>
                <p className="font-bold text-xl mb-3">Description of the Incident</p>
                <div className="border-[3px] border-black bg-[#e0e0e0] h-48 flex relative text-lg overflow-y-auto">
                  <div className="p-4 font-medium pr-10 italic">"{report.description}"</div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="h-7 mb-3"></div>
                <div className="border-[3px] border-black p-2 h-64 mb-8">
                  <div className="grid grid-cols-2 grid-rows-2 h-full gap-1">
                    {report.images && report.images.length > 0 ? (
                      report.images.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="bg-[#b3a18f] overflow-hidden">
                          <img src={img} className="w-full h-full object-cover" alt="Abuse evidence" />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 row-span-2 flex items-center justify-center text-gray-500 italic">
                        No images provided
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-6 mt-4">
                  {report.status === "pending" || report.status === "under_review" ? (
                    <>
                      <button
                        onClick={handleAccept}
                        className="bg-[#c6287c] text-white px-8 py-3 rounded-lg font-bold text-xl hover:bg-[#a01d60]"
                      >
                        Accept Case
                      </button>
                      <button
                        onClick={handleDismiss}
                        className="bg-[#d32f2f] text-white px-8 py-3 rounded-lg font-bold text-xl hover:bg-[#b71c1c]"
                      >
                        Dismiss Case
                      </button>
                    </>
                  ) : (
                    <div className={`text-2xl font-black uppercase ${report.status === "action_taken" ? "text-green-600" : "text-red-600"}`}>
                      Status: {report.status.replace("_", " ")}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Success / Error Modal ── */}
      {modal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 w-80">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl
              ${modal.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
              {modal.type === "success" ? "✅" : "❌"}
            </div>
            <p className={`font-bold text-base text-center
              ${modal.type === "success" ? "text-green-700" : "text-red-600"}`}>
              {modal.message}
            </p>
            <button
              onClick={closeModal}
              className="bg-[#c6287c] hover:bg-[#a01d60] text-white font-bold px-10 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
