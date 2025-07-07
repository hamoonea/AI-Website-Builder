const OpenAI = require("openai").default;
const diff = require("diff");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || "gpt-3.5-turbo";

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "http://localhost:4200",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { message, currentCode, conversationHistory, diffInfo } = JSON.parse(
      event.body
    );

    // Validate required fields
    if (!message || !currentCode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error:
            "Missing required fields: message and currentCode are required",
        }),
      };
    }

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: aiResponse,
        codeChanges: changes,
        updatedCode: updatedCode,
        diffInfo: {
          changes: changes,
          patch: codeDiff,
          summary: [summary],
        },
      }),
    };
  } catch (err) {
    console.error("Chat endpoint error", err);

    if (err.code === "insufficient_quota" || err.status === 429) {
      return {
        statusCode: 429,
        headers,
        body: JSON.stringify({
          error:
            "AI quota exceeded—please check your OpenAI billing or switch models.",
        }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Chat processing failed—please try again later.",
      }),
    };
  }
};
