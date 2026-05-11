const milestoneService = require("../services/milestone.service");

const getMilestones = async (req, res) => {
  try {
    const userId = 1; // 🔥 HARD CODE FOR NOW (as you said)

    const data = await milestoneService.getUserMilestones(userId);

    res.json(data);

  } catch (err) {
    console.log("MILESTONE ERROR:", err);
    res.status(500).json({ error: "Failed to fetch milestones" });
  }
};

module.exports = {
  getMilestones
};