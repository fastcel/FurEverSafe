import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Layout from "../components/layout";

export default function HelpAndSupport() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", description: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (form.email.trim() && form.description.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <Layout>
      <div className="w-full min-h-screen bg-[#f0ebe0] flex flex-col py-10 px-12">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#8b1a6b]">Help & Support</h1>
          <p className="text-[#3a3028] mt-1">Need help? You are at the right place!</p>
        </div>

        {/* Main Card */}
        <div className="w-full bg-[#c8b89a] rounded-2xl p-8 shadow-sm">

          {/* Contact Us Section */}
          <div className="w-full bg-[#b8a88a] rounded-xl p-6 mb-6">
            <h2 className="text-center text-xl font-bold text-[#3a3028] mb-5">Contact Us</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-[#3a3028] w-36 text-right shrink-0">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="abc@gmail.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="flex-1 border border-[#c8b89a] rounded px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-[#d63384]"
                />
              </div>

              <div className="flex items-start gap-4">
                <label className="text-sm font-semibold text-[#3a3028] w-36 text-right shrink-0 mt-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe the issue you are facing"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={5}
                  className="flex-1 border border-[#c8b89a] rounded px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-[#d63384] resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="bg-[#d63384] hover:bg-[#b02770] text-white font-bold px-8 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Two Cards */}
          <div className="grid grid-cols-2 gap-4">

            {/* Report an Abuse */}
            <div className="bg-[#b8a88a] rounded-xl p-5 flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#3a3028] mb-2">Report an abuse</h3>
                <p className="text-sm text-[#3a3028] italic">
                  If you witness animal cruelty or neglect, please report it so NGOs can take action.
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/report-abuse")}
                  className="bg-[#d63384] hover:bg-[#b02770] text-white font-bold px-6 py-1.5 rounded text-sm"
                >
                  Report
                </button>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-[#b8a88a] rounded-xl p-5 flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#3a3028] mb-2">FAQs</h3>
                <p className="text-sm text-[#3a3028] italic">
                  Find quick answers to common questions about reporting abuse, adopting pets, and using FurEver Safe.
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/faq")}
                  className="bg-[#d63384] hover:bg-[#b02770] text-white font-bold px-6 py-1.5 rounded text-sm"
                >
                  FAQ
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => navigate("/profile")}
            className="bg-[#d63384] hover:bg-[#b02770] text-white font-bold px-8 py-2 rounded"
          >
            Back
          </button>
        </div>

      </div>

      {/* Success Modal */}
      {submitted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-4 w-72">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-4xl">✅</div>
            <p className="text-[#3a3028] font-bold text-base text-center">
              Your message has been submitted!
            </p>
            <button
              onClick={() => { setSubmitted(false); navigate("/profile"); }}
              className="bg-[#d63384] hover:bg-[#b02770] text-white font-bold px-10 py-2 rounded"
            >
              Return
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
