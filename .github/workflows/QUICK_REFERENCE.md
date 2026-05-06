# GitHub Actions Quick Reference

## Workflow File Location
```
.github/workflows/ci-cd.yml
```

## Pipeline Overview

### Jobs (8 total)
| Job | Purpose | Duration | Dependencies |
|-----|---------|----------|--------------|
| `lint` | Code quality checks | 1-2 min | None |
| `test-frontend` | Frontend tests | 2-3 min | None |
| `test-backend` | Backend tests | 2-3 min | None |
| `build-frontend` | Production build | 2-3 min | lint, test-frontend |
| `security-scan` | Vulnerability scanning | 2-3 min | lint |
| `deploy` | Production deployment | 1-2 min | build, tests, security |
| `deploy-staging` | Staging deployment | 1-2 min | build, tests, security |
| `notify-failure` | Failure notifications | <1 min | Any job failure |

## Triggers

### Push Events
- `main` branch → Full pipeline + production deployment
- `develop` branch → Full pipeline + staging deployment

### Pull Request Events
- To `main` or `develop` → Full pipeline (no deployment)

## Required Secrets

### Minimum Required
```bash
MONGODB_URI=mongodb://localhost:27017/test
```

### For Deployment
```bash
DEPLOY_HOST=your-server.com
DEPLOY_USER=deploy-user
DEPLOY_SSH_KEY=-----BEGIN RSA PRIVATE KEY-----
... your private key ...
-----END RSA PRIVATE KEY-----
DEPLOY_PORT=22
APP_URL=https://your-app.com
```

### Optional (for staging)
```bash
STAGING_URL=https://staging.your-app.com
```

## Key Commands

### Local Testing
```bash
# Lint
npm run lint

# Test
npm test
npm run test:run

# Build
npm run build

# Security audit
npm audit
```

### Pipeline Commands
```bash
# Trigger manually (GitHub UI)
Actions → Select workflow → Run workflow

# View logs
Actions → Click workflow run → Click job → Expand steps

# Download artifacts
Actions → Click workflow run → Artifacts section
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Pipeline not triggering | Check `.github/workflows/` location and YAML syntax |
| Tests failing locally but passing in CI | Check Node.js version and environment variables |
| Tests passing locally but failing in CI | Check CI environment and test database setup |
| Deployment failing | Verify SSH key and server connectivity |
| Build failing | Check build logs and dependencies |
| Security scan failing | Run `npm audit fix` locally |

## Performance Tips

1. **Use caching** (already configured)
2. **Run tests in parallel** (already configured)
3. **Optimize test suites** - reduce test count, use mocks
4. **Split large jobs** into smaller ones
5. **Use faster runners** if needed

## Customization

### Add New Test Job
```yaml
test-custom:
  name: Custom Tests
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - run: npm run test:custom
```

### Add New Deployment Target
```yaml
deploy-custom:
  name: Deploy to Custom
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - run: ./deploy-custom.sh
```

### Change Node.js Version
```yaml
env:
  NODE_VERSION: '18'  # Change from '20'
```

## Monitoring

### Pipeline Status
- Repository → Actions tab
- Green checkmark = success
- Red X = failure
- Yellow circle = in progress

### Notifications
- GitHub email notifications
- Slack integration (optional)
- Custom webhooks (optional)

## Best Practices

✅ **DO**
- Test locally before pushing
- Use semantic versioning
- Keep secrets secure
- Monitor pipeline performance
- Review failed runs

❌ **DON'T**
- Commit secrets to repo
- Skip tests on main branch
- Ignore security warnings
- Deploy without testing
- Use outdated dependencies

## Quick Setup Checklist

- [ ] Configure GitHub secrets
- [ ] Test pipeline on feature branch
- [ ] Review and customize workflow
- [ ] Set up server for deployment
- [ ] Configure SSH keys
- [ ] Test deployment to staging
- [ ] Test deployment to production
- [ ] Set up notifications
- [ ] Configure branch protection
- [ ] Document team processes

## File Structure

```
.github/
└── workflows/
    ├── ci-cd.yml          # Main workflow file
    ├── README.md          # Detailed documentation
    └── SETUP.md           # Setup guide
```

## Support Links

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax)
- [Actions Marketplace](https://github.com/marketplace?type=actions)
- [Community Forum](https://github.community/c/github-actions)

## Emergency Commands

### Stop Running Workflow
```bash
# GitHub UI
Actions → Click running workflow → Cancel run
```

### Re-run Failed Workflow
```bash
# GitHub UI
Actions → Click failed workflow → Re-run failed jobs
```

### Delete Workflow Runs
```bash
# GitHub UI
Actions → Click workflow run → Delete run
```

## Environment Variables Reference

### Global
```yaml
NODE_VERSION: '20'
MONGODB_URI: ${{ secrets.MONGODB_URI }}
```

### Job-Specific
```yaml
NODE_ENV: test  # Backend tests
```

### GitHub Context
```yaml
github.ref              # Branch reference
github.sha              # Commit SHA
github.event_name       # Event type (push/pull_request)
github.actor            # User who triggered
github.repository        # Repository name
github.run_number       # Workflow run number
github.run_id           # Workflow run ID
```

## Artifact Retention

| Artifact | Retention | Purpose |
|----------|-----------|---------|
| frontend-coverage | 30 days | Test coverage analysis |
| backend-coverage | 30 days | Test coverage analysis |
| frontend-build | 7 days | Deployment files |

## Service Containers

### MongoDB
```yaml
image: mongo:7.0
ports: ["27017:27017"]
healthcheck: mongosh ping
```

## Caching Strategy

```yaml
cache: 'npm'
cache-dependency-path: package.json
```

**Benefits**:
- Faster installs (seconds vs minutes)
- Reduced bandwidth usage
- More consistent builds

## Deployment Strategies

### Current: SSH + PM2
```bash
ssh server
git pull
npm ci --production
pm2 restart
```

### Alternatives:
- Vercel (frontend)
- Docker (containers)
- AWS Lambda (serverless)
- Kubernetes (orchestration)

## Security Features

✅ **Implemented**
- npm audit for dependencies
- CodeQL static analysis
- Secrets management
- Branch protection ready

🔒 **Recommended Additions**
- SAST/DAST scanning
- Container scanning
- Dependency review
- Secret scanning

## Performance Metrics

### Target Durations
- Lint: < 2 minutes
- Tests: < 5 minutes (parallel)
- Build: < 3 minutes
- Security: < 3 minutes
- Deploy: < 2 minutes

**Total Target**: < 10 minutes

## Next Steps

1. Review workflow file
2. Configure secrets
3. Test on feature branch
4. Customize for your needs
5. Set up monitoring
6. Document team processes

---

**Need Help?** Check `README.md` for detailed documentation or `SETUP.md` for setup instructions.
