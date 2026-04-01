process.env.INTERNAL_API_KEY = "test-key";
jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}));
const request = require("supertest");
const express = require("express");

const generateRoute = require("../routes/generate");
const rateLimiter = require("../middleware/rateLimiter");
const requestCounts = require("../middleware/rateLimiter").requestCounts;
const errorHandler = require("../middleware/errorHandler");

// Mock queue service only
jest.mock("../services/queueService", () => ({
  enqueueJob: jest.fn().mockResolvedValue("test-job-id")
}));

const app = express();
app.use(express.json());
    
app.use("/generate", rateLimiter);
app.use("/", generateRoute);
app.use(errorHandler);

describe("POST /generate", () => {

    beforeEach(() => {
  for (const ip in requestCounts) {
    delete requestCounts[ip];
  }
});

  it("should return a jobId and processing status", async () => {
    const res = await request(app)
      .post("/generate")
      .set("x-api-key", "test-key") 
      .send({ text: "Test policy text" });

    expect(res.statusCode).toBe(202);
    expect(res.body).toHaveProperty("jobId");
    expect(res.body.status).toBe("processing");
  });

  it("should return 400 if text is missing", async () => {
    const res = await request(app)
      .post("/generate")
      .set("x-api-key", "test-key") 
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 403 if API key is missing", async () => {
    const res = await request(app)
      .post("/generate")
      .send({ text: "Test policy text" });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("message");
  });
it("should return 429 after exceeding rate limit", async () => {
  let lastResponse;

  for (let i = 0; i < 6; i++) {
    lastResponse = await request(app)
      .post("/generate")
      .set("x-api-key", "test-key")
      .send({ text: "Test policy text" });
  }

  expect(lastResponse.statusCode).toBe(429);
});
it("should handle queue service failure and return 500", async () => {
  const { enqueueJob } = require("../services/queueService");

  enqueueJob.mockRejectedValueOnce(new Error("Queue failure"));

  const res = await request(app)
    .post("/generate")
    .set("x-api-key", "test-key")
    .send({ text: "Test policy text" });

  expect(res.statusCode).toBe(500);
  expect(res.body).toHaveProperty("error");
});
});