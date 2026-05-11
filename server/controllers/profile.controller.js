const profileService = require("../services/profile.service");

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      name,
      email,
      contact_number,
      oldPassword,
      newPassword,
      confirmPassword
    } = req.body;

    const updatedUser = await profileService.updateProfile(userId, {
      name,
      email,
      contact_number,
      oldPassword,
      newPassword,
      confirmPassword
    });

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

const getProfile = async (req, res) => {
  try {
    const user = await profileService.getProfile(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  updateProfile,
  getProfile
};