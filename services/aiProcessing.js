// ========================
// Import Modules
// ========================

const buildComplianceContext = require("./complianceContextBuilder");
const logAuditEvent = require("./auditLogger");

// ========================
// AI Processing Function
// ========================

async function processChecklist(policyText, requestId, clientIp) {

  logAuditEvent(
    "AI_REQUEST_RECEIVED",
    { inputLength: policyText.length },
    requestId,
    clientIp
  );

  const context = buildComplianceContext(policyText);

  return `Compliance Checklist

- Ensure employees complete cybersecurity awareness training annually
- Verify devices use encrypted storage
- Confirm security incidents are reported within 24 hours`;
}
// ========================
// Export Service
// ========================

module.exports = processChecklist;