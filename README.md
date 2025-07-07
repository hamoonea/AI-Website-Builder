# AI Site MVP

A full-stack web application that uses AI to generate and modify HTML/CSS code through natural language prompts and interactive chat.

## 🚀 Features

- **AI-Powered Code Generation**: Generate complete HTML/CSS websites from text descriptions
- **Interactive Chat Interface**: Modify existing code through natural language conversations
- **Real-time Code Editor**: Monaco editor with syntax highlighting
- **Change Tracking**: Visual diff tracking to see what changed
- **Conversation History**: Maintain context across multiple interactions

## 🏗️ Architecture

- **Frontend**: Angular 19 with Monaco Editor
- **Backend**: Node.js with Express
- **AI**: OpenAI GPT models
- **Communication**: RESTful API

## 📁 Project Structure

```
ai-site-mvp/
├── ai-site-mvp-frontend/     # Angular frontend application
├── ai-site-mvp-backend/      # Node.js backend API
├── .gitignore               # Git ignore rules
└── README.md               # This file
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd ai-site-mvp-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   # Edit .env with your OpenAI API key
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ai-site-mvp-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:4200`

## 🔐 Security & Environment Variables

### Required Environment Variables

Create a `.env` file in the `ai-site-mvp-backend` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
PORT=3000
```

### Security Notes

- ✅ **Environment variables are properly configured** - No API keys are hardcoded
- ✅ **`.env` files are gitignored** - Sensitive data won't be committed
- ✅ **Frontend uses proxy configuration** - No direct API calls with keys
- ✅ **Backend validates all inputs** - Proper error handling and validation

### Getting an OpenAI API Key

1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Navigate to API Keys in your dashboard
3. Create a new API key
4. Add it to your `.env` file

## 🚀 Deployment

### Backend Deployment

The backend can be deployed to any Node.js hosting service:

- **Vercel**: Supports Node.js with environment variables
- **Railway**: Easy deployment with environment variable management
- **Heroku**: Traditional Node.js hosting
- **DigitalOcean App Platform**: Scalable container deployment

### Frontend Deployment

The Angular frontend can be deployed to:

- **Vercel**: Excellent for static sites
- **Netlify**: Great for Angular applications
- **GitHub Pages**: Free hosting for open source projects
- **Firebase Hosting**: Google's hosting solution

### Environment Variables in Production

Remember to set these environment variables in your production environment:

- `OPENAI_API_KEY`: Your production OpenAI API key
- `OPENAI_MODEL`: The model you want to use (e.g., `gpt-4`)
- `PORT`: The port your server should run on

## 🔧 Development

### Running Both Services

1. Start the backend:

   ```bash
   cd ai-site-mvp-backend && npm start
   ```

2. In a new terminal, start the frontend:

   ```bash
   cd ai-site-mvp-frontend && npm start
   ```

3. Open `http://localhost:4200` in your browser

### API Endpoints

- `POST /api/generate` - Generate code from prompt
- `POST /api/chat` - Chat with AI to modify code

See the backend README for detailed API documentation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## ⚠️ Important Notes

- **Never commit API keys** - They are already protected by `.gitignore`
- **Use environment variables** - All sensitive configuration uses env vars
- **Test locally first** - Ensure everything works before deploying
- **Monitor API usage** - OpenAI charges per request, so monitor your usage
