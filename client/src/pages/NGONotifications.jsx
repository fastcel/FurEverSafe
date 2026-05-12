import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import {
  NotificationsNone as BellIcon,
  WarningAmber as WarningIcon,
} from "@mui/icons-material";

export default function NGONotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const [modal, setModal] = useState({ show: false, message: "" });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("NOTIFICATIONS:", res.data);
        setNotifications(res.data || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError(err.response?.data?.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  return (
    <Layout>
      <div className="w-full min-h-screen bg-[#f6f1e8] p-10">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-3xl font-black text-primary mb-6">
            Notifications
          </h1>

          {loading && (
            <div className="bg-[#bfb5a5] p-8 rounded-xl border-[3px] border-black shadow-sm w-full text-center">
              <p className="text-[#4a3f35] font-bold text-xl">
                Loading notifications...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-100 p-8 rounded-xl border-[3px] border-black shadow-sm w-full text-center">
              <p className="text-red-700 font-bold text-xl">{error}</p>
            </div>
          )}

          {!loading && !error && notifications.length === 0 && (
            <div className="bg-[#bfb5a5] p-8 rounded-xl border-[3px] border-black shadow-sm w-full text-center">
              <BellIcon
                className="text-[#4a3f35] mb-4"
                style={{ fontSize: 48 }}
              />
              <p className="text-[#4a3f35] font-bold text-xl">
                No notifications yet.
              </p>
            </div>
          )}

          {!loading && !error && notifications.length > 0 && (
            <div className="bg-[#bfb5a5] p-8 rounded-xl border-[3px] border-black shadow-sm w-full">
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div
                    key={notif.notification_id}
                    onClick={() =>
                      setModal({ show: true, message: notif.message })
                    }
                    className="bg-white p-5 rounded-lg flex items-center border-[3px] border-black shadow-sm cursor-pointer hover:bg-gray-50 transition-all"
                  >
                    <div className="mr-5">
                      {notif.type === "error" ? (
                        <WarningIcon className="text-red-500 scale-125" />
                      ) : (
                        <BellIcon className="text-yellow-500 scale-125" />
                      )}
                    </div>
                    <p className="text-[#4a3f35] font-bold text-xl">
                      {notif.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {modal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 w-96">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-4xl">
              🔔
            </div>
            <h2 className="text-[#4a3f35] font-bold text-lg text-center">
              Notification Details
            </h2>
            <p className="text-[#4a3f35] text-base text-center leading-relaxed">
              {modal.message}
            </p>
            <button
              onClick={() => setModal({ show: false, message: "" })}
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
