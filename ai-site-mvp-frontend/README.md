# AI Site MVP Frontend

An interactive web application that generates websites using AI and allows real-time modifications through an AI chat assistant.

## Features

### 🎨 AI-Powered Website Generation

- Generate complete websites from natural language descriptions
- Real-time code editor with syntax highlighting
- Live preview of generated websites
- Download generated HTML files

### 💬 Interactive AI Assistant

- Chat sidebar for follow-up modifications
- Context-aware conversations that remember previous changes
- Real-time code patching and updates
- Visual feedback showing what changes were made

### 🔧 Code Modification Examples

The AI assistant can handle requests like:

- "Make the footer sticky"
- "Add a hero image"
- "Change the color scheme to blue"
- "Add a contact form"
- "Make the navigation responsive"
- "Add animations to the buttons"

## How It Works

1. **Initial Generation**: Enter a description of the website you want to create
2. **Code Editing**: The generated code appears in the Monaco editor with live preview
3. **AI Modifications**: Use the chat sidebar to request changes to your website
4. **Context Tracking**: The AI remembers your conversation and previous changes
5. **Real-time Updates**: Changes are applied immediately to both editor and preview

## Technical Implementation

### Conversation Context

- Tracks conversation history between user and AI
- Maintains current code state
- Sends diff/patch information to API for context-aware responses

### Code Change Tracking

- Uses diff algorithm to track line-by-line changes
- Generates unified diff patches
- Provides human-readable change summaries
- Visual indicators for additions, modifications, and deletions

### Architecture

- **Angular 17** with standalone components
- **Monaco Editor** for code editing
- **RxJS** for reactive state management
- **HTTP Client** for API communication

## API Endpoints

### `/api/generate`

Generates initial website code from a prompt.

**Request:**

```json
{
  "prompt": "Create a modern landing page for a tech startup"
}
```

**Response:**

```json
{
  "html": "<!DOCTYPE html>..."
}
```

### `/api/chat`

Handles follow-up modifications with conversation context.

**Request:**

```json
{
  "message": "Make the footer sticky",
  "currentCode": "<!DOCTYPE html>...",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Create a landing page"
    },
    {
      "role": "assistant",
      "content": "I've created a landing page with..."
    }
  ],
  "diffInfo": {
    "changes": [...],
    "patch": "--- index.html\n+++ index.html\n...",
    "summary": ["Added 3 lines", "Modified 1 line"]
  }
}
```

**Response:**

```json
{
  "response": "I've made the footer sticky by adding...",
  "codeChanges": [
    {
      "type": "modification",
      "description": "Added sticky positioning to footer"
    }
  ],
  "updatedCode": "<!DOCTYPE html>..."
}
```

## Development

### Prerequisites

- Node.js 18+
- Angular CLI

### Setup

```bash
npm install
ng serve
```

### Building

```bash
ng build
```

## Usage Examples

### Basic Website Generation

1. Enter: "Create a portfolio website for a photographer"
2. Click "Generate Website"
3. Review the generated code and preview

### Follow-up Modifications

1. Open the AI Assistant (💬 button)
2. Ask: "Add a gallery section"
3. The AI will modify the existing code and show you what changed
4. Ask: "Make the gallery responsive"
5. Continue the conversation for more modifications

### Advanced Requests

- "Add a dark mode toggle"
- "Include a blog section"
- "Add smooth scrolling navigation"
- "Make it mobile-first responsive"
- "Add loading animations"

## Future Enhancements

- [ ] Multiple file support (CSS, JS)
- [ ] Component-based architecture suggestions
- [ ] Version control integration
- [ ] Collaborative editing
- [ ] Template library
- [ ] Export to various frameworks (React, Vue, etc.)
