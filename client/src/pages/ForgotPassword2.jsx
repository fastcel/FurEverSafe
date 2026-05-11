import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/layout";

export default function ForgotPassword2() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "yourEmail@example.com";

  return (
    <Layout>
      <div className="w-full min-h-screen bg-[#f0ebe0] flex flex-col py-10 px-10">

        <h1 className="text-2xl font-bold text-[#3a3028] mb-8">Forgot Password</h1>

        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${step <= 2 ? "bg-[#d63384] text-white" : "bg-[#d9d2c5] text-[#7a6a5a]"}`}>
                {step <= 2 ? (step === 1 ? "✓" : "2") : "3"}
              </div>
              {step < 3 && <div className={`w-12 h-0.5 ${step < 2 ? "bg-[#d63384]" : "bg-[#d9d2c5]"}`} />}
            </div>
          ))}
        </div>

        <div className="w-full bg-[#e0d9cc] rounded-xl p-8 space-y-5 text-center">
          <button onClick={() => navigate("/forgot-password")}
            className="text-sm text-[#7a6a5a] hover:underline block text-left">
            ← Back to Step 1
          </button>
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto">✅</div>
          <div>
            <h2 className="text-lg font-bold text-[#3a3028]">Email Sent</h2>
            <p className="text-sm text-[#7a6a5a] mt-1">
              We've sent a reset link to <span className="font-semibold text-[#3a3028]">{email}</span>.
              Check your inbox and click the link to reset your password.
            </p>
          </div>
          <button className="w-full bg-[#d63384] hover:bg-[#b02770] text-white font-bold py-2.5 rounded">
            Open Email App
          </button>
          <p className="text-sm text-[#7a6a5a]">
            Didn't receive it?{" "}
            <span className="text-[#d63384] cursor-pointer underline" onClick={() => navigate("/forgot-password")}>
              Resend
            </span>
          </p>
        </div>

      </div>
    </Layout>
  );
}
