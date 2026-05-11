import { useState, useEffect } from "react"; // Added useEffect
import axios from 'axios';
import Layout from "../components/Layout";
import {
  NotificationsNone as BellIcon,
  WarningAmber as WarningIcon,
  ChevronRight as ChevronRightIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Image as ImageIcon,
  Lock as LockIcon,
  Close as CloseIcon
} from "@mui/icons-material";

export default function UserNotifications() {
  const [activeTab, setActiveTab] = useState("Notifications");
  const [selectedReport, setSelectedReport] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        // 1. Fetch real notifications from notification.service.js
        const notifRes = await axios.get(`http://localhost:5000/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(notifRes.data);

        // 2. Fetch real abuse reports from abuse.service.js
        const reportsRes = await axios.get(`http://localhost:5000/api/abuse/my-reports`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(reportsRes.data);

      } catch (err) {
        console.error("Initialization Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // --- FETCH FULL REPORT DETAILS ---
  const handleReportClick = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      // Calls getReportById in your service to get full description/images
      const res = await axios.get(`http://localhost:5000/api/abuse/my-reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedReport(res.data);
    } catch (err) {
      alert("Failed to load report details.");
    }
  };

  const showAlert = (message) => {
    alert(message);
  };

  const renderNotifications = () => (
    <div className="bg-[#bfb5a5] p-8 rounded-xl border-[3px] border-black shadow-sm w-full mx-auto mt-6">
      <div className="space-y-4">
        {/* MODIFIED: Mapping real 'notifications' state instead of dummy data */}
        {notifications.length > 0 ? notifications.map((notif) => (
          <div
            key={notif.notification_id}
            className={`bg-white p-5 rounded-lg flex items-center border-[3px] border-black shadow-sm cursor-pointer hover:bg-gray-50 transition-all ${notif.is_read ? 'opacity-60' : ''}`}
          >
            <div className="mr-5">
              {notif.type === "abuse_report" ? (
                <WarningIcon className="text-red-500 scale-125" />
              ) : (
                <BellIcon className="text-yellow-500 scale-125" />
              )}
            </div>
            <p className="text-[#4a3f35] font-bold text-xl">
              {notif.message}
            </p>
          </div>
        )) : <p className="text-center font-bold">No notifications found.</p>}
      </div>
    </div>
  );

  const renderMilestones = () => (
    <div className="space-y-8 mt-6 w-full mx-auto">
      <p className="italic text-[#4a3f35] font-bold text-xl">Earn points by adopting pets and reporting abuse. Collect badges as you go!</p>

      {/* Stats Cards */}
      <div className="flex justify-between gap-6">
        {[
          { label: "Total Points", value: 190 },
          { label: "Pets Adopted", value: 2 },
          { label: "Reports Submitted", value: reports.length } // Using real length
        ].map((stat) => (
          <div key={stat.label} className="flex-1 bg-[#dcd3c1] p-8 rounded-xl text-center border-[3px] border-black shadow-sm">
            <p className="text-5xl font-black text-primary mb-1">{stat.value}</p>
            <p className="text-2xl font-black text-[#4a3f35]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Badges Section */}
      <div>
        <h3 className="text-3xl font-black text-primary mb-6">Badges</h3>
        <div className="grid grid-cols-3 gap-6">
          {/* Bronze */}
          <div
            className="bg-[#b3f2c5] p-8 rounded-xl text-center relative border-[3px] border-black shadow-sm cursor-pointer hover:bg-[#9ee2b2] transition-all"
            onClick={() => showAlert("You've unlocked the Bronze badge!")}
          >
            <CheckCircleIcon className="absolute top-3 right-3 text-success scale-125" />
            <div className="text-6xl mb-3">🥉</div>
            <p className="text-2xl font-black text-[#c16e3e]">Bronze</p>
            <p className="text-success font-black text-lg">Earned at 100 pts</p>
          </div>
          {/* Silver */}
          <div
            className="bg-[#dcd3c1] p-8 rounded-xl text-center relative opacity-80 border-[3px] border-black shadow-sm cursor-pointer hover:opacity-100 transition-all"
            onClick={() => showAlert("Action not possible: Silver badge is still locked.")}
          >
            <LockIcon className="absolute top-3 right-3 text-[#4a3f35] scale-125" />
            <div className="text-6xl mb-3 grayscale opacity-50">🥈</div>
            <p className="text-2xl font-black text-gray-500">Silver</p>
            <p className="text-primary font-black text-lg">250 pts - 60 to go</p>
            <div className="w-full h-4 bg-gray-300 rounded-full mt-4 border-[2px] border-black overflow-hidden">
              <div className="bg-success h-full" style={{ width: '76%' }}></div>
            </div>
          </div>
          {/* Gold */}
          <div
            className="bg-[#dcd3c1] p-8 rounded-xl text-center relative opacity-60 border-[3px] border-black shadow-sm cursor-pointer hover:opacity-80 transition-all"
            onClick={() => showAlert("Action not possible: Gold badge is still locked.")}
          >
            <LockIcon className="absolute top-3 right-3 text-[#4a3f35] scale-125" />
            <div className="text-6xl mb-3 grayscale opacity-30">🥇</div>
            <p className="text-2xl font-black text-yellow-600 opacity-50">Gold</p>
            <div className="w-full h-4 bg-gray-300 rounded-full mt-4 border-[2px] border-black overflow-hidden">
              <div className="bg-success h-full opacity-50" style={{ width: '10%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* How to Earn Points Section */}
      <div>
        <h3 className="text-3xl font-black text-primary mb-6">How to Earn Points?</h3>
        <div className="space-y-6">
          <div
            className="bg-[#dcd3c1] p-6 rounded-xl border-[3px] border-black shadow-sm cursor-pointer hover:bg-[#cec3ad] transition-all"
          >
            <div className="flex justify-between font-black text-[#4a3f35] mb-3 text-xl">
              <span>Pet Adoptions (50 pts each)</span>
              <span className="text-primary">100 pts earned</span>
            </div>
            <div className="w-full h-6 bg-gray-300 rounded-full border-[2px] border-black overflow-hidden">
              <div className="bg-primary h-full" style={{ width: '60%' }}></div>
            </div>
          </div>

          <div
            className="bg-[#dcd3c1] p-6 rounded-xl border-[3px] border-black shadow-sm cursor-pointer hover:bg-[#cec3ad] transition-all"
          >
            <div className="flex justify-between font-black text-[#4a3f35] mb-3 text-xl">
              <span>Abuse Reports (30 pts each)</span>
              <span className="text-primary">60 pts earned</span>
            </div>
            <div className="w-full h-6 bg-gray-300 rounded-full border-[2px] border-black overflow-hidden">
              <div className="bg-[#4fb9ff] h-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportsList = () => (
    <div className="space-y-5 mt-6 w-full mx-auto">
      <p className="italic text-[#4a3f35] font-bold text-xl">Track your previous abuse reports</p>
      {/* TODO: Fetch reports from database */}
      {reports.map((report) => (
        <div
          key={report.report_id}
          onClick={() => handleReportClick(report.report_id)} // Fetching full details on click
          className="bg-[#dcd3c1] p-6 rounded-xl flex items-center justify-between cursor-pointer border-[3px] border-black shadow-sm hover:bg-[#cec3ad] transition-all"
        >
          <div>
            <h4 className="text-2xl font-black text-[#4a3f35]">{report.tracking_id} - Reported incident</h4>
            <p className="text-gray-700 font-bold text-lg">
              Submitted {new Date(report.created_at).toLocaleDateString()} - {report.severity.toUpperCase()} Severity
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className={`px-6 py-2 rounded-lg font-black text-lg border-[3px] border-black shadow-sm ${report.status === 'under_review' ? 'bg-[#f4e4bc]' :
                report.status === 'action_taken' ? 'bg-success text-white' : 'bg-gray-200'
              }`}>
              {report.status.replace('_', ' ').toUpperCase()}
            </span>
            <ChevronRightIcon className="text-[#4a3f35] scale-125" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderReportDetails = () => (
    <div className="space-y-8 mt-4 w-full mx-auto animate-in fade-in slide-in-from-left-4 duration-300">
      <button
        onClick={() => setSelectedReport(null)}
        className="flex items-center text-[#4a3f35] font-black text-xl hover:underline mb-6"
      >
        <ArrowBackIcon className="mr-2 scale-110" /> Back to my Reports
      </button>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-[#dcd3c1] p-8 rounded-xl border-[3px] border-black shadow-sm">
            <h3 className="text-3xl font-bold text-[#4a3f35] mb-8 border-b-[3px] border-black pb-3">
              {selectedReport.tracking_id} - Report Details
            </h3>
            <div className="grid grid-cols-2 gap-y-6 text-2xl">
              {/* MODIFIED: Using real keys from getReportById (abuse_datetime, pet_type, etc) */}
              {[
                { label: "Animal", value: selectedReport.pet_type || "Other" },
                { label: "Severity", value: selectedReport.severity },
                { label: "Location", value: selectedReport.address || "Lahore" },
                { label: "Date Reported", value: new Date(selectedReport.abuse_datetime).toLocaleDateString() },
                { label: "Status", value: selectedReport.status.toUpperCase() }
              ].map((row) => (
                <div key={row.label} className="contents group">
                  <span className="font-black text-[#4a3f35]">{row.label}</span>
                  <span className="text-primary font-black">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#dcd3c1] p-8 rounded-xl border-[3px] border-black shadow-sm">
            <h3 className="text-3xl font-black text-[#4a3f35] mb-4">Description</h3>
            <p className="text-primary font-black text-xl leading-relaxed">
              {selectedReport.description}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#dcd3c1] p-8 rounded-xl border-[3px] border-black shadow-sm">
            <h3 className="text-3xl font-black text-[#4a3f35] mb-3">Attachments</h3>
            <p className="text-[#4a3f35] font-bold text-xl mb-6">{selectedReport.images?.length || 0} files attached.</p>
            <div className="flex gap-6">
              {/* MODIFIED: Mapping real image URLs from report_images table */}
              {selectedReport.images?.map((url, i) => (
                <div key={i} className="w-32 h-24 border-[3px] border-black rounded-xl overflow-hidden shadow-sm">
                  <img src={url} className="w-full h-full object-cover" alt="attachment" />
                </div>
              ))}
            </div>
          </div>

          {/* Status Tracker logic mapped to DB status values */}
          <div className="bg-[#dcd3c1] p-8 rounded-xl border-[3px] border-black shadow-sm">
            <h3 className="text-3xl font-black text-[#4a3f35] mb-8">Status Tracker</h3>
            <div className="space-y-8 relative">
              <div className="absolute left-4 top-3 bottom-3 w-0.5 bg-black opacity-30"></div>

              {[
                { label: "Report Submitted", date: new Date(selectedReport.created_at).toLocaleDateString(), done: true },
                { label: "Under Review", date: selectedReport.status !== 'pending' ? 'Completed' : '--', done: selectedReport.status !== 'pending' },
                { label: "Action Taken", date: selectedReport.status === 'action_taken' ? 'Finalized' : '--', done: selectedReport.status === 'action_taken', step: 3 }
              ].map((step, idx) => (
                <div key={idx} className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-5">
                    {step.done ? (
                      <div className="bg-success text-white rounded-full p-1.5 border-[2px] border-black"><CheckCircleIcon /></div>
                    ) : (
                      <div className="bg-gray-300 text-black rounded-full w-9 h-9 flex items-center justify-center font-black border-[2px] border-black">{step.step || idx + 1}</div>
                    )}
                    <span className={`font-black text-xl ${step.done ? 'text-primary' : 'text-gray-400'}`}>{step.label}</span>
                  </div>
                  <span className="text-gray-700 font-black text-lg">{step.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="p-10 w-full max-w-[1440px] mx-auto">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {["Notifications", "Milestones", "My Reports"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedReport(null);
              }}
              className={`px-6 py-2 rounded-full font-bold text-lg transition-all duration-200 border-[3px] border-black
                ${activeTab === tab
                  ? "bg-white text-primary"
                  : "bg-primary text-white hover:bg-opacity-90"}
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <h1 className="text-3xl font-black animate-pulse">Loading dashboard...</h1>
        ) : (
          <>
            <h1 className="text-5xl font-black text-purple-900 mb-4">{activeTab}</h1>
            {activeTab === "Notifications" && renderNotifications()}
            {activeTab === "Milestones" && renderMilestones()}
            {activeTab === "My Reports" && (selectedReport ? renderReportDetails() : renderReportsList())}
          </>
        )}
      </div>
    </Layout>
  );
}
