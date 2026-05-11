import { useState } from "react";
import Layout from "../components/Layout";

const initialUsers = [
  { id: 1,  name: "AliAhmed1",    phone: "+923333482873", email: "aliahmed@gmail.com",    role: "Citizen",           password: "••••••••" },
  { id: 2,  name: "AishaKhan",    phone: "+923335728532", email: "aishakhan@gmail.com",   role: "Citizen",           password: "••••••••" },
  { id: 3,  name: "Fatima123",    phone: "+923300486775", email: "fatima123@gmail.com",   role: "Citizen",           password: "••••••••" },
  { id: 4,  name: "HamzaHehe",    phone: "+923336549831", email: "hamzaaa@gmail.com",     role: "Citizen",           password: "••••••••" },
  { id: 5,  name: "AhmedloI",     phone: "+923334828734", email: "ahmedlol@gmail.com",    role: "Ngo Representative",password: "••••••••" },
  { id: 6,  name: "Sara_Ali",     phone: "+923006549131", email: "sarali@gmail.com",      role: "Citizen",           password: "••••••••" },
  { id: 7,  name: "AmnaHey",      phone: "+923334828873", email: "hamzahey@gmail.com",    role: "Citizen",           password: "••••••••" },
  { id: 8,  name: "Zain12Abbas",  phone: "+923334828273", email: "zainabbas@gmail.com",   role: "Citizen",           password: "••••••••" },
  { id: 9,  name: "SaadQureshi",  phone: "+924235423570", email: "sadsaad@gmail.com",     role: "Ngo Representative",password: "••••••••" },
  { id: 10, name: "AliHere",      phone: "+923336832881", email: "alihere@gmail.com",     role: "Citizen",           password: "••••••••" },
  { id: 11, name: "Sana_Butt",    phone: "+923333482873", email: "sanabutt@gmail.com",    role: "Citizen",           password: "••••••••" },
  { id: 12, name: "Iqra_a",       phone: "+923006549131", email: "iqraaaa@gmail.com",     role: "Citizen",           password: "••••••••" },
  { id: 13, name: "Fatima_",      phone: "+923334757553", email: "fatima12@gmail.com",    role: "Ngo Representative",password: "••••••••" },
  { id: 14, name: "ZaraPetLover", phone: "+923336832881", email: "zara67@gmail.com",      role: "Citizen",           password: "••••••••" },
  { id: 15, name: "Ahmed_Rashid", phone: "+923336548773", email: "ahmedrashid@gmail.com", role: "Citizen",           password: "••••••••" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);

  // Edit modal
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Delete modal
  const [deleteUser, setDeleteUser] = useState(null);

  const openEdit = (user) => {
    setEditUser(user);
    setEditForm({ ...user });
  };

  const saveEdit = () => {
    setUsers((prev) => prev.map((u) => (u.id === editUser.id ? editForm : u)));
    setEditUser(null);
    setShowSuccess(true);
  };

  const confirmDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
    setDeleteUser(null);
  };

  return (
    <Layout>
      <div className="w-full min-h-screen bg-[#f0ebe0] flex flex-col py-10 px-12">

        <h1 className="text-3xl font-bold text-[#3a3028] mb-6">Users</h1>

        {/* Table */}
        <div className="w-full bg-[#e0d9cc] rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm text-[#3a3028]">
            <thead>
              <tr className="bg-[#c8b89a] font-bold">
                <th className="py-3 px-3 text-center">ID</th>
                <th className="py-3 px-3 text-center">Name</th>
                <th className="py-3 px-3 text-center">Phone No</th>
                <th className="py-3 px-3 text-center">Email</th>
                <th className="py-3 px-3 text-center">Role</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.id} className={i % 2 === 0 ? "bg-[#ece6da]" : "bg-[#e0d9cc]"}>
                  <td className="py-2.5 px-3 text-center">{user.id}</td>
                  <td className="py-2.5 px-3 text-center">{user.name}</td>
                  <td className="py-2.5 px-3 text-center">{user.phone}</td>
                  <td className="py-2.5 px-3 text-center">{user.email}</td>
                  <td className="py-2.5 px-3 text-center">{user.role}</td>
                  <td className="py-2.5 px-3 text-center">
                    <button onClick={() => openEdit(user)}
                      className="text-[#3a3028] hover:text-[#d63384] mr-3 text-base">✏️</button>
                    <button onClick={() => setDeleteUser(user)}
                      className="text-red-500 hover:text-red-700 text-base">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* ── Edit Modal ── */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[420px] overflow-hidden">

            {/* Modal Header */}
            <div className="bg-[#f8c8d8] py-3 text-center">
              <h2 className="text-lg font-bold text-[#3a3028]">User Profile</h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-3">
              {[
                { label: "Name:",         key: "name",     type: "text" },
                { label: "Email:",        key: "email",    type: "email" },
                { label: "Phone number:", key: "phone",    type: "tel" },
                { label: "Role:",         key: "role",     type: "select" },
                { label: "Password:",     key: "password", type: "password" },
              ].map(({ label, key, type }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#3a3028] w-32 text-right shrink-0">{label}</span>
                  {type === "select" ? (
                    <select value={editForm[key]}
                      onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="flex-1 border border-[#c8b89a] rounded px-3 py-1.5 text-sm bg-white outline-none focus:ring-2 focus:ring-[#d63384]">
                      <option>Citizen</option>
                      <option>Ngo Representative</option>
                      <option>Admin</option>
                    </select>
                  ) : (
                    <div className="flex-1 flex items-center border border-[#c8b89a] rounded overflow-hidden bg-white">
                      <input type={type} value={editForm[key]}
                        onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                        className="flex-1 px-3 py-1.5 text-sm bg-transparent outline-none" />
                      <span className="px-2 text-[#7a6a5a] text-xs cursor-pointer">✏️</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 flex justify-end">
              <button onClick={() => setEditUser(null)}
                className="mr-3 text-sm text-[#7a6a5a] hover:underline">Cancel</button>
              <button onClick={saveEdit}
                className="bg-[#d63384] hover:bg-[#b02770] text-white font-bold px-8 py-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Modal ── */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 w-80">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-4xl">✅</div>
            <p className="text-[#d63384] font-bold text-base text-center">
              User information successfully updated!
            </p>
            <button onClick={() => setShowSuccess(false)}
              className="bg-[#d63384] hover:bg-[#b02770] text-white font-bold px-10 py-2 rounded">
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 w-96">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-4xl">❗</div>
            <h3 className="text-[#d63384] font-bold text-lg text-center">Delete this user?</h3>
            <p className="text-[#3a3028] text-sm text-center">
              Are you sure you want to delete this account? This action is permanent and will remove the user's account forever.
            </p>
            <div className="flex gap-4 mt-2">
              <button onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold px-6 py-2 rounded">
                Yes, Delete
              </button>
              <button onClick={() => setDeleteUser(null)}
                className="bg-green-100 hover:bg-green-200 text-green-800 font-bold px-6 py-2 rounded border border-green-300">
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
}
