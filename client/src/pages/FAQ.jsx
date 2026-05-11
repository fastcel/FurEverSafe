import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const faqs = [
  {
    question: "How do I report animal abuse?",
    answer:
      "Go to the Report Abuse section from the home screen. Fill in a description of what you witnessed, pin the location on the map, and optionally upload photos or videos as proof. You can choose to submit anonymously or with your account. Once submitted, you'll receive a case ID to track your report.",
  },
  {
    question: "Is my identity kept anonymous?",
    answer:
      "Yes. FurEver Safe gives you the option to report anonymously. Your personal information will not be shared with anyone, including the person being reported. Only platform administrators and verified NGOs can see case details, and your identity remains protected throughout the process.",
  },
  {
    question: "How does the adoption process work?",
    answer:
      "Browse available animals in the Adopt a Pet section. Each animal has a full profile with photos, health records, and behavior notes. When you find a match, fill out an adoption application with details about your home and lifestyle. A verified NGO will review your application and contact you. You'll receive updates at every step of the process.",
  },
  {
    question: "How do I earn reward points?",
    answer:
      "You earn reward points by actively contributing to animal welfare on the platform. Points are awarded for submitting a verified abuse report, successfully completing an adoption, referring new users, and consistently following up on your reported cases. You can view your points anytime from your profile.",
  },
  {
    question: "What happens after I submit a report?",
    answer:
      "After submission, your report is reviewed by our team and forwarded to a verified NGO in your area. You will receive a case ID and status updates as the case progresses. The NGO will take appropriate action and update the case accordingly.",
  },
  {
    question: "How are NGOs verified on the platform?",
    answer:
      "NGOs go through a strict verification process that includes document submission, background checks, and approval by the FurEver Safe admin team. Only verified NGOs can access case reports and initiate adoptions on the platform.",
  },
];

export default function FAQ() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = faqs.filter((f) =>
    f.question.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <Layout>
      <div className="w-full min-h-screen bg-[#f0ebe0] flex flex-col py-10 px-12">

        {/* Title */}
        <h1 className="text-3xl font-bold text-[#8b1a6b] text-center mb-6">FAQs</h1>

        {/* Search */}
        <div className="relative mb-6">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a6a5a]">🔍</span>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-[#c8b89a] rounded-lg pl-9 pr-4 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-[#d63384]"
          />
        </div>

        {/* FAQ List */}
        <div className="w-full space-y-3 flex-1">
          {filtered.length === 0 && (
            <p className="text-center text-[#7a6a5a] mt-10">No results found.</p>
          )}
          {filtered.map((faq, i) => (
            <div key={i} className="w-full bg-[#e0d9cc] rounded-xl overflow-hidden shadow-sm">

              {/* Question Row */}
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-[#3a3028] font-semibold text-base">
                  {faq.question}
                </span>
                <span className="text-[#d63384] text-2xl font-bold shrink-0 ml-4">
                  {openIndex === i ? "✕" : "+"}
                </span>
              </button>

              {/* Answer */}
              {openIndex === i && (
                <div className="px-6 pb-5 text-sm text-[#3a3028] leading-relaxed border-t border-[#c8b89a] pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={() => navigate("/help-and-support")}
            className="bg-[#d63384] hover:bg-[#b02770] text-white font-bold px-8 py-2 rounded"
          >
            Back
          </button>
        </div>

      </div>
    </Layout>
  );
}
