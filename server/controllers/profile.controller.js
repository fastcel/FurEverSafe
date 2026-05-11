const profileService = require("../services/profile.service");

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const updatedUser = await profileService.updateProfile(userId, req.body);

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (err) {
    console.log("🔥 PROFILE CONTROLLER ERROR:", err.message);

    res.status(400).json({
      error: err.message || "Failed to update profile",
    });
  }
};

module.exports = {
  updateProfile,
};