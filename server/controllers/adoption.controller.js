const adoptionService = require("../services/adoption.service");

const submitApplication = async (req, res) => {
  try {
    const result = await adoptionService.submitApplication(req.body,req.user.id);

    return res.status(201).json({
      message: "Application submitted successfully",
      application: result,
    });

  } catch (err) {
    console.log("🔥 CONTROLLER ERROR:", err.message);

    return res.status(400).json({
      error: err.message || "Failed to submit application",
    });
  }
};

const getUserApplications = async (req, res) => {
  try {
    const { user_id, tab } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "user_id required" });
    }

    const data = await adoptionService.getUserApplications(user_id, tab);

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

module.exports = {
  submitApplication,
  getUserApplications,
};