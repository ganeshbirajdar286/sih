import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import patientReducer from "./patient.slice";
import {
  getReport,
  doctor,
  getSingleDoctor,
  BookingAppointments,
  getappointmentschedule,
  Cancel_appointments,
  DietChart,
  updateProfile,
} from "./patient.thunk";

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

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { axiosInstance } from "../../axios/url.axios";

describe("Patient Redux Thunks & Slice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        patient: patientReducer,
      },
    });
    vi.clearAllMocks();
  });

  describe("getReport thunk", () => {
    const mockReportData = {
      data: [{ _id: "r1", Title: "CBC Blood Report", Category: "Lab Reports" }],
    };

    it("should fetch patient reports successfully", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockReportData });

      const result = await store.dispatch(getReport());

      expect(result.type).toBe("patient/getreport/fulfilled");
      expect(axiosInstance.get).toHaveBeenCalledWith("/patient/getreport");

      const state = store.getState().patient;
      expect(state.loading).toBe(false);
    });

    it("should handle report fetch errors", async () => {
      const errorMessage = "Failed to fetch report";
      axiosInstance.get.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      const result = await store.dispatch(getReport());

      expect(result.type).toBe("patient/getreport/rejected");
      expect(result.payload).toBe(errorMessage);
    });
  });

  describe("doctor thunk", () => {
    const mockDoctors = [{ _id: "doc1", Name: "Dr. Smith", Specialization: "Ayurveda" }];

    it("should fetch all doctors successfully", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: { data: mockDoctors } });

      const result = await store.dispatch(doctor());

      expect(result.type).toBe("patient/doctor/fulfilled");
      expect(axiosInstance.get).toHaveBeenCalledWith("/patient/doctor");

      const state = store.getState().patient;
      expect(state.doctor).toEqual(mockDoctors);
    });
  });

  describe("getSingleDoctor thunk", () => {
    const mockDoctorProfile = { doctor: { _id: "doc1", Name: "Dr. Smith" } };

    it("should fetch single doctor details", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockDoctorProfile });

      const result = await store.dispatch(getSingleDoctor("doc1"));

      expect(result.type).toBe("patient/getSingleDoctor/fulfilled");
      expect(axiosInstance.get).toHaveBeenCalledWith("/patient/singledoctor/doc1");
    });
  });

  describe("BookingAppointments thunk", () => {
    const mockBookingResponse = { success: true, message: "Booked" };

    it("should book appointment successfully", async () => {
      axiosInstance.post.mockResolvedValueOnce({ data: mockBookingResponse });

      const result = await store.dispatch(
        BookingAppointments({
          id: "doc1",
          data: { Appointment_Date: "2025-03-01", Time_slot: "10:00 AM - 10:30 AM" },
        })
      );

      expect(result.type).toBe("patient/bookAppointments/fulfilled");
      expect(axiosInstance.post).toHaveBeenCalledWith("/appointment/patient/doc1", {
        Appointment_Date: "2025-03-01",
        Time_slot: "10:00 AM - 10:30 AM",
      });
    });
  });

  describe("getappointmentschedule thunk", () => {
    const mockSchedule = { appointments: [{ _id: "apt1", Status: "Confirmed" }] };

    it("should fetch appointment schedule", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockSchedule });

      const result = await store.dispatch(getappointmentschedule());

      expect(result.type).toBe("patient/getappointmentschedule/fulfilled");
      expect(axiosInstance.get).toHaveBeenCalledWith("/patient/schedule");
    });
  });

  describe("Cancel_appointments thunk", () => {
    const mockCancelResponse = { data: { _id: "apt1" } };

    it("should cancel appointment", async () => {
      axiosInstance.delete.mockResolvedValueOnce({ data: mockCancelResponse });

      const result = await store.dispatch(Cancel_appointments("apt1"));

      expect(result.type).toBe("patient/cancel_appoinments/fulfilled");
      expect(axiosInstance.delete).toHaveBeenCalledWith("/patient/deleteappointment/apt1");
    });
  });

  describe("DietChart thunk", () => {
    const mockDietChart = { dietchart: { _id: "dc1", PlanName: "Vata Balancing" } };

    it("should fetch patient diet chart", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockDietChart });

      const result = await store.dispatch(DietChart());

      expect(result.type).toBe("patient/Dietchart/fulfilled");
      expect(axiosInstance.get).toHaveBeenCalledWith("/patient/dietchart");
    });
  });

  describe("updateProfile thunk", () => {
    const mockProfileData = { user: { Name: "John Updated", Age: 36 } };

    it("should update patient profile", async () => {
      axiosInstance.post.mockResolvedValueOnce({ data: mockProfileData });

      const result = await store.dispatch(updateProfile(mockProfileData.user));

      expect(result.type).toBe("patient/updateprofile/fulfilled");
      expect(axiosInstance.post).toHaveBeenCalledWith("/update/patientprofile", mockProfileData.user);
    });
  });
});
