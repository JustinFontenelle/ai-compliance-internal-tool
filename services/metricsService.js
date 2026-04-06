// =========================
// Metrics Service
// =========================

const metrics = {
  totalRequests: 0,
  totalErrors: 0,
  totalLatency: 0,
  currentRequests: 0,
  maxConcurrentRequests: 0,
  retryCount: 0,
  recentFailures: 0
};

// =========================
// Request Metrics
// =========================

function incrementRequests() {
  metrics.totalRequests++;
}

function incrementErrors() {
  metrics.totalErrors++;
}

function recordLatency(duration) {
  metrics.totalLatency += duration;
}

function startRequest() {
  metrics.currentRequests++;

  if (metrics.currentRequests > metrics.maxConcurrentRequests) {
    metrics.maxConcurrentRequests = metrics.currentRequests;
  }
}

function finishRequest() {
  if (metrics.currentRequests > 0) {
    metrics.currentRequests--;
  }
}

// =========================
// Retry Metrics
// =========================

function incrementRetries() {
  metrics.retryCount++;
}

// =========================
// Failure Monitoring
// =========================

function recordFailure() {
  metrics.recentFailures++;
}

function resetFailures() {
  metrics.recentFailures = 0;
}

function getFailureCount() {
  return metrics.recentFailures;
}

// =========================
// Metrics Snapshot
// =========================

function getMetrics() {
  const averageLatency =
    metrics.totalRequests > 0
      ? metrics.totalLatency / metrics.totalRequests
      : 0;

  return {
    ...metrics,
    averageLatency
  };
}

// =========================
// Export
// =========================

module.exports = {
  incrementRequests,
  incrementErrors,
  recordLatency,
  startRequest,
  finishRequest,
  incrementRetries,
  recordFailure,
  resetFailures,
  getFailureCount,
  getMetrics
};