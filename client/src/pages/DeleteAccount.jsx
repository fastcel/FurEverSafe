import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";

export default function DeleteAccount() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="w-full min-h-screen bg-[#f0ebe0] flex flex-col py-10 px-10">

        <h1 className="text-2xl font-bold text-[#3a3028] mb-6">User Profile</h1>

        <div className="w-full bg-[#e0d9cc] rounded-xl p-16 flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-4xl">⚠️</div>
          <div>
            <p className="text-xl font-bold text-[#3a3028] uppercase tracking-wide">Are you sure you want to</p>
            <p className="text-xl font-bold text-[#d63384] uppercase tracking-wide">Delete your account?</p>
          </div>
          <p className="text-sm text-[#7a6a5a]">Deleting your account is permanent and cannot be undone.</p>
          <div className="flex gap-4">
            <button onClick={() => navigate("/profile")}
              className="bg-[#b8ae9e] hover:bg-[#a09080] text-white font-bold px-8 py-2.5 rounded">
              Return Back
            </button>
            <button onClick={() => navigate("/login")}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-2.5 rounded">
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
}
