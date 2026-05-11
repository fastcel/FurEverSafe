const adminService = require("../services/admin.service");

const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();

    return res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (err) {
    console.log("🔥 ADMIN CONTROLLER ERROR:", err.message);

    return res.status(500).json({
      error: "Failed to fetch users",
    });
  }
};

const updateUserPatch = async (req, res) => {
  try {
    const userId = req.params.id;

    const updatedUser = await adminService.updateUserPatch(
      userId,
      req.body,
      req.user.id
    );

    return res.status(200).json({
      message: "User updated successfully (PATCH)",
      user: updatedUser,
    });

  } catch (err) {
    console.log("🔥 PATCH USER ERROR:", err.message);

    return res.status(400).json({
      error: err.message || "Failed to update user",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const result = await adminService.deleteUser(
        userId,
        req.user.id
    );

    return res.status(200).json(result);

  } catch (err) {
    console.log("🔥 DELETE USER ERROR:", err.message);

    return res.status(400).json({
      error: err.message || "Failed to delete user",
    });
  }
};

const getAuditLogs = async (req, res) => {
  try {
    const logs = await adminService.getAuditLogs();

    return res.status(200).json({
      message: "Audit logs fetched successfully",
      logs,
    });

  } catch (err) {
    console.log("🔥 AUDIT LOG ERROR:", err.message);

    return res.status(500).json({
      error: "Failed to fetch audit logs",
    });
  }
};

module.exports = { getAllUsers, updateUserPatch, deleteUser, getAuditLogs };