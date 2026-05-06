# GitHub Actions Workflow Visual Guide

## Pipeline Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     GITHUB ACTIONS TRIGGER                       │
│  ┌──────────────┐                    ┌──────────────┐          │
│  │ Push to main │                    │ Pull Request │          │
│  └──────┬───────┘                    └──────┬───────┘          │
└─────────┼────────────────── ──────────────────┼─────────────────┘
          │                                     │
          ▼                                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PARALLEL EXECUTION                           │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   LINT   │  │TEST FRONTEND │  │ TEST BACKEND │               │
│  │  1-2 min │  │   2-3 min    │  │   2-3 min    │               │
│  └────┬─────┘  └──────┬───────┘  └──────┬───────┘               │
│       │                │                  │                     │
│       │                │                  │                     │
│       ▼                ▼                  ▼                     │
│  ┌──────────────────────────────────────────────────┐         │
│  │              SECURITY SCAN                         │         │
│  │              2-3 min                                │         │
│  └────────────────────┬─────────────────────────────┘         │
└───────────────────────┼───────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SEQUENTIAL EXECUTION                          │
│  ┌──────────────────────────────────────────────────┐         │
│  │              BUILD FRONTEND                       │         │
│  │              (requires lint + tests)              │         │
│  │              2-3 min                               │         │
│  └────────────────────┬─────────────────────────────┘         │
└───────────────────────┼───────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│              CONDITIONAL DEPLOYMENT                             │
│                                                                 │
│  ┌──────────────────────┐    ┌──────────────────────┐         │
│  │   MAIN BRANCH ONLY   │    │  DEVELOP BRANCH ONLY │         │
│  │                      │    │                      │         │
│  │  ┌────────────────┐  │    │  ┌────────────────┐  │         │
│  │  │ DEPLOY TO PROD │  │    │  │DEPLOY TO STAGING│  │         │
│  │  │    1-2 min     │  │    │  │    1-2 min     │  │         │
│  │  └────────────────┘  │    │  └────────────────┘  │         │
│  └──────────────────────┘    └──────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│              NOTIFICATION (ON FAILURE)                          │
│  ┌──────────────────────────────────────────────────┐         │
│  │         CREATE GITHUB ISSUE WITH DETAILS          │         │
│  └──────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Job Dependency Graph

```
                    ┌─────────────┐
                    │    LINT     │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │TEST FRONTEND│ │TEST BACKEND │ │SECURITY SCAN│
    └──────┬──────┘ └─────────────┘ └─────────────┘
           │
           ▼
    ┌─────────────┐
    │BUILD FRONT  │
    └──────┬──────┘
           │
           ├──────────────┬──────────────┐
           │              │              │
           ▼              ▼              ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │DEPLOY PROD  │ │DEPLOY STAGE │ │NOTIFY FAIL  │
    │(main only)  │ │(dev only)   │ │(on failure) │
    └─────────────┘ └─────────────┘ └─────────────┘
```

## Data Flow Diagram

```
┌──────────────┐
│   GITHUB     │
│   REPOSITORY │
└──────┬───────┘
       │
       │ 1. Checkout Code
       ▼
┌──────────────┐
│  WORKSPACE   │
│  /app/repo   │
└──────┬───────┘
       │
       ├──────────────────────────────────────┐
       │                                      │
       ▼                                      ▼
┌──────────────┐                      ┌──────────────┐
│  FRONTEND    │                      │   BACKEND    │
│  /frontend   │                      │   /backend   │
└──────┬───────┘                      └──────┬───────┘
       │                                      │
       │ 2. Install Dependencies               │ 2. Install Dependencies
       ▼                                      ▼
┌──────────────┐                      ┌──────────────┐
│ node_modules │                      │ node_modules │
└──────┬───────┘                      └──────┬───────┘
       │                                      │
       │ 3. Run Tests                         │ 3. Run Tests
       ▼                                      ▼
┌──────────────┐                      ┌──────────────┐
│  Test Results│                      │  Test Results│
└──────┬───────┘                      └──────┬───────┘
       │                                      │
       │ 4. Upload Coverage                   │ 4. Upload Coverage
       ▼                                      ▼
┌──────────────┐                      ┌──────────────┐
│  Artifacts   │                      │  Artifacts   │
│  /coverage   │                      │  /coverage   │
└──────────────┘                      └──────────────┘
       │                                      │
       │ 5. Build (frontend only)            │
       ▼                                      │
┌──────────────┐                              │
│  /dist       │                              │
│  (Build)     │                              │
└──────┬───────┘                              │
       │                                      │
       │ 6. Upload Build                      │
       ▼                                      │
┌──────────────┐                              │
│  Artifacts   │                              │
│  /dist       │                              │
└──────┬───────┘                              │
       │                                      │
       │ 7. Deploy (if main/develop)         │
       ▼                                      │
┌──────────────┐                              │
│  PRODUCTION  │                              │
│  SERVER      │                              │
└──────────────┘                              │
                                              │
                                              │ 8. Deploy Backend
                                              ▼
                                      ┌──────────────┐
                                      │  PRODUCTION  │
                                      │  SERVER      │
                                      └──────────────┘
```

## Service Container Architecture

```
┌─────────────────────────────────────────────────────────┐
│              GITHUB ACTIONS RUNNER                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │              JOB: TEST BACKEND                     │  │
│  │                                                     │  │
│  │  ┌──────────────┐      ┌──────────────┐          │  │
│  │  │   NODE.JS    │      │   MONGODB    │          │  │
│  │  │   Process    │◄────►│   Container  │          │  │
│  │  │              │      │   (port 27017│          │  │
│  │  │  - npm test  │      │   localhost) │          │  │
│  │  │  - Jest      │      │              │          │  │
│  │  └──────────────┘      └──────────────┘          │  │
│  │         │                      │                   │  │
│  │         │                      │                   │  │
│  │         └──────────┬───────────┘                   │  │
│  │                    │                              │  │
│  │                    ▼                              │  │
│  │         ┌──────────────────┐                     │  │
│  │         │  Test Results   │                     │  │
│  │         └──────────────────┘                     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Artifact Flow

```
┌──────────────┐
│  TEST JOB    │
│              │
│  ┌────────┐  │
│  │ Tests  │  │
│  └───┬────┘  │
      │       │
      ▼       │
┌──────────┐  │
│ Coverage │  │
│ Reports │  │
└─────┬────┘  │
      │       │
      │ Upload│
      ▼       │
┌──────────────┐
│  ARTIFACTS   │
│              │
│  ┌────────┐  │
│  │frontend│  │
│  │coverage│  │
│  │(30 days)│  │
│  └────────┘  │
│  ┌────────┐  │
│  │backend │  │
│  │coverage│  │
│  │(30 days)│  │
│  └────────┘  │
└──────────────┘
       │
       │ Download
       ▼
┌──────────────┐
│  DEPLOY JOB  │
│              │
│  ┌────────┐  │
│  │ Build  │  │
│  │ Files  │  │
│  └────────┘  │
└──────────────┘
```

## Security Scan Flow

```
┌──────────────┐
│  SECURITY    │
│  SCAN JOB    │
└──────┬───────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│  NPM AUDIT   │  │   CODEQL     │
│              │  │              │
│  ┌────────┐  │  │  ┌────────┐  │
│  │Frontend│  │  │  │Static  │  │
│  │Deps    │  │  │  │Analysis│  │
│  └────────┘  │  │  └────────┘  │
│  ┌────────┐  │  │              │
│  │Backend │  │  │  ┌────────┐  │
│  │Deps    │  │  │  │Security│  │
│  └────────┘  │  │  │Issues  │  │
└──────────────┘  │  └────────┘  │
                  └──────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  SECURITY    │
                  │  REPORT      │
                  └──────────────┘
```

## Deployment Flow

```
┌──────────────┐
│  BUILD JOB   │
│              │
│  ┌────────┐  │
│  │Frontend│  │
│  │Build  │  │
│  └───┬────┘  │
      │       │
      ▼       │
┌──────────┐  │
│  /dist   │  │
│  Files   │  │
└─────┬────┘  │
      │       │
      │ Upload│
      ▼       │
┌──────────────┐
│  ARTIFACTS   │
│              │
│  ┌────────┐  │
│  │frontend│  │
│  │-build │  │
│  │(7 days)│  │
│  └────────┘  │
└──────┬───────┘
       │
       │ Download
       ▼
┌──────────────┐
│  DEPLOY JOB  │
│              │
│  ┌────────┐  │
│  │SSH into│  │
│  │Server  │  │
│  └───┬────┘  │
      │       │
      ▼       │
┌──────────┐  │
│  SERVER  │  │
│          │  │
│  ┌──────┐ │  │
│  │Pull  │ │  │
│  │Code  │ │  │
│  └───┬──┘ │  │
      │    │  │
      ▼    │  │
┌──────────┐ │  │
│  Install │ │  │
│  Deps    │ │  │
└─────┬────┘ │  │
      │     │  │
      ▼     │  │
┌──────────┐ │  │
│  Restart │ │  │
│  Services│ │  │
└─────┬────┘ │  │
      │     │  │
      ▼     │  │
┌──────────┐ │  │
│  Health  │ │  │
│  Check   │ │  │
└─────┬────┘ │  │
      │     │  │
      ▼     │  │
┌──────────┐ │  │
│  Notify  │ │  │
│  Success │ │  │
└──────────┘ │  │
             │
└─────────────┘
```

## Notification Flow

```
┌──────────────┐
│  ANY JOB     │
│  FAILS       │
└──────┬───────┘
       │
       │ Trigger
       ▼
┌──────────────┐
│  NOTIFY      │
│  FAILURE JOB │
└──────┬───────┘
       │
       │ Collect Info
       ▼
┌──────────────┐
│  GITHUB      │
│  CONTEXT     │
│              │
│  - Workflow  │
│  - Run #     │
│  - Repo      │
│  - Actor     │
│  - SHA       │
└──────┬───────┘
       │
       │ Create Issue
       ▼
┌──────────────┐
│  GITHUB      │
│  ISSUE       │
│              │
│  Title:      │
│  "Pipeline   │
│   Failure"   │
│              │
│  Labels:     │
│  - pipeline- │
│    failure   │
│  - bug       │
└──────────────┘
```

## Caching Architecture

```
┌──────────────┐
│  GITHUB      │
│  ACTIONS     │
│  CACHE       │
└──────┬───────┘
       │
       │ 1. Check Cache
       ▼
┌──────────────┐
│  CACHE KEY   │
│              │
│  - Node.js   │
│  - Version   │
│  - OS        │
│  - package   │
│    .json     │
└──────┬───────┘
       │
       ├──────────┐
       │          │
       ▼          ▼
┌──────────┐ ┌──────────┐
│  HIT     │ │  MISS    │
│          │ │          │
│  Restore │ │  Install │
│  Cache   │ │  Deps    │
│          │ │          │
│  ┌──────┐ │ │  ┌──────┐ │
│  │Fast  │ │ │  │Slow  │ │
│  │(sec) │ │ │  │(min) │ │
│  └──────┘ │ │  └──────┘ │
└──────────┘ └──────────┘
       │          │
       │          │ Save Cache
       └────┬─────┘
            │
            ▼
      ┌──────────┐
      │  node_   │
      │  modules │
      └──────────┘
```

## Environment Flow

```
┌──────────────┐
│  GITHUB      │
│  SECRETS     │
└──────┬───────┘
       │
       │ Inject
       ▼
┌──────────────┐
│  WORKFLOW    │
│  ENV VARS    │
│              │
│  - NODE_VER  │
│  - MONGO_URI │
│  - JWT_SECRET│
│  - etc.      │
└──────┬───────┘
       │
       │ Pass to Jobs
       ▼
┌──────────────┐
│  JOB         │
│  ENVIRONMENT │
│              │
│  - NODE_ENV  │
│  - TEST_DB   │
│  - etc.      │
└──────┬───────┘
       │
       │ Use in Steps
       ▼
┌──────────────┐
│  STEP        │
│  COMMANDS    │
│              │
│  npm test    │
│  npm run build│
│  etc.        │
└──────────────┘
```

## Timeline Visualization

```
Time:  0    1    2    3    4    5    6    7    8    9   10 (minutes)
       │    │    │    │    │    │    │    │    │    │    │

Job 1:  ████████
Lint:   [████████]

Job 2:       ████████████
Test FE:     [████████████]

Job 3:       ████████████
Test BE:     [████████████]

Job 4:       ████████████
Security:    [████████████]

Job 5:            ████████████
Build:       [████████████]

Job 6:                 ████████
Deploy:          [████████]

Job 7:                 ████████
Notify:           [████████]

Total:  ████████████████████████████████████████████████████████
         [                    8-10 minutes                     ]
```

## Branch Strategy

```
┌──────────────┐
│   MAIN       │
│   (Production)│
└──────┬───────┘
       │
       │ Merge
       ▼
┌──────────────┐
│  DEVELOP     │
│  (Staging)   │
└──────┬───────┘
       │
       │ Merge
       ▼
┌──────────────┐
│  FEATURE     │
│  Branches    │
└──────────────┘

Pipeline Behavior:
- Feature Branch: Tests only (no deploy)
- Develop Branch: Tests + Staging Deploy
- Main Branch: Tests + Production Deploy
```

## Status Indicators

```
✅ SUCCESS = Green checkmark
❌ FAILURE = Red X
⏳ RUNNING = Yellow circle
⏸️ PENDING = Gray circle
🔄 RETRY = Blue arrow
⚠️ WARNING = Yellow triangle
```

## File Structure

```
.github/
└── workflows/
    ├── ci-cd.yml              # Main workflow (15KB)
    ├── README.md              # Detailed docs (13KB)
    ├── SETUP.md               # Setup guide (10KB)
    ├── QUICK_REFERENCE.md     # Quick ref (7KB)
    └── VISUAL_GUIDE.md        # This file
```

## Quick Reference

| Component | File | Purpose |
|-----------|------|---------|
| Workflow | ci-cd.yml | Pipeline definition |
| Docs | README.md | Full documentation |
| Setup | SETUP.md | Setup instructions |
| Reference | QUICK_REFERENCE.md | Quick lookup |
| Visual | VISUAL_GUIDE.md | Diagrams and flows |

---

**Need more details?** Check the corresponding documentation files.
