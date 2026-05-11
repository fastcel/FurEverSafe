import { useState } from "react";
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

// Dummy Data
const NOTIFICATIONS = [
  { id: 1, text: "Your adoption request for Milo is approved", type: "success" },
  { id: 2, text: "Your adoption request for Bella is processing", type: "info" },
  { id: 3, text: "Your adoption request for Jack is approved", type: "success" },
  { id: 4, text: "Your recent abuse request has been approved", type: "success" },
  { id: 5, text: "Your adoption request for Emma is rejected", type: "error" },
  { id: 6, text: "Your recent abuse request has been rejected", type: "info" },
  { id: 7, text: "Your adoption request for Olivia is approved", type: "error" },
];

const REPORTS = [
  { id: "RPT-2847", animal: "Dog", type: "abuse", location: "Gulberg, Lahore", date: "April 27th, 2026", severity: "Moderate", status: "Under Review" },
  { id: "RPT-2906", animal: "Cat", type: "abuse", location: "Faisal Town", date: "April 18th, 2026", severity: "Minor", status: "Action Taken" },
  { id: "RPT-3447", animal: "Duck", type: "abuse", location: "Gulberg", date: "April 20th, 2026", severity: "Moderate", status: "In Progress" },
  { id: "RPT-3448", animal: "Cat", type: "abuse", location: "DHA Phase 1", date: "April 02th, 2026", severity: "Moderate", status: "Rejected" },
  { id: "RPT-3449", animal: "Cow", type: "abuse", location: "Johar Town", date: "April 15th, 2026", severity: "Severe", status: "Action Taken" },
  { id: "RPT-3450", animal: "Horse", type: "abuse", location: "Cantt", date: "April 6th, 2026", severity: "Minor", status: "Under Review" },
];

export default function UserNotifications() {
  const [activeTab, setActiveTab] = useState("Notifications");
  const [selectedReport, setSelectedReport] = useState(null);

  const showAlert = (message) => {
    alert(message);
  };

  const renderNotifications = () => (
    <div className="bg-[#bfb5a5] p-8 rounded-xl border-[3px] border-black shadow-sm w-full mx-auto mt-6">
      <div className="space-y-4">
        {/* TODO: Fetch notifications from database */}
        {NOTIFICATIONS.map((notif) => (
          <div
            key={notif.id}
            className="bg-white p-5 rounded-lg flex items-center border-[3px] border-black shadow-sm cursor-pointer hover:bg-gray-50 transition-all"
            onClick={() => showAlert(`Opening details for: ${notif.text}`)}
          >
            <div className="mr-5">
              {notif.type === "error" ? (
                <WarningIcon className="text-red-500 scale-125" />
              ) : (
                <BellIcon className="text-yellow-500 scale-125" />
              )}
            </div>
            <p className="text-[#4a3f35] font-bold text-xl">
              {notif.text.split(" ").map((word, i) => (
                <span key={i} className={["Milo", "Bella", "Jack", "Emma", "Olivia"].includes(word) ? "text-primary" : ""}>
                  {word}{" "}
                </span>
              ))}
            </p>
          </div>
        ))}
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
          { label: "Reports Submitted", value: 3 }
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex-1 bg-[#dcd3c1] p-8 rounded-xl text-center border-[3px] border-black shadow-sm cursor-pointer hover:bg-[#cec3ad] transition-all"
            onClick={() => showAlert(`Refreshing ${stat.label} stats...`)}
          >
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
      {REPORTS.map((report) => (
        <div
          key={report.id}
          onClick={() => setSelectedReport(report)}
          className="bg-[#dcd3c1] p-6 rounded-xl flex items-center justify-between cursor-pointer border-[3px] border-black shadow-sm w-full-sm hover:bg-[#cec3ad] transition-all"
        >
          <div>
            <h4 className="text-2xl font-black text-[#4a3f35]">{report.id} - {report.animal} abuse, {report.location}</h4>
            <p className="text-gray-700 font-bold text-lg">Submitted {report.date} - {report.severity} Severity</p>
          </div>
          <div className="flex items-center gap-6">
            <span className={`px-6 py-2 rounded-lg font-black text-lg border-[3px] border-black shadow-sm w-full-sm'}
              ${report.status === 'Under Review' ? 'bg-[#f4e4bc]' :
                report.status === 'Action Taken' ? 'bg-success text-white' :
                  report.status === 'In Progress' ? 'bg-[#bae1ff]' :
                    report.status === 'Rejected' ? 'bg-red-500 text-white' : ''}
            `}>
              {report.status}
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
        {/* Main Details */}
        <div className="space-y-8">
          <div className="bg-[#dcd3c1] p-8 rounded-xl border-[3px] border-black shadow-sm">
            <h3 className="text-3xl font-bold text-[#4a3f35] mb-8 border-b-[3px] border-black pb-3">
              {selectedReport.id} - Report Details
            </h3>
            <div className="grid grid-cols-2 gap-y-6 text-2xl">
              {[
                { label: "Animal", value: selectedReport.animal },
                { label: "Severity", value: selectedReport.severity },
                { label: "Location", value: `${selectedReport.location}, Lahore` },
                { label: "Date Reported", value: selectedReport.date },
                { label: "NGO Assigned", value: "PawSave, Lahore" },
                { label: "Status", value: selectedReport.status }
              ].map((row) => (
                <div key={row.label} className="contents group cursor-pointer" onClick={() => showAlert(`Detail: ${row.label}`)}>
                  <span className="font-black text-[#4a3f35] group-hover:text-primary transition-colors">{row.label}</span>
                  <span className="text-primary font-black group-hover:underline">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="bg-[#dcd3c1] p-8 rounded-xl border-[3px] border-black shadow-sm cursor-pointer hover:bg-[#cec3ad] transition-colors"
            onClick={() => showAlert("Full description view not implemented yet.")}
          >
            <h3 className="text-3xl font-black text-[#4a3f35] mb-4">Description</h3>
            <p className="text-primary font-black text-xl leading-relaxed">
              Saw a bunch of kids abusing a dog by throwing objects at it. The poor thing was severely injured. It was probably a stray dog and seemed extremely malnourished as well.
            </p>
          </div>
        </div>

        {/* Attachments & Status Tracker */}
        <div className="space-y-8">
          <div className="bg-[#dcd3c1] p-8 rounded-xl border-[3px] border-black shadow-sm">
            <h3 className="text-3xl font-black text-[#4a3f35] mb-3">Attachments</h3>
            <p className="text-[#4a3f35] font-bold text-xl mb-6">3 files attached.</p>
            <div className="flex gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-32 h-24 bg-primary/10 border-[3px] border-black rounded-xl flex items-center justify-center relative cursor-pointer hover:bg-primary/20 transition-all shadow-sm"
                  onClick={() => showAlert(`Opening image attachment ${i}...`)}
                >
                  <ImageIcon className="text-primary scale-150" />
                  <span
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center border-[2px] border-black cursor-pointer hover:bg-red-600 transition-colors shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      showAlert("Action not possible: Cannot delete archived attachments.");
                    }}
                  >
                    <CloseIcon className="scale-110" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#dcd3c1] p-8 rounded-xl border-[3px] border-black shadow-sm">
            <h3 className="text-3xl font-black text-[#4a3f35] mb-8">Status Tracker</h3>
            <div className="space-y-8 relative">
              <div className="absolute left-4 top-3 bottom-3 w-0.5 bg-black opacity-30"></div>

              {[
                { label: "Report Submitted", date: "Apr 26th, 2026", done: true },
                { label: "NGO notified", date: "Apr 26th, 2026", done: true },
                { label: "Under Review", date: "Apr 27th, 2026", done: true },
                { label: "Action Taken", date: "--", done: false, step: 4 }
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between relative z-10 cursor-pointer group"
                  onClick={() => showAlert(`Status: ${step.label}`)}
                >
                  <div className="flex items-center gap-5">
                    {step.done ? (
                      <div className="bg-success text-white rounded-full p-1.5 border-[2px] border-black shadow-sm"><CheckCircleIcon className="scale-110" /></div>
                    ) : (
                      <div className="bg-gray-300 text-black rounded-full w-9 h-9 flex items-center justify-center font-black text-xl border-[2px] border-black shadow-sm">{step.step}</div>
                    )}
                    <span className={`font-black text-xl transition-colors ${step.done ? 'text-primary' : 'text-gray-400'} group-hover:text-primary`}>
                      {step.label}
                    </span>
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

        <h1 className="text-5xl font-black text-purple-900  mb-4">{activeTab}</h1>

        {activeTab === "Notifications" && renderNotifications()}
        {activeTab === "Milestones" && renderMilestones()}
        {activeTab === "My Reports" && (selectedReport ? renderReportDetails() : renderReportsList())}
      </div>
    </Layout>
  );
}
