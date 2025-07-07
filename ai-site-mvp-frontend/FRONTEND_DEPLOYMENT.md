# Frontend Deployment Guide

This guide will help you deploy your AI Website Builder frontend to Netlify, configured to work with your deployed backend.

## 🚀 Quick Deploy to Netlify

### Option 1: Deploy via Netlify UI

1. **Build the Production Version**

   ```bash
   cd ai-site-mvp-frontend
   npm install
   npm run build:prod
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com) and sign in
   - Drag and drop the `dist/ai-site-mvp-frontend` folder to deploy
   - Or connect your GitHub repository and set build settings:
     - **Build command**: `npm run build:prod`
     - **Publish directory**: `dist/ai-site-mvp-frontend`

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**
   ```bash
   cd ai-site-mvp-frontend
   npm install
   npm run build:prod
   netlify deploy --prod --dir=dist/ai-site-mvp-frontend
   ```

## 🔧 Environment Configuration

The frontend is configured to automatically use the correct backend URL:

### Development (Local)

- **Backend URL**: `http://localhost:3000`
- **Use**: `npm start` for local development

### Production (Deployed)

- **Backend URL**: `https://quiet-genie-00f237.netlify.app`
- **Use**: `npm run build:prod` for production build

## 📁 Project Structure

```
ai-site-mvp-frontend/
├── src/
│   ├── environments/
│   │   ├── environment.ts          # Development config
│   │   └── environment.prod.ts     # Production config
│   ├── app/
│   │   ├── ai.service.ts           # API service (updated)
│   │   └── ...
│   └── ...
├── angular.json                    # Build configuration
├── package.json                    # Dependencies & scripts
└── FRONTEND_DEPLOYMENT.md         # This file
```

## 🔄 API Configuration

The frontend automatically switches between environments:

### Development

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: "http://localhost:3000",
};
```

### Production

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: "https://quiet-genie-00f237.netlify.app",
};
```

## 🧪 Testing Your Deployment

1. **Test the Backend First**

   - Visit: https://quiet-genie-00f237.netlify.app/
   - Should show "API Status: Online"

2. **Test the Frontend**
   - Deploy your frontend
   - Try generating a simple website
   - Test the chat functionality

## 🔍 Troubleshooting

### CORS Issues

- The backend is configured with CORS headers
- If you see CORS errors, check that the backend is running

### API Connection Issues

- Verify the backend URL in `environment.prod.ts`
- Check that your backend is deployed and accessible
- Test the API endpoints directly

### Build Issues

- Make sure all dependencies are installed: `npm install`
- Clear cache: `npm run build:prod -- --delete-output-path`
- Check for TypeScript errors: `ng build --configuration production`

## 🚀 Deployment Checklist

- [ ] Backend deployed to Netlify ✅
- [ ] Environment variables set in backend
- [ ] Frontend built with production config
- [ ] Frontend deployed to Netlify
- [ ] API endpoints tested
- [ ] Code generation tested
- [ ] Chat functionality tested

## 🔗 Useful Commands

```bash
# Development
npm start                    # Start dev server with proxy

# Production Build
npm run build:prod          # Build for production

# Testing
npm test                    # Run unit tests

# Local Production Test
npm run build:prod
npx http-server dist/ai-site-mvp-frontend
```

## 📞 Support

- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [Netlify Documentation](https://docs.netlify.com/)
- [Angular Environment Configuration](https://angular.io/guide/build#configure-environment-specific-defaults)
