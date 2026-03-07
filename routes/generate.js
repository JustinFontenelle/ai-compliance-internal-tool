
// ========================
// Import Modules
// ========================

const express = require("express");
const router = express.Router();
const validateRequest = require("../middleware/validateRequest");
const processChecklist = require("../services/aiProcessing");

// ========================
// Route Handler
// ========================

router.post("/generate", validateRequest, async (req, res) => {

  try {

    const result = await processChecklist(req.body.text);

    res.json({ result });

  } catch (error) {

    console.error("AI processing error:", error);

    res.status(500).json({ error: "AI processing failed" });

  }

});

// ========================
// Export the router
// ========================

module.exports = router;