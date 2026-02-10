import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Simple in-memory cooldown (per server instance)
let lastGenerationTimestamp = 0;

// Centralized structured logging
function logEvent(type, details) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      event: type,
      details
    })
  );
}

app.post("/generate", async (req, res) => {
  try {
    const userText = req.body.text;

    if (!userText) {
  return res.status(400).json({ error: "No input text provided" });
}

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You convert policy text into a standardized compliance checklist."
          },
          {
            role: "user",
            content: userText
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
  return res.status(response.status).json({ error: data });
}
    console.log("OpenAI response:", data);

    if (!response.ok) {
      logEvent("AI_API_ERROR", { data });
      return res.status(response.status).json({ error: data });
    }

    res.json({ result: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
