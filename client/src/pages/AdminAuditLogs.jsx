import { useState, useEffect } from "react";
import Layout from "../components/Layout";

const BASE_URL = "http://localhost:5000/api/admin";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Map DB action values → readable log messages
const formatMessage = (log) => {
  switch (log.action) {
    case "USER_UPDATE":
      return `Admin ${log.admin_name} updated ${log.target_type} ID: ${log.target_id}.`;
    case "USER_DELETE":
      return `Admin ${log.admin_name} deactivated ${log.target_type} ID: ${log.target_id}.`;
    default:
      return log.description || `${log.action} on ${log.target_type} ID: ${log.target_id}`;
  }
};

// Map action type → log level
const getLevel = (action) => {
  if (action?.includes("DELETE")) return "WARN";
  return "INFO";
};

const levelColor = (level) => {
  if (level === "WARN") return "text-yellow-400";
  return "text-green-400";
};

// Format timestamp from DB
const formatTime = (timestamp) => {
  if (!timestamp) return "—";
  return new Date(timestamp).toISOString().replace("T", " ").slice(0, 19);
};

export default function AdminAuditLogs() {
  const [logs, setLogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/audit-logs`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error("Failed to fetch audit logs");
        const data = await res.json();
        setLogs(data.logs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <Layout>
      <div className="w-full min-h-screen bg-[#f0ebe0] flex flex-col py-10 px-12">

        <h1 className="text-3xl font-bold text-[#3a3028] mb-6">Audit Log</h1>

        {/* Loading state */}
        {loading && (
          <p className="text-[#7a6a5a] text-sm font-mono">Loading audit logs…</p>
        )}

        {/* Error state */}
        {error && (
          <p className="text-red-500 text-sm font-mono">Error: {error}</p>
        )}

        {/* Logs terminal */}
        {!loading && !error && (
          <div className="w-full bg-[#2a2a2a] rounded-2xl p-6 shadow-lg font-mono text-sm overflow-x-auto">
            {logs.length === 0 ? (
              <p className="text-[#888]">No audit logs found.</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => {
                  const level = getLevel(log.action);
                  return (
                    <div key={log.log_id} className="flex items-start gap-3 leading-relaxed">
                      <span className="text-[#888] shrink-0">
                        [{formatTime(log.created_at)}]
                      </span>
                      <span className={`font-bold shrink-0 w-10 ${levelColor(level)}`}>
                        {level}
                      </span>
                      <span className="text-[#d0c8b8]">
                        {formatMessage(log)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </Layout>
  );
}
