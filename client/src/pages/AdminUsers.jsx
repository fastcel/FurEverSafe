import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { fetchAllUsers, updateUser, deleteUser } from "../services/adminService";

// Map DB role values → display labels (and back)
const ROLE_DISPLAY = {
  citizen: "Citizen",
  ngo: "Ngo Representative",
  admin: "Admin",
};
const ROLE_DB = {
  Citizen: "citizen",
  "Ngo Representative": "ngo",
  Admin: "admin",
};

export default function AdminUsers() {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  // Edit modal state
  const [editUser, setEditUser]     = useState(null);
  const [editForm, setEditForm]     = useState({});
  const [saving, setSaving]         = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Delete modal state
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  // ── Fetch users on mount ──────────────────────────────────────────────────
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchAllUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // ── Edit helpers ──────────────────────────────────────────────────────────
  const openEdit = (user) => {
    setEditUser(user);
    setEditForm({
      name:           user.name,
      email:          user.email,
      contact_number: user.contact_number,
      // convert DB role → display label for the <select>
      role:           ROLE_DISPLAY[user.role] ?? user.role,
    });
  };

  const saveEdit = async () => {
    try {
      setSaving(true);
      const payload = {
        name:           editForm.name,
        email:          editForm.email,
        contact_number: editForm.contact_number,
        // convert display label → DB value before sending
        role:           ROLE_DB[editForm.role] ?? editForm.role,
      };
      const updated = await updateUser(editUser.user_id, payload);
      setUsers((prev) =>
        prev.map((u) => (u.user_id === updated.user_id ? updated : u))
      );
      setEditUser(null);
      setShowSuccess(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete helpers ────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteUser(userToDelete.user_id);
      // Remove from local list (soft-delete keeps it in DB but we hide it)
      setUsers((prev) => prev.filter((u) => u.user_id !== userToDelete.user_id));
      setUserToDelete(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="w-full min-h-screen bg-[#f0ebe0] flex flex-col py-10 px-12">

        <h1 className="text-3xl font-bold text-[#3a3028] mb-6">Users</h1>

        {/* Loading / Error states */}
        {loading && (
          <p className="text-[#7a6a5a] text-sm">Loading users…</p>
        )}
        {error && (
          <p className="text-red-500 text-sm">Error: {error}</p>
        )}

        {/* Table */}
        {!loading && !error && (
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
                  <tr
                    key={user.user_id}
                    className={i % 2 === 0 ? "bg-[#ece6da]" : "bg-[#e0d9cc]"}
                  >
                    <td className="py-2.5 px-3 text-center">{user.user_id}</td>
                    <td className="py-2.5 px-3 text-center">{user.name}</td>
                    <td className="py-2.5 px-3 text-center">{user.contact_number}</td>
                    <td className="py-2.5 px-3 text-center">{user.email}</td>
                    <td className="py-2.5 px-3 text-center">
                      {ROLE_DISPLAY[user.role] ?? user.role}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => openEdit(user)}
                        className="text-[#3a3028] hover:text-[#d63384] mr-3 text-base"
                      >✏️</button>
                      <button
                        onClick={() => setUserToDelete(user)}
                        className="text-red-500 hover:text-red-700 text-base"
                      >🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[420px] overflow-hidden">

            <div className="bg-[#f8c8d8] py-3 text-center">
              <h2 className="text-lg font-bold text-[#3a3028]">User Profile</h2>
            </div>

            <div className="p-6 space-y-3">
              {[
                { label: "Name:",         key: "name",           type: "text" },
                { label: "Email:",        key: "email",          type: "email" },
                { label: "Phone number:", key: "contact_number", type: "tel" },
                { label: "Role:",         key: "role",           type: "select" },
              ].map(({ label, key, type }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#3a3028] w-32 text-right shrink-0">
                    {label}
                  </span>
                  {type === "select" ? (
                    <select
                      value={editForm[key]}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, [key]: e.target.value }))
                      }
                      className="flex-1 border border-[#c8b89a] rounded px-3 py-1.5 text-sm bg-white outline-none focus:ring-2 focus:ring-[#d63384]"
                    >
                      <option>Citizen</option>
                      <option>Ngo Representative</option>
                      <option>Admin</option>
                    </select>
                  ) : (
                    <div className="flex-1 flex items-center border border-[#c8b89a] rounded overflow-hidden bg-white">
                      <input
                        type={type}
                        value={editForm[key] ?? ""}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, [key]: e.target.value }))
                        }
                        className="flex-1 px-3 py-1.5 text-sm bg-transparent outline-none"
                      />
                      <span className="px-2 text-[#7a6a5a] text-xs cursor-pointer">✏️</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="px-6 pb-6 flex justify-end">
              <button
                onClick={() => setEditUser(null)}
                className="mr-3 text-sm text-[#7a6a5a] hover:underline"
              >Cancel</button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="bg-[#d63384] hover:bg-[#b02770] text-white font-bold px-8 py-2 rounded disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
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
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-[#d63384] hover:bg-[#b02770] text-white font-bold px-10 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 w-96">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-4xl">❗</div>
            <h3 className="text-[#d63384] font-bold text-lg text-center">Delete this user?</h3>
            <p className="text-[#3a3028] text-sm text-center">
              Are you sure you want to delete <strong>{userToDelete.name}</strong>?
              This action is permanent and will deactivate the user's account.
            </p>
            <div className="flex gap-4 mt-2">
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="bg-red-500 hover:bg-red-700 text-white font-bold px-6 py-2 rounded disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
              <button
                onClick={() => setUserToDelete(null)}
                className="bg-green-100 hover:bg-green-200 text-green-800 font-bold px-6 py-2 rounded border border-green-300"
              >
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
