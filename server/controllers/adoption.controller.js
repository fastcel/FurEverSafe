const adoptionService = require("../services/adoption.service");

const submitApplication = async (req, res) => {
  try {
    const result = await adoptionService.submitApplication(req.body);

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

module.exports = {
  submitApplication,
};