const request = require("supertest");
const express = require("express");

const healthRoutes = require("../routes/health");

const app = express();
app.use(express.json());
app.use("/", healthRoutes);

describe("Health Check Endpoint", () => {
  it("should return status ok", async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});