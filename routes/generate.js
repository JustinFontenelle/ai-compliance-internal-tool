// ========================
// Utilities
// ========================

const { logRequestEvent } = require("../utils/requestEvents");


// ========================
// Import Modules
// ========================

const express = require("express");
const router = express.Router();


// ========================
// Middleware
// ========================

const authorizeRequest = require("../middleware/authorizeRequest");
const validateRequest = require("../middleware/validateRequest");


// ========================
// Services / Processing
// ========================

const processChecklist = require("../services/aiProcessing");


// ========================
// Response Utilities
// ========================

const { formatSuccess, formatError } = require("../utils/responseFormatter");


// ========================
// Route Handler
// ========================

router.post("/generate", authorizeRequest, validateRequest, async (req, res, next) => {

  // ========================
  // Request Timeline Event
  // ========================

  logRequestEvent(req, "Generate checklist request received");


  try {

    const result = await processChecklist(
      req.body.text,
      req.requestId,
      req.clientIp
    );

    res.json(formatSuccess(result));

  } catch (error) {

    next(error);

  }

});


// ========================
// Export Router
// ========================

module.exports = router;