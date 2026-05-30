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
* GitHub Actions Ready

---

## 📁 Project Structure

```bash
sih/
├── backend/
│   ├── config/
│   │   ├── cloudinary.config.js
│   │   ├── db.connted.js
│   │   ├── jwt.js
│   │   └── password_hash.js
│   ├── controller/
│   │   └── auth.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── socket.middleware.js
│   │   └── Validate.js
│   ├── model/
│   │   ├── appointments.model.js
│   │   ├── Dietchart.model.js
│   │   ├── doctor.model.js
│   │   ├── dosha.model.js
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
│   ├── validator/
│   │   └── auth.validator.js
│   ├── upload/
│   ├── .env
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
│   │   └── manifest.json
│   ├── src/
│   │   ├── axios/
│   │   │   └── url.axios.js
│   │   ├── Components/
│   │   │   ├── data/
│   │   │   │   └── mockData.js
│   │   │   ├── DoctorComponents/
│   │   │   │   ├── AppointmentsTab.jsx
│   │   │   │   ├── AyurvedaTab.jsx
│   │   │   │   ├── ConsultationsTab.jsx
│   │   │   │   ├── Createdietchart.jsx
│   │   │   │   ├── DietChartsTab.jsx
│   │   │   │   ├── Editdietchart.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── MyPatient.jsx
│   │   │   │   ├── Parent.jsx
│   │   │   │   ├── PatientProfile.jsx
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
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── DashboardHeader.jsx
│   │   │   │   ├── DietaryTracker.jsx
│   │   │   │   ├── DoctorProfile.jsx
│   │   │   │   ├── DoctorsTab.jsx
│   │   │   │   ├── LifestyleLog.jsx
│   │   │   │   ├── MedicalRecords.jsx
│   │   │   │   ├── PrakritiSnapshot.jsx
│   │   │   │   ├── RescheduleAppointment.jsx
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
│   │   │   │   └── doctor.thunk.js
│   │   │   ├── Patient/
│   │   │   │   ├── patient.slice.js
│   │   │   │   └── patient.thunk.js
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
└── docker-compose.yml
```

---

## ⚙️ Environment Variables

### Frontend `.env`

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

### Backend `.env`

```env
Port=3001
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_APT_KEY=your_groq_api_key
FRONTEND_URL=https://your-frontend-url.vercel.app
DODO_PAYMENTS_API_KEY=your_test_api_key
```

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

## 🧪 Testing

### Run backend tests:

```bash
cd backend
npm test
```

### Run frontend tests:

```bash
cd frontend
npm run test
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

### Docker Support

#### Backend Dockerfile

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

#### Frontend Dockerfile

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

#### Docker Compose

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
      - ./backend/.env
```

### Run Full Project with Docker

```bash
docker-compose up --build
```

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

### Environment Variables

Add the following variable in your backend `.env`:

```env
DODO_PAYMENTS_API_KEY=your_test_api_key
```

### Current Status

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
* Uses patient attributes:

  * Age
  * Gender
  * Dosha Type
* Produces structured JSON diet charts
* Includes:

  * Breakfast
  * Lunch
  * Dinner
  * Nutrition values
  * Lifestyle recommendations
  * Ayurveda dosha balancing effects

### Key Features

* Strict JSON schema validation
* Automated AI response cleaning
* Database persistence with MongoDB
* Doctor-patient diet assignment
* Scalable agent workflow using LangGraph

### Workflow

1. Doctor inputs patient details
2. Backend sends structured prompt to Groq LLM
3. AI generates Ayurvedic meal plan
4. Response is cleaned and validated
5. Diet chart is stored in database
6. Doctor can retrieve all generated charts

### Benefits

* Reduces manual diet planning effort
* Personalized healthcare recommendations
* Consistent nutritional guidance
* Supports preventive Ayurvedic care

---

## 🔐 Security Features

* JWT Authentication
* HTTP-only cookies
* Secure CORS configuration
* Environment variable protection
* MongoDB Atlas secure access
* Password hashing with bcrypt

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

---

## 👨‍💻 Author

**Ganesh Birajdar**

Passionate full-stack developer specializing in scalable healthcare systems, AI integrations, and secure backend architectures.

---

## 📄 License

This project is licensed under the ISC License.
