import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { fetchNgoReports, acceptCase, dismissCase } from "../services/abuseService";

export default function NGOAbuseReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("current"); // "current" or "previous"

  useEffect(() => {
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
    loadReports();
  }, [activeTab]);

  const handleVerify = async (id) => {
    try {
      await acceptCase(id);
      alert(`Verified report ${id}`);
      // Refresh list
      setReports((prev) => prev.filter((r) => r.report_id !== id));
    } catch (err) {
      alert(`Error verifying report: ${err.message}`);
    }
  };

  const handleReject = async (id) => {
    try {
      await dismissCase(id);
      alert(`Rejected report ${id}`);
      // Refresh list
      setReports((prev) => prev.filter((r) => r.report_id !== id));
    } catch (err) {
      alert(`Error rejecting report: ${err.message}`);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-[#f4f1ea]">

        {/* Main Content */}
        <div className="flex-1 p-8 pl-10 pr-12">
          {/* Tabs */}
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

          <h1 className="text-2xl font-bold text-[#5e174f] mb-6">
            {activeTab === "current" ? "Current Abuse Reports" : "Previous Abuse Reports"}
          </h1>

          {/* Table Container */}
          <div className="max-h-[600px] overflow-y-auto border-[3px] border-black bg-[#e0e0e0]">
            {loading ? (
              <div className="p-8 text-center text-xl font-bold">Loading reports...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-600 font-bold">Error: {error}</div>
            ) : reports.length === 0 ? (
              <div className="p-8 text-center text-lg italic text-gray-600">No reports found.</div>
            ) : (
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-[#e0e0e0] z-10">
                  <tr>
                    <th className="border-[3px] border-black p-4 text-xl">ID</th>
                    <th className="border-[3px] border-black p-4 text-xl">Type</th>
                    <th className="border-[3px] border-black p-4 text-xl">Date</th>
                    <th className="border-[3px] border-black p-4 text-xl">Status</th>
                    <th className="border-[3px] border-black p-4 text-xl">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.report_id} className="text-center">
                      <td className="border-[3px] border-black p-4 text-lg font-medium">{report.tracking_id}</td>
                      <td className="border-[3px] border-black p-4 text-lg text-[#5e174f] font-semibold">
                        <span className="text-[#d32f2f] mr-2">⚠️</span>{report.pet_type}
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
                          <span className={`font-bold capitalize ${report.status === 'action_taken' ? 'text-green-600' : 'text-red-600'}`}>
                            {report.status.replace('_', ' ')}
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
    </Layout>
  );
}
