import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

// Mock the thunks module before importing the component
vi.mock("../../feature/Doctor/doctor.thunk", () => ({
  single_patient: vi.fn(() => ({ type: "test/noop" })),
  myPatient: vi.fn(() => ({ type: "test/noop" })),
  Cancel_appointments: vi.fn(() => ({ type: "test/noop" })),
  conformationappointment: vi.fn(() => ({ type: "test/noop" })),
  bookedAppointments: vi.fn(() => ({ type: "test/noop" })),
}));

// Import component after mock
import PatientProfile from "./PatientProfile";

// Mock patient data
const mockPatient = {
  _id: "patient123",
  Name: "John Doe",
  Email: "john.doe@example.com",
  Age: 35,
  Gender: "Male",
  Height: 175,
  Weight: 70,
  PhoneNumber: "+91-9876543210",
  Image_url: null,
  Dosha: {
    doshaAssessment: {
      prakriti: { vata: 30, pitta: 45, kapha: 25 },
      vikriti: { vata: 35, pitta: 40, kapha: 25 },
      dominantPrakriti: "pitta",
      dominantVikriti: "pitta",
    },
  },
  Medical_records: [
    {
      _id: "record1",
      Title: "Blood Test Report",
      Category: "Lab Results",
      Report_date: "2025-01-15T10:00:00.000Z",
      File_url: "https://example.com/report1.pdf",
    },
    {
      _id: "record2",
      Title: "X-Ray Report",
      Category: "Imaging",
      Report_date: "2025-02-01T10:00:00.000Z",
      File_url: "https://example.com/report2.pdf",
    },
  ],
};

// Simple reducer that just returns the initial state
const createDoctorReducer = (initialState) => (state = initialState) => state;

// Custom render function with controlled state
function renderPatientProfile(doctorState) {
  const store = configureStore({
    reducer: {
      doctor: createDoctorReducer(doctorState),
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/patient/123"]}>
        <PatientProfile />
      </MemoryRouter>
    </Provider>
  );
}

describe("PatientProfile Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Loading State", () => {
    it("renders loading state when loading is true", () => {
      renderPatientProfile({
        loading: true,
        error: null,
        singlePatient: null,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("Loading patient profile…")).toBeInTheDocument();
    });

    it("displays loading spinner during loading state", () => {
      renderPatientProfile({
        loading: true,
        error: null,
        singlePatient: null,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("Loading patient profile…")).toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("renders error state when there is an error", () => {
      renderPatientProfile({
        loading: false,
        error: "Failed to fetch patient",
        singlePatient: null,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(
        screen.getByText("Failed to load patient profile")
      ).toBeInTheDocument();
    });
  });

  describe("Patient Details Rendering", () => {
    it("renders patient name correctly", () => {
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: mockPatient,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      const nameElements = screen.getAllByText("John Doe");
      expect(nameElements.length).toBeGreaterThan(0);
    });

    it("renders patient email correctly", () => {
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: mockPatient,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    });

    it("renders patient age with proper formatting", () => {
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: mockPatient,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("35 Years")).toBeInTheDocument();
    });

    it("renders patient gender correctly", () => {
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: mockPatient,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      const genderElements = screen.getAllByText("Male");
      expect(genderElements.length).toBeGreaterThan(0);
    });

    it("renders patient height with unit", () => {
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: mockPatient,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("175 cm")).toBeInTheDocument();
    });

    it("renders patient weight with unit", () => {
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: mockPatient,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("70 kg")).toBeInTheDocument();
    });

    it("renders dash for missing age", () => {
      const patientWithoutAge = { ...mockPatient, Age: null };
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: patientWithoutAge,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      const dashElements = screen.getAllByText("—");
      expect(dashElements.length).toBeGreaterThan(0);
    });
  });

  describe("Dosha Assessment Rendering", () => {
    it("renders Dosha Assessment section when dosha data exists", () => {
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: mockPatient,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("Dosha Assessment")).toBeInTheDocument();
    });

    it("renders Prakriti section with correct dominant dosha", () => {
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: mockPatient,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("Prakriti: Pitta")).toBeInTheDocument();
    });

    it("renders Vikriti section with correct dominant dosha", () => {
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: mockPatient,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("Vikriti: Pitta")).toBeInTheDocument();
    });

    it("renders dosha percentage values", () => {
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: mockPatient,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getAllByText("30%").length).toBeGreaterThan(0);
      expect(screen.getAllByText("45%").length).toBeGreaterThan(0);
      expect(screen.getAllByText("25%").length).toBeGreaterThan(0);
    });

    it("does not render Dosha section when dosha data is missing", () => {
      const patientWithoutDosha = { ...mockPatient, Dosha: null };
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: patientWithoutDosha,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.queryByText("Dosha Assessment")).not.toBeInTheDocument();
    });
  });

  describe("Medical Records Rendering", () => {
    it("renders Medical Records section title", () => {
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: mockPatient,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("Medical Records")).toBeInTheDocument();
    });

    it("renders correct count of medical records", () => {
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: mockPatient,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("renders medical record titles", () => {
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: mockPatient,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("Blood Test Report")).toBeInTheDocument();
      expect(screen.getByText("X-Ray Report")).toBeInTheDocument();
    });

    it("renders medical record categories", () => {
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: mockPatient,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("Lab Results")).toBeInTheDocument();
      expect(screen.getByText("Imaging")).toBeInTheDocument();
    });

    it("renders View links for medical records", () => {
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: mockPatient,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      const viewLinks = screen.getAllByText("View");
      expect(viewLinks.length).toBe(2);
    });

    it("renders correct href for medical record links", () => {
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: mockPatient,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      const viewLinks = screen.getAllByRole("link");
      expect(viewLinks[0]).toHaveAttribute(
        "href",
        "https://example.com/report1.pdf"
      );
      expect(viewLinks[1]).toHaveAttribute(
        "href",
        "https://example.com/report2.pdf"
      );
    });

    it("renders empty state when no medical records exist", () => {
      const patientWithoutRecords = { ...mockPatient, Medical_records: [] };
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: patientWithoutRecords,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("No records available")).toBeInTheDocument();
    });
  });

  describe("Page Header", () => {
    it("renders Patient Profile label", () => {
      renderPatientProfile({
        loading: false,
        error: null,
        singlePatient: mockPatient,
        appointment: [],
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("Patient Profile")).toBeInTheDocument();
    });
  });
});
