// services/queueService.js

const logger = require("../utils/logger");

// =========================
// In Memory Job Queue
// =========================

const {
  incrementRequests,
  startRequest,
  finishRequest,
  incrementErrors
} = require("./metricsService");

const processChecklist = require("./aiProcessing");

const JOB_TIMEOUT_MS = 10000; // 10 seconds timeout for AI processing
const MAX_JOB_DURATION_MS = 15000; // 15 seconds max total job time

const jobs = {};

function generateJobId() {
  return Date.now().toString();
}

// ============================
// Enqueue a new job
// ============================

async function enqueueJob(data) {
  const jobId = generateJobId();

  incrementRequests();

  // Creating new job entry
  jobs[jobId] = {
    status: "pending",
    data,
    result: null,
    attempts: 0,
    maxAttempts: 3,
    error: null,
    requestId: data.requestId,
    progress: "queued",
    createdAt: Date.now()
  };

  logger.info("JOB_CREATED", {
    requestId: data.requestId,
    jobId,
    attempts: 0,
    maxAttempts: 3
  });

  processJob(jobId); 

  return jobId;
}

// ============================
// Process a job asynchronously
// ============================

async function processJob(jobId) {
  const job = jobs[jobId];

  job.status = "processing";
  job.progress = "starting";
  job.startedAt = Date.now();

  logger.info("JOB_STARTED", {
    requestId: job.requestId,
    jobId
  });
// 🚨 STUCK JOB DETECTION
const now = Date.now();
const duration = now - job.startedAt;

if (duration > MAX_JOB_DURATION_MS) {
  job.status = "failed";
  job.progress = "stuck";

  logger.error("JOB_STUCK_DETECTED", {
    requestId: job.requestId,
    jobId,
    duration,
    attempts: job.attempts
  });

  incrementErrors();

  return;
}
  while (job.attempts < job.maxAttempts) {
    try {
      job.attempts++;

      logger.info("JOB_ATTEMPT", {
        requestId: job.requestId,
        jobId,
        attempt: job.attempts
      });

      job.progress = "calling_ai";

      const result = await Promise.race([
        processChecklist(
          job.data.text,
          job.data.requestId,
          job.data.clientIp
        ),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Job timed out")), JOB_TIMEOUT_MS)
        )
      ]);

      // ============================
      // SUCCESS
      // ============================

      job.progress = "completed";
      job.result = result;
      job.status = "completed";

      logger.info("JOB_SUCCESS", {
        requestId: job.requestId,
        jobId,
        attempts: job.attempts,
        resultLength: result?.length || 0
      });

      return;

      // ============================
      // FAILURE
      // ============================

    } catch (error) {
      job.error = `Attempt ${job.attempts}: ${error.message}`;

      logger.error("JOB_FAILED_ATTEMPT", {
        requestId: job.requestId,
        jobId,
        attempt: job.attempts,
        error: error.message
      });

      // ============================
      // FINAL FAILURE
      // ============================

      if (job.attempts >= job.maxAttempts) {
        job.progress = "failed";
        job.status = "failed";

        logger.error("JOB_FAILED_FINAL", {
          requestId: job.requestId,
          jobId,
          attempts: job.attempts,
          error: job.error
        });

        incrementErrors();

        return;
      }

      // ============================
      // RETRY DELAY
      // ============================

      await delay(2000);
    }
  }
}

// ==========================
// Get job status and result
// ==========================

function getJob(jobId) {
  return jobs[jobId];
}

// ==========================
// Utility: Delay
// ==========================

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ========================
// Exported Functions
// ========================

module.exports = {
  enqueueJob,
  getJob
};