const BASE_URL = "http://localhost:5000/api/admin"; // adjust port if needed

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// GET all users
export const fetchAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  const data = await res.json();
  return data.users;
};

// PATCH update a user
export const updateUser = async (userId, updatedFields) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(updatedFields),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update user");
  }
  const data = await res.json();
  return data.user;
};

// DELETE (soft-delete) a user
export const deleteUser = async (userId) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete user");
  }
  return res.json();
};
