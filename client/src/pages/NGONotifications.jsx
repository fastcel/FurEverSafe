import { useState, useEffect } from "react";
import axios from "axios";
import NGOSidebar from "../components/NGOSidebar";
import {
    NotificationsNone as BellIcon,
    WarningAmber as WarningIcon,
} from "@mui/icons-material";

export default function NGONotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");

    // Fetch notifications from database on mount
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    "http://localhost:5000/api/notifications",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log("NOTIFICATIONS:", res.data);

                setNotifications(res.data || []);
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
                setError(
                    err.response?.data?.message ||
                    "Failed to load notifications"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [token]);





    const showAlert = (message) => {
        alert(message);
    };

    return (
        <div className="flex min-h-screen bg-[#f6f1e8]">
            {/* Sidebar */}
            <NGOSidebar />

            {/* Main Content */}
            <div className="flex-1 p-10">
                <div className="max-w-[1440px] mx-auto">
                    {/* Header */}
                    <h1 className="text-5xl font-black text-purple-900 mb-8">
                        Notifications
                    </h1>

                    {/* Loading State */}
                    {loading && (
                        <div className="bg-[#bfb5a5] p-8 rounded-xl border-[3px] border-black shadow-sm w-full text-center">
                            <p className="text-[#4a3f35] font-bold text-xl">
                                Loading notifications...
                            </p>
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="bg-red-100 p-8 rounded-xl border-[3px] border-black shadow-sm w-full text-center">
                            <p className="text-red-700 font-bold text-xl">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && notifications.length === 0 && (
                        <div className="bg-[#bfb5a5] p-8 rounded-xl border-[3px] border-black shadow-sm w-full text-center">
                            <BellIcon className="text-[#4a3f35] mb-4" style={{ fontSize: 48 }} />
                            <p className="text-[#4a3f35] font-bold text-xl">
                                No notifications yet.
                            </p>
                        </div>
                    )}

                    {/* Notifications List */}
                    {!loading && !error && notifications.length > 0 && (
                        <div className="bg-[#bfb5a5] p-8 rounded-xl border-[3px] border-black shadow-sm w-full">
                            <div className="space-y-4">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.notification_id}
                                        onClick={() =>
                                            showAlert(
                                                `Opening details for: ${notif.message}`
                                            )
                                        }
                                        className="bg-white p-5 rounded-lg flex items-center border-[3px] border-black shadow-sm cursor-pointer hover:bg-gray-50 transition-all"
                                    >
                                        {/* Icon */}
                                        <div className="mr-5">
                                            {notif.type === "error" ? (
                                                <WarningIcon className="text-red-500 scale-125" />
                                            ) : (
                                                <BellIcon className="text-yellow-500 scale-125" />
                                            )}
                                        </div>

                                        {/* Text */}
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
        </div>
    );
}