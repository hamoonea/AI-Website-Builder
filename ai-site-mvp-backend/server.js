// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai").default;
const diff = require("diff");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// pick the cheapest completion model by default
const MODEL = process.env.OPENAI_MODEL || "gpt-3.5-turbo";

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "Generate minimal valid HTML/CSS for a webpage based on the user prompt.",
        },
        { role: "user", content: prompt },
      ],
    });
    res.json({ html: completion.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI error", err);
    if (err.code === "insufficient_quota" || err.status === 429) {
      return res.status(429).json({
        error:
          "AI quota exceeded—please check your OpenAI billing or switch models.",
      });
    }
    res
      .status(500)
      .json({ error: "Generation failed—please try again later." });
  }
});

app.post("/api/chat", async (req, res) => {
  const { message, currentCode, conversationHistory, diffInfo } = req.body;

  // Validate required fields
  if (!message || !currentCode) {
    return res.status(400).json({
      error: "Missing required fields: message and currentCode are required",
    });
  }

  try {
    // Build conversation context for the AI
    const messages = [
      {
        role: "system",
        content: `You are an expert web developer assistant that helps users edit HTML/CSS code interactively. 

Your task is to:
1. Understand the user's request in the context of the current code and conversation history
2. Generate appropriate code changes to fulfill the request
3. Provide a clear summary of what was changed
4. Return the complete updated code

Always ensure the code is valid HTML/CSS and follows best practices.`,
      },
    ];

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg) => {
        if (msg.role && msg.content) {
          messages.push({
            role: msg.role,
            content: msg.content,
          });
        }
      });
    }

    // Add current code context
    messages.push({
      role: "user",
      content: `Current HTML code:
\`\`\`html
${currentCode}
\`\`\`

User request: ${message}

${
  diffInfo
    ? `Recent changes made:
${diffInfo.summary ? diffInfo.summary.join(", ") : "Changes detected"}
${diffInfo.patch ? `\nDiff patch:\n${diffInfo.patch}` : ""}`
    : ""
}

Please provide the updated code that addresses the user's request.`,
    });

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: messages,
      temperature: 0.3, // Lower temperature for more consistent code generation
      max_tokens: 4000,
    });

    const aiResponse = completion.choices[0].message.content;

    // Extract the updated code from the AI response
    // Look for code blocks in the response
    const codeBlockRegex = /```(?:html)?\s*([\s\S]*?)```/;
    const codeMatch = aiResponse.match(codeBlockRegex);

    let updatedCode = currentCode;
    if (codeMatch) {
      updatedCode = codeMatch[1].trim();
    }

    // Generate diff information
    const codeDiff = diff.createPatch("code.html", currentCode, updatedCode);
    const diffLines = diff
      .createTwoFilesPatch("code.html", "code.html", currentCode, updatedCode)
      .split("\n")
      .filter(
        (line) =>
          line.startsWith("+") || line.startsWith("-") || line.startsWith(" ")
      );

    // Analyze changes for summary
    const changes = [];
    let additions = 0;
    let deletions = 0;
    let modifications = 0;

    diffLines.forEach((line) => {
      if (line.startsWith("+") && !line.startsWith("+++")) {
        additions++;
      } else if (line.startsWith("-") && !line.startsWith("---")) {
        deletions++;
      }
    });

    if (additions > 0) {
      changes.push({
        type: "addition",
        description: `Added ${additions} line${additions > 1 ? "s" : ""}`,
      });
    }
    if (deletions > 0) {
      changes.push({
        type: "deletion",
        description: `Removed ${deletions} line${deletions > 1 ? "s" : ""}`,
      });
    }
    if (additions > 0 && deletions > 0) {
      changes.push({
        type: "modification",
        description: `Modified code structure`,
      });
    }

    // Create a natural language summary
    const summary =
      changes.length > 0
        ? changes.map((c) => c.description).join(", ")
        : "No significant changes detected";

    res.json({
      response: aiResponse,
      codeChanges: changes,
      updatedCode: updatedCode,
      diffInfo: {
        changes: changes,
        patch: codeDiff,
        summary: [summary],
      },
    });
  } catch (err) {
    console.error("Chat endpoint error", err);
    if (err.code === "insufficient_quota" || err.status === 429) {
      return res.status(429).json({
        error:
          "AI quota exceeded—please check your OpenAI billing or switch models.",
      });
    }
    res
      .status(500)
      .json({ error: "Chat processing failed—please try again later." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AI backend listening on port ${PORT}`));
