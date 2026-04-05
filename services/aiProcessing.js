// Helper Function

function isRetryableError(error) {
  const message = error.message.toLowerCase();

  return (
    message.includes("timeout") ||
    message.includes("rate limit") ||
    message.includes("network")
  );
}

// ========================
// Import Modules
// ========================

// logger
const logger = require("../utils/logger");

//internal services
const buildComplianceContext = require("./complianceContextBuilder");
const logAuditEvent = require("./auditLogger");

//external libraries
const { OpenAI } = require("openai");

//internal utilities
const { incrementRetries } = require("./metricsService");

// ========================
// Initialize OpenAI Client
// ========================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
let activeRequests = 0;
const MAX_CONCURRENT = 2;

// ========================
// AI Processing Function
// ========================

async function processChecklist(policyText, requestId, clientIp) {

  const startTime = Date.now();

  logger.info("AI_REQUEST_STARTED", {
    requestId,
    inputLength: policyText.length,
    clientIp
  });

  // Wait 
  while (activeRequests >= MAX_CONCURRENT) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Lock
  activeRequests++;

  try {
    logAuditEvent(
      "AI_REQUEST_RECEIVED",
      { inputLength: policyText.length },
      requestId,
      clientIp
    );

    const context = buildComplianceContext(policyText);

    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      try {

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          temperature: 0,
          messages: [
            {
              role: "system",
              content: `
You are a compliance assistant.

Convert the input policy into a checklist with EXACTLY these 4 sections:

1. Storage Security
2. Access Control
3. Training Requirements
4. Breach Reporting

Rules:
- Always include all 4 sections
- Do not rename sections
- Do not add extra sections
- Each section must contain bullet checklist items
- Keep wording clear and consistent
`
            },
            {
              role: "user",
              content: JSON.stringify(context)
            }
          ]
        });

        const output = response.choices[0].message.content;

        // Validation
        if (
          !output.includes("Storage Security") ||
          !output.includes("Access Control") ||
          !output.includes("Training Requirements") ||
          !output.includes("Breach Reporting")
        ) {
          throw new Error("AI output validation failed");
        }

        // Success logging
        const duration = Date.now() - startTime;

        logger.info("AI_REQUEST_SUCCESS", {
          requestId,
          duration,
          outputLength: output.length,
          attempts: attempts + 1
        });

        return output;

      } catch (error) {
      if (isRetryableError(error)) {
  attempts++;
  incrementRetries();

  logger.warn("AI_RETRYABLE_ERROR", {
    requestId,
    attempt: attempts,
    error: error.message
  });

} else {

  logger.error("AI_NON_RETRYABLE_ERROR", {
    requestId,
    error: error.message
  });

  throw error;
}

        logger.error("AI_RETRY_ATTEMPT_FAILED", {
          requestId,
          attempt: attempts,
          error: error.message
        });

        if (attempts >= maxAttempts) {

          const duration = Date.now() - startTime;

          logger.error("AI_REQUEST_FAILED", {
            requestId,
            duration,
            attempts,
            error: error.message
          });

          throw new Error("AI service failed after retries");
        }
      }
    }

  } finally {
    activeRequests--;
  }
}
// ========================
// Export Service
// ========================

module.exports = processChecklist;