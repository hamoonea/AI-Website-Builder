# Netlify Deployment Guide

This guide will help you deploy your AI Website Builder backend to Netlify using serverless functions.

## 🚀 Quick Deploy

### Option 1: Deploy via Netlify UI

1. **Fork/Clone the Repository**

   - Fork this repository to your GitHub account
   - Or clone it locally and push to your own repository

2. **Connect to Netlify**

   - Go to [Netlify](https://netlify.com) and sign in
   - Click "New site from Git"
   - Choose your repository
   - Set build settings:
     - **Build command**: `npm run build` (or leave empty)
     - **Publish directory**: `public`
   - Click "Deploy site"

3. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add the following variables:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     OPENAI_MODEL=gpt-3.5-turbo
     ```
   - Redeploy the site

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**

   ```bash
   netlify login
   ```

3. **Initialize and Deploy**

   ```bash
   cd ai-site-mvp-backend
   netlify init
   netlify deploy --prod
   ```

4. **Set Environment Variables**
   ```bash
   netlify env:set OPENAI_API_KEY your_openai_api_key_here
   netlify env:set OPENAI_MODEL gpt-3.5-turbo
   ```

## 📁 Project Structure

```
ai-site-mvp-backend/
├── netlify/
│   └── functions/
│       ├── generate.js    # POST /api/generate
│       └── chat.js        # POST /api/chat
├── public/
│   └── index.html         # Health check page
├── netlify.toml           # Netlify configuration
├── package.json           # Dependencies
└── NETLIFY_DEPLOYMENT.md  # This file
```

## 🔧 Configuration

### netlify.toml

- **Functions directory**: `netlify/functions`
- **Publish directory**: `public`
- **Node version**: 18
- **API redirects**: `/api/*` → `/.netlify/functions/*`
- **CORS headers**: Enabled for all origins

### Environment Variables

| Variable         | Description         | Required                       |
| ---------------- | ------------------- | ------------------------------ |
| `OPENAI_API_KEY` | Your OpenAI API key | ✅ Yes                         |
| `OPENAI_MODEL`   | Model to use        | ❌ No (default: gpt-3.5-turbo) |

## 🧪 Testing Locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your API key
   ```

3. **Start local development server**

   ```bash
   npm run dev
   ```

4. **Test endpoints**

   ```bash
   # Test generate endpoint
   curl -X POST http://localhost:8888/.netlify/functions/generate \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Create a simple landing page"}'

   # Test chat endpoint
   curl -X POST http://localhost:8888/.netlify/functions/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Make it blue", "currentCode": "<html><body>Hello</body></html>"}'
   ```

## 🌐 API Endpoints

Once deployed, your API will be available at:

- `https://your-site.netlify.app/api/generate`
- `https://your-site.netlify.app/api/chat`

### POST /api/generate

Generate HTML/CSS from a prompt.

**Request:**

```json
{
  "prompt": "Create a modern landing page with a hero section"
}
```

**Response:**

```json
{
  "html": "<!DOCTYPE html>..."
}
```

### POST /api/chat

Chat with AI to modify existing code.

**Request:**

```json
{
  "message": "Make the background blue",
  "currentCode": "<!DOCTYPE html>...",
  "conversationHistory": [],
  "diffInfo": {}
}
```

**Response:**

```json
{
  "response": "I've updated the background color...",
  "codeChanges": [...],
  "updatedCode": "<!DOCTYPE html>...",
  "diffInfo": {...}
}
```

## 🔍 Troubleshooting

### Common Issues

1. **Function timeout**

   - Netlify functions have a 10-second timeout
   - Consider optimizing your prompts or using a faster model

2. **CORS errors**

   - CORS headers are configured in `netlify.toml`
   - Make sure your frontend is calling the correct URL

3. **Environment variables not working**

   - Check that variables are set in Netlify dashboard
   - Redeploy after setting environment variables

4. **Function not found**
   - Ensure functions are in `netlify/functions/` directory
   - Check that function names match the file names

### Debugging

1. **Check Netlify function logs**

   ```bash
   netlify functions:list
   netlify functions:invoke generate
   ```

2. **View deployment logs**

   - Go to Netlify dashboard → Deploys
   - Click on a deploy to see logs

3. **Test locally first**
   ```bash
   npm run dev
   # Test your functions locally before deploying
   ```

## 📊 Monitoring

- **Function invocations**: View in Netlify dashboard
- **Response times**: Monitor in function logs
- **Error rates**: Check deploy logs and function logs
- **API usage**: Monitor OpenAI usage in their dashboard

## 🔒 Security

- ✅ Environment variables are secure
- ✅ CORS is properly configured
- ✅ Input validation is implemented
- ✅ Error handling is in place
- ⚠️ Consider rate limiting for production use

## 🚀 Next Steps

1. **Deploy your frontend** to Netlify or another hosting service
2. **Update frontend API URLs** to point to your Netlify backend
3. **Set up custom domain** (optional)
4. **Configure monitoring** and alerts
5. **Set up CI/CD** for automatic deployments

## 📞 Support

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Netlify CLI Documentation](https://docs.netlify.com/cli/get-started/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
