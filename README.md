AI-Assisted Compliance Documentation Tool

Overview

This project is an internal AI-assisted tool designed for regulated environments such as healthcare practices and legal organizations. It demonstrates how AI can be used responsibly to accelerate compliance documentation workflows while preserving security, auditability, and human oversight.
The system focuses on transforming unstructured onboarding and policy text into standardized, reviewable compliance checklists—reducing operational friction without removing accountability.

Case Study

Context

Regulated organizations rely on accurate, well-structured documentation to meet legal and compliance requirements (e.g., PHIPA in Canadian healthcare). Disorganized onboarding materials and policy documentation increase the risk of audit failures, privacy breaches, and legal exposure.
This tool was designed to improve documentation consistency and speed while ensuring final responsibility remains with human reviewers.

The Problem

Many organizations still rely on manual processes to organize onboarding and compliance documentation. These workflows are slow, inconsistent, and difficult to scale—often requiring weeks of staff time to review, validate, and restructure content while policies continue to change.
Manual review alone is insufficient. AI can help accelerate this process, but only if used within a secure, controlled system that respects regulatory constraints.




The Approach

The system follows a deliberate and security-first flow:
Frontend → Backend → AI → Backend → Frontend → Human Review
The frontend collects user input only.
A backend server acts as a trusted intermediary.
AI is used to organize and standardize documentation.
Results are returned for explicit human review and final judgment.
All AI interactions occur behind a backend proxy. API keys are never exposed in the browser, and clear trust boundaries are enforced. AI functions strictly as an accelerator—not a decision-maker.

Key Decisions & Tradeoffs

Security-first architecture: Frontend-only AI integration was intentionally avoided. Browsers are untrusted environments, and exposing AI access at the client level introduces security and misuse risks.
Cost-aware automation: AI usage is metered via API quotas. Prompts must be intentional to avoid unnecessary cost. Automation is treated as a resource, not a default.
Restraint over feature expansion: Over-automation in regulated systems increases risk. This tool prioritizes simplicity and reliability over aggressive feature growth.

Outcome

The system enables faster, more structured documentation workflows while reducing compliance risk and administrative overhead. It improves onboarding clarity, supports regulatory alignment, and preserves human accountability.
This project reflects my approach to building internal tools: pragmatic, security-conscious, and focused on real operational constraints.


Architecture & Implementation Notes

Frontend / Backend Separation

index.html handles user interaction and interface logic.
Backend services handle AI communication and security concerns.
This separation mirrors production best practices and allows AI providers or logic to be swapped without impacting the UI.

AI Integration

A large language model (LLM) is integrated via API to transform unstructured policy text into standardized compliance checklists.
Models evaluated:
GPT-3.5-Turbo — selected for early prototyping due to availability, cost efficiency, and reliability for structured text tasks.
GPT-4o-mini — evaluated but not used during early development due to access limitations.
The AI is guided using structured prompts that define role, constraints, and output format to reduce ambiguity.

Security & Constraints

Direct browser-based AI calls are blocked due to CORS and credential security requirements.
A backend proxy is required to securely manage API credentials and enforce access control.
The system includes defensive checks for invalid responses, missing data, and quota errors.
API quota errors are handled gracefully, confirming correct routing and authentication behaviour under real-world constraints.


What I Learned
Security-first architecture matters: Frontend environments are untrusted; backend proxies are essential.
AI is an accelerator, not a decision-maker: Human review remains critical in regulated systems.
Cost and quota constraints shape design: Automation must be intentional and measurable.
Clear trust boundaries simplify reasoning: Separation of concerns improves security and maintainability.
Knowing when not to automate is a real skill: Over-automation increases risk; judgement matters
Documentation is part of the system: Clear explanations improve trust and long-term maintainability.
