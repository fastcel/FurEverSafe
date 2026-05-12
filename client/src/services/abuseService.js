const BASE_URL = "http://localhost:5000/api/abuse"; // adjust port if needed

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// GET NGO reports (current / previous)
export const fetchNgoReports = async (tab = "current") => {
  const res = await fetch(`${BASE_URL}/ngo?tab=${tab}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch NGO reports");
  const data = await res.json();
  return data.reports ?? data;
};

// GET a single report by ID (NGO view)
export const fetchReportById = async (id) => {
  const res = await fetch(`${BASE_URL}/ngo/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch report details");
  const data = await res.json();
  return data.report ?? data;
};

// PATCH accept / verify a case
export const acceptCase = async (id) => {
  const res = await fetch(`${BASE_URL}/ngo/${id}/accept`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to accept case");
  }
  return res.json();
};

// PATCH dismiss / reject a case
export const dismissCase = async (id) => {
  const res = await fetch(`${BASE_URL}/ngo/${id}/dismiss`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to dismiss case");
  }
  return res.json();
};
