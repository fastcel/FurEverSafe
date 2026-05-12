import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import {
  fetchNgoReports,
  acceptCase,
  dismissCase,
} from "../services/abuseService";

export default function NGOAbuseReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("current");

  const [modal, setModal] = useState({
    show: false,
    type: "",
    message: "",
  });

  const showModal = (type, message) => setModal({ show: true, type, message });
  const closeModal = () => setModal({ show: false, type: "", message: "" });

  useEffect(() => {
    loadReports();
  }, [activeTab]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNgoReports(activeTab);
      setReports(data);
    } catch (err) {
      console.error("Load reports error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await acceptCase(id);
      setReports((prev) => prev.filter((r) => r.report_id !== id));
      showModal("success", "Report has been successfully verified!");
    } catch (err) {
      showModal("error", `Failed to verify report: ${err.message}`);
    }
  };

  const handleReject = async (id) => {
    try {
      await dismissCase(id);
      setReports((prev) => prev.filter((r) => r.report_id !== id));
      showModal("success", "Report has been successfully rejected.");
    } catch (err) {
      showModal("error", `Failed to reject report: ${err.message}`);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-[#f4f1ea]">
        <div className="flex-1 p-8 pl-10 pr-12">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("current")}
              className={`${activeTab === "current" ? "bg-[#c6287c]" : "bg-gray-400"} text-white px-8 py-1.5 rounded-xl font-bold text-lg transition-colors`}
            >
              Current
            </button>
            <button
              onClick={() => setActiveTab("previous")}
              className={`${activeTab === "previous" ? "bg-[#c6287c]" : "bg-gray-400"} text-white px-8 py-1.5 rounded-xl font-bold text-lg transition-colors`}
            >
              Previous
            </button>
          </div>

          <h1 className="text-3xl font-black text-primary mb-6">
            {activeTab === "current"
              ? "Current Abuse Reports"
              : "Previous Abuse Reports"}
          </h1>

          <div className="max-h-[600px] overflow-y-auto border-[3px] border-black bg-[#e0e0e0]">
            {loading ? (
              <div className="p-8 text-center text-xl font-bold">
                Loading reports...
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-600 font-bold">
                Error: {error}
              </div>
            ) : reports.length === 0 ? (
              <div className="p-8 text-center text-lg italic text-gray-600">
                No reports found.
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-[#e0e0e0] z-10">
                  <tr>
                    <th className="border-[3px] border-black p-4 text-xl">
                      ID
                    </th>
                    <th className="border-[3px] border-black p-4 text-xl">
                      Type
                    </th>
                    <th className="border-[3px] border-black p-4 text-xl">
                      Date
                    </th>
                    <th className="border-[3px] border-black p-4 text-xl">
                      Status
                    </th>
                    <th className="border-[3px] border-black p-4 text-xl">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.report_id} className="text-center">
                      <td className="border-[3px] border-black p-4 text-lg font-medium">
                        {report.tracking_id}
                      </td>
                      <td className="border-[3px] border-black p-4 text-lg text-[#5e174f] font-semibold">
                        <span className="text-[#d32f2f] mr-2">⚠️</span>
                        {report.pet_type}
                      </td>
                      <td className="border-[3px] border-black p-4 text-lg text-[#5e174f] font-semibold">
                        {new Date(report.abuse_datetime).toLocaleDateString()}
                      </td>
                      <td className="border-[3px] border-black p-3">
                        {activeTab === "current" ? (
                          <div className="flex flex-col items-center gap-2">
                            <button
                              onClick={() => handleVerify(report.report_id)}
                              className="bg-[#7cb342] text-white px-6 py-1 rounded-lg w-28 font-bold hover:bg-[#689f38] transition-colors"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleReject(report.report_id)}
                              className="bg-[#d32f2f] text-white px-6 py-1 rounded-lg w-28 font-bold hover:bg-[#b71c1c] transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`font-bold capitalize ${report.status === "action_taken" ? "text-green-600" : "text-red-600"}`}
                          >
                            {report.status.replace("_", " ")}
                          </span>
                        )}
                      </td>
                      <td className="border-[3px] border-black p-4">
                        <Link
                          to={`/ngo-abuse-reports/${report.report_id}`}
                          className="text-blue-600 font-medium hover:underline block"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {modal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 w-80">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl
              ${modal.type === "success" ? "bg-green-100" : "bg-red-100"}`}
            >
              {modal.type === "success" ? "✅" : "❌"}
            </div>
            <p
              className={`font-bold text-base text-center
              ${modal.type === "success" ? "text-green-700" : "text-red-600"}`}
            >
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
    </Layout>
  );
}
