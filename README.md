# SWASTHYA Healthcare Platform

A full-stack healthcare management platform built to streamline patient care, doctor interactions, real-time communication, AI-powered healthcare recommendations, and secure health data management.

---

## 🚀 Project Overview

This platform provides:

* Patient authentication & profile management
* Doctor/patient communication
* Real-time chat using Socket.IO
* Dosha assessment & health tracking
* AI-powered Ayurvedic diet chart generation
* Secure API architecture
* Cloud media uploads
* Redis-based rate limiting & caching
* Payment gateway integration (Dodo Payments)
* Deployment-ready frontend and backend

---

## 🛠️ Tech Stack

### Frontend

* React.js 19
* Vite 7
* Tailwind CSS 4
* Axios
* Redux Toolkit
* Framer Motion
* Socket.IO Client
* WebRTC
* Chart.js / Recharts
* Vitest + Testing Library
* PWA Support (vite-plugin-pwa)
* React Router DOM 7
* Lucide React Icons
* React Hot Toast

### Backend

* Node.js
* Express.js 5
* MongoDB + Mongoose
* JWT Authentication
* Socket.IO
* Cloudinary
* Nodemailer
* LangChain
* LangGraph
* ChatGroq API
* Redis (rate limiting & caching)
* Jest Testing Framework
* Multer File Uploads
* Express Validator
* Bcrypt Password Hashing

### DevOps & Deployment

* Docker
* Docker Compose
* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas
* Cache: Redis
* CI/CD: GitHub Actions (9-job pipeline)

---

## 📁 Project Structure

```bash
sih/
├── .github/
│   └── workflows/
│       ├── ci-cd.yml
│       ├── PACKAGE_SUMMARY.md
│       ├── QUICK_REFERENCE.md
│       ├── README.md
│       ├── SETUP.md
│       └── VISUAL_GUIDE.md
├── backend/
│   ├── config/
│   │   ├── cloudinary.config.js
│   │   ├── db.connted.js
│   │   ├── Dodo_Payment.config.js
│   │   ├── jwt.js
│   │   ├── password_hash.js
│   │   └── redis.config.js
│   ├── controller/
│   │   ├── auth.controller.js
│   │   └── payment.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── rate.middleware.js
│   │   ├── socket.middleware.js
│   │   └── Validate.js
│   ├── model/
│   │   ├── appointments.model.js
│   │   ├── Dietchart.model.js
│   │   ├── doctor.model.js
│   │   ├── dosha.model.js
│   │   ├── Payment.model.js
│   │   ├── rating.model.js
│   │   ├── report.model.js
│   │   └── users.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── auth.routes.test.js
│   ├── services/
│   │   └── video-call-services.js
│   ├── tests/
│   │   └── auth.unit.test.js
│   ├── utils/
│   │   └── redis.utils.js
│   ├── validator/
│   │   ├── auth.validator.js
│   │   └── auth.validator.test.js
│   ├── upload/
│   ├── .env
│   ├── .env.docker
│   ├── .env.example
│   ├── dockerfile
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── screenshots/
│   │   │   ├── desktop.png
│   │   │   └── mobile.png
│   │   ├── ayur.png
│   │   ├── kapha.png
│   │   ├── pitta.png
│   │   ├── vata.png
│   │   ├── logo.png
│   │   ├── logo-512.png
│   │   └── manifest.json
│   ├── src/
│   │   ├── axios/
│   │   │   └── url.axios.js
│   │   ├── Components/
│   │   │   ├── data/
│   │   │   │   └── mockData.js
│   │   │   ├── DoctorComponents/
│   │   │   │   ├── AppointmentCount.jsx
│   │   │   │   ├── AppointmentsTab.jsx
│   │   │   │   ├── AppointmentsTab.test.jsx
│   │   │   │   ├── AyurvedaTab.jsx
│   │   │   │   ├── ConsultationsTab.jsx
│   │   │   │   ├── Createdietchart.jsx
│   │   │   │   ├── DietChartsTab.jsx
│   │   │   │   ├── DoshaDistributionCard.jsx
│   │   │   │   ├── Editdietchart.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── MyPatient.jsx
│   │   │   │   ├── Parent.jsx
│   │   │   │   ├── PatientProfile.jsx
│   │   │   │   ├── PatientProfile.test.jsx
│   │   │   │   ├── PatientsTab.jsx
│   │   │   │   ├── ProfileTab.jsx
│   │   │   │   ├── ReportsTab.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── StatCard.jsx
│   │   │   ├── PatientComponents/
│   │   │   │   ├── ActiveDietPlan.jsx
│   │   │   │   ├── Alerts.jsx
│   │   │   │   ├── Appointments.jsx
│   │   │   │   ├── BookAppointment.jsx
│   │   │   │   ├── Cancel.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── DashboardHeader.jsx
│   │   │   │   ├── DietaryTracker.jsx
│   │   │   │   ├── DoctorProfile.jsx
│   │   │   │   ├── DoctorsTab.jsx
│   │   │   │   ├── LifestyleLog.jsx
│   │   │   │   ├── MedicalRecords.jsx
│   │   │   │   ├── PrakritiSnapshot.jsx
│   │   │   │   ├── RescheduleAppointment.jsx
│   │   │   │   ├── Success.jsx
│   │   │   │   └── WeightTrend.jsx
│   │   │   ├── PatientDashboard/
│   │   │   │   ├── Appointment.jsx
│   │   │   │   ├── DoshaPatientForm.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Patientprofileupdate.jsx
│   │   │   │   ├── PatientsTab.jsx
│   │   │   │   ├── Reports.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── CallModal.jsx
│   │   │   ├── DietChartCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── PublicRoute.jsx
│   │   ├── feature/
│   │   │   ├── Doctor/
│   │   │   │   ├── doctor.slice.js
│   │   │   │   ├── doctor.thunk.js
│   │   │   │   └── doctor.thunk.test.js
│   │   │   ├── Patient/
│   │   │   │   ├── patient.slice.js
│   │   │   │   └── patient.thunk.js
│   │   │   ├── Payment/
│   │   │   │   ├── Payment.slice.js
│   │   │   │   └── Payment.thunk.js
│   │   │   ├── User/
│   │   │   │   ├── user.slice.js
│   │   │   │   └── user.thunk.js
│   │   │   └── video_call/
│   │   │       └── call.slice.js
│   │   ├── hook/
│   │   │   └── useWebRTC.js
│   │   ├── Pages/
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── PatientDashboard.jsx
│   │   │   ├── SignIn.jsx
│   │   │   └── SignUp.jsx
│   │   ├── services/
│   │   │   └── socket_init.js
│   │   ├── store/
│   │   │   └── data.store.js
│   │   ├── App.jsx
│   │   ├── App.test.jsx
│   │   ├── main.jsx
│   │   ├── setupTests.js
│   │   └── test-utils.jsx
│   ├── .env
│   ├── dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── eslint.config.js
│
├── docker-compose.yml
├── feature.md
└── README.md
```

---

## ⚙️ Environment Variables

### Frontend `.env`

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

### Backend `.env` (local development)

```env
Port=3001
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=https://your-frontend-url.vercel.app
DODO_PAYMENTS_API_KEY=your_test_api_key
REDIS_URL=redis://localhost:6379
```

### Backend `.env.docker` (Docker Compose)

Used exclusively when running the project via Docker Compose. This file is auto-generated by the CI/CD pipeline but must be created manually for local Docker runs.

```env
PORT=3009
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:3002
DODO_PAYMENTS_API_KEY=your_test_api_key
REDIS_URL=redis://redis:6379
NODE_ENV=production
```

> **Important:** When running via Docker Compose, the Redis URL must use `redis://redis:6379` (the Docker service name), not `localhost`.

---

## 🔧 Installation & Setup

### Clone Repository

```bash
git clone https://github.com/ganeshbirajdar286/sih.git
cd sih
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## 🐳 Docker Setup

### Prerequisites

* [Docker](https://docs.docker.com/get-docker/) installed
* [Docker Compose](https://docs.docker.com/compose/install/) installed (v2+)

---

### Step 1: Create the `.env.docker` file

Before running Docker Compose, you must manually create `backend/.env.docker` with your secrets.

```bash
cat > backend/.env.docker << EOF
PORT=3009
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:3002
DODO_PAYMENTS_API_KEY=your_test_api_key
REDIS_URL=redis://redis:6379
NODE_ENV=production
EOF
```

Or create it manually by copying from the example:

```bash
cp backend/.env.example backend/.env.docker
# Then edit backend/.env.docker and fill in your actual values
```

> **Why `.env.docker` and not `.env`?**
> The `.env.docker` file is specifically for Docker Compose and uses internal Docker network addresses (e.g., `redis://redis:6379` instead of `redis://localhost:6379`). This keeps your local dev and containerized environments cleanly separated.

---

### Step 2: Start all services

```bash
docker-compose up --build
```

This starts three services:
* `backend` — Node.js API on port `3009`
* `web` (frontend) — React/Vite app on port `3002`
* `redis` — Redis cache on port `6379`
* `db` — MongoDB on port `27017` (if included in your compose file)

---

### Step 3: Verify services are running

```bash
# Check container status
docker ps

# Check backend health endpoint
curl http://localhost:3009/health

# Check frontend
open http://localhost:3002
```

---

### Useful Docker Commands

```bash
# Start in detached (background) mode
docker-compose up -d --build

# View logs for all services
docker-compose logs

# View logs for a specific service
docker-compose logs backend
docker-compose logs web

# Stop all services
docker-compose down

# Stop and remove volumes (clears DB data)
docker-compose down -v

# Rebuild a single service without restarting others
docker-compose up --build backend
```

---

### Docker Service Ports

| Service   | Container Port | Host Port |
|-----------|---------------|-----------|
| Backend   | 3009          | 3009      |
| Frontend  | 3002          | 3002      |
| Redis     | 6379          | 6379      |
| MongoDB   | 27017         | 27017     |

---

### Backend Dockerfile

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Frontend Dockerfile

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    env_file:
      - ./backend/.env.docker   # uses Docker-specific env file
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

---

## 🧪 Testing

### Run backend tests:

```bash
cd backend
npm test
```

### Run backend tests with coverage:

```bash
cd backend
npm run test:coverage
```

### Run frontend tests:

```bash
cd frontend
npm run test:run
```

### Run frontend tests with coverage:

```bash
cd frontend
npm run test:coverage
```

Coverage reports are generated in `frontend/coverage/` and `backend/coverage/` respectively.

---

## 🚦 CI/CD Pipeline

The project includes a 9-job GitHub Actions pipeline that runs on every push and pull request to `main`.

| Job | Description |
|-----|-------------|
| `lint` | ESLint checks for frontend and backend |
| `test-frontend` | Vitest unit tests + coverage upload |
| `test-backend` | Jest unit tests with MongoDB service container |
| `build-frontend` | Vite production build + artifact upload |
| `security-scan` | `npm audit` + GitHub CodeQL analysis |
| `deploy` | Deploy backend to Render, wait for health check |
| `docker-build` | Build and push images to Docker Hub |
| `docker-compose-test` | Integration test with Docker Compose |
| `notify-failure` | Opens a GitHub Issue on pipeline failure |

### Required GitHub Secrets

Set these in your repo under **Settings → Secrets and Variables → Actions**:

```
MONGODB_URI
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
GROQ_API_KEY
DODO_PAYMENTS_API_KEY
RENDER_DEPLOY_HOOK_URL
APP_URL
DOCKER_USERNAME
DOCKER_PASSWORD
```

---

## 🌐 Deployment Guide

### Frontend on Vercel

* Root Directory: `frontend`
* Framework Preset: Vite
* Build Command: `npm run build`
* Output Directory: `dist`

### Backend on Render

* Root Directory: `backend`
* Build Command: `npm install`
* Start Command: `npm start`
* Health Check Path: `/health`

---

## 💳 Payment Gateway Integration

The platform supports secure online consultation payments using **Dodo Payments** in test mode.

### Features

* Secure payment processing for appointments
* Test-mode payment workflow integration
* Backend payment verification
* Consultation booking payment support
* Payment success & failure handling
* Environment-based payment configuration

### Payment Stack

* Dodo Payments
* React.js Frontend Integration
* Node.js & Express Backend APIs

Add the following variable in your backend `.env` (or `.env.docker`):

```env
DODO_PAYMENTS_API_KEY=your_test_api_key
```

> ⚠️ The payment gateway is currently running in **test mode** for development and testing purposes.

### Future Improvements

* Live payment deployment
* Refund management
* Payment history dashboard
* Automated invoice generation

---

## 🤖 AI-Powered Diet Chart Generation

This platform integrates Generative AI to automate personalized Ayurvedic diet chart creation for patients.

### AI Stack

* LangChain
* LangGraph
* ChatGroq API
* Groq LLM Model: `openai/gpt-oss-120b`

### Functionality

* Generates personalized 90-day Ayurvedic diet plans
* Uses patient attributes: Age, Gender, Dosha Type
* Produces structured JSON diet charts including:
  * Breakfast, Lunch, Dinner
  * Nutrition values
  * Lifestyle recommendations
  * Ayurveda dosha balancing effects

### Workflow

1. Doctor inputs patient details
2. Backend sends structured prompt to Groq LLM
3. AI generates Ayurvedic meal plan
4. Response is cleaned and validated
5. Diet chart is stored in MongoDB
6. Doctor retrieves all generated charts

---

## ⚡ Redis Integration

Redis is used for rate limiting and caching to improve performance and protect the API.

* **Rate Limiting** — via `rate.middleware.js`, protects auth and sensitive routes
* **Caching** — via `redis.utils.js`, speeds up repeated data fetches

See `backend/redis.md` for detailed Redis configuration and usage notes.

### Installing dependencies

```bash
cd backend
npm install ioredis rate-limit-redis express-rate-limit
```

| Package | Purpose |
|---------|---------|
| `ioredis` | Redis client with reconnect strategy and cluster support |
| `rate-limit-redis` | Redis store adapter for `express-rate-limit` |
| `express-rate-limit` | Rate limiting middleware for Express |

### Importing in your files

**Redis client** (`config/redis.config.js` → used everywhere redis is needed):

```js
import redis from "../config/redis.config.js";
```

**Cache utilities** (`utils/redis.utils.js` → used in controllers):

```js
import {
  getOrSetCache,     // read from cache, or fetch + store if miss
  setCache,          // manually write to cache
  getCache,          // read from cache only (no fallback)
  deleteCache,       // delete a single key
  deleteCachePattern, // delete all keys matching a glob pattern e.g. "doctor:*"
  setSession,        // store session data (key: session:{userId})
  getSession,        // read session
  deleteSession,     // remove session on logout
  acquireLock,       // distributed lock — prevents double-booking
  releaseLock,       // always release in a finally block
} from "../utils/redis.utils.js";
```

**Rate limit middleware** (`middleware/rate.middleware.js` → used in routes):

```js
import { rateLimitMiddleware } from "../middleware/rate.middleware.js";
```

### Caching pattern used in controllers

Every cached GET follows the same pattern — check cache first, hit MongoDB only on a miss, then store the result:

```js
const data = await getOrSetCache(
  "cache-key",        // unique Redis key
  async () => {       // callback: only runs on cache miss
    return await Model.find(...);
  },
  300                 // TTL in seconds (5 minutes)
);
```

### Cache keys reference

| Cache key | TTL | Set by | Invalidated by |
|-----------|-----|--------|----------------|
| `doctors:all` | 5 min | `alldoctor` | `DoctorUpdateProfile` |
| `doctor:{id}` | 5 min | `getSingleDoctor` | `DoctorUpdateProfile` |
| `doctor:{id}:appointments` | 1 min | `getDoctorBookedSlots` | `patientAppointment` |
| `patient:{id}` | 5 min | `single_Patient` | `PatientUpdateProfile` |
| `dietchart:{patientId}` | 5 min | `patient_diet_chart` | `dietChart` (create) |
| `dietcharts:doctor:{id}` | 5 min | `getdietchart` | `dietChart` (create), `updateDietChart` |
| `dietchart:single:{id}` | 5 min | `getDietchartById` | `updateDietChart` |
| `session:{userId}` | 7 days | `login` | `logout` |
| `slot:{doctorId}:{date}:{slot}` | 10 s | `patientAppointment` (lock) | Released after booking |

### Distributed lock — preventing double booking

The appointment booking route uses a Redis lock to prevent two patients booking the same slot simultaneously:

```js
const lockKey = `slot:${DOCTOR}:${Appointment_Date}:${Time_slot}`;
const gotLock = await acquireLock(lockKey, 10); // 10s TTL

if (!gotLock) {
  return res.status(409).json({ message: "Slot is being booked. Try again." });
}

try {
  // create appointment
} finally {
  await releaseLock(lockKey); // always release
}
```

### Local Redis (without Docker)

```bash
# macOS
brew install redis && brew services start redis

# Ubuntu
sudo apt install redis-server && sudo systemctl start redis
```

---

## 🔐 Security Features

* JWT Authentication
* HTTP-only cookies
* Redis-based rate limiting
* Secure CORS configuration
* Environment variable protection
* MongoDB Atlas secure access
* Password hashing with bcrypt
* GitHub CodeQL static analysis in CI

---

## 📡 Real-Time Features

* Live messaging
* Socket.IO integration
* Instant doctor-patient communication
* WebRTC video consultation support

---

## 📈 Future Improvements

* Appointment scheduling automation
* AI-powered health insights
* Advanced analytics dashboard
* Notification system
* E-prescriptions
* Multi-language support
* Live payment deployment
* Refund management system

---

## 👨‍💻 Author

**Ganesh Birajdar**

Passionate full-stack developer specializing in scalable healthcare systems, AI integrations, and secure backend architectures.

---

## 📄 License

This project is licensed under the ISC License.
