import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import doctorReducer from "./doctor.slice";
import {
  single_patient,
  Cancel_appointments,
  conformationappointment,
  myPatient,
} from "./doctor.thunk";

// Create a mock axios instance
const mockAxios = new MockAdapter(axios);

// Mock the axiosInstance module
vi.mock("../../axios/url.axios", () => {
  return {
    axiosInstance: {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn(),
    },
  };
});

// Import the mocked axiosInstance
import { axiosInstance } from "../../axios/url.axios";

describe("Doctor Redux Thunks", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        doctor: doctorReducer,
      },
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe("single_patient thunk", () => {
    const mockPatientData = {
      patient: {
        _id: "patient123",
        Name: "John Doe",
        Email: "john@example.com",
        Age: 35,
        Gender: "Male",
        Height: 175,
        Weight: 70,
        Dosha: {
          doshaAssessment: {
            prakriti: { vata: 30, pitta: 45, kapha: 25 },
            vikriti: { vata: 35, pitta: 40, kapha: 25 },
            dominantPrakriti: "pitta",
            dominantVikriti: "pitta",
          },
        },
        Medical_records: [],
      },
    };

    it("should dispatch pending and fulfilled actions on successful API call", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockPatientData });

      const result = await store.dispatch(single_patient("patient123"));

      expect(result.type).toBe("doctor/singlePatient/fulfilled");
      expect(result.payload).toEqual(mockPatientData);

      const state = store.getState().doctor;
      expect(state.loading).toBe(false);
      expect(state.singlePatient).toEqual(mockPatientData.patient);
      expect(state.error).toBeNull();
    });

    it("should call the correct API endpoint with patient id", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockPatientData });

      await store.dispatch(single_patient("patient123"));

      expect(axiosInstance.get).toHaveBeenCalledWith("/doctor/patient/patient123");
    });

    it("should dispatch rejected action on API failure", async () => {
      const errorMessage = "Patient not found";
      axiosInstance.get.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      const result = await store.dispatch(single_patient("invalid-id"));

      expect(result.type).toBe("doctor/singlePatient/rejected");
      expect(result.payload).toBe(errorMessage);

      const state = store.getState().doctor;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it("should handle network errors gracefully", async () => {
      axiosInstance.get.mockRejectedValueOnce(new Error("Network Error"));

      const result = await store.dispatch(single_patient("patient123"));

      expect(result.type).toBe("doctor/singlePatient/rejected");
      expect(result.payload).toBe("Network Error");
    });

    it("should set loading to true while pending", async () => {
      // Create a promise that we can control
      let resolvePromise;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      axiosInstance.get.mockReturnValueOnce(pendingPromise);

      // Start the dispatch but don't await it
      const dispatchPromise = store.dispatch(single_patient("patient123"));

      // Check loading state is true
      expect(store.getState().doctor.loading).toBe(true);

      // Resolve the promise to clean up
      resolvePromise({ data: mockPatientData });
      await dispatchPromise;
    });
  });

  describe("Cancel_appointments thunk", () => {
    const mockDeleteResponse = {
      success: true,
      patient: {
        _id: "apt123",
        Status: "Cancelled",
      },
    };

    it("should dispatch pending and fulfilled actions on successful deletion", async () => {
      axiosInstance.delete.mockResolvedValueOnce({ data: mockDeleteResponse });

      const result = await store.dispatch(Cancel_appointments("apt123"));

      expect(result.type).toBe("doctor/cancel_appoinments/fulfilled");
      expect(result.payload).toEqual(mockDeleteResponse);

      const state = store.getState().doctor;
      expect(state.loading).toBe(false);
      expect(state.cancelAppointments).toEqual(mockDeleteResponse.patient);
    });

    it("should call the correct API endpoint with appointment id", async () => {
      axiosInstance.delete.mockResolvedValueOnce({ data: mockDeleteResponse });

      await store.dispatch(Cancel_appointments("apt123"));

      expect(axiosInstance.delete).toHaveBeenCalledWith(
        "/doctor/deleteappointment/apt123"
      );
    });

    it("should dispatch rejected action on API failure", async () => {
      const errorMessage = "Appointment not found";
      axiosInstance.delete.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      const result = await store.dispatch(Cancel_appointments("invalid-id"));

      expect(result.type).toBe("doctor/cancel_appoinments/rejected");
      expect(result.payload).toBe(errorMessage);

      const state = store.getState().doctor;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it("should handle server errors", async () => {
      axiosInstance.delete.mockRejectedValueOnce({
        response: { status: 500, data: { message: "Internal Server Error" } },
      });

      const result = await store.dispatch(Cancel_appointments("apt123"));

      expect(result.type).toBe("doctor/cancel_appoinments/rejected");
      expect(result.payload).toBe("Internal Server Error");
    });

    it("should handle network errors", async () => {
      axiosInstance.delete.mockRejectedValueOnce(new Error("Network Error"));

      const result = await store.dispatch(Cancel_appointments("apt123"));

      expect(result.type).toBe("doctor/cancel_appoinments/rejected");
      expect(result.payload).toBe("Network Error");
    });
  });

  describe("conformationappointment thunk", () => {
    const mockStatusUpdateResponse = {
      success: true,
      patient: {
        _id: "apt123",
        Status: "Accepted",
      },
    };

    it("should dispatch pending and fulfilled actions on successful status update", async () => {
      axiosInstance.post.mockResolvedValueOnce({
        data: mockStatusUpdateResponse,
      });

      const result = await store.dispatch(
        conformationappointment({ id: "apt123", Status: "Accepted" })
      );

      expect(result.type).toBe("doctor/conformationappointment/fulfilled");
      expect(result.payload).toEqual(mockStatusUpdateResponse);

      const state = store.getState().doctor;
      expect(state.loading).toBe(false);
      expect(state.statusappointment).toEqual(mockStatusUpdateResponse.patient);
    });

    it("should call the correct API endpoint with id and status", async () => {
      axiosInstance.post.mockResolvedValueOnce({
        data: mockStatusUpdateResponse,
      });

      await store.dispatch(
        conformationappointment({ id: "apt123", Status: "Accepted" })
      );

      expect(axiosInstance.post).toHaveBeenCalledWith(
        "/doctor/appointment/apt123",
        { Status: "Accepted" }
      );
    });

    it("should handle Accept status update", async () => {
      const acceptResponse = {
        success: true,
        patient: { _id: "apt123", Status: "Accepted" },
      };
      axiosInstance.post.mockResolvedValueOnce({ data: acceptResponse });

      const result = await store.dispatch(
        conformationappointment({ id: "apt123", Status: "Accepted" })
      );

      expect(result.payload.patient.Status).toBe("Accepted");
    });

    it("should handle Reject status update", async () => {
      const rejectResponse = {
        success: true,
        patient: { _id: "apt123", Status: "Rejected" },
      };
      axiosInstance.post.mockResolvedValueOnce({ data: rejectResponse });

      const result = await store.dispatch(
        conformationappointment({ id: "apt123", Status: "Rejected" })
      );

      expect(result.payload.patient.Status).toBe("Rejected");
    });

    it("should dispatch rejected action on API failure", async () => {
      const errorMessage = "Failed to update status";
      axiosInstance.post.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      const result = await store.dispatch(
        conformationappointment({ id: "apt123", Status: "Accepted" })
      );

      expect(result.type).toBe("doctor/conformationappointment/rejected");
      expect(result.payload).toBe(errorMessage);

      const state = store.getState().doctor;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it("should handle unauthorized errors", async () => {
      axiosInstance.post.mockRejectedValueOnce({
        response: { status: 401, data: { message: "Unauthorized" } },
      });

      const result = await store.dispatch(
        conformationappointment({ id: "apt123", Status: "Accepted" })
      );

      expect(result.type).toBe("doctor/conformationappointment/rejected");
      expect(result.payload).toBe("Unauthorized");
    });
  });

  describe("myPatient thunk", () => {
    const mockAppointmentsData = {
      patient: [
        {
          _id: "apt1",
          Patient_id: { _id: "p1", Name: "John Doe" },
          Status: "Pending",
        },
        {
          _id: "apt2",
          Patient_id: { _id: "p2", Name: "Jane Smith" },
          Status: "Accepted",
        },
      ],
    };

    it("should dispatch pending and fulfilled actions on successful fetch", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockAppointmentsData });

      const result = await store.dispatch(myPatient());

      expect(result.type).toBe("doctor/mypatient/fulfilled");
      expect(result.payload).toEqual(mockAppointmentsData);

      const state = store.getState().doctor;
      expect(state.loading).toBe(false);
      expect(state.appointment).toEqual(mockAppointmentsData.patient);
      expect(state.error).toBeNull();
    });

    it("should call the correct API endpoint", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockAppointmentsData });

      await store.dispatch(myPatient());

      expect(axiosInstance.get).toHaveBeenCalledWith("/doctor/mypatient");
    });

    it("should dispatch rejected action on API failure", async () => {
      const errorMessage = "Failed to fetch patients";
      axiosInstance.get.mockRejectedValueOnce({
        response: { data: errorMessage },
      });

      const result = await store.dispatch(myPatient());

      expect(result.type).toBe("doctor/mypatient/rejected");
    });

    it("should handle empty appointments list", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: { patient: [] } });

      const result = await store.dispatch(myPatient());

      expect(result.type).toBe("doctor/mypatient/fulfilled");
      expect(store.getState().doctor.appointment).toEqual([]);
    });
  });

  describe("Redux Store State Updates", () => {
    it("should reset loading state after successful operation", async () => {
      axiosInstance.get.mockResolvedValueOnce({
        data: {
          patient: {
            _id: "123",
            Name: "Test",
          },
        },
      });

      await store.dispatch(single_patient("123"));

      expect(store.getState().doctor.loading).toBe(false);
    });

    it("should reset loading state after failed operation", async () => {
      axiosInstance.get.mockRejectedValueOnce(new Error("API Error"));

      await store.dispatch(single_patient("123"));

      expect(store.getState().doctor.loading).toBe(false);
    });

    it("should update error state on failure", async () => {
      const errorMessage = "Something went wrong";
      axiosInstance.get.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await store.dispatch(single_patient("123"));

      expect(store.getState().doctor.error).toBe(errorMessage);
    });

    it("should clear previous patient data when fetching new patient", async () => {
      // First fetch
      axiosInstance.get.mockResolvedValueOnce({
        data: { patient: { _id: "123", Name: "First Patient" } },
      });
      await store.dispatch(single_patient("123"));
      expect(store.getState().doctor.singlePatient.Name).toBe("First Patient");

      // Second fetch
      axiosInstance.get.mockResolvedValueOnce({
        data: { patient: { _id: "456", Name: "Second Patient" } },
      });
      await store.dispatch(single_patient("456"));
      expect(store.getState().doctor.singlePatient.Name).toBe("Second Patient");
    });
  });

  describe("Error Handling Edge Cases", () => {
    it("should handle undefined error response", async () => {
      axiosInstance.get.mockRejectedValueOnce({});

      const result = await store.dispatch(single_patient("123"));

      expect(result.type).toBe("doctor/singlePatient/rejected");
    });

    it("should handle null error data", async () => {
      axiosInstance.delete.mockRejectedValueOnce({
        response: { data: null },
      });

      const result = await store.dispatch(Cancel_appointments("123"));

      expect(result.type).toBe("doctor/cancel_appoinments/rejected");
    });

    it("should extract message from various error formats", async () => {
      // Test error.response.data.message format
      axiosInstance.post.mockRejectedValueOnce({
        response: { data: { message: "Specific error message" } },
      });

      const result = await store.dispatch(
        conformationappointment({ id: "123", Status: "Accepted" })
      );

      expect(result.payload).toBe("Specific error message");
    });
  });
});
