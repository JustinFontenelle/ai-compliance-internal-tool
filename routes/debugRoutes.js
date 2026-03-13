//=========================
// Debug Routes
//=========================

const express = require("express");

const router = express.Router();


//=========================
// System Debug Endpoint
//=========================

router.get("/system", (req, res) => {

  res.json({
    status: "debug",
    service: "AI Compliance Documentation Tool",

    // Runtime information
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    nodeVersion: process.version,

    // Request context (useful during incident investigation)
    requestId: req.requestId,
    clientIp: req.ip,

    // Timestamp
    timestamp: new Date().toISOString()

  });

});


//=========================
// Export Router
//=========================

module.exports = router;