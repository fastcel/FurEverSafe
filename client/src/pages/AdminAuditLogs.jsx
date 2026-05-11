import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";

const logs = [
  { time: "2026-03-07 09:14:02", level: "INFO", message: "New account was created. (User ID: 10)" },
  { time: "2026-03-07 09:16:11", level: "INFO", message: "User 10 updated their profile." },
  { time: "2026-03-07 09:18:27", level: "INFO", message: "User 11's tier has changed from Bronze to Silver." },
  { time: "2026-03-07 09:21:04", level: "INFO", message: "User 12 submitted an animal abuse report." },
  { time: "2026-03-07 09:22:36", level: "INFO", message: "NGO staff approved abuse report #34 and forwarded it to legal authorities." },
  { time: "2026-03-07 09:24:15", level: "WARN", message: "User 16 attempted login with incorrect password." },
  { time: "2026-03-07 09:25:40", level: "INFO", message: "User 16 successfully logged in." },
  { time: "2026-03-07 09:27:12", level: "INFO", message: "User 10 submitted an adoption application for Pet #7." },
  { time: "2026-03-07 09:29:51", level: "INFO", message: "NGO staff rejected adoption application #22." },
  { time: "2026-03-07 09:32:05", level: "INFO", message: "New pet listing was created by NGO staff. (Pet ID: 14)." },
  { time: "2026-03-07 09:34:18", level: "INFO", message: "Pet listing #14 was updated." },
  { time: "2026-03-07 09:36:40", level: "INFO", message: 'Abuse report #34 status changed to "Under Investigation".', highlight: "Under Investigation" },
  { time: "2026-03-07 09:39:11", level: "INFO", message: "Abuse report #34 was marked as verified." },
  { time: "2026-03-07 09:41:02", level: "INFO", message: "Reward points granted to User 12 for verified abuse report." },
  { time: "2026-03-07 09:43:20", level: "INFO", message: "User 10 successfully adopted Pet #7." },
  { time: "2026-03-07 09:45:57", level: "INFO", message: 'Pet #7 status changed to "Adopted".', highlight: "Adopted" },
];

const levelColor = (level) => {
  if (level === "WARN") return "text-yellow-400";
  return "text-green-400";
};

const renderMessage = (log) => {
  if (!log.highlight) return <span className="text-[#d0c8b8]">{log.message}</span>;
  const parts = log.message.split(`"${log.highlight}"`);
  return (
    <span className="text-[#d0c8b8]">
      {parts[0]}
      <span className="text-orange-400">&quot;{log.highlight}&quot;</span>
      {parts[1]}
    </span>
  );
};

export default function AdminAuditLogs() {
  return (
    <Layout>
      <div className="w-full min-h-screen bg-[#f0ebe0] flex flex-col py-10 px-12">

        <h1 className="text-3xl font-bold text-[#3a3028] mb-6">Audit Log</h1>

        <div className="w-full bg-[#2a2a2a] rounded-2xl p-6 shadow-lg font-mono text-sm overflow-x-auto">
          <div className="space-y-2">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-3 leading-relaxed">
                <span className="text-[#888] shrink-0">[{log.time}]</span>
                <span className={`font-bold shrink-0 w-10 ${levelColor(log.level)}`}>
                  {log.level}
                </span>
                {renderMessage(log)}
              </div>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}
