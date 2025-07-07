# GitHub Pages Deployment Guide

This guide will help you deploy your AI Website Builder frontend to GitHub Pages.

## 🚀 Quick Deploy to GitHub Pages

### Option 1: Automatic Deployment (Recommended)

1. **Install Dependencies**

   ```bash
   cd ai-site-mvp-frontend
   npm install
   ```

2. **Deploy to GitHub Pages**
   ```bash
   npm run deploy:github
   ```

This will:

- Build your app for GitHub Pages
- Deploy it to the `gh-pages` branch
- Make it available at `https://hamoonea.github.io/AI-Website-Builder/`

### Option 2: Manual Deployment

1. **Build for GitHub Pages**

   ```bash
   cd ai-site-mvp-frontend
   npm run build:github
   ```

2. **Deploy using GitHub CLI**

   ```bash
   # Install GitHub CLI if you haven't
   # brew install gh (macOS) or download from github.com/cli/cli

   gh repo create --public --source=. --remote=origin --push
   gh pages deploy dist/ai-site-mvp-frontend --branch gh-pages
   ```

## 🔧 Configuration Details

### Base Href Configuration

Your app is configured with the base href `/AI-Website-Builder/` for GitHub Pages:

```json
"baseHref": "/AI-Website-Builder/"
```

### Environment Configuration

The GitHub Pages build uses the production environment:

- **Backend URL**: `https://quiet-genie-00f237.netlify.app`
- **Build Configuration**: `github-pages`

## 📁 Project Structure

```
ai-site-mvp-frontend/
├── src/
│   ├── environments/
│   │   ├── environment.ts          # Development config
│   │   └── environment.prod.ts     # Production config (used for GitHub Pages)
│   └── ...
├── angular.json                    # Build configurations
├── package.json                    # Scripts & dependencies
└── GITHUB_PAGES_DEPLOYMENT.md     # This file
```

## 🌐 GitHub Pages URL

Once deployed, your app will be available at:
**https://hamoonea.github.io/AI-Website-Builder/**

## ⚙️ GitHub Repository Settings

1. **Enable GitHub Pages**:

   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to "Deploy from a branch"
   - Select `gh-pages` branch
   - Set folder to `/ (root)`

2. **Custom Domain** (Optional):
   - Add your custom domain in the Pages settings
   - Update the `baseHref` in `angular.json` accordingly

## 🔄 Continuous Deployment

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: |
          cd ai-site-mvp-frontend
          npm ci

      - name: Build for GitHub Pages
        run: |
          cd ai-site-mvp-frontend
          npm run build:github

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./ai-site-mvp-frontend/dist/ai-site-mvp-frontend
```

## 🧪 Testing Your Deployment

1. **Local Testing**:

   ```bash
   npm run build:github
   npx http-server dist/ai-site-mvp-frontend -p 8080
   # Visit http://localhost:8080/AI-Website-Builder/
   ```

2. **Production Testing**:
   - Visit https://hamoonea.github.io/AI-Website-Builder/
   - Test website generation
   - Test chat functionality

## 🔍 Troubleshooting

### Common Issues

1. **404 Errors**:

   - Check that `baseHref` is set correctly
   - Ensure GitHub Pages is enabled in repository settings

2. **API Connection Issues**:

   - Verify backend is deployed and accessible
   - Check CORS configuration for GitHub Pages domain

3. **Build Failures**:
   - Clear cache: `npm run build:github -- --delete-output-path`
   - Check for TypeScript errors

### Debugging

1. **Check Build Output**:

   ```bash
   npm run build:github --verbose
   ```

2. **Verify GitHub Pages Branch**:

   - Check that `gh-pages` branch exists
   - Verify files are in the correct location

3. **Test API Endpoints**:
   ```bash
   curl https://quiet-genie-00f237.netlify.app/api/generate \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"prompt": "test"}'
   ```

## 🔗 Useful Commands

```bash
# Development
npm start                    # Local development

# Production Builds
npm run build:prod          # For Netlify/Vercel
npm run build:github        # For GitHub Pages

# Deployment
npm run deploy:github       # Deploy to GitHub Pages

# Testing
npm test                    # Run unit tests
```

## 📊 Performance Optimization

GitHub Pages automatically provides:

- ✅ CDN distribution
- ✅ HTTPS
- ✅ Compression
- ✅ Caching headers

## 🔒 Security Considerations

- ✅ HTTPS is enabled by default
- ✅ No sensitive data in frontend code
- ✅ API keys are stored securely in backend

## 📞 Support

- [GitHub Pages Documentation](https://pages.github.com/)
- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
