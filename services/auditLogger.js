function logAuditEvent(eventType, details) {

  const auditEntry = {
    timestamp: new Date().toISOString(),
    event: eventType,
    details
  };

  console.log(JSON.stringify(auditEntry));
}

module.exports = logAuditEvent;