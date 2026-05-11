import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";  // ← correct import
// TODO: Drop in database connection here to fetch reports
// Mock data to test the component without a database ig idrk man dont bully me shehryar !!!
const initialMockReports = [
  { id: "Case#1001", type: "Cat", date: "03-07-26" },
  { id: "Case#1101", type: "Dog", date: "03-07-26" },
  { id: "Case#1050", type: "Duck", date: "03-07-26" },
  { id: "Case#1070", type: "Hens", date: "03-07-26" },
  { id: "Case#1082", type: "Cat", date: "03-07-26" },
];

export default function AdminAbuseReports() {
  const [reports, setReports] = useState(initialMockReports);

  const handleVerify = (id) => {
    // TODO: Replace with database API call to verify report
    console.log(`Verified report ${id}`);
    alert(`Verified report ${id}`);
  };

  const handleReject = (id) => {
    // TODO: Replace with database API call to reject report
    console.log(`Rejected report ${id}`);
    alert(`Rejected report ${id}`);
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-[#f4f1ea]">

        {/* Main Content */}
        <div className="flex-1 p-8 pl-10 pr-12">
          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button className="bg-[#c6287c] text-white px-8 py-1.5 rounded-xl font-bold text-lg">
              Current
            </button>
            <button className="bg-[#c6287c] text-white px-8 py-1.5 rounded-xl font-bold text-lg">
              Previous
            </button>
          </div>

          <h1 className="text-2xl font-bold text-[#5e174f] mb-6">
            {/* TODO: Make this header dynamic based on selected tab */}
            Current Abuse Reports
          </h1>

          {/* Table Container */}
          <div className="max-h-[600px] overflow-y-auto border-[3px] border-black bg-[#e0e0e0]">
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
                {reports.map((report, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="border-[3px] border-black p-4 text-lg font-medium">{report.id}</td>
                    <td className="border-[3px] border-black p-4 text-lg text-[#5e174f] font-semibold">
                      <span className="text-[#d32f2f] mr-2">⚠️</span>{report.type}
                    </td>
                    <td className="border-[3px] border-black p-4 text-lg text-[#5e174f] font-semibold">
                      {report.date}
                    </td>
                    <td className="border-[3px] border-black p-3">
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={() => handleVerify(report.id)}
                          className="bg-[#7cb342] text-white px-6 py-1 rounded-lg w-28 font-bold hover:bg-[#689f38] transition-colors"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleReject(report.id)}
                          className="bg-[#d32f2f] text-white px-6 py-1 rounded-lg w-28 font-bold hover:bg-[#b71c1c] transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                    <td className="border-[3px] border-black p-4">
                      <Link
                        to={`/ngo-abuse-reports/${report.id.replace('Case#', '')}`}
                        className="text-blue-600 font-medium hover:underline block"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
