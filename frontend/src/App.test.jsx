import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import PublicRoute from "./Components/PublicRoute.jsx";

// Mock react-hot-toast with Toaster
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => null,
}));

// Mock page components
const HomePage = () => <div data-testid="home-page">Home Page</div>;
const SignIn = () => <div data-testid="signin-page">Sign In Page</div>;
const SignUp = () => <div data-testid="signup-page">Sign Up Page</div>;
const DoctorDashboard = () => <div data-testid="doctor-dashboard">Doctor Dashboard</div>;
const PatientDashboard = () => <div data-testid="patient-dashboard">Patient Dashboard</div>;
const DoctorProfile = () => <div data-testid="doctor-profile">Doctor Profile</div>;
const BookAppointment = () => <div data-testid="book-appointment">Book Appointment</div>;
const DoctorsTab = () => <div data-testid="doctors-tab">Doctors Tab</div>;
const RescheduleAppointment = () => <div data-testid="reschedule-appointment">Reschedule Appointment</div>;
const Appointments = () => <div data-testid="appointments-page">Appointments Page</div>;
const PrakritiVikritiForm = () => <div data-testid="dosha-form">Dosha Assessment Form</div>;
const PatientProfile = () => <div data-testid="patient-profile">Patient Profile</div>;

// Test App component that mirrors the real App routes
function TestApp() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/signin"
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />

      <Route
        path="/doctor-dashboard"
        element={
          <ProtectedRoute doctorOnly>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/:id"
        element={
          <ProtectedRoute>
            <DoctorProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dosha-assessment"
        element={
          <ProtectedRoute>
            <PrakritiVikritiForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor"
        element={
          <ProtectedRoute>
            <DoctorsTab />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/patient/:id"
        element={
          <ProtectedRoute doctorOnly={true}>
            <PatientProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/book-appointment/:id"
        element={
          <ProtectedRoute>
            <BookAppointment />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/profile/:id"
        element={
          <ProtectedRoute>
            <PatientProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient-dashboard"
        element={
          <ProtectedRoute>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/RescheduleAppointment/:id"
        element={
          <ProtectedRoute>
            <RescheduleAppointment />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Create user reducer
const createUserReducer = (initialState) => (state = initialState) => state;

// Helper to render App with specific route and user state
function renderApp(route, userState) {
  const store = configureStore({
    reducer: {
      user: createUserReducer(userState),
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <TestApp />
      </MemoryRouter>
    </Provider>
  );
}

// User states for testing
const unauthenticatedUser = {
  isAuthenticated: false,
  isDoctor: null,
  userProfile: null,
  screenLoading: false,
};

const authenticatedPatient = {
  isAuthenticated: true,
  isDoctor: false,
  userProfile: { id: "patient1", Name: "Test Patient" },
  screenLoading: false,
};

const authenticatedDoctor = {
  isAuthenticated: true,
  isDoctor: true,
  userProfile: { id: "doctor1", Name: "Dr. Test" },
  screenLoading: false,
};

const loadingUser = {
  isAuthenticated: false,
  isDoctor: null,
  userProfile: null,
  screenLoading: true,
};

describe("App Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Public Routes", () => {
    describe("Home Page (/)", () => {
      it("renders home page for unauthenticated users", () => {
        renderApp("/", unauthenticatedUser);
        expect(screen.getByTestId("home-page")).toBeInTheDocument();
      });

      it("renders home page for authenticated patients", () => {
        renderApp("/", authenticatedPatient);
        expect(screen.getByTestId("home-page")).toBeInTheDocument();
      });

      it("renders home page for authenticated doctors", () => {
        renderApp("/", authenticatedDoctor);
        expect(screen.getByTestId("home-page")).toBeInTheDocument();
      });
    });

    describe("Sign In Page (/signin)", () => {
      it("renders sign in page for unauthenticated users", () => {
        renderApp("/signin", unauthenticatedUser);
        expect(screen.getByTestId("signin-page")).toBeInTheDocument();
      });

      it("redirects authenticated patient to patient dashboard", () => {
        renderApp("/signin", authenticatedPatient);
        expect(screen.queryByTestId("signin-page")).not.toBeInTheDocument();
        expect(screen.getByTestId("patient-dashboard")).toBeInTheDocument();
      });

      it("redirects authenticated doctor to doctor dashboard", () => {
        renderApp("/signin", authenticatedDoctor);
        expect(screen.queryByTestId("signin-page")).not.toBeInTheDocument();
        expect(screen.getByTestId("doctor-dashboard")).toBeInTheDocument();
      });
    });

    describe("Sign Up Page (/signup)", () => {
      it("renders sign up page for unauthenticated users", () => {
        renderApp("/signup", unauthenticatedUser);
        expect(screen.getByTestId("signup-page")).toBeInTheDocument();
      });

      it("redirects authenticated patient to patient dashboard", () => {
        renderApp("/signup", authenticatedPatient);
        expect(screen.queryByTestId("signup-page")).not.toBeInTheDocument();
        expect(screen.getByTestId("patient-dashboard")).toBeInTheDocument();
      });

      it("redirects authenticated doctor to doctor dashboard", () => {
        renderApp("/signup", authenticatedDoctor);
        expect(screen.queryByTestId("signup-page")).not.toBeInTheDocument();
        expect(screen.getByTestId("doctor-dashboard")).toBeInTheDocument();
      });
    });
  });

  describe("Protected Routes - Doctor Only", () => {
    describe("Doctor Dashboard (/doctor-dashboard)", () => {
      it("redirects unauthenticated users to signin", () => {
        renderApp("/doctor-dashboard", unauthenticatedUser);
        expect(screen.queryByTestId("doctor-dashboard")).not.toBeInTheDocument();
        expect(screen.getByTestId("signin-page")).toBeInTheDocument();
      });

      it("redirects authenticated patient to patient dashboard", () => {
        renderApp("/doctor-dashboard", authenticatedPatient);
        expect(screen.queryByTestId("doctor-dashboard")).not.toBeInTheDocument();
        expect(screen.getByTestId("patient-dashboard")).toBeInTheDocument();
      });

      it("renders doctor dashboard for authenticated doctor", () => {
        renderApp("/doctor-dashboard", authenticatedDoctor);
        expect(screen.getByTestId("doctor-dashboard")).toBeInTheDocument();
      });
    });

    describe("Doctor Patient Profile (/doctor/patient/:id)", () => {
      it("redirects unauthenticated users to signin", () => {
        renderApp("/doctor/patient/123", unauthenticatedUser);
        expect(screen.queryByTestId("patient-profile")).not.toBeInTheDocument();
        expect(screen.getByTestId("signin-page")).toBeInTheDocument();
      });

      it("redirects authenticated patient to patient dashboard", () => {
        renderApp("/doctor/patient/123", authenticatedPatient);
        expect(screen.queryByTestId("patient-profile")).not.toBeInTheDocument();
        expect(screen.getByTestId("patient-dashboard")).toBeInTheDocument();
      });

      it("renders patient profile for authenticated doctor", () => {
        renderApp("/doctor/patient/123", authenticatedDoctor);
        expect(screen.getByTestId("patient-profile")).toBeInTheDocument();
      });
    });
  });

  describe("Protected Routes - Patient Routes", () => {
    describe("Patient Dashboard (/patient-dashboard)", () => {
      it("redirects unauthenticated users to signin", () => {
        renderApp("/patient-dashboard", unauthenticatedUser);
        expect(
          screen.queryByTestId("patient-dashboard")
        ).not.toBeInTheDocument();
        expect(screen.getByTestId("signin-page")).toBeInTheDocument();
      });

      it("renders patient dashboard for authenticated patient", () => {
        renderApp("/patient-dashboard", authenticatedPatient);
        expect(screen.getByTestId("patient-dashboard")).toBeInTheDocument();
      });

      it("redirects authenticated doctor to doctor dashboard", () => {
        renderApp("/patient-dashboard", authenticatedDoctor);
        expect(
          screen.queryByTestId("patient-dashboard")
        ).not.toBeInTheDocument();
        expect(screen.getByTestId("doctor-dashboard")).toBeInTheDocument();
      });
    });

    describe("Doctor Profile (/doctor/:id)", () => {
      it("redirects unauthenticated users to signin", () => {
        renderApp("/doctor/123", unauthenticatedUser);
        expect(screen.queryByTestId("doctor-profile")).not.toBeInTheDocument();
        expect(screen.getByTestId("signin-page")).toBeInTheDocument();
      });

      it("renders doctor profile for authenticated patient", () => {
        renderApp("/doctor/123", authenticatedPatient);
        expect(screen.getByTestId("doctor-profile")).toBeInTheDocument();
      });

      it("redirects authenticated doctor to doctor dashboard", () => {
        renderApp("/doctor/123", authenticatedDoctor);
        expect(screen.queryByTestId("doctor-profile")).not.toBeInTheDocument();
        expect(screen.getByTestId("doctor-dashboard")).toBeInTheDocument();
      });
    });

    describe("Doctors Tab (/doctor)", () => {
      it("redirects unauthenticated users to signin", () => {
        renderApp("/doctor", unauthenticatedUser);
        expect(screen.queryByTestId("doctors-tab")).not.toBeInTheDocument();
        expect(screen.getByTestId("signin-page")).toBeInTheDocument();
      });

      it("renders doctors tab for authenticated patient", () => {
        renderApp("/doctor", authenticatedPatient);
        expect(screen.getByTestId("doctors-tab")).toBeInTheDocument();
      });

      it("redirects authenticated doctor to doctor dashboard", () => {
        renderApp("/doctor", authenticatedDoctor);
        expect(screen.queryByTestId("doctors-tab")).not.toBeInTheDocument();
        expect(screen.getByTestId("doctor-dashboard")).toBeInTheDocument();
      });
    });

    describe("Book Appointment (/book-appointment/:id)", () => {
      it("redirects unauthenticated users to signin", () => {
        renderApp("/book-appointment/123", unauthenticatedUser);
        expect(screen.queryByTestId("book-appointment")).not.toBeInTheDocument();
        expect(screen.getByTestId("signin-page")).toBeInTheDocument();
      });

      it("renders book appointment for authenticated patient", () => {
        renderApp("/book-appointment/123", authenticatedPatient);
        expect(screen.getByTestId("book-appointment")).toBeInTheDocument();
      });

      it("redirects authenticated doctor to doctor dashboard", () => {
        renderApp("/book-appointment/123", authenticatedDoctor);
        expect(screen.queryByTestId("book-appointment")).not.toBeInTheDocument();
        expect(screen.getByTestId("doctor-dashboard")).toBeInTheDocument();
      });
    });

    describe("Appointments (/appointments)", () => {
      it("redirects unauthenticated users to signin", () => {
        renderApp("/appointments", unauthenticatedUser);
        expect(
          screen.queryByTestId("appointments-page")
        ).not.toBeInTheDocument();
        expect(screen.getByTestId("signin-page")).toBeInTheDocument();
      });

      it("renders appointments for authenticated patient", () => {
        renderApp("/appointments", authenticatedPatient);
        expect(screen.getByTestId("appointments-page")).toBeInTheDocument();
      });

      it("redirects authenticated doctor to doctor dashboard", () => {
        renderApp("/appointments", authenticatedDoctor);
        expect(
          screen.queryByTestId("appointments-page")
        ).not.toBeInTheDocument();
        expect(screen.getByTestId("doctor-dashboard")).toBeInTheDocument();
      });
    });

    describe("Reschedule Appointment (/RescheduleAppointment/:id)", () => {
      it("redirects unauthenticated users to signin", () => {
        renderApp("/RescheduleAppointment/123", unauthenticatedUser);
        expect(
          screen.queryByTestId("reschedule-appointment")
        ).not.toBeInTheDocument();
        expect(screen.getByTestId("signin-page")).toBeInTheDocument();
      });

      it("renders reschedule appointment for authenticated patient", () => {
        renderApp("/RescheduleAppointment/123", authenticatedPatient);
        expect(
          screen.getByTestId("reschedule-appointment")
        ).toBeInTheDocument();
      });

      it("redirects authenticated doctor to doctor dashboard", () => {
        renderApp("/RescheduleAppointment/123", authenticatedDoctor);
        expect(
          screen.queryByTestId("reschedule-appointment")
        ).not.toBeInTheDocument();
        expect(screen.getByTestId("doctor-dashboard")).toBeInTheDocument();
      });
    });

    describe("Dosha Assessment (/dosha-assessment)", () => {
      it("redirects unauthenticated users to signin", () => {
        renderApp("/dosha-assessment", unauthenticatedUser);
        expect(screen.queryByTestId("dosha-form")).not.toBeInTheDocument();
        expect(screen.getByTestId("signin-page")).toBeInTheDocument();
      });

      it("renders dosha form for authenticated patient", () => {
        renderApp("/dosha-assessment", authenticatedPatient);
        expect(screen.getByTestId("dosha-form")).toBeInTheDocument();
      });

      it("redirects authenticated doctor to doctor dashboard", () => {
        renderApp("/dosha-assessment", authenticatedDoctor);
        expect(screen.queryByTestId("dosha-form")).not.toBeInTheDocument();
        expect(screen.getByTestId("doctor-dashboard")).toBeInTheDocument();
      });
    });

    describe("Patient Profile (/patient/profile/:id)", () => {
      it("redirects unauthenticated users to signin", () => {
        renderApp("/patient/profile/123", unauthenticatedUser);
        expect(screen.queryByTestId("patient-profile")).not.toBeInTheDocument();
        expect(screen.getByTestId("signin-page")).toBeInTheDocument();
      });

      it("renders patient profile for authenticated patient", () => {
        renderApp("/patient/profile/123", authenticatedPatient);
        expect(screen.getByTestId("patient-profile")).toBeInTheDocument();
      });

      it("redirects authenticated doctor to doctor dashboard", () => {
        renderApp("/patient/profile/123", authenticatedDoctor);
        expect(screen.queryByTestId("patient-profile")).not.toBeInTheDocument();
        expect(screen.getByTestId("doctor-dashboard")).toBeInTheDocument();
      });
    });
  });

  describe("Dashboard Redirect (/dashboard)", () => {
    it("redirects unauthenticated users to signin", () => {
      renderApp("/dashboard", unauthenticatedUser);
      expect(screen.getByTestId("signin-page")).toBeInTheDocument();
    });

    it("redirects authenticated patient to patient dashboard", () => {
      renderApp("/dashboard", authenticatedPatient);
      expect(screen.getByTestId("patient-dashboard")).toBeInTheDocument();
    });

    it("redirects authenticated doctor to doctor dashboard", () => {
      renderApp("/dashboard", authenticatedDoctor);
      expect(screen.getByTestId("doctor-dashboard")).toBeInTheDocument();
    });
  });

  describe("Catch-All Route (*)", () => {
    it("redirects unknown routes to home page", () => {
      renderApp("/unknown-route", unauthenticatedUser);
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
    });

    it("redirects deeply nested unknown routes to home page", () => {
      renderApp("/some/unknown/deep/route", unauthenticatedUser);
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("shows loading message when screenLoading is true", () => {
      renderApp("/doctor-dashboard", loadingUser);
      expect(
        screen.getByText("Checking authentication...")
      ).toBeInTheDocument();
    });
  });

  describe("Null User State", () => {
    it("redirects to signin when user state is null", () => {
      const store = configureStore({
        reducer: {
          user: () => null,
        },
      });

      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/doctor-dashboard"]}>
            <App />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId("signin-page")).toBeInTheDocument();
    });
  });
});
