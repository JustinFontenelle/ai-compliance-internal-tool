//=========================
// Request Event Logger
//=========================

const logger = require("./logger");

function logRequestEvent(req, event, details = {}) {

  logger.info(event, {
    requestId: req.requestId,
    route: req.originalUrl,
    method: req.method,
    ...details
  });

}

module.exports = {
  logRequestEvent
};