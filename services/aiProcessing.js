// ========================
// Import Modules
// ========================

const buildComplianceContext = require("./complianceContextBuilder");
const logAuditEvent = require("./auditLogger");
const { OpenAI } = require("openai");

// ========================
// Initialize OpenAI Client
// ========================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ========================
// AI Processing Function
// ========================

async function processChecklist(policyText, requestId, clientIp) {

  // Audit Logging
  logAuditEvent(
    "AI_REQUEST_RECEIVED",
    { inputLength: policyText.length },
    requestId,
    clientIp
  );

  const context = buildComplianceContext(policyText);

  try {

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a compliance assistant that converts policies into structured checklists."
        },
        {
          role: "user",
          content: JSON.stringify(context)
        }
      ]
    });

    return response.choices[0].message.content;

  } catch (error) {

    console.error("AI Processing Error:", error);

    throw new Error("AI service failed");

  }
}

// ========================
// Export Service
// ========================

module.exports = processChecklist;