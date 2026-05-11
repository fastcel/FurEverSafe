import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";

export default function ForgotPassword1() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  return (
    <Layout>
      <div className="w-full min-h-screen bg-[#f0ebe0] flex flex-col py-10 px-10">

        <h1 className="text-2xl font-bold text-[#3a3028] mb-8">Forgot Password</h1>

        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${step === 1 ? "bg-[#d63384] text-white" : "bg-[#d9d2c5] text-[#7a6a5a]"}`}>
                {step}
              </div>
              {step < 3 && <div className="w-12 h-0.5 bg-[#d9d2c5]" />}
            </div>
          ))}
        </div>

        <div className="w-full bg-[#e0d9cc] rounded-xl p-8 space-y-5">
          <div className="text-center space-y-2">
            <p className="font-bold text-[#3a3028]">Forgot Password?</p>
            <p className="text-sm text-[#7a6a5a]">
              Don't worry, we got you! Enter the email linked to your account and we'll send you a reset link.
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#3a3028] mb-1">Email *</label>
            <input type="email" placeholder="Enter your email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#c8b89a] rounded px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-[#d63384]"
            />
          </div>
          <button
            onClick={() => email.trim() && navigate("/forgot-password/email-sent", { state: { email } })}
            className="w-full bg-[#d63384] hover:bg-[#b02770] text-white font-bold py-2.5 rounded">
            Send Reset Link
          </button>
        </div>

      </div>
    </Layout>
  );
}
