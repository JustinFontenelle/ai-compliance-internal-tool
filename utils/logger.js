function log(level, event, meta = {}) {
  const logEntry = {
    level,
    event,
    service: "ai-compliance-tool",
    timestamp: new Date().toISOString(),
    ...meta
  };

  console.log(JSON.stringify(logEntry));
}

module.exports = {
  info: (event, meta) => log("info", event, meta),
  warn: (event, meta) => log("warn", event, meta),
  error: (event, meta) => log("error", event, meta)
};