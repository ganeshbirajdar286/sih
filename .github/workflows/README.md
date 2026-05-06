# GitHub Actions CI/CD Pipeline Documentation

## Overview

This production-level CI/CD pipeline automates the entire software development lifecycle for your full-stack application, including code quality checks, testing, building, security scanning, and deployment.

## Workflow Structure

The pipeline is defined in `.github/workflows/ci-cd.yml` and consists of 8 main jobs:

### 1. **Lint Job** (`lint`)
**Purpose**: Ensures code quality and consistency across the codebase.

**What it does**:
- Checks out the repository code
- Sets up Node.js environment with caching
- Installs frontend and backend dependencies
- Runs ESLint on frontend code
- Runs lint checks on backend code

**Why it's important**:
- Catches code style issues early
- Enforces consistent coding standards
- Identifies potential bugs before they reach production
- Reduces code review time by catching obvious issues

**Key commands**:
```bash
npm ci              # Clean install (faster, more reproducible)
npm run lint        # Run ESLint
```

### 2. **Test Frontend Job** (`test-frontend`)
**Purpose**: Validates frontend functionality and component behavior.

**What it does**:
- Checks out repository code
- Sets up Node.js with dependency caching
- Installs frontend dependencies
- Runs Vitest test suite
- Uploads coverage reports as artifacts

**Why it's important**:
- Ensures React components work as expected
- Validates user interactions and UI behavior
- Prevents regressions when code changes
- Provides code coverage metrics

**Key commands**:
```bash
npm run test:run    # Run tests in CI mode
```

**Artifacts**: Test coverage reports (retained for 30 days)

### 3. **Test Backend Job** (`test-backend`)
**Purpose**: Validates backend API endpoints, database operations, and business logic.

**What it does**:
- Checks out repository code
- Sets up Node.js with dependency caching
- Spins up MongoDB service container
- Installs backend dependencies
- Runs Jest test suite with test database
- Uploads coverage reports

**Why it's important**:
- Ensures API endpoints return correct responses
- Validates database operations and queries
- Tests authentication and authorization
- Verifies business logic correctness

**Service Container**:
```yaml
mongodb:
  image: mongo:7.0
  ports: ["27017:27017"]
  healthcheck: Ensures MongoDB is ready before tests run
```

**Key commands**:
```bash
npm test           # Run Jest tests
```

**Artifacts**: Test coverage reports (retained for 30 days)

### 4. **Build Frontend Job** (`build-frontend`)
**Purpose**: Creates optimized production build of the frontend application.

**What it does**:
- Checks out repository code
- Sets up Node.js environment
- Installs frontend dependencies
- Runs Vite production build
- Uploads build artifacts

**Why it's important**:
- Creates minified, optimized JavaScript bundles
- Prepares assets for production deployment
- Validates build process works correctly
- Catches build-time errors

**Dependencies**: Requires `lint` and `test-frontend` jobs to pass first

**Key commands**:
```bash
npm run build      # Create production build with Vite
```

**Artifacts**: Built frontend files (retained for 7 days)

### 5. **Security Scan Job** (`security-scan`)
**Purpose**: Identifies security vulnerabilities and code quality issues.

**What it does**:
- Checks out repository code
- Runs `npm audit` on frontend dependencies
- Runs `npm audit` on backend dependencies
- Performs CodeQL analysis on JavaScript code

**Why it's important**:
- Detects known vulnerabilities in dependencies
- Identifies potential security issues in code
- Ensures compliance with security best practices
- Prevents deploying vulnerable code

**Security Tools**:
- `npm audit`: Checks for vulnerable npm packages
- CodeQL: GitHub's advanced static analysis tool

**Key commands**:
```bash
npm audit --audit-level=moderate    # Fail on moderate+ vulnerabilities
```

### 6. **Deploy to Production Job** (`deploy`)
**Purpose**: Deploys the application to production environment.

**What it does**:
- Downloads frontend build artifacts
- Installs backend production dependencies
- SSHs into production server
- Pulls latest code
- Restarts backend services
- Runs database migrations
- Performs health checks
- Notifies team of successful deployment

**Why it's important**:
- Automates deployment process
- Reduces human error
- Ensures consistent deployments
- Provides deployment visibility

**Triggers**: Only runs on `push` to `main` branch

**Prerequisites**: All previous jobs must succeed

**Deployment Steps**:
```bash
# SSH into server
cd /var/www/your-app
git pull origin main
cd backend
npm ci --production
pm2 restart backend
```

**Health Check**:
```bash
curl -f $APP_URL/health
```

### 7. **Deploy to Staging Job** (`deploy-staging`)
**Purpose**: Deploys to staging environment for testing before production.

**What it does**:
- Downloads frontend build artifacts
- Deploys to staging environment
- Runs smoke tests

**Why it's important**:
- Allows testing in production-like environment
- Catches issues before production deployment
- Enables QA and UAT processes

**Triggers**: Only runs on `push` to `develop` branch

### 8. **Notify on Failure Job** (`notify-failure`)
**Purpose**: Alerts the team when pipeline failures occur.

**What it does**:
- Creates GitHub issue with failure details
- Includes workflow name, run number, and trigger info
- Labels issue for tracking

**Why it's important**:
- Ensures team is aware of failures
- Provides context for debugging
- Creates audit trail of issues

**Triggers**: Runs if any previous job fails

## Required GitHub Secrets

Configure these secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):

### Database Secrets
```
MONGODB_URI=mongodb://username:password@host:port/database
```

### Deployment Secrets
```
DEPLOY_HOST=your-server.com
DEPLOY_USER=deploy-user
DEPLOY_SSH_KEY=-----BEGIN RSA PRIVATE KEY-----
... your private key ...
-----END RSA PRIVATE KEY-----
DEPLOY_PORT=22  # Optional, defaults to 22
```

### Application Secrets
```
APP_URL=https://your-app.com
STAGING_URL=https://staging.your-app.com
```

### Additional Secrets (as needed)
```
JWT_SECRET=your-jwt-secret
CLOUDINARY_URL=cloudinary://...
SMTP_HOST=smtp.example.com
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
```

## Workflow Triggers

The pipeline runs on:

### Push Events
- **main branch**: Full pipeline including production deployment
- **develop branch**: Full pipeline including staging deployment

### Pull Request Events
- **to main**: Runs all jobs except deployment
- **to develop**: Runs all jobs except deployment

## Job Dependencies

```
lint ──────────────────────────────┐
                                     ├──► security-scan ──┐
test-frontend ──► build-frontend ──┤                    ├──► deploy (main only)
                                     └───────────────────┤
test-backend ──────────────────────┘                    ├──► deploy-staging (develop only)
                                                          │
notify-failure ◄─────────────────────────────────────────┘
```

## Caching Strategy

The pipeline uses GitHub Actions caching to speed up builds:

### Node.js Dependencies
```yaml
cache: 'npm'
cache-dependency-path: frontend/package.json  # Per-directory caching
```

**Why**: Reduces install time from minutes to seconds by caching `node_modules`

## Artifacts

### Test Coverage Reports
- **Frontend**: `frontend-coverage` (30 days)
- **Backend**: `backend-coverage` (30 days)

### Build Artifacts
- **Frontend Build**: `frontend-build` (7 days)

**Why**: Preserves important outputs for analysis and deployment

## Environment Variables

### Global Variables
```yaml
NODE_VERSION: '20'
MONGODB_URI: ${{ secrets.MONGODB_URI }}
```

### Job-Specific Variables
```yaml
NODE_ENV: test  # For backend tests
```

## Best Practices Implemented

### 1. **Parallel Execution**
- `lint`, `test-frontend`, `test-backend`, `security-scan` run in parallel
- Reduces total pipeline time

### 2. **Conditional Execution**
- Deployment only on specific branches
- Failure notifications only when needed

### 3. **Fail-Fast Strategy**
- Jobs depend on successful completion of prerequisites
- Stops pipeline early on failures

### 4. **Security First**
- Uses secrets for sensitive data
- Runs security scans before deployment
- Validates dependencies

### 5. **Artifact Management**
- Uploads important outputs
- Sets appropriate retention periods
- Makes artifacts available to subsequent jobs

### 6. **Health Checks**
- Verifies deployment success
- Checks application responsiveness
- Validates database connectivity

### 7. **Notification System**
- Alerts on failures
- Confirms successful deployments
- Provides context for debugging

## Customization Guide

### Adding New Tests
```yaml
test-new-feature:
  name: Test New Feature
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Run custom tests
      run: npm run test:custom
```

### Adding Deployment Targets
Replace the SSH deployment with your preferred method:

#### Vercel
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.ORG_ID }}
    vercel-project-id: ${{ secrets.PROJECT_ID }}
    vercel-args: '--prod'
```

#### Docker
```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    context: ./backend
    push: true
    tags: your-registry/backend:latest
```

#### AWS
```yaml
- name: Deploy to AWS
  uses: appleboy/lambda-action@v1.0.0
  with:
    access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    function_name: your-function
    source: backend/
```

### Adding Environment-Specific Configurations
```yaml
deploy-production:
  runs-on: ubuntu-latest
  environment:
    name: production
    url: https://your-app.com
  # ... deployment steps
```

## Monitoring and Debugging

### Viewing Pipeline Runs
1. Go to repository Actions tab
2. Click on workflow run
3. View job logs and artifacts

### Common Issues

#### Pipeline Fails on Tests
- Check test logs in failed job
- Run tests locally: `npm test`
- Verify test database configuration

#### Deployment Fails
- Check SSH key permissions
- Verify server connectivity
- Review deployment logs
- Check server disk space

#### Security Scan Fails
- Review `npm audit` output
- Update vulnerable packages: `npm audit fix`
- For false positives, use `--audit-level` flag

#### Build Fails
- Check build logs for errors
- Verify all dependencies are installed
- Check for TypeScript errors
- Review Vite configuration

## Performance Optimization

### Current Pipeline Duration
- Lint: ~1-2 minutes
- Tests: ~3-5 minutes (parallel)
- Build: ~2-3 minutes
- Security Scan: ~2-3 minutes
- Deployment: ~1-2 minutes

**Total**: ~5-10 minutes (with parallel execution)

### Optimization Tips
1. Use dependency caching (already implemented)
2. Run tests in parallel (already implemented)
3. Use faster runners (GitHub-hosted vs self-hosted)
4. Optimize test suites (reduce test count, use mocks)
5. Split large test suites into multiple jobs

## Maintenance

### Regular Tasks
- Review and update Node.js version
- Update GitHub Actions versions
- Review and update dependencies
- Monitor pipeline performance
- Update secrets as needed

### Updating Actions
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Test locally before committing
npm test
npm run build
```

## Support and Resources

### Documentation
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Actions Marketplace](https://github.com/marketplace?type=actions)

### Common Actions Used
- `actions/checkout@v4` - Checkout code
- `actions/setup-node@v4` - Setup Node.js
- `actions/upload-artifact@v4` - Upload artifacts
- `actions/download-artifact@v4` - Download artifacts
- `github/codeql-action/init@v3` - Security analysis
- `appleboy/ssh-action@v1.0.3` - SSH deployment

## Conclusion

This production-level CI/CD pipeline provides:
- ✅ Automated testing and quality checks
- ✅ Security vulnerability scanning
- ✅ Automated deployment to multiple environments
- ✅ Comprehensive error handling and notifications
- ✅ Performance optimization through caching and parallel execution
- ✅ Visibility into pipeline status and results

The pipeline is designed to be:
- **Reliable**: Comprehensive checks prevent bad code from reaching production
- **Fast**: Parallel execution and caching minimize wait times
- **Secure**: Secrets management and security scans protect your application
- **Maintainable**: Clear structure and documentation make updates easy
- **Scalable**: Easy to add new jobs, tests, or deployment targets
