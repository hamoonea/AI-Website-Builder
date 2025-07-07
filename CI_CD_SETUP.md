# CI/CD Setup Guide

This guide will help you set up continuous integration and deployment (CI/CD) for your AI Website Builder project using GitHub Actions.

## 🚀 What's Included

### GitHub Actions Workflows

1. **`ci-cd.yml`** - Complete CI/CD pipeline (recommended)
2. **`deploy.yml`** - Frontend deployment to GitHub Pages
3. **`deploy-backend.yml`** - Backend deployment to Netlify

## 📋 Prerequisites

### 1. GitHub Repository Setup

- ✅ Repository is already set up at `hamoonea/AI-Website-Builder`
- ✅ Main branch is configured

### 2. GitHub Pages Setup

1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "Deploy from a branch"
4. Select `gh-pages` branch
5. Set folder to `/ (root)`

### 3. Netlify Setup (for backend)

1. Get your Netlify Site ID:

   - Go to your Netlify dashboard
   - Click on your site
   - Copy the Site ID from the site settings

2. Get your Netlify Auth Token:
   - Go to Netlify dashboard → User settings → Applications
   - Create a new access token
   - Copy the token

## 🔐 Setting Up Secrets

### Required GitHub Secrets

1. **`NETLIFY_AUTH_TOKEN`**:

   - Value: Your Netlify access token
   - Used for: Backend deployment to Netlify

2. **`NETLIFY_SITE_ID`**:
   - Value: Your Netlify site ID
   - Used for: Backend deployment to Netlify

### How to Add Secrets

1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add each secret with its corresponding value

## 🔄 Workflow Overview

### CI/CD Pipeline (`ci-cd.yml`)

**Triggers:**

- Push to main branch
- Pull requests to main branch

**Jobs:**

1. **test-frontend**: Tests and builds frontend
2. **test-backend**: Validates backend code
3. **deploy-frontend**: Deploys to GitHub Pages (main branch only)
4. **deploy-backend**: Deploys to Netlify (main branch only)

### Frontend Deployment (`deploy.yml`)

**Triggers:**

- Push to main branch
- Pull requests to main branch

**Actions:**

- Builds frontend for GitHub Pages
- Deploys to `gh-pages` branch

### Backend Deployment (`deploy-backend.yml`)

**Triggers:**

- Push to main branch (only when backend files change)
- Pull requests to main branch (only when backend files change)

**Actions:**

- Deploys backend to Netlify

## 🧪 Testing Your CI/CD

### 1. Make a Test Change

```bash
# Make a small change to test the pipeline
echo "# Test CI/CD" >> README.md
git add README.md
git commit -m "Test CI/CD pipeline"
git push
```

### 2. Monitor the Workflow

1. Go to your GitHub repository
2. Click "Actions" tab
3. Watch the workflow run

### 3. Check Deployments

- **Frontend**: https://hamoonea.github.io/AI-Website-Builder/
- **Backend**: https://quiet-genie-00f237.netlify.app/

## 🔍 Troubleshooting

### Common Issues

1. **Workflow Not Triggering**:

   - Check that files are in the correct paths
   - Verify branch name is `main`
   - Check workflow file syntax

2. **Build Failures**:

   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

3. **Deployment Failures**:
   - Verify GitHub secrets are set correctly
   - Check Netlify site ID and auth token
   - Ensure GitHub Pages is enabled

### Debugging Steps

1. **Check Workflow Logs**:

   - Go to Actions tab
   - Click on the failed workflow
   - Review the logs for error messages

2. **Test Locally**:

   ```bash
   # Test frontend build
   cd ai-site-mvp-frontend
   npm run build:github

   # Test backend validation
   cd ai-site-mvp-backend
   node -c server.js
   ```

3. **Verify Secrets**:
   - Double-check secret names and values
   - Ensure no extra spaces or characters

## 📊 Monitoring

### GitHub Actions Dashboard

- View workflow runs in the Actions tab
- Monitor build times and success rates
- Set up notifications for failures

### Deployment Status

- **Frontend**: Check GitHub Pages settings for deployment status
- **Backend**: Monitor Netlify dashboard for deployment logs

## 🔄 Continuous Improvement

### Performance Optimization

- Cache npm dependencies
- Use parallel jobs where possible
- Optimize build times

### Security

- Use minimal required permissions
- Rotate secrets regularly
- Monitor for security vulnerabilities

### Monitoring

- Set up alerts for failed deployments
- Monitor application performance
- Track deployment frequency

## 📞 Support

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Netlify CLI Documentation](https://docs.netlify.com/cli/get-started/)
- [GitHub Pages Documentation](https://pages.github.com/)

## 🎯 Next Steps

1. **Set up secrets** in your GitHub repository
2. **Enable GitHub Pages** in repository settings
3. **Make a test commit** to trigger the workflow
4. **Monitor the deployment** process
5. **Test the deployed application**

Your CI/CD pipeline will automatically:

- ✅ Test your code
- ✅ Build your applications
- ✅ Deploy to production
- ✅ Keep your deployments up-to-date
