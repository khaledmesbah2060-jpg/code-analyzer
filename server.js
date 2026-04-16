const express = require("express");
const cors = require("cors");

// 👇 fetch (عشان يشتغل في Node)
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 حط API KEY هنا
const API_KEY = "AIzaSyBdD0XDHPfnM8dUL_LfXqvXhXOo4P7Bam0";

// 🔍 Analyze Code
app.post("/analyze", async (req, res) => {
  const { code } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Explain this code clearly and suggest improvements:\n${code}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("ANALYZE:", data); // 👈 debug

    const explanation =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI not working ❌";

    res.json({
      errors: [],
      score: 100,
      explanation
    });

  } catch (err) {
    console.log("ERROR:", err);
    res.json({
      errors: [],
      score: 100,
      explanation: "Server error ❌"
    });
  }
});


// 💬 Chat AI
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("CHAT:", data); // 👈 debug

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI not working ❌";

    res.json({ reply });

  } catch (err) {
    console.log("ERROR:", err);
    res.json({ reply: "Server error ❌" });
  }
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0" , () => {
  console.log("Server running on port " + PORT);
});