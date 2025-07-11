const OpenAI = require("openai").default;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || "gpt-3.5-turbo";

exports.handler = async (event, context) => {
  // Enable CORS for multiple origins
  const allowedOrigins = [
    "http://localhost:4200",
    "https://hamoonea.github.io",
  ];

  const origin = event.headers.origin || event.headers.Origin;
  const corsOrigin = allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];

  const headers = {
    "Access-Control-Allow-Origin": corsOrigin,
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
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Prompt is required" }),
      };
    }

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ html: completion.choices[0].message.content }),
    };
  } catch (err) {
    console.error("OpenAI error", err);

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
        error: "Generation failed—please try again later.",
      }),
    };
  }
};
