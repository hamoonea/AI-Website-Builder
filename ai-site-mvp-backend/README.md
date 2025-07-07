# AI Site MVP Backend

A Node.js backend service that provides AI-powered code generation and chat functionality using OpenAI's API.

## Features

- **Code Generation**: Generate HTML/CSS code from natural language prompts
- **Interactive Chat**: Chat with AI to modify and improve existing code
- **Diff Tracking**: Track changes between code versions
- **Conversation History**: Maintain context across chat sessions

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory with the following variables:

   ```
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   PORT=3000
   ```

3. **Get OpenAI API Key**:

   - Sign up at [OpenAI](https://platform.openai.com/)
   - Create an API key in your dashboard
   - Add it to your `.env` file

4. **Start the server**:
   ```bash
   npm start
   ```

The server will run on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### POST /api/generate

Generate HTML/CSS code from a prompt.

**Request Body**:

```json
{
  "prompt": "Create a modern landing page with a hero section"
}
```

**Response**:

```json
{
  "html": "<!DOCTYPE html>..."
}
```

### POST /api/chat

Chat with AI to modify existing code.

**Request Body**:

```json
{
  "message": "Make the background blue",
  "currentCode": "<!DOCTYPE html>...",
  "conversationHistory": [...],
  "diffInfo": {...}
}
```

**Response**:

```json
{
  "response": "I've updated the background color...",
  "codeChanges": [...],
  "updatedCode": "<!DOCTYPE html>...",
  "diffInfo": {...}
}
```

## Environment Variables

| Variable         | Description         | Default         |
| ---------------- | ------------------- | --------------- |
| `OPENAI_API_KEY` | Your OpenAI API key | Required        |
| `OPENAI_MODEL`   | OpenAI model to use | `gpt-3.5-turbo` |
| `PORT`           | Server port         | `3000`          |

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already included in `.gitignore`
- Use environment variables for all sensitive configuration
- Consider using a secrets management service for production deployments

## Dependencies

- `express`: Web framework
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management
- `openai`: OpenAI API client
- `diff`: Text diffing utility
