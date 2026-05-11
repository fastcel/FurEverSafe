const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.users.controller");
const { authenticate, authorizeRoles } = require("../middlewares/auth.middleware");

router.get("/users", authenticate, authorizeRoles("admin"), adminController.getAllUsers);
router.patch("/users/:id", authenticate, authorizeRoles("admin"),adminController.updateUserPatch);
router.delete("/users/:id", authenticate, authorizeRoles("admin"),adminController.deleteUser);
router.get(
  "/audit-logs",
  authenticate,
  authorizeRoles("admin"),
  adminController.getAuditLogs
);

module.exports = router;