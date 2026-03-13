// ========================
// Import Dependencies
// ========================

const logger = require("../utils/logger");
const { incrementErrors } = require("../services/metricsService");

//=========================
// Global Error Handler
//=========================

function errorHandler(err, req, res, next) {

  logger.error("Unhandled error occurred", {

    requestId: req.requestId,
    route: req.originalUrl,
    method: req.method,
    clientIp: req.ip,

    errorMessage: err.message,
    stack: err.stack

  });

  res.status(500).json({
    error: "Internal Server Error",
    requestId: req.requestId
  });

}
// ========================
// Export
// ========================

module.exports = errorHandler;