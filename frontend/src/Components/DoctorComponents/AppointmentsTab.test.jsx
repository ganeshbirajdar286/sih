import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import toast from "react-hot-toast";

// Mock the thunks module
vi.mock("../../feature/Doctor/doctor.thunk", () => ({
  myPatient: vi.fn(() => ({ type: "test/noop" })),
  Cancel_appointments: vi.fn((id) => {
    const action = { type: "test/noop", payload: id };
    action.unwrap = () => Promise.resolve({ success: true });
    return action;
  }),
  conformationappointment: vi.fn((data) => {
    const action = { type: "test/noop", payload: data };
    action.unwrap = () => Promise.resolve({ success: true });
    return action;
  }),
  single_patient: vi.fn(() => ({ type: "test/noop" })),
  bookedAppointments: vi.fn(() => ({ type: "test/noop" })),
}));

// Import component and mocked thunks after mocks
import AppointmentsTab from "./AppointmentsTab";
import {
  myPatient,
  Cancel_appointments,
  conformationappointment,
} from "../../feature/Doctor/doctor.thunk";

// Mock appointments data
const mockAppointments = [
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

// Simple reducer that just returns the initial state
const createDoctorReducer = (initialState) => (state = initialState) => state;

// Custom render function with controlled state
function renderAppointmentsTab(doctorState) {
  const store = configureStore({
    reducer: {
      doctor: createDoctorReducer(doctorState),
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <AppointmentsTab />
      </MemoryRouter>
    </Provider>
  );
}

describe("AppointmentsTab Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial Rendering", () => {
    it("renders the appointments page with header", () => {
      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("Appointments")).toBeInTheDocument();
      expect(screen.getByText("Doctor Dashboard")).toBeInTheDocument();
    });

    it("renders all appointments when loaded", () => {
      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
      expect(screen.getByText("Carol Williams")).toBeInTheDocument();
    });

    it("displays correct appointment count", () => {
      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText(/3 total appointment/)).toBeInTheDocument();
    });

    it("fetches appointments on mount", () => {
      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: [],
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(myPatient).toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("shows loading indicator when loading is true", () => {
      renderAppointmentsTab({
        loading: true,
        error: null,
        appointment: [],
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("Loading appointments…")).toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("shows error message when there is an error", () => {
      renderAppointmentsTab({
        loading: false,
        error: "Failed to fetch appointments",
        appointment: [],
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(
        screen.getByText("Failed to fetch appointments")
      ).toBeInTheDocument();
    });

    it("shows generic error message for non-string errors", () => {
      renderAppointmentsTab({
        loading: false,
        error: { code: 500 },
        appointment: [],
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(
        screen.getByText("Failed to load appointments")
      ).toBeInTheDocument();
    });
  });

  describe("Search Filtering", () => {
    it("filters appointments by patient name", async () => {
      const user = userEvent.setup();

      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      const searchInput = screen.getByPlaceholderText(
        "Search by name, condition, status…"
      );
      await user.type(searchInput, "Alice");

      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
      expect(screen.queryByText("Bob Johnson")).not.toBeInTheDocument();
      expect(screen.queryByText("Carol Williams")).not.toBeInTheDocument();
    });

    it("filters appointments by condition", async () => {
      const user = userEvent.setup();

      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      const searchInput = screen.getByPlaceholderText(
        "Search by name, condition, status…"
      );
      await user.type(searchInput, "Headache");

      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
      expect(screen.queryByText("Bob Johnson")).not.toBeInTheDocument();
    });

    it("filters appointments by status", async () => {
      const user = userEvent.setup();

      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      const searchInput = screen.getByPlaceholderText(
        "Search by name, condition, status…"
      );
      await user.type(searchInput, "pending");

      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
      expect(screen.queryByText("Bob Johnson")).not.toBeInTheDocument();
    });

    it("shows empty state when no results match search", async () => {
      const user = userEvent.setup();

      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      const searchInput = screen.getByPlaceholderText(
        "Search by name, condition, status…"
      );
      await user.type(searchInput, "NonexistentPatient");

      expect(screen.getByText("No appointments found")).toBeInTheDocument();
      expect(
        screen.getByText('No results for "NonexistentPatient"')
      ).toBeInTheDocument();
    });

    it("is case-insensitive when searching", async () => {
      const user = userEvent.setup();

      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      const searchInput = screen.getByPlaceholderText(
        "Search by name, condition, status…"
      );
      await user.type(searchInput, "ALICE");

      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    });
  });

  describe("Status Pill Filtering", () => {
    it("shows all appointments when 'All' pill is selected", () => {
      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
      expect(screen.getByText("Carol Williams")).toBeInTheDocument();
    });

    it("filters to show only pending appointments", async () => {
      const user = userEvent.setup();

      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      const pendingPill = screen.getByRole("button", { name: /Pending/i });
      await user.click(pendingPill);

      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
      expect(screen.queryByText("Bob Johnson")).not.toBeInTheDocument();
      expect(screen.queryByText("Carol Williams")).not.toBeInTheDocument();
    });

    it("filters to show only confirmed appointments", async () => {
      const user = userEvent.setup();

      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      const confirmedPill = screen.getByRole("button", { name: /Confirmed/i });
      await user.click(confirmedPill);

      expect(screen.queryByText("Alice Smith")).not.toBeInTheDocument();
      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
      expect(screen.queryByText("Carol Williams")).not.toBeInTheDocument();
    });

    it("filters to show cancelled/rejected appointments", async () => {
      const user = userEvent.setup();

      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      const cancelledPill = screen.getByRole("button", { name: /Cancelled/i });
      await user.click(cancelledPill);

      expect(screen.queryByText("Alice Smith")).not.toBeInTheDocument();
      expect(screen.queryByText("Bob Johnson")).not.toBeInTheDocument();
      expect(screen.getByText("Carol Williams")).toBeInTheDocument();
    });

    it("displays correct count on each status pill", () => {
      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      const allPill = screen.getByRole("button", { name: /All/i });
      const pendingPill = screen.getByRole("button", { name: /Pending/i });
      const confirmedPill = screen.getByRole("button", { name: /Confirmed/i });
      const cancelledPill = screen.getByRole("button", { name: /Cancelled/i });

      expect(allPill).toHaveTextContent("3");
      expect(pendingPill).toHaveTextContent("1");
      expect(confirmedPill).toHaveTextContent("1");
      expect(cancelledPill).toHaveTextContent("1");
    });
  });

  describe("handleStatusUpdate Function", () => {
    it("dispatches conformationappointment action when Accept is clicked", async () => {
      const user = userEvent.setup();

      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      // Expand Alice's appointment
      const aliceCard = screen.getByText("Alice Smith").closest("div");
      await user.click(aliceCard);

      // Find and click Accept button
      const acceptButton = screen.getByRole("button", { name: /Accept/i });
      await user.click(acceptButton);

      await waitFor(() => {
        expect(conformationappointment).toHaveBeenCalledWith({
          id: "apt1",
          Status: "Accepted",
        });
      });
    });

    it("dispatches conformationappointment action when Reject is clicked", async () => {
      const user = userEvent.setup();

      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      // Expand Alice's appointment
      const aliceCard = screen.getByText("Alice Smith").closest("div");
      await user.click(aliceCard);

      // Find and click Reject button
      const rejectButton = screen.getByRole("button", { name: /Reject/i });
      await user.click(rejectButton);

      await waitFor(() => {
        expect(conformationappointment).toHaveBeenCalledWith({
          id: "apt1",
          Status: "Rejected",
        });
      });
    });

    it("shows toast notification after status update", async () => {
      const user = userEvent.setup();

      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      // Expand and accept
      const aliceCard = screen.getByText("Alice Smith").closest("div");
      await user.click(aliceCard);

      const acceptButton = screen.getByRole("button", { name: /Accept/i });
      await user.click(acceptButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("status updated");
      });
    });
  });

  describe("handleDelete Function", () => {
    it("dispatches Cancel_appointments action when Delete is clicked", async () => {
      const user = userEvent.setup();

      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      // Expand Alice's appointment
      const aliceCard = screen.getByText("Alice Smith").closest("div");
      await user.click(aliceCard);

      // Find and click Delete button
      const deleteButton = screen.getByRole("button", { name: /Delete/i });
      await user.click(deleteButton);

      await waitFor(() => {
        expect(Cancel_appointments).toHaveBeenCalledWith("apt1");
      });
    });

    it("removes appointment from UI after deletion", async () => {
      const user = userEvent.setup();

      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      // Expand and delete
      const aliceCard = screen.getByText("Alice Smith").closest("div");
      await user.click(aliceCard);

      const deleteButton = screen.getByRole("button", { name: /Delete/i });
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.queryByText("Alice Smith")).not.toBeInTheDocument();
      });
    });

    it("shows success toast after deletion", async () => {
      const user = userEvent.setup();

      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      // Expand and delete
      const aliceCard = screen.getByText("Alice Smith").closest("div");
      await user.click(aliceCard);

      const deleteButton = screen.getByRole("button", { name: /Delete/i });
      await user.click(deleteButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Appointment deleted");
      });
    });
  });

  describe("Appointment Card Expansion", () => {
    it("expands appointment details when clicked", async () => {
      const user = userEvent.setup();

      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      const aliceCard = screen.getByText("Alice Smith").closest("div");
      await user.click(aliceCard);

      expect(screen.getByText("Patient Info")).toBeInTheDocument();
      expect(screen.getByText("Appointment Details")).toBeInTheDocument();
      expect(screen.getByText("Quick Actions")).toBeInTheDocument();
    });

    it("collapses expanded appointment when clicked again", async () => {
      const user = userEvent.setup();

      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      const aliceCard = screen.getByText("Alice Smith").closest("div");

      // Expand
      await user.click(aliceCard);
      expect(screen.getByText("Patient Info")).toBeInTheDocument();

      // Collapse
      await user.click(aliceCard);
      expect(screen.queryByText("Patient Info")).not.toBeInTheDocument();
    });

    it("shows View Profile button in expanded state", async () => {
      const user = userEvent.setup();

      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      const aliceCard = screen.getByText("Alice Smith").closest("div");
      await user.click(aliceCard);

      expect(
        screen.getByRole("button", { name: /View Profile/i })
      ).toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("shows empty state message when no appointments exist", () => {
      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: [],
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      expect(screen.getByText("No appointments found")).toBeInTheDocument();
      expect(
        screen.getByText("No appointments scheduled yet.")
      ).toBeInTheDocument();
    });
  });

  describe("Sorting", () => {
    it("sorts appointments by date by default", () => {
      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      const sortSelect = screen.getByRole("combobox");
      expect(sortSelect).toHaveValue("date");
    });

    it("can change sort to name", async () => {
      const user = userEvent.setup();

      renderAppointmentsTab({
        loading: false,
        error: null,
        appointment: mockAppointments,
        singlePatient: null,
        cancelAppointments: null,
        statusappointment: null,
      });

      const sortSelect = screen.getByRole("combobox");
      await user.selectOptions(sortSelect, "name");

      expect(sortSelect).toHaveValue("name");
    });
  });
});
