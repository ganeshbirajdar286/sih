import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import doctorReducer from "./feature/Doctor/doctor.slice";

/**
 * Creates a test store with optional preloaded state
 */
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      doctor: doctorReducer,
    },
    preloadedState,
  });
}

/**
 * Custom render function that wraps components with Redux Provider and Router
 */
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    route = "/",
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Sample mock data for tests
export const mockPatient = {
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

export const mockAppointments = [
  {
    _id: "apt1",
    Patient_id: {
      _id: "patient1",
      Name: "Alice Smith",
      Email: "alice@example.com",
      Age: 28,
      PhoneNumber: "+91-1234567890",
      Image_url: null,
    },
    Appointment_Date: "2025-02-20T10:00:00.000Z",
    Time_slot: "10:00 AM - 10:30 AM",
    Status: "Pending",
    Condition: "Headache",
  },
  {
    _id: "apt2",
    Patient_id: {
      _id: "patient2",
      Name: "Bob Johnson",
      Email: "bob@example.com",
      Age: 45,
      PhoneNumber: "+91-9876543210",
      Image_url: null,
    },
    Appointment_Date: "2025-02-21T14:00:00.000Z",
    Time_slot: "2:00 PM - 2:30 PM",
    Status: "Accepted",
    Condition: "Back pain",
  },
  {
    _id: "apt3",
    Patient_id: {
      _id: "patient3",
      Name: "Carol Williams",
      Email: "carol@example.com",
      Age: 32,
      PhoneNumber: "+91-5555555555",
      Image_url: null,
    },
    Appointment_Date: "2025-02-22T09:00:00.000Z",
    Time_slot: "9:00 AM - 9:30 AM",
    Status: "Rejected",
    Condition: "Fever",
  },
];
