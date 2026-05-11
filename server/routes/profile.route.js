const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profile.controller");
const { authenticate } = require("../middlewares/auth.middleware");

// update profile
router.get("/profile", authenticate, profileController.getProfile);
router.patch("/profile", authenticate, profileController.updateProfile);
router.delete("/profile", authenticate, profileController.deleteProfile);

module.exports = router;