import { useState } from "react";
import NGOSidebar from "../components/NGOSidebar";
import {
  NotificationsNone as BellIcon,
  WarningAmber as WarningIcon,
} from "@mui/icons-material";

// Dummy Data
const NOTIFICATIONS = [
  { id: 1, text: "A new abuse report has been submitted in Gulberg", type: "info" },
  { id: 2, text: "Case RPT-2847 has been marked as urgent", type: "error" },
  { id: 3, text: "Volunteer Ahmed has accepted a rescue task", type: "success" },
  { id: 4, text: "Medical assistance requested for injured dog", type: "error" },
  { id: 5, text: "Case RPT-2906 has been resolved successfully", type: "success" },
  { id: 6, text: "New adoption verification request received", type: "info" },
];

export default function NGONotifications() {
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

          {/* Notifications List */}
          <div className="bg-[#bfb5a5] p-8 rounded-xl border-[3px] border-black shadow-sm w-full">
            <div className="space-y-4">
              {/* TODO: Fetch NGO notifications from database */}
              {NOTIFICATIONS.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() =>
                    showAlert(`Opening details for: ${notif.text}`)
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
                    {notif.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}