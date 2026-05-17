# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Swasthya Healthcare Platform is a full-stack healthcare management system with patient/doctor roles, real-time communication, AI-powered Ayurvedic diet chart generation, and secure health data management.

## Development Commands

### Frontend (React + Vite)
```bash
cd frontend
npm install              # Install dependencies
npm run dev              # Start dev server (runs on 0.0.0.0:5173)
npm run build            # Build for production
npm run test             # Run Vitest tests
npm run test:run         # Run tests once
npm run lint             # Run ESLint
```

### Backend (Node + Express)
```bash
cd backend
npm install              # Install dependencies
npm run dev              # Start with nodemon (auto-reload)
npm start                # Start production server
npm test                 # Run Jest tests
```

### Docker
```bash
docker-compose up --build    # Build and run all services
```

## Architecture

### Monorepo Structure
- `frontend/` - React 19 + Vite frontend
- `backend/` - Express.js backend with MongoDB
- `dist/` - Frontend build output

### Backend Architecture

**Entry Point:** `backend/index.js` - Express server with Socket.IO integration

**Key Directories:**
- `config/` - Database (MongoDB), JWT, Cloudinary, password hashing
- `controller/` - Request handlers (auth controller)
- `middleware/` - Auth middleware, socket middleware, request validation
- `model/` - Mongoose schemas (users, doctor, appointments, diet charts, dosha, reports, ratings)
- `routes/` - API route definitions
- `services/` - Socket.IO/WebRTC video call services
- `validator/` - Express Validator schemas

**Authentication Flow:**
1. JWT tokens stored in HTTP-only cookies and localStorage
2. `auth.middleware.js` validates tokens via `Authorization: Bearer <token>` header or cookie
3. Socket connections authenticated via `socket.middleware.js` using handshake auth token

**Real-Time Communication:**
- Socket.IO server initialized in `services/video-call-services.js`
- WebRTC video calls with ICE candidate exchange
- Online user tracking via `userSocketMap` (userId → socketId)
- Call pairing via `callPairs` Map for peer-to-peer routing

### Frontend Architecture

**State Management:** Redux Toolkit with four slices:
- `user.slice` - Authentication state, user profile, doctor/patient role
- `patient.slice` - Patient data: doctors, appointments, dosha, diet charts, reviews
- `doctor.slice` - Doctor data: patients, diet charts, appointment management
- `call.slice` - WebRTC call state (incoming call, online users)

**API Layer:**
- `axios/url.axios.js` - Axios instance with automatic token injection from localStorage
- Base URL from `VITE_API_URL` env var
- All requests include `Authorization: Bearer <token>` header

**Socket Layer:**
- `services/socket_init.js` - Singleton Socket.IO client
- Token passed via `auth.token` in handshake
- Reconnection configured with 5 attempts

**Routing:**
- React Router DOM 7 with protected routes
- `ProtectedRoute` - Requires authentication, optional `doctorOnly` prop
- `PublicRoute` - Redirects authenticated users
- `/dashboard` redirects based on role (doctor vs patient)

**Key Components:**
- `CallModal.jsx` - WebRTC video call UI
- `DoctorComponents/` - Doctor dashboard tabs (appointments, patients, diet charts)
- `PatientComponents/` - Patient dashboard tabs (doctors, appointments, dosha)

### AI Diet Chart Generation

**Stack:** LangChain + LangGraph + ChatGroq API

**Flow:**
1. Doctor inputs patient details (age, gender, dosha type)
2. Backend sends structured prompt to Groq LLM (`openai/gpt-oss-120b`)
3. AI generates 90-day Ayurvedic meal plan in JSON format
4. Response cleaned, validated, and persisted to MongoDB
5. Diet charts stored in `Dietchart.model.js`

## Environment Variables

**Frontend (.env):**
```
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

**Backend (.env):**
```
Port=3001
MONGODB_URL=mongodb_connection_string
JWT_SECRET=jwt_secret_key
CLOUDINARY_CLOUD_NAME=cloud_name
CLOUDINARY_API_KEY=api_key
CLOUDINARY_API_SECRET=api_secret
GROQ_APT_KEY=groq_api_key
FRONTEND_URL=https://your-frontend-url.vercel.app
```

## Testing

**Backend:** Jest with experimental VM modules
```bash
cd backend && npm test
```

**Frontend:** Vitest + Testing Library
```bash
cd frontend && npm run test
```

## Deployment

**Frontend (Vercel):**
- Root: `frontend/`
- Build: `npm run build`
- Output: `dist/`

**Backend (Render):**
- Root: `backend/`
- Start: `npm start`
- Health check: `/health`

## Important Notes

- Backend uses ES modules (`"type": "module"` in package.json)
- Socket.IO requires JWT token in handshake auth or Authorization header
- CORS configured to allow Vercel deployments and specific origins
- WebRTC calls only initiated by doctors to patients
- Diet chart generation requires valid Groq API key

---