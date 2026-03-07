function buildComplianceContext(policyText) {

  const systemInstruction =
    "You convert policy text into a standardized compliance checklist.";

  const context = {
    systemInstruction,
    userInput: policyText
  };

  return context;
}

module.exports = buildComplianceContext;