# GitHub Actions Setup Guide

## Quick Start

### 1. Enable GitHub Actions
GitHub Actions is automatically enabled for all repositories. No setup needed!

### 2. Configure Secrets
Go to your repository → Settings → Secrets and variables → Actions → New repository secret

### 3. Required Secrets

#### For Testing
```bash
MONGODB_URI=mongodb://localhost:27017/test
```

#### For Deployment (Production)
```bash
DEPLOY_HOST=your-production-server.com
DEPLOY_USER=deploy
DEPLOY_SSH_KEY=-----BEGIN RSA PRIVATE KEY-----
... your entire private key ...
-----END RSA PRIVATE KEY-----
DEPLOY_PORT=22
APP_URL=https://your-app.com
```

#### For Deployment (Staging)
```bash
STAGING_URL=https://staging.your-app.com
```

#### Application Secrets
```bash
JWT_SECRET=your-super-secret-jwt-key
CLOUDINARY_URL=cloudinary://your-api-key:your-api-secret@your-cloud-name
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## SSH Key Setup for Deployment

### Generate SSH Key Pair
```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

### Add Public Key to Server
```bash
# Copy public key to server
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub user@your-server.com

# Or manually add to server
cat ~/.ssh/github_actions_deploy.pub | ssh user@your-server.com "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### Add Private Key to GitHub Secrets
```bash
# Copy private key content
cat ~/.ssh/github_actions_deploy

# Paste as DEPLOY_SSH_KEY secret in GitHub
```

### Test SSH Connection
```bash
ssh -i ~/.ssh/github_actions_deploy user@your-server.com
```

## Server Setup

### Install Required Software on Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Install MongoDB (if needed)
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Setup Application Directory
```bash
# Create application directory
sudo mkdir -p /var/www/your-app
sudo chown $USER:$USER /var/www/your-app
cd /var/www/your-app

# Clone repository
git clone https://github.com/your-username/your-repo.git .
```

### Setup Environment Variables on Server
```bash
# Create .env file
cd /var/www/your-app/backend
cat > .env << EOF
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your-jwt-secret
PORT=3000
EOF
```

### Start Application with PM2
```bash
cd /var/www/your-app/backend
pm2 start index.js --name your-app
pm2 save
pm2 startup
```

## Alternative Deployment Methods

### Vercel Deployment

#### Install Vercel CLI
```bash
npm install -g vercel
```

#### Deploy Frontend
```bash
cd frontend
vercel --prod
```

#### Update GitHub Actions
Replace the SSH deployment step with:
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    working-directory: ./frontend
    vercel-args: '--prod'
```

#### Required Vercel Secrets
```bash
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

### Docker Deployment

#### Create Dockerfile for Backend
```dockerfile
# backend/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

#### Create Dockerfile for Frontend
```dockerfile
# frontend/Dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Update GitHub Actions
```yaml
- name: Build and push Docker images
  run: |
    # Build backend
    docker build -t your-registry/backend:${{ github.sha }} ./backend
    docker push your-registry/backend:${{ github.sha }}

    # Build frontend
    docker build -t your-registry/frontend:${{ github.sha }} ./frontend
    docker push your-registry/frontend:${{ github.sha }}
```

### AWS Deployment

#### Using AWS Lambda
```yaml
- name: Deploy to AWS Lambda
  uses: appleboy/lambda-action@v1.0.0
  with:
    access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    region: us-east-1
    function_name: your-lambda-function
    source: backend/
    zip_file: deployment.zip
```

#### Required AWS Secrets
```bash
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
```

## Testing the Pipeline

### 1. Test on Feature Branch
```bash
# Create feature branch
git checkout -b feature/test-pipeline

# Make a small change
echo "test" > test.txt

# Commit and push
git add test.txt
git commit -m "Test pipeline"
git push origin feature/test-pipeline

# Create pull request
# Pipeline will run automatically
```

### 2. Test on Develop Branch
```bash
# Merge to develop
git checkout develop
git merge feature/test-pipeline
git push origin develop

# Pipeline will run and deploy to staging
```

### 3. Test on Main Branch
```bash
# Merge to main
git checkout main
git merge develop
git push origin main

# Pipeline will run and deploy to production
```

## Troubleshooting

### Pipeline Not Triggering
**Problem**: Workflow doesn't run on push

**Solutions**:
1. Check workflow file is in `.github/workflows/`
2. Verify branch names match (`main` vs `master`)
3. Check GitHub Actions is enabled in repository settings
4. Verify YAML syntax is correct

### Tests Failing
**Problem**: Tests pass locally but fail in CI

**Solutions**:
1. Check Node.js version matches (`NODE_VERSION: '20'`)
2. Verify environment variables are set
3. Check test database configuration
4. Review test logs for specific errors
5. Ensure all dependencies are in `package.json`

### Deployment Failing
**Problem**: Deployment step fails

**Solutions**:
1. Verify SSH key is correctly configured
2. Check server is accessible
3. Verify server has required software
4. Check server disk space
5. Review deployment logs
6. Test SSH connection manually

### Permission Errors
**Problem**: Permission denied during deployment

**Solutions**:
1. Check SSH key permissions on server
2. Verify user has write permissions
3. Check directory ownership
4. Review PM2 configuration

### Build Failing
**Problem**: Frontend build fails

**Solutions**:
1. Check build logs for specific errors
2. Verify all dependencies are installed
3. Check for TypeScript errors
4. Review Vite configuration
5. Ensure environment variables are set

### Security Scan Failing
**Problem**: npm audit finds vulnerabilities

**Solutions**:
1. Review audit output
2. Update vulnerable packages: `npm audit fix`
3. For false positives, adjust audit level
4. Check if vulnerabilities are in dev dependencies
5. Consider alternative packages

### Timeout Issues
**Problem**: Jobs timeout

**Solutions**:
1. Increase job timeout in workflow
2. Optimize test suite (reduce test count)
3. Use caching more effectively
4. Split large jobs into smaller ones
5. Check for infinite loops in tests

## Monitoring

### View Pipeline Status
1. Go to repository Actions tab
2. See recent workflow runs
3. Click on run for details

### View Logs
1. Click on failed job
2. Expand steps to see logs
3. Download logs if needed

### View Artifacts
1. Scroll to bottom of workflow run
2. Click on artifacts section
3. Download coverage reports or builds

### Set Up Notifications
```yaml
# Add to workflow
- name: Send Slack notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Best Practices

### 1. Use Semantic Versioning
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### 2. Keep Secrets Secure
- Never commit secrets to repository
- Use environment-specific secrets
- Rotate secrets regularly
- Use least privilege principle

### 3. Monitor Pipeline Performance
- Track pipeline duration
- Identify bottlenecks
- Optimize slow jobs
- Use caching effectively

### 4. Test Locally First
```bash
# Run tests locally
npm test

# Run lint locally
npm run lint

# Build locally
npm run build
```

### 5. Use Branch Protection Rules
1. Go to repository Settings
2. Click on Branches
3. Add rule for main branch
4. Require status checks to pass
5. Require pull request reviews

### 6. Keep Dependencies Updated
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Test after updates
npm test
```

## Additional Resources

### GitHub Actions Documentation
- [Getting Started](https://docs.github.com/en/actions/getting-started-with-github-actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Contexts](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions)

### Useful Actions
- [actions/checkout](https://github.com/actions/checkout)
- [actions/setup-node](https://github.com/actions/setup-node)
- [actions/upload-artifact](https://github.com/actions/upload-artifact)
- [github/codeql-action](https://github.com/github/codeql-action)

### Deployment Tools
- [Vercel CLI](https://github.com/vercel/vercel)
- [Docker](https://www.docker.com/)
- [AWS CLI](https://aws.amazon.com/cli/)
- [PM2](https://pm2.keymetrics.io/)

## Support

If you encounter issues:
1. Check workflow logs
2. Review this guide
3. Search GitHub Actions documentation
4. Check GitHub Actions community forums
5. Open an issue in the repository

## Next Steps

1. ✅ Configure GitHub secrets
2. ✅ Test pipeline on feature branch
3. ✅ Review and customize workflow
4. ✅ Set up monitoring and notifications
5. ✅ Configure branch protection rules
6. ✅ Document team processes
